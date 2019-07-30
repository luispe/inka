const pkg = require("../../package.json");

module.exports = {
  version: program => program.version(pkg.version)
};
