import { useState } from "react";
import { StarIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Textarea,
} from "@nui/core";

export function FeedbackCard() {
  const [rating, setRating] = useState<number | undefined>(undefined);

  const handleChangeRating = (newRating: number) => {
    if (newRating === rating) {
      setRating(undefined);
    } else {
      setRating(newRating);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
        <CardDescription>
          Please rate your experience at the restaurant
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col space-y-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={cn(
                "size-8 cursor-pointer transition-all",
                rating && star <= rating
                  ? "fill-amber-300 text-amber-300"
                  : "text-muted-foreground fill-none",
              )}
              onClick={() => handleChangeRating(star)}
            />
          ))}
        </div>
        <Textarea
          className="resize-vertical flex-1 resize-none"
          placeholder="Write your feedback..."
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full">Submit Feedback</Button>
      </CardFooter>
    </Card>
  );
}
