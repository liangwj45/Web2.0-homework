const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/random", (req, res) => {
  setTimeout(() => {
    res.writeHead(200, { "Content-type": "text/plain" });
    res.end("" + rand(1, 10));
  }, rand(1000, 3000));
});

app.listen(3000, () => console.log("Server listening on port 3000!"));

function rand(beg, end) {
  return beg + Math.round(Math.random() * (end - beg));
}
