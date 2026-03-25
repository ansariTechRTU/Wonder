const Listings = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");





module.exports.validateListing = (req , res, next)=>{

    let { error } = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400, error );
    }else{
        next();
    }

};




module.exports.validateReview = (req , res, next)=>{


    let { error } = reviewSchema.validate(req.body);
    
    
    if(error){
        //if want to throw error messafe only
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg ));
    }else{
        next();
    }

};




module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;  // saving redirect url which user want to access before login

        req.flash("error" , "You must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};




module.exports.isOwner= async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listings.findById(id);
    if( !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.isReviewAuthor= async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if( !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
