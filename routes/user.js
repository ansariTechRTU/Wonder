const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");



router.route("/signup")
    .get(userController.signUpRenderForm)
    .post(wrapAsync( userController.signUp ));



router.route("/login")
    .get(userController.loginRenderForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local" , {failureRedirect : "/login" , failureFlash: true}),
    userController.login
);





router.get("/logout" , userController.logout);




module.exports = router;