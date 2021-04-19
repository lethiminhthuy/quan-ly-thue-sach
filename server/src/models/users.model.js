const mongoose = require("mongoose");

const Users = mongoose.model(
  "user",
  {
    username: String,
    password: String,
    isManager: Boolean,
    isAdmin: Boolean,
  },
  "users"
);

module.exports = Users;
