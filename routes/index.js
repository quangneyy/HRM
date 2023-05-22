const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/signup", function signUp(req, res, next) {
  var messages = req.flash("errors").split("\n");
  res.render("signup");
});
