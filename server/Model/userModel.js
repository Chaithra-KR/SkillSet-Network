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
    role:{
        type:String,
    },
    access:{
        type:Boolean,
        default:false
    },
    phone:{
        type:Number
    },
    skills:[String],
    experience:{
        type:String
    },
    headline:{
        type:String
    },
    about:{
        type:String
    },
    image:{
        type:String,
    },
    appliedJobs:{
        type:Array,
        ref:"Job",
    },
    cv: {
        type: String,
      },
    savedJobs: [{
        type: String,
        ref: "Job",
    }],
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
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
    }],
})

module.exports = mongoose.model("User",user)