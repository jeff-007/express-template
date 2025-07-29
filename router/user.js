const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const { body, validationResult } = require('express-validator')

const userValidator = require('../middleware/validator/userValidator')

router
  .post('/register', userValidator.register, userController.register)
  .post('/login', userValidator.login, userController.login)
  .get('/getUsers', userController.getUsers)

module.exports = router
