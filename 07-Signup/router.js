const fs = require("fs");
const http = require("http");
const users = require("./users");

const usernameRegex = /^[a-zA-Z]\w{5,17}$/;
const stuIdRegex = /^[1-9]\d{7}$/;
const telRegex = /^[1-9]\d{10}$/;
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function resource(req, res) {
  const url = req.url;
  if (url.indexOf("..") != -1) {
    res.writeHead(400);
    res.end("Not a valid path");
    return;
  }
  res.json = json;
  if (url.indexOf("?") != -1) {
    fs.readFile("./template/userinfo.html", function(err, data) {
      if (err) return;
      let username = url.substr(url.indexOf("=") + 1);
      if (!users.query(username)) {
        fof(res, "404");
        return;
      }
      let { sid, tel, email } = users.query(username);
      let page = data.toString();
      page = page
        .replace(/#username#/, username)
        .replace(/#sid#/, sid)
        .replace(/#tel#/, tel)
        .replace(/#email#/, email);
      res.write(page);
      res.end();
    });
    return;
  }
  let pathname = url == "/" ? "public/index.html" : "public" + url;
  let type = pathname.substr(pathname.lastIndexOf(".") + 1);
  fs.exists(pathname, function(exist) {
    if (!exist) {
      fof(res, "404");
      return;
    }
    res.writeHead(200, { "Content-type": "text/" + type });
    fs.readFile(pathname, function(err, data) {
      if (err) return;
      res.end(data);
    });
  });
}

function fof(res, path) {
  fs.readFile(`./template/${path}.html`, function(err, data) {
    if (err) return;
    res.write(data);
    res.end();
  });
}

function json(data = {}) {
  this.statusCode = 200;
  this.setHeader("Content-Type", "application/json");
  this.end(JSON.stringify(data));
}

function register(req, res) {
  let data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  req.on("end", function() {
    req.body = JSON.parse(data);
    const { username, sid, tel, email } = req.body;
    res.json = json;

    if (!username || !sid || !tel || !email) {
      res.json({
        code: 400,
        msg: "Empty Arguments"
      });
      return;
    }
    if (!usernameRegex.test(username)) {
      res.json({
        code: 400,
        msg: "Username is invalid."
      });
      return;
    }
    if (!stuIdRegex.test(sid)) {
      res.json({
        code: 400,
        msg: "Student id is invalid."
      });
      return;
    }
    if (!telRegex.test(tel)) {
      res.json({
        code: 400,
        msg: "Telephone number is invalid."
      });
      return;
    }
    if (!emailRegex.test(email)) {
      res.json({
        code: 400,
        msg: "E-mail address is invalid."
      });
      return;
    }
    try {
      users.create({
        username,
        sid,
        tel,
        email
      });
      res.json({ code: 200 });
      return;
    } catch (err) {
      if (typeof err === "string") {
        let ms = `Field ${err} conflicts`;
        res.json({
          code: 409,
          msg: ms,
          field: err
        });
        return;
      }
      res.json({
        code: 400,
        msg: "err"
      });
    }
  });
  return;
}

module.exports = { resource, register };
