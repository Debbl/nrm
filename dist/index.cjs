'use strict';

const minimist = require('minimist');
const prompts = require('prompts');
const kolorist = require('kolorist');
const node_child_process = require('node:child_process');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const minimist__default = /*#__PURE__*/_interopDefaultCompat(minimist);
const prompts__default = /*#__PURE__*/_interopDefaultCompat(prompts);

const execCommand = (command) => {
  try {
    const result = node_child_process.execSync(command);
    return result;
  } catch (e) {
    console.log(e);
    process.exit(0);
  }
};

minimist__default(process.argv.slice(2));
const currentRegistry = execCommand("npm config get registry").toString().trim();
const registries = [
  {
    name: "npmmirror",
    registry: "https://registry.npmmirror.com/"
  },
  {
    name: "npm",
    registry: "https://registry.npmjs.org/"
  },
  {
    name: "yarn",
    registry: "https://registry.yarnpkg.com/"
  }
];
const registriesChoices = registries.map((r) => {
  return {
    title: r.registry === currentRegistry ? kolorist.green(r.name) : r.name,
    description: r.registry,
    value: r
  };
});
async function main() {
  const response = await prompts__default([
    {
      type: "select",
      name: "registryInfo",
      message: "Pick registry",
      choices: registriesChoices,
      initial: registries.findIndex((r) => r.registry === currentRegistry) ?? 0
    }
  ]);
  const registryInfo = response.registryInfo;
  execCommand(`npm set registry ${registryInfo.registry}`);
  console.log("\nDone:\n");
  console.log("Current registry is:\n");
  console.log(`${registryInfo.name}: ${kolorist.gray(registryInfo.registry)}`);
}
main();
