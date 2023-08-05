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
const registries = {
  npmmirror: {
    registry: "https://registry.npmmirror.com/"
  },
  npm: {
    registry: "https://registry.npmjs.org/"
  },
  yarn: {
    registry: "https://registry.yarnpkg.com/"
  }
};
const registriesChoices = Object.keys(registries).map(
  (name) => {
    const registry = registries[name].registry;
    return {
      title: registry === currentRegistry ? kolorist.green(name) : name,
      description: registry,
      value: name
    };
  }
);
async function main() {
  let result;
  try {
    result = await prompts__default([
      {
        type: "select",
        name: "registryName",
        message: "Pick registry",
        choices: registriesChoices,
        initial: Object.values(registries).findIndex(
          (v) => v.registry === currentRegistry
        ) ?? 0
      }
    ]);
  } catch (e) {
    console.log(e.message);
    return;
  }
  const registryName = result.registryName;
  const registry = registries[registryName].registry;
  execCommand(`npm set registry ${registry}`);
  console.log("\nDone \u2728");
  console.log("Current registry is:");
  console.log(`${kolorist.green(registryName)}: ${kolorist.gray(registry)}`);
}
main();
