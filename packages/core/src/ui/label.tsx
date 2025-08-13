import type { ComponentProps } from "react";

import { cn } from "../utils/cn";

/**
 * Label component for forms. Use the 'htmlFor' prop to associate the label with an input.
 */
function Label({ className, htmlFor, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      htmlFor={htmlFor}
      {...props}
    />
  );
}

export { Label };
