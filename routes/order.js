const express = require("express");
const { orderProduct, getMyOrder, cancelOrder } = require("../controller/order");
const { protect } = require("../middleware/auth");
const  router = express.Router();

router.post('/orderProduct/:id', protect, orderProduct);
router.get('/getMyOrder', protect, getMyOrder);
router.delete('/cancelOrder/:id', protect, cancelOrder);


module.exports = router