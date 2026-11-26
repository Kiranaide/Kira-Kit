"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import {
  layoutGapClasses,
  resolveLayoutResponsive,
  type LayoutBreakpoint,
  type LayoutResponsiveValue,
  type LayoutSpacing,
} from "@/lib/layout-responsive";

/* Literal per-breakpoint class maps so consumer Tailwind scans them with zero safelist. */

const directionClasses = {
  row: [
    "flex-row",
    "sm:flex-row",
    "md:flex-row",
    "lg:flex-row",
    "xl:flex-row",
    "2xl:flex-row",
  ],
  "row-reverse": [
    "flex-row-reverse",
    "sm:flex-row-reverse",
    "md:flex-row-reverse",
    "lg:flex-row-reverse",
    "xl:flex-row-reverse",
    "2xl:flex-row-reverse",
  ],
  column: [
    "flex-col",
    "sm:flex-col",
    "md:flex-col",
    "lg:flex-col",
    "xl:flex-col",
    "2xl:flex-col",
  ],
  "column-reverse": [
    "flex-col-reverse",
    "sm:flex-col-reverse",
    "md:flex-col-reverse",
    "lg:flex-col-reverse",
    "xl:flex-col-reverse",
    "2xl:flex-col-reverse",
  ],
} as const;

const wrapClasses = {
  nowrap: [
    "flex-nowrap",
    "sm:flex-nowrap",
    "md:flex-nowrap",
    "lg:flex-nowrap",
    "xl:flex-nowrap",
    "2xl:flex-nowrap",
  ],
  wrap: [
    "flex-wrap",
    "sm:flex-wrap",
    "md:flex-wrap",
    "lg:flex-wrap",
    "xl:flex-wrap",
    "2xl:flex-wrap",
  ],
  "wrap-reverse": [
    "flex-wrap-reverse",
    "sm:flex-wrap-reverse",
    "md:flex-wrap-reverse",
    "lg:flex-wrap-reverse",
    "xl:flex-wrap-reverse",
    "2xl:flex-wrap-reverse",
  ],
} as const;

const justifyClasses = {
  start: [
    "justify-start",
    "sm:justify-start",
    "md:justify-start",
    "lg:justify-start",
    "xl:justify-start",
    "2xl:justify-start",
  ],
  end: [
    "justify-end",
    "sm:justify-end",
    "md:justify-end",
    "lg:justify-end",
    "xl:justify-end",
    "2xl:justify-end",
  ],
  center: [
    "justify-center",
    "sm:justify-center",
    "md:justify-center",
    "lg:justify-center",
    "xl:justify-center",
    "2xl:justify-center",
  ],
  between: [
    "justify-between",
    "sm:justify-between",
    "md:justify-between",
    "lg:justify-between",
    "xl:justify-between",
    "2xl:justify-between",
  ],
  around: [
    "justify-around",
    "sm:justify-around",
    "md:justify-around",
    "lg:justify-around",
    "xl:justify-around",
    "2xl:justify-around",
  ],
  evenly: [
    "justify-evenly",
    "sm:justify-evenly",
    "md:justify-evenly",
    "lg:justify-evenly",
    "xl:justify-evenly",
    "2xl:justify-evenly",
  ],
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
  baseline: [
    "items-baseline",
    "sm:items-baseline",
    "md:items-baseline",
    "lg:items-baseline",
    "xl:items-baseline",
    "2xl:items-baseline",
  ],
  stretch: [
    "items-stretch",
    "sm:items-stretch",
    "md:items-stretch",
    "lg:items-stretch",
    "xl:items-stretch",
    "2xl:items-stretch",
  ],
} as const;

type FlexDirection = keyof typeof directionClasses;

type FlexWrap = keyof typeof wrapClasses;

type FlexJustify = keyof typeof justifyClasses;

type FlexAlign = keyof typeof alignClasses;

type FlexGap = LayoutSpacing;

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
});

type FlexElement =
  | "div"
  | "section"
  | "nav"
  | "main"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "form"
  | "fieldset"
  | "span";

interface FlexOwnProps extends VariantProps<typeof flexVariants> {
  direction?: LayoutResponsiveValue<FlexDirection>;
  wrap?: LayoutResponsiveValue<FlexWrap>;
  justify?: LayoutResponsiveValue<FlexJustify>;
  align?: LayoutResponsiveValue<FlexAlign>;
  gap?: LayoutResponsiveValue<FlexGap>;
}

type FlexProps<T extends FlexElement = "div"> = FlexOwnProps & {
  as?: T;
  render?: useRender.RenderProp;
} & Omit<React.ComponentPropsWithRef<T>, keyof FlexOwnProps | "as" | "render">;

function Flex<T extends FlexElement = "div">({
  as,
  render,
  ref,
  className,
  inline,
  direction,
  wrap,
  justify,
  align,
  gap,
  ...props
}: FlexProps<T>) {
  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: the ref's element type follows the selected native tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a native data attribute absent from HTMLAttributes.
      {
        "data-slot": "flex",
        className: cn(
          flexVariants({ inline }),
          resolveLayoutResponsive(direction, directionClasses),
          resolveLayoutResponsive(wrap, wrapClasses),
          resolveLayoutResponsive(justify, justifyClasses),
          resolveLayoutResponsive(align, alignClasses),
          resolveLayoutResponsive(gap, layoutGapClasses),
          className,
        ),
      } as React.HTMLAttributes<HTMLElement>,
      props,
    ),
  });
}

export { Flex, flexVariants };

export type {
  FlexProps,
  FlexElement,
  FlexDirection,
  FlexWrap,
  FlexJustify,
  FlexAlign,
  FlexGap,
  LayoutResponsiveValue as ResponsiveValue,
  LayoutBreakpoint as Breakpoint,
};
