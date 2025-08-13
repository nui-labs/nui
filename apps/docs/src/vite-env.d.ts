/// <reference types="vite/client" />

declare module "virtual:docs" {
  import type { ContentFile, NavItem } from "@nui/vite-plugin-docs";
  export const contents: ContentFile[];
  export const navigation: NavItem[];
}

declare module "virtual:demos" {
  import type { ContentFile } from "@nui/vite-plugin-docs";
  export const contents: ContentFile[];
}

declare module "virtual:blocks" {
  import type { Block } from "@nui/vite-plugin-docs";
  export const blocks: Block[];
}
