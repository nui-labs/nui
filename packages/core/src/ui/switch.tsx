import type * as React from "react";
import { Switch as BaseSwitch } from "@base-ui-components/react/switch";

import { cn } from "../utils/cn";

function Switch({
  className,
  style,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(
        "peer data-checked:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 data-unchecked:bg-input inline-flex h-5 w-8 shrink-0 items-center border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 rounded-selectors",
        className,
      )}
      style={style}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-foreground data-checked:bg-background pointer-events-none block size-4 ring-0 transition-transform duration-300 ease-in-out data-checked:translate-x-[calc(100%-3px)] data-unchecked:translate-x-px rounded-selectors",
        )}
      />
    </BaseSwitch.Root>
  );
}

export { Switch };
