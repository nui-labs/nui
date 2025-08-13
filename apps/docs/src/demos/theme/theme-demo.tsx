import { Button, Card, ThemeToggle, useTheme } from "@nui/core";

export default function ThemeDemo() {
  const { config, isDark, availableVariants, setMode, setVariant, toggleMode } =
    useTheme();

  return (
    <div className="space-y-6">
      {/* Current Theme Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Theme</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Mode:</span> {config.mode}
          </div>
          <div>
            <span className="font-medium">Variant:</span> {config.variant}
          </div>
          <div>
            <span className="font-medium">Is Dark:</span>{" "}
            {isDark ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium">Available Variants:</span>{" "}
            {availableVariants.length}
          </div>
        </div>
      </Card>

      {/* Theme Toggle Components */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Theme Toggle Components</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium min-w-20">Simple:</span>
            <ThemeToggle mode="simple" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium min-w-20">Dropdown:</span>
            <ThemeToggle mode="dropdown" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium min-w-20">Combined:</span>
            <ThemeToggle mode="combined" showVariants />
          </div>
        </div>
      </Card>

      {/* Theme Mode Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Theme Mode</h3>
        <div className="flex gap-2">
          <Button
            variant={config.mode === "light" ? "default" : "outline"}
            onClick={() => setMode("light")}
          >
            Light
          </Button>
          <Button
            variant={config.mode === "dark" ? "default" : "outline"}
            onClick={() => setMode("dark")}
          >
            Dark
          </Button>
          <Button
            variant={config.mode === "auto" ? "default" : "outline"}
            onClick={() => setMode("auto")}
          >
            Auto
          </Button>
          <Button variant="secondary" onClick={toggleMode}>
            Toggle
          </Button>
        </div>
      </Card>

      {/* Theme Variant Controls */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Theme Variants</h3>
        <div className="flex flex-wrap gap-2">
          {availableVariants.map((variant) => (
            <Button
              key={variant}
              variant={config.variant === variant ? "default" : "outline"}
              onClick={() => setVariant(variant)}
              className="capitalize"
            >
              {variant}
            </Button>
          ))}
        </div>
      </Card>

      {/* Color Showcase */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Color Showcase</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-12 bg-primary rounded border" />
            <p className="text-xs text-center">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-secondary rounded border" />
            <p className="text-xs text-center">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-accent rounded border" />
            <p className="text-xs text-center">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-muted rounded border" />
            <p className="text-xs text-center">Muted</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-destructive rounded border" />
            <p className="text-xs text-center">Destructive</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-warning rounded border" />
            <p className="text-xs text-center">Warning</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-success rounded border" />
            <p className="text-xs text-center">Success</p>
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-info rounded border" />
            <p className="text-xs text-center">Info</p>
          </div>
        </div>
      </Card>

      {/* Component Examples */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Component Examples</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-muted-foreground">
              This is a muted background with muted foreground text.
            </p>
          </div>

          <div className="p-4 border rounded-lg">
            <p className="text-foreground">
              This is the default foreground text on a card background.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
