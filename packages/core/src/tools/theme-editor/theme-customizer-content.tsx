import { RotateCcwIcon } from "lucide-react";

import {
  buttonVariants,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui";
import { RadiusEditor } from "./radius-editor";
import { useRadiusStore } from "./radius-store";

export function ThemeCustomizerContent() {
  const { reset: resetRadius } = useRadiusStore();

  const resetTheme = () => {
    // Reset all radius tokens to their defaults
    resetRadius();

    // Add other theme resets here as the system grows
    // e.g., colors, spacing, typography, etc.
  };

  return (
    <>
      <SheetHeader className="py-4 px-0">
        <div className="flex items-start justify-between">
          <div>
            <SheetTitle className="text-lg font-semibold">
              Customize Theme
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Shape it to your needs. Make it yours.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                className={buttonVariants({
                  variant: "outline",
                  size: "icon-sm",
                })}
                onClick={resetTheme}
              >
                <RotateCcwIcon className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset to defaults</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-8">
        <RadiusEditor />
      </div>
    </>
  );
}
