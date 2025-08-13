import { promises as fs } from "fs";
import path from "path";

import type { ContentFile } from "../types";

type AssetPaths = { js: string; css: string };

/**
 * Generate static HTML files for all content files.
 * Creates an index.html file for each content entry with proper asset links.
 */
export async function generateStaticFiles(
  files: ContentFile[],
  outDir: string,
  basePath: string = "/",
): Promise<void> {
  await fs.mkdir(outDir, { recursive: true });

  // Resolve JS/CSS asset paths from build output
  const assets = await resolveAssets(outDir, basePath);

  // Generate HTML file for each content entry
  await Promise.all(
    files.map(async (file) => {
      const html = renderHtml(file, assets, basePath);
      const outFile = outputPathFor(outDir, file.path);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, html, "utf8");
    }),
  );
}

/** Ensure base path starts with "/" */
function normalizeBase(basePath: string = "/"): string {
  if (!basePath) return "/";
  return basePath.startsWith("/") ? basePath : `/${basePath}`;
}

/** Convert content path to safe output file path */
function outputPathFor(outDir: string, contentPath: string = ""): string {
  const safe = contentPath.replace(/(\.\.\/)+/g, "").replace(/\\/g, "/");
  return path.join(outDir, safe, "index.html");
}

/**
 * Resolve JS and CSS asset paths from build output.
 * First tries Vite's manifest.json, then scans assets directory.
 */
async function resolveAssets(
  outDir: string,
  basePath: string,
): Promise<AssetPaths> {
  const base = normalizeBase(basePath);

  // Try Vite's manifest.json for hashed asset names
  try {
    const manifest = JSON.parse(
      await fs.readFile(path.join(outDir, "manifest.json"), "utf8"),
    );

    const entry = Object.values(manifest).find((x: any) => x.isEntry) as any;
    if (entry?.file) {
      return {
        js: joinUrl(base, entry.file),
        css: entry.css?.[0] ? joinUrl(base, entry.css[0]) : "",
      };
    }
  } catch {}

  // Fallback: scan assets directory for index-* files
  try {
    const files = await fs.readdir(path.join(outDir, "assets"));
    const cssName = files.find(
      (f) => f.startsWith("index-") && f.endsWith(".css"),
    );
    const jsName =
      files.find((f) => f.startsWith("index-") && f.endsWith(".js")) ||
      "index.js";

    return {
      css: cssName ? joinUrl(base, "assets", cssName) : "",
      js: joinUrl(base, "assets", jsName),
    };
  } catch {
    // Last resort fallback
    return { css: "", js: joinUrl(base, "assets/index.js") };
  }
}

/** Generate complete HTML document for a content file */
function renderHtml(
  file: ContentFile,
  assets: AssetPaths,
  basePath: string,
): string {
  const title = file.meta?.title || "Documentation";
  const description = file.meta?.description || "Documentation page";
  const canonical = joinUrl(normalizeBase(basePath), file.path || "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />


  ${assets.css ? `<link rel="preload" href="${assets.css}" as="style" />` : ""}
  <link rel="preload" href="${assets.js}" as="script" />
  ${assets.css ? `<link rel="stylesheet" href="${assets.css}" />` : ""}
</head>
<body>
  <div id="root">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </div>

  <script type="module" src="${assets.js}"></script>
</body>
</html>`;
}

/** Escape HTML special characters */
function escapeHtml(text = ""): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Join URL segments without duplicate slashes */
function joinUrl(...segments: string[]): string {
  return segments
    .filter(Boolean)
    .map((segment, index) =>
      index === 0
        ? segment.replace(/\/+$/g, "")
        : segment.replace(/^\/+|\/+$/g, ""),
    )
    .join("/");
}
