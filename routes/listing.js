const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listings = require("../models/listing.js");










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

router.get("/" , wrapAsync( async (req, res)=>{
    let allListings= await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
}));






//Create : New & Create Route
//GET      /listings/new      -> form to submit by user to create listing
//POST     /listings          -> here we will create listings by pushing in database


router.get("/new" , (req, res)=>{
    res.render("listings/new.ejs");
    
});

router.post("/" , validateListing , wrapAsync( async(req, res)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listings");
    // }


    const newListing = new Listings(req.body.listing);
    await newListing.save();
    req.flash("success" , "New listing created");
    res.redirect("/listings");

})
);




//Read - Show route
//GET       /listings/:id      -> showing all data for particular based on id

router.get("/:id" , wrapAsync( async (req, res)=>{
    let {id} = req.params;
    const listing= await Listings.findById(id).populate("reviews");   //populate to get full data of review on show page
    
    if(!listing){
        req.flash("error" , "Listing you requested for , doesnot exist!");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs" , {listing});
     

}));






//Update route: Edit & Update route
//GET      /listings/:id/edit     -> edit in form
//PUT      /listings/:id          -> done/submit

router.get("/:id/edit" , wrapAsync( async (req, res)=>{
    let {id} = req.params;
    const listing= await Listings.findById(id);

    if(!listing){
        req.flash("error" , "Listing you requested for , doesnot exist!");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs" , {listing});
}));


router.put("/:id", validateListing , wrapAsync( async(req, res)=>{

    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listings");
    // }


    let {id} = req.params;
    await Listings.findByIdAndUpdate(id , {...req.body.listing});
    
    req.flash("success" , "Listing Updated!");
    res.redirect("/listings");

    
}));





//DELETE route
//DELETE     /listings/:id

router.delete("/:id" , wrapAsync( async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);

    req.flash("success" , "Listing Deleted!");

    res.redirect("/listings");

}));


module.exports = router;