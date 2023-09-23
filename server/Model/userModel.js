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
        type:Array
    },
    cv: {
        type: String,
      },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
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
    }]
})

module.exports = mongoose.model("User",user)