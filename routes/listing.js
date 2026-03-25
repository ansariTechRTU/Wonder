const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");


const multer  = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({ storage });




router.route("/")
    //index route
    //GET      /listings    -> returns all listings of hotel, villa etc
    .get(wrapAsync( listingController.index ))

    //POST     /listings          -> here we will create listings by pushing in database
    .post(isLoggedIn,
        validateListing,
        upload.single('listing[image]'), 
        wrapAsync( listingController.createListing ));




//GET      /listings/new      -> form to submit by user to create listing
router.get("/new" , isLoggedIn , listingController.renderNewForm);




router.route("/:id")
    //Read - Show route
    //GET       /listings/:id      -> showing all data for particular based on id
    .get(wrapAsync( listingController.showListing ))

    //PUT      /listings/:id          -> done/submit to update listing
    .put(
    isLoggedIn,
    isOwner,
    validateListing , wrapAsync( listingController.updateListing ))

    //DELETE route
    //DELETE     /listings/:id    
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync( listingController.destroyListing ));




//Update route: Edit & Update route
//GET      /listings/:id/edit     -> edit in form
router.get("/:id/edit" ,
    isLoggedIn,
    isOwner,
    wrapAsync( listingController.renderEditForm ));








module.exports = router;