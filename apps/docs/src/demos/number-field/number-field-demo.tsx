import { NumberField, NumberFieldScrubArea } from "@nui/core";

export default function NumberFieldDemo() {
  return (
    <NumberField className="mx-auto" defaultValue={5} min={0} max={100}>
      <NumberFieldScrubArea />
    </NumberField>
  );
}
