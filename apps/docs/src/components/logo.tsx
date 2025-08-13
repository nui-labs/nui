import { cn } from "@nui/core";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 45 45" className={cn("h-8 w-8", className)}>
      <path
        d="M36.778 24.328 9 10v3.36l27.778 14.328v-3.36ZM23.004 31.443 9 24.328v3.36L23.004 35v-3.557ZM36.778 31.443 9 17.115v3.656L36.778 35v-3.557ZM23.004 13.36V10l13.774 7.115v3.656L23.004 13.36Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
