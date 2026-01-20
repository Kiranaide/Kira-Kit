import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { resolveResponsive, type ResponsiveValue } from "@/components/ui/flex"

const colsMap: Record<string, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
  "7": "grid-cols-7",
  "8": "grid-cols-8",
  "9": "grid-cols-9",
  "10": "grid-cols-10",
  "11": "grid-cols-11",
  "12": "grid-cols-12",
  none: "grid-cols-none",
  subgrid: "grid-cols-subgrid",
}

const rowsMap: Record<string, string> = {
  "1": "grid-rows-1",
  "2": "grid-rows-2",
  "3": "grid-rows-3",
  "4": "grid-rows-4",
  "5": "grid-rows-5",
  "6": "grid-rows-6",
  none: "grid-rows-none",
  subgrid: "grid-rows-subgrid",
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

const gapXMap: Record<string, string> = {
  "0": "gap-x-0",
  "1": "gap-x-1",
  "2": "gap-x-2",
  "3": "gap-x-3",
  "4": "gap-x-4",
  "5": "gap-x-5",
  "6": "gap-x-6",
  "8": "gap-x-8",
  "10": "gap-x-10",
  "12": "gap-x-12",
}

const gapYMap: Record<string, string> = {
  "0": "gap-y-0",
  "1": "gap-y-1",
  "2": "gap-y-2",
  "3": "gap-y-3",
  "4": "gap-y-4",
  "5": "gap-y-5",
  "6": "gap-y-6",
  "8": "gap-y-8",
  "10": "gap-y-10",
  "12": "gap-y-12",
}

const flowMap: Record<string, string> = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "column-dense": "grid-flow-col-dense",
}

const alignMap: Record<string, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
  baseline: "items-baseline",
}

const justifyMap: Record<string, string> = {
  start: "justify-items-start",
  end: "justify-items-end",
  center: "justify-items-center",
  stretch: "justify-items-stretch",
}

const placeMap: Record<string, string> = {
  start: "place-items-start",
  end: "place-items-end",
  center: "place-items-center",
  stretch: "place-items-stretch",
}

/**
 * Grid layout variants
 * @see {@link GridProps} for usage
 */
const gridVariants = cva("grid", {
  variants: {
    inline: {
      true: "inline-grid",
      false: "grid",
    },
  },
  defaultVariants: {
    inline: false,
  },
})

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "none" | "subgrid"
type GridRows = 1 | 2 | 3 | 4 | 5 | 6 | "none" | "subgrid"
type GridGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24
type GridFlow = "row" | "column" | "dense" | "row-dense" | "column-dense"
type GridAlign = "start" | "end" | "center" | "stretch" | "baseline"
type GridJustify = "start" | "end" | "center" | "stretch"
type GridPlace = "start" | "end" | "center" | "stretch"
type GridElement = "div" | "section" | "main" | "article" | "aside" | "ul" | "ol" | "form"

interface GridProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof gridVariants> {
  /** Semantic HTML element to render */
  as?: GridElement
  /** Number of columns - supports responsive values */
  cols?: ResponsiveValue<GridCols>
  /** Number of rows - supports responsive values */
  rows?: ResponsiveValue<GridRows>
  /** Gap between items - supports responsive values */
  gap?: ResponsiveValue<GridGap>
  /** Horizontal gap - supports responsive values */
  gapX?: ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>
  /** Vertical gap - supports responsive values */
  gapY?: ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>
  /** Grid flow direction */
  flow?: GridFlow
  /** Align items (block axis) - supports responsive values */
  align?: ResponsiveValue<GridAlign>
  /** Justify items (inline axis) - supports responsive values */
  justify?: ResponsiveValue<GridJustify>
  /** Place items shorthand - supports responsive values */
  place?: ResponsiveValue<GridPlace>
}

/**
 * Grid layout primitive for CSS Grid layouts.
 * Supports responsive values for columns, rows, and spacing.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
 * @example
 * ```tsx
 * // Basic grid
 * <Grid cols={3} gap={4}>
 *   <Card>1</Card>
 *   <Card>2</Card>
 *   <Card>3</Card>
 * </Grid>
 * 
 * // Responsive grid
 * <Grid cols={{ base: 1, md: 2, lg: 3 }} gap={{ base: 4, lg: 6 }}>
 *   <Card>Responsive</Card>
 * </Grid>
 * 
 * // Auto-fit pattern (use className)
 * <Grid className="grid-cols-[repeat(auto-fit,minmax(300px,1fr))]" gap={4}>
 *   <Card>Auto-fit</Card>
 * </Grid>
 * ```
 */
function Grid({
  as: Component = "div",
  className,
  inline,
  cols,
  rows,
  gap,
  gapX,
  gapY,
  flow,
  align,
  justify,
  place,
  ...props
}: GridProps) {
  const responsiveClasses = cn(
    resolveResponsive(cols, colsMap),
    resolveResponsive(rows, rowsMap),
    resolveResponsive(gap, gapMap),
    resolveResponsive(gapX, gapXMap),
    resolveResponsive(gapY, gapYMap),
    flow ? flowMap[flow] : "",
    resolveResponsive(align, alignMap),
    resolveResponsive(justify, justifyMap),
    resolveResponsive(place, placeMap),
  )

  return (
    <Component
      data-slot="grid"
      className={cn(gridVariants({ inline }), responsiveClasses, className)}
      {...props}
    />
  )
}

// GridItem maps
const colSpanMap: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
  "3": "col-span-3",
  "4": "col-span-4",
  "5": "col-span-5",
  "6": "col-span-6",
  "7": "col-span-7",
  "8": "col-span-8",
  "9": "col-span-9",
  "10": "col-span-10",
  "11": "col-span-11",
  "12": "col-span-12",
  full: "col-span-full",
}

const rowSpanMap: Record<string, string> = {
  "1": "row-span-1",
  "2": "row-span-2",
  "3": "row-span-3",
  "4": "row-span-4",
  "5": "row-span-5",
  "6": "row-span-6",
  full: "row-span-full",
}

const colStartMap: Record<string, string> = {
  "1": "col-start-1",
  "2": "col-start-2",
  "3": "col-start-3",
  "4": "col-start-4",
  "5": "col-start-5",
  "6": "col-start-6",
  "7": "col-start-7",
  "8": "col-start-8",
  "9": "col-start-9",
  "10": "col-start-10",
  "11": "col-start-11",
  "12": "col-start-12",
  "13": "col-start-13",
  auto: "col-start-auto",
}

const colEndMap: Record<string, string> = {
  "1": "col-end-1",
  "2": "col-end-2",
  "3": "col-end-3",
  "4": "col-end-4",
  "5": "col-end-5",
  "6": "col-end-6",
  "7": "col-end-7",
  "8": "col-end-8",
  "9": "col-end-9",
  "10": "col-end-10",
  "11": "col-end-11",
  "12": "col-end-12",
  "13": "col-end-13",
  auto: "col-end-auto",
}

const rowStartMap: Record<string, string> = {
  "1": "row-start-1",
  "2": "row-start-2",
  "3": "row-start-3",
  "4": "row-start-4",
  "5": "row-start-5",
  "6": "row-start-6",
  "7": "row-start-7",
  auto: "row-start-auto",
}

const rowEndMap: Record<string, string> = {
  "1": "row-end-1",
  "2": "row-end-2",
  "3": "row-end-3",
  "4": "row-end-4",
  "5": "row-end-5",
  "6": "row-end-6",
  "7": "row-end-7",
  auto: "row-end-auto",
}

const selfAlignMap: Record<string, string> = {
  start: "self-start",
  end: "self-end",
  center: "self-center",
  stretch: "self-stretch",
  auto: "self-auto",
}

const justifySelfMap: Record<string, string> = {
  start: "justify-self-start",
  end: "justify-self-end",
  center: "justify-self-center",
  stretch: "justify-self-stretch",
  auto: "justify-self-auto",
}

type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full"
type RowSpan = 1 | 2 | 3 | 4 | 5 | 6 | "full"
type ColPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | "auto"
type RowPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | "auto"
type SelfAlign = "start" | "end" | "center" | "stretch" | "auto"

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column span - supports responsive values */
  colSpan?: ResponsiveValue<ColSpan>
  /** Row span - supports responsive values */
  rowSpan?: ResponsiveValue<RowSpan>
  /** Column start position */
  colStart?: ColPosition
  /** Column end position */
  colEnd?: ColPosition
  /** Row start position */
  rowStart?: RowPosition
  /** Row end position */
  rowEnd?: RowPosition
  /** Align self (block axis) */
  alignSelf?: SelfAlign
  /** Justify self (inline axis) */
  justifySelf?: SelfAlign
}

/**
 * Grid item component for controlling placement within a Grid.
 * 
 * @example
 * ```tsx
 * <Grid cols={3}>
 *   <GridItem colSpan={2}>Wide item</GridItem>
 *   <GridItem>Normal item</GridItem>
 *   <GridItem colSpan={{ base: 3, md: 1 }}>Responsive span</GridItem>
 * </Grid>
 * ```
 */
function GridItem({
  className,
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  alignSelf,
  justifySelf,
  ...props
}: GridItemProps) {
  const classes = cn(
    resolveResponsive(colSpan, colSpanMap),
    resolveResponsive(rowSpan, rowSpanMap),
    colStart ? colStartMap[String(colStart)] : "",
    colEnd ? colEndMap[String(colEnd)] : "",
    rowStart ? rowStartMap[String(rowStart)] : "",
    rowEnd ? rowEndMap[String(rowEnd)] : "",
    alignSelf ? selfAlignMap[alignSelf] : "",
    justifySelf ? justifySelfMap[justifySelf] : "",
    className,
  )

  return <div data-slot="grid-item" className={classes} {...props} />
}

export { Grid, GridItem, gridVariants }
export type {
  GridProps,
  GridItemProps,
  GridCols,
  GridRows,
  GridGap,
  GridFlow,
  GridAlign,
  GridJustify,
  ColSpan,
  RowSpan,
}
