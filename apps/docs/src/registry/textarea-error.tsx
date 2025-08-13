import { Textarea } from "@nui/core";

export default function TextareaError() {
  return (
    <Textarea
      className="w-80"
      placeholder="Enter your message..."
      aria-invalid
    />
  );
}
