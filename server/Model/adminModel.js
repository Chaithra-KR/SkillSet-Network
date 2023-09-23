const mongoose = require('mongoose')
const admin = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
    }
})

module.exports = mongoose.model("Admin",admin)