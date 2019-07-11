import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import * as inquirer from "inquirer";
import chalk from "chalk";
import { mkdir } from "fs";
import { dirname } from "path";

export default class Create extends Command {
  static args = [
    {
      name: "apiname", // name of arg to show in help and reference with args[name]
      description: "This command create a Create API with parse in args" // help description
    }
  ];
  static flags = {
    framework: flags.string({ options: ["express", "koa", "node"] }),
    architecture: flags.string({ options: ["rest", "graphql", "grpc"] })
  };

  async run() {
    let responses: any;
    let resp = {
      nameAPI: "",
      version: "",
      framework: "",
      architecture: "",
      description: "",
      entryPoint: "",
      gitRepository: "",
      keywords: "",
      author: "",
      license: ""
    };
    // can get args as an object
    const { args } = this.parse(Create);
    const { flags } = this.parse(Create);
    let framework = flags.framework;
    let architecture = flags.architecture;
    let confirm;

    responses = await inquirer.prompt([
      {
        name: "nameAPI",
        default: args.apiname,
        message: `Press ^C at any time to quit.\napi name:`
      }
    ]);
    resp.nameAPI = responses.nameAPI;

    responses = await inquirer.prompt([
      {
        name: "version",
        default: "0.0.0",
        message: `version:`
      }
    ]);
    resp.version = responses.version;

    responses = await inquirer.prompt([
      {
        name: "description",
        default: "",
        message: `description:`
      }
    ]);
    resp.description = responses.description;

    if (!framework) {
      responses = await inquirer.prompt([
        {
          name: "framework",
          message:
            "What framework will you use for the development of the API?",
          type: "list",
          choices: [{ name: "express" }, { name: "koa" }, { name: "node" }]
        }
      ]);
    }
    resp.framework = responses.framework;

    responses = await inquirer.prompt([
      {
        name: "entryPoint",
        default: "main.js",
        message: `entry ponint API:`
      }
    ]);
    resp.entryPoint = responses.entryPoint;

    if (!architecture) {
      responses = await inquirer.prompt([
        {
          name: "architecture",
          message:
            "What architecture or protocol do you have in mind for your API?",
          type: "list",
          choices: [{ name: "rest" }, { name: "graphql" }, { name: "grpc" }]
        }
      ]);
    }
    resp.architecture = responses.architecture;

    responses = await inquirer.prompt([
      {
        name: "gitRepository",
        default: "",
        message: `git repository API:`
      }
    ]);
    resp.gitRepository = responses.gitRepository;

    responses = await inquirer.prompt([
      {
        name: "keywords",
        default: "iru, CLI, NodeJs, API",
        message: `keywords:`
      }
    ]);
    resp.keywords = responses.keywords;

    responses = await inquirer.prompt([
      {
        name: "author",
        default: "iru CLI, created for LuisPe <luispedrotoloy@gmail.com>",
        message: `author:`
      }
    ]);
    resp.author = responses.author;

    responses = await inquirer.prompt([
      {
        name: "license",
        default: "ISC",
        message: `license:`
      }
    ]);
    resp.license = responses.license;
    this.log(`${chalk.blue.bold("These were your entered values:")}
name: ${chalk.blue.bold(resp.nameAPI)}
version: ${chalk.blue.bold(resp.version)}
description: ${chalk.blue.bold(resp.description)}
framework: ${chalk.blue.bold(resp.framework)}
entry point: ${chalk.blue.bold(resp.entryPoint)}
architecture/protocol: ${chalk.blue.bold(resp.architecture)}
git repository: ${chalk.blue.bold(resp.gitRepository)}
keywords: ${chalk.blue.bold(resp.keywords)}
author: ${chalk.blue.bold(resp.author)}
license: ${chalk.blue.bold(resp.license)}
    `);
    confirm = await cli.confirm(`It's Ok? (Y/n)`);
    if (confirm) {
      let path = dirname(__dirname);
      mkdir(`${path}/${resp.nameAPI}`, err => {
        if (err) {
          this.error(
            new Error(
              `${chalk.green.bold(
                "The project could not be created verify that your current directory does not have a folder with the same name"
              )}`
            )
          );
        }
        this.log(`${chalk.blue.bold(resp.nameAPI)} created!`);
      });
    } else {
      this.exit(1);
    }
    this.log(chalk.blue.bold("Thank you for use Iru CLI"));
  }
}
