import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import { isObjectProp } from "@/lib/component-prop-guards";

/* -------------------------------------------------------------------------- */
/*                                 Responsive                                 */
/* -------------------------------------------------------------------------- */

// Order matters: mobile-first, so later breakpoints win.
const BREAKPOINTS = ["sm", "md", "lg", "xl", "2xl"] as const;

type Breakpoint = (typeof BREAKPOINTS)[number];

type ResponsiveValue<T> = T | ({ base?: T } & Partial<Record<Breakpoint, T>>);

type ClassMap = { readonly [key: string]: string | undefined };

/**
 * Resolves a (possibly responsive) prop value against a static class map.
 *
 * NOTE: breakpoint-prefixed classes (`md:flex-col`) are assembled at runtime,
 * so Tailwind can't see them in source. They MUST be safelisted with
 * `@source inline(...)` in your global CSS (see globals.css snippet).
 */
function resolveResponsive<T extends string | number | boolean>(
  value: ResponsiveValue<T> | undefined,
  classMap: ClassMap,
): string {
  if (value == null) return "";

  if (!isObjectProp(value)) return classMap[String(value)] ?? "";

  const classes: string[] = [];

  if (value.base !== undefined) {
    const cls = classMap[String(value.base)];

    if (cls) classes.push(cls);
  }

  for (const bp of BREAKPOINTS) {
    const v = value[bp];

    if (v === undefined) continue;
    const cls = classMap[String(v)];

    if (cls) classes.push(`${bp}:${cls}`);
  }

  return classes.join(" ");
}

/* -------------------------------------------------------------------------- */
/*                                 Class maps                                 */
/* -------------------------------------------------------------------------- */
// Prop types are derived from these maps, so they can never drift apart.

const directionMap = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
} as const;

const wrapMap = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
} as const;

const justifyMap = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

const alignMap = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
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

type FlexDirection = keyof typeof directionMap;

type FlexWrap = keyof typeof wrapMap;

type FlexJustify = keyof typeof justifyMap;

type FlexAlign = keyof typeof alignMap;

type FlexGap = keyof typeof gapMap;

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

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
  direction?: ResponsiveValue<FlexDirection>;
  wrap?: ResponsiveValue<FlexWrap>;
  justify?: ResponsiveValue<FlexJustify>;
  align?: ResponsiveValue<FlexAlign>;
  gap?: ResponsiveValue<FlexGap>;
}

/**
 * Polymorphic props: `<Flex as="form" onSubmit={...}>` gets form-specific
 * attributes and an `HTMLFormElement` ref. React 19 passes `ref` as a normal
 * prop, so no forwardRef is needed.
 */
type FlexProps<T extends FlexElement = "div"> = FlexOwnProps & {
  as?: T;
} & Omit<React.ComponentPropsWithRef<T>, keyof FlexOwnProps | "as">;

function Flex<T extends FlexElement = "div">({
  as,
  className,
  inline,
  direction,
  wrap,
  justify,
  align,
  gap,
  ...props
}: FlexProps<T>) {
  const Component: React.ElementType = as ?? "div";

  return React.createElement(Component, {
    "data-slot": "flex",
    className: cn(
      flexVariants({ inline }),
      resolveResponsive(direction, directionMap),
      resolveResponsive(wrap, wrapMap),
      resolveResponsive(justify, justifyMap),
      resolveResponsive(align, alignMap),
      resolveResponsive(gap, gapMap),
      className,
    ),
    ...props,
  });
}

export { Flex, flexVariants, resolveResponsive, BREAKPOINTS };

export type {
  FlexProps,
  FlexElement,
  FlexDirection,
  FlexWrap,
  FlexJustify,
  FlexAlign,
  FlexGap,
  ResponsiveValue,
  Breakpoint,
};
