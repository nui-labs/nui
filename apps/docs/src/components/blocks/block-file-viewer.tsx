import { useCallback, useMemo, useState } from "react";
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
import type { BlockFile } from "@nui/vite-plugin-docs";

import { highlightCode } from "../../lib/rehype";
import { CopyButton } from "../mdx/copy-button";

interface BlockFileViewerProps {
  files: BlockFile[];
  className?: string;
  defaultFile?: string;
  showFileTree?: boolean;
}

interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  file?: BlockFile;
}

export function BlockFileViewer({
  files,
  className,
  defaultFile,
  showFileTree = true,
}: BlockFileViewerProps) {
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

      pathParts.forEach((part, index) => {
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

  const loadFileCode = useCallback(
    async (file: BlockFile) => {
      if (highlightedFiles[file.path] || loading[file.path]) return;

      setLoading((prev) => ({ ...prev, [file.path]: true }));
      try {
        const highlightedCode = await highlightCode(
          file.content,
          file.language,
        );
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

  const downloadFile = useCallback((file: BlockFile) => {
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
      <div key={node.path} style={{ paddingLeft: `${level * 16}px` }}>
        {node.type === "folder" ? (
          <div>
            <button
              onClick={() => toggleFolder(node.path)}
              className="flex items-center gap-1 py-1 px-2 hover:bg-muted/50 rounded text-sm w-full text-left"
            >
              {expandedFolders.has(node.path) ? (
                <ChevronDownIcon className="size-3" />
              ) : (
                <ChevronRightIcon className="size-3" />
              )}
              <FolderIcon className="size-3 text-blue-500" />
              <span>{node.name}</span>
            </button>
            {expandedFolders.has(node.path) && node.children && (
              <div>{renderFileTree(node.children, level + 1)}</div>
            )}
          </div>
        ) : (
          <TabsTrigger
            value={node.path}
            className="flex items-center gap-1 py-1 px-2 hover:bg-muted/50 rounded text-sm w-full justify-start"
            onClick={() => node.file && loadFileCode(node.file)}
          >
            <FileIcon className="size-3 text-muted-foreground" />
            <span>{node.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {node.file?.language}
            </span>
          </TabsTrigger>
        )}
      </div>
    ));
  };

  const firstFile = defaultFile || files[0]?.path;

  return (
    <div className={cn("flex h-full", className)}>
      <Tabs
        defaultValue={firstFile}
        orientation={showFileTree ? "vertical" : "horizontal"}
        className="flex w-full"
      >
        {showFileTree && (
          <div className="w-64 border-r bg-muted/20 p-2">
            <div className="mb-2 text-sm font-medium text-muted-foreground">
              Files ({files.length})
            </div>
            <TabsList className="flex flex-col h-auto w-full bg-transparent">
              {renderFileTree(fileTree)}
            </TabsList>
          </div>
        )}

        <div className="flex-1 flex flex-col">
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
              className="flex-1 mt-0"
            >
              <div className="border rounded-lg overflow-hidden">
                {/* File header */}
                <div className="flex items-center justify-between p-3 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileIcon className="size-4" />
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {file.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <DownloadIcon className="size-3" />
                    </Button>
                    <CopyButton value={file.content} />
                  </div>
                </div>

                {/* File content */}
                <div className="relative">
                  {highlightedFiles[file.path] ? (
                    <div
                      className="[&_pre]:!mb-0 [&_pre]:!rounded-none [&_pre]:!border-0"
                      dangerouslySetInnerHTML={{
                        __html: highlightedFiles[file.path],
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center min-h-[300px] bg-muted/20">
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
      </Tabs>
    </div>
  );
}
