const http = require("http");
const users = require("./users");
const router = require("./router");

users.load("./database/users.json");

const server = http.createServer(function(req, res) {
  const { method } = req;
  switch (method) {
    case "GET":
      router.resource(req, res);
      break;
    case "POST":
      router.register(req, res);
      break;
  }
});

server.listen(8000, function() {
  console.log("Server is listening on 8000...");
});
