import { toast } from "sonner";
import { Button } from "@nui/core";

export default function SonnerPromiseDemo() {
  return (
    <Button
      onClick={() =>
        toast.promise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve("Request sent");
            }, 2000);
          }),
          {
            loading: "Sending request...",
            success: "Request sent",
          },
        )
      }
    >
      Show Toast
    </Button>
  );
}
