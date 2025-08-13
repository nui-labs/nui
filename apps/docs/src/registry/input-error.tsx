import { Input } from "@nui/core";

export default function InputError() {
  return (
    <Input inputContainerClassName="w-80" placeholder="Name" aria-invalid />
  );
}
