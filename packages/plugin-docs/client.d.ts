declare module "virtual:contents" {
  import { ContentFile, NavItem } from "./src/types";

  export const contents: ContentFile[];
  export const navigation: NavItem[];
}
