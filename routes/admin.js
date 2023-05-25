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

router.get(
  "/all-employee-projects/:id",
  function getAllEmployeePojects(req, res, next) {
    var employeeId = req.params.id;
    var projectChunks = [];

    //find is asynchronous function
    Project.find({ employeeID: employeeId })
      .sort({ _id: -1 })
      .exec(function findProjectOfEmployee(err, docs) {
        var hasProject = 0;
        if (docs.length > 0) {
          hasProject = 1;
        }
        for (var i = 0; i < docs.length; i++) {
          projectChunks.push(docs[i]);
        }
        User.findById(employeeId, function getUser(err, user) {
          if (err) {
            console.log(err);
          }
          res.render("Admin/employeeAllProjects", {
            title: "List Of Employee Projects",
            hasProject: hasProject,
            projects: projectChunks,
            csrfToken: req.csrfToken(),
            user: user,
            userName: req.session.user.name,
          });
        });
      });
  }
);

router.get(
  "/leave-applications",
  function getLeaveApplications(req, res, next) {
    var leaveChunks = [];
    var employeeChunks = [];
    var temp;
    //find is asynchronous function
    Leave.find({})
      .sort({ _id: -1 })
      .exec(function findAllLeaves(err, docs) {
        var hasLeave = 0;
        if (docs.length > 0) {
          hasLeave = 1;
        }
        for (var i = 0; i < docs.length; i++) {
          leaveChunks.push(docs[i]);
        }
        for (var i = 0; i < leaveChunks.length; i++) {
          User.findById(
            leaveChunks[i].applicantID,
            function getUser(err, user) {
              if (err) {
                console.log(err);
              }
              employeeChunks.push(user);
            }
          );
        }

        // call the rest of the code and have it execute after 3 seconds
        setTimeout(render_view, 900);
        function render_view() {
          res.render("Admin/allApplications", {
            title: "List Of Leave Applications",
            csrfToken: req.csrfToken(),
            hasLeave: hasLeave,
            leaves: leaveChunks,
            employees: employeeChunks,
            moment: moment,
            userName: req.session.user.name,
          });
        }
      });
  }
);

router.get(
  "/respond-application/:leave_id/:employee_id",
  function respondApplication(req, res, next) {
    var leaveID = req.params.leave_id;
    var employeeID = req.params.employee_id;
    Leave.findById(leaveID, function getLeave(err, leave) {
      if (err) {
        console.log(err);
      }
      User.findById(employeeID, function getUser(err, user) {
        if (err) {
          console.log(err);
        }
        res.render("Admin/applicationResponse", {
          title: "Respond Leave Application",
          csrfToken: req.csrfToken(),
          leave: leave,
          employee: user,
          moment: moment,
          userName: req.session.user.name,
        });
      });
    });
  }
);

router.get(
  "/employee-profile/:id",
  function getEmployeeProfile(req, res, next) {
    var employeeId = req.params.id;
    User.findById(employeeId, function getUser(err, user) {
      if (err) {
        console.log(err);
      }
      res.render("Admin/employeeProfile", {
        title: "Employee Profile",
        employee: user,
        csrfToken: req.csrfToken(),
        moment: moment,
        userName: req.session.user.name,
      });
    });
  }
);

router.get("/edit-employee/:id", function editEmployee(req, res, next) {
  var employeeId = req.params.id;
  User.findById(employeeId, function getUser(err, user) {
    if (err) {
      res.redirect("/admin/");
    }
    res.render("Admin/editEmployee", {
      title: "Edit Employee",
      csrfToken: req.csrfToken(),
      employee: user,
      moment: moment,
      message: "",
      userName: req.session.user.name,
    });
  });
});

router.get(
  "/edit-employee-project/:id",
  function editEmployeeProject(req, res, next) {
    var projectId = req.params.id;
    Project.findById(projectId, function getProject(err, project) {
      if (err) {
        console.log(err);
      }
      res.render("Admin/editProject", {
        title: "Edit Employee",
        csrfToken: req.csrfToken(),
        project: project,
        moment: moment,
        message: "",
        userName: req.session.user.name,
      });
    });
  }
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
