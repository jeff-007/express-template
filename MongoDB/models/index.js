const mongoose = require('mongoose');

// 导入模型 Schema
const UserSchema = require('./UserModel');
const BlogSchema = require('./BlogModel');

// 注册模型（仅当未注册时才创建）
const models = {
  Users: mongoose.models.User || mongoose.model('User', UserSchema),
  Blogs: mongoose.models.Blog || mongoose.model('Blog', BlogSchema),
};

module.exports = models;