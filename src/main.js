import chalk from "chalk";
import execa from "execa";
import fs from "fs";
import gitignore from "gitignore";
import Listr from "listr";
import ncp from "ncp";
import path from "path";
import { install } from "pkg-install";
import license from "spdx-license-list/licenses/MIT";
import { promisify } from "util";
import { getRoottDirectoryBase } from "./files";

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);
const writeGitignore = promisify(gitignore.writeFile);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
}

async function createGitignore(options) {
  const file = fs.createWriteStream(
    path.join(options.targetDirectory, ".gitignore"),
    { flags: "a" }
  );
  return writeGitignore({
    type: "Node",
    file: file
  });
}

async function createPackageJson(options) {
  const targetPath = path.join(options.targetDirectory, "package.json");
  const data = {
    name: options.name,
    version: options.version,
    description: options.description,
    main: options.entryPoint,
    scripts: {
      test: 'echo "Error: no test specified" && exit 1'
    },
    keywords: options.keywords.split(",").map(function(item) {
      return item.trim();
    }),
    author: options.author,
    license: options.license,
    gitRepository: options.gitRepository,
    dependencies: options.framework.reduce(
      (pkg, version) => ({ ...pkg, [version]: undefined }),
      {}
    )
  };
  return writeFile(targetPath, JSON.stringify(data, null, " "));
}

async function createLicense(options) {
  const targetPath = path.join(options.targetDirectory, "LICENSE");
  const licenseContent = license.licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", `${options.name} (${options.email})`);
  return writeFile(targetPath, licenseContent, "utf8");
}

async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  return;
}

async function msgInit(options) {
  console.log();
  console.log("Initialized a git repository.");
  console.log();
  console.log(`Success! Created project at ${options.targetDirectory}`);
  console.log("Inside that directory, you can run commands:");
  console.log();
  console.log(
    chalk.cyan("   npm start"),
    "\n     Start the development server."
  );
  console.log();
  console.log(
    chalk.cyan("   npm build"),
    "\n      Bundles the app into static files for production."
  );
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("   cd "), `${options.targetDirectory}`);
  console.log(chalk.cyan("   npm start"));
  console.log();
  console.log("Happy coding!");
  console.log();
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
    email: "luispedrotoloy@gmail.com",
    name: "LuisPe"
  };

  const pkgInstall = options.framework.reduce(
    (pkg, version) => ({ ...pkg, [version]: undefined }),
    {}
  );

  const templateDir = path.resolve(
    getRoottDirectoryBase(),
    "../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = new Listr(
    [
      {
        title: "Copy project files",
        task: () => copyTemplateFiles(options)
      },
      {
        title: "Create gitignore",
        task: () => createGitignore(options)
      },
      {
        title: "Create package.json",
        task: () => createPackageJson(options)
      },
      {
        title: "Create License",
        task: () => createLicense(options)
      },
      {
        title: "Initialize git",
        task: () => initGit(options),
        enabled: () => options.git
      },
      {
        title: "Install dependencies",
        task: () => install(pkgInstall, { cwd: options.targetDirectory }),
        skip: () =>
          !options.runInstall
            ? "Pass --install to automatically install dependencies"
            : undefined
      }
    ],
    {
      exitOnError: false
    }
  );

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  msgInit(options);
  return true;
}
