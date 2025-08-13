import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { relative } from "pathe";
import { normalizePath } from "vite";

import type { ContentFile } from "../types";
import { buildMarkdownToc } from "../utils/toc";

/**
 * Parse a content file (MD/MDX/TSX) into a ContentFile.
 */
export async function loadContentFile(
  filePath: string,
  rootDir: string,
): Promise<ContentFile | null> {
  try {
    const raw = await readFile(filePath, "utf8");

    const normalizedPath = normalizePath(filePath);
    const ext = path.extname(normalizedPath).toLowerCase();
    const name = path.basename(normalizedPath, ext);
    const isTsx = ext === ".tsx";

    const { data: frontMatter = {}, content: body } = matter(raw);
    const content = isTsx ? raw : body.trim();

    return {
      name,
      filePath: normalizedPath,
      path: pathToRoute(normalizedPath, rootDir),
      meta: frontMatter as Record<string, unknown>,
      content,
      component: () => null,
      toc: isTsx ? [] : buildMarkdownToc(content),
      isTsx,
    };
  } catch (error) {
    console.warn(`[content] Failed to parse "${filePath}":`, error);
    return null;
  }
}

/**
 * Component demos → mapped to `/samples` namespace.
 */
export async function loadComponentDemo(
  filePath: string,
  baseDir: string,
  category: string,
): Promise<ContentFile | null> {
  const content = await loadContentFile(filePath, baseDir);
  if (!content) return null;

  const relativePath = path.relative(baseDir, filePath);
  const subCategory = relativePath.split(path.sep)[0] || "misc";

  return {
    ...content,
    path: `/samples/${category}/${subCategory}/${content.name}`,
    meta: {
      title: content.name.replace(/-/g, " "),
      description: `${content.name} ${category} demo`,
      ...content.meta,
    },
  };
}

/**
 * Converts a file path to a route path.
 *
 * Rules:
 * - Drops extensions `.md`, `.mdx`, `.tsx`.
 * - Uses directory `index` files as the folder’s route.
 * - Ensures leading `/`.
 *
 * Example:
 *   `/docs/intro/index.mdx` → `/docs/intro`
 *   `/docs/setup.mdx`       → `/docs/setup`
 */
function pathToRoute(absPath: string, rootDir: string): string {
  const rel = normalizePath(relative(rootDir, absPath));
  const segments = rel.split("/");
  const file = segments.pop()!;
  const base = file.replace(/\.(md|mdx|tsx)$/i, "");
  const parts = base.toLowerCase() === "index" ? segments : [...segments, base];
  return parts.length ? `/${parts.join("/")}` : "/";
}
