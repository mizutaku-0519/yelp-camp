const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  res.render("campgrounds/show", { campground });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
};

module.exports.createCampground = async (req, res) => {
  const { campground } = req.body;
  const c = new Campground(campground);
  c.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  c.author = req.user._id;
  console.log(c);
  await c.save();
  req.flash("success", "キャンプ場の登録が完了しました");
  res.redirect("/campgrounds");
};

module.exports.editCampground = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  await campground.save();
  req.flash("success", "キャンプ場の更新が完了しました");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("error", "キャンプ場を削除しました");
  res.redirect("/campgrounds");
};
