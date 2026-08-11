const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings= await Listing.find({});
    if(!allListings){
        req.flash("error", "Cannot find any listings");
        res.redirect("/listings");
    };
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res) => {
    
    res.render("listings/new.ejs");
};

module.exports.showListing =async(req,res) => {
   
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Cannot find the listing");
        res.redirect("/listings");
    };
    //console.log(listing);
    
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req,res,next) => {
     let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "Successfully made a new listing");
    res.redirect("/listings");
};

module.exports.editListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Successfully loaded the listing for editing");

    let OriginalImage = listing.image.url;
    OriginalImage = OriginalImage.replace("upload/", "upload/w_250/");
    res.render("listings/edit.ejs", {listing, OriginalImage});
};


module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing =await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
    req.flash("success", "Successfully updated the listing");
    res.redirect("/listings");
};


module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     req.flash("success", "listing is deleted successfully");
   res.redirect("/listings");
};