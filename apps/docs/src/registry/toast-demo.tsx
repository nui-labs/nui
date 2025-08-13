import { Button, useToast } from "@nui/core";

export default function ToastDemo() {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Your request has been sent",
          description: "We'll get back to you as soon as possible",
        })
      }
    >
      Show Toast
    </Button>
  );
}
