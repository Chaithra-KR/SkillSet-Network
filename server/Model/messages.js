const mongoose = require('mongoose')
const messages = mongoose.Schema({
    conversationId:{
        type:String,
    },
    senderId:{
        type:String,
    },
    message:{
        type:String,
    }
})

module.exports = mongoose.model("Messages",messages)