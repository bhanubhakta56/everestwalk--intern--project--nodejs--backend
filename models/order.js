const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true
    },
    quantity:{
        type: Number,
        default:1
    },
    price:{
        type: Number,
        required: true
    },
    discount:{
        type:Number,
        default:0
    },
    shipping_date:{
        type: Date,
        required:true
    },
    shipping_location:{
        type:String,
        required:true
    },
    shipping_charge:{
        type:Number,
        default: 0
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    isCanceled:{
        type:Boolean,
        default:false
    }
})