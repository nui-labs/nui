import { useCallback, useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "@nui/core";

interface CopyButtonProps {
  value: string | (() => string);
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      const textToCopy = typeof value === "function" ? value() : value;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [value]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const label = isCopied ? "Copied!" : "Copy code";

  return (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <Button
            {...props}
            variant="ghost"
            size="icon-sm"
            onClick={copyToClipboard}
            className={cn("absolute top-2 right-2 z-10", className)}
            aria-label={label}
          >
            {isCopied ? (
              <CheckIcon className="h-3 w-3" />
            ) : (
              <CopyIcon className="h-3 w-3" />
            )}
          </Button>
        )}
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
