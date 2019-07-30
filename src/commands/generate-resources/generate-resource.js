import chalk from "chalk";
// import execa from "execa";
import fs from "fs";
// import gitignore from "gitignore";
import Listr from "listr";
import ncp from "ncp";
import path from "path";
// import { install } from "pkg-install";
// import license from "spdx-license-list/licenses/MIT";
import { promisify } from "util";
import {
  getRoottDirectoryBase,
  fileExists,
  directoryExists
} from "../../files";
// import { koarest, expressrest } from "../../select-packages";

// const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
// const copy = promisify(ncp);

async function targetDirectory() {
  let apiDir = `${process.cwd()}/api`;
  let routesDir = `${process.cwd()}/api/routes`;
  let appDir = `${process.cwd()}/app`;
  let posibleDir = { apiDir, routesDir, appDir };
  return posibleDir;
}

async function createApiFile(targetDirectory, name) {
  const file = fs.createWriteStream(path.join(targetDirectory, `${name}.js`), {
    flags: "a"
  });
  file.write(`const ${name}Controller = require ("../app/${name}");
  module.exports = {
    callFunc: async (req, res, next) => {
      try {
        let resp = await ${name}Controller.check();
        res.status(resp.statusCode).json(resp.message);
      } catch (error) {
        next(error);
      }
    }
  };
  `);
  file.end();
  return;
}

async function createRoute(targetDirectory, name) {
  const file = fs.createWriteStream(path.join(targetDirectory, `${name}.js`), {
    flags: "a"
  });
  let route = name.toLowerCase();
  file.write(`module.exports = function(app) {
  const express = require("express");
  const router = express.Router();
  const resp${name} = require("../${name}");
  // Route for ${name} listen API /${name} => GET
  router.get("/${route}", resp${name}.callFunc);

  app.use("/", router);
};
  `);
  file.end();
  return;
}

async function createAppFile(targetDirectory, name) {
  const file = fs.createWriteStream(path.join(targetDirectory, `${name}.js`), {
    flags: "a"
  });
  file.write(`module.exports = {
  check: async () => {
    try {
      let message = '${name} Controller generate with inka CLI';
      let statusCode = 200;
      let resp = { statusCode, message };
      return resp;
    } catch (error) {
      throw Error(error);
    }
  }
};
  `);
  file.end();
  return;
}

async function createResourceFiles(options) {
  let posibleDir = await targetDirectory();

  if (
    fileExists(`${posibleDir.apiDir}/${options}.js`) ||
    fileExists(`${posibleDir.app}/${options}.js`) ||
    fileExists(`${posibleDir.routesDir}/${options}.js`)
  ) {
    console.log();
    console.log(
      chalk.red.bold(
        `already exist a resource with name ${options}.js, please change the name of the resource and try again`
      )
    );
    console.log();
    process.exit(1);
  }

  const tasks = new Listr(
    [
      {
        title: "Create api file",
        task: () => createApiFile(posibleDir.apiDir, options)
      },
      {
        title: "Create route file",
        task: () => createRoute(posibleDir.routesDir, options)
      },
      {
        title: "Create app file",
        task: () => createAppFile(posibleDir.appDir, options)
      }
    ],
    {
      exitOnError: false
    }
  );

  await tasks.run();
  console.log(chalk.green.bold("DONE"), `${posibleDir.apiDir}/${options}.js`);
  console.log(
    chalk.green.bold("DONE"),
    `${posibleDir.routesDir}/${options}.js`
  );
  console.log(chalk.green.bold("DONE"), `${posibleDir.appDir}/${options}.js`);
}

export async function createResource(options) {
  createResourceFiles(options);
}
