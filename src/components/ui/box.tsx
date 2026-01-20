import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Box variants for common styling utilities
 */
const boxVariants = cva("", {
  variants: {
    /** Border radius */
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      default: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
    /** Box shadow */
    shadow: {
      none: "shadow-none",
      sm: "shadow-sm",
      default: "shadow",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
    },
    /** Padding */
    p: {
      0: "p-0",
      1: "p-1",
      2: "p-2",
      3: "p-3",
      4: "p-4",
      5: "p-5",
      6: "p-6",
      8: "p-8",
      10: "p-10",
      12: "p-12",
    },
    /** Horizontal padding */
    px: {
      0: "px-0",
      1: "px-1",
      2: "px-2",
      3: "px-3",
      4: "px-4",
      5: "px-5",
      6: "px-6",
      8: "px-8",
    },
    /** Vertical padding */
    py: {
      0: "py-0",
      1: "py-1",
      2: "py-2",
      3: "py-3",
      4: "py-4",
      5: "py-5",
      6: "py-6",
      8: "py-8",
    },
    /** Margin */
    m: {
      0: "m-0",
      1: "m-1",
      2: "m-2",
      3: "m-3",
      4: "m-4",
      5: "m-5",
      6: "m-6",
      8: "m-8",
      auto: "m-auto",
    },
    /** Display */
    display: {
      block: "block",
      "inline-block": "inline-block",
      inline: "inline",
      flex: "flex",
      "inline-flex": "inline-flex",
      grid: "grid",
      "inline-grid": "inline-grid",
      hidden: "hidden",
    },
    /** Position */
    position: {
      static: "static",
      relative: "relative",
      absolute: "absolute",
      fixed: "fixed",
      sticky: "sticky",
    },
  },
  defaultVariants: {},
})

/**
 * Polymorphic component types
 */
type BoxElement =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "main"
  | "header"
  | "footer"
  | "nav"
  | "form"
  | "fieldset"
  | "ul"
  | "ol"
  | "li"
  | "figure"
  | "figcaption"
  | "address"

interface BoxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "display">,
    VariantProps<typeof boxVariants> {
  /** Semantic HTML element to render */
  as?: BoxElement
  /** Background color (Tailwind class without 'bg-' prefix) */
  bg?: string
  /** Text color (Tailwind class without 'text-' prefix) */
  color?: string
  /** Width (Tailwind class without 'w-' prefix) */
  w?: string
  /** Height (Tailwind class without 'h-' prefix) */
  h?: string
  /** Min width (Tailwind class without 'min-w-' prefix) */
  minW?: string
  /** Min height (Tailwind class without 'min-h-' prefix) */
  minH?: string
  /** Max width (Tailwind class without 'max-w-' prefix) */
  maxW?: string
  /** Max height (Tailwind class without 'max-h-' prefix) */
  maxH?: string
  /** Border (Tailwind class without 'border-' prefix) */
  border?: boolean | string
}

/**
 * Box component - a polymorphic wrapper with utility props.
 * Provides a convenient way to apply common styles without writing className.
 * 
 * @example
 * ```tsx
 * // Basic box with padding and background
 * <Box p={4} bg="muted" rounded="lg">
 *   Content
 * </Box>
 * 
 * // Semantic element with shadow
 * <Box as="section" shadow="md" rounded="xl" p={6}>
 *   <h2>Section Title</h2>
 * </Box>
 * 
 * // Sized box
 * <Box w="full" h="64" bg="primary" rounded="2xl" />
 * 
 * // Positioned box
 * <Box position="absolute" className="top-0 right-0">
 *   <Badge>New</Badge>
 * </Box>
 * 
 * // With border
 * <Box border rounded="lg" p={4}>
 *   Bordered content
 * </Box>
 * ```
 */
function Box({
  as: Component = "div",
  className,
  rounded,
  shadow,
  p,
  px,
  py,
  m,
  display,
  position,
  bg,
  color,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  border,
  ...props
}: BoxProps) {
  const utilityClasses = cn(
    bg && `bg-${bg}`,
    color && `text-${color}`,
    w && `w-${w}`,
    h && `h-${h}`,
    minW && `min-w-${minW}`,
    minH && `min-h-${minH}`,
    maxW && `max-w-${maxW}`,
    maxH && `max-h-${maxH}`,
    border === true && "border",
    typeof border === "string" && `border-${border}`,
  )

  return (
    <Component
      data-slot="box"
      className={cn(
        boxVariants({ rounded, shadow, p, px, py, m, display, position }),
        utilityClasses,
        className
      )}
      {...props}
    />
  )
}

export { Box, boxVariants }
export type { BoxProps, BoxElement }
