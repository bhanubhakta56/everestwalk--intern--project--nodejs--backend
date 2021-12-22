const express = require("express");
const router = express.Router();
const passport = require('passport');
const { addProduct, productPhoto, getAllProduct, searchProduct } = require("../controller/product");

const userController = require("../controller/user");
const { protect, checkAdmin } = require("../middleware/auth");

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect:"/", failureRedirect:"/fail"}));

router.get("/fail", (req, res) => {res.send("Failed attempt")});

router.get("/", (req, res)=>{
    res.send("success")
})

router.post("/register", userController.register);
router.get("/login", userController.login);

//to add product and image
router.post("/addProduct", protect, checkAdmin, addProduct);
router.put("/:id/ProductImage", protect, checkAdmin, productPhoto);

router.get("/product", getAllProduct);

router.get("/search/:product", searchProduct);

module.exports=router