const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const { campgroundScheme } = require("./schemas");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const Campground = require("./models/campground");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB接続完了...");
  })
  .catch((err) => {
    console.log(err);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundScheme.validate(req.body);
  if (error) {
    const msg = error.details.map((detail) => detail.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
  console.log(error.details);
};

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds });
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit", { campground });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/show", { campground });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground)
    //   throw new ExpressError("不正な入力データです", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect("/campgrounds");
  })
);

app.get("/", (req, res) => {
  res.send("home");
});

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
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

app.all("*", (req, res, next) => {
  next(new ExpressError("ページが見つかりません", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.massage) {
    this.massage = "問題が発生しました";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("ポート番号3000で受付中...");
});
