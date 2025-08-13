import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import { Toggle, ToggleGroup } from "@nui/core";

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup>
      <Toggle value="left">
        <AlignLeftIcon />
      </Toggle>
      <Toggle value="center">
        <AlignCenterIcon />
      </Toggle>
      <Toggle value="right">
        <AlignRightIcon />
      </Toggle>
    </ToggleGroup>
  );
}
