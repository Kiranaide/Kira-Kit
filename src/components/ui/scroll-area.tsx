"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

type ScrollbarSize = "thin" | "default" | "thick";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation;
  scrollbarSize?: ScrollbarSize;
  "aria-label"?: string;
}

function ScrollArea({
  className,
  orientation = "vertical",
  scrollbarSize = "default",
  children,
  ...props
}: ScrollAreaProps) {
  const scrollbarSizeMap = {
    thin: "[&::-webkit-scrollbar]:size-1.5 [&::-webkit-scrollbar-thumb]:size-1.5",
    default:
      "[&::-webkit-scrollbar]:size-2.5 [&::-webkit-scrollbar-thumb]:size-2.5",
    thick:
      "[&::-webkit-scrollbar]:size-3.5 [&::-webkit-scrollbar-thumb]:size-3.5",
  };

  const overflowClass = {
    vertical: "overflow-y-auto overflow-x-hidden",
    horizontal: "overflow-x-auto overflow-y-hidden",
    both: "overflow-auto",
  }[orientation];

  return (
    <div
      data-slot="scroll-area"
      data-orientation={orientation}
      className={cn(
        "h-full w-full rounded-[inherit]",
        overflowClass,

        "[&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:rounded",
        scrollbarSizeMap[scrollbarSize],
        "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:hover:bg-border/80",

        "[scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]",

        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",

        "scroll-smooth motion-reduce:scroll-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SimpleScrollArea(props: ScrollAreaProps) {
  return <ScrollArea {...props} />;
}

export { ScrollArea, SimpleScrollArea };

export type { ScrollAreaProps, ScrollAreaOrientation, ScrollbarSize };
