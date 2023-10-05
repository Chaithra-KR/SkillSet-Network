const mongoose = require('mongoose')
const conversation = mongoose.Schema({
    members:{
        type:Array,
        required:true
    }
})

module.exports = mongoose.model("Conversation",conversation)