/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import { isNumberProp } from "@/lib/component-prop-guards";

const RADIUS = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const spinnerVariants = cva(
  // Motion-reduce floor: the indeterminate glyph stops rotating (the static
  // arc still reads as a spinner); success/error pop-in is skipped too.
  "inline-flex shrink-0",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-5 w-5",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        warning: "text-warning",
        success: "text-success",
        info: "text-info",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export type SpinnerState = "loading" | "success" | "error";

export interface SpinnerProps
  extends React.SVGProps<SVGSVGElement>, VariantProps<typeof spinnerVariants> {
  /**
   * Accessible name. When provided the spinner is announced via
   * `role="status"` (or `role="progressbar"` when `value` is set); without it
   * the spinner is hidden from assistive tech (decorative — the parent
   * conveys the busy state).
   */
  label?: string;
  /**
   * Determinate progress 0–100. When set (and `state` is "loading") the
   * spinner renders a progress arc instead of the indeterminate rotation.
   */
  value?: number;
  /**
   * Terminal-state glyph: swap the arc for a check/cross flash.
   * The parent controls when to flip this (KiraButton's confirm pattern).
   */
  state?: SpinnerState;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;

  return Math.min(100, Math.max(0, value));
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);

  return () => document.removeEventListener("visibilitychange", onChange);
}

function getVisibilitySnapshot() {
  return document.visibilityState !== "hidden";
}

function getVisibilityServerSnapshot() {
  return true;
}

function Spinner({
  className,
  size,
  variant,
  label,
  value,
  state = "loading",
  ...props
}: SpinnerProps) {
  const resolveA11y1 = () => {
    if (label) {
      if (determinate == null) {
        return { "aria-hidden": true };
      }

      return {
        role: "progressbar",
        "aria-label": label,
        "aria-valuenow": Math.round(determinate),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
      };
    }

    return { "aria-hidden": true };
  };

  const resolveValue2 = () => {
    if (state === "success") {
      return (
        <IconCheck
          className={cn(
            "size-full",
            !reducedMotion &&
              "animate-in zoom-in-95 motion-reduce:animate-none",
          )}
          stroke={3}
          aria-hidden="true"
        />
      );
    }

    if (state === "error") {
      return (
        <IconX
          className={cn(
            "size-full",
            !reducedMotion &&
              "animate-in zoom-in-95 motion-reduce:animate-none",
          )}
          stroke={3}
          aria-hidden="true"
        />
      );
    }

    if (determinate == null) {
      return renderResolveValue2SectionPart1();
    }

    return renderResolveValue2SectionPart2({ reducedMotion, determinate });
  };

  const reducedMotion = useReducedMotion();

  const visible = React.useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot,
  );

  const determinate =
    state === "loading" && isNumberProp(value) ? clampPercent(value) : null;

  const a11y = resolveA11y1();

  return renderSpinnerSectionPart3({
    label,
    determinate,
    state,
    size,
    variant,
    reducedMotion,
    visible,
    className,
    a11y,
    props,
    resolveValue2,
  });
}

export interface KiraProgressSpinnerProps extends VariantProps<
  typeof spinnerVariants
> {
  /** Accessible name — required for the progressbar role to announce. */
  label: string;
  /** Determinate progress 0–100 (indeterminate while undefined). */
  value?: number;
  /** Show the numeric percent next to the arc (tabular numerals). */
  showPercent?: boolean;
  state?: SpinnerState;
  className?: string;
}

/* Kira mega: labelled determinate/indeterminate spinner with optional percent readout. */
function KiraProgressSpinner({
  label,
  value,
  showPercent = false,
  state = "loading",
  size,
  variant,
  className,
}: KiraProgressSpinnerProps) {
  const percent =
    state === "loading" && isNumberProp(value)
      ? Math.round(clampPercent(value))
      : null;

  return (
    <span
      data-slot="kira-progress-spinner"
      className={cn("inline-flex min-w-0 items-center gap-2", className)}
    >
      <Spinner
        label={label}
        value={value}
        state={state}
        size={size}
        variant={variant}
      />
      <span
        data-slot="kira-progress-spinner-label"
        aria-hidden="true"
        className="min-w-0 text-sm wrap-anywhere"
      >
        {label}
      </span>
      {showPercent && percent != null && (
        <span
          data-slot="kira-progress-spinner-percent"
          aria-hidden="true"
          className="text-sm font-medium tabular-nums text-muted-foreground"
        >
          {percent}%
        </span>
      )}
    </span>
  );
}

export { Spinner, KiraProgressSpinner, spinnerVariants };

function renderResolveValue2SectionPart1() {
  return (
    <>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        data-slot="spinner-arc"
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </>
  );
}

type renderResolveValue2SectionPart2Args = {
  reducedMotion: ReturnType<typeof useReducedMotion>;
  determinate: number;
};

function renderResolveValue2SectionPart2({
  reducedMotion,
  determinate,
}: renderResolveValue2SectionPart2Args) {
  return (
    <>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r={RADIUS}
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        data-slot="spinner-progress"
        transform="rotate(-90 12 12)"
        className={cn(
          !reducedMotion && "transition-[stroke-dashoffset] duration-300",
          "motion-reduce:transition-none",
        )}
        cx="12"
        cy="12"
        r={RADIUS}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - determinate / 100)}
      />
    </>
  );
}

type renderSpinnerSectionPart3Args = {
  label: SpinnerProps["label"];
  determinate: number | null;
  state: Exclude<SpinnerProps["state"], undefined>;
  size: SpinnerProps["size"];
  variant: SpinnerProps["variant"];
  reducedMotion: ReturnType<typeof useReducedMotion>;
  visible: boolean;
  className: SpinnerProps["className"];
  a11y:
    | {
        "aria-hidden": boolean;
        role?: undefined;
        "aria-label"?: undefined;
        "aria-valuenow"?: undefined;
        "aria-valuemin"?: undefined;
        "aria-valuemax"?: undefined;
      }
    | {
        role: string;
        "aria-label": string;
        "aria-valuenow": number;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-hidden"?: undefined;
      };
  props: Omit<
    SpinnerProps,
    "className" | "size" | "variant" | "label" | "value" | "state"
  >;
  resolveValue2: () => React.JSX.Element;
};

function renderSpinnerSectionPart3({
  label,
  determinate,
  state,
  size,
  variant,
  reducedMotion,
  visible,
  className,
  a11y,
  props,
  resolveValue2,
}: renderSpinnerSectionPart3Args) {
  return (
    <>
      {label && determinate == null && (
        <output
          data-slot="spinner-status"

          aria-atomic="true"
          className="sr-only"
        >
          {label}
        </output>
      )}
      <svg
        data-slot="spinner"
        data-state={state}
        className={cn(
          spinnerVariants({ size, variant }),
          !reducedMotion &&
            state === "loading" &&
            determinate == null &&
            "animate-spin motion-reduce:animate-none",
          !visible && "paused **:paused",
          className,
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...a11y}
        {...props}
      >
        {resolveValue2()}
      </svg>
    </>
  );
}
