import { PinIcon } from "lucide-react";
import { Toggle } from "@nui/core";

export default function ToggleOutline() {
  return (
    <Toggle aria-label="Pin" variant="outline">
      <PinIcon />
    </Toggle>
  );
}
