import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@nui/core";

const headerButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium text-sm outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
        search:
          "border border-input bg-muted text-muted-foreground shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-8 w-8",
        search: "h-8 w-8 sm:w-64",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface HeaderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof headerButtonVariants> {
  asChild?: boolean;
}

const HeaderButton = React.forwardRef<HTMLButtonElement, HeaderButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <div
          className={cn(headerButtonVariants({ variant, size, className }))}
          {...(props as React.HTMLAttributes<HTMLDivElement>)}
        />
      );
    }

    return (
      <button
        className={cn(headerButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
HeaderButton.displayName = "HeaderButton";

export { HeaderButton, headerButtonVariants };
