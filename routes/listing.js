const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");




//index route
//GET      /listings    -> returns all listings of hotel, villa etc

router.get("/" , wrapAsync( async (req, res)=>{
    let allListings= await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
}));






//Create : New & Create Route
//GET      /listings/new      -> form to submit by user to create listing
//POST     /listings          -> here we will create listings by pushing in database


router.get("/new" , isLoggedIn , (req, res)=>{

    
    res.render("listings/new.ejs");
    
});

router.post("/"  , isLoggedIn  , validateListing , wrapAsync( async(req, res)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listings");
    // }


    const newListing = new Listings(req.body.listing);

    newListing.owner = req.user._id;            //saving new owner detail jus after creating listing
    await newListing.save();
    req.flash("success" , "New listing created");
    res.redirect("/listings");

})
);




//Read - Show route
//GET       /listings/:id      -> showing all data for particular based on id

router.get("/:id" , wrapAsync( async (req, res)=>{
    let {id} = req.params;

    const listing= await Listings.findById(id)
        .populate({path : "reviews" , populate:{ path: "author"} })
        .populate("owner");  //populate to get full data of review on show page   & also about owner & also author of review
    
    if(!listing){
        req.flash("error" , "Listing you requested for , doesnot exist!");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs" , {listing});
     

}));






//Update route: Edit & Update route
//GET      /listings/:id/edit     -> edit in form
//PUT      /listings/:id          -> done/submit

router.get("/:id/edit" ,
    isLoggedIn,
    isOwner,
    wrapAsync( async (req, res)=>{

    let {id} = req.params;
    const listing= await Listings.findById(id);

    if(!listing){
        req.flash("error" , "Listing you requested for , doesnot exist!");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs" , {listing});
}));


router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing , wrapAsync( async(req, res)=>{

    let {id} = req.params;

    await Listings.findByIdAndUpdate(id , {...req.body.listing});
    
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);

    
}));





//DELETE route
//DELETE     /listings/:id

router.delete("/:id" ,
    isLoggedIn,
    isOwner,
    wrapAsync( async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);

    req.flash("success" , "Listing Deleted!");

    res.redirect("/listings");

}));


module.exports = router;