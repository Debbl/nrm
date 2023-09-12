import { gray, green, red } from "kolorist";
import prompts from "prompts";
import { readFile, writeFile } from "../helper";
import { NRMRC_PATH } from "../constants";

async function logic() {
  let result: { customRegistryName?: string; customRegistry?: string };
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
      }
    );

    if (!result.customRegistryName || !result.customRegistry)
      throw new Error(`${red("✖")} Operation cancelled`);
    return result;
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e.message);
  }
}

async function onAdd(params?: { name?: string; registry?: string }) {
  let customRegistryName: string;
  let customRegistry: string;

  if (params && params.name && params.registry) {
    customRegistryName = params.name;
    customRegistry = params.registry;
  } else {
    const result = await logic();
    if (!result) return;

    customRegistryName = result.customRegistryName!;
    customRegistry = result.customRegistry!;
  }

  const registry = {
    [customRegistryName]: {
      registry: /\/$/.test(customRegistry)
        ? customRegistry
        : `${customRegistry}/`,
    },
  };

  const nrmrc = await readFile(NRMRC_PATH);
  await writeFile(NRMRC_PATH, { ...nrmrc, ...registry });

  // eslint-disable-next-line no-console
  console.log("\nDone ✨");
  // eslint-disable-next-line no-console
  console.log(
    `add registry ${green(customRegistryName)}: ${gray(customRegistry)}`
  );
}

export { onAdd };
