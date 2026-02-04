"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const aspectRatioVariants = cva("relative w-full overflow-hidden", {
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
      scaleDown: "object-scale-down",
    },
    position: {
      center: "items-center justify-center",
      top: "items-start justify-center",
      bottom: "items-end justify-center",
      left: "items-center justify-start",
      right: "items-center justify-end",
      "top-left": "items-start justify-start",
      "top-right": "items-start justify-end",
      "bottom-left": "items-end justify-start",
      "bottom-right": "items-end justify-end",
    },
  },
  defaultVariants: {
    fit: "cover",
    position: "center",
  },
});

type AspectRatioPreset =
  | "1:1"
  | "4:3"
  | "3:2"
  | "16:9"
  | "9:16"
  | "21:9"
  | "3:4"
  | "2:3";

const presetRatios: Record<AspectRatioPreset, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "21:9": 21 / 9,
  "3:4": 3 / 4,
  "2:3": 2 / 3,
};

interface AspectRatioProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aspectRatioVariants> {
  ratio?: number | AspectRatioPreset;
  loading?: boolean;
  skeleton?: boolean;
}

function AspectRatio({
  ratio = "1:1",
  position,
  className,
  children,
  loading = false,
  skeleton = loading,
  ...props
}: AspectRatioProps) {
  const ratioValue = typeof ratio === "string" ? presetRatios[ratio] : ratio;

  const skeletonElement = skeleton && (
    <div className="absolute inset-0 animate-pulse bg-muted" />
  );

  const positionClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center",
    bottom: "items-end justify-center",
    left: "items-center justify-start",
    right: "items-center justify-end",
    "top-left": "items-start justify-start",
    "top-right": "items-start justify-end",
    "bottom-left": "items-end justify-start",
    "bottom-right": "items-end justify-end",
  };

  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        paddingBottom: `${100 / ratioValue}%`,
        ...props.style,
      }}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 flex",
          position && positionClasses[position]
        )}
      >
        {skeletonElement || children}
      </div>
    </div>
  );
}

interface ResponsiveAspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  base: number | AspectRatioPreset;
  md?: number | AspectRatioPreset;
  lg?: number | AspectRatioPreset;
  xl?: number | AspectRatioPreset;
  fit?: "cover" | "contain" | "fill" | "none" | "scaleDown";
  loading?: boolean;
}

function ResponsiveAspectRatio({
  base,
  md,
  lg,
  xl,
  fit,
  loading = false,
  className,
  children,
  ...props
}: ResponsiveAspectRatioProps) {
  const baseRatio = typeof base === "string" ? presetRatios[base] : base;
  const mdRatio = md
    ? typeof md === "string"
      ? presetRatios[md]
      : md
    : baseRatio;
  const lgRatio = lg
    ? typeof lg === "string"
      ? presetRatios[lg]
      : lg
    : mdRatio;
  const xlRatio = xl
    ? typeof xl === "string"
      ? presetRatios[xl]
      : xl
    : lgRatio;

  return (
    <div
      data-slot="responsive-aspect-ratio"
      className={cn("relative w-full", className)}
      style={{
        paddingBottom: `${100 / baseRatio}%`,
      }}
      data-md-padding={`${100 / mdRatio}%`}
      data-lg-padding={`${100 / lgRatio}%`}
      data-xl-padding={`${100 / xlRatio}%`}
      {...props}
    >
      <style>{`
        @media (min-width: 768px) {
          [data-md-padding] {
            padding-bottom: attr(data-md-padding) !important;
          }
        }
        @media (min-width: 1024px) {
          [data-lg-padding] {
            padding-bottom: attr(data-lg-padding) !important;
          }
        }
        @media (min-width: 1280px) {
          [data-xl-padding] {
            padding-bottom: attr(data-xl-padding) !important;
          }
        }
      `}</style>
      <div
        className={cn(
          "absolute inset-0 flex",
          fit && aspectRatioVariants({ fit })
        )}
      >
        {loading && <div className="absolute inset-0 animate-pulse bg-muted" />}
        {children}
      </div>
    </div>
  );
}

export {
  AspectRatio,
  ResponsiveAspectRatio,
  aspectRatioVariants,
  presetRatios,
};
export type { AspectRatioProps, ResponsiveAspectRatioProps, AspectRatioPreset };
