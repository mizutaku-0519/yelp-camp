const express = require("express");
const mongoose = require("mongoose");
const paht = require("path");
const Campground = require("./models/campground");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const app = express();
const methodOverride = require("method-override");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.post(
  "/campgrounds",
  catchAsync(async (req, res) => {
    if (!req.body.campground) {
      throw new ExpressError("キャンプ場の登録エラーです", 500);
    }
    const { campground } = req.body;
    const c = new Campground(campground);
    await c.save();
    res.redirect("/campgrounds");
  })
);

app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

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
