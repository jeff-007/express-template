const jwt = require('jsonwebtoken')
const { promisify } = require('util')

const toJwt = promisify(jwt.sign)

const createToken = async (payload) => {
  const token = await toJwt(payload, process.env.JWT_SECRET, {
    expiresIn: 60
  })
  return token
}

module.exports = { createToken }



