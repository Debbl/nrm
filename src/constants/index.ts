/* eslint-disable n/prefer-global/process */
import path from "node:path";
import REGISTRIES from "../assets/registries.json";

const HOME = "home";
const AUTH = "_auth";
const EMAIL = "email";
const REGISTRY = "registry";
const REPOSITORY = "repository";
const ALWAYS_AUTH = "always-auth";
const REGISTRY_ATTRS = [REGISTRY, HOME, AUTH, ALWAYS_AUTH];
const NRMRC_PATH = path.join(process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"]!, ".nrmrc");
const NPMRC_PATH = path.join(process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"]!, ".npmrc");

export {
  NRMRC_PATH,
  NPMRC_PATH,
  REGISTRIES,
  AUTH,
  ALWAYS_AUTH,
  REPOSITORY,
  REGISTRY,
  HOME,
  EMAIL,
  REGISTRY_ATTRS,
};
