import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { Toggle, ToggleGroup } from "@nui/core";

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup toggleMultiple>
      <Toggle value="bold">
        <BoldIcon />
      </Toggle>
      <Toggle value="italic">
        <ItalicIcon />
      </Toggle>
      <Toggle value="underline">
        <UnderlineIcon />
      </Toggle>
    </ToggleGroup>
  );
}
