import { gray, green } from "kolorist";
import { getCurrentRegistry, getRegistries } from "../helper";
import type { Registries, RegistryChoice } from "../types";

async function onList() {
  const currentRegistry = await getCurrentRegistry();
  const registries = await getRegistries();

  const registriesChoices: RegistryChoice[] = (
    Object.keys(registries as Registries) as Array<keyof typeof registries>
  ).map((name) => {
    const registry = registries[name].registry;
    return {
      title: registry === currentRegistry ? green(name) : name,
      description: gray(registry),
      value: name,
    };
  });

  const index = Object.values(registries).findIndex(
    (v) => v.registry === currentRegistry,
  );

  registriesChoices.forEach((r, i) => {
    // eslint-disable-next-line no-console
    console.log(`${i === index ? "›" : " "} ${r.title} ${r.description}`);
  });
}

export default onList;
