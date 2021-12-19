// const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");
const dotenv = require('dotenv')
const crypto = require("crypto");

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
