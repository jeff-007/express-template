// 加载环境变量配置
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const router = require('./router')

const app = express()
const PORT = process.env.PORT || 3000

// 挂载路由
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// 处理日志的中间件
app.use(morgan('dev'))
// 跨域处理
app.use(cors())
// 静态文件服务
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(router)

// 页面404处理中间件
app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: '页面不存在'
  })
})

// 接口错误处理中间件
app.use((err, req, res, next) => {
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  })
})

// 挂载统一处理服务端错误中间件
// app.use(errorHandler())


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})

module.exports = app