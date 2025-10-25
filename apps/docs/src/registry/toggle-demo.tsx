import { PinIcon } from "lucide-react";
import { Toggle } from "@nui/core";

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Pin">
      <PinIcon />
    </Toggle>
  );
}
