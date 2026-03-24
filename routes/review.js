const express = require("express");
const router = express.Router({mergeParams: true});     //input so that review.js can inherit id from app.js
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listings = require("../models/listing.js");






const validateReview = (req , res, next)=>{


    let { error } = reviewSchema.validate(req.body);
    
    
    if(error){
        //if want to throw error messafe only
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg ));
    }else{
        next();
    }

};









//post review route
router.post("/" , validateReview,  wrapAsync (async(req, res)=>{
    let { id } = req.params;
    let  listing = await Listings.findById(id);

    let newReview = new Review (req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success" , "New review created");

    res.redirect(`/listings/${id}`);

}));

//delete review route
router.delete("/:reviewId" , wrapAsync (async(req, res)=>{

    let {id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});  //deleting from listing's review array 
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review deleted!");

    res.redirect(`/listings/${id}`);



}));


module.exports= router;
