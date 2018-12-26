const url = require("url");
const users = require("../server/users");

module.exports = {
  pathname: "/api/register",
  method: "put",
  handlers: (req, res) => {
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

    let ifConflict = field => {
      let obj = {};
      obj[field] = query[field];
      return new Promise((resolve, reject) => {
        users.isConflict(obj, (err, user) => {
          if (err) reject({ err: err });
          if (user) reject({ field: field });
          resolve();
        });
      });
    };

    let conflicts = [
      ifConflict("username"),
      ifConflict("stuId"),
      ifConflict("tel"),
      ifConflict("email")
    ];

    Promise.all(conflicts)
      .then(
        () => {
          users.create(
            { username, password, stuId, tel, email },
            (err, user) => {
              if (err) res.status(500).send({ msg: err });
              req.session.userId = user._id;
              res.status(200).send({ type: "success" });
            }
          );
        },
        data => {
          if (data.err) res.status(500).send({ msg: data.err });
          res.status(409).send({ type: "conflict", field: data.field });
        }
      )
      .catch(err => {
        res.status(500).send({ msg: err });
      });
  }
};
