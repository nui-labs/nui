import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerEmpty,
  EmojiPickerList,
  EmojiPickerLoading,
  EmojiPickerSearch,
} from "@nui/core";

export default function EmojiPickerDemo() {
  return (
    <EmojiPicker
      onEmojiSelect={({ emoji, label }) => {
        toast(() => (
          <p className="flex items-center gap-2 text-sm">
            <span className="text-lg">{emoji}</span>
            {label}
          </p>
        ));
      }}
    >
      <EmojiPickerSearch />
      <EmojiPickerContent>
        <EmojiPickerLoading>
          <Loader2 className="size-4 animate-spin" />
        </EmojiPickerLoading>
        <EmojiPickerEmpty>No results</EmojiPickerEmpty>
        <EmojiPickerList />
      </EmojiPickerContent>
    </EmojiPicker>
  );
}
