"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ScrollAreaOrientation = "vertical" | "horizontal" | "both"
type ScrollbarSize = "thin" | "default" | "thick"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Scroll orientation */
  orientation?: ScrollAreaOrientation
  /** Scrollbar size */
  scrollbarSize?: ScrollbarSize
  /** Accessible label for the scroll region */
  "aria-label"?: string
}

/**
 * ScrollArea component for scrollable regions with styled native scrollbars.
 * Uses CSS-styled native scrollbars for best performance and accessibility.
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/
 * @example
 * ```tsx
 * <ScrollArea className="h-72 w-48" aria-label="Scrollable list">
 *   <div className="p-4">
 *     {items.map(item => <Item key={item.id} />)}
 *   </div>
 * </ScrollArea>
 * 
 * <ScrollArea orientation="horizontal" className="w-full">
 *   <div className="flex gap-4 p-4">
 *     {cards.map(card => <Card key={card.id} />)}
 *   </div>
 * </ScrollArea>
 * 
 * <ScrollArea orientation="both" className="h-96 w-full">
 *   <LargeContent />
 * </ScrollArea>
 * ```
 */
function ScrollArea({
  className,
  orientation = "vertical",
  scrollbarSize = "default",
  children,
  ...props
}: ScrollAreaProps) {
  const scrollbarSizeMap = {
    thin: "[&::-webkit-scrollbar]:size-1.5 [&::-webkit-scrollbar-thumb]:size-1.5",
    default: "[&::-webkit-scrollbar]:size-2.5 [&::-webkit-scrollbar-thumb]:size-2.5",
    thick: "[&::-webkit-scrollbar]:size-3.5 [&::-webkit-scrollbar-thumb]:size-3.5",
  }

  const overflowClass = {
    vertical: "overflow-y-auto overflow-x-hidden",
    horizontal: "overflow-x-auto overflow-y-hidden",
    both: "overflow-auto",
  }[orientation]

  return (
    <div
      data-slot="scroll-area"
      data-orientation={orientation}
      className={cn(
        "h-full w-full rounded-[inherit]",
        overflowClass,
        // Custom scrollbar styling (Webkit)
        "[&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:rounded",
        scrollbarSizeMap[scrollbarSize],
        "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:hover:bg-border/80",
        // Firefox scrollbar
        "[scrollbar-width:thin] [scrollbar-color:hsl(var(--border))_transparent]",
        // Focus ring for keyboard users
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        // Smooth scrolling with reduced motion support
        "scroll-smooth motion-reduce:scroll-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Simple alias for ScrollArea for convenience
 */
function SimpleScrollArea(props: ScrollAreaProps) {
  return <ScrollArea {...props} />
}

export { ScrollArea, SimpleScrollArea }
export type { ScrollAreaProps, ScrollAreaOrientation, ScrollbarSize }
