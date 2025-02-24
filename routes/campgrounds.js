const express = require("express");
const router = express.Router();
const campground = require("../controllers/campground");
const Campground = require("../models/campground");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLogedin, isAuthor } = require("../middleware");

router.route("/").get(catchAsync(campground.index)).post(isLogedin, validateCampground, catchAsync(campground.createCampground));

router.get("/new", isLogedin, campground.renderNewForm);

router.route("/:id").get(catchAsync(campground.showCampground)).put(isLogedin, isAuthor, validateCampground, catchAsync(campground.editCampground)).delete(isLogedin, isAuthor, catchAsync(campground.deleteCampground));

router.get("/:id/edit", isLogedin, isAuthor, catchAsync(campground.renderEditForm));

module.exports = router;
