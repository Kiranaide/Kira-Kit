import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================
// LINEAR PROGRESS VARIANTS
// ============================================

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-2",
        lg: "h-3",
        xl: "h-4",
      },
      variant: {
        default: "[&_[data-slot=progress-indicator]]:bg-primary",
        info: "[&_[data-slot=progress-indicator]]:bg-info",
        success: "[&_[data-slot=progress-indicator]]:bg-success",
        warning: "[&_[data-slot=progress-indicator]]:bg-warning",
        destructive: "[&_[data-slot=progress-indicator]]:bg-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

const indicatorVariants = cva(
  "h-full rounded-full transition-all duration-300 ease-in-out",
  {
    variants: {
      striped: {
        true: "bg-[length:1rem_100%] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)]",
        false: "",
      },
      animated: {
        true: "animate-[progress-stripes_1s_linear_infinite]",
        false: "",
      },
      indeterminate: {
        true: "w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]",
        false: "",
      },
    },
    defaultVariants: {
      striped: false,
      animated: false,
      indeterminate: false,
    },
  },
);

// ============================================
// PROGRESS COMPONENT
// ============================================

interface ProgressProps
  extends
    Omit<ProgressPrimitive.Root.Props, "value">,
    VariantProps<typeof progressVariants> {
  /** Current progress value. Use `null` for indeterminate state. */
  value?: number | null;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Show percentage label below the progress bar. */
  showLabel?: boolean;
  /** Display striped pattern on the indicator. */
  striped?: boolean;
  /** Animate the striped pattern. Only works when `striped` is true. */
  animated?: boolean;
  /** Accessible label for screen readers. */
  "aria-label"?: string;
  /** Function to generate human-readable text for screen readers. */
  getAriaValueText?: (
    formattedValue: string | null,
    value: number | null,
  ) => string;
  /** Locale for number formatting. */
  locale?: Intl.LocalesArgument;
  /** Number format options. */
  format?: Intl.NumberFormatOptions;
  /** Callback when progress reaches max value. */
  onComplete?: () => void;
}

function Progress({
  className,
  value,
  max = 100,
  size,
  variant,
  showLabel = false,
  striped = false,
  animated = false,
  "aria-label": ariaLabel,
  getAriaValueText,
  locale,
  format,
  onComplete,
  ...props
}: ProgressProps) {
  const isIndeterminate = value === null || value === undefined;
  const safeValue = isIndeterminate ? 0 : value;
  const percentage = Math.min(100, Math.max(0, (safeValue / max) * 100));
  const isComplete = percentage >= 100;
  const previousCompleteRef = React.useRef(false);

  // Format value for display
  const formattedValue = React.useMemo(() => {
    if (isIndeterminate) return null;
    const formatter = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 0,
      ...format,
    });
    return formatter.format(safeValue / max);
  }, [safeValue, max, locale, format, isIndeterminate]);

  // Generate aria-valuetext
  const ariaValueText = React.useMemo(() => {
    if (getAriaValueText) {
      return getAriaValueText(
        formattedValue,
        isIndeterminate ? null : safeValue,
      );
    }
    return undefined;
  }, [getAriaValueText, formattedValue, safeValue, isIndeterminate]);

  // Handle onComplete callback
  React.useEffect(() => {
    if (isComplete && !previousCompleteRef.current && onComplete) {
      onComplete();
    }
    previousCompleteRef.current = isComplete;
  }, [isComplete, onComplete]);

  // Data attributes for state
  const dataAttributes = {
    "data-complete": isComplete ? "" : undefined,
    "data-indeterminate": isIndeterminate ? "" : undefined,
    "data-progressing": !isIndeterminate && !isComplete ? "" : undefined,
  };

  return (
    <div className="w-full" {...dataAttributes}>
      <ProgressPrimitive.Root
        data-slot="progress"
        value={isIndeterminate ? null : safeValue}
        aria-label={ariaLabel || (isIndeterminate ? "Loading" : undefined)}
        aria-valuetext={ariaValueText}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}
      >
        <ProgressPrimitive.Track className="h-full w-full">
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className={cn(
              indicatorVariants({
                striped,
                animated: striped && animated,
                indeterminate: isIndeterminate,
              }),
            )}
            style={isIndeterminate ? undefined : { width: `${percentage}%` }}
          />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
      {showLabel && !isIndeterminate && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {formattedValue || `${Math.round(percentage)}%`}
        </div>
      )}
    </div>
  );
}

// ============================================
// PROGRESS LABEL SUB-COMPONENT
// ============================================

interface ProgressLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  return (
    <label
      data-slot="progress-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

// ============================================
// PROGRESS VALUE SUB-COMPONENT
// ============================================

interface ProgressValueProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Format function for the value display. */
  children?:
    | ((formattedValue: string | null, value: number | null) => React.ReactNode)
    | null;
  value?: number | null;
  max?: number;
  locale?: Intl.LocalesArgument;
  format?: Intl.NumberFormatOptions;
}

function ProgressValue({
  className,
  children,
  value,
  max = 100,
  locale,
  format,
  ...props
}: ProgressValueProps) {
  const isIndeterminate = value === null || value === undefined;
  const safeValue = isIndeterminate ? 0 : value;

  const formattedValue = React.useMemo(() => {
    if (isIndeterminate) return null;
    const formatter = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 0,
      ...format,
    });
    return formatter.format(safeValue / max);
  }, [safeValue, max, locale, format, isIndeterminate]);

  const content =
    typeof children === "function"
      ? children(formattedValue, isIndeterminate ? null : safeValue)
      : formattedValue;

  return (
    <span
      data-slot="progress-value"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {content}
    </span>
  );
}

// ============================================
// SEGMENTED PROGRESS
// ============================================

interface Segment {
  value: number;
  variant?: "default" | "info" | "success" | "warning" | "destructive";
  label?: string;
}

interface SegmentedProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  segments: Segment[];
  total: number;
  showLabels?: boolean;
  "aria-label"?: string;
}

const segmentVariantColors = {
  default: "bg-primary",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

function SegmentedProgress({
  segments,
  total,
  size,
  showLabels = false,
  "aria-label": ariaLabel,
  className,
  ...props
}: SegmentedProgressProps) {
  const totalValue = segments.reduce((sum, seg) => sum + seg.value, 0);
  const percentage = Math.min(100, Math.max(0, (totalValue / total) * 100));

  return (
    <div className="w-full" {...props}>
      <div
        role="progressbar"
        aria-valuenow={totalValue}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={ariaLabel || `${Math.round(percentage)}% complete`}
        data-slot="segmented-progress"
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted flex",
          size === "sm" && "h-1",
          size === "lg" && "h-3",
          size === "xl" && "h-4",
          (!size || size === "default") && "h-2",
          className,
        )}
      >
        {segments.map((segment, index) => {
          const segmentPercent = (segment.value / total) * 100;
          return (
            <div
              key={index}
              data-slot="progress-segment"
              className={cn(
                "h-full transition-all duration-300 ease-in-out first:rounded-l-full last:rounded-r-full",
                segmentVariantColors[segment.variant || "default"],
              )}
              style={{ width: `${segmentPercent}%` }}
              title={segment.label}
            />
          );
        })}
      </div>
      {showLabels && (
        <div className="flex gap-4 mt-2 flex-wrap">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-1.5 text-xs">
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  segmentVariantColors[segment.variant || "default"],
                )}
              />
              <span className="text-muted-foreground">
                {segment.label || `Segment ${index + 1}`}: {segment.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// CIRCULAR PROGRESS
// ============================================

interface CircularProgressProps
  extends React.SVGProps<SVGSVGElement>, VariantProps<typeof progressVariants> {
  /** Current progress value. Use `null` for indeterminate state. */
  value?: number | null;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Show percentage label in the center. */
  showLabel?: boolean;
  /** @deprecated Use `value={null}` instead. Kept for backwards compatibility. */
  indeterminate?: boolean;
  /** Accessible label for screen readers. */
  "aria-label"?: string;
  /** Function to generate human-readable text for screen readers. */
  getAriaValueText?: (
    formattedValue: string | null,
    value: number | null,
  ) => string;
}

function CircularProgress({
  value,
  max = 100,
  size = "default",
  variant = "default",
  showLabel = false,
  indeterminate: indeterminateProp = false,
  "aria-label": ariaLabel,
  getAriaValueText,
  className,
  ...props
}: CircularProgressProps) {
  // Support both value={null} and indeterminate prop
  const isIndeterminate = value === null || indeterminateProp;
  const safeValue = isIndeterminate ? 0 : (value ?? 0);
  const percentage = Math.min(100, Math.max(0, (safeValue / max) * 100));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = Math.max(0, circumference * (1 - percentage / 100));

  const sizeClasses = {
    sm: "h-12 w-12",
    default: "h-16 w-16",
    lg: "h-20 w-20",
    xl: "h-24 w-24",
  };

  const strokeWidth = {
    sm: 3,
    default: 4,
    lg: 5,
    xl: 6,
  };

  const variantColors = {
    default: "stroke-primary",
    info: "stroke-info",
    success: "stroke-success",
    warning: "stroke-warning",
    destructive: "stroke-destructive",
  };

  const sizeValue = sizeClasses[size || "default"];

  // Generate aria-valuetext
  const formattedValue = isIndeterminate ? null : `${Math.round(percentage)}%`;
  const ariaValueText = React.useMemo(() => {
    if (getAriaValueText) {
      return getAriaValueText(
        formattedValue,
        isIndeterminate ? null : safeValue,
      );
    }
    return undefined;
  }, [getAriaValueText, formattedValue, safeValue, isIndeterminate]);

  // Data attributes for state
  const dataAttributes = {
    "data-complete": percentage >= 100 ? "" : undefined,
    "data-indeterminate": isIndeterminate ? "" : undefined,
    "data-progressing": !isIndeterminate && percentage < 100 ? "" : undefined,
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : safeValue}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={ariaValueText}
      aria-label={
        ariaLabel ||
        (isIndeterminate ? "Loading" : `${Math.round(percentage)}% complete`)
      }
      className={cn(
        "relative inline-flex items-center justify-center",
        sizeValue,
        className,
      )}
      {...dataAttributes}
    >
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        {...props}
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth[size || "default"]}
          fill="none"
          className="text-muted opacity-20"
        />
        {/* Progress circle */}
        {isIndeterminate ? (
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth[size || "default"]}
            fill="none"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
            className={cn(variantColors[variant || "default"])}
            style={{
              transformOrigin: "50% 50%",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth[size || "default"]}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn(
              variantColors[variant || "default"],
              "transition-all duration-500 ease-in-out",
            )}
            style={{
              transformOrigin: "50% 50%",
            }}
          />
        )}
      </svg>
      {showLabel && !isIndeterminate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export {
  Progress,
  ProgressLabel,
  ProgressValue,
  SegmentedProgress,
  CircularProgress,
  progressVariants,
  indicatorVariants,
};
export type {
  ProgressProps,
  CircularProgressProps,
  SegmentedProgressProps,
  Segment,
};
