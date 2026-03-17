const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js"); // double dot islie lgaya kyunki models duusra folder h



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



const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);

}
initDB();