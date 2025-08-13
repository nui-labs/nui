declare module "virtual:blocks" {
  import type { Block } from "./types";

  export const blocks: Block[];
  export const registry: Block[];
  export const getBlock: (id: string) => Block | undefined;
  export const getBlocksByCategory: (category: string) => Block[];
  export const getCategories: () => string[];
}

// External blocks from other packages (virtual:@nui/*)
declare module "virtual:@nui/*" {
  export * from "virtual:blocks";
}
