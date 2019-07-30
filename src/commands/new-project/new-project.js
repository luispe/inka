const { createProject } = require("./main");
const { promptForMissingOptions } = require("./inquirer-prompt");

module.exports = {
  newProject: program => {
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
  }
};
