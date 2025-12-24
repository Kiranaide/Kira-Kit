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
}

function Progress({
  className,
  value = 0,
  max = 100,
  size,
  variant,
  showLabel = false,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      <ProgressPrimitive.Root
        data-slot="progress"
        value={value}
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

export { Progress, progressVariants };
