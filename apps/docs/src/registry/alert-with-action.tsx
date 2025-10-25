import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertTitle, Button } from "@nui/core";

export default function AlertWithAction() {
  return (
    <Alert>
      <AlertTriangleIcon />
      <AlertTitle className="line-clamp-1 max-w-[calc(100%-4rem)] overflow-ellipsis">
        No Internet Connection
      </AlertTitle>
      <Button
        className="absolute top-1/2 right-4 h-6 -translate-y-1/2 shadow-none"
        size="sm"
        variant="outline"
      >
        Try Again
      </Button>
    </Alert>
  );
}
