const fs = require("fs");
const url = require("url");

module.exports = {
  pathname: "/login",
  method: "get",
  handlers: (req, res) => {
    res.send(fs.readFileSync("./views/login.html", "UTF-8"));
  }
};
