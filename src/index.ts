import minimist from "minimist";
import onMain from "./command/main";
import onAdd from "./command/add";
import onDelete from "./command/delete";

async function main() {
  // eslint-disable-next-line n/prefer-global/process
  const _argv = minimist(process.argv.slice(2));
  if (_argv._.length === 0) {
    await onMain();
  } else {
    switch (_argv._[0]) {
      case "add":
        await onAdd({
          name: _argv._[1],
          registry: _argv._[2],
        });
        break;
      case "del":
        await onDelete();
        break;
      case "delete":
        await onDelete();
        break;
      default:
    }
  }
}

main();
