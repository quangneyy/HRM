var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Project = require("../models/project");
var csrf = require("csurf");
var csrfProtection = csrf();
var config_passport = require("../config/passport.js");
var moment = require("moment");
var Leave = require("../models/leave");
var Attendance = require("../models/attendance");

router.use("/", isLoggedIn, function isAuthenticated(req, res, next) {
  next();
});

/**
 * Description:
 * Displays home page to the admin
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get("/", function viewHome(req, res, next) {
  res.render("Admin/adminHome", {
    title: "Admin Home",
    csrfToken: req.csrfToken(),
    userName: req.session.user.name,
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
