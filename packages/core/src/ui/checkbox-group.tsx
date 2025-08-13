import type * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui-components/react/checkbox-group";

import { cn } from "../utils/cn";

function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckboxGroup>) {
  return (
    <BaseCheckboxGroup
      className={cn("flex flex-col items-start gap-1", className)}
      {...props}
    />
  );
}

export { CheckboxGroup };
