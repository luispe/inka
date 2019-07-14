#!/usr/bin/env node

const colors = require("colors");
const clear = require("clear");
const figlet = require("figlet");
const files = require("./lib/files");
const create = require("./lib/create-project");

clear();
console.log(colors.cyan(figlet.textSync("Inka", { horizontalLayout: "full" })));

// if (files.directoryExists(".git")) {
//   console.log(colors.red("Already a git repository!"));
//   process.exit();
// }

const run = async () => {
  // Create project
  await create.setupProject();
};

run();
