var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var csrf = require("csurf");
var csrfProtection = csrf();
router.use(csrfProtection);

router.get("/signup", function signUp(req, res, next) {
  var messages = req.flash("error");
  res.render("signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    successRedirect: "/signup",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/", function viewLoginPage(req, res, next) {
  var messages = req.flash("error");

  res.render("login", {
    title: "Log In",
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.get("/logout", isLoggedIn, function logoutUser(req, res, next) {
  req.logout();
  res.redirect("/");
});

router.get("/check-type", function checkTypeOfLoggedInUser(req, res, next) {
  req.session.user = req.user;
  console.log(req.user.type);
  if (req.user.type == "project_manager") {
    res.redirect("/manager/");
  } else if (req.user.type == "accounts_manager") {
    res.redirect("/manager/");
  } else if (req.user.type == "employee") {
    res.redirect("/employee/");
  } else {
    res.redirect("/admin/");
  }
});

router.post(
  "/login",
  passport.authenticate("local.signin", {
    successRedirect: "/check-type",
    failureRedirect: "/",
    failureFlash: true,
  })
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
