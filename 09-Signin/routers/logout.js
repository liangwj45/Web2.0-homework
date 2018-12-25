const url = require("url");

module.exports = {
  pathname: "/user/logout",
  method: "get",
  handlers: (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) return next(err);
        res.redirect("/login");
      });
    }
  }
};
