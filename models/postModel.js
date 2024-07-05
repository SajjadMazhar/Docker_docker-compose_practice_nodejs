const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Post must have a valid title"],
    },
    body:{
        type:String,
        required:[true, "Post must have a valid body"]
    }
})

const Post = mongoose.model('Posts', postSchema)
module.exports = Post