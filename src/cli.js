#!/usr/bin/env node

import program from "commander";
import inquirer from "inquirer";
import { createProject } from "./main";
import { getCurrentDirectoryBase } from "./files";

program.version("0.1.0");

program
  .command("new [name]")
  .option(
    "-y, --yes",
    "Create a new project with the default configuration (framework: expressJs, architecture: REST, git init yes, install packages yes)"
  )
  .action(async function(name, cmd) {
    let options = {
      skipPrompts: cmd.yes ? true : false,
      nameProject: name,
      version: "0.0.0",
      description: "",
      entryPoint: "main.js",
      keywords: "NodeJs, CLI",
      author: "LuisPe <https://github.com/LuisPe>",
      license: "ISC",
      gitRepository: "",
      git: false,
      runInstall: false,
      framework: "express"
    };

    let resp = await promptForMissingOptions(options);
    await createProject(resp);
  });
export async function cli() {
  program.parse(process.argv);
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "express-rest";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  if (!options.nameProject) {
    questions.push({
      type: "input",
      name: "nameProject",
      message: "Press ^C at any time to quit.\nproject name:",
      default: getCurrentDirectoryBase()
    });
  }
  questions.push({
    type: "input",
    name: "description",
    default: "",
    message: "Optionally enter a description of the project:"
  });
  questions.push({
    type: "input",
    name: "entryPoint",
    default: "main.js",
    message: "entry point:"
  });
  questions.push({
    type: "input",
    name: "gitRepository",
    default: "",
    message: "git repository:"
  });
  questions.push({
    type: "input",
    name: "keywords",
    default: "Inka, NodeJs, CLI",
    message: "keywords:"
  });
  questions.push({
    type: "input",
    name: "author",
    default: "LuisPe <https://github.com/LuisPe>",
    message: "author:"
  });
  questions.push({
    type: "input",
    name: "license",
    default: "ISC",
    message: "License:"
  });
  questions.push({
    type: "list",
    name: "framework",
    message: "Select the framework with which you would like to work:",
    choices: ["express", "koa"]
  });
  questions.push({
    type: "list",
    name: "architecture",
    message: "Select the architecture with which you would like to work:",
    choices: ["rest", "graphql", "grpc"],
    default: "rest"
  });

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Should a git be initialized?",
      default: false
    });
  }

  if (!options.runInstall) {
    questions.push({
      type: "confirm",
      name: "runInstall",
      message: "Should a npm packages be initialized?",
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    nameProject: answers.nameProject,
    description: answers.description,
    entryPoint: answers.entryPoint,
    gitRepository: answers.gitRepository,
    keywords: answers.keywords,
    author: answers.author,
    license: answers.license,
    framework: answers.framework,
    architecture: answers.architecture,
    git: options.git || answers.git,
    runInstall: options.runInstall || answers.runInstall
  };
}

// export async function cli(args) {
//   let options = parseArgumentsIntoOptions(args);
//   options = await promptForMissingOptions(options);
//   await createProject(options);
// }
