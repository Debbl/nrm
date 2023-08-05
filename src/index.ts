/* eslint-disable no-console */
/* eslint-disable n/prefer-global/process */
import minimist from "minimist";
import prompts from "prompts";
import { gray, green, red } from "kolorist";
import execCommand from "./execCommand";
import type { Registries, RegistryChoice } from "./types";

const _argv = minimist(process.argv.slice(2));

const currentRegistry = execCommand("npm config get registry")
  .toString()
  .trim();

const registries: Registries = {
  npmmirror: {
    registry: "https://registry.npmmirror.com/",
  },
  npm: {
    registry: "https://registry.npmjs.org/",
  },
  yarn: {
    registry: "https://registry.yarnpkg.com/",
  },
};

const registriesChoices: RegistryChoice[] = Object.keys(registries).map(
  (name) => {
    const registry = registries[name].registry;
    return {
      title: registry === currentRegistry ? green(name) : name,
      description: registry,
      value: name,
    };
  },
);

async function main() {
  let result: { registryName: string; };
  try {
    result = await prompts([
      {
        type: "select",
        name: "registryName",
        message: "Pick registry",
        choices: registriesChoices,
        initial:
        Object.values(registries).findIndex(
          (v) => v.registry === currentRegistry,
        ) ?? 0,
      },
    ], {
      onCancel: () => {
        throw new Error(`${red("✖")} Operation cancelled`);
      },
    });
  } catch (e: any) {
    console.log(e.message);
    return;
  }

  const registryName = result.registryName;
  const registry = registries[registryName].registry;
  execCommand(`npm set registry ${registry}`);

  console.log("\nDone ✨");
  console.log("Current registry is:");
  console.log(`${green(registryName)}: ${gray(registry)}`);
}

main();
