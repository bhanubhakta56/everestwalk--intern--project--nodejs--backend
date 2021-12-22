const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/product");
const Cart = require('../models/cart');
const User = require("../models/user");

//--------------------------------------ADD TO CART----------------------
exports.addToCart = asyncHandler(async(req, res, next)=>{
    const product = await Product.findById(req.params._id);
    if(!product){
        return res.status(404).json({
            success: false,
            message:"data not found"
          });
    }
    if(product.stock<=1){
        return res.status(404).json({
            success: false,
            message:"Product not avaiable"
          });
    }
    if(req.body.quantity>5){
        return res.status(404).json({
            success: false,
            message:"quantity more than 5 is not allowed"
          });
    }
    const cart = new Cart({
        user:req.user._id,
        product:req.params.id,
        quantity:req.body.quantity, 
        price: req.body.product.price
    })
    const response =  await cart.save();
    if(!response){
        return next(new ErrorResponse("ERROR!!! COULD NOT ADD TO CART"), 404)
    }
    res.status(201).json({
        success: true,
        message: "PRODUCT ADDED TO CART SUCCESSFULLY !!!",
        data: cart,
    });
});

//-------------------------------------GET PRODUCT FROM MY CART------------
exports.getMyCart=asyncHandler(async(req, res, next)=>{
    const cart = await Cart.find({user:req.user._id}).populate('product');
    if(!cart){
        return next(new ErrorResponse("ERROR!!! COULD NOT LOAD CART"), 404)
    }
    res.status(201).json({
      success: true,
      message: "YOUR CART IS READY",
      count:cart.length,
      data: cart
    });
  });