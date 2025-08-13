import { useState } from "react";
import { Checkbox, CheckboxGroup, Label } from "@nui/core";

const groceries = ["milk", "cheese", "bread", "apples"];

export default function CheckboxGroupDemo() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  return (
    <CheckboxGroup
      aria-labelledby="groceries"
      value={checkedItems}
      onValueChange={(value) => setCheckedItems(value)}
      allValues={groceries}
    >
      <Label className="flex items-center gap-2">
        <Checkbox
          parent
          indeterminate={
            checkedItems.length > 0 && checkedItems.length !== groceries.length
          }
        />
        Groceries
      </Label>

      {groceries.map((grocery) => (
        <Label className="ml-4 flex items-center gap-2" key={grocery}>
          <Checkbox name={grocery} />
          {grocery.charAt(0).toUpperCase() + grocery.slice(1)}
        </Label>
      ))}
    </CheckboxGroup>
  );
}
