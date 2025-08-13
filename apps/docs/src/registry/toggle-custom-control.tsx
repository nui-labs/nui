import { useState } from "react";
import { PinIcon, PinOffIcon } from "lucide-react";
import { Toggle } from "@nui/core";

export default function ToggleCustomControl() {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <Toggle aria-label="Pin" pressed={isPinned} onPressedChange={setIsPinned}>
      {isPinned ? <PinIcon /> : <PinOffIcon />}
    </Toggle>
  );
}
