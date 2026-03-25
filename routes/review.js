const express = require("express");
const router = express.Router({mergeParams: true});     //input so that review.js can inherit id from app.js
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listings = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");







//post review route
router.post("/" ,
    isLoggedIn, 
    validateReview,  wrapAsync (async(req, res)=>{
    let { id } = req.params;
    let  listing = await Listings.findById(id);

    let newReview = new Review (req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success" , "New review created");

    res.redirect(`/listings/${id}`);

}));

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync (async(req, res)=>{

    let {id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});  //deleting from listing's review array 
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review deleted!");

    res.redirect(`/listings/${id}`);



}));


module.exports= router;
