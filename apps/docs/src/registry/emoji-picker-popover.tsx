import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerEmpty,
  EmojiPickerList,
  EmojiPickerLoading,
  EmojiPickerSearch,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nui/core";

export default function EmojiPickerPopoverDemo() {
  const [open, setOpen] = useState(false);
  const [emoji, setEmoji] = useState<string | undefined>(undefined);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="icon">
            {emoji ? emoji : "👇"}
          </Button>
        )}
      />
      <PopoverContent className="rounded-md p-0 outline-offset-0">
        <EmojiPicker
          className="border-none"
          onEmojiSelect={({ emoji, label }) => {
            setEmoji(emoji);
            setOpen(false);
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
      </PopoverContent>
    </Popover>
  );
}
