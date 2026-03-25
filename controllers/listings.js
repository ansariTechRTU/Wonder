const Listings = require("../models/listing.js");



module.exports.index = async (req, res)=>{
    let allListings= await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
};


module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};    

module.exports.createListing = async(req, res)=>{
    const newListing = new Listings(req.body.listing);

    newListing.owner = req.user._id;            //saving new owner detail jus after creating listing
    await newListing.save();
    req.flash("success" , "New listing created");
    res.redirect("/listings");

};



module.exports.showListing = async (req, res)=>{
    let {id} = req.params;

    const listing= await Listings.findById(id)
        .populate({path : "reviews" , populate:{ path: "author"} })
        .populate("owner");  //populate to get full data of review on show page   & also about owner & also author of review
    
    if(!listing){
        req.flash("error" , "Listing you requested for , doesnot exist!");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs" , {listing});
     

};



module.exports.renderEditForm =  async (req, res)=>{

    let {id} = req.params;
    const listing= await Listings.findById(id);

    if(!listing){
        req.flash("error" , "Listing you requested for , doesnot exist!");
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs" , {listing});
};

module.exports.updateListing = async(req, res)=>{

    let {id} = req.params;

    await Listings.findByIdAndUpdate(id , {...req.body.listing});
    
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);

    
};



module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);

    req.flash("success" , "Listing Deleted!");

    res.redirect("/listings");

};