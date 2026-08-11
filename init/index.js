const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
const initData = require("./data.js");
const Listing = require('../models/listing.js')
main()
.then(() => {
    console.log("Connected to Database");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a548d83efb15c8a536d7991",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data is initialized");

}
initDB();

