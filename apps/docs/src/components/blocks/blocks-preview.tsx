import * as React from "react";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { blocks } from "virtual:registry";
import { cn } from "@nui/core";

export interface BlocksPreviewProps {
  name: string;
  className?: string;
}

const Loader: React.FC<{ message?: string; className?: string }> = ({
  message = "Loading...",
  className,
}) => (
  <div
    className={cn(
      "flex items-center justify-center text-muted-foreground text-sm",
      className,
    )}
    aria-busy
  >
    <Loader2Icon className="size-4 animate-spin mr-2" />
    {message}
  </div>
);

const NotFound: React.FC<{ name: string }> = ({ name }) => (
  <div className="text-muted-foreground text-sm">
    Block not found: <span className="ml-1 font-mono">{name}</span>
  </div>
);

class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  state = { hasError: false, message: undefined as string | undefined };
  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-sm text-destructive-foreground/90 bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <p className="font-medium">Preview crashed</p>
          <p className="opacity-80 mt-1">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function BlocksPreview({ name, className }: BlocksPreviewProps) {
  const block = React.useMemo(() => blocks.find((b) => b.id === name), [name]);

  if (!block) {
    return (
      <div
        className={cn(
          "border border-border rounded-lg p-12 min-h-[350px] flex items-center justify-center bg-muted/30",
          className,
        )}
      >
        <NotFound name={name} />
      </div>
    );
  }

  const { component: Component } = block;

  return (
    <div
      className={cn(
        "border border-border rounded-lg p-12 min-h-[350px] flex items-center justify-center",
        className,
      )}
      data-testid="block-preview"
    >
      <PreviewErrorBoundary>
        {Component && (
          <Suspense fallback={<Loader />}>
            <Component />
          </Suspense>
        )}
      </PreviewErrorBoundary>
    </div>
  );
}
