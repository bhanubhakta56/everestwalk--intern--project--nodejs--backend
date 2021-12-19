const crypto = require("crypto"); //to generate the token and hash it
const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name : {
        type : String,
        required : [true,'Enter first name'],
        trim : true,
    },
    last_name : {
        type : String,
        required : [true,'Enter last name'],
        trim : true,
    },
    gender:{
      type:String, 
      required:[true, 'Gender Required'],
      enum:['Male', 'Female', 'Others']
    },
    email : {
        type: String,
        unique : true,
        trim : true,
        require:[true,'Enter email']
    },
    mobile : {
      type: String,
      maxlength:10,
      minlength: 10,
      trim : true
    },
    profile:{
      type:String
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      trim : true,
      minlength: 6,
      select: false, // it will not return the password when quering
    },
    isActive:{
      type:Boolean,
      default:true
    },
    isCustomer:{
        type:Boolean,
        default:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
})

//get Signed jwtToken
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id:this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

//Match user entered password to hashed passwword in database
UserSchema.methods.matchPassword  =  async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


//generate and hash password token 
UserSchema.methods.getResetPasswordToken = function(){
    //generate the token 
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    //set expire time to 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken
};

module.exports=mongoose.model("User", UserSchema);