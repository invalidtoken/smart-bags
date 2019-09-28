const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const fs = require("fs");

const getFilePath = () => path.resolve(__dirname, "data.json");

app.get("/api/data", (req, res) => {
  let data = JSON.parse(fs.readFileSync(getFilePath(), "utf-8"));
  res.json({ locations: data.locations, len: data.locations.length });
});

app.get("/api/store-location", (req, res) => {
  let data = JSON.parse(fs.readFileSync(getFilePath(), "utf-8"));
  data.locations.push(req.query);
  fs.writeFileSync(getFilePath(), JSON.stringify(data));
  res.sendStatus(200);
});

app.post(
  "/api/store-location",
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
    let data = JSON.parse(fs.readFileSync(getFilePath(), "utf-8"));
    data.locations.push(req.body);
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.sendStatus(200);
  }
);

app.get("/api/empty-database", (req, res, next) => {
  fs.writeFileSync(getFilePath(), JSON.stringify({ locations: [] }));
  res.sendStatus(200);
});

app.use(express.static(path.resolve(__dirname, "../../client/", "public")));

app.get("*", (request, response) => {
  response.sendFile(
    path.resolve(__dirname, "../../client/", "public/index.html")
  );
});

app.listen(port, () => {
  console.log(`Server running on - ${port}`);
});
