const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  imageUrl: String,
  description: String,
  location: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
