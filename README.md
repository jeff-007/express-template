# Express Template

一个基于 Express 的 Node.js 项目模板，用于快速搭建后端服务。

## 功能特性

- 用户管理（注册、登录、信息更新）
- JWT 认证支持
- 博客模型与数据处理
- 输入验证（Express Validator）
- 文件上传功能

## 安装依赖

```bash
npm install
```

## 启动项目

```bash
npm run dev
```

## API 接口

### 用户相关接口

- `POST /user/login` - 用户登录
- `POST /user/register` - 用户注册
- `GET /user/getUsers` - 获取用户列表
- `PUT /user/update` - 更新用户信息

### 文件上传接口

- `POST /file/upload` - 单文件上传
- `POST /file/upload-multiple` - 多文件上传

## 文件上传使用示例

### 单文件上传

使用 POST 方法向 `/file/upload` 发送请求，表单字段名为 `file`：

```bash
curl -X POST http://localhost:3000/file/upload \
  -F "file=@/path/to/your/file.jpg"
```

### 多文件上传

使用 POST 方法向 `/file/upload-multiple` 发送请求，表单字段名为 `files`：

```bash
curl -X POST http://localhost:3000/file/upload-multiple \
  -F "files=@/path/to/your/file1.jpg" \
  -F "files=@/path/to/your/file2.png"
```

### 前端 JavaScript 示例

```javascript
// 单文件上传
const uploadSingleFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/file/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('上传失败:', error);
  }
};

// 多文件上传
const uploadMultipleFiles = async (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  
  try {
    const response = await fetch('/file/upload-multiple', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
```

## 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key
PORT=3000
```

## 技术栈

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- cors
- dotenv
- express-validator
- morgan
- multer (文件上传)

## 项目结构

```
.
├── MongoDB
│   ├── models
│   │   ├── BlogModel.js
│   │   ├── UserModel.js
│   │   └── index.js
│   └── index.js
├── config
│   └── config.default.js
├── controller
│   ├── index.js
│   ├── userController.js
│   └── fileController.js
├── middleware
│   └── validator
│       ├── errorBack.js
│       └── userValidator.js
├── router
│   ├── index.js
│   ├── user.js
│   ├── video.js
│   └── file.js
├── utils
│   └── jwt.js
├── public (自动生成)
│   └── 上传的文件存放在此目录
├── README.md
├── app.js
├── index.js
├── package-lock.json
└── package.json
```