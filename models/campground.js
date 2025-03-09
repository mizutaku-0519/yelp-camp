const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload/", "upload/w_200/");
});

const campgroundScheme = new Schema({
  title: String,
  description: String,
  price: Number,
  images: [imageSchema],
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
