import { Suspense, useCallback, useMemo, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { blocks } from "virtual:registry";
import { cn, Tabs, TabsContent, TabsList, TabsTrigger } from "@nui/core";

import { highlightCode } from "../../lib/rehype";
import { CopyButton } from "./copy-button";

interface PreviewProps {
  name: string;
  className?: string;
}

const Loader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center text-muted-foreground text-sm">
    <Loader2Icon className="size-4 animate-spin mr-2" />
    {message}
  </div>
);

const NotFound = ({ name }: { name: string }) => (
  <div className="text-muted-foreground text-sm">
    Component not found: <span className="ml-1 font-mono">{name}</span>
  </div>
);

export function Preview({ name, className }: PreviewProps) {
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demo = useMemo(() => blocks.find((b) => b.id === name), [name]);

  if (!demo) {
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

  const Component = demo.component;
  const sourceCode = demo.files[0]?.content || "";

  // Safety check for component
  if (!Component) {
    console.error(`Component not found for demo: ${name}`, demo);
    return (
      <div
        className={cn(
          "border border-border rounded-lg p-12 min-h-[350px]",
          "flex items-center justify-center bg-muted/30",
          className,
        )}
      >
        <div className="text-destructive text-sm">
          Component failed to load:{" "}
          <span className="ml-1 font-mono">{name}</span>
        </div>
      </div>
    );
  }

  const loadCode = useCallback(async () => {
    if (!sourceCode || loading) return;

    setLoading(true);
    try {
      const highlightedCode = await highlightCode(sourceCode, "tsx");
      setCode(highlightedCode);
    } catch (err) {
      console.error("Error highlighting code:", err);
      setLoading(false);
    }
  }, [sourceCode, loading]);

  const handleTabChange = useCallback(
    (value: string) => {
      if (value === "code" && !code && !loading) {
        loadCode();
      }
    },
    [code, loading, loadCode],
  );

  const previewContainerClass = cn(
    "border border-border rounded-lg p-12 min-h-[350px]",
    "flex items-center justify-center",
  );

  const codeContainerClass = cn(code ? "min-h-[350px]" : previewContainerClass);

  return (
    <Tabs
      defaultValue="preview"
      onValueChange={handleTabChange}
      className={className}
    >
      <TabsList className="mb-4">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className={previewContainerClass}>
        <Suspense fallback={<Loader />}>
          <Component />
        </Suspense>
      </TabsContent>

      <TabsContent value="code" className={codeContainerClass}>
        {code ? (
          <div className="group relative">
            <div
              className="[&_pre]:!mb-0"
              dangerouslySetInnerHTML={{ __html: code }}
            />
            <CopyButton value={sourceCode || ""} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {loading && sourceCode ? <Loader /> : <NotFound name={name} />}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
