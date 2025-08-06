const express = require('express')
const router = express.Router()

const userRouter = require('./user')
const videoRouter = require('./video')
const fileRouter = require('./file')

router.use('/user', userRouter)
router.use('/video', videoRouter)
router.use('/file', fileRouter)

module.exports = router