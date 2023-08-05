import minimist from 'minimist';
import prompts from 'prompts';
import { green, red, gray } from 'kolorist';
import { execSync } from 'node:child_process';

const execCommand = (command) => {
  try {
    const result = execSync(command);
    return result;
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

minimist(process.argv.slice(2));
const currentRegistry = execCommand("npm config get registry").toString().trim();
const registries = {
  npmmirror: {
    registry: "https://registry.npmmirror.com/"
  },
  npm: {
    registry: "https://registry.npmjs.org/"
  },
  yarn: {
    registry: "https://registry.yarnpkg.com/"
  }
};
const registriesChoices = Object.keys(registries).map(
  (name) => {
    const registry = registries[name].registry;
    return {
      title: registry === currentRegistry ? green(name) : name,
      description: registry,
      value: name
    };
  }
);
async function main() {
  let result;
  try {
    result = await prompts([
      {
        type: "select",
        name: "registryName",
        message: "Pick registry",
        choices: registriesChoices,
        initial: Object.values(registries).findIndex(
          (v) => v.registry === currentRegistry
        ) ?? 0
      }
    ], {
      onCancel: () => {
        throw new Error(`${red("\u2716")} Operation cancelled`);
      }
    });
  } catch (e) {
    console.log(e.message);
    return;
  }
  const registryName = result.registryName;
  const registry = registries[registryName].registry;
  execCommand(`npm set registry ${registry}`);
  console.log("\nDone \u2728");
  console.log("Current registry is:");
  console.log(`${green(registryName)}: ${gray(registry)}`);
}
main();
