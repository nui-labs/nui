import { Suspense, useCallback, useMemo, useState } from "react";
import { FileIcon, FolderIcon, Loader2Icon } from "lucide-react";
import { blocks } from "virtual:blocks";
import { cn, Tabs, TabsContent, TabsList, TabsTrigger } from "@nui/core";

import { highlightCode } from "../../lib/rehype";
import { CopyButton } from "../mdx/copy-button";

interface BlockPreviewProps {
  name: string;
  className?: string;
  showFiles?: boolean;
  defaultTab?: "preview" | "code";
}

const Loader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center text-muted-foreground text-sm">
    <Loader2Icon className="size-4 animate-spin mr-2" />
    {message}
  </div>
);

const NotFound = ({ name }: { name: string }) => (
  <div className="text-muted-foreground text-sm">
    Block not found: <span className="ml-1 font-mono">{name}</span>
  </div>
);

export function BlockPreview({
  name,
  className,
  showFiles = true,
  defaultTab = "preview",
}: BlockPreviewProps) {
  const [highlightedFiles, setHighlightedFiles] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const block = useMemo(() => blocks.find((b) => b.id === name), [name]);

  if (!block) {
    return (
      <div
        className={cn(
          "border border-border rounded-lg p-12 min-h-[350px]",
          "flex items-center justify-center bg-muted/30",
          className,
        )}
      >
        <NotFound name={name} />
      </div>
    );
  }

  const { component: Component, files } = block;

  const loadFileCode = useCallback(
    async (filePath: string, content: string, language: string) => {
      if (highlightedFiles[filePath] || loading[filePath]) return;

      setLoading((prev) => ({ ...prev, [filePath]: true }));
      try {
        const highlightedCode = await highlightCode(content, language);
        setHighlightedFiles((prev) => ({
          ...prev,
          [filePath]: highlightedCode,
        }));
      } catch (err) {
        console.error("Error highlighting code:", err);
      } finally {
        setLoading((prev) => ({ ...prev, [filePath]: false }));
      }
    },
    [highlightedFiles, loading],
  );

  const handleTabChange = useCallback(
    (value: string) => {
      if (value.startsWith("file-") && showFiles) {
        const filePath = value.replace("file-", "");
        const file = files.find((f) => f.path === filePath);
        if (file && !highlightedFiles[filePath] && !loading[filePath]) {
          loadFileCode(filePath, file.content, file.language);
        }
      }
    },
    [files, highlightedFiles, loading, loadFileCode, showFiles],
  );

  const previewContainerClass = cn(
    "border border-border rounded-lg p-12 min-h-[350px]",
    "flex items-center justify-center",
    getPreviewBackgroundClass(block.preview.background),
    getPreviewPaddingClass(block.preview.padding),
  );

  const codeContainerClass = cn("min-h-[350px]");

  // Group files by type for better organization
  const filesByType = useMemo(() => {
    const grouped = files.reduce(
      (acc, file) => {
        if (!acc[file.type]) acc[file.type] = [];
        acc[file.type].push(file);
        return acc;
      },
      {} as Record<string, typeof files>,
    );

    // Sort types in a logical order
    const typeOrder = ["component", "utility", "type", "config", "style"];
    return typeOrder.reduce(
      (acc, type) => {
        if (grouped[type]) acc[type] = grouped[type];
        return acc;
      },
      {} as Record<string, typeof files>,
    );
  }, [files]);

  const mainTabs = ["preview"];
  if (showFiles && files.length > 0) {
    mainTabs.push("code");
  }

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4">
        {mainTabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab === "preview" ? "Preview" : "Code"}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value="preview"
        className={previewContainerClass}
        data-testid="block-preview"
      >
        <Suspense fallback={<Loader />}>
          <Component />
        </Suspense>
      </TabsContent>

      {showFiles && (
        <TabsContent value="code" className={codeContainerClass}>
          {files.length > 0 ? (
            <Tabs
              defaultValue={`file-${files[0].path}`}
              onValueChange={handleTabChange}
            >
              <TabsList className="mb-4 flex-wrap h-auto">
                {Object.entries(filesByType).map(([type, typeFiles]) => (
                  <div key={type} className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/50">
                      {type}
                    </span>
                    {typeFiles.map((file) => (
                      <TabsTrigger
                        key={file.path}
                        value={`file-${file.path}`}
                        className="text-xs"
                      >
                        <FileIcon className="size-3 mr-1" />
                        {file.name}
                      </TabsTrigger>
                    ))}
                  </div>
                ))}
              </TabsList>

              {files.map((file) => (
                <TabsContent key={file.path} value={`file-${file.path}`}>
                  {highlightedFiles[file.path] ? (
                    <div className="group relative">
                      <div
                        className="[&_pre]:!mb-0"
                        dangerouslySetInnerHTML={{
                          __html: highlightedFiles[file.path],
                        }}
                      />
                      <CopyButton value={file.content} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center min-h-[200px]">
                      {loading[file.path] ? (
                        <Loader message={`Loading ${file.name}...`} />
                      ) : (
                        <div className="text-center">
                          <FileIcon className="size-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to load {file.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <FolderIcon className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No files found</p>
              </div>
            </div>
          )}
        </TabsContent>
      )}
    </Tabs>
  );
}

function getPreviewBackgroundClass(background?: string): string {
  switch (background) {
    case "muted":
      return "bg-muted/30";
    case "card":
      return "bg-card";
    case "transparent":
      return "bg-transparent";
    default:
      return "";
  }
}

function getPreviewPaddingClass(padding?: string): string {
  switch (padding) {
    case "none":
      return "p-0";
    case "sm":
      return "p-4";
    case "md":
      return "p-8";
    case "lg":
      return "p-16";
    default:
      return "p-12";
  }
}
