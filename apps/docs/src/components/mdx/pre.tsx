import { useCallback, useRef } from "react";
import { cn } from "@nui/core";

import { CopyButton } from "./copy-button";

interface PreProps extends React.ComponentProps<"pre"> {
  children?: React.ReactNode;
}

export function Pre({ children, className, ...props }: PreProps) {
  const preRef = useRef<HTMLPreElement>(null);

  // Extract text content from the pre element
  const getTextContent = useCallback(() => {
    if (preRef.current) {
      return preRef.current.textContent || "";
    }
    return "";
  }, []);

  return (
    <div className="group relative">
      <pre
        ref={preRef}
        className={cn(
          "bg-muted rounded-lg p-4 text-xs/5.5 overflow-x-auto max-h-[350px] mb-6",
          "relative",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <CopyButton value={getTextContent} />
    </div>
  );
}
