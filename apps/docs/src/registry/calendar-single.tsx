import { useState } from "react";
import { Calendar } from "@nui/core";

export default function CalendarSingle() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      showOutsideDays
    />
  );
}
