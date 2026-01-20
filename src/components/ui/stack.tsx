import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { resolveResponsive, type ResponsiveValue } from "@/components/ui/flex"

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

const alignMap: Record<string, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
}

const justifyMap: Record<string, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
}

/**
 * Stack layout variants for vertical/horizontal stacking
 * @see {@link StackProps} for usage
 */
const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    inline: {
      true: "inline-flex",
      false: "flex",
    },
  },
  defaultVariants: {
    direction: "vertical",
    inline: false,
  },
})

type StackDirection = "vertical" | "horizontal"
type StackAlign = "start" | "end" | "center" | "baseline" | "stretch"
type StackJustify = "start" | "end" | "center" | "between" | "around" | "evenly"
type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24
type StackElement = "div" | "section" | "nav" | "main" | "article" | "aside" | "header" | "footer" | "ul" | "ol" | "form" | "fieldset" | "span"

interface StackProps
  extends React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof stackVariants>, "direction"> {
  /** Semantic HTML element to render */
  as?: StackElement
  /** Stack direction */
  direction?: StackDirection
  /** Gap between items - supports responsive values */
  gap?: ResponsiveValue<StackGap>
  /** Align items (cross-axis) - supports responsive values */
  align?: ResponsiveValue<StackAlign>
  /** Justify content (main-axis) - supports responsive values */
  justify?: ResponsiveValue<StackJustify>
  /** Insert dividers between children */
  dividers?: boolean
  /** Custom divider element */
  dividerElement?: React.ReactNode
}

/**
 * Stack layout component for vertical or horizontal stacking.
 * Simplified alternative to Flex for common stacking patterns.
 * 
 * @example
 * ```tsx
 * // Vertical stack (default)
 * <Stack gap={4}>
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </Stack>
 * 
 * // Horizontal stack with dividers
 * <Stack direction="horizontal" gap={4} dividers>
 *   <Button>Action 1</Button>
 *   <Button>Action 2</Button>
 * </Stack>
 * 
 * // Responsive gap
 * <Stack gap={{ base: 2, md: 4, lg: 6 }}>
 *   <Item />
 * </Stack>
 * ```
 */
function Stack({
  as: Component = "div",
  className,
  direction = "vertical",
  inline,
  gap = 4,
  align,
  justify,
  dividers = false,
  dividerElement,
  children,
  ...props
}: StackProps) {
  const responsiveClasses = cn(
    resolveResponsive(gap, gapMap),
    resolveResponsive(align, alignMap),
    resolveResponsive(justify, justifyMap),
  )

  const renderChildren = () => {
    if (!dividers) return children

    const childArray = React.Children.toArray(children).filter(Boolean)
    const divider = dividerElement ?? (
      <Separator
        orientation={direction === "vertical" ? "horizontal" : "vertical"}
        decorative
      />
    )

    return childArray.map((child, index) => (
      <React.Fragment key={index}>
        {child}
        {index < childArray.length - 1 && divider}
      </React.Fragment>
    ))
  }

  return (
    <Component
      data-slot="stack"
      className={cn(stackVariants({ direction, inline }), responsiveClasses, className)}
      {...props}
    >
      {renderChildren()}
    </Component>
  )
}

/**
 * Horizontal stack - convenience wrapper for Stack with direction="horizontal"
 * @example
 * ```tsx
 * <HStack gap={4} align="center">
 *   <Avatar />
 *   <Text>Username</Text>
 * </HStack>
 * ```
 */
function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="horizontal" {...props} />
}

/**
 * Vertical stack - convenience wrapper for Stack with direction="vertical"
 * @example
 * ```tsx
 * <VStack gap={2}>
 *   <Heading>Title</Heading>
 *   <Text>Description</Text>
 * </VStack>
 * ```
 */
function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="vertical" {...props} />
}

export { Stack, HStack, VStack, stackVariants }
export type { StackProps, StackDirection, StackAlign, StackJustify, StackGap }
