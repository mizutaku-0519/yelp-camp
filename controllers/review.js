const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = async (req, res) => {
  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  const { id } = req.params;
  console.log(id);
  const campground = await Campground.findById(id);
  campground.review.push(review);
  await campground.save();
  req.flash("success", "レビューを投稿しました");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("error", "レビューを削除しました");
  res.redirect(`/campgrounds/${id}`);
};
