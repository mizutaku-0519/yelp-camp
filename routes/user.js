const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerUser = await User.register(user, password);
    await registerUser.save();
    req.flash("success", "ユーザー登録が完了しました");
    res.redirect("/campgrounds");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "ログアウトしました");
    res.redirect("/campgrounds");
  });
});

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  req.flash("success", "ログインに成功しました");
  res.redirect("/campgrounds");
});

module.exports = router;
