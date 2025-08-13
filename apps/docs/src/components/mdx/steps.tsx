import React from "react";
import { cn } from "@nui/core";

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

interface StepProps {
  children: React.ReactNode;
  className?: string;
  stepNumber?: number;
  isLast?: boolean;
}

export function Steps({ children, className }: StepsProps) {
  const stepChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<StepProps> =>
      React.isValidElement(child) && child.type === Step,
  );

  return (
    <div className={cn("not-prose my-8", className)}>
      {stepChildren.map((child, index) =>
        React.cloneElement(child, {
          key: `step-${index + 1}`,
          stepNumber: index + 1,
          isLast: index === stepChildren.length - 1,
        }),
      )}
    </div>
  );
}

export function Step({
  children,
  className,
  stepNumber,
  isLast = false,
}: StepProps) {
  return (
    <div className={cn("relative flex gap-6", !isLast && "mb-8", className)}>
      {/* Vertical connecting line */}
      {!isLast && (
        <div className="absolute left-4 top-8 w-px h-full bg-border -translate-x-1/2" />
      )}

      {/* Step number indicator */}
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground font-medium text-background text-sm z-10">
        {stepNumber}
      </div>

      {/* Step content */}
      <div className="flex-1 prose prose-slate dark:prose-invert max-w-none [&>*:first-child]:mt-0">
        {children}
      </div>
    </div>
  );
}
