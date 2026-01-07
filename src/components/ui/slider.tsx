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
  showTooltip = false,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps & { showTooltip?: boolean }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [isDragging, setIsDragging] = React.useState(false);
  const currentValue = value ?? internalValue;

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
        <SliderPrimitive.Control
          className="relative flex w-full items-center"
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="relative w-full grow overflow-hidden rounded-full bg-muted"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="absolute h-full rounded-full transition-all duration-200 ease-out"
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className="relative block rounded-full border-2 border-primary bg-background shadow transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {showTooltip && isDragging && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover border border-border rounded shadow whitespace-nowrap">
                {currentValue}
              </span>
            )}
          </SliderPrimitive.Thumb>
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

// ============================================
// RANGE SLIDER (min-max selection)
// ============================================
interface RangeSliderProps
  extends Omit<
      SliderPrimitive.Root.Props,
      "value" | "defaultValue" | "onValueChange"
    >,
    VariantProps<typeof sliderVariants> {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  showValue?: boolean;
  showTooltip?: boolean;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

function RangeSlider({
  className,
  size,
  variant,
  value,
  defaultValue = [25, 75],
  onValueChange,
  showValue = false,
  showTooltip = false,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => String(v),
  ...props
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [isDragging, setIsDragging] = React.useState(false);
  const currentValue = value ?? internalValue;

  const handleChange = (newValue: number | readonly number[]) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      const val: [number, number] = [newValue[0], newValue[1]];
      setInternalValue(val);
      onValueChange?.(val);
    }
  };

  return (
    <div className="w-full">
      <SliderPrimitive.Root
        data-slot="range-slider"
        value={currentValue}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={cn(sliderVariants({ size, variant }), className)}
        {...props}
      >
        <SliderPrimitive.Control
          className="relative flex w-full items-center"
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
        >
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="relative w-full grow overflow-hidden rounded-full bg-muted"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="absolute h-full rounded-full transition-all duration-200 ease-out"
            />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className="relative block rounded-full border-2 border-primary bg-background shadow transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {showTooltip && isDragging && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover border border-border rounded shadow whitespace-nowrap">
                {formatValue(currentValue[0])}
              </span>
            )}
          </SliderPrimitive.Thumb>
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className="relative block rounded-full border-2 border-primary bg-background shadow transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {showTooltip && isDragging && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-popover border border-border rounded shadow whitespace-nowrap">
                {formatValue(currentValue[1])}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
      {showValue && (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{formatValue(currentValue[0])}</span>
          <span>{formatValue(currentValue[1])}</span>
        </div>
      )}
    </div>
  );
}

export { Slider, RangeSlider, sliderVariants };
export type { SliderProps, RangeSliderProps };
