const multer = require('multer')
const path = require('path')
const fs = require('fs')

// 确保 public 目录存在
const uploadDir = path.join(__dirname, '../public')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置 multer 存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // path.extname 提取文件扩展名
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 接受常见图片格式、文档格式和视频格式
  const allowedTypes = [
    // 图片格式
    'image/jpeg',
    'image/png',
    'image/gif',
    
    // 文档格式
    'application/pdf',
    'text/plain',
    
    // 视频格式
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',  // AVI
    'video/x-ms-wmv',   // WMV
    'video/webm',
    'video/ogg'
  ]
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('不支持的文件类型'), false)
  }
}

// 创建 multer 实例
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 限制文件大小为 50MB（或根据需要调整）
  }
})

// 单文件上传处理
const uploadSingle = (req, res) => {
  // 上传的文件需要在form-data 中以 file 字段上传
  const uploadSingle = upload.single('file')
  
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer 错误
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          message: '文件太大，最大允许5MB' 
        })
      }
      return res.status(400).json({ 
        message: '文件上传错误: ' + err.message 
      })
    } else if (err) {
      // 其他错误
      return res.status(400).json({ 
        message: '文件上传失败: ' + err.message 
      })
    }
    
    // 检查是否有文件上传
    if (!req.file) {
      return res.status(400).json({ 
        message: '请选择要上传的文件' 
      })
    }
    
    // 返回成功响应
    res.status(200).json({
      message: '文件上传成功',
      file: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    })
  })
}

// 多文件上传处理
const uploadMultiple = (req, res) => {
  const uploadMultiple = upload.array('files', 5) // 最多允许5个文件
  
  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          message: '文件太大，最大允许5MB' 
        })
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          message: '文件数量超过限制，最多允许5个文件' 
        })
      }
      return res.status(400).json({ 
        message: '文件上传错误: ' + err.message 
      })
    } else if (err) {
      return res.status(400).json({ 
        message: '文件上传失败: ' + err.message 
      })
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        message: '请选择要上传的文件' 
      })
    }
    
    const files = req.files.map(file => ({
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }))
    
    res.status(200).json({
      message: '文件上传成功',
      files: files
    })
  })
}

module.exports = {
  uploadSingle,
  uploadMultiple
}