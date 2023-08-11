import type registries from "./assets/registries.json";

export type Registries = {
  [name in keyof typeof registries]: {
    home: string;
    registry: string;
  };
};

export interface RegistryChoice {
  title: string;
  description: string;
  value: string;
}
