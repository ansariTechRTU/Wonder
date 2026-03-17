const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/close-up-of-a-king-vultures-head-with-dark-background-vOnF2HfbN_g",
       
        set: (v) => v==="" ? "https://unsplash.com/photos/close-up-of-a-king-vultures-head-with-dark-background-vOnF2HfbN_g" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;