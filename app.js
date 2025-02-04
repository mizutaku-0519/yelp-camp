const express = require("express");
const mongoose = require("mongoose");
const paht = require("path");
const Campground = require("./models/campground");
const Review = require("./models/review");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas");
const app = express();
const methodOverride = require("method-override");
const campgroundsRoute = require("./routes/campgrounds");
const reviewRoute = require("./routes/reviews");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("MongoDB接続中...");
  })
  .catch((e) => {
    console.log(e);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set(path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/campgrounds", campgroundsRoute);
app.use("/campgrounds/:id/review", reviewRoute);

app.all("*", (req, res) => {
  throw new ExpressError("ページが見つかりません", 404);
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) {
    message = "問題が発生しました";
  }
  res.status(status).render("error", { err });
});

app.listen(3000, () => {
  console.log("ポート番号3000で受付中...");
});
