import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Responsive value type for breakpoint-aware props
 * @example
 * { base: "row", md: "column", lg: "row" }
 */
type ResponsiveValue<T> = T | {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  "2xl"?: T
}

/**
 * Resolves a responsive value to Tailwind classes
 */
function resolveResponsive<T extends string | number>(
  value: ResponsiveValue<T> | undefined,
  classMap: Record<string, string>
): string {
  if (value === undefined) return ""
  
  if (typeof value !== "object") {
    return classMap[String(value)] ?? ""
  }
  
  return Object.entries(value)
    .filter(([, val]) => val !== undefined)
    .map(([breakpoint, val]) => {
      const cls = classMap[String(val)]
      if (!cls) return ""
      return breakpoint === "base" ? cls : cls.split(" ").map(c => `${breakpoint}:${c}`).join(" ")
    })
    .filter(Boolean)
    .join(" ")
}

const directionMap: Record<string, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
}

const wrapMap: Record<string, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
}

const justifyMap: Record<string, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

const alignMap: Record<string, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
}

const gapMap: Record<string, string> = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
  "16": "gap-16",
  "20": "gap-20",
  "24": "gap-24",
}

/**
 * Flex layout variants using CVA for static variant support
 * @see {@link FlexProps} for usage
 * @example
 * ```tsx
 * <Flex direction="column" gap={4} align="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 */
const flexVariants = cva("", {
  variants: {
    inline: {
      true: "inline-flex",
      false: "flex",
    },
  },
  defaultVariants: {
    inline: false,
  },
})

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse"
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse"
type FlexJustify = "start" | "end" | "center" | "between" | "around" | "evenly"
type FlexAlign = "start" | "end" | "center" | "baseline" | "stretch"
type FlexGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24

type FlexElement = "div" | "section" | "nav" | "main" | "article" | "aside" | "header" | "footer" | "ul" | "ol" | "form" | "fieldset" | "span"

interface FlexProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "wrap">,
    VariantProps<typeof flexVariants> {
  /** Semantic HTML element to render */
  as?: FlexElement
  /** Flex direction - supports responsive values */
  direction?: ResponsiveValue<FlexDirection>
  /** Flex wrap behavior - supports responsive values */
  wrap?: ResponsiveValue<FlexWrap>
  /** Justify content alignment - supports responsive values */
  justify?: ResponsiveValue<FlexJustify>
  /** Align items alignment - supports responsive values */
  align?: ResponsiveValue<FlexAlign>
  /** Gap between items - supports responsive values */
  gap?: ResponsiveValue<FlexGap>
}

/**
 * Flex layout primitive for flexible box layouts.
 * Supports responsive values for all layout props.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
 * @example
 * ```tsx
 * // Basic usage
 * <Flex direction="row" gap={4} align="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * 
 * // Responsive layout
 * <Flex 
 *   direction={{ base: "column", md: "row" }} 
 *   gap={{ base: 2, lg: 6 }}
 * >
 *   <div>Responsive Item</div>
 * </Flex>
 * 
 * // Semantic HTML
 * <Flex as="nav" justify="between" align="center">
 *   <Logo />
 *   <NavLinks />
 * </Flex>
 * ```
 */
function Flex({
  as: Component = "div",
  className,
  inline,
  direction = "row",
  wrap,
  justify,
  align,
  gap,
  ...props
}: FlexProps) {
  const responsiveClasses = cn(
    resolveResponsive(direction, directionMap),
    resolveResponsive(wrap, wrapMap),
    resolveResponsive(justify, justifyMap),
    resolveResponsive(align, alignMap),
    resolveResponsive(gap, gapMap),
  )

  return (
    <Component
      data-slot="flex"
      className={cn(flexVariants({ inline }), responsiveClasses, className)}
      {...props}
    />
  )
}

export { Flex, flexVariants, resolveResponsive }
export type { FlexProps, FlexDirection, FlexWrap, FlexJustify, FlexAlign, FlexGap, ResponsiveValue }
