import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@nui/core";

export default function AlertInfo() {
  return (
    <Alert variant="info">
      <InfoIcon />
      <AlertTitle>Browser Update Available</AlertTitle>
      <AlertDescription>
        A new version of your browser is available. Updating your browser
        ensures better security and performance.
      </AlertDescription>
    </Alert>
  );
}
