const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    price: Number
});

// const BlogModel = mongoose.model('blogs', BlogSchema)

module.exports = BlogSchema