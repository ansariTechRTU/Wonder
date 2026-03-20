const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");
const path =require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");   
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")



app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "public")));




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






//
const validateListing = (req , res, next)=>{

    let { error } = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400, error );
    }else{
        next();
    }

};








//index route
//GET      /listings    -> returns all listings of hotel, villa etc

app.get("/listings" , wrapAsync( async (req, res)=>{
    let allListings= await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
}));






//Create : New & Create Route
//GET      /listings/new      -> form to submit by user to create listing
//POST     /listings          -> here we will create listings by pushing in database


app.get("/listings/new" , (req, res)=>{
    res.render("listings/new.ejs");
    
});

app.post("/listings" , validateListing , wrapAsync( async(req, res)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listings");
    // }


    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

})
);






//Read - Show route
//GET       /listings/:id      -> showing all data for particular based on id

app.get("/listings/:id" , wrapAsync( async (req, res)=>{
    let {id} = req.params;
    const listing= await Listings.findById(id);
    res.render("listings/show.ejs" , {listing});
     

}));






//Update route: Edit & Update route
//GET      /listings/:id/edit     -> edit in form
//PUT      /listings/:id          -> done/submit

app.get("/listings/:id/edit" , wrapAsync( async (req, res)=>{
    let {id} = req.params;
    const listing= await Listings.findById(id);

    res.render("listings/edit.ejs" , {listing});
}));


app.put("/listings/:id", validateListing , wrapAsync( async(req, res)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listings");
    // }


    let {id} = req.params;
    await Listings.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");

    
}));





//DELETE route
//DELETE     /listings/:id

app.delete("/listings/:id" , wrapAsync( async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");

}));














app.all("*splat" , (req, res, next)=>{
    next(new ExpressError(404, "PAGE NOT FOUND !!"));

});



//middleware for handling error
app.use((err, req, res, next) => {

    let { statusCode= 500, message= "something went wrong"} = err;

    res.render("error.ejs", {err}); 

});

















app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});
