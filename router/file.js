const express = require('express')
const router = express.Router()
const { verifyToken } = require('../utils/jwt')

const { uploadSingle, uploadMultiple } = require('../controller/fileController')

// 单文件上传路由
router.post('/upload', verifyToken, uploadSingle)

// 多文件上传路由
router.post('/upload-multiple', uploadMultiple)

module.exports = router