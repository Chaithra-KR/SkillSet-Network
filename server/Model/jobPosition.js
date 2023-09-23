const mongoose = require('mongoose')
const jobPosition = mongoose.Schema({
    position:{
        type:String,
        required:true
    },
    admin: {
        type: String,
        ref: 'Admin',
    }
})

module.exports = mongoose.model("Position",jobPosition)