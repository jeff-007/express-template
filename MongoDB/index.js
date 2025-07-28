// MongoDB/index.js
const mongoose = require('mongoose')

class DatabaseManager {
  constructor() {
    this.isConnected = false
    this.isConnecting = false
  }

  // 按需连接数据库
  async connect(uri, options = {}) {
    // 如果已经连接，直接返回
    if (this.isConnected) {
      return Promise.resolve()
    }

    // 如果正在连接中，返回同一个 Promise
    if (this.isConnecting) {
      return this.connectingPromise
    }

    // 设置连接状态
    this.isConnecting = true
    
    const dbUri = uri || process.env.MONGODB_URI

    // 创建连接 Promise
    this.connectingPromise = mongoose.connect(
      dbUri,
      {
        ...options,
        // 现代 Mongoose 不再需要这些选项
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // 建议添加的连接选项
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000, // 添加连接超时
      }
    ).then(() => {
      this.isConnected = true
      this.isConnecting = false
      
      // 设置连接事件监听器
      this.setupEventListeners()
      
      console.log('数据库连接成功')
    }).catch((err) => {
      this.isConnecting = false
      console.error('数据库连接失败:', err)
      throw err
    })

    // 添加超时控制
    return Promise.race([
      this.connectingPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('数据库连接超时')), 10000)
      )
    ])
  }

  // 设置事件监听器
  setupEventListeners() {
    mongoose.connection.on('error', (err) => {
      console.error('数据库连接错误:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('数据库连接断开')
      this.isConnected = false
    })

    mongoose.connection.on('reconnected', () => {
      console.log('数据库重新连接成功')
      this.isConnected = true
    })
  }

  // 断开连接
  async disconnect() {
    if (this.isConnected) {
      await mongoose.connection.close()
      this.isConnected = false
      console.log('数据库连接已关闭')
    }
  }

  // 优雅关闭
  gracefulShutdown(signal) {
    return async () => {
      console.log(`${signal} 信号被捕获，开始优雅关闭`)
      
      try {
        await this.disconnect()
        console.log('数据库连接已安全关闭')
        process.exit(0)
      } catch (err) {
        console.error('关闭数据库连接时出错:', err)
        process.exit(1)
      }
    }
  }

  // 获取连接状态
  getStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting
    }
  }
}

// 创建单例实例
const dbManager = new DatabaseManager()

// 监听进程退出事件
process.on('SIGINT', dbManager.gracefulShutdown('SIGINT'))
process.on('SIGTERM', dbManager.gracefulShutdown('SIGTERM'))

// 应用启动后在后台预热数据库连接
setImmediate(async () => {
  try {
    // 延迟100ms执行，确保应用已启动
    await new Promise(resolve => setTimeout(resolve, 100))
    await dbManager.connect()
    console.log('数据库连接预热完成')
  } catch (err) {
    console.warn('数据库预热连接失败:', err)
    // 不影响应用启动，仅记录警告
  }
})

module.exports = {
  connect: dbManager.connect.bind(dbManager),
  disconnect: dbManager.disconnect.bind(dbManager),
  gracefulShutdown: dbManager.gracefulShutdown.bind(dbManager),
  getStatus: dbManager.getStatus.bind(dbManager),
  mongoose // 导出原始 mongoose 实例以备不时之需
}