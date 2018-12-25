const ejs = require("ejs");
const fs = require("fs");
const url = require("url");
const middlewares = require("../server/middlewares");
const profile = "./views/profile.ejs";
const render = ejs.compile(fs.readFileSync(profile, "UTF-8"), {
  filename: profile
});

module.exports = {
  pathname: "/user/profile",
  method: "get",
  middleware: [middlewares.profile],
  handlers: (req, res) => {
    res.send(
      render({
        locals: { user: req.user, user_wrong: false }
      })
    );
  }
};
