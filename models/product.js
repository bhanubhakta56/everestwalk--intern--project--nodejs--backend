const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:String,
        required:true,
        trim:true
    },
    color:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    size:{
        type:String,
        required:true,
        trim:true
    },
    stock:{
        type:Number,
        required:true,
        trim:true
    },
    material:{
        type:String,
        required:true,
        trim:true
    },
    picture:{
        type:String,
        required:true,
        trim:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
})

module.exports = mongoose.model("Product", ProductSchema);