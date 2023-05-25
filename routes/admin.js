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


router.get("/view-profile", function viewProfile(req, res, next) {
  User.findById(req.session.user._id, function getUser(err, user) {
    if (err) {
      console.log(err);
    }
    res.render("Admin/viewProfile", {
      title: "Profile",
      csrfToken: req.csrfToken(),
      employee: user,
      moment: moment,
      userName: req.session.user.name,
    });
  });
});


router.get("/view-all-employees", function viewAllEmployees(req, res, next) {
  var userChunks = [];
  var chunkSize = 3;
  //find is asynchronous function
  User.find({
    $or: [
      { type: "employee" },
      { type: "project_manager" },
      { type: "accounts_manager" },
    ],
  })
    .sort({ _id: -1 })
    .exec(function getUsers(err, docs) {
      for (var i = 0; i < docs.length; i++) {
        userChunks.push(docs[i]);
      }
      res.render("Admin/viewAllEmployee", {
        title: "All Employees",
        csrfToken: req.csrfToken(),
        users: userChunks,
        userName: req.session.user.name,
      });
    });
});

router.get("/add-employee", function addEmployee(req, res, next) {
  var messages = req.flash("error");
  var newUser = new User();

  res.render("Admin/addEmployee", {
    title: "Add Employee",
    csrfToken: req.csrfToken(),
    user: config_passport.User,
    messages: messages,
    hasErrors: messages.length > 0,
    userName: req.session.user.name,
  });
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
