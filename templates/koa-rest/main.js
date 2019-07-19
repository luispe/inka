require("dotenv").config({ silent: true });
const chalk = require("chalk");
const bodyParser = require("koa-bodyparser");
const Koa = require("koa");
const logger = require("koa-logger");
const helmet = require("koa-helmet");
const routing = require("./api/routes");
const { port } = require("./config");

// Create Koa Application
const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(helmet());

routing(app);

// Start the application
app.listen(port, () => console.log(chalk.cyan(`App listen on port: ${port}`)));

module.exports = app;
