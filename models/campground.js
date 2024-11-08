const mongoose = require("mongoose");
const Scheme = mongoose.Schema;

const campgroundScheme = new Scheme({
  title: String,
  price: Number,
  imageUrl: String,
  description: String,
  location: String,
});

const Campground = mongoose.model("Campground", campgroundScheme);
module.exports = Campground;
