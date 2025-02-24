const Campground = require("../models/campground");

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
  c.author = req.user._id;
  await c.save();
  req.flash("success", "キャンプ場の登録が完了しました");
  res.redirect("/campgrounds");
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash("success", "キャンプ場の更新が完了しました");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("error", "キャンプ場を削除しました");
  res.redirect("/campgrounds");
};
