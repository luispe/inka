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
import {
  getRoottDirectoryBase,
  fileExists,
  directoryExists
} from "../../files";
import { koarest, expressrest } from "../../select-packages";

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);
const writeGitignore = promisify(gitignore.writeFile);

async function createFolder(options) {
  if (directoryExists(options.nameProject)) {
    console.log();
    console.log(
      chalk.red.bold(
        `already existed a directory with that ${
          options.nameProject
        }, please change the name of the project and try again`
      )
    );
    console.log();
    process.exit(1);
  }
  fs.mkdir(`${options.nameProject}`, { recursive: true }, err => {
    if (err) {
      console.log(chalk.red.bgWhite("The project could not be created"));
    }
  });
  let posibleDir = `${process.cwd()}/${options.nameProject}`;
  return posibleDir;
}

async function copyTemplateFiles(options) {
  if (directoryExists(".git") || fileExists("package.json")) {
    console.log();
    console.log(
      chalk.red.bgWhite(
        "Already a git repository or package.json, please verify that you are creating the project in an empty folder"
      )
    );
    console.log();
    process.exit(1);
  }

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

async function addPackages(options) {
  switch (options.framework) {
    case "express":
      options.dependencies = expressrest.dependencies;
      break;
    case "koa":
      options.dependencies = koarest.dependencies;
      break;
    default:
      options.dependencies = expressrest.dependencies;
      break;
  }
}

async function createPackageJson(options) {
  const targetPath = path.join(options.targetDirectory, "package.json");
  const data = {
    name: options.nameProject,
    version: options.version,
    description: options.description,
    main: options.entryPoint,
    scripts: {
      start: `node ${options.entryPoint}`,
      test: 'echo "Error: no test specified" && exit 1'
    },
    keywords: options.keywords.split(",").map(function(item) {
      return item.trim();
    }),
    author: options.author,
    license: options.license,
    gitRepository: options.gitRepository
  };
  return writeFile(targetPath, JSON.stringify(data, null, " "));
}

async function createInkaJson(options) {
  const targetPath = path.join(options.targetDirectory, "inka.json");
  const data = {
    project: {
      framework: options.framework,
      architect: options.architecture,
      apiPath: {
        root: "api",
        routePath: "api/routes"
      },
      appPath: {
        root: "app"
      }
    }
  };

  return writeFile(targetPath, JSON.stringify(data, null, " "));
}

async function createLicense(options) {
  const targetPath = path.join(options.targetDirectory, "LICENSE");
  const licenseContent = license.licenseText
    .replace("<year>", new Date().getFullYear())
    .replace("<copyright holders>", `${options.nameAuthor} (${options.email})`);
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
  console.log(
    `Success! Created project ${chalk.cyan(
      options.nameProject
    )} at ${chalk.cyan(options.targetDirectory)}`
  );
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
  console.log(chalk.cyan("   cd"), `${options.nameProject}`);
  console.log(chalk.cyan("   npm start"));
  console.log();
  console.log("Happy coding!");
  console.log();
}

async function assignTemplate(options) {
  switch (options.framework) {
    case "express":
      options.template = "express-rest";
      break;
    case "koa":
      options.template = "koa-rest";
      break;

    default:
      options.template = "express-rest";
      break;
  }
}

export async function createProject(options) {
  let posibleDir = await createFolder(options);

  options = {
    ...options,
    targetDirectory: posibleDir,
    email: "luispedrotoloy@gmail.com",
    nameAuthor: "LuisPe"
  };

  await addPackages(options);

  const pkgInstall = options.dependencies.reduce(
    (pkg, version) => ({ ...pkg, [version]: undefined }),
    {}
  );

  await assignTemplate(options);

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
        title: "Create inka.json",
        task: () => createInkaJson(options)
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
