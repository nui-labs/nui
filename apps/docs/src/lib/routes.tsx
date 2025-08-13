import { contents } from "virtual:contents";
import type { ContentFile } from "@nui/plugin-docs/src";

import { NotFound } from "../components/not-found";

// Convert the routes from the docs plugin into app's format
export const routes: Pick<ContentFile, "path" | "component">[] = [
  ...contents.map((content) => ({
    ...content,
  })),
  {
    path: "*",
    component: NotFound,
  },
];
