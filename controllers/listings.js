const Listings = require("../models/listing.js");



module.exports.index = async (req, res)=>{
    let allListings= await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
};


module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};    

module.exports.createListing = async(req, res)=>{

    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listings(req.body.listing);

    newListing.owner = req.user._id;            //saving new owner detail jus after creating listing
    
    newListing.image = {url, filename};
    
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


    let originalImageUrl = listing.image.url;
    originalImageUrl=  originalImageUrl.replace("/upload" , "/upload/w_250");    // change in size from cloudinary inbuilt api

    res.render("listings/edit.ejs" , {listing , originalImageUrl});
};

module.exports.updateListing = async(req, res)=>{

    let {id} = req.params;
    let listing =await Listings.findByIdAndUpdate(id , {...req.body.listing});


    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;

    listing.image = {url, filename};

    await listing.save();
    }

    
    req.flash("success" , "Listing Updated!");
    res.redirect(`/listings/${id}`);

    
};



module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);

    req.flash("success" , "Listing Deleted!");

    res.redirect("/listings");

};