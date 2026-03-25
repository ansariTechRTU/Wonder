const express = require("express");
const router = express.Router({mergeParams: true});     //input so that review.js can inherit id from app.js
const wrapAsync = require("../utils/wrapAsync.js");

const Review = require("../models/review.js");
const Listings = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");





//post review route
router.post("/" ,
    isLoggedIn, 
    validateReview,  wrapAsync ( reviewController.createReview ));


//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync ( reviewController.deleteReview ));


module.exports= router;
