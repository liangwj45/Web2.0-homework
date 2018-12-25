const url = require("url");
const users = require("../server/users");

module.exports = {
  pathname: "/api/login",
  method: "post",
  handlers: (req, res) => {
    const query = req.body;

    if (!query) {
      return res.status(400).send({ msg: "query cannot be empty" });
    }

    const { username, password } = query;
    if (!username || !password) {
      return res.status(400).send({ msg: "query missing field" });
    }

    users.authenticate(username, password, (err, user) => {
      if (err) return next(err);
      if (user === undefined) {
        res.send({ type: "not_found" });
      } else if (user == null) {
        res.send({ type: "wrong_password" });
      } else {
        req.session.userId = user._id;
        res.send({ type: "success" });
      }
    });
  }
};
