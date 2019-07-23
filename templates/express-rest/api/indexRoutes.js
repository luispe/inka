const express = require("express");
const router = express.Router();
const fs = require("fs");
let files = [];

module.exports = async function(app) {
  files = fs.readdirSync("./api/routes");
  files.forEach(routeFile => {
    require(`./routes/${routeFile}`)(app);
  });
  app.use("/", router);
};
