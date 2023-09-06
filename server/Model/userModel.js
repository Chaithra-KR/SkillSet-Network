const mongoose = require('mongoose')

const user = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        default:Date.now
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    skills:{
        type:Array
    },
    headline:{
        type:String
    },
    about:{
        type:String
    },
    image:{
        type:String
    },
    appliedJobs:{
        type:Array
    },
    location:[{
        district:{
            type:String
        },
        state:{
            type:String
        },
        city:{
            type:String
        }
    }]
})

module.exports = mongoose.model("User",user)