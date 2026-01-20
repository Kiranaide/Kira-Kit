import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const sliderVariants = cva(
  "relative flex touch-none select-none items-center",
  {
    variants: {
      size: {
        sm: "[&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-thumb]]:size-3.5",
        default:
          "[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:size-5",
        lg: "[&_[data-slot=slider-track]]:h-3 [&_[data-slot=slider-thumb]]:size-6",
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
  },
);

interface SliderProps
  extends
    Omit<
      SliderPrimitive.Root.Props,
      "value" | "defaultValue" | "onValueChange" | "onValueCommitted"
    >,
    VariantProps<typeof sliderVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  showValue?: boolean;
  min?: number;
  max?: number;
  step?: number;

  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;

  tooltipMode?: "always" | "hover" | "on-drag" | "never";
  tooltipPosition?: "top" | "bottom";
  renderTooltip?: (value: number) => React.ReactNode;

  markers?: Array<{ value: number; label?: string }>;
  showStepMarkers?: boolean;

  thumbLabel?: string;
  thumbIcon?: React.ReactNode;

  formatValue?: (value: number) => string;
  getValueText?: (value: number) => string;

  dir?: "ltr" | "rtl";

  name?: string;
}

function Slider({
  className,
  size,
  variant,
  value,
  defaultValue = 0,
  onValueChange,
  onValueCommitted,
  showValue = false,
  min = 0,
  max = 100,
  step = 1,

  label,
  description,
  error,
  required = false,
  readOnly = false,

  tooltipMode = "on-drag",
  tooltipPosition = "top",
  renderTooltip,

  markers,
  showStepMarkers = false,

  thumbLabel,
  thumbIcon,

  formatValue = (v) => String(v),
  getValueText = (v) => String(v),

  dir,

  name,
  disabled,
  ...props
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);

  const currentValue = value ?? internalValue;

  const handleChange = React.useCallback(
    (newValue: number | readonly number[]) => {
      const val = Array.isArray(newValue) ? newValue[0] : newValue;
      setInternalValue(val);
      onValueChange?.(val);
    },
    [onValueChange],
  );

  const handleCommitted = React.useCallback(
    (newValue: number | readonly number[]) => {
      const val = Array.isArray(newValue) ? newValue[0] : newValue;
      setInternalValue(val);
      onValueChange?.(val);
      onValueCommitted?.(val);
      setIsDragging(false);

      // GSAP animation on value committed
      if (thumbRef.current) {
        gsap.fromTo(
          thumbRef.current,
          { scale: 1.1 },
          {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          },
        );
      }
    },
    [onValueChange, onValueCommitted],
  );

  // GSAP animation for marker click
  const animateToMarker = React.useCallback(
    (markerValue: number) => {
      if (readOnly || disabled) return;

      // Animate the thumb with a pop effect
      if (thumbRef.current) {
        gsap.fromTo(
          thumbRef.current,
          { scale: 0.95 },
          {
            scale: 1,
            duration: 0.3,
            ease: "back.out(2)",
          },
        );
      }

      handleChange(markerValue);
      onValueCommitted?.(markerValue);
    },
    [handleChange, onValueCommitted, readOnly, disabled],
  );

  const shouldShowTooltip = React.useMemo(() => {
    if (tooltipMode === "never") return false;
    if (tooltipMode === "always") return true;
    if (tooltipMode === "hover") return isHovering;
    if (tooltipMode === "on-drag") return isDragging;
    return false;
  }, [tooltipMode, isHovering, isDragging]);

  const ariaProps = React.useMemo(() => {
    const ariaAttrs: Record<string, string | boolean | undefined> = {};

    if (label) ariaAttrs["aria-label"] = label;
    if (description) ariaAttrs["aria-describedby"] = description;
    if (required) ariaAttrs["aria-required"] = true;
    if (readOnly) ariaAttrs["aria-readonly"] = true;
    if (disabled) ariaAttrs["aria-disabled"] = true;

    ariaAttrs["aria-valuetext"] = getValueText(currentValue);
    ariaAttrs["aria-valuenow"] = currentValue.toString();
    ariaAttrs["aria-valuemin"] = min.toString();
    ariaAttrs["aria-valuemax"] = max.toString();

    return ariaAttrs;
  }, [
    label,
    description,
    required,
    readOnly,
    disabled,
    getValueText,
    currentValue,
    min,
    max,
  ]);

  const markersToRender = React.useMemo(() => {
    if (markers) return markers;
    if (showStepMarkers && step > 0) {
      const steps: Array<{ value: number; label?: string }> = [];
      for (let v = min; v <= max; v += step) {
        steps.push({ value: v });
      }
      return steps;
    }
    return [];
  }, [markers, showStepMarkers, step, min, max]);

  // Check if any marker has a label
  const hasMarkerLabels = markersToRender.some((m) => m.label);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly || disabled) return;

    switch (e.key) {
      case "Home":
        e.preventDefault();
        handleChange(min);
        break;
      case "End":
        e.preventDefault();
        handleChange(max);
        break;
      case "PageUp":
        e.preventDefault();
        handleChange(
          Math.min(currentValue + (props.largeStep || step * 10), max),
        );
        break;
      case "PageDown":
        e.preventDefault();
        handleChange(
          Math.max(currentValue - (props.largeStep || step * 10), min),
        );
        break;
    }
  };

  const sliderContent = (
    <div ref={sliderRef} className="w-full">
      {(label || description || error) && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {label && (
              <label className="text-sm font-medium">
                {label}
                {required && <span className="ms-1 text-destructive">*</span>}
              </label>
            )}
          </div>
          {(description || error) && (
            <p
              id={`${name || "slider"}-description`}
              className={cn(
                "text-xs",
                error ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {error || description}
            </p>
          )}
        </div>
      )}

      <div className="relative w-full">
        <SliderPrimitive.Root
          data-slot="slider"
          name={name}
          value={currentValue}
          onValueChange={handleChange}
          onValueCommitted={handleCommitted}
          min={min}
          max={max}
          step={step}
          className={cn(
            sliderVariants({ size, variant }),
            error && "[&_[data-slot=slider-range]]:!bg-destructive",
            className,
          )}
          disabled={disabled || readOnly}
          {...props}
        >
          <SliderPrimitive.Control
            className="relative flex w-full grow touch-none select-none items-center py-3"
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onKeyDown={handleKeyDown}
          >
            <SliderPrimitive.Track
              data-slot="slider-track"
              className="relative w-full rounded-full bg-muted select-none"
            >
              {/* Tick marks INSIDE the track */}
              {markersToRender.map((marker, index) => {
                const percent = ((marker.value - min) / (max - min)) * 100;
                const isActive = marker.value <= currentValue;
                const isFirst = index === 0;
                const isLast = index === markersToRender.length - 1;
                return (
                  <button
                    key={marker.value}
                    type="button"
                    className={cn(
                      "absolute top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150",
                      "size-1",
                      isActive
                        ? "bg-primary-foreground/80"
                        : "bg-muted-foreground/40",
                      !disabled &&
                        !readOnly &&
                        "cursor-pointer hover:scale-150",
                      disabled && "cursor-not-allowed",
                      isFirst && "ml-1",
                      isLast && "mr-1",
                    )}
                    style={{
                      left: `${isLast ? 99 : percent}%`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      animateToMarker(marker.value);
                    }}
                    disabled={disabled || readOnly}
                    aria-label={`Jump to ${marker.label || marker.value}`}
                    tabIndex={-1}
                  />
                );
              })}

              <SliderPrimitive.Indicator
                data-slot="slider-range"
                className="absolute h-full rounded-full select-none"
              />

              <SliderPrimitive.Thumb
                ref={thumbRef}
                data-slot="slider-thumb"
                index={0}
                className={cn(
                  "z-10 block rounded-full border-2 border-primary bg-white dark:bg-zinc-900 shadow-md select-none",
                  "hover:scale-110 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  (isHovering || isDragging) && "scale-110 shadow-lg",
                  error && "!border-destructive",
                )}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                {...ariaProps}
              >
                {(thumbIcon || thumbLabel) && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                    {thumbIcon ? (
                      <span className="flex items-center justify-center text-primary [&>svg]:size-3">
                        {thumbIcon}
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold leading-none text-primary">
                        {thumbLabel}
                      </span>
                    )}
                  </div>
                )}

                {shouldShowTooltip && (
                  <div
                    className={cn(
                      "absolute z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg",
                      tooltipPosition === "top" &&
                        "-top-10 left-1/2 -translate-x-1/2",
                      tooltipPosition === "bottom" &&
                        "left-1/2 top-full mt-2 -translate-x-1/2",
                    )}
                  >
                    {renderTooltip
                      ? renderTooltip(currentValue)
                      : formatValue(currentValue)}
                  </div>
                )}
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>

        {/* Marker labels BELOW the slider track */}
        {hasMarkerLabels && (
          <div className="relative mt-1 w-full">
            {markersToRender.map((marker, index) => {
              if (!marker.label) return null;
              const percent = ((marker.value - min) / (max - min)) * 100;
              const isActive = currentValue === marker.value;
              const isFirst = index === 0;
              const isLast = index === markersToRender.length - 1;
              return (
                <button
                  key={marker.value}
                  type="button"
                  className={cn(
                    "absolute -translate-x-1/2 text-[10px] transition-colors duration-150",
                    isActive
                      ? "font-semibold text-primary"
                      : "text-muted-foreground",
                    !disabled &&
                      !readOnly &&
                      "cursor-pointer hover:text-primary",
                    disabled && "cursor-not-allowed opacity-50",
                    isFirst && "ml-0.5",
                    isLast && "mr-0.5",
                  )}
                  style={{ left: `${percent}%` }}
                  onClick={() => animateToMarker(marker.value)}
                  disabled={disabled || readOnly}
                  tabIndex={-1}
                >
                  {marker.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showValue && (
        <div
          className={cn(
            "mt-2 text-sm font-medium tabular-nums text-muted-foreground",
            hasMarkerLabels && "mt-6",
          )}
        >
          {formatValue(currentValue)}
        </div>
      )}

      {isDragging && onValueCommitted && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Value changed to {getValueText(currentValue)}
        </div>
      )}
    </div>
  );

  if (dir) {
    return (
      <div dir={dir}>
        <DirectionProvider direction={dir}>{sliderContent}</DirectionProvider>
      </div>
    );
  }

  return sliderContent;
}

interface RangeSliderProps
  extends
    Omit<
      SliderPrimitive.Root.Props,
      "value" | "defaultValue" | "onValueChange" | "onValueCommitted"
    >,
    VariantProps<typeof sliderVariants> {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  onValueCommitted?: (value: [number, number]) => void;
  showValue?: boolean;
  showTooltip?: boolean;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;

  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;

  tooltipMode?: "always" | "hover" | "on-drag" | "never";
  tooltipPosition?: "top" | "bottom";

  markers?: Array<{ value: number; label?: string }>;
  showStepMarkers?: boolean;

  thumbLabels?: [string, string];
  thumbIcons?: [React.ReactNode, React.ReactNode];

  getValueText?: (value: [number, number]) => string;

  dir?: "ltr" | "rtl";

  name?: string;

  minStepsBetweenValues?: number;
}

function RangeSlider({
  className,
  size,
  variant,
  value,
  defaultValue = [25, 75],
  onValueChange,
  onValueCommitted,
  showValue = false,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => String(v),

  label,
  description,
  error,
  required = false,
  readOnly = false,

  tooltipMode = "on-drag",
  tooltipPosition = "top",

  markers,
  showStepMarkers = false,

  thumbLabels,
  thumbIcons,

  getValueText = (v) => `${v[0]} to ${v[1]}`,

  dir,

  name,
  disabled,
  minStepsBetweenValues,
  ...props
}: RangeSliderProps) {
  const [internalValue, setInternalValue] =
    React.useState<[number, number]>(defaultValue);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [activeThumb, setActiveThumb] = React.useState<0 | 1 | null>(null);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const thumb0Ref = React.useRef<HTMLDivElement>(null);
  const thumb1Ref = React.useRef<HTMLDivElement>(null);

  const currentValue = value ?? internalValue;

  const handleChange = React.useCallback(
    (newValue: number | readonly number[]) => {
      if (Array.isArray(newValue) && newValue.length === 2) {
        const val: [number, number] = [newValue[0], newValue[1]];
        setInternalValue(val);
        onValueChange?.(val);
      }
    },
    [onValueChange],
  );

  const handleCommitted = React.useCallback(
    (newValue: number | readonly number[]) => {
      if (Array.isArray(newValue) && newValue.length === 2) {
        const val: [number, number] = [newValue[0], newValue[1]];
        setInternalValue(val);
        onValueChange?.(val);
        onValueCommitted?.(val);
        setIsDragging(false);

        // GSAP animation on value committed
        const activeRef = activeThumb === 0 ? thumb0Ref : thumb1Ref;
        if (activeRef.current) {
          gsap.fromTo(
            activeRef.current,
            { scale: 1.1 },
            {
              scale: 1,
              duration: 0.2,
              ease: "power2.out",
            },
          );
        }
        setActiveThumb(null);
      }
    },
    [onValueChange, onValueCommitted, activeThumb],
  );

  const shouldShowTooltip = React.useMemo(() => {
    if (tooltipMode === "never") return false;
    if (tooltipMode === "always") return true;
    if (tooltipMode === "hover") return isHovering;
    if (tooltipMode === "on-drag") return isDragging;
    return false;
  }, [tooltipMode, isHovering, isDragging]);

  const markersToRender = React.useMemo(() => {
    if (markers) return markers;
    if (showStepMarkers && step > 0) {
      const steps: Array<{ value: number; label?: string }> = [];
      for (let v = min; v <= max; v += step) {
        steps.push({ value: v });
      }
      return steps;
    }
    return [];
  }, [markers, showStepMarkers, step, min, max]);

  // Check if any marker has a label
  const hasMarkerLabels = markersToRender.some((m) => m.label);

  const rangeSliderContent = (
    <div ref={sliderRef} className="w-full">
      {(label || description || error) && (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {label && (
              <label className="text-sm font-medium">
                {label}
                {required && <span className="ms-1 text-destructive">*</span>}
              </label>
            )}
          </div>
          {(description || error) && (
            <p
              id={`${name || "range-slider"}-description`}
              className={cn(
                "text-xs",
                error ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {error || description}
            </p>
          )}
        </div>
      )}

      <div className="relative w-full">
        <SliderPrimitive.Root
          data-slot="range-slider"
          name={name}
          value={currentValue}
          onValueChange={handleChange}
          onValueCommitted={handleCommitted}
          min={min}
          max={max}
          step={step}
          minStepsBetweenValues={minStepsBetweenValues}
          className={cn(
            sliderVariants({ size, variant }),
            error && "[&_[data-slot=slider-range]]:!bg-destructive",
            className,
          )}
          disabled={disabled || readOnly}
          {...props}
        >
          <SliderPrimitive.Control
            className="relative flex w-full grow touch-none select-none items-center py-3"
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
          >
            <SliderPrimitive.Track
              data-slot="slider-track"
              className="relative w-full rounded-full bg-muted select-none"
            >
              {/* Tick marks INSIDE the track */}
              {markersToRender.map((marker, index) => {
                const percent = ((marker.value - min) / (max - min)) * 100;
                const isFirst = index === 0;
                const isLast = index === markersToRender.length - 1;
                const isInRange =
                  marker.value >= currentValue[0] &&
                  marker.value <= currentValue[1];
                return (
                  <div
                    key={marker.value}
                    className={cn(
                      "absolute top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150",
                      "size-1.5",
                      isInRange
                        ? "bg-primary-foreground/80"
                        : "bg-muted-foreground/40",
                      isFirst && "ml-1",
                      isLast && "mr-1",
                    )}
                    style={{ left: `${isLast ? 99 : percent}%` }}
                    aria-hidden="true"
                  />
                );
              })}

              <SliderPrimitive.Indicator
                data-slot="slider-range"
                className="absolute h-full rounded-full select-none"
              />

              <SliderPrimitive.Thumb
                ref={thumb0Ref}
                data-slot="slider-thumb"
                className={cn(
                  "z-10 block rounded-full border-2 border-primary bg-white dark:bg-zinc-900 shadow-md select-none",
                  "transition-all duration-150 ease-out",
                  "hover:scale-110 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  (isHovering || isDragging) &&
                    activeThumb === 0 &&
                    "scale-110 shadow-lg",
                  error && "!border-destructive",
                )}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setActiveThumb(0);
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  if (!isDragging) setActiveThumb(null);
                }}
                onPointerDown={() => setActiveThumb(0)}
              >
                {(thumbIcons?.[0] || thumbLabels?.[0]) && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                    {thumbIcons?.[0] ? (
                      <span className="flex items-center justify-center text-primary [&>svg]:size-3">
                        {thumbIcons[0]}
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold leading-none text-primary">
                        {thumbLabels?.[0]}
                      </span>
                    )}
                  </div>
                )}

                {shouldShowTooltip &&
                  (activeThumb === 0 || activeThumb === null) && (
                    <div
                      className={cn(
                        "absolute z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg",
                        tooltipPosition === "top" &&
                          "-top-10 left-1/2 -translate-x-1/2",
                        tooltipPosition === "bottom" &&
                          "left-1/2 top-full mt-2 -translate-x-1/2",
                      )}
                    >
                      {formatValue(currentValue[0])}
                    </div>
                  )}
              </SliderPrimitive.Thumb>

              <SliderPrimitive.Thumb
                ref={thumb1Ref}
                data-slot="slider-thumb"
                className={cn(
                  "z-10 block rounded-full border-2 border-primary bg-white dark:bg-zinc-900 shadow-md select-none",
                  "transition-all duration-150 ease-out",
                  "hover:scale-110 hover:shadow-lg",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50",
                  (isHovering || isDragging) &&
                    activeThumb === 1 &&
                    "scale-110 shadow-lg",
                  error && "!border-destructive",
                )}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setActiveThumb(1);
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  if (!isDragging) setActiveThumb(null);
                }}
                onPointerDown={() => setActiveThumb(1)}
              >
                {(thumbIcons?.[1] || thumbLabels?.[1]) && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                    {thumbIcons?.[1] ? (
                      <span className="flex items-center justify-center text-primary [&>svg]:size-3">
                        {thumbIcons[1]}
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold leading-none text-primary">
                        {thumbLabels?.[1]}
                      </span>
                    )}
                  </div>
                )}

                {shouldShowTooltip &&
                  (activeThumb === 1 || activeThumb === null) && (
                    <div
                      className={cn(
                        "absolute z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg",
                        tooltipPosition === "top" &&
                          "-top-10 left-1/2 -translate-x-1/2",
                        tooltipPosition === "bottom" &&
                          "left-1/2 top-full mt-2 -translate-x-1/2",
                      )}
                    >
                      {formatValue(currentValue[1])}
                    </div>
                  )}
              </SliderPrimitive.Thumb>
            </SliderPrimitive.Track>
          </SliderPrimitive.Control>
        </SliderPrimitive.Root>

        {/* Marker labels BELOW the slider track */}
        {hasMarkerLabels && (
          <div className="relative mt-1 w-full">
            {markersToRender.map((marker) => {
              if (!marker.label) return null;
              const percent = ((marker.value - min) / (max - min)) * 100;
              const isInRange =
                marker.value >= currentValue[0] &&
                marker.value <= currentValue[1];
              return (
                <span
                  key={marker.value}
                  className={cn(
                    "absolute -translate-x-1/2 text-[10px] transition-colors duration-150",
                    isInRange
                      ? "font-semibold text-primary"
                      : "text-muted-foreground",
                  )}
                  style={{ left: `${percent}%` }}
                >
                  {marker.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {showValue && (
        <div
          className={cn(
            "mt-2 flex justify-between text-sm font-medium tabular-nums text-muted-foreground",
            hasMarkerLabels && "mt-6",
          )}
        >
          <span>{formatValue(currentValue[0])}</span>
          <span>{formatValue(currentValue[1])}</span>
        </div>
      )}

      {isDragging && onValueCommitted && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Range changed to {getValueText(currentValue)}
        </div>
      )}
    </div>
  );

  if (dir) {
    return (
      <div dir={dir}>
        <DirectionProvider direction={dir}>
          {rangeSliderContent}
        </DirectionProvider>
      </div>
    );
  }

  return rangeSliderContent;
}

export { Slider, RangeSlider, sliderVariants };
export type { SliderProps, RangeSliderProps };
