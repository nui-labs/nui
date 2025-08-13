import { Avatar, AvatarFallback, AvatarImage } from "@nui/core";

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="/avatars/bora.png" alt="User" />
      <AvatarFallback>BB</AvatarFallback>
    </Avatar>
  );
}
