const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLogedin, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLogedin,
  validateReview,
  catchAsync(async (req, res) => {
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
  })
);

router.delete("/:reviewId", isLogedin, isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("error", "レビューを削除しました");
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
