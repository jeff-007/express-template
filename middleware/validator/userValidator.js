// 用户注册客户端传入数据验证

const { body } = require('express-validator');
const validatorAll = require('./errorBack');

exports.register = validatorAll([
  body('username').isLength({ min: 1 }).withMessage('用户名不能为空'),
  body('password').isLength({ min: 1 }).withMessage('密码不能为空'),
  body('email').isEmail().withMessage('邮箱格式不正确'),
  body('phone').isMobilePhone().withMessage('手机号码格式不正确'),
])