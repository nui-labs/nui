declare module "virtual:registry" {
  import { RegistryItem } from "./src/types";

  export const blocks: RegistryItem[];
  export const registry: RegistryItem[];
}

// External registry items from other packages (virtual:@nui/*)
declare module "virtual:@nui/*" {
  export * from "virtual:registry";
}
