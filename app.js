const express= require("express");
const app = express();
const mongoose = require("mongoose");

const Listings = require("./models/listing.js");

const path =require("path");


app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));



main()
.then(()=>{
    console.log("connect to db : wonder")
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonder");
}




app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});








//index route
//GET      /listings    -> returns all listings of hotel, villa etc

app.get("/listings" , async (req, res)=>{
    let allListings= await Listings.find({});
    res.render("listings/index.ejs" , {allListings});
});






//Create : New & Create Route
//GET      /listings/new      -> form to submit by user to create listing
//POST     /listings          -> here we will create listings by pushing in database


app.get("/listings/new" , (req, res)=>{
    res.render("listings/new.ejs");
    
});

app.post("/listings" , async(req, res)=>{
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

});






//Read - Show route
//GET       /listings/:id      -> showing all data for particular based on id

app.get("/listings/:id" , async (req, res)=>{
    let {id} = req.params;
    const listing= await Listings.findById(id);
    res.render("listings/show.ejs" , {listing});
     

});




