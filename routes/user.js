const express = require("express");
const router = express.Router();
const passport = require('passport');

const userController = require("../controller/user")

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", { successRedirect:"/", failureRedirect:"/fail"}));

router.get("/fail", (req, res) => {res.send("Failed attempt")});

router.get("/", (req, res)=>{
    res.send("success")
})


module.exports=router