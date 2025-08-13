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
 * Converts a file path to a route path.
 *
 * Rules:
 * - Drops extensions `.md`, `.mdx`, `.tsx`.
 * - Uses directory `page` files as the folder’s route.
 * - Ensures leading `/`.
 *
 * Example:
 *   `/docs/intro/page.mdx` → `/docs/intro`
 *   `/docs/setup.mdx`      → `/docs/setup`
 */
function pathToRoute(absPath: string, rootDir: string): string {
  const rel = normalizePath(relative(rootDir, absPath));
  const segments = rel.split("/");
  const file = segments.pop()!;
  const base = file.replace(/\.(md|mdx|tsx)$/i, "");
  const parts = base.toLowerCase() === "page" ? segments : [...segments, base];
  return parts.length ? `/${parts.join("/")}` : "/";
}
