import inquirer from "inquirer";

export async function promptForMissingOptions(options) {
  const defaultTemplate = "express-rest";
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
    default: options.nameProject
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "-")
      .toLowerCase()
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
    default: "MIT",
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
    nameProject: answers.nameProject
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "-")
      .toLowerCase(),
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
