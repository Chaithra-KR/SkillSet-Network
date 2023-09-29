const mongoose = require('mongoose')

const job = mongoose.Schema({
    position: {
        type: String,
        ref: 'Position',
    },
    salary:{
        type:Number,
        required:true
    },
    skills:{
        type:Array,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    requirements:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    company:{
        type:String,
        ref:"Company",
    },
    applicants: [{
        type: String,
        ref: 'AppliedJobs'
    }]
})
module.exports = mongoose.model("Job",job)
