/* eslint-disable no-console */
/* eslint-disable n/prefer-global/process */
import minimist from "minimist";
import prompts from "prompts";
import { gray, green } from "kolorist";
import execCommand from "./execCommand";
import type { Registry, RegistryChoice } from "./types";

const _argv = minimist(process.argv.slice(2));

const currentRegistry = execCommand("npm config get registry").toString().trim();

const registries: Registry[] = [
  {
    name: "npmmirror",
    registry: "https://registry.npmmirror.com/",
  },
  {
    name: "npm",
    registry: "https://registry.npmjs.org/",
  },
  {
    name: "yarn",
    registry: "https://registry.yarnpkg.com/",
  },
];

const registriesChoices: RegistryChoice[] = registries.map((r) => {
  return {
    title: r.registry === currentRegistry ? green(r.name) : r.name,
    description: r.registry,
    value: r,
  };
});

async function main() {
  const response: { registryInfo: Registry; } = await prompts([
    {
      type: "select",
      name: "registryInfo",
      message: "Pick registry",
      choices: registriesChoices,
      initial: registries.findIndex((r) => r.registry === currentRegistry) ?? 0,
    },
  ]);

  const registryInfo = response.registryInfo;
  execCommand(`npm set registry ${registryInfo.registry}`);

  console.log("\nDone:\n");
  console.log("Current registry is:\n");
  console.log(`${registryInfo.name}: ${gray(registryInfo.registry)}`);
}

main();
