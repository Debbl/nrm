import minimist from "minimist";
import onMain from "./command/main";
import onAdd from "./command/add";

async function main() {
  // eslint-disable-next-line n/prefer-global/process
  const _argv = minimist(process.argv.slice(2));
  if (_argv._.length === 0) {
    await onMain();
  } else if (_argv._[0] === "add") {
    await onAdd({
      name: _argv._[1],
      registry: _argv._[2],
    });
  }
}

main();
