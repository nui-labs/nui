import { AspectRatio } from "@nui/core";

export default function AspectRatioDemo() {
  return (
    <AspectRatio
      ratio={16 / 9}
      className="bg-card text-card-foreground rounded-lg border"
    >
      <div className="flex size-full items-center justify-center font-medium">
        Content
      </div>
    </AspectRatio>
  );
}
