const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { body, validationResult } = require('express-validator')

console.log('userController', userController)

const userValidator = require('../middleware/validator/userValidator')

router.post(
  '/register',
  userValidator.register,
  userController.register
)
router.get('/getUsers', userController.getUsers) // 新增路由

module.exports = router
