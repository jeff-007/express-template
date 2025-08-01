// 用户注册客户端传入数据验证

const { body } = require('express-validator')
const validatorAll = require('./errorBack')
const { Users } = require('../../MongoDB/models/index')

const register = validatorAll([
  body('username')
    .notEmpty()
    .withMessage('用户名不能为空')
    .bail()
    .isLength({ min: 3 })
    .withMessage('用户名长度不能小于3个字符')
    .bail(),
  body('password').isLength({ min: 1 }).withMessage('密码不能为空'),
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确')
    .bail()
    .custom(async (value) => {
      // 验证邮箱是否已存在
      const existEmail = await Users.findOne({ email: value })
      if (existEmail) {
        return Promise.reject('邮箱已存在')
      }
    }),
  body('phone')
    .notEmpty()
    .withMessage('手机号码不能为空')
    .bail()
    .isMobilePhone()
    .withMessage('手机号码格式不正确')
    .bail()
    .custom(async (value) => {
      // 验证手机号是否已存在
      const existPhone = await Users.findOne({ phone: value })
      if (existPhone) {
        return Promise.reject('手机号已存在')
      }
    }),
])

const login = validatorAll([
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确')
    .bail(),
  body('password').notEmpty().withMessage('密码不能为空').bail(),
])

module.exports = {
  register,
  login,
}
