import { CopyIcon, Share2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@nui/core";

export default function PopoverDemo() {
  const copyToClipboard = () => {
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={(props) => (
          <Button {...props} variant="outline" size="icon">
            <Share2Icon />
          </Button>
        )}
      />
      <PopoverContent className="w-[calc(100vw-4rem)] sm:w-[500px]">
        <PopoverHeader>
          <PopoverTitle>Share</PopoverTitle>
          <PopoverDescription>Share this component.</PopoverDescription>
        </PopoverHeader>
        <div className="mt-2 flex w-full gap-2">
          <Input
            inputContainerClassName="w-full"
            value={window.location.href}
            readOnly
          />
          <Button className="shrink-0" size="icon" onClick={copyToClipboard}>
            <CopyIcon />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
