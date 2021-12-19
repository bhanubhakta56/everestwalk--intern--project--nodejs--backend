const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");
const dotenv = require('dotenv')
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
// or
// const strategy = require('passport-facebook');
// const FacebookStrategy = strategy.Strategy



// dotenv.config()
passport.serializeUser(function(user, done){
    done(null, user);
})
passport.deserializeUser(function(obj, done){
    done(null, obj);
})

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields:["email", "name"]
        },
        function(accessToken, refreshToken, profile, done){
            const{email, first_name, last_name}=profile._json;
            const userData = {
                email:email,
                first_name:first_name,
                last_name:last_name
            };
            new User(userData).save();
            done(null, profile);
        }
    )
);


//--------------------------REGISTER USER-----------------
exports.register = asyncHandler(async (req, res, next) => {
    const { first_name,last_name,gender,email,password} = req.body;

    if (!first_name || !email || !password || !last_name || !gender) {
        return next(new ErrorResponse("Please provide all details"), 400);
      }
    
    const hashP = bcrypt.hashSync(password, 10);

    const data = new User({
      first_name:first_name,
      last_name:last_name,
      gender:gender,
      email:email,
      password:hashP
  });
    const user = await data.save();
    sendTokenResponse(user, 200, res);
    console.log()
});

//-------------------LOGIN-------------------
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return next(new ErrorResponse("Please provide username and password"), 400);
    }
  
    // Check user
    const user = await User.findOne({ email: email }).select("+password");
    console.log(user)
    //because in password field we have set the property select:false , but here we need as password so we added + sign
  
    if (!user) {
      res
      .status(201)
      .json({
        success: false,
        message: 'Invalid credentails user',
      });  
    }
  
    const isMatch = await user.matchPassword(password); // decrypt password
    
    if (!isMatch) {
      res.status(201).json({success: false,message: 'Invalid credentails',});
    }
   else{
    sendTokenResponse(user, 200, res);
  }
  });


// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
 
    const token = user.getSignedJwtToken();
  
    const options = {
      //Cookie will expire in 30 days
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    // Cookie security is false .if you want https then use this code. do not use in development time
    if (process.env.NODE_ENV === "proc") {
      options.secure = true;
    }
  
    //we have created a cookie with a token
    res
      .status(statusCode)
      .cookie("token", token, options) // key , value ,options
      .json({
        success: true,
        message:"Logged In Successfully",
        data:user,
        token:token,
      });
      console.log("login success")
  };