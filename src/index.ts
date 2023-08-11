/* eslint-disable n/prefer-global/process */
import minimist from "minimist";
import prompts from "prompts";
import { gray, green, red } from "kolorist";
import type { Registries, RegistryChoice } from "./types";
import {
  getCurrentRegistry,
  getRegistries,
  readFile,
  writeFile,
} from "./helper";
import { NPMRC_PATH, NRMRC_PATH } from "./constants";

async function onMain() {
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

  const index = Object.values(registries).findIndex(
    (v) => v.registry === currentRegistry,
  );

  let result: { registryName?: keyof Registries; };
  try {
    result = await prompts(
      [
        {
          type: "select",
          name: "registryName",
          message: "Pick registry",
          choices: registriesChoices,
          initial: index === -1 ? 0 : index,
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red("✖")} Operation cancelled`);
        },
      },
    );

    if (!result.registryName) throw new Error(`${red("✖")} No optioned`);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e.message);
    return;
  }

  const registryName = result.registryName;
  const registry = registries[registryName].registry;

  const npmrc = await readFile(NPMRC_PATH);
  await writeFile(NPMRC_PATH, { ...npmrc, registry });

  // eslint-disable-next-line no-console
  console.log("\nDone ✨");
  // eslint-disable-next-line no-console
  console.log("Current registry is:");
  // eslint-disable-next-line no-console
  console.log(`${green(registryName)}: ${gray(registry)}`);
}

async function onAdd() {
  let result: { customRegistryName?: string; customRegistry?: string; };
  try {
    result = await prompts(
      [
        {
          type: "text",
          name: "customRegistryName",
          message: "Add your custom registry Name",
        },
        {
          type: (prev) => (prev !== "" ? "text" : null),
          name: "customRegistry",
          message: "Add your custom registry",
        },
      ],
      {
        onCancel: () => {
          throw new Error(`${red("✖")} Operation cancelled`);
        },
      },
    );

    if (!result.customRegistryName || !result.customRegistry)
      throw new Error(`${red("✖")} Operation cancelled`);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e.message);
    return;
  }

  const customRegistryName = result.customRegistryName;
  const customRegistry = result.customRegistry;

  const registry = {
    [customRegistryName]: {
      registry: /\/$/.test(customRegistry) ? customRegistry : `${customRegistry}/`,
    },
  };

  const nrmrc = await readFile(NRMRC_PATH);
  await writeFile(NRMRC_PATH, { ...nrmrc, ...registry });

  // eslint-disable-next-line no-console
  console.log("\nDone ✨");
  // eslint-disable-next-line no-console
  console.log(
    `add registry ${green(customRegistryName)}: ${gray(customRegistry)}`,
  );
}

async function main() {
  const _argv = minimist(process.argv.slice(2));
  if (_argv._.length === 0) {
    await onMain();
  } else if (_argv._[0] === "add") {
    onAdd();
  }
}

main();
