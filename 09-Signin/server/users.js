const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/users";

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  stuId: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  tel: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});

usersSchema.statics.authenticate = (username, password, callback) => {
  users.findOne({ username }).exec((err, res) => {
    if (err) return callback(err);
    if (!res) return callback(null, undefined);
    return callback(null, res.password === password ? res : null);
  });
};

var users = mongoose.model("Users", usersSchema);
module.exports = users;
