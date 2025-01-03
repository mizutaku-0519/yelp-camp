const mongoose = require("mongoose");
const { Schema } = mongoose;

const campgroundScheme = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  location: String,
});

module.exports = mongoose.model("Campground", campgroundScheme);
