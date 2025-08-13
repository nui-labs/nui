/// <reference types="vite/client" />

declare module "virtual:contents" {
  import type { ContentFile, NavItem } from "@nui/vite-plugin-docs";
  export const contents: ContentFile[];
  export const navigation: NavItem[];
}

declare module "virtual:samples" {
  import type { Block, ContentFile } from "@nui/vite-plugin-docs";
  export const components: ContentFile[];
  export const blocks: Block[];
}
