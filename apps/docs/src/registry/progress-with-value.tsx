import { useEffect, useState } from "react";
import { Progress, ProgressValue } from "@nui/core";

export default function ProgressWithValueDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => (prev === 100 ? 100 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80">
      <Progress value={value}>
        <ProgressValue />
      </Progress>
    </div>
  );
}
