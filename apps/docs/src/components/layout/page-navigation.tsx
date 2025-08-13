import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { NavItem } from "@nui/plugin-docs/src";

export interface PageNavigationProps {
  prev?: NavItem;
  next?: NavItem;
  className?: string;
  variant?: "full" | "icons-only";
}

export function PageNavigation({
  prev,
  next,
  className,
  variant = "full",
}: PageNavigationProps) {
  const navigate = useNavigate();

  if (!prev && !next) {
    return null;
  }

  const handlePrevClick = () => {
    if (prev?.path) {
      navigate(prev.path);
    }
  };

  const handleNextClick = () => {
    if (next?.path) {
      navigate(next.path);
    }
  };

  if (variant === "icons-only") {
    return (
      <nav
        className={`flex items-center justify-between py-3 ${className || ""}`}
      >
        <div>
          {prev && (
            <button
              onClick={handlePrevClick}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              aria-label={`Previous: ${prev.label}`}
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
        </div>

        <div>
          {next && (
            <button
              onClick={handleNextClick}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
              aria-label={`Next: ${next.label}`}
            >
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`flex items-center justify-between py-6 ${className || ""}`}
    >
      <div className="flex-1">
        {prev && (
          <button
            onClick={handlePrevClick}
            className="px-2 py-1 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group hover:bg-muted/50 bg-muted rounded-md"
          >
            <ArrowLeft className="size-4" />
            <span>{prev.label}</span>
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {next && (
          <button
            onClick={handleNextClick}
            className="px-2 py-1 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group hover:bg-muted/50 bg-muted rounded-md"
          >
            <span>{next.label}</span>
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </nav>
  );
}
