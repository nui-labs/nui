import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import { contents } from "virtual:contents";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
} from "@nui/core";
import type { ContentFile } from "@nui/plugin-docs";

import { HeaderButton } from "./header-button";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter and group documentation files
  const documentationFiles = contents.filter(
    (file: ContentFile) => file.meta?.title && file.path,
  );

  // Group files by section
  const groupedFiles = documentationFiles.reduce(
    (acc, file) => {
      const pathSegments = file.path.split("/").filter(Boolean);
      const section = pathSegments[0] || "root";
      const sectionName =
        section === "components"
          ? "Components"
          : section === "docs"
            ? "Documentation"
            : "Other";

      if (!acc[sectionName]) {
        acc[sectionName] = [];
      }
      acc[sectionName].push(file);
      return acc;
    },
    {} as Record<string, ContentFile[]>,
  );

  const handleSelect = (content: ContentFile) => {
    if (content.path) {
      navigate(content.path);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Search trigger button */}
      <HeaderButton
        type="button"
        onClick={() => setOpen(true)}
        variant="search"
        size="search"
        className="flex items-center justify-between p-2"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <SearchIcon className="size-4 shrink-0" />
          <span className="hidden md:inline">Search docs...</span>
          <span className="hidden sm:inline md:hidden">Search...</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <Kbd className="text-xs">⌘</Kbd>
          <Kbd className="text-xs">K</Kbd>
        </div>
      </HeaderButton>

      {/* Search dialog */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search Documentation"
        description="Search through the documentation to find what you need."
        className="p-1 mx-auto max-w-[90vw] sm:max-w-lg !fixed !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !bottom-auto"
      >
        <CommandInput placeholder="Search documentation..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(groupedFiles).map(([sectionName, files]) => (
            <CommandGroup key={sectionName} heading={sectionName}>
              {(files as ContentFile[]).map((file: ContentFile) => (
                <CommandItem
                  key={file.path}
                  onSelect={() => handleSelect(file)}
                  className="cursor-pointer"
                  value={`${file.meta?.title} ${file.meta?.description}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">{file.meta?.title}</span>
                    {file.meta?.description && (
                      <span className="text-xs text-muted-foreground">
                        {file.meta.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
