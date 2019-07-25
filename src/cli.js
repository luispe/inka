#!/usr/bin/env node

import program from "commander";
import { createProject } from "./main";
import { promptForMissingOptions } from "./inquirer-prompt";

program.version("0.1.3");

program
  .command("new <name>")
  .option(
    "-y, --yes",
    "Create a new project with the default configuration (framework: expressJs, architecture: REST, git init yes, install packages yes)"
  )
  .description("Create a new API project")
  .action(async function(name, cmd) {
    let options = {
      skipPrompts: cmd.yes ? true : false,
      nameProject: name,
      version: "0.0.0",
      description: "",
      entryPoint: "main.js",
      keywords: "NodeJs, CLI",
      author: "LuisPe <https://github.com/LuisPe>",
      license: "MIT",
      gitRepository: "",
      git: false,
      runInstall: true,
      framework: "express"
    };

    let resp = await promptForMissingOptions(options);
    await createProject(resp);
  });

export async function cli() {
  program.parse(process.argv);
}
