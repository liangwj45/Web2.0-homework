const fs = require("fs");

let users = {};
var pathname;

module.exports = {
  load: function(tpathname) {
    pathname = tpathname;
    fs.readFile(pathname, function(err, data) {
      if (err) return;
      try {
        users = JSON.parse(data);
      } catch (err) {
        users = {};
      }
    });
  },

  query: function(username) {
    return users[username];
  },

  create: function({ username, sid, tel, email }) {
    for (let key of Object.keys(users)) {
      let obj = users[key];
      if (obj.username == username) throw "username";
      if (obj.sid == sid) throw "sid";
      if (obj.tel == tel) throw "tel";
      if (obj.email == email) throw "email";
    }
    users[username] = { username, sid, tel, email };
    fs.writeFile(pathname, JSON.stringify(users), function(err) {
      if (err) throw err;
    });
  }
};
