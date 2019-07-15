const inquirer = require("inquirer");
const files = require("../files");

module.exports = {
  askProjectDetails: () => {
    const argv = require("minimist")(process.argv.slice(2));

    const questions = [
      {
        type: "input",
        name: "name",
        message: "Press ^C at any time to quit.\nproject name:",
        default: argv._[0] || files.getCurrentDirectoryBase()
      },
      {
        type: "input",
        name: "version",
        default: "0.0.0",
        message: "version:"
      },
      {
        type: "input",
        name: "description",
        default: "",
        message: "Optionally enter a description of the project:"
      },
      {
        type: "input",
        name: "entryPoint",
        default: "main.js",
        message: "entry point:"
      },
      {
        type: "input",
        name: "gitRepository",
        default: "",
        message: "git repository:"
      },
      {
        type: "input",
        name: "keywords",
        default: "Inka, NodeJs, CLI",
        message: "keywords:"
      },
      {
        type: "input",
        name: "author",
        default: "LuisPe <https://github.com/LuisPe>",
        message: "author:"
      },
      {
        type: "input",
        name: "license",
        default: "ISC",
        message: "License:"
      },
      {
        type: "checkbox",
        name: "framework",
        message: "Select the framework with which you would like to work:",
        choices: ["express", "koa"]
      },
      {
        type: "checkbox",
        name: "architecture",
        message: "Select the architecture with which you would like to work:",
        choices: ["rest", "graphql", "grpc"]
      }
    ];
    return inquirer.prompt(questions);
  }
};
