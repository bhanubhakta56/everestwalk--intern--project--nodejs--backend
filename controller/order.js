const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Order = require('../models/order');
const Product = require('../models/product');

//--------------------------------------ORDER NEW PRODUCT----------------------
exports.orderProduct = asyncHandler(async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(404).json({
            success: false,
            message:"product not found"
          });
    }
    const order = new Order({
        user:req.user._id,
        product:req.params.id,
        quantity:req.body.quantity,
        price: req.body.price,
        discount:req.body.discount,
        shipping_location:req.body.location
    })
    const response =  await order.save();

    if(!response){
        return next(new ErrorResponse("ERROR!!! COULD NOT ORDER YOUR PRODUCT"), 404)
    }
    const newStock = product.stock-res.body.quantity
    const pResponse = await Product.findByIdAndUpdate(req.params.id, {stock:newStock})
    // if(!pResponse){
    //     return next(new ErrorResponse("ERROR!!! Failed to update stock"), 404)
    // }
    res.status(201).json({
        success: true,
        message: "PRODUCT ORDERED SUCCESSFULLY !!!",
        data: order,
    });
});

//-------------------------------------GET PRODUCT FROM MY ORDER WEB------------
exports.getMyOrder=asyncHandler(async(req, res, next)=>{
    const order = await Order.find({user:req.user._id}).populate('product');
    if(!order){
        return next(new ErrorResponse("ERROR!!! COULD NOT LOAD CART"), 404)
    }
    res.status(201).json({
      success: true,
      message: "YOU ORDER ARE READY",
      count:order.length,
      data: order
    });
  })

//------------------------------------CANCEL MY ORDER-----------------------
exports.cancelOrder=asyncHandler(async(req, res, next)=>{
    const response = await Order.deleteMany({product:req.params.id})
    if(!response){
        return next(new ErrorResponse("ERROR!!! COULD NOT CANCEL THE ORDER"), 404)
    }
    if(response){
        res.status(201).json({
            success: true,
            message: "YOU ORDER IS CANCELED",
            data: response
          });
    }
  })