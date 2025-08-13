import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@nui/core";

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      showOutsideDays
    />
  );
}
