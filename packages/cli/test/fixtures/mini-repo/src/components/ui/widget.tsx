import { cn } from "cn";
import { helperLabel } from "@/lib/layout-responsive";

export function Widget({ className }: { className?: string }) {
  return (
    <div
      data-slot="widget"
      aria-label={helperLabel()}
      className={cn("h-6 w-6 bg-primary", className)}
    />
  );
}
