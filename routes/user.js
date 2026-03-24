const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const passport = require("passport");



router.get("/signup" , (req, res)=>{

    res.render("./users/signup.ejs");

});


router.post("/signup" , wrapAsync(async(req, res)=>{
    
    let {username, email, password} =req.body;
    const newUser= new user({email, username});

    const registeredUser = await user.register(newUser, password);

    req.flash("success" , "user registered, Welcome!");
    res.redirect("/listings");

         

}));





router.get("/login" , (req, res)=>{

    res.render("./users/login.ejs");

});

router.post("/login",
    passportauthenticate("local" , {failureRedirect : "/login" , failureFlash: true}),
    async(req, res)=>{

    req.flash("success" , "welcome back to wonder");
    res.redirect("/listings");


});









module.exports = router;