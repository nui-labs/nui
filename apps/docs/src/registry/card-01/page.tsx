import { CheckIcon, StarIcon, XIcon } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
} from "@nui/core";

import { pricingPlans, type PricingPlan } from "./data";

interface PricingCardProps {
  plan: PricingPlan;
  isPopular?: boolean;
  className?: string;
}

function PricingCard({ plan, isPopular, className }: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        isPopular && "border-primary shadow-lg scale-105",
        className,
      )}
    >
      {isPopular && (
        <div className="absolute top-0 left-0 right-0">
          <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
            <StarIcon className="inline size-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      <CardHeader className={cn("text-center", isPopular && "pt-12")}>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              {feature.included ? (
                <CheckIcon className="size-4 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <XIcon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground line-through",
                )}
              >
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          size="lg"
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PricingCards() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your needs. Upgrade or downgrade at any
          time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {pricingPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} isPopular={plan.popular} />
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground mb-4">
          All plans include 30-day money-back guarantee
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>✓ No setup fees</span>
          <span>✓ Cancel anytime</span>
          <span>✓ 24/7 support</span>
        </div>
      </div>
    </div>
  );
}
