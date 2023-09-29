const mongoose = require('mongoose')
const appliedJobs = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    cv: {
        type: String,
      },
    skills:[String],
    experience:{
        type:String,
        required:true       
    },
    appliedDate:{
        type:Date,
        default:Date.now
    },
    phone:{
        type:Number,
        required:true
    },
    coverLetter:{
        type:String,
        required:true
    },
    job:{
        type: String,
        ref: "Job",
    },
    company:{
        type:String,
        ref:"Company",
    },
    user:{
        type:String,
        ref:"User"
    }
    
})

module.exports = mongoose.model("AppliedJobs",appliedJobs)