import type * as React from "react";

import { cn } from "../utils/cn";

function Kbd({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd"
      className={cn(
        "bg-background flex h-5 w-5 items-center justify-center rounded-sm border text-center text-xs font-medium tracking-tight shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
