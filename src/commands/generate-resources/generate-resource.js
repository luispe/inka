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

  let wordsPath = posibleDir.split("inka.json");
  let configPath = wordsPath[0];

  let file = fs.readFileSync(posibleDir, "utf8");
  let configProject = JSON.parse(file);

  if (configProject) {
    let apiPath = configProject.project.apiPath.root;
    let routesPath = configProject.project.apiPath.routePath;
    let appPath = configProject.project.appPath.root;

    apiPath = `${configPath}${apiPath}`;
    routesPath = `${configPath}${routesPath}`;
    appPath = `${configPath}${appPath}`;

    let pathFiles = { apiPath, routesPath, appPath };

    return { configProject, pathFiles };
  }
  return null;
}

async function createApiFile(configFile, name) {
  let targetDirectory = configFile.pathFiles.apiPath;
  let schema = fs.readFileSync(`${__dirname}/schema.json`, "utf8");
  let schemaObject = JSON.parse(schema);
  let framework = configFile.configProject.project.framework;
  let architect = configFile.configProject.project.architect;

  let nameReplace = new RegExp("{{name}}", "g");
  if (framework in schemaObject.apiFile) {
    const file = fs.createWriteStream(
      path.join(targetDirectory, `${name}.js`),
      {
        flags: "a"
      }
    );
    schemaObject.apiFile[framework][architect].map(value => {
      file.write(value.replace(nameReplace, name) + "\r\n");
    });
    file.end();
  }
  return;
}

async function createRoute(configFile, name) {
  let targetDirectory = configFile.pathFiles.routesPath;
  let schema = fs.readFileSync(`${__dirname}/schema.json`, "utf8");
  let schemaObject = JSON.parse(schema);
  let framework = configFile.configProject.project.framework;
  let architect = configFile.configProject.project.architect;

  let nameReplace = new RegExp("{{name}}", "g");

  if (framework in schemaObject.routeFile) {
    const file = fs.createWriteStream(
      path.join(targetDirectory, `${name}.js`),
      {
        flags: "a"
      }
    );
    schemaObject.routeFile[framework][architect].map(value => {
      file.write(value.replace(nameReplace, name) + "\r\n");
    });
    file.end();
  }

  return;
}

async function createAppFile(configFile, name) {
  let targetDirectory = configFile.pathFiles.appPath;
  let schema = fs.readFileSync(`${__dirname}/schema.json`, "utf8");
  let schemaObject = JSON.parse(schema);
  let framework = configFile.configProject.project.framework;
  let architect = configFile.configProject.project.architect;

  let nameReplace = new RegExp("{{name}}", "g");

  if (framework in schemaObject.appFile) {
    const file = fs.createWriteStream(
      path.join(targetDirectory, `${name}.js`),
      {
        flags: "a"
      }
    );
    schemaObject.appFile[framework][architect].map(value => {
      file.write(value.replace(nameReplace, name) + "\r\n");
    });
    file.end();
  }

  return;
}

async function createResourceFiles(options) {
  let configProject = await readProjectConfiguration();

  if (!configProject) {
    console.log(
      chalk.red.bold(
        `The generate command requires to be run in an Inka project`
      )
    );
    process.exit(1);
  }

  if (
    fileExists(`${configProject.pathFiles.apiPath}/${options}.js`) ||
    fileExists(`${configProject.pathFiles.routesPath}/${options}.js`) ||
    fileExists(`${configProject.pathFiles.appPath}/${options}.js`)
  ) {
    console.log(
      chalk.red.bold(
        `Already exist a resource with name ${options}.js, please change the name of the resource and try again`
      )
    );
    process.exit(1);
  }

  console.log(configProject.pathFiles);

  const tasks = new Listr(
    [
      {
        title: "Create api file",
        task: () => createApiFile(configProject, options)
      },
      {
        title: "Create route file",
        task: () => createRoute(configProject, options)
      },
      {
        title: "Create app file",
        task: () => createAppFile(configProject, options)
      }
    ],
    {
      exitOnError: false
    }
  );

  await tasks.run();
  console.log(
    chalk.green.bold("DONE"),
    `${configProject.pathFiles.apiPath}/${options}.js`
  );
  console.log(
    chalk.green.bold("DONE"),
    `${configProject.pathFiles.routesPath}/${options}.js`
  );
  console.log(
    chalk.green.bold("DONE"),
    `${configProject.pathFiles.appPath}/${options}.js`
  );
}

export async function createResource(options) {
  createResourceFiles(options);
}
