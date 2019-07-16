import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
import { getCurrentDirectoryBase } from "./files";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--name": Boolean,
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
      "-n": "--name"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    name: args._[0],
    git: args["--git"] || false,
    runInstall: args["--install"] || true
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "rest";
  const defaultArchitecture = "rest";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    };
  }

  const questions = [];
  if (!options.name) {
    questions.push({
      type: "input",
      name: "name",
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
    type: "checkbox",
    name: "framework",
    message: "Select the framework with which you would like to work:",
    choices: ["express", "koa"]
  });
  questions.push({
    type: "checkbox",
    name: "architecture",
    message: "Select the architecture with which you would like to work:",
    choices: ["rest", "graphql", "grpc"],
    default: defaultArchitecture
  });
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["rest", "typescript"],
      default: defaultTemplate
    });
  }

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
    name: options.name || answers.name,
    description: answers.description,
    entryPoint: answers.name,
    gitRepository: answers.gitRepository,
    keywords: answers.keywords,
    author: answers.author,
    license: answers.license,
    framework: answers.framework,
    architecture: answers.architecture,
    template: options.template || answers.template,
    git: options.git || answers.git
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
