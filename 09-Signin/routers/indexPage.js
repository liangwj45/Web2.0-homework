const ejs = require("ejs");
const fs = require("fs");
const url = require("url");
const middlewares = require("../server/middlewares");
const profile = "./views/profile.ejs";
const render = ejs.compile(fs.readFileSync(profile, "UTF-8"), {
  filename: profile
});

module.exports = {
  pathname: "/",
  method: "get",
  middleware: [middlewares.query],
  handlers: (req, res) => {
    res.send(
      render({ locals: { user: req.user, user_wrong: req.user_wrong } })
    );
  }
};
