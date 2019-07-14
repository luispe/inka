#!/usr/bin/env
"use strict";

process.on("unhandledRejection", err => {
  throw err;
});

const _ = require("lodash");
const CLI = require("clui");
const colors = require("colors");
const fs = require("fs");
const { spawn } = require("child_process");
const Spinner = CLI.Spinner;

const createFiles = require("./create-files");
const files = require("./files");
const inquirer = require("./inquirer");

module.exports = {
  setupProject: async () => {
    const answers = await inquirer.askProjectDetails();

    const data = {
      name: answers.name,
      version: answers.version,
      description: answers.description,
      main: answers.entryPoint,
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: answers.keywords.split(",").map(function(item) {
        return item.trim();
      }),
      author: answers.author,
      license: answers.license,
      gitRepository: answers.gitRepository
    };

    console.log();
    console.log(colors.cyan.bold("These were your entered values:"));
    console.log("name:", colors.cyan(data.name));
    console.log("version:", colors.cyan(data.version));
    console.log("description:", colors.cyan(data.description));
    console.log("entry point:", colors.cyan(data.main));
    console.log("keywords:", colors.cyan(data.keywords));
    console.log("author:", colors.cyan(data.author));
    console.log("license:", colors.cyan(data.license));
    console.log("gitRepository:", colors.cyan(data.gitRepository));
    console.log("framework:", colors.cyan(answers.framework));
    console.log("architecture:", colors.cyan(answers.architecture));
    console.log();

    let confirm = await inquirer.askConfirm();

    if (confirm.confirm) {
      const status = new Spinner("Creating folder project...");
      status.start();

      try {
        fs.mkdir(`${data.name}`, { recursive: true }, err => {
          if (err) {
            console.log(colors.red.bgWhite("The project could not be created"));
          }
        });
        let posibleDir = `${files.getRoottDirectoryBase()}/${data.name}`;
        createFiles.createPackageJson(posibleDir, data);
        installPackages(posibleDir, answers.framework);
      } catch (err) {
        if (err.code !== "EEXIST") throw err;
      } finally {
        status.stop();
      }
    } else {
      process.exit();
    }
    // let dir = path.dirname(__dirname);
    // const status = new Spinner("Initializing project...");
    // status.start();
    // console.log();
    // console.log("Initialized a git repository.");
    // console.log();
    // console.log(`Success! Created a ${data.name} at ${dir}`);
    // console.log("Inside that directory, you can run commands:");
    // console.log();
    // console.log(
    //   colors.cyan("   npm start"),
    //   "\n     Start the development server."
    // );
    // console.log();
    // console.log(
    //   colors.cyan("   npm build"),
    //   "\n      Bundles the app into static files for production."
    // );
    // console.log();
    // console.log("We suggest that you begin by typing:");
    // console.log();
    // console.log(colors.cyan("   cd "), `${dir}`);
    // console.log(colors.cyan("   npm start"));
    // console.log();
    // console.log("Happy coding!");
    // console.log();
  }
};

async function installPackages(pathDir, packages) {
  const status = new Spinner("Install dependencies...");
  status.start();
  try {
    let args;

    let command = `npm`;
    args = ["install", "--save"].filter(e => e);

    packages.map(function(item) {
      args.push(item.trim());
    });
    console.log(pathDir);
    const cd = spawn("cd ", [`${pathDir}`]);
    // const npmI = spawn(command, args);

    // cd.stdout.pipe(npmI.stdin);

    console.log(`Installing dependencies...`);
    console.log();

    return true;
  } catch (error) {
    throw error;
  } finally {
    status.stop();
  }
}
