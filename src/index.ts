import { Command } from "commander";
import { red } from "kolorist";
import { version } from "../package.json";
import { onAdd, onCurrent, onDelete, onList, onMain } from "./command";

const program = new Command();

program.version(version, "-v, --version");

program
  .description("Pick a registry from a list of npm registries.")
  .action((_, options) => {
    if (options.args.length > 0) {
      // eslint-disable-next-line no-console
      console.log(red("No command or subcommand specified. Please provide a valid command.\n"));
      program.outputHelp();
    } else {
      onMain();
    }
  });

program
  .command("list")
  .alias("ls")
  .description("List all registries.")
  .action(onList);

program
  .command("current")
  .description("Show current registry.")
  .action(onCurrent);

program
  .command("add")
  .description("Add a new registry.")
  .arguments("[name] [registry]")
  .action((name, registry) => {
    onAdd({ name, registry });
  });

program
  .command("delete")
  .alias("del")
  .description("Delete a registry.")
  .action(onDelete);

program.parse();
