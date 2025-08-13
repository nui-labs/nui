import { useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CopyIcon,
  DownloadIcon,
  FileIcon,
  PackageIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nui/core";
import type { Block } from "@nui/vite-plugin-docs";

import { CopyButton } from "../mdx/copy-button";
import { BlockFileViewer } from "./block-file-viewer";
import { BlockPreview } from "./block-preview";

interface BlockDetailProps {
  block: Block;
  className?: string;
  onBack?: () => void;
  onCopyCode?: (block: Block) => void;
}

export function BlockDetail({
  block,
  className,
  onBack,
  onCopyCode,
}: BlockDetailProps) {
  const [activeTab, setActiveTab] = useState("preview");

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const installationCommand = useMemo(() => {
    if (block.dependencies.length === 0) return "";
    return `npm install ${block.dependencies.join(" ")}`;
  }, [block.dependencies]);

  const downloadAllFiles = () => {
    // Create a zip-like structure (simplified for demo)
    const allContent = block.files
      .map((file) => `// ${file.path}\n${file.content}`)
      .join("\n\n" + "=".repeat(50) + "\n\n");

    const blob = new Blob([allContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${block.id}-block.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{block.name}</h1>
            {block.featured && <Badge variant="secondary">Featured</Badge>}
            <Badge
              className={cn("text-xs", getDifficultyColor(block.difficulty))}
            >
              {block.difficulty}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">{block.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadAllFiles}>
            <DownloadIcon className="size-4 mr-1" />
            Download
          </Button>
          <Button onClick={() => onCopyCode?.(block)}>
            <CopyIcon className="size-4 mr-1" />
            Copy Code
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Block Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Category
              </div>
              <Badge variant="outline">{block.category}</Badge>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Files
              </div>
              <div className="flex items-center gap-1 text-sm">
                <FileIcon className="size-3" />
                {block.files.length} file{block.files.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Version
              </div>
              <div className="text-sm">{block.version}</div>
            </div>

            {block.author && (
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Author
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <UserIcon className="size-3" />
                  {block.author}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {block.tags.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Tags
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <TagIcon className="size-3 text-muted-foreground" />
                {block.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dependencies */}
          {block.dependencies.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Dependencies
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <PackageIcon className="size-3 text-muted-foreground" />
                {block.dependencies.map((dep) => (
                  <Badge
                    key={dep}
                    variant="outline"
                    className="text-xs font-mono"
                  >
                    {dep}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            {block.createdAt && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-3" />
                Created: {new Date(block.createdAt).toLocaleDateString()}
              </div>
            )}
            {block.updatedAt && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-3" />
                Updated: {new Date(block.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Installation */}
      {block.dependencies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Installation</CardTitle>
            <CardDescription>
              Install the required dependencies for this block
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
                <code>{installationCommand}</code>
              </pre>
              <CopyButton value={installationCommand} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                Interactive preview of the block component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockPreview
                name={block.id}
                showFiles={false}
                defaultTab="preview"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Source Code</CardTitle>
              <CardDescription>
                All files included in this block
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlockFileViewer files={block.files} showFileTree={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
              <CardDescription>
                How to use this block in your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. Install Dependencies</h4>
                {block.dependencies.length > 0 ? (
                  <div className="relative">
                    <pre className="bg-muted rounded p-3 text-sm">
                      <code>{installationCommand}</code>
                    </pre>
                    <CopyButton value={installationCommand} />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No dependencies required.
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">2. Copy Files</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Copy the following files to your project:
                </p>
                <ul className="space-y-1">
                  {block.files.map((file) => (
                    <li
                      key={file.path}
                      className="text-sm font-mono bg-muted/50 px-2 py-1 rounded"
                    >
                      {file.path}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">3. Import and Use</h4>
                <p className="text-sm text-muted-foreground">
                  Import the main component and use it in your application.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
