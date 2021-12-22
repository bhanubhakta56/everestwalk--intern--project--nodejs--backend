const express = require("express");
const { addToCart, getMyCart } = require("../controller/cart");
const { protect } = require("../middleware/auth");
const  router = express.Router();

router.post('/addToCart/:id', protect, addToCart);
router.get('/getMyCart', protect, getMyCart);


module.exports=router