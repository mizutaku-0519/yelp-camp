const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const { storeReturnTo } = require("../middleware");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registerUser = await User.register(user, password);
    await registerUser.save();
    req.login(registerUser, (e) => {
      if (e) {
        return next(e);
      }
      req.flash("success", "ユーザー登録が完了しました");
      console.log(registerUser);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.userLogin = async (req, res) => {
  req.flash("success", "ログインに成功しました");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.flash("success", "ログアウトしました");
    res.redirect("/campgrounds");
  });
};
