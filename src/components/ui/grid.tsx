"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import { isNumberProp, isStringProp } from "@/lib/component-utils";
import {
  layoutGapClasses,
  resolveLayoutResponsive,
  type LayoutResponsiveValue,
  type LayoutSpacing,
} from "@/lib/layout-responsive";

/* Literal per-breakpoint class maps so consumer Tailwind scans them with zero safelist. */

const colsClasses = {
  1: [
    "grid-cols-1",
    "sm:grid-cols-1",
    "md:grid-cols-1",
    "lg:grid-cols-1",
    "xl:grid-cols-1",
    "2xl:grid-cols-1",
  ],
  2: [
    "grid-cols-2",
    "sm:grid-cols-2",
    "md:grid-cols-2",
    "lg:grid-cols-2",
    "xl:grid-cols-2",
    "2xl:grid-cols-2",
  ],
  3: [
    "grid-cols-3",
    "sm:grid-cols-3",
    "md:grid-cols-3",
    "lg:grid-cols-3",
    "xl:grid-cols-3",
    "2xl:grid-cols-3",
  ],
  4: [
    "grid-cols-4",
    "sm:grid-cols-4",
    "md:grid-cols-4",
    "lg:grid-cols-4",
    "xl:grid-cols-4",
    "2xl:grid-cols-4",
  ],
  5: [
    "grid-cols-5",
    "sm:grid-cols-5",
    "md:grid-cols-5",
    "lg:grid-cols-5",
    "xl:grid-cols-5",
    "2xl:grid-cols-5",
  ],
  6: [
    "grid-cols-6",
    "sm:grid-cols-6",
    "md:grid-cols-6",
    "lg:grid-cols-6",
    "xl:grid-cols-6",
    "2xl:grid-cols-6",
  ],
  7: [
    "grid-cols-7",
    "sm:grid-cols-7",
    "md:grid-cols-7",
    "lg:grid-cols-7",
    "xl:grid-cols-7",
    "2xl:grid-cols-7",
  ],
  8: [
    "grid-cols-8",
    "sm:grid-cols-8",
    "md:grid-cols-8",
    "lg:grid-cols-8",
    "xl:grid-cols-8",
    "2xl:grid-cols-8",
  ],
  9: [
    "grid-cols-9",
    "sm:grid-cols-9",
    "md:grid-cols-9",
    "lg:grid-cols-9",
    "xl:grid-cols-9",
    "2xl:grid-cols-9",
  ],
  10: [
    "grid-cols-10",
    "sm:grid-cols-10",
    "md:grid-cols-10",
    "lg:grid-cols-10",
    "xl:grid-cols-10",
    "2xl:grid-cols-10",
  ],
  11: [
    "grid-cols-11",
    "sm:grid-cols-11",
    "md:grid-cols-11",
    "lg:grid-cols-11",
    "xl:grid-cols-11",
    "2xl:grid-cols-11",
  ],
  12: [
    "grid-cols-12",
    "sm:grid-cols-12",
    "md:grid-cols-12",
    "lg:grid-cols-12",
    "xl:grid-cols-12",
    "2xl:grid-cols-12",
  ],
  none: [
    "grid-cols-none",
    "sm:grid-cols-none",
    "md:grid-cols-none",
    "lg:grid-cols-none",
    "xl:grid-cols-none",
    "2xl:grid-cols-none",
  ],
  subgrid: [
    "grid-cols-subgrid",
    "sm:grid-cols-subgrid",
    "md:grid-cols-subgrid",
    "lg:grid-cols-subgrid",
    "xl:grid-cols-subgrid",
    "2xl:grid-cols-subgrid",
  ],
  "auto-fit": [
    "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "sm:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "md:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "lg:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "xl:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "2xl:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
  ],
  "auto-fill": [
    "grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "sm:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "md:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "lg:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "xl:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "2xl:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
  ],
} as const;

const rowsClasses = {
  1: [
    "grid-rows-1",
    "sm:grid-rows-1",
    "md:grid-rows-1",
    "lg:grid-rows-1",
    "xl:grid-rows-1",
    "2xl:grid-rows-1",
  ],
  2: [
    "grid-rows-2",
    "sm:grid-rows-2",
    "md:grid-rows-2",
    "lg:grid-rows-2",
    "xl:grid-rows-2",
    "2xl:grid-rows-2",
  ],
  3: [
    "grid-rows-3",
    "sm:grid-rows-3",
    "md:grid-rows-3",
    "lg:grid-rows-3",
    "xl:grid-rows-3",
    "2xl:grid-rows-3",
  ],
  4: [
    "grid-rows-4",
    "sm:grid-rows-4",
    "md:grid-rows-4",
    "lg:grid-rows-4",
    "xl:grid-rows-4",
    "2xl:grid-rows-4",
  ],
  5: [
    "grid-rows-5",
    "sm:grid-rows-5",
    "md:grid-rows-5",
    "lg:grid-rows-5",
    "xl:grid-rows-5",
    "2xl:grid-rows-5",
  ],
  6: [
    "grid-rows-6",
    "sm:grid-rows-6",
    "md:grid-rows-6",
    "lg:grid-rows-6",
    "xl:grid-rows-6",
    "2xl:grid-rows-6",
  ],
  none: [
    "grid-rows-none",
    "sm:grid-rows-none",
    "md:grid-rows-none",
    "lg:grid-rows-none",
    "xl:grid-rows-none",
    "2xl:grid-rows-none",
  ],
  subgrid: [
    "grid-rows-subgrid",
    "sm:grid-rows-subgrid",
    "md:grid-rows-subgrid",
    "lg:grid-rows-subgrid",
    "xl:grid-rows-subgrid",
    "2xl:grid-rows-subgrid",
  ],
} as const;

const gapXClasses = {
  0: [
    "gap-x-0",
    "sm:gap-x-0",
    "md:gap-x-0",
    "lg:gap-x-0",
    "xl:gap-x-0",
    "2xl:gap-x-0",
  ],
  1: [
    "gap-x-1",
    "sm:gap-x-1",
    "md:gap-x-1",
    "lg:gap-x-1",
    "xl:gap-x-1",
    "2xl:gap-x-1",
  ],
  2: [
    "gap-x-2",
    "sm:gap-x-2",
    "md:gap-x-2",
    "lg:gap-x-2",
    "xl:gap-x-2",
    "2xl:gap-x-2",
  ],
  3: [
    "gap-x-3",
    "sm:gap-x-3",
    "md:gap-x-3",
    "lg:gap-x-3",
    "xl:gap-x-3",
    "2xl:gap-x-3",
  ],
  4: [
    "gap-x-4",
    "sm:gap-x-4",
    "md:gap-x-4",
    "lg:gap-x-4",
    "xl:gap-x-4",
    "2xl:gap-x-4",
  ],
  5: [
    "gap-x-5",
    "sm:gap-x-5",
    "md:gap-x-5",
    "lg:gap-x-5",
    "xl:gap-x-5",
    "2xl:gap-x-5",
  ],
  6: [
    "gap-x-6",
    "sm:gap-x-6",
    "md:gap-x-6",
    "lg:gap-x-6",
    "xl:gap-x-6",
    "2xl:gap-x-6",
  ],
  8: [
    "gap-x-8",
    "sm:gap-x-8",
    "md:gap-x-8",
    "lg:gap-x-8",
    "xl:gap-x-8",
    "2xl:gap-x-8",
  ],
  10: [
    "gap-x-10",
    "sm:gap-x-10",
    "md:gap-x-10",
    "lg:gap-x-10",
    "xl:gap-x-10",
    "2xl:gap-x-10",
  ],
  12: [
    "gap-x-12",
    "sm:gap-x-12",
    "md:gap-x-12",
    "lg:gap-x-12",
    "xl:gap-x-12",
    "2xl:gap-x-12",
  ],
} as const;

const gapYClasses = {
  0: [
    "gap-y-0",
    "sm:gap-y-0",
    "md:gap-y-0",
    "lg:gap-y-0",
    "xl:gap-y-0",
    "2xl:gap-y-0",
  ],
  1: [
    "gap-y-1",
    "sm:gap-y-1",
    "md:gap-y-1",
    "lg:gap-y-1",
    "xl:gap-y-1",
    "2xl:gap-y-1",
  ],
  2: [
    "gap-y-2",
    "sm:gap-y-2",
    "md:gap-y-2",
    "lg:gap-y-2",
    "xl:gap-y-2",
    "2xl:gap-y-2",
  ],
  3: [
    "gap-y-3",
    "sm:gap-y-3",
    "md:gap-y-3",
    "lg:gap-y-3",
    "xl:gap-y-3",
    "2xl:gap-y-3",
  ],
  4: [
    "gap-y-4",
    "sm:gap-y-4",
    "md:gap-y-4",
    "lg:gap-y-4",
    "xl:gap-y-4",
    "2xl:gap-y-4",
  ],
  5: [
    "gap-y-5",
    "sm:gap-y-5",
    "md:gap-y-5",
    "lg:gap-y-5",
    "xl:gap-y-5",
    "2xl:gap-y-5",
  ],
  6: [
    "gap-y-6",
    "sm:gap-y-6",
    "md:gap-y-6",
    "lg:gap-y-6",
    "xl:gap-y-6",
    "2xl:gap-y-6",
  ],
  8: [
    "gap-y-8",
    "sm:gap-y-8",
    "md:gap-y-8",
    "lg:gap-y-8",
    "xl:gap-y-8",
    "2xl:gap-y-8",
  ],
  10: [
    "gap-y-10",
    "sm:gap-y-10",
    "md:gap-y-10",
    "lg:gap-y-10",
    "xl:gap-y-10",
    "2xl:gap-y-10",
  ],
  12: [
    "gap-y-12",
    "sm:gap-y-12",
    "md:gap-y-12",
    "lg:gap-y-12",
    "xl:gap-y-12",
    "2xl:gap-y-12",
  ],
} as const;

const flowMap = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "column-dense": "grid-flow-col-dense",
} as const;

const alignClasses = {
  start: [
    "items-start",
    "sm:items-start",
    "md:items-start",
    "lg:items-start",
    "xl:items-start",
    "2xl:items-start",
  ],
  end: [
    "items-end",
    "sm:items-end",
    "md:items-end",
    "lg:items-end",
    "xl:items-end",
    "2xl:items-end",
  ],
  center: [
    "items-center",
    "sm:items-center",
    "md:items-center",
    "lg:items-center",
    "xl:items-center",
    "2xl:items-center",
  ],
  stretch: [
    "items-stretch",
    "sm:items-stretch",
    "md:items-stretch",
    "lg:items-stretch",
    "xl:items-stretch",
    "2xl:items-stretch",
  ],
  baseline: [
    "items-baseline",
    "sm:items-baseline",
    "md:items-baseline",
    "lg:items-baseline",
    "xl:items-baseline",
    "2xl:items-baseline",
  ],
} as const;

const justifyClasses = {
  start: [
    "justify-items-start",
    "sm:justify-items-start",
    "md:justify-items-start",
    "lg:justify-items-start",
    "xl:justify-items-start",
    "2xl:justify-items-start",
  ],
  end: [
    "justify-items-end",
    "sm:justify-items-end",
    "md:justify-items-end",
    "lg:justify-items-end",
    "xl:justify-items-end",
    "2xl:justify-items-end",
  ],
  center: [
    "justify-items-center",
    "sm:justify-items-center",
    "md:justify-items-center",
    "lg:justify-items-center",
    "xl:justify-items-center",
    "2xl:justify-items-center",
  ],
  stretch: [
    "justify-items-stretch",
    "sm:justify-items-stretch",
    "md:justify-items-stretch",
    "lg:justify-items-stretch",
    "xl:justify-items-stretch",
    "2xl:justify-items-stretch",
  ],
} as const;

const placeClasses = {
  start: [
    "place-items-start",
    "sm:place-items-start",
    "md:place-items-start",
    "lg:place-items-start",
    "xl:place-items-start",
    "2xl:place-items-start",
  ],
  end: [
    "place-items-end",
    "sm:place-items-end",
    "md:place-items-end",
    "lg:place-items-end",
    "xl:place-items-end",
    "2xl:place-items-end",
  ],
  center: [
    "place-items-center",
    "sm:place-items-center",
    "md:place-items-center",
    "lg:place-items-center",
    "xl:place-items-center",
    "2xl:place-items-center",
  ],
  stretch: [
    "place-items-stretch",
    "sm:place-items-stretch",
    "md:place-items-stretch",
    "lg:place-items-stretch",
    "xl:place-items-stretch",
    "2xl:place-items-stretch",
  ],
} as const;

const gridVariants = cva("min-w-0 [&>*]:min-w-0", {
  variants: {
    inline: {
      true: "inline-grid",
      false: "grid",
    },
  },
  defaultVariants: {
    inline: false,
  },
});

type GridCols = keyof typeof colsClasses;

type GridRows = keyof typeof rowsClasses;

type GridGap = LayoutSpacing;

type GridFlow = keyof typeof flowMap;

type GridAlign = keyof typeof alignClasses;

type GridJustify = keyof typeof justifyClasses;

type GridPlace = keyof typeof placeClasses;

type GridElement =
  "div" | "section" | "main" | "article" | "aside" | "ul" | "ol" | "form";

interface GridOwnProps extends VariantProps<typeof gridVariants> {
  cols?: LayoutResponsiveValue<GridCols>;
  /** CSS length or positive pixel count for auto-fit/auto-fill columns. */
  minItemWidth?: string | number;
  rows?: LayoutResponsiveValue<GridRows>;
  gap?: LayoutResponsiveValue<GridGap>;
  gapX?: LayoutResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>;
  gapY?: LayoutResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>;
  flow?: GridFlow;
  align?: LayoutResponsiveValue<GridAlign>;
  justify?: LayoutResponsiveValue<GridJustify>;
  place?: LayoutResponsiveValue<GridPlace>;
}

type GridProps<T extends GridElement = "div"> = GridOwnProps & {
  as?: T;
  render?: useRender.RenderProp;
} & Omit<React.ComponentPropsWithRef<T>, keyof GridOwnProps | "as" | "render">;

function Grid<T extends GridElement = "div">({
  as,
  render,
  ref,
  className,
  inline,
  cols,
  minItemWidth,
  style,
  rows,
  gap,
  gapX,
  gapY,
  flow,
  align,
  justify,
  place,
  ...props
}: GridProps<T>) {
  const responsiveClasses = cn(
    resolveLayoutResponsive(cols, colsClasses),
    resolveLayoutResponsive(rows, rowsClasses),
    resolveLayoutResponsive(gap, layoutGapClasses),
    resolveLayoutResponsive(gapX, gapXClasses),
    resolveLayoutResponsive(gapY, gapYClasses),
    flow ? flowMap[flow] : "",
    resolveLayoutResponsive(align, alignClasses),
    resolveLayoutResponsive(justify, justifyClasses),
    resolveLayoutResponsive(place, placeClasses),
  );

  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: the ref's element type follows the selected native tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a native data attribute absent from HTMLAttributes.
      {
        "data-slot": "grid",
        className: cn(gridVariants({ inline }), responsiveClasses, className),
      } as React.HTMLAttributes<HTMLElement>,
      {
        // SAFETY: this is a component-owned CSS custom property. Numeric lengths use px.
        style: {
          "--kira-grid-min-item-width": gridMinItemWidth(minItemWidth),
          ...style,
        } as React.CSSProperties,
      },
      props,
    ),
  });
}

const colSpanClasses = {
  1: [
    "col-span-1",
    "sm:col-span-1",
    "md:col-span-1",
    "lg:col-span-1",
    "xl:col-span-1",
    "2xl:col-span-1",
  ],
  2: [
    "col-span-2",
    "sm:col-span-2",
    "md:col-span-2",
    "lg:col-span-2",
    "xl:col-span-2",
    "2xl:col-span-2",
  ],
  3: [
    "col-span-3",
    "sm:col-span-3",
    "md:col-span-3",
    "lg:col-span-3",
    "xl:col-span-3",
    "2xl:col-span-3",
  ],
  4: [
    "col-span-4",
    "sm:col-span-4",
    "md:col-span-4",
    "lg:col-span-4",
    "xl:col-span-4",
    "2xl:col-span-4",
  ],
  5: [
    "col-span-5",
    "sm:col-span-5",
    "md:col-span-5",
    "lg:col-span-5",
    "xl:col-span-5",
    "2xl:col-span-5",
  ],
  6: [
    "col-span-6",
    "sm:col-span-6",
    "md:col-span-6",
    "lg:col-span-6",
    "xl:col-span-6",
    "2xl:col-span-6",
  ],
  7: [
    "col-span-7",
    "sm:col-span-7",
    "md:col-span-7",
    "lg:col-span-7",
    "xl:col-span-7",
    "2xl:col-span-7",
  ],
  8: [
    "col-span-8",
    "sm:col-span-8",
    "md:col-span-8",
    "lg:col-span-8",
    "xl:col-span-8",
    "2xl:col-span-8",
  ],
  9: [
    "col-span-9",
    "sm:col-span-9",
    "md:col-span-9",
    "lg:col-span-9",
    "xl:col-span-9",
    "2xl:col-span-9",
  ],
  10: [
    "col-span-10",
    "sm:col-span-10",
    "md:col-span-10",
    "lg:col-span-10",
    "xl:col-span-10",
    "2xl:col-span-10",
  ],
  11: [
    "col-span-11",
    "sm:col-span-11",
    "md:col-span-11",
    "lg:col-span-11",
    "xl:col-span-11",
    "2xl:col-span-11",
  ],
  12: [
    "col-span-12",
    "sm:col-span-12",
    "md:col-span-12",
    "lg:col-span-12",
    "xl:col-span-12",
    "2xl:col-span-12",
  ],
  full: [
    "col-span-full",
    "sm:col-span-full",
    "md:col-span-full",
    "lg:col-span-full",
    "xl:col-span-full",
    "2xl:col-span-full",
  ],
} as const;

const rowSpanClasses = {
  1: [
    "row-span-1",
    "sm:row-span-1",
    "md:row-span-1",
    "lg:row-span-1",
    "xl:row-span-1",
    "2xl:row-span-1",
  ],
  2: [
    "row-span-2",
    "sm:row-span-2",
    "md:row-span-2",
    "lg:row-span-2",
    "xl:row-span-2",
    "2xl:row-span-2",
  ],
  3: [
    "row-span-3",
    "sm:row-span-3",
    "md:row-span-3",
    "lg:row-span-3",
    "xl:row-span-3",
    "2xl:row-span-3",
  ],
  4: [
    "row-span-4",
    "sm:row-span-4",
    "md:row-span-4",
    "lg:row-span-4",
    "xl:row-span-4",
    "2xl:row-span-4",
  ],
  5: [
    "row-span-5",
    "sm:row-span-5",
    "md:row-span-5",
    "lg:row-span-5",
    "xl:row-span-5",
    "2xl:row-span-5",
  ],
  6: [
    "row-span-6",
    "sm:row-span-6",
    "md:row-span-6",
    "lg:row-span-6",
    "xl:row-span-6",
    "2xl:row-span-6",
  ],
  full: [
    "row-span-full",
    "sm:row-span-full",
    "md:row-span-full",
    "lg:row-span-full",
    "xl:row-span-full",
    "2xl:row-span-full",
  ],
} as const;

const colStartClasses = {
  1: [
    "col-start-1",
    "sm:col-start-1",
    "md:col-start-1",
    "lg:col-start-1",
    "xl:col-start-1",
    "2xl:col-start-1",
  ],
  2: [
    "col-start-2",
    "sm:col-start-2",
    "md:col-start-2",
    "lg:col-start-2",
    "xl:col-start-2",
    "2xl:col-start-2",
  ],
  3: [
    "col-start-3",
    "sm:col-start-3",
    "md:col-start-3",
    "lg:col-start-3",
    "xl:col-start-3",
    "2xl:col-start-3",
  ],
  4: [
    "col-start-4",
    "sm:col-start-4",
    "md:col-start-4",
    "lg:col-start-4",
    "xl:col-start-4",
    "2xl:col-start-4",
  ],
  5: [
    "col-start-5",
    "sm:col-start-5",
    "md:col-start-5",
    "lg:col-start-5",
    "xl:col-start-5",
    "2xl:col-start-5",
  ],
  6: [
    "col-start-6",
    "sm:col-start-6",
    "md:col-start-6",
    "lg:col-start-6",
    "xl:col-start-6",
    "2xl:col-start-6",
  ],
  7: [
    "col-start-7",
    "sm:col-start-7",
    "md:col-start-7",
    "lg:col-start-7",
    "xl:col-start-7",
    "2xl:col-start-7",
  ],
  8: [
    "col-start-8",
    "sm:col-start-8",
    "md:col-start-8",
    "lg:col-start-8",
    "xl:col-start-8",
    "2xl:col-start-8",
  ],
  9: [
    "col-start-9",
    "sm:col-start-9",
    "md:col-start-9",
    "lg:col-start-9",
    "xl:col-start-9",
    "2xl:col-start-9",
  ],
  10: [
    "col-start-10",
    "sm:col-start-10",
    "md:col-start-10",
    "lg:col-start-10",
    "xl:col-start-10",
    "2xl:col-start-10",
  ],
  11: [
    "col-start-11",
    "sm:col-start-11",
    "md:col-start-11",
    "lg:col-start-11",
    "xl:col-start-11",
    "2xl:col-start-11",
  ],
  12: [
    "col-start-12",
    "sm:col-start-12",
    "md:col-start-12",
    "lg:col-start-12",
    "xl:col-start-12",
    "2xl:col-start-12",
  ],
  13: [
    "col-start-13",
    "sm:col-start-13",
    "md:col-start-13",
    "lg:col-start-13",
    "xl:col-start-13",
    "2xl:col-start-13",
  ],
  auto: [
    "col-start-auto",
    "sm:col-start-auto",
    "md:col-start-auto",
    "lg:col-start-auto",
    "xl:col-start-auto",
    "2xl:col-start-auto",
  ],
} as const;

const colEndClasses = {
  1: [
    "col-end-1",
    "sm:col-end-1",
    "md:col-end-1",
    "lg:col-end-1",
    "xl:col-end-1",
    "2xl:col-end-1",
  ],
  2: [
    "col-end-2",
    "sm:col-end-2",
    "md:col-end-2",
    "lg:col-end-2",
    "xl:col-end-2",
    "2xl:col-end-2",
  ],
  3: [
    "col-end-3",
    "sm:col-end-3",
    "md:col-end-3",
    "lg:col-end-3",
    "xl:col-end-3",
    "2xl:col-end-3",
  ],
  4: [
    "col-end-4",
    "sm:col-end-4",
    "md:col-end-4",
    "lg:col-end-4",
    "xl:col-end-4",
    "2xl:col-end-4",
  ],
  5: [
    "col-end-5",
    "sm:col-end-5",
    "md:col-end-5",
    "lg:col-end-5",
    "xl:col-end-5",
    "2xl:col-end-5",
  ],
  6: [
    "col-end-6",
    "sm:col-end-6",
    "md:col-end-6",
    "lg:col-end-6",
    "xl:col-end-6",
    "2xl:col-end-6",
  ],
  7: [
    "col-end-7",
    "sm:col-end-7",
    "md:col-end-7",
    "lg:col-end-7",
    "xl:col-end-7",
    "2xl:col-end-7",
  ],
  8: [
    "col-end-8",
    "sm:col-end-8",
    "md:col-end-8",
    "lg:col-end-8",
    "xl:col-end-8",
    "2xl:col-end-8",
  ],
  9: [
    "col-end-9",
    "sm:col-end-9",
    "md:col-end-9",
    "lg:col-end-9",
    "xl:col-end-9",
    "2xl:col-end-9",
  ],
  10: [
    "col-end-10",
    "sm:col-end-10",
    "md:col-end-10",
    "lg:col-end-10",
    "xl:col-end-10",
    "2xl:col-end-10",
  ],
  11: [
    "col-end-11",
    "sm:col-end-11",
    "md:col-end-11",
    "lg:col-end-11",
    "xl:col-end-11",
    "2xl:col-end-11",
  ],
  12: [
    "col-end-12",
    "sm:col-end-12",
    "md:col-end-12",
    "lg:col-end-12",
    "xl:col-end-12",
    "2xl:col-end-12",
  ],
  13: [
    "col-end-13",
    "sm:col-end-13",
    "md:col-end-13",
    "lg:col-end-13",
    "xl:col-end-13",
    "2xl:col-end-13",
  ],
  auto: [
    "col-end-auto",
    "sm:col-end-auto",
    "md:col-end-auto",
    "lg:col-end-auto",
    "xl:col-end-auto",
    "2xl:col-end-auto",
  ],
} as const;

const rowStartClasses = {
  1: [
    "row-start-1",
    "sm:row-start-1",
    "md:row-start-1",
    "lg:row-start-1",
    "xl:row-start-1",
    "2xl:row-start-1",
  ],
  2: [
    "row-start-2",
    "sm:row-start-2",
    "md:row-start-2",
    "lg:row-start-2",
    "xl:row-start-2",
    "2xl:row-start-2",
  ],
  3: [
    "row-start-3",
    "sm:row-start-3",
    "md:row-start-3",
    "lg:row-start-3",
    "xl:row-start-3",
    "2xl:row-start-3",
  ],
  4: [
    "row-start-4",
    "sm:row-start-4",
    "md:row-start-4",
    "lg:row-start-4",
    "xl:row-start-4",
    "2xl:row-start-4",
  ],
  5: [
    "row-start-5",
    "sm:row-start-5",
    "md:row-start-5",
    "lg:row-start-5",
    "xl:row-start-5",
    "2xl:row-start-5",
  ],
  6: [
    "row-start-6",
    "sm:row-start-6",
    "md:row-start-6",
    "lg:row-start-6",
    "xl:row-start-6",
    "2xl:row-start-6",
  ],
  7: [
    "row-start-7",
    "sm:row-start-7",
    "md:row-start-7",
    "lg:row-start-7",
    "xl:row-start-7",
    "2xl:row-start-7",
  ],
  auto: [
    "row-start-auto",
    "sm:row-start-auto",
    "md:row-start-auto",
    "lg:row-start-auto",
    "xl:row-start-auto",
    "2xl:row-start-auto",
  ],
} as const;

const rowEndClasses = {
  1: [
    "row-end-1",
    "sm:row-end-1",
    "md:row-end-1",
    "lg:row-end-1",
    "xl:row-end-1",
    "2xl:row-end-1",
  ],
  2: [
    "row-end-2",
    "sm:row-end-2",
    "md:row-end-2",
    "lg:row-end-2",
    "xl:row-end-2",
    "2xl:row-end-2",
  ],
  3: [
    "row-end-3",
    "sm:row-end-3",
    "md:row-end-3",
    "lg:row-end-3",
    "xl:row-end-3",
    "2xl:row-end-3",
  ],
  4: [
    "row-end-4",
    "sm:row-end-4",
    "md:row-end-4",
    "lg:row-end-4",
    "xl:row-end-4",
    "2xl:row-end-4",
  ],
  5: [
    "row-end-5",
    "sm:row-end-5",
    "md:row-end-5",
    "lg:row-end-5",
    "xl:row-end-5",
    "2xl:row-end-5",
  ],
  6: [
    "row-end-6",
    "sm:row-end-6",
    "md:row-end-6",
    "lg:row-end-6",
    "xl:row-end-6",
    "2xl:row-end-6",
  ],
  7: [
    "row-end-7",
    "sm:row-end-7",
    "md:row-end-7",
    "lg:row-end-7",
    "xl:row-end-7",
    "2xl:row-end-7",
  ],
  auto: [
    "row-end-auto",
    "sm:row-end-auto",
    "md:row-end-auto",
    "lg:row-end-auto",
    "xl:row-end-auto",
    "2xl:row-end-auto",
  ],
} as const;

const selfAlignClasses = {
  start: [
    "self-start",
    "sm:self-start",
    "md:self-start",
    "lg:self-start",
    "xl:self-start",
    "2xl:self-start",
  ],
  end: [
    "self-end",
    "sm:self-end",
    "md:self-end",
    "lg:self-end",
    "xl:self-end",
    "2xl:self-end",
  ],
  center: [
    "self-center",
    "sm:self-center",
    "md:self-center",
    "lg:self-center",
    "xl:self-center",
    "2xl:self-center",
  ],
  stretch: [
    "self-stretch",
    "sm:self-stretch",
    "md:self-stretch",
    "lg:self-stretch",
    "xl:self-stretch",
    "2xl:self-stretch",
  ],
  auto: [
    "self-auto",
    "sm:self-auto",
    "md:self-auto",
    "lg:self-auto",
    "xl:self-auto",
    "2xl:self-auto",
  ],
} as const;

const justifySelfClasses = {
  start: [
    "justify-self-start",
    "sm:justify-self-start",
    "md:justify-self-start",
    "lg:justify-self-start",
    "xl:justify-self-start",
    "2xl:justify-self-start",
  ],
  end: [
    "justify-self-end",
    "sm:justify-self-end",
    "md:justify-self-end",
    "lg:justify-self-end",
    "xl:justify-self-end",
    "2xl:justify-self-end",
  ],
  center: [
    "justify-self-center",
    "sm:justify-self-center",
    "md:justify-self-center",
    "lg:justify-self-center",
    "xl:justify-self-center",
    "2xl:justify-self-center",
  ],
  stretch: [
    "justify-self-stretch",
    "sm:justify-self-stretch",
    "md:justify-self-stretch",
    "lg:justify-self-stretch",
    "xl:justify-self-stretch",
    "2xl:justify-self-stretch",
  ],
  auto: [
    "justify-self-auto",
    "sm:justify-self-auto",
    "md:justify-self-auto",
    "lg:justify-self-auto",
    "xl:justify-self-auto",
    "2xl:justify-self-auto",
  ],
} as const;

type ColSpan = keyof typeof colSpanClasses;

type RowSpan = keyof typeof rowSpanClasses;

type ColPosition = keyof typeof colStartClasses;

type RowPosition = keyof typeof rowStartClasses;

type SelfAlign = keyof typeof selfAlignClasses;

const gridItemVariants = cva("min-w-0 wrap-break-word");

type GridItemElement = GridElement | "li";

interface GridItemOwnProps {
  colSpan?: LayoutResponsiveValue<ColSpan>;
  rowSpan?: LayoutResponsiveValue<RowSpan>;
  colStart?: LayoutResponsiveValue<ColPosition>;
  colEnd?: LayoutResponsiveValue<ColPosition>;
  rowStart?: LayoutResponsiveValue<RowPosition>;
  rowEnd?: LayoutResponsiveValue<RowPosition>;
  alignSelf?: LayoutResponsiveValue<SelfAlign>;
  justifySelf?: LayoutResponsiveValue<SelfAlign>;
}

type GridItemProps<T extends GridItemElement = "div"> = GridItemOwnProps & {
  as?: T;
  render?: useRender.RenderProp;
} & Omit<
    React.ComponentPropsWithRef<T>,
    keyof GridItemOwnProps | "as" | "render"
  >;

function GridItem<T extends GridItemElement = "div">({
  as,
  render,
  ref,
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
}: GridItemProps<T>) {
  const classes = cn(
    gridItemVariants(),
    resolveLayoutResponsive(colSpan, colSpanClasses),
    resolveLayoutResponsive(rowSpan, rowSpanClasses),
    resolveLayoutResponsive(colStart, colStartClasses),
    resolveLayoutResponsive(colEnd, colEndClasses),
    resolveLayoutResponsive(rowStart, rowStartClasses),
    resolveLayoutResponsive(rowEnd, rowEndClasses),
    resolveLayoutResponsive(alignSelf, selfAlignClasses),
    resolveLayoutResponsive(justifySelf, justifySelfClasses),
    className,
  );

  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: the ref's element type follows the selected native tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a native data attribute absent from HTMLAttributes.
      {
        "data-slot": "grid-item",
        className: classes,
      } as React.HTMLAttributes<HTMLElement>,
      props,
    ),
  });
}

type KiraGridProps<Item, T extends GridElement = "div"> = Omit<
  GridProps<T>,
  "children"
> & {
  items: readonly Item[];
  getKey: (item: Item) => React.Key;
  renderItem: (item: Item, index: number) => React.ReactNode;
  emptyContent?: React.ReactNode;
};

function KiraGrid<Item, T extends GridElement = "div">({
  items,
  getKey,
  renderItem,
  emptyContent = "No items yet.",
  cols = "auto-fit",
  gap = 4,
  ...props
}: KiraGridProps<Item, T>) {
  // SAFETY: collection props were removed; the remainder belongs to Grid.
  const gridProps = props as GridProps<T>;

  const itemTag = gridCollectionTag(props);

  return (
    <>
      <output data-slot="grid-status" className="sr-only">
        {`${items.length} ${items.length === 1 ? "item" : "items"}.`}
      </output>
      <Grid<T> {...gridProps} cols={cols} gap={gap} data-slot="kira-grid">
        {items.length ? (
          items.map((item, index) => (
            <GridItem as={itemTag} key={getKey(item)}>
              {renderItem(item, index)}
            </GridItem>
          ))
        ) : (
          <GridItem
            as={itemTag}
            colSpan="full"
            data-slot="grid-empty"
            className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
          >
            {emptyContent}
          </GridItem>
        )}
      </Grid>
    </>
  );
}

export { Grid, GridItem, KiraGrid, gridVariants, gridItemVariants };

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
  GridElement,
  GridItemElement,
  GridPlace,
  ColPosition,
  RowPosition,
  SelfAlign,
  KiraGridProps,
};

function gridMinItemWidth(minItemWidth: string | number | undefined) {
  if (isNumberProp(minItemWidth)) {
    if (Number.isFinite(minItemWidth) && minItemWidth > 0) {
      return `${minItemWidth}px`;
    }

    return undefined;
  }

  return minItemWidth;
}

function gridCollectionTag<T extends GridElement>(
  props: GridProps<T>,
): "li" | "div" {
  const renderedTag =
    React.isValidElement(props.render) && isStringProp(props.render.type)
      ? props.render.type
      : props.as;

  return renderedTag === "ul" || renderedTag === "ol" ? "li" : "div";
}
