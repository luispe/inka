#!/usr/bin/env node

const colors = require("colors");
const clear = require("clear");
const figlet = require("figlet");
const files = require("./lib/files");
const create = require("./lib/create-project/create-project");

clear();
console.log(colors.cyan(figlet.textSync("Inka", { horizontalLayout: "full" })));

// if (files.directoryExists(".git")) {
//   console.log(colors.red("Already a git repository!"));
//   process.exit();
// }

const run = async () => {
  // Create project
  await create.setupProject();
  // let dir = files.getRoottDirectoryBase();

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
  // console.log(colors.cyan("   cd "), `${data.name}`);
  // console.log(colors.cyan("   npm start"));
  // console.log();
  // console.log("Happy coding!");
  // console.log();
};

run();
