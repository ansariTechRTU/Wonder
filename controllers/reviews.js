const Listings = require("../models/listing.js");
const Review = require("../models/review.js");



module.exports.createReview= async(req, res)=>{
    let { id } = req.params;
    let  listing = await Listings.findById(id);

    let newReview = new Review (req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success" , "New review created");

    res.redirect(`/listings/${id}`);

};


module.exports.deleteReview = async(req, res)=>{

    let {id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id , {$pull: {reviews: reviewId}});  //deleting from listing's review array 
    await Review.findByIdAndDelete(reviewId);

    req.flash("success" , "Review deleted!");

    res.redirect(`/listings/${id}`);



};