const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError("レビュー投稿にエラーがあります", 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const review = new Review(req.body.review);
    await review.save();
    const { id } = req.params;
    console.log(id);
    const campground = await Campground.findById(id);
    campground.review.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete("/:reviewId", async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
