import { useState } from "react";
import { Calendar } from "@nui/core";

export default function CalendarMultiple() {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>(
    undefined,
  );

  return (
    <Calendar
      mode="multiple"
      selected={selectedDates}
      onSelect={setSelectedDates}
      showOutsideDays
    />
  );
}
