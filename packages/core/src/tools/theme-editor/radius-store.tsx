import { createContext, useContext, useState, type ReactNode } from "react";

import {
  getRadius,
  resetRadius as resetRadiusCSS,
  setRadius as setRadiusCSS,
  type RadiusToken,
} from "./radius-utils";

// Fallback values when CSS is not available
const FALLBACK_VALUES: Record<RadiusToken, number> = {
  boxes: 0.75, // 12px - matches --radius-xl
  fields: 0.5, // 8px - matches --radius-lg
  selectors: 0.25, // 4px - matches --radius-sm
};

/**
 * Get initial radius values from CSS or use fallback defaults
 */
function getInitialValues(): Record<RadiusToken, number> {
  const values = {} as Record<RadiusToken, number>;
  const tokens: RadiusToken[] = ["boxes", "fields", "selectors"];

  for (const group of tokens) {
    const cssValue = getRadius(group);
    // Use fallback if CSS value is 0 (not set)
    values[group] = cssValue > 0 ? cssValue : FALLBACK_VALUES[group];
  }

  return values;
}

// Context type
interface RadiusStoreContextType {
  values: Record<RadiusToken, number>;
  setValue: (group: RadiusToken, value: number) => void;
  reset: () => void;
}

// Create context
const RadiusStoreContext = createContext<RadiusStoreContextType | null>(null);

/**
 * Provider component for radius store
 */
export function RadiusStoreProvider({ children }: { children: ReactNode }) {
  const [values, setValues] =
    useState<Record<RadiusToken, number>>(getInitialValues);

  const setValue = (group: RadiusToken, value: number) => {
    // Update CSS custom property
    setRadiusCSS(group, value);

    // Update local state
    setValues((prev) => ({
      ...prev,
      [group]: value,
    }));
  };

  const reset = () => {
    // Reset CSS to defaults
    resetRadiusCSS();

    // Update state to the known default values immediately
    setValues(FALLBACK_VALUES);
  };

  const contextValue: RadiusStoreContextType = {
    values,
    setValue,
    reset,
  };

  return (
    <RadiusStoreContext.Provider value={contextValue}>
      {children}
    </RadiusStoreContext.Provider>
  );
}

/**
 * Hook to use the radius store context
 */
export function useRadiusStore(): RadiusStoreContextType {
  const context = useContext(RadiusStoreContext);
  if (!context) {
    throw new Error("useRadiusStore must be used within a RadiusStoreProvider");
  }
  return context;
}
