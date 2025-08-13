import { Twitter } from "lucide-react";
import {
  buttonVariants,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@nui/core";

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger
        className={buttonVariants({ variant: "outline", size: "icon" })}
      >
        <Twitter />
      </TooltipTrigger>
      <TooltipContent>
        <span>
          Follow me{" "}
          <a
            className="font-medium"
            href="https://x.com/borabalogluu"
            target="_blank"
            rel="noreferrer"
          >
            @borabalogluu
          </a>
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
