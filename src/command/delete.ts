import { gray, green, red } from "kolorist";
import prompts from "prompts";
import { getCurrentRegistry, getCustomRegistries, readFile, writeFile } from "../helper";
import type { Registries, RegistryChoice } from "../types";
import { NRMRC_PATH } from "../constants";

async function onDelete() {
  const currentRegistry = await getCurrentRegistry();
  const registries = await getCustomRegistries();

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
          message: "Pick the registry to delete",
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
  const delRegistry = registries[registryName].registry;

  if (delRegistry === currentRegistry) {
    // eslint-disable-next-line no-console
    console.log(`${red("✖")} Cannot delete current registry`);
    return;
  }

  const nrmrc = await readFile(NRMRC_PATH);
  delete nrmrc[registryName];
  await writeFile(NRMRC_PATH, { ...nrmrc });

  // eslint-disable-next-line no-console
  console.log("\nDone ✨");
  // eslint-disable-next-line no-console
  console.log(`Delete registry ${red(registryName)} ${gray(delRegistry)} success`);
}

export {
  onDelete,
};

