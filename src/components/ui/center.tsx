import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Center variants for centering content
 * @see {@link CenterProps} for usage
 */
const centerVariants = cva("", {
  variants: {
    /** Centering method */
    type: {
      flex: "flex items-center justify-center",
      grid: "grid place-items-center",
      absolute: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    /** Display mode */
    inline: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { type: "flex", inline: true, className: "inline-flex items-center justify-center" },
    { type: "flex", inline: false, className: "flex items-center justify-center" },
    { type: "grid", inline: true, className: "inline-grid place-items-center" },
    { type: "grid", inline: false, className: "grid place-items-center" },
  ],
  defaultVariants: {
    type: "flex",
    inline: false,
  },
})

type CenterType = "flex" | "grid" | "absolute"
type CenterElement = "div" | "span" | "section" | "main" | "article"

interface CenterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof centerVariants> {
  /** Semantic HTML element to render */
  as?: CenterElement
  /** Centering method */
  type?: CenterType
}

/**
 * Center component for centering content horizontally and vertically.
 * Provides multiple centering strategies for different use cases.
 * 
 * @example
 * ```tsx
 * // Flex centering (default)
 * <Center className="h-screen">
 *   <Logo />
 * </Center>
 * 
 * // Grid centering
 * <Center type="grid" className="min-h-64">
 *   <EmptyState />
 * </Center>
 * 
 * // Absolute centering (for overlays)
 * <div className="relative h-96">
 *   <Center type="absolute">
 *     <Spinner />
 *   </Center>
 * </div>
 * 
 * // Inline centering
 * <Center inline className="size-8">
 *   <Icon />
 * </Center>
 * ```
 */
function Center({
  as: Component = "div",
  className,
  type = "flex",
  inline,
  ...props
}: CenterProps) {
  return (
    <Component
      data-slot="center"
      className={cn(centerVariants({ type, inline }), className)}
      {...props}
    />
  )
}

export { Center, centerVariants }
export type { CenterProps, CenterType }
