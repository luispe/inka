#!/usr/bin/env node

import program from "commander";
import { generate } from "./commands/generate-resources/generate";
import { newProject } from "./commands/new-project/new-project";
import { version } from "./commands/version";

version(program);
newProject(program);
generate(program);

export async function cli() {
  program.parse(process.argv);
}
