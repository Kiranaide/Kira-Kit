import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type ProgressStep = {
  label: string;
  value: number;
  icon?: React.ReactNode;
  description?: string;
};

const indicatorVariants = cva(
  "flex items-center justify-center rounded-full border-2 transition-all duration-300",
  {
    variants: {
      size: {
        sm: "w-6 h-6 text-xs",
        default: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
      },
      variant: {
        default: "border-primary bg-background",
        success: "border-success bg-background",
        warning: "border-warning bg-background",
        destructive: "border-destructive bg-background",
      },
      state: {
        pending: "bg-muted border-muted-foreground",
        active: "border-primary bg-primary text-primary-foreground",
        completed: "bg-primary border-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      state: "pending",
    },
  }
);

const lineVariants = cva("flex-1 transition-all duration-300", {
  variants: {
    size: {
      sm: "h-0.5",
      default: "h-1",
      lg: "h-1.5",
    },
    variant: {
      default: "",
      success: "",
      warning: "",
      destructive: "",
    },
    state: {
      pending: "bg-muted",
      active: "bg-primary",
      completed: "bg-primary",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
    state: "pending",
  },
});

interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ProgressStep[];
  currentStep: number;
  size?: VariantProps<typeof indicatorVariants>["size"];
  variant?: VariantProps<typeof indicatorVariants>["variant"];
  orientation?: "horizontal" | "vertical";
  clickable?: boolean;
  animated?: boolean;
  showDescription?: boolean;
  onStepClick?: (value: number) => void;
}

function ProgressIndicator({
  steps,
  currentStep,
  size = "default",
  variant = "default",
  orientation = "horizontal",
  clickable = false,
  animated = false,
  showDescription = false,
  onStepClick,
  className,
  ...props
}: ProgressIndicatorProps) {
  const getStepState = (index: number): "pending" | "active" | "completed" => {
    if (index === currentStep) return "active";
    if (index < currentStep) return "completed";
    return "pending";
  };

  const getLineState = (index: number): "pending" | "active" | "completed" => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const lineVariantClass: Record<string, string> = {
    default: "",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      data-slot="progress-indicator"
      className={cn(
        "flex",
        isHorizontal ? "flex-row items-center gap-2" : "flex-col gap-1",
        className
      )}
      {...props}
    >
      {steps.map((step, index) => {
        const state = getStepState(index);
        const isClickable = clickable && state !== "active";

        return (
          <React.Fragment key={step.value}>
            <div
              data-slot="progress-step"
              className={cn(
                "flex flex-col items-center gap-1",
                isClickable && "cursor-pointer hover:opacity-80",
                !isHorizontal && "w-full"
              )}
              onClick={() => isClickable && onStepClick?.(step.value)}
            >
              <div
                className={cn(
                  indicatorVariants({ size, variant, state }),
                  animated && "transition-all duration-500",
                  variant === "success" &&
                    state === "completed" &&
                    "border-success bg-success text-success-foreground",
                  variant === "warning" &&
                    state === "completed" &&
                    "border-warning bg-warning text-warning-foreground",
                  variant === "destructive" &&
                    state === "completed" &&
                    "border-destructive bg-destructive text-destructive-foreground"
                )}
              >
                {state === "completed" ? (
                  <svg
                    className="w-3/5 h-3/5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.icon || <span>{index + 1}</span>
                )}
              </div>
              {isHorizontal || showDescription ? (
                <div
                  className={cn(
                    "text-center",
                    showDescription && "min-w-[80px]"
                  )}
                >
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium",
                      state === "active"
                        ? "text-foreground"
                        : state === "completed"
                          ? "text-foreground"
                          : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {showDescription && step.description && (
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            {index < steps.length - 1 && (
              <div
                data-slot="progress-line"
                className={cn(
                  lineVariants({ size, variant, state: getLineState(index) }),
                  isHorizontal ? "flex-1" : "w-0.5 h-4 self-center",
                  lineVariantClass[variant as keyof typeof lineVariantClass]
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { ProgressIndicator, indicatorVariants, lineVariants };
export type { ProgressIndicatorProps };
