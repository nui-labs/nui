import { useEffect, useState } from "react";
import { Progress } from "@nui/core";

export default function ProgressDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => (prev === 100 ? 100 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80">
      <Progress value={value} />
    </div>
  );
}
