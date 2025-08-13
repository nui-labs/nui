import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLinkIcon } from "lucide-react";
import type { ContentFile, NavItem } from "@nui/plugin-docs/src";

export interface PageHeaderProps {
  currentFile?: ContentFile;
  prev?: NavItem;
  next?: NavItem;
}

export function PageHeader({ currentFile, prev, next }: PageHeaderProps) {
  const navigate = useNavigate();

  if (!currentFile?.meta) return null;

  const { title, description, links } = currentFile.meta;

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

  return (
    <div className="mb-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">
            {prev && (
              <button
                onClick={handlePrevClick}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50 bg-muted"
                aria-label={`Previous: ${prev.label}`}
              >
                <ArrowLeft className="size-4 bg-muted" />
              </button>
            )}
            {next && (
              <button
                onClick={handleNextClick}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50 bg-muted"
                aria-label={`Next: ${next.label}`}
              >
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {description && (
        <p className="text-lg text-muted-foreground mb-6">{description}</p>
      )}

      {Array.isArray(links) && links.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-4"
            >
              {label}
              <ExternalLinkIcon className="size-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
