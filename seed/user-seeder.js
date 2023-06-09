var User = require("../models/user");
var bcrypt = require("bcrypt-nodejs");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("localhost:27017/HRM");

var users = [
  new User({
    type: "project_manager",
    email: "hale@pm.com",
    password: bcrypt.hashSync("hale123", bcrypt.genSaltSync(5), null),
    name: "Ha Le",
    dateOfBirth: new Date("1990-05-26"),
    contactNumber: "0333-4552191",
  }),
  new User({
    type: "accounts_manager",
    email: "lynguyen@am.com",
    password: bcrypt.hashSync("lynguyen123", bcrypt.genSaltSync(5), null),
    name: "Ly Nguyen",
    dateOfBirth: new Date("1990-05-26"),
    contactNumber: "0300-4814710",
  }),
  new User({
    type: "employee",
    email: "vientran@gmail.com",
    password: bcrypt.hashSync("123456", bcrypt.genSaltSync(5), null),
    name: "Vien Tran",
    dateOfBirth: new Date("1990-05-26"),
    contactNumber: "0333-4552191",
  }),
  new User({
    type: "employee",
    email: "sanhaQ@outlook.com",
    password: bcrypt.hashSync("123456", bcrypt.genSaltSync(5), null),
    name: "San Ha",
    dateOfBirth: new Date("1990-05-26"),
    contactNumber: "0300-4814710",
  }),
  new User({
    type: "admin",
    email: "admin@admin.com",
    password: bcrypt.hashSync("admin123", bcrypt.genSaltSync(5), null),
    name: "Chuc nguyen",
    dateOfBirth: new Date("1990-05-26"),
    contactNumber: "0300-4297859",
  }),
];
//save function is asynchronous
//so we need to ceck all itmes are saved before we disconnect to db
done = 0;
for (i = 0; i < users.length; i++) {
  users[i].save(function (err, result) {
    done++;
    if (done == users.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
