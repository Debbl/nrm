import { Command } from "commander";
import { version } from "../package.json";
import onMain from "./command/main";
import onAdd from "./command/add";
import onDelete from "./command/delete";
import onList from "./command/list";

const program = new Command();

program.version(version, "-v, --version");

program
  .description("Pick a registry from a list of npm registries.")
  .action(onMain);

program
  .command("list")
  .alias("ls")
  .description("List all registries.")
  .action(onList);

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
