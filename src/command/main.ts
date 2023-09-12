import { gray, green, red } from "kolorist";
import prompts from "prompts";
import { getCurrentRegistry, getRegistries, readFile, writeFile } from "../helper";
import type { Registries, RegistryChoice } from "../types";
import { NPMRC_PATH } from "../constants";

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

export {
  onMain,
};
