import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import {
  resolveSafelistedResponsive,
  type LayoutResponsiveValue,
} from "@/lib/layout-responsive";
import { cn } from "cn";

/*                                 Scales                                     */
// Every class produced below is assembled at runtime (`w-${key}`), which
// Tailwind cannot detect by scanning. ALL of them (base + breakpoint variants)
// are safelisted with `@source inline()` in globals.css.
// If you add a key here, add it there too.

type ClassMap = Readonly<Record<string, string>>;

function toMap(prefix: string, keys: readonly (string | number)[]): ClassMap {
  return Object.fromEntries(keys.map((k) => [String(k), `${prefix}-${k}`]));
}

const BG_TOKENS = [
  "background",
  "foreground",
  "card",
  "popover",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
  "primary/10",
  "primary/20",
  "muted/50",
  "destructive/10",
  "success/10",
  "warning/10",
  "info/10",
] as const;

const TEXT_TOKENS = [
  "foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
] as const;

const SPACE = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12] as const;
const MARGIN = [...SPACE, "auto"] as const;

const SIZE = [
  0,
  "0.5",
  1,
  "1.5",
  2,
  "2.5",
  3,
  "3.5",
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  14,
  16,
  20,
  24,
  28,
  32,
  36,
  40,
  44,
  48,
  52,
  56,
  60,
  64,
  72,
  80,
  96,
  "px",
  "full",
  "fit",
  "min",
  "max",
] as const;

// Width units for width, height units for height, and only keywords that
// are real Tailwind utilities (e.g. there is no `max-w-auto`).
const W_KEYS = [...SIZE, "auto", "screen", "svw", "lvw", "dvw"] as const;
const H_KEYS = [...SIZE, "auto", "screen", "svh", "lvh", "dvh"] as const;
const MIN_W_KEYS = [...SIZE, "auto"] as const;
const MIN_H_KEYS = [...SIZE, "auto", "screen", "svh", "lvh", "dvh"] as const;

const MAX_W_KEYS = [
  ...SIZE,
  "none",
  "prose",
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
] as const;

const MAX_H_KEYS = [...SIZE, "none", "screen", "svh", "lvh", "dvh"] as const;

const bgMap = toMap("bg", BG_TOKENS);
const textColorMap = toMap("text", TEXT_TOKENS);
const wMap = toMap("w", W_KEYS);
const hMap = toMap("h", H_KEYS);
const minWMap = toMap("min-w", MIN_W_KEYS);
const minHMap = toMap("min-h", MIN_H_KEYS);
const maxWMap = toMap("max-w", MAX_W_KEYS);
const maxHMap = toMap("max-h", MAX_H_KEYS);

const spacingMaps = {
  p: toMap("p", SPACE),
  px: toMap("px", SPACE),
  py: toMap("py", SPACE),
  m: toMap("m", MARGIN),
  mx: toMap("mx", MARGIN),
  my: toMap("my", MARGIN),
} as const;

// `String(true)` === "true", so booleans resolve through the same path.
const borderMap = {
  true: "border",
  false: "",
  none: "border-none",
  2: "border-2",
  4: "border-4",
  8: "border-8",
} satisfies ClassMap;

type BoxBg = (typeof BG_TOKENS)[number];

type BoxTextColor = (typeof TEXT_TOKENS)[number];

type BoxSpace = (typeof SPACE)[number];

type BoxMargin = (typeof MARGIN)[number];

type BoxWidth = (typeof W_KEYS)[number];

type BoxHeight = (typeof H_KEYS)[number];

type BoxMinWidth = (typeof MIN_W_KEYS)[number];

type BoxMinHeight = (typeof MIN_H_KEYS)[number];

type BoxMaxWidth = (typeof MAX_W_KEYS)[number];

type BoxMaxHeight = (typeof MAX_H_KEYS)[number];

type BoxBorder = boolean | "none" | 2 | 4 | 8;

/*                                 Variants                                   */
// These classes are literal in source, so no safelist is needed.
// Tailwind v4 shifted the radius/shadow scales down one step; `xs`/`2xs`
// are the v4 names for the smallest sizes.

const boxVariants = cva("", {
  variants: {
    rounded: {
      none: "rounded-none",
      xs: "rounded-xs",
      sm: "rounded-sm",
      default: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
    shadow: {
      none: "shadow-none",
      "2xs": "shadow-2xs",
      xs: "shadow-xs",
      sm: "shadow-sm",
      default: "shadow",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
      "2xl": "shadow-2xl",
    },
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
    position: {
      static: "static",
      relative: "relative",
      absolute: "absolute",
      fixed: "fixed",
      sticky: "sticky",
    },
  },
});

/*                                 Component                                  */

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
  | "address";

interface BoxOwnProps extends VariantProps<typeof boxVariants> {
  bg?: LayoutResponsiveValue<BoxBg>;
  color?: LayoutResponsiveValue<BoxTextColor>;
  w?: LayoutResponsiveValue<BoxWidth>;
  h?: LayoutResponsiveValue<BoxHeight>;
  minW?: LayoutResponsiveValue<BoxMinWidth>;
  minH?: LayoutResponsiveValue<BoxMinHeight>;
  maxW?: LayoutResponsiveValue<BoxMaxWidth>;
  maxH?: LayoutResponsiveValue<BoxMaxHeight>;
  border?: LayoutResponsiveValue<BoxBorder>;
  p?: LayoutResponsiveValue<BoxSpace>;
  px?: LayoutResponsiveValue<BoxSpace>;
  py?: LayoutResponsiveValue<BoxSpace>;
  m?: LayoutResponsiveValue<BoxMargin>;
  mx?: LayoutResponsiveValue<BoxMargin>;
  my?: LayoutResponsiveValue<BoxMargin>;
}

type BoxProps<T extends BoxElement = "div"> = BoxOwnProps & {
  as?: T;
  render?: useRender.RenderProp;
} & Omit<React.ComponentPropsWithRef<T>, keyof BoxOwnProps | "as" | "render">;

function Box<T extends BoxElement = "div">({
  as,
  render,
  ref,
  className,
  rounded,
  shadow,
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
  p,
  px,
  py,
  m,
  mx,
  my,
  ...props
}: BoxProps<T>) {
  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: the ref's element type follows the selected native tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a native data attribute absent from HTMLAttributes.
      {
        "data-slot": "box",
        className: cn(
          boxVariants({ rounded, shadow, display, position }),
          resolveSafelistedResponsive(p, spacingMaps.p),
          resolveSafelistedResponsive(px, spacingMaps.px),
          resolveSafelistedResponsive(py, spacingMaps.py),
          resolveSafelistedResponsive(m, spacingMaps.m),
          resolveSafelistedResponsive(mx, spacingMaps.mx),
          resolveSafelistedResponsive(my, spacingMaps.my),
          resolveSafelistedResponsive(bg, bgMap),
          resolveSafelistedResponsive(color, textColorMap),
          resolveSafelistedResponsive(w, wMap),
          resolveSafelistedResponsive(h, hMap),
          resolveSafelistedResponsive(minW, minWMap),
          resolveSafelistedResponsive(minH, minHMap),
          resolveSafelistedResponsive(maxW, maxWMap),
          resolveSafelistedResponsive(maxH, maxHMap),
          resolveSafelistedResponsive(border, borderMap),
          className,
        ),
      } as React.HTMLAttributes<HTMLElement>,
      props,
    ),
  });
}

export { Box, boxVariants };

export type {
  BoxProps,
  BoxElement,
  BoxBg,
  BoxTextColor,
  BoxSpace,
  BoxMargin,
  BoxWidth,
  BoxHeight,
  BoxMinWidth,
  BoxMinHeight,
  BoxMaxWidth,
  BoxMaxHeight,
  BoxBorder,
};
