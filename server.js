const express = require("express");
const bodyparser = require("body-parser");
let data = require("./data.json");
let fs = require("fs");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  res.json({ locations: data.locations, len: data.locations.length });
});

app.get("/data", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
  data.locations.push(req.query);
  fs.writeFileSync("./data.json", JSON.stringify(data));
  res.sendStatus(200);
});

app.post(
  "/data",
  (req, res, next) => {
    // time, lat, lon
    let string = "";
    req.on("data", chunk => {
      string += chunk;
    });

    req.on("end", () => {
      let arr = string.split(",");
      req.body = { time: arr[0], lat: arr[1], lon: arr[2] };
      next();
    });
  },
  (req, res) => {
    let data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));
    data.locations.push(req.body);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.sendStatus(200);
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
