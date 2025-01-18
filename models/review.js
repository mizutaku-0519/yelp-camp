const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: Number,
  text: String,
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
