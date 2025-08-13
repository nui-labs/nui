import { Button, ButtonProps } from "@nui/core";

export interface HeroAction {
  label: string;
  variant?: ButtonProps["variant"];
  onClick?: () => void;
  href?: string;
}

export interface HeroProps {
  title: string;
  description: string;
  actions?: HeroAction[];
  className?: string;
}

export function Hero({ title, description, actions, className }: HeroProps) {
  return (
    <div
      className={`flex flex-col items-center text-center gap-6 pb-12 ${className || ""}`}
    >
      {/* Main Heading */}
      <div className="flex flex-col gap-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      {actions && actions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              size="lg"
              variant={action.variant || "default"}
              onClick={action.onClick}
            >
              {action.href ? (
                <a href={action.href}>{action.label}</a>
              ) : (
                action.label
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
