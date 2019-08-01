import chalk from "chalk";
import fs from "fs";
import Listr from "listr";
import path from "path";
import {
  fileExists,
  getRoottDirectoryBase,
  getCurrentDirectoryBase
} from "../../files";

import { findUp } from "../../find-up";

async function readProjectConfiguration() {
  let _configFileNames = ["inka.json"];

  let posibleDir = findUp(_configFileNames, process.cwd());
  if (!posibleDir) {
    return null;
  }

  // let wordsPath = posibleDir.split("inka.json");

  // let pathDir = wordsPath[0];

  let file = fs.readFileSync(posibleDir, "utf8");
  let configProject = JSON.parse(file);
  return configProject;
  // let projectJson = JSON.parse(file);
  // if (projectJson) {
  //   let apiPath = projectJson.project.apiPath.root;
  //   let routesPath = projectJson.project.apiPath.routePath;
  //   let appPath = projectJson.project.appPath.root;

  //   apiPath = `${pathDir}${apiPath}`;
  //   routesPath = `${pathDir}${routesPath}`;
  //   appPath = `${pathDir}${appPath}`;

  //   let configProject = { apiPath, routesPath, appPath };
  //   return configProject;
  // }
  // return null;
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
  let configProject = await readProjectConfiguration();
  console.log(configProject);

  if (!configProject) {
    console.log(
      chalk.red.bold(
        `The generate command requires to be run in an Inka project`
      )
    );
    process.exit(1);
  }

  // if (
  //   fileExists(`${posibleDir.apiPath}/${options}.js`) ||
  //   fileExists(`${posibleDir.routesPath}/${options}.js`) ||
  //   fileExists(`${posibleDir.appPath}/${options}.js`)
  // ) {
  //   console.log(
  //     chalk.red.bold(
  //       `Already exist a resource with name ${options}.js, please change the name of the resource and try again`
  //     )
  //   );
  //   process.exit(1);
  // }

  // const tasks = new Listr(
  //   [
  //     {
  //       title: "Create api file",
  //       task: () => createApiFile(posibleDir.apiDir, options)
  //     },
  //     {
  //       title: "Create route file",
  //       task: () => createRoute(posibleDir.routesDir, options)
  //     },
  //     {
  //       title: "Create app file",
  //       task: () => createAppFile(posibleDir.appDir, options)
  //     }
  //   ],
  //   {
  //     exitOnError: false
  //   }
  // );

  // await tasks.run();
  // console.log(chalk.green.bold("DONE"), `${posibleDir.apiDir}/${options}.js`);
  // console.log(
  //   chalk.green.bold("DONE"),
  //   `${posibleDir.routesDir}/${options}.js`
  // );
  // console.log(chalk.green.bold("DONE"), `${posibleDir.appDir}/${options}.js`);
}

export async function createResource(options) {
  createResourceFiles(options);
}
