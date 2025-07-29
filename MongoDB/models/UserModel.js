const mongoose = require('mongoose')
const crypto = require('crypto');


// 注册用户信息表
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: function(password) {
      return crypto.createHash('md5').update(password).digest('hex');
    },
    select: false,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
})

module.exports = UserSchema
