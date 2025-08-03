const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const toJwt = promisify(jwt.sign)
const verify = promisify(jwt.verify)

const createToken = async (payload) => {
  const token = await toJwt(payload, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24
  })
  return token
}

// 通常token会通过http请求头Authorization中传递给服务端
// Authorization: Bearer <token>
const verifyToken = async (req, res, next) => {
  try {
    // 检查是否存在 authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Authorization header is required' })
    }
    
    // 提取 token
    const token = req.headers.authorization.split('Bearer ')[1]
    
    // 验证 token 是否存在
    if (!token) {
      return res.status(401).json({ error: 'Token is required' })
    }
    
    // 验证 token 的有效性
    const payload = await verify(token, process.env.JWT_SECRET)
    
    // 将 payload 附加到请求对象上，供后续中间件使用
    req.user = payload
    
    // 继续执行下一个中间件
    next()
  } catch (error) {
    // 处理验证失败的情况
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' })
    }
    
    return res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { createToken, verifyToken }



