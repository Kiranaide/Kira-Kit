"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  isNumberProp,
  isObjectProp,
  isStringProp,
} from "@/lib/component-utils";

// Literal candidates travel with the registry component so responsive props also
// work in consuming apps without a separate application stylesheet safelist.
const gridResponsiveCandidates = new Set(
  [
    "sm:grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 sm:grid-cols-5 sm:grid-cols-6 sm:grid-cols-7 sm:grid-cols-8",
    "sm:grid-cols-9 sm:grid-cols-10 sm:grid-cols-11 sm:grid-cols-12 sm:grid-cols-none sm:grid-cols-subgrid sm:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))] sm:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "sm:grid-rows-1 sm:grid-rows-2 sm:grid-rows-3 sm:grid-rows-4 sm:grid-rows-5 sm:grid-rows-6 sm:grid-rows-none sm:grid-rows-subgrid",
    "sm:gap-0 sm:gap-1 sm:gap-2 sm:gap-3 sm:gap-4 sm:gap-5 sm:gap-6 sm:gap-8",
    "sm:gap-10 sm:gap-12 sm:gap-16 sm:gap-20 sm:gap-24 sm:gap-x-0 sm:gap-x-1 sm:gap-x-2",
    "sm:gap-x-3 sm:gap-x-4 sm:gap-x-5 sm:gap-x-6 sm:gap-x-8 sm:gap-x-10 sm:gap-x-12 sm:gap-y-0",
    "sm:gap-y-1 sm:gap-y-2 sm:gap-y-3 sm:gap-y-4 sm:gap-y-5 sm:gap-y-6 sm:gap-y-8 sm:gap-y-10",
    "sm:gap-y-12 sm:grid-flow-row sm:grid-flow-col sm:grid-flow-dense sm:grid-flow-row-dense sm:grid-flow-col-dense sm:items-start sm:items-end",
    "sm:items-center sm:items-stretch sm:items-baseline sm:justify-items-start sm:justify-items-end sm:justify-items-center sm:justify-items-stretch sm:place-items-start",
    "sm:place-items-end sm:place-items-center sm:place-items-stretch sm:col-span-1 sm:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5",
    "sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12 sm:col-span-full",
    "sm:row-span-1 sm:row-span-2 sm:row-span-3 sm:row-span-4 sm:row-span-5 sm:row-span-6 sm:row-span-full sm:col-start-1",
    "sm:col-start-2 sm:col-start-3 sm:col-start-4 sm:col-start-5 sm:col-start-6 sm:col-start-7 sm:col-start-8 sm:col-start-9",
    "sm:col-start-10 sm:col-start-11 sm:col-start-12 sm:col-start-13 sm:col-start-auto sm:col-end-1 sm:col-end-2 sm:col-end-3",
    "sm:col-end-4 sm:col-end-5 sm:col-end-6 sm:col-end-7 sm:col-end-8 sm:col-end-9 sm:col-end-10 sm:col-end-11",
    "sm:col-end-12 sm:col-end-13 sm:col-end-auto sm:row-start-1 sm:row-start-2 sm:row-start-3 sm:row-start-4 sm:row-start-5",
    "sm:row-start-6 sm:row-start-7 sm:row-start-auto sm:row-end-1 sm:row-end-2 sm:row-end-3 sm:row-end-4 sm:row-end-5",
    "sm:row-end-6 sm:row-end-7 sm:row-end-auto sm:self-start sm:self-end sm:self-center sm:self-stretch sm:self-auto",
    "sm:justify-self-start sm:justify-self-end sm:justify-self-center sm:justify-self-stretch sm:justify-self-auto",
    "md:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-4 md:grid-cols-5 md:grid-cols-6 md:grid-cols-7 md:grid-cols-8",
    "md:grid-cols-9 md:grid-cols-10 md:grid-cols-11 md:grid-cols-12 md:grid-cols-none md:grid-cols-subgrid md:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))] md:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "md:grid-rows-1 md:grid-rows-2 md:grid-rows-3 md:grid-rows-4 md:grid-rows-5 md:grid-rows-6 md:grid-rows-none md:grid-rows-subgrid",
    "md:gap-0 md:gap-1 md:gap-2 md:gap-3 md:gap-4 md:gap-5 md:gap-6 md:gap-8",
    "md:gap-10 md:gap-12 md:gap-16 md:gap-20 md:gap-24 md:gap-x-0 md:gap-x-1 md:gap-x-2",
    "md:gap-x-3 md:gap-x-4 md:gap-x-5 md:gap-x-6 md:gap-x-8 md:gap-x-10 md:gap-x-12 md:gap-y-0",
    "md:gap-y-1 md:gap-y-2 md:gap-y-3 md:gap-y-4 md:gap-y-5 md:gap-y-6 md:gap-y-8 md:gap-y-10",
    "md:gap-y-12 md:grid-flow-row md:grid-flow-col md:grid-flow-dense md:grid-flow-row-dense md:grid-flow-col-dense md:items-start md:items-end",
    "md:items-center md:items-stretch md:items-baseline md:justify-items-start md:justify-items-end md:justify-items-center md:justify-items-stretch md:place-items-start",
    "md:place-items-end md:place-items-center md:place-items-stretch md:col-span-1 md:col-span-2 md:col-span-3 md:col-span-4 md:col-span-5",
    "md:col-span-6 md:col-span-7 md:col-span-8 md:col-span-9 md:col-span-10 md:col-span-11 md:col-span-12 md:col-span-full",
    "md:row-span-1 md:row-span-2 md:row-span-3 md:row-span-4 md:row-span-5 md:row-span-6 md:row-span-full md:col-start-1",
    "md:col-start-2 md:col-start-3 md:col-start-4 md:col-start-5 md:col-start-6 md:col-start-7 md:col-start-8 md:col-start-9",
    "md:col-start-10 md:col-start-11 md:col-start-12 md:col-start-13 md:col-start-auto md:col-end-1 md:col-end-2 md:col-end-3",
    "md:col-end-4 md:col-end-5 md:col-end-6 md:col-end-7 md:col-end-8 md:col-end-9 md:col-end-10 md:col-end-11",
    "md:col-end-12 md:col-end-13 md:col-end-auto md:row-start-1 md:row-start-2 md:row-start-3 md:row-start-4 md:row-start-5",
    "md:row-start-6 md:row-start-7 md:row-start-auto md:row-end-1 md:row-end-2 md:row-end-3 md:row-end-4 md:row-end-5",
    "md:row-end-6 md:row-end-7 md:row-end-auto md:self-start md:self-end md:self-center md:self-stretch md:self-auto",
    "md:justify-self-start md:justify-self-end md:justify-self-center md:justify-self-stretch md:justify-self-auto",
    "lg:grid-cols-1 lg:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 lg:grid-cols-6 lg:grid-cols-7 lg:grid-cols-8",
    "lg:grid-cols-9 lg:grid-cols-10 lg:grid-cols-11 lg:grid-cols-12 lg:grid-cols-none lg:grid-cols-subgrid lg:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))] lg:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "lg:grid-rows-1 lg:grid-rows-2 lg:grid-rows-3 lg:grid-rows-4 lg:grid-rows-5 lg:grid-rows-6 lg:grid-rows-none lg:grid-rows-subgrid",
    "lg:gap-0 lg:gap-1 lg:gap-2 lg:gap-3 lg:gap-4 lg:gap-5 lg:gap-6 lg:gap-8",
    "lg:gap-10 lg:gap-12 lg:gap-16 lg:gap-20 lg:gap-24 lg:gap-x-0 lg:gap-x-1 lg:gap-x-2",
    "lg:gap-x-3 lg:gap-x-4 lg:gap-x-5 lg:gap-x-6 lg:gap-x-8 lg:gap-x-10 lg:gap-x-12 lg:gap-y-0",
    "lg:gap-y-1 lg:gap-y-2 lg:gap-y-3 lg:gap-y-4 lg:gap-y-5 lg:gap-y-6 lg:gap-y-8 lg:gap-y-10",
    "lg:gap-y-12 lg:grid-flow-row lg:grid-flow-col lg:grid-flow-dense lg:grid-flow-row-dense lg:grid-flow-col-dense lg:items-start lg:items-end",
    "lg:items-center lg:items-stretch lg:items-baseline lg:justify-items-start lg:justify-items-end lg:justify-items-center lg:justify-items-stretch lg:place-items-start",
    "lg:place-items-end lg:place-items-center lg:place-items-stretch lg:col-span-1 lg:col-span-2 lg:col-span-3 lg:col-span-4 lg:col-span-5",
    "lg:col-span-6 lg:col-span-7 lg:col-span-8 lg:col-span-9 lg:col-span-10 lg:col-span-11 lg:col-span-12 lg:col-span-full",
    "lg:row-span-1 lg:row-span-2 lg:row-span-3 lg:row-span-4 lg:row-span-5 lg:row-span-6 lg:row-span-full lg:col-start-1",
    "lg:col-start-2 lg:col-start-3 lg:col-start-4 lg:col-start-5 lg:col-start-6 lg:col-start-7 lg:col-start-8 lg:col-start-9",
    "lg:col-start-10 lg:col-start-11 lg:col-start-12 lg:col-start-13 lg:col-start-auto lg:col-end-1 lg:col-end-2 lg:col-end-3",
    "lg:col-end-4 lg:col-end-5 lg:col-end-6 lg:col-end-7 lg:col-end-8 lg:col-end-9 lg:col-end-10 lg:col-end-11",
    "lg:col-end-12 lg:col-end-13 lg:col-end-auto lg:row-start-1 lg:row-start-2 lg:row-start-3 lg:row-start-4 lg:row-start-5",
    "lg:row-start-6 lg:row-start-7 lg:row-start-auto lg:row-end-1 lg:row-end-2 lg:row-end-3 lg:row-end-4 lg:row-end-5",
    "lg:row-end-6 lg:row-end-7 lg:row-end-auto lg:self-start lg:self-end lg:self-center lg:self-stretch lg:self-auto",
    "lg:justify-self-start lg:justify-self-end lg:justify-self-center lg:justify-self-stretch lg:justify-self-auto",
    "xl:grid-cols-1 xl:grid-cols-2 xl:grid-cols-3 xl:grid-cols-4 xl:grid-cols-5 xl:grid-cols-6 xl:grid-cols-7 xl:grid-cols-8",
    "xl:grid-cols-9 xl:grid-cols-10 xl:grid-cols-11 xl:grid-cols-12 xl:grid-cols-none xl:grid-cols-subgrid xl:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))] xl:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "xl:grid-rows-1 xl:grid-rows-2 xl:grid-rows-3 xl:grid-rows-4 xl:grid-rows-5 xl:grid-rows-6 xl:grid-rows-none xl:grid-rows-subgrid",
    "xl:gap-0 xl:gap-1 xl:gap-2 xl:gap-3 xl:gap-4 xl:gap-5 xl:gap-6 xl:gap-8",
    "xl:gap-10 xl:gap-12 xl:gap-16 xl:gap-20 xl:gap-24 xl:gap-x-0 xl:gap-x-1 xl:gap-x-2",
    "xl:gap-x-3 xl:gap-x-4 xl:gap-x-5 xl:gap-x-6 xl:gap-x-8 xl:gap-x-10 xl:gap-x-12 xl:gap-y-0",
    "xl:gap-y-1 xl:gap-y-2 xl:gap-y-3 xl:gap-y-4 xl:gap-y-5 xl:gap-y-6 xl:gap-y-8 xl:gap-y-10",
    "xl:gap-y-12 xl:grid-flow-row xl:grid-flow-col xl:grid-flow-dense xl:grid-flow-row-dense xl:grid-flow-col-dense xl:items-start xl:items-end",
    "xl:items-center xl:items-stretch xl:items-baseline xl:justify-items-start xl:justify-items-end xl:justify-items-center xl:justify-items-stretch xl:place-items-start",
    "xl:place-items-end xl:place-items-center xl:place-items-stretch xl:col-span-1 xl:col-span-2 xl:col-span-3 xl:col-span-4 xl:col-span-5",
    "xl:col-span-6 xl:col-span-7 xl:col-span-8 xl:col-span-9 xl:col-span-10 xl:col-span-11 xl:col-span-12 xl:col-span-full",
    "xl:row-span-1 xl:row-span-2 xl:row-span-3 xl:row-span-4 xl:row-span-5 xl:row-span-6 xl:row-span-full xl:col-start-1",
    "xl:col-start-2 xl:col-start-3 xl:col-start-4 xl:col-start-5 xl:col-start-6 xl:col-start-7 xl:col-start-8 xl:col-start-9",
    "xl:col-start-10 xl:col-start-11 xl:col-start-12 xl:col-start-13 xl:col-start-auto xl:col-end-1 xl:col-end-2 xl:col-end-3",
    "xl:col-end-4 xl:col-end-5 xl:col-end-6 xl:col-end-7 xl:col-end-8 xl:col-end-9 xl:col-end-10 xl:col-end-11",
    "xl:col-end-12 xl:col-end-13 xl:col-end-auto xl:row-start-1 xl:row-start-2 xl:row-start-3 xl:row-start-4 xl:row-start-5",
    "xl:row-start-6 xl:row-start-7 xl:row-start-auto xl:row-end-1 xl:row-end-2 xl:row-end-3 xl:row-end-4 xl:row-end-5",
    "xl:row-end-6 xl:row-end-7 xl:row-end-auto xl:self-start xl:self-end xl:self-center xl:self-stretch xl:self-auto",
    "xl:justify-self-start xl:justify-self-end xl:justify-self-center xl:justify-self-stretch xl:justify-self-auto",
    "2xl:grid-cols-1 2xl:grid-cols-2 2xl:grid-cols-3 2xl:grid-cols-4 2xl:grid-cols-5 2xl:grid-cols-6 2xl:grid-cols-7 2xl:grid-cols-8",
    "2xl:grid-cols-9 2xl:grid-cols-10 2xl:grid-cols-11 2xl:grid-cols-12 2xl:grid-cols-none 2xl:grid-cols-subgrid 2xl:grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))] 2xl:grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
    "2xl:grid-rows-1 2xl:grid-rows-2 2xl:grid-rows-3 2xl:grid-rows-4 2xl:grid-rows-5 2xl:grid-rows-6 2xl:grid-rows-none 2xl:grid-rows-subgrid",
    "2xl:gap-0 2xl:gap-1 2xl:gap-2 2xl:gap-3 2xl:gap-4 2xl:gap-5 2xl:gap-6 2xl:gap-8",
    "2xl:gap-10 2xl:gap-12 2xl:gap-16 2xl:gap-20 2xl:gap-24 2xl:gap-x-0 2xl:gap-x-1 2xl:gap-x-2",
    "2xl:gap-x-3 2xl:gap-x-4 2xl:gap-x-5 2xl:gap-x-6 2xl:gap-x-8 2xl:gap-x-10 2xl:gap-x-12 2xl:gap-y-0",
    "2xl:gap-y-1 2xl:gap-y-2 2xl:gap-y-3 2xl:gap-y-4 2xl:gap-y-5 2xl:gap-y-6 2xl:gap-y-8 2xl:gap-y-10",
    "2xl:gap-y-12 2xl:grid-flow-row 2xl:grid-flow-col 2xl:grid-flow-dense 2xl:grid-flow-row-dense 2xl:grid-flow-col-dense 2xl:items-start 2xl:items-end",
    "2xl:items-center 2xl:items-stretch 2xl:items-baseline 2xl:justify-items-start 2xl:justify-items-end 2xl:justify-items-center 2xl:justify-items-stretch 2xl:place-items-start",
    "2xl:place-items-end 2xl:place-items-center 2xl:place-items-stretch 2xl:col-span-1 2xl:col-span-2 2xl:col-span-3 2xl:col-span-4 2xl:col-span-5",
    "2xl:col-span-6 2xl:col-span-7 2xl:col-span-8 2xl:col-span-9 2xl:col-span-10 2xl:col-span-11 2xl:col-span-12 2xl:col-span-full",
    "2xl:row-span-1 2xl:row-span-2 2xl:row-span-3 2xl:row-span-4 2xl:row-span-5 2xl:row-span-6 2xl:row-span-full 2xl:col-start-1",
    "2xl:col-start-2 2xl:col-start-3 2xl:col-start-4 2xl:col-start-5 2xl:col-start-6 2xl:col-start-7 2xl:col-start-8 2xl:col-start-9",
    "2xl:col-start-10 2xl:col-start-11 2xl:col-start-12 2xl:col-start-13 2xl:col-start-auto 2xl:col-end-1 2xl:col-end-2 2xl:col-end-3",
    "2xl:col-end-4 2xl:col-end-5 2xl:col-end-6 2xl:col-end-7 2xl:col-end-8 2xl:col-end-9 2xl:col-end-10 2xl:col-end-11",
    "2xl:col-end-12 2xl:col-end-13 2xl:col-end-auto 2xl:row-start-1 2xl:row-start-2 2xl:row-start-3 2xl:row-start-4 2xl:row-start-5",
    "2xl:row-start-6 2xl:row-start-7 2xl:row-start-auto 2xl:row-end-1 2xl:row-end-2 2xl:row-end-3 2xl:row-end-4 2xl:row-end-5",
    "2xl:row-end-6 2xl:row-end-7 2xl:row-end-auto 2xl:self-start 2xl:self-end 2xl:self-center 2xl:self-stretch 2xl:self-auto",
    "2xl:justify-self-start 2xl:justify-self-end 2xl:justify-self-center 2xl:justify-self-stretch 2xl:justify-self-auto",
  ].flatMap((group) => group.split(" ")),
);

const gridBreakpoints = ["sm", "md", "lg", "xl", "2xl"] as const;

type ResponsiveValue<T> =
  T | Partial<Record<"base" | (typeof gridBreakpoints)[number], T>>;

type GridClassMap = { readonly [key: string]: string | undefined };

function resolveGridResponsive<T extends string | number>(
  value: ResponsiveValue<T> | undefined,
  classMap: GridClassMap,
): string {
  if (value == null) return "";

  if (!isObjectProp(value)) return classMap[String(value)] ?? "";

  const classes: string[] = [];

  if (value.base !== undefined) {
    const base = classMap[String(value.base)];

    if (base) classes.push(base);
  }

  for (const breakpoint of gridBreakpoints) {
    const atBreakpoint = value[breakpoint];

    if (atBreakpoint === undefined) continue;
    const mapped = classMap[String(atBreakpoint)];

    if (!mapped) continue;
    const candidate = `${breakpoint}:${mapped}`;

    if (gridResponsiveCandidates.has(candidate)) classes.push(candidate);
  }

  return classes.join(" ");
}

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
  none: "grid-cols-none",
  subgrid: "grid-cols-subgrid",
  "auto-fit":
    "grid-cols-[repeat(auto-fit,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
  "auto-fill":
    "grid-cols-[repeat(auto-fill,minmax(min(100%,var(--kira-grid-min-item-width,16rem)),1fr))]",
} as const;

const rowsMap = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
  none: "grid-rows-none",
  subgrid: "grid-rows-subgrid",
} as const;

const gapMap = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
  20: "gap-20",
  24: "gap-24",
} as const;

const gapXMap = {
  0: "gap-x-0",
  1: "gap-x-1",
  2: "gap-x-2",
  3: "gap-x-3",
  4: "gap-x-4",
  5: "gap-x-5",
  6: "gap-x-6",
  8: "gap-x-8",
  10: "gap-x-10",
  12: "gap-x-12",
} as const;

const gapYMap = {
  0: "gap-y-0",
  1: "gap-y-1",
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  5: "gap-y-5",
  6: "gap-y-6",
  8: "gap-y-8",
  10: "gap-y-10",
  12: "gap-y-12",
} as const;

const flowMap = {
  row: "grid-flow-row",
  column: "grid-flow-col",
  dense: "grid-flow-dense",
  "row-dense": "grid-flow-row-dense",
  "column-dense": "grid-flow-col-dense",
} as const;

const alignMap = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
  baseline: "items-baseline",
} as const;

const justifyMap = {
  start: "justify-items-start",
  end: "justify-items-end",
  center: "justify-items-center",
  stretch: "justify-items-stretch",
} as const;

const placeMap = {
  start: "place-items-start",
  end: "place-items-end",
  center: "place-items-center",
  stretch: "place-items-stretch",
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

type GridCols = keyof typeof colsMap;

type GridRows = keyof typeof rowsMap;

type GridGap = keyof typeof gapMap;

type GridFlow = keyof typeof flowMap;

type GridAlign = keyof typeof alignMap;

type GridJustify = keyof typeof justifyMap;

type GridPlace = keyof typeof placeMap;

type GridElement =
  "div" | "section" | "main" | "article" | "aside" | "ul" | "ol" | "form";

interface GridOwnProps extends VariantProps<typeof gridVariants> {
  cols?: ResponsiveValue<GridCols>;
  /** CSS length or positive pixel count for auto-fit/auto-fill columns. */
  minItemWidth?: string | number;
  rows?: ResponsiveValue<GridRows>;
  gap?: ResponsiveValue<GridGap>;
  gapX?: ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>;
  gapY?: ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>;
  flow?: GridFlow;
  align?: ResponsiveValue<GridAlign>;
  justify?: ResponsiveValue<GridJustify>;
  place?: ResponsiveValue<GridPlace>;
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
    resolveGridResponsive(cols, colsMap),
    resolveGridResponsive(rows, rowsMap),
    resolveGridResponsive(gap, gapMap),
    resolveGridResponsive(gapX, gapXMap),
    resolveGridResponsive(gapY, gapYMap),
    flow ? flowMap[flow] : "",
    resolveGridResponsive(align, alignMap),
    resolveGridResponsive(justify, justifyMap),
    resolveGridResponsive(place, placeMap),
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
          "--kira-grid-min-item-width": gridValueValue(minItemWidth),
          ...style,
        } as React.CSSProperties,
      },
      props,
    ),
  });
}

const colSpanMap = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  full: "col-span-full",
} as const;

const rowSpanMap = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  full: "row-span-full",
} as const;

const colStartMap = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
  13: "col-start-13",
  auto: "col-start-auto",
} as const;

const colEndMap = {
  1: "col-end-1",
  2: "col-end-2",
  3: "col-end-3",
  4: "col-end-4",
  5: "col-end-5",
  6: "col-end-6",
  7: "col-end-7",
  8: "col-end-8",
  9: "col-end-9",
  10: "col-end-10",
  11: "col-end-11",
  12: "col-end-12",
  13: "col-end-13",
  auto: "col-end-auto",
} as const;

const rowStartMap = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
  7: "row-start-7",
  auto: "row-start-auto",
} as const;

const rowEndMap = {
  1: "row-end-1",
  2: "row-end-2",
  3: "row-end-3",
  4: "row-end-4",
  5: "row-end-5",
  6: "row-end-6",
  7: "row-end-7",
  auto: "row-end-auto",
} as const;

const selfAlignMap = {
  start: "self-start",
  end: "self-end",
  center: "self-center",
  stretch: "self-stretch",
  auto: "self-auto",
} as const;

const justifySelfMap = {
  start: "justify-self-start",
  end: "justify-self-end",
  center: "justify-self-center",
  stretch: "justify-self-stretch",
  auto: "justify-self-auto",
} as const;

type ColSpan = keyof typeof colSpanMap;

type RowSpan = keyof typeof rowSpanMap;

type ColPosition = keyof typeof colStartMap;

type RowPosition = keyof typeof rowStartMap;

type SelfAlign = keyof typeof selfAlignMap;

const gridItemVariants = cva("min-w-0 wrap-break-word");

type GridItemElement = GridElement | "li";

interface GridItemOwnProps {
  colSpan?: ResponsiveValue<ColSpan>;
  rowSpan?: ResponsiveValue<RowSpan>;
  colStart?: ResponsiveValue<ColPosition>;
  colEnd?: ResponsiveValue<ColPosition>;
  rowStart?: ResponsiveValue<RowPosition>;
  rowEnd?: ResponsiveValue<RowPosition>;
  alignSelf?: ResponsiveValue<SelfAlign>;
  justifySelf?: ResponsiveValue<SelfAlign>;
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
    resolveGridResponsive(colSpan, colSpanMap),
    resolveGridResponsive(rowSpan, rowSpanMap),
    resolveGridResponsive(colStart, colStartMap),
    resolveGridResponsive(colEnd, colEndMap),
    resolveGridResponsive(rowStart, rowStartMap),
    resolveGridResponsive(rowEnd, rowEndMap),
    resolveGridResponsive(alignSelf, selfAlignMap),
    resolveGridResponsive(justifySelf, justifySelfMap),
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
  loading?: boolean;
  loadingLabel?: string;
  loadingCount?: number;
  loadingContent?: React.ReactNode;
  emptyContent?: React.ReactNode;
  error?: React.ReactNode;
  onRetry?: () => void;
};

function KiraGrid<Item, T extends GridElement = "div">({
  items,
  getKey,
  renderItem,
  loading = false,
  loadingLabel = "Loading items…",
  loadingCount = 6,
  loadingContent,
  emptyContent = "No items yet.",
  error,
  onRetry,
  cols = "auto-fit",
  gap = 4,
  ...props
}: KiraGridProps<Item, T>) {
  // SAFETY: collection props were removed; the remainder belongs to Grid.
  const gridProps = props as GridProps<T>;

  const itemTag = gridCollectionTag(props);

  const placeholderCount = Number.isFinite(loadingCount)
    ? Math.min(100, Math.max(1, Math.trunc(loadingCount)))
    : 6;

  const wrapGrid = () => (
    <Grid<T>
      {...gridProps}
      cols={cols}
      gap={gap}
      data-slot="kira-grid"
      aria-busy={loading}
    >
      <KiraGridCollection
        items={items}
        getKey={getKey}
        renderItem={renderItem}
        loading={loading}
        loadingContent={loadingContent}
        emptyContent={emptyContent}
        error={error}
        onRetry={onRetry}
        itemTag={itemTag}
        placeholderCount={placeholderCount}
      />
    </Grid>
  );

  return (
    <>
      <output data-slot="grid-status" className="sr-only">
        {gridValueValue2(loading, loadingLabel, error, items)}
      </output>
      {wrapGrid()}
    </>
  );
}

function KiraGridCollection<Item>({
  items,
  getKey,
  renderItem,
  loading,
  loadingContent,
  emptyContent,
  error,
  onRetry,
  itemTag,
  placeholderCount,
}: Pick<
  KiraGridProps<Item>,
  | "items"
  | "getKey"
  | "renderItem"
  | "loading"
  | "loadingContent"
  | "emptyContent"
  | "error"
  | "onRetry"
> & { itemTag: "li" | "div"; placeholderCount: number }) {
  const buildError = () =>
    !loading &&
    error != null && (
      <GridItem
        as={itemTag}
        colSpan="full"
        data-slot="grid-error"
        className="space-y-3 rounded-lg border border-destructive/30 p-4"
      >
        <div role="alert" className="text-sm text-destructive">
          {error}
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </GridItem>
    );

  const buildItems = () => {
    if (items.length)
      return items.map((item, index) => (
        <GridItem as={itemTag} key={getKey(item)}>
          {renderItem(item, index)}
        </GridItem>
      ));

    if (loading)
      return Array.from({ length: placeholderCount }, (_, index) => (
        <GridItem
          as={itemTag}
          key={`placeholder-${index}`}
          data-slot="grid-skeleton"
          aria-hidden="true"
        >
          {loadingContent ?? <Skeleton className="h-48 w-full" />}
        </GridItem>
      ));

    if (error != null) return null;

    return (
      <GridItem
        as={itemTag}
        colSpan="full"
        data-slot="grid-empty"
        className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground"
      >
        {emptyContent}
      </GridItem>
    );
  };

  return (
    <>
      {buildError()}
      {buildItems()}
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

function gridValueValue(minItemWidth: string | number | undefined) {
  if (isNumberProp(minItemWidth)) {
    if (Number.isFinite(minItemWidth) && minItemWidth > 0) {
      return `${minItemWidth}px`;
    }

    return undefined;
  }

  return minItemWidth;
}

function gridValueValue2<Item>(
  loading: boolean,
  loadingLabel: string,
  error: React.ReactNode,
  items: readonly Item[],
) {
  if (loading) {
    return loadingLabel;
  }

  if (error == null) {
    return `${items.length} ${items.length === 1 ? "item" : "items"}.`;
  }

  return "Items could not be loaded.";
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
