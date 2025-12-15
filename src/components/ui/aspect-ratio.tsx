import * as React from "react";
import { cn } from "@/lib/utils";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

function AspectRatio({
  ratio = 1,
  className,
  children,
  style,
  ...props
}: AspectRatioProps) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full", className)}
      style={{
        paddingBottom: `${100 / ratio}%`,
        ...style,
      }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export { AspectRatio };
