'use strict';

const minimist = require('minimist');
const prompts = require('prompts');
const kolorist = require('kolorist');
const fs = require('node:fs');
const ini = require('ini');
const path = require('node:path');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const minimist__default = /*#__PURE__*/_interopDefaultCompat(minimist);
const prompts__default = /*#__PURE__*/_interopDefaultCompat(prompts);
const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const ini__default = /*#__PURE__*/_interopDefaultCompat(ini);
const path__default = /*#__PURE__*/_interopDefaultCompat(path);

const npm = {
	home: "https://www.npmjs.org",
	registry: "https://registry.npmjs.org/"
};
const yarn = {
	home: "https://yarnpkg.com",
	registry: "https://registry.yarnpkg.com/"
};
const tencent = {
	home: "https://mirrors.cloud.tencent.com/npm/",
	registry: "https://mirrors.cloud.tencent.com/npm/"
};
const cnpm = {
	home: "https://cnpmjs.org",
	registry: "https://r.cnpmjs.org/"
};
const taobao = {
	home: "https://npmmirror.com",
	registry: "https://registry.npmmirror.com/"
};
const npmMirror = {
	home: "https://skimdb.npmjs.com/",
	registry: "https://skimdb.npmjs.com/registry/"
};
const REGISTRIES = {
	npm: npm,
	yarn: yarn,
	tencent: tencent,
	cnpm: cnpm,
	taobao: taobao,
	npmMirror: npmMirror
};

const REGISTRY = "registry";
const NRMRC_PATH = path__default.join(process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"], ".nrmrc");
const NPMRC_PATH = path__default.join(process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"], ".npmrc");

function readFile(filePath) {
  return new Promise((resolve) => {
    if (!fs__default.existsSync(filePath)) {
      resolve({});
    } else {
      try {
        const content = ini__default.parse(fs__default.readFileSync(filePath, "utf-8"));
        resolve(content);
      } catch (err) {
        console.log(err);
      }
    }
  });
}
function writeFile(filePath, content) {
  return new Promise((resolve) => {
    try {
      fs__default.writeFileSync(filePath, ini__default.stringify(content));
      resolve(true);
    } catch (err) {
      console.log(err);
    }
  });
}
async function getRegistries() {
  const customRegistries = await readFile(NRMRC_PATH);
  return { ...REGISTRIES, ...customRegistries };
}
async function getCurrentRegistry() {
  const npmrc = await readFile(NPMRC_PATH);
  return npmrc[REGISTRY] ?? "";
}

async function onMain() {
  const currentRegistry = await getCurrentRegistry();
  const registries = await getRegistries();
  const registriesChoices = Object.keys(registries).map((name) => {
    const registry2 = registries[name].registry;
    return {
      title: registry2 === currentRegistry ? kolorist.green(name) : name,
      description: registry2,
      value: name
    };
  });
  let result;
  try {
    result = await prompts__default(
      [
        {
          // nrm
          type: "select",
          name: "registryName",
          message: "Pick registry",
          choices: registriesChoices,
          initial: Object.values(registries).findIndex(
            (v) => v.registry === currentRegistry
          ) ?? 0
        }
      ],
      {
        onCancel: () => {
          throw new Error(`${kolorist.red("\u2716")} Operation cancelled`);
        }
      }
    );
    if (!result.registryName)
      throw new Error(`${kolorist.red("\u2716")} No optioned`);
  } catch (e) {
    console.log(e.message);
    return;
  }
  const registryName = result.registryName;
  const registry = registries[registryName].registry;
  const npmrc = await readFile(NPMRC_PATH);
  await writeFile(NPMRC_PATH, { ...npmrc, registry });
  console.log("\nDone \u2728");
  console.log("Current registry is:");
  console.log(`${kolorist.green(registryName)}: ${kolorist.gray(registry)}`);
}
async function onAdd() {
  let result;
  try {
    result = await prompts__default(
      [
        {
          type: "text",
          name: "customRegistryName",
          message: "Add your custom registry Name"
        },
        {
          type: (prev) => prev !== "" ? "text" : null,
          name: "customRegistry",
          message: "Add your custom registry"
        }
      ],
      {
        onCancel: () => {
          throw new Error(`${kolorist.red("\u2716")} Operation cancelled`);
        }
      }
    );
    if (!result.customRegistryName || !result.customRegistry)
      throw new Error(`${kolorist.red("\u2716")} Operation cancelled`);
  } catch (e) {
    console.log(e.message);
    return;
  }
  const customRegistryName = result.customRegistryName;
  const customRegistry = result.customRegistry;
  const registry = {
    [customRegistryName]: {
      registry: /\/$/.test(customRegistry) ? customRegistry : `${customRegistry}/`
    }
  };
  const nrmrc = await readFile(NRMRC_PATH);
  await writeFile(NRMRC_PATH, { ...nrmrc, ...registry });
  console.log("\nDone \u2728");
  console.log(
    `add registry ${kolorist.green(customRegistryName)}: ${kolorist.gray(customRegistry)}`
  );
}
const _argv = minimist__default(process.argv.slice(2));
if (_argv._.length === 0) {
  onMain();
} else if (_argv._[0] === "add") {
  onAdd();
}
