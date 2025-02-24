const express = require("express");
const passport = require("passport");
const user = require("../controllers/user");
const router = express.Router();
const User = require("../models/user");
const { storeReturnTo } = require("../middleware");

router.route("/register").get(user.renderRegisterForm).post(user.createUser);

router
  .route("/login")
  .get(user.renderLoginForm)
  .post(storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), user.userLogin);

router.get("/logout", user.userLogout);

module.exports = router;
