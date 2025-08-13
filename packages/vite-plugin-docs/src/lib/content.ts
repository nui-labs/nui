import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import glob from "fast-glob";
import matter from "gray-matter";
import { relative as patheRelative } from "pathe";
import { normalizePath } from "vite";

import type { ContentFile, SortOptions } from "../types";
import { sortFiles } from "./sort";
import { extractTocFromMDX } from "./toc";

const CONTENT_PATTERNS = ["**/*.md{,x}", "**/index.tsx"];
const DEMO_PATTERNS = ["**/*.mdx", "**/*.tsx"];

/**
 * Find all content files (md/mdx + index.tsx), dedupe by route (prefer md/mdx over tsx),
 * then apply optional sorting.
 */
export async function scanContents(
  dir: string,
  sort?: SortOptions,
): Promise<ContentFile[]> {
  const files = await scanFiles(dir, CONTENT_PATTERNS);

  // Dedupe by route path: prefer markdown over TSX when both exist
  const byRoute = new Map<string, ContentFile>();
  for (const file of files) {
    const existing = byRoute.get(file.path);
    if (!existing || (!file.isTsx && existing.isTsx)) {
      byRoute.set(file.path, file);
    }
  }

  return sortFiles([...byRoute.values()], sort);
}

/**
 * Find MDX/TSX demo files without deduping/sorting.
 * */
export async function scanDemos(dir: string): Promise<ContentFile[]> {
  return scanFiles(dir, DEMO_PATTERNS);
}

/**
 * Glob files under `dir` matching `patterns`, parse each via `parser`.
 * Returns only successfully parsed items.
 */
async function scanFiles(
  dir: string,
  patterns: string[],
): Promise<ContentFile[]> {
  if (!existsSync(dir)) return [];

  const files = await glob(patterns, {
    cwd: dir,
    absolute: true,
  });

  return files
    .map((fp) => parseFile(fp, dir))
    .filter((v): v is ContentFile => Boolean(v));
}

/**
 * Parse a single file into a ContentFile:
 * - Always parse frontmatter with gray-matter (TSX usually yields empty data).
 * - For TSX, keep raw source; for MD/MDX, keep trimmed content and build a TOC.
 */
function parseFile(filePath: string, dir: string): ContentFile | null {
  try {
    const raw = readFileSync(filePath, "utf8");
    const normalized = normalizePath(filePath);
    const ext = path.extname(normalized).toLowerCase();
    const isTsx = ext === ".tsx";

    const { data: meta, content } = matter(raw);
    const body = isTsx ? raw : content.trim();

    return {
      name: path.basename(normalized, ext),
      filePath: normalized,
      path: toSlug(normalized, dir),
      meta,
      content: body,
      component: () => null,
      toc: isTsx ? [] : extractTocFromMDX(body),
      isTsx,
    };
  } catch (err) {
    console.error(
      `[vite-plugin-docs] Failed to parse "${filePath}":`,
      err instanceof Error ? err.message : err,
    );
    return null;
  }
}

/**
 * Convert an absolute file path to a route slug:
 *   /abs/docs/intro.mdx  -> /docs/intro
 *   /abs/docs/index.mdx  -> /docs
 *   /abs/index.tsx       -> /
 */
function toSlug(filePath: string, dir: string): string {
  const relPath = normalizePath(patheRelative(dir, filePath));
  const segments = relPath.split("/");
  const fileBase = segments.pop()!.replace(/\.(md|mdx|tsx)$/i, "");
  const parts =
    fileBase.toLowerCase() === "index" ? segments : [...segments, fileBase];
  return parts.length ? `/${parts.join("/")}` : "/";
}
