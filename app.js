const express= require("express");
const app = express();
const mongoose = require("mongoose");
const path =require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");   
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "public")));



const sessionOptions = {
    secret: "verysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,   //num of milisecond in 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());



app.use(passport.initialize());   //to initializes passport
app.use(passport.session());

//use static authenticate method of model in localStrategy
passport.use(new localStrategy(user.authenticate()));

//use static serialize and deserialize of model for passport session support
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




main()
.then(()=>{
    console.log("connect to db : wonder")
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonder");
}


app.use((req, res, next)=>{

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    res.locals.currUser = req.user;
    
    next();

});








app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);









app.all("*splat" , (req, res, next)=>{
    next(new ExpressError(404, "PAGE NOT FOUND !!"));

});

//middleware for handling error
app.use((err, req, res, next) => {

    let { statusCode= 500, message= "something went wrong"} = err;

    res.status(statusCode).render("error.ejs", { err }); 

});





app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
