const { validationResult } = require('express-validator')

// 接口统一验证错误信息
module.exports = (validator) => {
  // 参数验证，确保传入的是数组
  if (!Array.isArray(validator)) {
    throw new TypeError('验证器必须是验证规则数组')
  }

  return async (req, res, next) => {
    try {
      // 并行执行所有验证规则
      await Promise.all(validator.map((validation) => {
        // 确保每个验证规则都有run方法
        if (typeof validation.run !== 'function') {
          return Promise.reject(new TypeError('验证规则必须包含run方法'))
        }
        return validation.run(req)
      }))

      // 检查验证结果
      const errors = validationResult(req)
      
      // 如果有验证错误，返回统一格式的错误响应
      if (!errors.isEmpty()) {
        return res.status(422).json({ 
          code: 422,
          message: '请求参数验证失败',
          errors: errors.array() 
        })
      }
      
      // 验证通过，继续执行下一个中间件
      next()
    } catch (error) {
      // 处理验证过程中可能出现的异常
      next(error)
    }
  }
}