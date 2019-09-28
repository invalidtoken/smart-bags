const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");

app.use(express.static(path.resolve(__dirname, "../../client", "public")));

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

app.get("/empty", (req, res, next) => {
  fs.writeFileSync("./data.json", JSON.stringify({ locations: [] }));
  res.sendStatus(200);
});

app.get("*", (request, response) => {
  response.sendFile(
    path.resolve(__dirname, "../../client", "public/index.html")
  );
});

app.listen(port, () => {
  console.log(`Server running on - ${port}`);
});
