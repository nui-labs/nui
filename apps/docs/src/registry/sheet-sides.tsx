import {
  Button,
  Label,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea,
} from "@nui/core";

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

export default function SheetSides() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SHEET_SIDES.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={(props) => (
              <Button {...props} className="w-full">
                {side}
              </Button>
            )}
          />
          <SheetContent side={side}>
            <SheetClose />
            <SheetHeader>
              <SheetTitle>Submit Feedback</SheetTitle>
              <SheetDescription>
                Please share your feedback with us to help improve our service.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-2 px-4">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea id="feedback" placeholder="Type your feedback here." />
            </div>
            <SheetFooter>
              <Button size="sm">Submit</Button>
              <SheetClose
                render={(props) => (
                  <Button {...props} size="sm" variant="ghost">
                    Close
                  </Button>
                )}
              />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
