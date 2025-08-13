import { Loader2Icon } from "lucide-react";
import { Button } from "@nui/core";

export default function ButtonLoading() {
  return (
    <Button className="gap-2" disabled>
      <div className="animate-spin">
        <Loader2Icon />
      </div>
      Loading
    </Button>
  );
}
