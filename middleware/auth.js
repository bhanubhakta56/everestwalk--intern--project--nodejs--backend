//PROTECT THE MIDDLEWARE
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  //Make sure token exist
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
//----------------------------check Owner------------------
exports.checkAdmin = asyncHandler(async(req, res, next)=>{
  try{
    if(!req.user){
      return next(new ErrorResponse("Not Logged in", 401));
    }
    else if(!req.user.isAdmin){
      return next(new ErrorResponse("You are not allowed to add product", 401));
    }
  }catch(err){
    return next(new ErrorResponse("Error!!! Invalid User", 401));
  }
});
