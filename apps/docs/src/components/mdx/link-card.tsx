import { Link } from "react-router-dom";
import { cn } from "@nui/core";

interface LinkCardProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function LinkCard({ href, children, className }: LinkCardProps) {
  return (
    <Link
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      to={href}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {children}
      </div>
    </Link>
  );
}
