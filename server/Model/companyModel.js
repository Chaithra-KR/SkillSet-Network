const mongoose = require('mongoose')
const company = new mongoose.Schema({
    company:{
        type:String,
        required:true
    },
    startedDate:{
        type:Date,
        default:Date.now
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    about:{
        type:String
    },
    headline:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    peoples:{
        type:String
    },
    jobs:{
        type:Array,
        ref:"Job",
    },
    price:{
        type:String
    },
    access:{
        type:Boolean,
        default:false
    },
    premium:{
        type:Number,
    },
    premiumStatus:{
        type:Boolean,
        default:false
    },
    userRequests: [
        {
          userId: {
            type: String,
            ref: "User",
          },
          status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "request",
          },
          requestDate:{
            type:Date,
            default:Date.now
        }
        },
      ],      
    address: [
        {
            building:{
                type:String,
                required:true
            },
            city:{
                type:String,
                required:true
            },
            pin:{
                type:Number,
                required:true
            },
            district:{
                type:String,
                required:true
            },
            state:{
                type:String,
                required:true
            },
            phone:{
                type:Number,
                required:true
            }
        }
    ]
})

module.exports = mongoose.model("Company",company);