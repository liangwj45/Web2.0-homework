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
  users.findOne({ username }).exec((err, user) => {
    if (err) return callback(err);
    if (!user) return callback(null, undefined);
    callback(null, user.password === password ? user : null);
  });
};

usersSchema.statics.isConflict = (data, callback) => {
  users.find(data, (err, user) => {
    if (err) return callback(err);
    if (user != false) return callback(null, user[0]);
    callback(null, null);
  });
};

var users = mongoose.model("Users", usersSchema);
module.exports = users;
