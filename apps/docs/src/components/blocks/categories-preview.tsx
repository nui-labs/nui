import { cn } from "@nui/core";

// Reusable preview components
const PreviewContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg p-3 flex items-center justify-center">
    {children}
  </div>
);

const PreviewCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("bg-background rounded-md p-2 shadow-sm", className)}>
    {children}
  </div>
);

const PreviewLine = ({
  width,
  height = "h-1",
  className,
}: {
  width: string;
  height?: string;
  className?: string;
}) => (
  <div
    className={cn(
      `block ${height} ${width} rounded-full bg-muted/60`,
      className,
    )}
  />
);

const PreviewButton = ({
  width = "w-6",
  primary = false,
}: {
  width?: string;
  primary?: boolean;
}) => (
  <div
    className={cn(
      "inline-flex items-center justify-center rounded-sm p-1",
      width,
      primary ? "bg-primary" : "bg-background border border-border",
    )}
  >
    <div
      className={cn(
        "block h-1 w-4 rounded-full",
        primary ? "bg-white/30 dark:bg-white/10" : "bg-muted/60",
      )}
    />
  </div>
);

// Category-specific previews
export const CATEGORY_PREVIEWS = {
  cards: () => (
    <PreviewContainer>
      <PreviewCard className="w-full max-w-36 space-y-3 p-3">
        <div className="space-y-2">
          <PreviewLine width="w-8/12" height="h-2" />
          <PreviewLine width="w-full" height="h-1.5" />
          <PreviewLine width="w-9/12" height="h-1.5" />
        </div>
        <div className="bg-muted/30 h-8 w-full rounded-sm" />
        <div className="flex justify-start">
          <PreviewButton primary />
        </div>
      </PreviewCard>
    </PreviewContainer>
  ),

  forms: () => (
    <PreviewContainer>
      <PreviewCard className="grow space-y-2 max-w-32">
        <div className="border-input flex w-full border bg-transparent px-2 py-1 shadow-xs rounded-sm h-4" />
        <div className="border-input flex w-full border bg-transparent px-2 py-1 shadow-xs rounded-sm h-4" />
        <PreviewButton primary />
      </PreviewCard>
    </PreviewContainer>
  ),

  authentication: () => (
    <PreviewContainer>
      <PreviewCard className="grow space-y-2 max-w-32">
        <div className="block h-1 w-7/12 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="border-input flex w-full border bg-transparent px-2 py-1 shadow-xs rounded-sm h-4" />
        <div className="border-input flex w-full border bg-transparent px-2 py-1 shadow-xs rounded-sm h-4" />
        <PreviewButton primary />
      </PreviewCard>
    </PreviewContainer>
  ),

  login: () => (
    <PreviewContainer>
      <PreviewCard className="grow space-y-2 max-w-32">
        <div className="text-center space-y-1">
          <div className="block h-1.5 w-6/12 rounded-full bg-black/10 dark:bg-white/10 mx-auto" />
          <div className="block h-1 w-8/12 rounded-full bg-black/10 dark:bg-white/10 mx-auto" />
        </div>
        <div className="space-y-1.5">
          <div className="border-input flex w-full border bg-transparent px-2 py-1 shadow-xs rounded-sm h-3" />
          <div className="border-input flex w-full border bg-transparent px-2 py-1 shadow-xs rounded-sm h-3" />
        </div>
        <div className="bg-primary inline-flex items-center justify-center gap-1 rounded-md p-1 shadow-sm w-full">
          <div className="block h-1 w-8 rounded-full bg-white/30 dark:bg-white/10" />
        </div>
        <div className="flex justify-center gap-1">
          <div className="block h-0.5 w-4 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="block h-0.5 w-6 rounded-full bg-primary/40" />
        </div>
      </PreviewCard>
    </PreviewContainer>
  ),

  charts: () => (
    <PreviewContainer>
      <PreviewCard className="w-full max-w-32 h-full max-h-16 flex items-end justify-center gap-1">
        {[6, 8, 10, 7, 5].map((height, i) => (
          <div
            key={i}
            className={`bg-primary/${60 + i * 10} w-2 h-${height} rounded-sm`}
          />
        ))}
      </PreviewCard>
    </PreviewContainer>
  ),

  ecommerce: () => (
    <PreviewContainer>
      <PreviewCard className="w-full max-w-32 space-y-2">
        <div className="bg-muted/50 w-full h-8 rounded-sm" />
        <div className="space-y-1">
          <span className="block h-1 w-8/12 rounded-full bg-black/10 dark:bg-white/10" />
          <span className="block h-1 w-6/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex justify-between items-center">
          <span className="block h-1 w-4/12 rounded-full bg-primary/60" />
          <PreviewButton primary width="w-6" />
        </div>
      </PreviewCard>
    </PreviewContainer>
  ),

  pricing: () => (
    <PreviewContainer>
      <div className="flex gap-1 w-full max-w-32">
        <PreviewCard className="flex-1 space-y-1 p-1.5">
          <div className="block h-1 w-3/4 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="flex items-baseline gap-0.5">
            <div className="block h-1.5 w-3 rounded-full bg-primary/60" />
            <div className="block h-1 w-2 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <PreviewButton width="w-full" />
        </PreviewCard>
        <PreviewCard className="flex-1 space-y-1 p-1.5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="block h-1 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
            <div className="bg-primary/20 rounded-full px-1 py-0.5">
              <div className="block h-0.5 w-2 rounded-full bg-primary/60" />
            </div>
          </div>
          <div className="flex items-baseline gap-0.5">
            <div className="block h-1.5 w-4 rounded-full bg-primary" />
            <div className="block h-1 w-2 rounded-full bg-black/10 dark:bg-white/10" />
          </div>
          <PreviewButton primary width="w-full" />
        </PreviewCard>
      </div>
    </PreviewContainer>
  ),

  tables: () => (
    <PreviewContainer>
      <PreviewCard className="w-full max-w-32 space-y-1.5 p-2">
        <div className="flex gap-1 pb-1 border-b border-border/30">
          {[5, 7, 3].map((width, i) => (
            <PreviewLine
              key={i}
              width={`w-${width}`}
              height="h-0.5"
              className="bg-foreground/70"
            />
          ))}
        </div>
        <div className="space-y-0.5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex gap-1 items-center">
              <PreviewLine width="w-5" height="h-0.5" className="bg-muted/60" />
              <PreviewLine width="w-7" height="h-0.5" className="bg-muted/60" />
              <div className="bg-muted/40 rounded-sm px-1 py-0.5">
                <PreviewLine
                  width="w-3"
                  height="h-0.5"
                  className="bg-muted/80"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-0.5 pt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full ${i === 0 ? "bg-primary/60" : "bg-muted/40"}`}
            />
          ))}
        </div>
      </PreviewCard>
    </PreviewContainer>
  ),

  marketing: () => (
    <PreviewContainer>
      <div className="w-32 items-center space-y-2 text-center">
        <div className="flex flex-col items-center gap-2 p-2 text-center">
          <div className="block h-1 w-5/12 rounded-full bg-black/10 dark:bg-white/10" />
          <div className="block h-1 w-10/12 rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        <div className="flex justify-center gap-1">
          <PreviewButton primary width="w-4" />
          <PreviewButton width="w-4" />
        </div>
      </div>
    </PreviewContainer>
  ),

  navigation: () => (
    <PreviewContainer>
      <PreviewCard className="w-full max-w-32 space-y-1 p-2">
        {/* Root level item - expanded */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[3px] border-l-foreground/60 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent" />
          </div>
          <PreviewLine width="w-6" height="h-1" className="bg-foreground/70" />
        </div>

        {/* Child items - indented */}
        <div className="ml-2 space-y-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[3px] border-t-foreground/60 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent" />
            </div>
            <PreviewLine width="w-5" height="h-0.5" className="bg-muted/60" />
          </div>
          <div className="ml-2 space-y-0.5">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-muted/40" />
              <PreviewLine width="w-4" height="h-0.5" className="bg-muted/60" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-muted/40" />
              <PreviewLine width="w-3" height="h-0.5" className="bg-muted/60" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-muted/40" />
            <PreviewLine width="w-4" height="h-0.5" className="bg-muted/60" />
          </div>
        </div>

        {/* Another root level item - collapsed */}
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[3px] border-t-foreground/60 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent" />
          </div>
          <PreviewLine width="w-5" height="h-1" className="bg-foreground/70" />
        </div>
      </PreviewCard>
    </PreviewContainer>
  ),
};
