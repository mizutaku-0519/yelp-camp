const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const campgroundScheme = new Schema({
  title: String,
  description: String,
  price: Number,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundScheme.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: { $in: doc.review },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundScheme);
