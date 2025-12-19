import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center",
  {
    variants: {
      size: {
        sm: "[&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:w-3",
        default:
          "[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4",
        lg: "[&_[data-slot=slider-track]]:h-3 [&_[data-slot=slider-thumb]]:h-5 [&_[data-slot=slider-thumb]]:w-5",
      },
      variant: {
        default: "[&_[data-slot=slider-range]]:bg-primary",
        info: "[&_[data-slot=slider-range]]:bg-info",
        success: "[&_[data-slot=slider-range]]:bg-success",
        warning: "[&_[data-slot=slider-range]]:bg-warning",
        destructive: "[&_[data-slot=slider-range]]:bg-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

interface SliderProps
  extends Omit<
      SliderPrimitive.Root.Props,
      "value" | "defaultValue" | "onValueChange"
    >,
    VariantProps<typeof sliderVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

function Slider({
  className,
  size,
  variant,
  value,
  defaultValue = 0,
  onValueChange,
  showValue = false,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleChange = (newValue: number | readonly number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <div className="w-full">
      <SliderPrimitive.Root
        data-slot="slider"
        value={currentValue}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={cn(sliderVariants({ size, variant }), className)}
        {...props}
      >
        <SliderPrimitive.Control className="relative flex w-full items-center">
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="relative w-full grow overflow-hidden rounded-full bg-muted"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="absolute h-full rounded-full"
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className="block rounded-full border-2 border-primary bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          />
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
      {showValue && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {currentValue}
        </div>
      )}
    </div>
  );
}

export { Slider, sliderVariants };
