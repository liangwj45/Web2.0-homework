const url = require("url");
const users = require("../server/users");

module.exports = {
  pathname: "/api/register",
  method: "put",
  handlers: (req, res, next) => {
    const query = req.body;

    if (!query) {
      res.status(400).send({ msg: "query cannot be empty" });
      return;
    }

    const { username, password, stuId, tel, email } = query;
    if (!username || !password || !stuId || !tel || !email) {
      res.status(400).send({ msg: "query missing field" });
      return;
    }

    let usernameRegex = /^[a-zA-Z]\w{5,17}$/;
    let stuIdRegex = /^[1-9]\d{7}$/;
    let telRegex = /^[1-9]\d{10}$/;
    let emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (!usernameRegex.test(username)) {
      res.status(400).send({ type: "invalid_format", field: "username" });
      return;
    }

    if (!stuIdRegex.test(stuId)) {
      res.status(400).send({ type: "invalid_format", field: "stuId" });
      return;
    }

    if (!telRegex.test(tel)) {
      res.status(400).send({ type: "invalid_format", field: "tel" });
      return;
    }

    if (!emailRegex.test(email)) {
      res.status(400).send({ type: "invalid_format", field: "email" });
      return;
    }

    users.create({ username, password, stuId, tel, email }, (err, user) => {
      if (err) return next(err);
      res.status(200).send({ type: "success" });
      return res.end("");
    });
  }
};
