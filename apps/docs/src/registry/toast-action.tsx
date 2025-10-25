import { Button, useToast } from "@nui/core";

export default function ToastActionDemo() {
  const toast = useToast();

  return (
    <Button
      onClick={() => {
        const id = toast.add({
          title: "Your email has been sent",
          description: "We'll get back to you as soon as possible",
          actionProps: {
            children: "Unsend",
            onClick: () => {
              toast.close(id);
              toast.add({
                title: "Email unsent",
                type: "success",
              });
            },
          },
        });
      }}
    >
      Show Toast
    </Button>
  );
}
