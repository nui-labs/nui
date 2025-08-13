import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@nui/core";

export default function AlertDemo() {
  return (
    <Alert>
      <AlertTriangleIcon />
      <AlertTitle>No Internet Connection</AlertTitle>
      <AlertDescription>
        Please check your internet connection and try again.
      </AlertDescription>
    </Alert>
  );
}
