import * as React from "react";

import { cn } from "@/lib/utils";

type SpacerAxis = "horizontal" | "vertical";

interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | "auto";
  axis?: SpacerAxis;
}

function Spacer({
  size = "auto",
  axis = "horizontal",
  className,
  ...props
}: SpacerProps) {
  if (size === "auto") {
    return (
      <div
        data-slot="spacer"
        aria-hidden="true"
        className={cn("flex-1", className)}
        {...props}
      />
    );
  }

  const sizeMap: Record<number, string> = {
    0: "",
    1: axis === "horizontal" ? "w-1" : "h-1",
    2: axis === "horizontal" ? "w-2" : "h-2",
    3: axis === "horizontal" ? "w-3" : "h-3",
    4: axis === "horizontal" ? "w-4" : "h-4",
    5: axis === "horizontal" ? "w-5" : "h-5",
    6: axis === "horizontal" ? "w-6" : "h-6",
    8: axis === "horizontal" ? "w-8" : "h-8",
    10: axis === "horizontal" ? "w-10" : "h-10",
    12: axis === "horizontal" ? "w-12" : "h-12",
    16: axis === "horizontal" ? "w-16" : "h-16",
    20: axis === "horizontal" ? "w-20" : "h-20",
    24: axis === "horizontal" ? "w-24" : "h-24",
  };

  return (
    <div
      data-slot="spacer"
      aria-hidden="true"
      className={cn(sizeMap[size] ?? "", className)}
      {...props}
    />
  );
}

export { Spacer };

export type { SpacerProps, SpacerAxis };
