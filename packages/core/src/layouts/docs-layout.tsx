import type { ReactNode } from "react";

import { cn } from "../utils/cn";

export interface DocsLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  toc?: ReactNode;
}

export function DocsLayout({
  children,
  header,
  sidebar,
  toc,
}: DocsLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background">
        <div className="max-w-[90rem] mx-auto p-4">
          <div className="flex items-center gap-2">{header}</div>
        </div>
      </header>

      {/* Main layout */}
      <div className="w-full">
        <div className="max-w-[90rem] mx-auto flex flex-row px-4 pt-10">
          {/* Sidebar */}
          {sidebar && (
            <aside
              className={cn(
                "hidden lg:block w-55 shrink-0",
                "sticky top-27 self-start h-[calc(100vh-7rem)] overflow-y-auto",
              )}
            >
              {sidebar}
            </aside>
          )}

          {/* Main content */}
          <main
            className={cn(
              "flex-1 w-full px-4",
              // Base: center content when no sidebars are visible
              "mx-auto",
              // When sidebar is visible (lg+), align left
              sidebar && "lg:ml-0 lg:mr-auto",
              // When TOC is visible (xl+), center between sidebar and TOC
              toc && "xl:mx-auto",
              // Set max-width based on TOC presence
              toc ? "max-w-3xl" : "",
            )}
          >
            {children}
          </main>

          {/* TOC */}
          {toc && (
            <nav
              className={cn(
                "hidden xl:block w-55 shrink-0",
                "sticky top-27 self-start h-[calc(100vh-7rem)] overflow-y-auto",
              )}
            >
              {toc}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
