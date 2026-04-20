const mongoose = require("mongoose")
const Schema = mongoose.Schema


const eventSchema = new Schema({
    type:{
        type:String,
        required:true
    },
    location:{
        lat:Number,
        lng:Number
    },
    timestamp:{
        type:Date,
        default:Date.now()
    },
    metadata:{
        type:Object
    }
})


const Event = mongoose.model("Event",eventSchema)
module.exports = Event