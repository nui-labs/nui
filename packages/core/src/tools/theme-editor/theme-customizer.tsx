import { useState } from "react";
import { SettingsIcon } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui";
import { cn } from "../../utils/cn";
import { RadiusStoreProvider } from "./radius-store";
import { ThemeCustomizerContent } from "./theme-customizer-content";

interface ThemeCustomizerProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeCustomizer({
  className,
  showLabel = true,
}: ThemeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "inline-flex items-center justify-center rounded-md font-medium text-sm outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-muted hover:text-muted-foreground h-9 w-9",
              className,
            )}
            onClick={() => setIsOpen(true)}
          >
            <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Customize theme</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Customize Theme</p>
          </TooltipContent>
        </Tooltip>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="w-[400px] sm:w-[480px] p-6">
            <RadiusStoreProvider>
              <ThemeCustomizerContent />
            </RadiusStoreProvider>
          </SheetContent>
        </Sheet>
      </TooltipProvider>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        render={(props) => (
          <button
            {...props}
            className={cn(
              "inline-flex items-center justify-center rounded-md font-medium text-sm outline-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent hover:bg-muted hover:text-muted-foreground h-9 w-9",
              className,
            )}
          >
            <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="ml-2">Customize Theme</span>
            <span className="sr-only">Customize theme</span>
          </button>
        )}
      />
      <SheetContent side="right" className="w-[400px] sm:w-[480px] p-6">
        <RadiusStoreProvider>
          <ThemeCustomizerContent />
        </RadiusStoreProvider>
      </SheetContent>
    </Sheet>
  );
}
