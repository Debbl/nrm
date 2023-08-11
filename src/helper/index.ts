import fs from "node:fs";
import ini from "ini";
import { NPMRC_PATH, NRMRC_PATH, REGISTRIES, REGISTRY } from "../constants";

function readFile(filePath: string): Promise<Record<string, any>> {
  return new Promise((resolve) => {
    if (!fs.existsSync(filePath)) {
      resolve({});
    } else {
      try {
        const content = ini.parse(fs.readFileSync(filePath, "utf-8"));
        resolve(content);
      } catch (err) {
        console.log(err);
      }
    }
  });
}

function writeFile(filePath: string, content: Record<string, any>): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      fs.writeFileSync(filePath, ini.stringify(content));
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
  const npmrc = await readFile(NPMRC_PATH) as { registry: string; };
  return npmrc[REGISTRY] ?? "";
}

export { readFile, writeFile, getCurrentRegistry, getRegistries };
