import { PinIcon } from "lucide-react";
import { Toggle } from "@nui/core";

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-4">
      <Toggle aria-label="Pin" size="sm">
        <PinIcon />
      </Toggle>
      <Toggle aria-label="Pin" size="default">
        <PinIcon />
      </Toggle>
      <Toggle aria-label="Pin" size="lg">
        <PinIcon />
      </Toggle>
    </div>
  );
}
