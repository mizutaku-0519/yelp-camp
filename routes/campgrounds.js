const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas");
const { isLogedin } = require("../middleware");

const validateCampground = (req, res, next) => {
  const result = campgroundSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details
      .map(function (detail) {
        return detail.message;
      })
      .join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLogedin, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("review");
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLogedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

router.post(
  "/",
  isLogedin,
  validateCampground,
  catchAsync(async (req, res) => {
    const { campground } = req.body;
    const c = new Campground(campground);
    await c.save();
    req.flash("success", "キャンプ場の登録が完了しました");
    res.redirect("/campgrounds");
  })
);

router.put(
  "/:id",
  isLogedin,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "キャンプ場の更新が完了しました");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:id",
  isLogedin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("error", "キャンプ場を削除しました");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
