require("dotenv").config({ silent: true });
const chalk = require("chalk");
const bodyParser = require("body-parser");
const express = require("express");
const helmet = require("helmet");
const { port } = require("./config");

// Create Express Application
const app = express();
app.use(bodyParser.json()).use(helmet());

require("./api/indexRoutes")(app);

// Start the application
app.listen(port, () => console.log(chalk.cyan(`App listen on port: ${port}`)));

module.exports = app;
