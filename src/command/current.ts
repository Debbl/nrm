import { gray, green } from "kolorist";
import { getCurrentRegistry, getRegistries } from "../helper";
import type { Registries } from "../types";

async function onCurrent() {
  const registries = await getRegistries();

  const currentRegistry = await getCurrentRegistry();

  const registryName =
    (
      Object.keys(registries as Registries) as Array<keyof typeof registries>
    ).find((r) => registries[r].registry === currentRegistry) ??
    currentRegistry;

  // eslint-disable-next-line no-console
  console.log(
    "Current registry is:",
    green(registryName),
    gray(currentRegistry)
  );
  // eslint-disable-next-line no-console
  console.log("\nDone ✨");
}

export { onCurrent };
