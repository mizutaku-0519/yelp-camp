module.exports.isLogedin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "ログインをしてください");
    return res.redirect("/login");
  }
  next();
};
