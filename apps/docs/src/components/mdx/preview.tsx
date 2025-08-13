import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { contents } from "virtual:demos";
import {
  Button,
  Card,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@nui/core";

import { highlightCodeWithTheme } from "../../lib/shiki";

interface PreviewProps {
  name: string;
  className?: string;
}

const Loader = ({ message }: { message?: string }) => (
  <div className="flex min-h-[250px] items-center justify-center text-muted-foreground text-sm">
    <Loader2Icon className="size-4 animate-spin mr-2" />
    {message || "Loading..."}
  </div>
);

const DemoNotFound = ({ name }: { name: string }) => (
  <div className="flex min-h-[250px] items-center justify-center text-muted-foreground text-sm text-center">
    Demo not found: <span className="ml-1 font-mono">{name}</span>
  </div>
);

export const Preview: React.FC<PreviewProps> = ({ name, className }) => {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  const [isHighlightingLoaded, setIsHighlightingLoaded] = useState(false);

  const demo = useMemo(() => contents.find((d) => d.name === name), [name]);
  const DemoComponent = demo?.component;
  const sourceCode = demo?.content;

  // Sync with current dark mode
  useEffect(() => {
    const updateTheme = () =>
      setIsDark(document.documentElement.classList.contains("dark"));

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Lazy load syntax highlighting only when code tab is accessed
  const loadHighlighting = async () => {
    if (!sourceCode || isHighlightingLoaded) return;

    try {
      setIsHighlightingLoaded(true);
      const html = await highlightCodeWithTheme(sourceCode, "tsx", isDark);
      setHighlightedCode(html);
    } catch (err) {
      console.error("Shiki highlight error:", err);
      setHighlightedCode(`<pre class="shiki"><code>${sourceCode}</code></pre>`);
    }
  };

  // Re-highlight when theme changes (only if already loaded)
  useEffect(() => {
    if (isHighlightingLoaded && sourceCode) {
      loadHighlighting();
    }
  }, [isDark]);

  // Handle tab change and lazy load highlighting
  const handleTabChange = (value: string) => {
    if (value === "code") {
      loadHighlighting();
    }
  };

  const handleCopy = useCallback(async () => {
    if (!sourceCode) return;
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [sourceCode]);

  return (
    <div className={cn("not-prose my-6", className)}>
      <Card className="p-0 shadow-none border-0 bg-transparent">
        <Tabs defaultValue="preview" onValueChange={handleTabChange}>
          <div className="py-3 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>

            {sourceCode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-auto px-2 py-1 text-xs"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          <TabsContent
            value="preview"
            className="p-12 border-1 border-border rounded-lg"
          >
            {DemoComponent ? (
              <Suspense fallback={<Loader />}>
                <div className="min-h-[250px] flex items-center justify-center">
                  <DemoComponent />
                </div>
              </Suspense>
            ) : (
              <DemoNotFound name={name} />
            )}
          </TabsContent>

          <TabsContent value="code" className="p-0">
            <div className="relative min-h-[250px]">
              {!sourceCode ? (
                <Loader message="No source code available" />
              ) : highlightedCode ? (
                <div
                  className="overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              ) : (
                <Loader />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
