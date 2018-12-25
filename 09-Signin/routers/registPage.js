const fs = require("fs");
const url = require("url");

module.exports = {
  pathname: "/user/register",
  method: "get",
  handlers: (req, res) => {
    res.send(fs.readFileSync("./views/regist.html", "UTF-8"));
  }
};
