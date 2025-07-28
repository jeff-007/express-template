const app = require('./app');
const { connect, gracefulShutdown } = require('./MongoDB/index');

const PORT = process.env.PORT || 3000;
const MAX_RETRIES = 0;
const RETRY_DELAY = 3000;

let server;
let retryCount = 0;
let dbConnected = false;
let retryTimeout = null;

function connectWithRetry() {
  // 清除之前的重试定时器（如果存在）
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  
  connect({
    success: () => {
      retryCount = 0; // 重置重试计数
      dbConnected = true;
      console.log('数据库连接成功');
    },
    fail: () => {
      dbConnected = false;
      retryCount++;
      
      if (retryCount <= MAX_RETRIES) {
        console.log(`数据库连接失败，${RETRY_DELAY/1000}秒后进行第${retryCount}次重试...`);
        retryTimeout = setTimeout(connectWithRetry, RETRY_DELAY);
      } else {
        console.error('数据库连接失败，达到最大重试次数');
        console.error('数据库连接丢失，服务将继续运行但数据库不可用');
        // 重置重试计数，允许在后续运行中重新尝试
        retryCount = 0;
      }
    }
  });
}


// 立即启动服务器
server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('注意：服务器已启动，正在尝试连接数据库...');
});

// 开始数据库连接尝试
// connectWithRetry();

// 注册关闭监听器
// process.on('SIGINT', gracefulShutdown('SIGINT'));
// process.on('SIGTERM', gracefulShutdown('SIGTERM'));

// process.on('uncaughtException', (err) => {
//   console.error('未捕获异常:', err);
//   gracefulShutdown('uncaughtException')();
// });

// process.on('unhandledRejection', (reason) => {
//   console.error('未处理的Promise拒绝:', reason);
//   gracefulShutdown('unhandledRejection')();
// });