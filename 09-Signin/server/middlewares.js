const url = require("url");
const users = require("./users");

module.exports = {
  profile: (req, res, next) => {
    if (req.session && req.session.userId) {
      users.findById(req.session.userId).exec((err, user) => {
        if (err) return next(err);
        if (user) {
          success = true;
          req.user = {
            username: user.username,
            tel: user.tel,
            email: user.email,
            stuId: user.stuId
          };
          return next();
        }
      });
    } else {
      res.redirect("/login");
    }
  },
  query: (req, res, next) => {
    let arg = url.parse(req.url, true).query;
    if (req.session && req.session.userId) {
      if (req.url == "/") {
        res.redirect("/user/profile");
      } else {
        users.findById(req.session.userId).exec((err, user) => {
          if (err) return next(err);
          if (user) {
            success = true;
            req.user = {
              username: user.username,
              tel: user.tel,
              email: user.email,
              stuId: user.stuId
            };
            req.user_wrong = arg.username && arg.username != user.username;
            return next();
          }
        });
      }
    } else {
      res.redirect("/login");
    }
  }
};
