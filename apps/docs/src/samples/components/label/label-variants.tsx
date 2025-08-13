import { Label } from "@nui/core";

export default function LabelVariants() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="default">Default Label</Label>
        <input
          id="default"
          type="text"
          placeholder="Default input"
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="required"
          className="after:content-['*'] after:ml-0.5 after:text-destructive"
        >
          Required Field
        </Label>
        <input
          id="required"
          type="text"
          placeholder="Required input"
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="disabled" className="text-muted-foreground">
          Disabled Field
        </Label>
        <input
          id="disabled"
          type="text"
          placeholder="Disabled input"
          className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
          disabled
        />
      </div>
    </div>
  );
}
