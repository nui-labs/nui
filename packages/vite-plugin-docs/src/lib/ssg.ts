import { promises as fs } from "fs";
import path from "path";

import type { ContentFile } from "../types";

function normalizeBase(basePath: string = "/"): string {
  if (!basePath) return "/";
  const leading = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return leading.endsWith("/") ? leading : `${leading}/`;
}

function joinUrl(...parts: string[]): string {
  // Joins URL segments without duplicating slashes
  return parts
    .filter(Boolean)
    .map((p, i) =>
      i === 0 ? p.replace(/\/+$/g, "") : p.replace(/^\/+|\/+$/g, ""),
    )
    .join("/");
}

function escapeHtml(text: string = ""): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Avoid writing outside of outDir; always target `<outDir>/<contentPath>/index.html`
 */
function outputPathFor(
  outDir: string,
  contentPath: string | undefined,
): string {
  const safe = (contentPath || "")
    .replace(/(\.\.\/)+/g, "")
    .replace(/\\/g, "/");
  return path.join(outDir, safe, "index.html");
}

type AssetPaths = { js: string; css: string };

async function resolveAssets(
  outDir: string,
  basePath: string,
): Promise<AssetPaths> {
  const base = normalizeBase(basePath);

  // 1) Try Vite's manifest.json (maps entry → hashed assets)
  try {
    const m = JSON.parse(
      await fs.readFile(path.join(outDir, "manifest.json"), "utf8"),
    ) as Record<string, { file: string; css?: string[]; isEntry?: boolean }>;

    const entry =
      Object.values(m).find((x) => x.isEntry) ??
      Object.entries(m).find(([name]) => /^index\.(t|j)sx?$/.test(name))?.[1];

    if (entry?.file) {
      return {
        js: joinUrl(base, entry.file),
        css: entry.css?.[0] ? joinUrl(base, entry.css[0]) : "",
      };
    }
  } catch {
    /* fall through to scan */
  }

  // 2) Fallback: scan /assets for index-* files
  try {
    const assetsDir = path.join(outDir, "assets");
    const files = await fs.readdir(assetsDir);

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
    // Last resort default
    return {
      css: "",
      js: joinUrl(base, "assets/index.js"),
    };
  }
}

function renderHtml(
  file: ContentFile,
  assets: AssetPaths,
  basePath: string,
  manifestHref: string,
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
  <link rel="manifest" href="${escapeHtml(manifestHref)}" />

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

/**
 * Write a minimal PWA manifest.
 * NOTE: writes to `manifest.webmanifest` to avoid clobbering Vite's `manifest.json`.
 */
async function writeWebManifest(
  outDir: string,
  basePath: string,
): Promise<string> {
  const fileName = "manifest.webmanifest";
  const manifest = {
    name: "Documentation",
    short_name: "Docs",
    start_url: normalizeBase(basePath),
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };

  await fs.writeFile(
    path.join(outDir, fileName),
    JSON.stringify(manifest, null, 2),
    "utf8",
  );
  return `/${fileName}`;
}

export async function generateStaticFiles(
  files: ContentFile[],
  outDir: string,
  basePath: string = "/",
): Promise<void> {
  await fs.mkdir(outDir, { recursive: true });

  // Prepare shared artifacts first
  const [assets, manifestHref] = await Promise.all([
    resolveAssets(outDir, basePath),
    writeWebManifest(outDir, basePath),
  ]);

  // Write one HTML file per content entry
  await Promise.all(
    files.map(async (file) => {
      const html = renderHtml(file, assets, basePath, manifestHref);
      const outFile = outputPathFor(outDir, file.path);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, html, "utf8");
    }),
  );
}
