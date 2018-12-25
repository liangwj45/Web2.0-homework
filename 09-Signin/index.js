const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const routers = require("./server/routers");

mongoose.connect("mongodb://localhost/web");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", () => {});

const app = express();
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "16303050",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db })
  })
);

Object.keys(routers)
  .map(key => routers[key])
  .forEach(router => {
    if (router.middleware)
      app[router.method](router.pathname, router.middleware, router.handlers);
    else app[router.method](router.pathname, router.handlers);
  });

app.listen(8000);
