import { gray, green, red } from "kolorist";
import prompts from "prompts";
import {
  getCurrentRegistry,
  getCustomRegistries,
  getRegistries,
  readFile,
  writeFile,
} from "../helper";
import type { Registries, RegistryChoice } from "../types";
import { NRMRC_PATH } from "../constants";

const registries = await getRegistries();
const customRegistries = await getCustomRegistries();
const currentRegistry = await getCurrentRegistry();

async function logic() {
  const registriesChoices: RegistryChoice[] = (
    Object.keys(customRegistries as Registries) as Array<
      keyof typeof customRegistries
    >
  ).map((name) => {
    const registry = customRegistries[name].registry;
    return {
      title: registry === currentRegistry ? green(name) : name,
      description: registry,
      value: name,
    };
  });

  const index = Object.values(customRegistries).findIndex(
    (v) => v.registry === currentRegistry
  );

  let result: { registryName: keyof Registries };
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
      }
    );

    if (!result.registryName) throw new Error(`${red("✖")} No optioned`);

    return result;
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e.message);
  }
}

async function onDelete(registry?: string) {
  let registryName = "";
  let delRegistry = "";

  if (registry) {
    registryName = registry;
  } else {
    const result = await logic();
    if (!result) return;
    registryName = result.registryName;
  }

  if (Object.keys(registries).includes(registryName)) {
    if (Object.keys(customRegistries).includes(registryName)) {
      delRegistry = customRegistries[registryName].registry;
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `${red("✖")} Cannot delete default registry ${red(registryName)} ${gray(
          registries[registryName as keyof typeof registries].registry
        )}`
      );
      return;
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(`${red("✖")} Registry Name ${red(registryName)} not found`);
    return;
  }

  if (delRegistry === currentRegistry) {
    // eslint-disable-next-line no-console
    console.log(
      `${red("✖")} Cannot delete current registry ${red(registryName)} ${gray(
        delRegistry
      )}`
    );
    return;
  }

  const nrmrc = await readFile(NRMRC_PATH);
  delete nrmrc[registryName];
  await writeFile(NRMRC_PATH, { ...nrmrc });

  // eslint-disable-next-line no-console
  console.log("\nDone ✨");
  // eslint-disable-next-line no-console
  console.log(
    `Delete registry ${red(registryName)} ${gray(delRegistry)} success`
  );
}

export { onDelete };
