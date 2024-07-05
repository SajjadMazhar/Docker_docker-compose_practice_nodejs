const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "username required"],
        unique:true
    },
    password:{
        type:String,
        required:[true, "user must have a password"]
    }
})

const User = mongoose.model("users", userSchema)

module.exports = User;