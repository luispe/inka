import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
import { getCurrentDirectoryBase } from "./files";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    runInstall: args["--install"] || true
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "koa-rest";
  options.template = "koa-rest";
  const defaultArchitecture = "rest";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  questions.push({
    type: "input",
    name: "nameProject",
    message: "Press ^C at any time to quit.\nproject name:",
    default: getCurrentDirectoryBase()
  });
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
    default: defaultArchitecture
  });
  // if (!options.template) {
  //   questions.push({
  //     type: "list",
  //     name: "template",
  //     message: "Please choose which project template to use",
  //     choices: ["rest", "typescript"],
  //     default: defaultTemplate
  //   });
  // }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Should a git be initialized?",
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
    template: options.template,
    git: options.git || answers.git
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
