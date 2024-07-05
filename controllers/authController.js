const User = require("../models/userModel")
const bcryptjs = require('bcryptjs')

exports.signUp = async(req, res)=>{
    try {
        const {username, password} = req.body;
        if(!(username && password)){
            return res.status(400).json({
                status:"fail",
                data:null,
                err:"username/password missing!"
            })
        }
        const salt = await bcryptjs.genSalt(8)
        const hashedPassword = await bcryptjs.hash(password, salt)
        newUser = await User.create({username, password:hashedPassword})
        res.status(200).json({
            status:"success",
            data:{user:newUser}
        })
    } catch (error) {
        res.status(400).json({
            status:"fail",
            data:null,
            err:error.message
        })
    }
}

exports.login = async(req, res)=>{
    try {
        const {username, password} = req.body;
        if(!(username && password)){
            return res.status(400).json({
                status:"fail",
                data:null,
                err:"username/password missing!"
            })
        }
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({status:"fail", err:"user does not exist"});
        const isAuth = await bcryptjs.compare(password, user.password)
        if(!isAuth){
            return res.status(400).json({
                status:"fail",
                err:"username/password wrong"
            })
        }
        // req.session.user = user
        return res.status(200).json({
            status:"success"
        })
    } catch (error) {
        res.status(400).json({
            status:"fail",
            data:null,
            err:error.message
        })
    }
}