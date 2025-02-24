const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const review = require("../controllers/review");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLogedin, isReviewAuthor } = require("../middleware");

router.post("/", isLogedin, validateReview, catchAsync(review.createReview));

router.delete("/:reviewId", isLogedin, isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;
