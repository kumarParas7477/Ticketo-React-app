const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
var fs = require("fs");
app.use(cors());
const port = process.env.PORT || 5000;
// app.get("/events", (req, res) => {
//   res.sendFile("./Data.json", { root: __dirname });
// }
console.log(__dirname);
+app.get("/events", function(req, res) {
  res.sendFile("/Data.json", { root: __dirname });
});
app.listen(port);
