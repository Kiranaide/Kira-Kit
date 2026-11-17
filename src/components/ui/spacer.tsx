"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";

import { cn } from "cn";
import {
  resolveLayoutResponsive,
  type LayoutResponsiveValue,
  type LayoutSpacing,
} from "@/lib/layout-responsive";
import { Skeleton } from "@/components/ui/skeleton";
import { isObjectProp } from "@/lib/component-prop-guards";

const sizeClasses = {
  "0": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*0)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*0)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*0)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*0)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*0)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*0)]",
  ],
  "1": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*1)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*1)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*1)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*1)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*1)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*1)]",
  ],
  "2": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*2)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*2)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*2)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*2)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*2)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*2)]",
  ],
  "3": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*3)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*3)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*3)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*3)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*3)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*3)]",
  ],
  "4": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*4)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*4)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*4)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*4)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*4)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*4)]",
  ],
  "5": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*5)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*5)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*5)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*5)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*5)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*5)]",
  ],
  "6": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*6)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*6)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*6)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*6)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*6)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*6)]",
  ],
  "8": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*8)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*8)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*8)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*8)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*8)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*8)]",
  ],
  "10": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*10)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*10)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*10)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*10)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*10)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*10)]",
  ],
  "12": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*12)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*12)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*12)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*12)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*12)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*12)]",
  ],
  "16": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*16)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*16)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*16)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*16)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*16)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*16)]",
  ],
  "20": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*20)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*20)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*20)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*20)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*20)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*20)]",
  ],
  "24": [
    "flex-none [--spacer-size:calc(var(--spacing,0.25rem)*24)]",
    "sm:flex-none sm:[--spacer-size:calc(var(--spacing,0.25rem)*24)]",
    "md:flex-none md:[--spacer-size:calc(var(--spacing,0.25rem)*24)]",
    "lg:flex-none lg:[--spacer-size:calc(var(--spacing,0.25rem)*24)]",
    "xl:flex-none xl:[--spacer-size:calc(var(--spacing,0.25rem)*24)]",
    "2xl:flex-none 2xl:[--spacer-size:calc(var(--spacing,0.25rem)*24)]",
  ],
  auto: [
    "flex-1 [--spacer-size:0px]",
    "sm:flex-1 sm:[--spacer-size:0px]",
    "md:flex-1 md:[--spacer-size:0px]",
    "lg:flex-1 lg:[--spacer-size:0px]",
    "xl:flex-1 xl:[--spacer-size:0px]",
    "2xl:flex-1 2xl:[--spacer-size:0px]",
  ],
} as const;

const axisClasses = {
  horizontal: [
    "w-[var(--spacer-size)] h-0",
    "sm:w-[var(--spacer-size)] sm:h-0",
    "md:w-[var(--spacer-size)] md:h-0",
    "lg:w-[var(--spacer-size)] lg:h-0",
    "xl:w-[var(--spacer-size)] xl:h-0",
    "2xl:w-[var(--spacer-size)] 2xl:h-0",
  ],
  vertical: [
    "h-[var(--spacer-size)] w-0",
    "sm:h-[var(--spacer-size)] sm:w-0",
    "md:h-[var(--spacer-size)] md:w-0",
    "lg:h-[var(--spacer-size)] lg:w-0",
    "xl:h-[var(--spacer-size)] xl:w-0",
    "2xl:h-[var(--spacer-size)] 2xl:w-0",
  ],
} as const;

const spacerVariants = cva("pointer-events-none shrink-0 select-none", {
  variants: {
    axis: {
      horizontal: "w-[var(--spacer-size)] h-0",
      vertical: "h-[var(--spacer-size)] w-0",
    },
    flexible: { true: "flex-1", false: "flex-none" },
  },
  defaultVariants: { axis: "horizontal", flexible: true },
});

const spacerReserveVariants = cva(
  "relative min-w-0 wrap-break-word min-h-[var(--spacer-reserve-height)]",
);

type SpacerAxis = "horizontal" | "vertical";

type SpacerSize = LayoutSpacing | "auto";

type SpacerElement = "div" | "span";

type SpacerNativeProps<Tag extends SpacerElement> = Omit<
  React.ComponentPropsWithRef<Tag>,
  "as" | "render" | keyof FluidSpacerOwnProps | keyof ReservedSpacerOwnProps
>;

type SpacerProps<Tag extends SpacerElement = "div"> = {
  as?: Tag;
  render?: useRender.RenderProp;
  size?: LayoutResponsiveValue<SpacerSize>;
  axis?: LayoutResponsiveValue<SpacerAxis>;
  children?: never;
  tabIndex?: never;
} & SpacerNativeProps<Tag>;

function Spacer<Tag extends SpacerElement = "div">({
  as,
  render,
  ref,
  size = "auto",
  axis = "horizontal",
  className,
  style,
  ...props
}: SpacerProps<Tag>) {
  const baseSize = isObjectProp(size) ? (size.base ?? "auto") : size;

  const baseAxis = isObjectProp(axis) ? (axis.base ?? "horizontal") : axis;

  const element = useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: native props and ref follow the selected tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a standard native data attribute.
      {
        "data-slot": "spacer",
        className: cn(
          spacerVariants({ axis: baseAxis, flexible: baseSize === "auto" }),
          resolveLayoutResponsive(baseSize, sizeClasses),
          resolveLayoutResponsive(size, sizeClasses),
          resolveLayoutResponsive(axis, axisClasses),
          className,
        ),
        style,
      } as React.HTMLAttributes<HTMLElement>,
      props,
    ),
  });

  // Enforce decoration after Base UI merges render-element or callback props.
  // SAFETY: the render adapter must forward these native attributes and its ref.
  return React.cloneElement(
    element as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
    {
      "aria-hidden": true,
      role: "presentation",
      inert: true,
      tabIndex: undefined,
      children: undefined,
    },
  );
}

type FluidSpacerOwnProps = {
  mode?: "fluid";
  min?: LayoutSpacing;
  max?: LayoutSpacing;
  /** Preferred CSS length; clamped between the existing spacing tokens. */
  preferred?: string;
  safeArea?: "none" | "top" | "right" | "bottom" | "left";
  axis?: LayoutResponsiveValue<SpacerAxis>;
  children?: never;
  tabIndex?: never;
};

type ReservedSpacerOwnProps = {
  mode: "reserve";
  minHeight?: string;
  loading?: boolean;
  loadingLabel?: string;
  loadingContent?: React.ReactNode;
  contentClassName?: string;
  children?: React.ReactNode;
};

type KiraSpacerProps<Tag extends SpacerElement = "div"> = (
  FluidSpacerOwnProps | ReservedSpacerOwnProps
) & {
  as?: Tag;
  render?: useRender.RenderProp;
} & SpacerNativeProps<Tag>;

type FluidSpacerProps<Tag extends SpacerElement> = FluidSpacerOwnProps & {
  as?: Tag;
  render?: useRender.RenderProp;
} & SpacerNativeProps<Tag>;

function ReservedSpacer<Tag extends SpacerElement = "div">({
  as,
  render,
  ref,
  minHeight = "6rem",
  loading = false,
  loadingLabel = "Loading content…",
  loadingContent,
  contentClassName,
  children,
  className,
  style,
  ...props
}: Omit<KiraSpacerProps<Tag> & ReservedSpacerOwnProps, "mode">) {
  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: native props and ref follow the selected tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data attributes and CSS custom properties are native attributes.
      {
        "data-slot": "kira-spacer",
        "data-mode": "reserve",
        "aria-busy": loading,
        className: cn(spacerReserveVariants(), className),
        style: {
          "--spacer-reserve-height": minHeight,
          ...style,
        } as React.CSSProperties,
      } as React.HTMLAttributes<HTMLElement>,
      props,
      {
        children: (
          <>
            <output
              data-slot="spacer-status"
              className="sr-only absolute"
              aria-live="polite"
            >
              {loading ? loadingLabel : ""}
            </output>
            <div
              data-slot="spacer-reserve-content"
              className={cn(
                "min-w-0",
                loading && "opacity-0",
                contentClassName,
              )}
              aria-hidden={loading || undefined}
              inert={loading}
            >
              {children}
            </div>
            {loading && (
              <div
                data-slot="spacer-placeholder"
                aria-hidden="true"
                inert
                className="absolute inset-0"
              >
                {loadingContent ?? <Skeleton className="h-full w-full" />}
              </div>
            )}
          </>
        ),
      },
    ),
  });
}

function KiraSpacer<Tag extends SpacerElement = "div">(
  props: KiraSpacerProps<Tag>,
) {
  const buildReserve = () => {
    if (props.mode !== "reserve") return null;
    const { mode, ...reserveProps } = props;
    void mode;

    return <ReservedSpacer<Tag> {...reserveProps} />;
  };

  const buildFluid = (fluidProps: FluidSpacerProps<Tag>) => {
    const {
      mode,
      min: inputMin,
      max: inputMax,
      preferred: inputPreferred,
      safeArea: inputSafeArea,
      style,
      ...spacerProps
    } = fluidProps;

    const min = inputMin === undefined ? 4 : inputMin;
    const max = inputMax === undefined ? 24 : inputMax;
    const preferred = inputPreferred === undefined ? "5vw" : inputPreferred;
    const safeArea = inputSafeArea === undefined ? "none" : inputSafeArea;

    void mode;

    const upper = Math.max(min, max);

    const length =
      "clamp(calc(var(--spacing, 0.25rem) * " +
      min +
      "), " +
      preferred +
      ", calc(var(--spacing, 0.25rem) * " +
      upper +
      "))";

    const reservedLength =
      safeArea === "none"
        ? length
        : "calc(" + length + " + env(safe-area-inset-" + safeArea + ", 0px))";

    // SAFETY: fluid-only props were removed; this branch has no children or tab stop.
    // SAFETY: fluid-only props and style are removed before forwarding the remaining native props.
    const nativeSpacerProps = spacerProps as SpacerProps<Tag>;

    return (
      <Spacer<Tag>
        {...nativeSpacerProps}
        size={0}
        data-slot="kira-spacer"
        data-mode="fluid"
        // SAFETY: the variable supplies the selected axis length; the edge is a closed union.
        style={
          { "--spacer-size": reservedLength, ...style } as React.CSSProperties
        }
      />
    );
  };

  return props.mode === "reserve" ? buildReserve() : buildFluid(props);
}

export { Spacer, KiraSpacer, spacerVariants, spacerReserveVariants };

export type {
  SpacerProps,
  SpacerAxis,
  SpacerSize,
  SpacerElement,
  KiraSpacerProps,
};
