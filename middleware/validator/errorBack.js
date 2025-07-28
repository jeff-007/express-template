const { validationResult } = require('express-validator')

// 接口统一验证错误信息
module.exports = (validator) => {
  return async (req, res, next) => {
    await Promise.all(validator.map((validation) => validation.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    next()
  }
}
