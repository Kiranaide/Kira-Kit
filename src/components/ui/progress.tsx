import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
  }
);

interface ProgressProps
  extends Omit<ProgressPrimitive.Root.Props, "value">,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  "aria-label"?: string;
}

function Progress({
  className,
  value = 0,
  max = 100,
  size,
  variant,
  showLabel = false,
  "aria-label": ariaLabel,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        data-slot="progress"
        value={value}
        aria-label={ariaLabel}
        className={cn(progressVariants({ size, variant }), className)}
        {...props}
      >
        <ProgressPrimitive.Track className="h-full w-full">
          <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className="h-full transition-all duration-300 ease-in-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
      {showLabel && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// ============================================
// CIRCULAR PROGRESS
// ============================================
interface CircularProgressProps
  extends React.SVGProps<SVGSVGElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  indeterminate?: boolean;
  "aria-label"?: string;
}

function CircularProgress({
  value = 0,
  max = 100,
  size = "default",
  variant = "default",
  showLabel = false,
  indeterminate = false,
  "aria-label": ariaLabel,
  className,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  // When percentage is 100%, offset should be 0 (fully filled - complete circle)
  // When percentage is 0%, offset should be circumference (empty - no circle drawn)
  // strokeDashoffset: 0 = full circle drawn, circumference = empty
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

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={
        ariaLabel ||
        (indeterminate ? "Loading" : `${Math.round(percentage)}% complete`)
      }
      className={cn(
        "relative inline-flex items-center justify-center",
        sizeValue,
        className
      )}
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
        {indeterminate ? (
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
              "transition-all duration-500 ease-in-out"
            )}
            style={{
              transformOrigin: "50% 50%",
            }}
          />
        )}
      </svg>
      {showLabel && !indeterminate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

export { Progress, CircularProgress, progressVariants };
export type { CircularProgressProps };
