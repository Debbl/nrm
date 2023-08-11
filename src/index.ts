/* eslint-disable no-console */
/* eslint-disable n/prefer-global/process */
import minimist from "minimist";
import prompts from "prompts";
import { gray, green, red } from "kolorist";
import type { Registries, RegistryChoice } from "./types";
import { getCurrentRegistry, getRegistries, readFile, writeFile } from "./helper";
import { NPMRC_PATH } from "./constants";

const _argv = minimist(process.argv.slice(2));

const currentRegistry = await getCurrentRegistry();
const registries = await getRegistries();

const registriesChoices: RegistryChoice[] = (
  Object.keys(registries as Registries) as Array<keyof typeof registries>
).map((name) => {
  const registry = registries[name].registry;
  return {
    title: registry === currentRegistry ? green(name) : name,
    description: registry,
    value: name,
  };
});

async function main() {
  let result: { registryName: keyof Registries; };
  try {
    result = await prompts(
      [
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
      ],
      {
        onCancel: () => {
          throw new Error(`${red("✖")} Operation cancelled`);
        },
      },
    );
  } catch (e: any) {
    console.log(e.message);
    return;
  }

  const registryName = result.registryName;
  const registry = registries[registryName].registry;

  const npmrc = await readFile(NPMRC_PATH);
  await writeFile(NPMRC_PATH, { ...npmrc, registry });

  console.log("\nDone ✨");
  console.log("Current registry is:");
  console.log(`${green(registryName)}: ${gray(registry)}`);
}

main();
