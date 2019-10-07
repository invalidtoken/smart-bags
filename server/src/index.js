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
  try {
    let { time, lat, lon } = req.query;
    if (time && lat && lon) {
      let data = JSON.parse(fs.readFileSync(getFilePath(), "utf-8"));
      console.log(req.query);
      data.locations.push(req.query);
      fs.writeFileSync(getFilePath(), JSON.stringify(data));
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (e) {
    res.sendStatus(400);
  }
});

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
