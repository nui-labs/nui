import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { Button, buttonVariants } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";
import { useRadiusStore } from "./radius-store";
import {
  BASE_RADIUS_CONFIG,
  RADIUS_CONFIG,
  type BaseRadiusToken,
  type RadiusToken,
} from "./radius-utils";

// Preset type for dropdown options
interface RadiusPreset {
  token: BaseRadiusToken;
  label: string;
  value: number;
}

// Get available radius presets from base config
function getRadiusPresets(): RadiusPreset[] {
  return Object.entries(BASE_RADIUS_CONFIG)
    .map(([token, config]) => {
      let numericValue = 0;

      // Try to parse rem values first
      const remMatch = config.value.match(/^([\d.]+)rem$/);
      if (remMatch) {
        numericValue = parseFloat(remMatch[1]);
      } else {
        // Try to parse px values and convert to rem (assuming 16px = 1rem)
        const pxMatch = config.value.match(/^([\d.]+)px$/);
        if (pxMatch) {
          numericValue = parseFloat(pxMatch[1]) / 16;
        } else if (config.value === "0px" || config.value === "0") {
          numericValue = 0;
        } else if (config.value === "9999px") {
          // For "full" radius, use a reasonable value for display
          numericValue = 999; // Large enough to be distinguishable
        }
      }

      return {
        token: token as BaseRadiusToken,
        label: config.label,
        value: numericValue,
      };
    })
    .filter((preset) => {
      // Filter out presets that don't make sense for semantic radius editing
      // Keep reasonable values (0 to 2rem, plus the special "full" case)
      return preset.value <= 2 || preset.value === 999;
    });
}

/**
 * Simple radius editor using React state management
 */
export function RadiusEditor() {
  const { values, setValue } = useRadiusStore();
  const [customInputs, setCustomInputs] = useState<Record<RadiusToken, string>>(
    {} as Record<RadiusToken, string>,
  );
  const [showCustomInput, setShowCustomInput] = useState<
    Record<RadiusToken, boolean>
  >({} as Record<RadiusToken, boolean>);

  const presets = getRadiusPresets();

  // Find matching preset for a value
  const findMatchingPreset = (value: number): RadiusPreset | undefined => {
    return presets.find((preset) => Math.abs(preset.value - value) < 0.001);
  };

  // Handle custom input submission
  const handleCustomInput = (group: RadiusToken, inputValue: string) => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setValue(group, numericValue);
      setCustomInputs((prev) => ({ ...prev, [group]: "" }));
      setShowCustomInput((prev) => ({ ...prev, [group]: false }));
    }
  };

  // Handle focus without selecting all text
  const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // Prevent default selection behavior
    event.preventDefault();
    const input = event.target;
    // Use setTimeout to ensure the focus event has completed
    setTimeout(() => {
      // Move cursor to end instead of selecting all
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-md font-semibold">Radius</span>
      </div>

      <div className="space-y-3">
        {Object.entries(RADIUS_CONFIG).map(([group, config]) => {
          const currentValue = values[group as RadiusToken];
          const matchingPreset = findMatchingPreset(currentValue);

          return (
            <div key={group} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-[80px]">
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentValue}rem
                </span>
              </div>

              {showCustomInput[group as RadiusToken] ? (
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customInputs[group as RadiusToken] || ""}
                    onChange={(e) =>
                      setCustomInputs((prev) => ({
                        ...prev,
                        [group]: e.target.value,
                      }))
                    }
                    onFocus={handleInputFocus}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCustomInput(
                          group as RadiusToken,
                          customInputs[group as RadiusToken] || "0",
                        );
                      } else if (e.key === "Escape") {
                        setShowCustomInput((prev) => ({
                          ...prev,
                          [group]: false,
                        }));
                        setCustomInputs((prev) => ({ ...prev, [group]: "" }));
                      }
                    }}
                    className="h-7 w-16 text-xs"
                    placeholder="0.5"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleCustomInput(
                        group as RadiusToken,
                        customInputs[group as RadiusToken] || "0",
                      )
                    }
                    className="h-7 w-7 p-0"
                  >
                    <CheckIcon className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={
                      buttonVariants({
                        variant: "outline",
                        size: "sm",
                      }) + " h-7 px-2 text-xs"
                    }
                  >
                    {matchingPreset
                      ? matchingPreset.label
                      : `${currentValue}rem`}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {presets.map((preset) => {
                      const isSelected =
                        Math.abs(preset.value - currentValue) < 0.001;

                      return (
                        <DropdownMenuItem
                          key={preset.token}
                          onClick={() =>
                            setValue(group as RadiusToken, preset.value)
                          }
                          className={isSelected ? "bg-accent" : ""}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>
                              {preset.label} ({preset.value}rem)
                            </span>
                            {isSelected && <CheckIcon className="w-3 h-3" />}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        setShowCustomInput((prev) => ({
                          ...prev,
                          [group]: true,
                        }))
                      }
                    >
                      Custom...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
