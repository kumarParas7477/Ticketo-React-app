const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
var fs = require("fs");
app.use(cors());
const axios = require("axios");
const port = process.env.PORT || 3001;
// app.get("/events", (req, res) => {
//   res.sendFile("./Data.json", { root: __dirname });
// }
// console.log(__dirname);
// +app.get("/events", function(req, res) {
//   res.sendFile("./Data.json", { root: __dirname });
// });
const dataPath = "./Data.json";
+app.get("/*", function(req, res) {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }

    res.send(JSON.parse(data));
  });
});
app.use(express.static(path.join(__dirname, "client/build")));
// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => console.log(`listening at ${port}`));
