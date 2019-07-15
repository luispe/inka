const _ = require("lodash");
const colors = require("colors");
const fs = require("fs");
const touch = require("touch");
const inquirer = require("./inquirer-root");
const files = require("./files");

module.exports = {
  createPackageJson: async (dir, data) => {
    if (
      // files.fileExists("package.json") ||
      // files.fileExists("package-lock.json")
      files.fileExists("text.json") ||
      files.fileExists("text-lock.json")
    ) {
      console.log(
        colors.red.bgWhite(
          "Already exists a package.json!, please create project in another directory"
        )
      );
      process.exit();
    }
    try {
      fs.writeFileSync(`${dir}/package.json`, JSON.stringify(data, null, " "));
    } catch (err) {
      throw err;
    }
  },
  createGitignore: async () => {
    const filelist = _.without(fs.readdirSync("."), ".git", ".gitignore");

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);
      if (answers.ignore.length) {
        fs.writeFileSync(".gitignore", answers.ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    } else {
      touch(".gitignore");
    }
  }
};
