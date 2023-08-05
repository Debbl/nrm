export interface Registries {
  [name: string]: {
    registry: string;
  };
}

export interface RegistryChoice {
  title: string;
  description: string;
  value: string;
}
