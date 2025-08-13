import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileIcon,
  FolderIcon,
} from "lucide-react";
import {
  Button,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nui/core";
import type { RegistryFile } from "@nui/plugin-registry";

import { highlightCode } from "../../lib/rehype";
import { CopyButton } from "../mdx/copy-button";

interface CodeViewerProps {
  files: RegistryFile[];
  className?: string;
  defaultFile?: string;
  showFileTree?: boolean;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  file?: RegistryFile;
}

export function CodeViewer({
  files,
  className,
  defaultFile,
  showFileTree = true,
}: CodeViewerProps) {
  const [highlightedFiles, setHighlightedFiles] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  // Build file tree structure
  const fileTree = useMemo(() => {
    const root: FileTreeNode[] = [];
    const folderMap = new Map<string, FileTreeNode>();

    files.forEach((file) => {
      const pathParts = file.path.split("/");
      let currentPath = "";
      let currentLevel = root;

      pathParts.forEach((part: string, index: number) => {
        const isFile = index === pathParts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (isFile) {
          currentLevel.push({
            name: part,
            path: currentPath,
            type: "file",
            file,
          });
        } else {
          let folder = folderMap.get(currentPath);
          if (!folder) {
            folder = {
              name: part,
              path: currentPath,
              type: "folder",
              children: [],
            };
            folderMap.set(currentPath, folder);
            currentLevel.push(folder);
          }
          currentLevel = folder.children!;
        }
      });
    });

    return root;
  }, [files]);

  // Auto-expand all folders on mount
  useEffect(() => {
    const allFolders = new Set<string>();
    const collectFolders = (nodes: FileTreeNode[]) => {
      nodes.forEach((node) => {
        if (node.type === "folder") {
          allFolders.add(node.path);
          if (node.children) {
            collectFolders(node.children);
          }
        }
      });
    };
    collectFolders(fileTree);
    setExpandedFolders(allFolders);
  }, [fileTree]);

  const loadFileCode = useCallback(
    async (file: RegistryFile) => {
      if (highlightedFiles[file.path] || loading[file.path]) return;

      setLoading((prev) => ({ ...prev, [file.path]: true }));
      try {
        const highlightedCode = await highlightCode(file.content);
        setHighlightedFiles((prev) => ({
          ...prev,
          [file.path]: highlightedCode,
        }));
      } catch (err) {
        console.error("Error highlighting code:", err);
      } finally {
        setLoading((prev) => ({ ...prev, [file.path]: false }));
      }
    },
    [highlightedFiles, loading],
  );

  const toggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath);
      } else {
        newSet.add(folderPath);
      }
      return newSet;
    });
  }, []);

  const downloadFile = useCallback((file: RegistryFile) => {
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const renderFileTree = (nodes: FileTreeNode[], level = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        {node.type === "folder" ? (
          <div>
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded text-sm w-full text-left transition-colors"
              style={{ paddingLeft: `${8 + level * 16}px` }}
            >
              {expandedFolders.has(node.path) ? (
                <ChevronDownIcon className="size-3 text-muted-foreground" />
              ) : (
                <ChevronRightIcon className="size-3 text-muted-foreground" />
              )}
              <FolderIcon className="size-3 text-blue-500" />
              <span className="text-foreground">{node.name}</span>
            </button>
            {expandedFolders.has(node.path) && node.children && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </div>
        ) : (
          <TabsTrigger
            value={node.path}
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded text-sm w-full justify-start transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            style={{ paddingLeft: `${8 + level * 16}px` }}
            onClick={() => node.file && loadFileCode(node.file)}
          >
            <FileIcon className="size-3 text-muted-foreground" />
            <span className="flex-1 text-left">{node.name}</span>
          </TabsTrigger>
        )}
      </div>
    ));
  };

  const firstFile = defaultFile || files[0]?.path;

  return (
    <div className={cn("h-full w-full", className)}>
      <Tabs
        defaultValue={firstFile}
        orientation={showFileTree ? "vertical" : "horizontal"}
        className="h-full w-full"
      >
        <div className="flex h-full">
          {/* Left Column - File Tree */}
          {showFileTree && (
            <div className="w-64 border-r bg-muted/10 flex flex-col shrink-0">
              <div className="p-3 border-b bg-muted/20">
                <div className="text-sm font-medium text-foreground">Files</div>
              </div>
              <div className="flex-1 p-2 overflow-y-auto">
                <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
                  {renderFileTree(fileTree)}
                </TabsList>
              </div>
            </div>
          )}

          {/* Right Column - Code Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-background">
            {!showFileTree && (
              <TabsList className="mb-4">
                {files.map((file) => (
                  <TabsTrigger
                    key={file.path}
                    value={file.path}
                    onClick={() => loadFileCode(file)}
                  >
                    <FileIcon className="size-3 mr-1" />
                    {file.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}

            {files.map((file) => (
              <TabsContent
                key={file.path}
                value={file.path}
                className="flex-1 mt-0 flex flex-col h-full"
              >
                <div className="flex flex-col h-full">
                  {/* File header */}
                  <div className="flex items-center justify-between p-3 border-b bg-muted/20 shrink-0">
                    <div className="flex items-center gap-2">
                      <FileIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{file.path}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file)}
                        className="h-7 w-7 p-0"
                      >
                        <DownloadIcon className="size-3" />
                      </Button>
                      <CopyButton value={file.content} className="h-7 w-7" />
                    </div>
                  </div>

                  {/* File content */}
                  <div className="flex-1 relative overflow-hidden">
                    {highlightedFiles[file.path] ? (
                      <div className="h-full overflow-auto">
                        <div
                          className="[&_pre]:!mb-0 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:!bg-transparent [&_pre]:min-h-full [&_pre]:p-4"
                          dangerouslySetInnerHTML={{
                            __html: highlightedFiles[file.path],
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted/10">
                        {loading[file.path] ? (
                          <div className="text-sm text-muted-foreground">
                            Loading {file.name}...
                          </div>
                        ) : (
                          <button
                            onClick={() => loadFileCode(file)}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Click to load {file.name}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
