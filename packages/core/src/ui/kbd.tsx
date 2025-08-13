import type * as React from "react";

import { cn } from "../utils/cn";

function Kbd({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd"
      className={cn(
        "bg-background flex h-5 w-5 items-center justify-center border text-center text-xs font-medium tracking-tight shadow-sm rounded-selectors",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

export { Kbd };
