import { PinIcon } from "lucide-react";
import { Toggle } from "@nui/core";

export default function ToggleDisabled() {
  return (
    <Toggle aria-label="Pin" disabled>
      <PinIcon />
    </Toggle>
  );
}
