const { createResource } = require("./generate-resource");

module.exports = {
  generate: program => {
    program
      .command("generate")
      .alias("g")
      .option("-r --resource <name>", "Generate a new resource into API")
      .action(async cmd => {
        await createResource(cmd.resource);
      });
  }
};
