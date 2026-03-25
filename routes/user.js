const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");



router.get("/signup" , (req, res)=>{

    res.render("./users/signup.ejs");

});


router.post("/signup" , wrapAsync(async(req, res)=>{
    
    try{
        let {username, email, password} =req.body;
        const newUser= new user({email, username});

        const registeredUser = await user.register(newUser, password);



        req.login(registeredUser, (err)=>{              //documentation passport

            if(err){
            return next(err);
        }
            
            req.flash("success" , "user registered, Welcome!");
            res.redirect("/listings");

        });



    }catch(err){
        req.flash("error" , err.message);
        res.redirect("/listings");
    }
         

}));





router.get("/login" , (req, res)=>{

    res.render("./users/login.ejs");

});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local" , {failureRedirect : "/login" , failureFlash: true}),
    async(req, res)=>{

    req.flash("success" , "welcome back to wonder");

    let redirectUrl= res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);


});






router.get("/logout" , (req, res)=>{
    req.logout((err)=>{

        if(err){
            next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listings");
    });
});




module.exports = router;