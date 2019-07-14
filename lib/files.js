const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },
  getRoottDirectoryBase: () => {
    return path.dirname(__dirname);
  },
  directoryExists: nameFolder => {
    try {
      return fs.statSync(nameFolder).isDirectory();
    } catch (err) {
      return false;
    }
  },
  fileExists: file => {
    try {
      return fs.statSync(file).isFile();
    } catch (err) {
      return false;
    }
  }
};
