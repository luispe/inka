const inquirer = require("inquirer");
const files = require("./files");

module.exports = {
  askConfirm: () => {
    const questions = [
      {
        type: "confirm",
        name: "confirm",
        message: "It's Ok? (Y/n):",
        default: true
      }
    ];
    return inquirer.prompt(questions);
  },
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
  },
  askIgnoreFiles: filelist => {
    const questions = [
      {
        type: "checkbox",
        name: "ignore",
        message: "Select the files and/or folders you wish to ignore:",
        choices: filelist,
        default: ["node_modules", "bower_components"]
      }
    ];
    return inquirer.prompt(questions);
  }

  // askGithubCredentials: () => {
  //   const questions = [
  //     {
  //       name: 'username',
  //       type: 'input',
  //       message: 'Enter your Github username or e-mail address:',
  //       validate: function( value ) {
  //         if (value.length) {
  //           return true;
  //         } else {
  //           return 'Please enter your username or e-mail address.';
  //         }
  //       }
  //     },
  //     {
  //       name: 'password',
  //       type: 'password',
  //       message: 'Enter your password:',
  //       validate: function(value) {
  //         if (value.length) {
  //           return true;
  //         } else {
  //           return 'Please enter your password.';
  //         }
  //       }
  //     }
  //   ];
  //   return inquirer.prompt(questions);
  // },

  // askRegeneratedToken: () => {
  //   const questions = [
  //     {
  //       name: 'token',
  //       type: 'input',
  //       message: 'Enter your new regenerated token:',
  //       validate: function( value ) {
  //         if (value.length) {
  //           return true;
  //         } else {
  //           return 'Please enter your new regenerated token:.';
  //         }
  //       }
  //     }
  //   ];
  //   return inquirer.prompt(questions);
  // },

  // askRepoDetails: () => {
  //   const argv = require('minimist')(process.argv.slice(2));

  //   const questions = [
  //     {
  //       type: 'input',
  //       name: 'name',
  //       message: 'Enter a name for the repository:',
  //       default: argv._[0] || files.getCurrentDirectoryBase(),
  //       validate: function( value ) {
  //         if (value.length) {
  //           return true;
  //         } else {
  //           return 'Please enter a name for the repository.';
  //         }
  //       }
  //     },
  //     {
  //       type: 'input',
  //       name: 'description',
  //       default: argv._[1] || null,
  //       message: 'Optionally enter a description of the repository:'
  //     },
  //     {
  //       type: 'list',
  //       name: 'visibility',
  //       message: 'Public or private:',
  //       choices: [ 'public', 'private' ],
  //       default: 'public'
  //     }
  //   ];
  //   return inquirer.prompt(questions);
  // },
};
