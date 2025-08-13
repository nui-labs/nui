import { Checkbox, Label } from "@nui/core";

export default function CheckboxWithLabel() {
  return (
    <Label className="flex items-center gap-2">
      <Checkbox />
      Accept
    </Label>
  );
}
