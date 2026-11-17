/* oxlint-disable react/only-export-components -- compound component exports are required by the public API */
"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NumericInput } from "@/components/ui/input";
import { isFunctionProp, isNumberProp } from "@/components/ui/prop-guards";

// Track cross-axis size flows through a CSS var so the vertical orientation
// can swap width/height without fighting arbitrary-variant selectors.
const sliderVariants = cva(
  "relative flex w-full select-none flex-col data-[disabled]:pointer-events-none data-[disabled]:opacity-50 motion-reduce:**:transition-none motion-reduce:**:animate-none",
  {
    variants: {
      size: {
        sm: "[--kira-track-w:0.375rem] [&_[data-slot=slider-thumb]]:size-3.5",
        default: "[--kira-track-w:0.5rem] [&_[data-slot=slider-thumb]]:size-5",
        lg: "[--kira-track-w:0.75rem] [&_[data-slot=slider-thumb]]:size-6",
      },
      variant: {
        default: "[&_[data-slot=slider-range]]:bg-primary",
        gradient:
          "[&_[data-slot=slider-range]]:bg-linear-to-r [&_[data-slot=slider-range]]:from-primary [&_[data-slot=slider-range]]:to-info",
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

type TooltipMode = "always" | "hover" | "on-drag" | "never";

type TooltipPosition = "top" | "bottom";

type SliderOrientation = "horizontal" | "vertical";

export interface SliderMarker {
  value: number;
  label?: string;
}

const EPS = 1e-9;
const MAX_STEP_MARKERS = 50;

const THUMB_CLASSES =
  "z-10 block rounded-full border-2 border-primary bg-background shadow-md select-none before:absolute before:left-1/2 before:top-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 " +
  "transition-[inset-inline-start,bottom,translate,scale,box-shadow] duration-150 ease-out hover:scale-110 hover:shadow-lg " +
  "data-[dragging]:scale-110 data-[dragging]:shadow-lg " +
  "data-[focused]:scale-110 data-[focused]:shadow-lg " +
  "focus-visible:outline-none data-[focused]:ring-[3px] data-[focused]:ring-ring/50 group/thumb";

function toPercent(value: number, min: number, max: number): number {
  const range = max - min;

  if (Number.isNaN(range) || range <= 0) return 0;

  return ((value - min) / range) * 100;
}

function clampValue(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function close(left: number, right: number): boolean {
  return Math.abs(left - right) < EPS;
}

function firstValue(next: number | readonly number[]): number {
  return isNumberProp(next) ? next : (next[0] ?? 0);
}

/* Steps animation only when one stop is visibly discrete: rendered dots, or a
 * step ≥ 1/40 of the range. Finer quantization must still track the pointer 1:1. */
function isStepped(
  markersToRender: SliderMarker[],
  step: number,
  min: number,
  max: number,
): boolean {
  if (markersToRender.length > 0) return true;
  const range = max - min;

  return step > 0 && range > 0 && step / range >= 1 / 40;
}

/* Continuous sliders: no transition while dragging (thumb tracks the pointer 1:1).
 * Stepped sliders (stepOptions/markers/showStepMarkers): the value snaps between
 * stops anyway, so the 150ms ease between snaps IS the steps animation. */
function thumbClasses(error?: string, stepped?: boolean): string {
  return cn(
    THUMB_CLASSES,
    { "data-[dragging]:transition-none": !stepped },
    "motion-reduce:transition-none",
    { "border-destructive!": error },
  );
}

/** Snap a raw value to the nearest step option (used live, so the thumb jumps between allowed stops). */
function snapToStepOption(
  stepOptions: readonly number[] | undefined,
  value: number,
  current?: number,
): number {
  if (!stepOptions || stepOptions.length === 0) return value;

  if (current != null && value !== current) {
    const resolveValue1 = () =>
      sliderResolveValue1(candidates, forward, current);

    const forward = value > current;

    const candidates = stepOptions.filter((option) =>
      forward ? option > current + EPS : option < current - EPS,
    );

    return resolveValue1();
  }

  let best = value;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const option of stepOptions) {
    const distance = Math.abs(option - value);

    if (distance < bestDistance) {
      bestDistance = distance;
      best = option;
    }
  }

  return best;
}

/* Auto dots skip the min/max endpoints: the track edges already read as bounds. */
function trimEndpoints(
  list: SliderMarker[],
  min: number,
  max: number,
): SliderMarker[] {
  return list.filter(
    (marker) => marker.value - min > EPS && max - marker.value > EPS,
  );
}

function buildMarkers(
  markers: SliderMarker[] | undefined,
  showStepMarkers: boolean,
  stepOptions: readonly number[] | undefined,
  min: number,
  max: number,
  step: number,
): SliderMarker[] {
  if (markers) {
    return markers;
  }

  if (stepOptions && stepOptions.length > 0) {
    return trimEndpoints(
      stepOptions.map((value) => ({ value })),
      min,
      max,
    );
  }

  if (!showStepMarkers || Number.isNaN(step) || step <= 0) {
    return [];
  }

  const count = Math.floor((max - min) / step + EPS) + 1;
  let auto: SliderMarker[];

  if (count > MAX_STEP_MARKERS) {
    // Ellipsis dots, not a wall of them: sample evenly across the range.
    const stride = (max - min) / MAX_STEP_MARKERS;
    auto = Array.from({ length: MAX_STEP_MARKERS + 1 }, (_, i) => ({
      value: min + i * stride,
    }));
  } else {
    auto = Array.from({ length: count }, (_, i) => ({ value: min + i * step }));
  }

  return trimEndpoints(auto, min, max);
}

function SliderHeader({
  label,
  description,
  error,
  required,
  descriptionId,
}: {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  descriptionId?: string;
}) {
  if (!label && !description && !error) return null;

  return (
    <SliderHeaderView
      label={label}
      required={required}
      description={description}
      error={error}
      descriptionId={descriptionId}
    />
  );
}

function ThumbDecor({ icon, text }: { icon?: React.ReactNode; text?: string }) {
  if (!icon && !text) return null;

  return (
    <span
      data-slot="slider-thumb-decor"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-full"
    >
      {icon ?? (
        <span className="text-[8px] font-bold leading-none text-primary">
          {text}
        </span>
      )}
    </span>
  );
}

/* Tooltip bubble: visibility is pure CSS off the thumb's native
 * data-dragging / data-focused / hover state — no mirror state to desync.
 * Vertical sliders pin the bubble to the end side (tooltipPosition ignored). */
function ThumbBubble({
  mode,
  position,
  vertical,
  children,
}: {
  mode: TooltipMode;
  position: TooltipPosition;
  vertical?: boolean;
  children: React.ReactNode;
}) {
  const resolveDynamic2 = () => sliderResolveDynamic2(mode);

  if (mode === "never") return null;

  const dynamic = resolveDynamic2();

  const placement = vertical
    ? "left-full top-1/2 ml-2 -translate-y-1/2"
    : cn(
        "left-1/2 -translate-x-1/2",
        position === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
      );

  return (
    <span
      data-slot="slider-tooltip"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-lg opacity-0 transition-opacity duration-100",
        placement,
        dynamic,
      )}
    >
      {children}
    </span>
  );
}

function SliderDots({
  markers,
  min,
  max,
  vertical,
  flipValue,
  isActive,
  onJump,
  interactive,
}: {
  markers: SliderMarker[];
  min: number;
  max: number;
  vertical?: boolean;
  flipValue: (value: number) => number;
  isActive: (value: number) => boolean;
  onJump?: (value: number) => void;
  interactive?: boolean;
}) {
  if (markers.length === 0) return null;

  const dot =
    "absolute z-1 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150";

  const axis = vertical ? "bottom" : "left";
  const cross = vertical ? "left-1/2" : "top-1/2";

  return (
    <>
      {markers.map((marker) =>
        interactive ? (
          <button
            key={marker.value}
            type="button"
            tabIndex={-1}
            aria-label={`Jump to ${marker.label ?? marker.value}`}
            data-slot="slider-marker"
            className={cn(
              dot,
              cross,
              "cursor-pointer hover:scale-150 before:absolute before:left-1/2 before:top-1/2 before:size-6 before:-translate-x-1/2 before:-translate-y-1/2 motion-reduce:transition-none",
              isActive(marker.value)
                ? "bg-primary-foreground/80"
                : "bg-muted-foreground/40",
            )}
            style={{
              [axis]: `${toPercent(flipValue(marker.value), min, max)}%`,
            }}
            onClick={(event) => {
              event.stopPropagation();
              onJump?.(marker.value);
            }}
          />
        ) : (
          <span
            key={marker.value}
            aria-hidden="true"
            className={cn(
              dot,
              cross,
              isActive(marker.value)
                ? "bg-primary-foreground/80"
                : "bg-muted-foreground/40",
            )}
            style={{
              [axis]: `${toPercent(flipValue(marker.value), min, max)}%`,
            }}
          />
        ),
      )}
    </>
  );
}

/* Marker labels are horizontal-only: a vertical label column beside the track
 * is a known gap, not silently broken output. */
function SliderMarkerLabels({
  markers,
  min,
  max,
  vertical,
  flipValue,
  isActive,
  onJump,
  interactive,
}: {
  markers: SliderMarker[];
  min: number;
  max: number;
  vertical?: boolean;
  flipValue: (value: number) => number;
  isActive: (value: number) => boolean;
  onJump?: (value: number) => void;
  interactive?: boolean;
}) {
  if (vertical) return null;
  const labeled = markers.filter((marker) => marker.label != null);

  if (labeled.length === 0) return null;

  const item =
    "absolute -translate-x-1/2 text-[10px] transition-colors duration-150";

  return (
    <div data-slot="slider-marker-labels" className="relative mt-1 h-6 w-full">
      {labeled.map((marker) =>
        interactive ? (
          <button
            key={marker.value}
            type="button"
            tabIndex={-1}
            data-slot="slider-marker-label"
            className={cn(
              item,
              "min-h-6 min-w-6 cursor-pointer hover:text-primary motion-reduce:transition-none",
              isActive(marker.value)
                ? "font-semibold text-primary"
                : "text-muted-foreground",
            )}
            style={{
              left: `${toPercent(flipValue(marker.value), min, max)}%`,
            }}
            onClick={() => onJump?.(marker.value)}
          >
            {marker.label}
          </button>
        ) : (
          <span
            key={marker.value}
            aria-hidden="true"
            className={cn(
              item,
              isActive(marker.value)
                ? "font-semibold text-primary"
                : "text-muted-foreground",
            )}
            style={{
              left: `${toPercent(flipValue(marker.value), min, max)}%`,
            }}
          >
            {marker.label}
          </span>
        ),
      )}
    </div>
  );
}

export interface SliderProps
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
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  tooltipMode?: TooltipMode;
  tooltipPosition?: TooltipPosition;
  renderTooltip?: (value: number) => React.ReactNode;
  markers?: SliderMarker[];
  showStepMarkers?: boolean;
  /** Discrete allowed values — the live value snaps to the nearest option and dots render automatically. */
  stepOptions?: number[];
  thumbLabel?: string;
  thumbIcon?: React.ReactNode;
  formatValue?: (value: number) => string;
  getValueText?: (value: number) => string;
  /** Flip the scale: min renders at the end edge (visually right in LTR). */
  inverted?: boolean;
}

/* Single-thumb track area: dots + indicator + thumb. */
function SliderControlArea({
  markersToRender,
  min,
  max,
  orientation,
  flipValue,
  isActive,
  onJump,
  interactive,
  error,
  descriptionId,
  thumbRef,
  thumbIcon,
  thumbLabel,
  tooltipMode,
  tooltipPosition,
  bubble,
  getValueText,
  stepped,
}: SliderControlAreaParams) {
  const vertical = orientation === "vertical";

  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={
        vertical
          ? "relative flex h-40 w-6 touch-none select-none flex-col items-center justify-center"
          : "relative flex w-full grow touch-none select-none items-center py-3"
      }
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={
          vertical
            ? "relative h-full w-(--kira-track-w) rounded-full bg-muted select-none"
            : "relative h-(--kira-track-w) w-full rounded-full bg-muted select-none"
        }
      >
        <SliderDots
          markers={markersToRender}
          min={min}
          max={max}
          vertical={vertical}
          flipValue={flipValue}
          isActive={isActive}
          onJump={onJump}
          interactive={interactive}
        />
        <SliderPrimitive.Indicator
          data-slot="slider-range"
          className={cn(
            "absolute h-full rounded-full select-none",
            "transition-[width,height,bottom,inset-inline-start] duration-150 ease-out",
            { "[[data-dragging]>&]:transition-none": !stepped },
            "motion-reduce:transition-none",
          )}
        />
        <SliderPrimitive.Thumb
          ref={thumbRef}
          data-slot="slider-thumb"
          index={0}
          className={thumbClasses(error, stepped)}
          aria-describedby={descriptionId}
          getAriaValueText={(_, v) => getValueText(flipValue(v))}
        >
          <ThumbDecor icon={thumbIcon} text={thumbLabel} />
          <ThumbBubble
            mode={tooltipMode}
            position={tooltipPosition}
            vertical={vertical}
          >
            {bubble}
          </ThumbBubble>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Track>
    </SliderPrimitive.Control>
  );
}

function Slider(arg0: SliderProps) {
  const model = useSliderModel(arg0);

  return <SliderView {...model} />;
}

export interface RangeSliderProps
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
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
  tooltipMode?: TooltipMode;
  tooltipPosition?: TooltipPosition;
  markers?: SliderMarker[];
  showStepMarkers?: boolean;
  /** Discrete allowed values — both thumbs snap to the nearest option. */
  stepOptions?: number[];
  thumbLabels?: [string, string];
  thumbIcons?: [React.ReactNode, React.ReactNode];
  formatValue?: (value: number) => string;
  /** Flip the scale: min renders at the end edge (visually right in LTR). */
  inverted?: boolean;
}

function rootClassName(
  size: VariantProps<typeof sliderVariants>["size"],
  variant: VariantProps<typeof sliderVariants>["variant"],
  error?: string,
  readOnly?: boolean,
  className?: SliderPrimitive.Root.Props["className"],
): SliderPrimitive.Root.Props["className"] {
  const base = cn(
    sliderVariants({ size, variant }),
    // bg-none! so the error color also wins over the gradient variant's image.
    {
      "**:data-[slot=slider-range]:bg-destructive! **:data-[slot=slider-range]:bg-none!":
        error,
    },
    { "**:cursor-not-allowed": readOnly },
  );

  return isFunctionProp(className)
    ? (state) => cn(base, className(state))
    : cn(base, className);
}

/* Shared change/commit wiring: uncontrolled mirror, readOnly pin. */
function useValueCallbacks<T>({
  readOnly,
  externalValue,
  commit,
  onValueChange,
  onValueCommitted,
}: {
  readOnly?: boolean;
  externalValue?: T;
  commit: (next: T) => void;
  onValueChange?: (value: T) => void;
  onValueCommitted?: (value: T) => void;
}) {
  const handleChange = React.useCallback(
    (nextValue: T) => {
      if (readOnly) return; // readOnly pins the value; the prop snaps it back

      if (externalValue === undefined) commit(nextValue);
      onValueChange?.(nextValue);
    },
    [readOnly, externalValue, commit, onValueChange],
  );

  const handleCommitted = React.useCallback(
    (nextValue: T) => {
      if (readOnly) return;
      onValueCommitted?.(nextValue);
    },
    [readOnly, onValueCommitted],
  );

  return { handleChange, handleCommitted };
}

function rangeThumbAriaLabel(
  label: string | undefined,
  thumbLabels: [string, string] | undefined,
  index: number,
  inverted: boolean,
): string {
  // Inverted: visual thumb 0 holds the high value, so the default min/max
  // roles swap (custom thumbLabels stay positional — they ride the thumb).
  const role =
    thumbLabels?.[index] ??
    (() => {
      const low = index === 0 ? "minimum" : "maximum";
      const high = index === 0 ? "maximum" : "minimum";

      return inverted ? high : low;
    })();

  return label ? `${label} (${role})` : role;
}

function toTuple(next: number | readonly number[]): [number, number] {
  const first = isNumberProp(next) ? next : (next[0] ?? 0);
  const second = isNumberProp(next) ? next : (next[1] ?? first);

  return [first, second];
}

/* Two-thumb track area: dots + indicator + both thumbs. */
// oxlint-disable-next-line eslint/max-lines-per-function -- The pure Base UI track renderer keeps the two indexed thumbs, markers and shared tooltip slots together.
function RangeControlArea({
  markersToRender,
  min,
  max,
  orientation,
  flipValue,
  inverted,
  inRange,
  error,
  descriptionId,
  thumbRefs,
  label,
  thumbLabels,
  thumbIcons,
  tooltipMode,
  tooltipPosition,
  bubbles,
  formatValue,
  stepped,
}: RangeControlAreaParams) {
  const vertical = orientation === "vertical";

  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={
        vertical
          ? "relative flex h-40 w-6 touch-none select-none flex-col items-center justify-center"
          : "relative flex w-full grow touch-none select-none items-center py-3"
      }
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={
          vertical
            ? "relative h-full w-(--kira-track-w) rounded-full bg-muted select-none"
            : "relative h-(--kira-track-w) w-full rounded-full bg-muted select-none"
        }
      >
        <SliderDots
          markers={markersToRender}
          min={min}
          max={max}
          vertical={vertical}
          flipValue={flipValue}
          isActive={inRange}
        />
        <SliderPrimitive.Indicator
          data-slot="slider-range"
          className={cn(
            "absolute h-full rounded-full select-none",
            "transition-[width,height,bottom,inset-inline-start] duration-150 ease-out",
            { "[[data-dragging]>&]:transition-none": !stepped },
            "motion-reduce:transition-none",
          )}
        />
        {([0, 1] as const).map((index) => (
          <SliderPrimitive.Thumb
            key={index}
            ref={thumbRefs[index]}
            data-slot="slider-thumb"
            index={index}
            className={thumbClasses(error, stepped)}
            aria-describedby={descriptionId}
            getAriaLabel={(i) =>
              rangeThumbAriaLabel(label, thumbLabels, i, inverted)
            }
            getAriaValueText={(_, v) => formatValue(flipValue(v))}
          >
            <ThumbDecor
              icon={thumbIcons?.[index]}
              text={thumbLabels?.[index]}
            />
            <ThumbBubble
              mode={tooltipMode}
              position={tooltipPosition}
              vertical={vertical}
            >
              {bubbles[index]}
            </ThumbBubble>
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Track>
    </SliderPrimitive.Control>
  );
}

function RangeSlider(arg0: RangeSliderProps) {
  const model = useRangeSliderModel(arg0);

  return <RangeSliderView {...model} />;
}

/* Focus proxy for a disabled slider (Base UI's documented pattern for
 * tooltips on disabled controls): the span is hit-tested where the disabled
 * control is not, and Tab reaches it so keyboard users can read the reason. */
function SliderDisabledReason({
  reason,
  children,
}: {
  reason: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            data-slot="slider-reason-anchor"
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Base UI disabled-control tooltips require a focusable span proxy so keyboard users can read the reason.
            tabIndex={0}
            aria-disabled
            aria-label={reason}
            className="block w-full cursor-not-allowed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="top">{reason}</TooltipContent>
    </Tooltip>
  );
}

export interface KiraSliderProps extends SliderProps {
  /** Explanation shown in a keyboard-reachable tooltip when `disabled` is set. */
  disabledReason?: string;
}

/* Kira mega: single slider + disabledReason tooltip (§3.5). */
function KiraSlider({ disabled, disabledReason, ...props }: KiraSliderProps) {
  if (disabled && disabledReason) {
    return (
      <SliderDisabledReason reason={disabledReason}>
        <Slider disabled={disabled} {...props} />
      </SliderDisabledReason>
    );
  }

  return <Slider disabled={disabled} {...props} />;
}

export interface KiraRangeSliderProps extends RangeSliderProps {
  /** From/To number fields under the track (§3.5). */
  showInputs?: boolean;
  /** Explanation shown in a keyboard-reachable tooltip when `disabled` is set. */
  disabledReason?: string;
}

/* Kira mega: range slider + From/To NumberField inputs (§3.5). */
function KiraRangeSlider(arg0: KiraRangeSliderProps) {
  const model = useKiraRangeSliderModel(arg0);

  return <KiraRangeSliderView {...model} />;
}

export { Slider, RangeSlider, KiraSlider, KiraRangeSlider, sliderVariants };

function resolveSliderOptions(
  options: Pick<
    SliderProps,
    | "defaultValue"
    | "showValue"
    | "required"
    | "readOnly"
    | "tooltipMode"
    | "tooltipPosition"
  >,
) {
  return resolveSliderDisplayOptions(options, 0);
}

function resolveSliderOptions2({
  showStepMarkers = false,
  formatValue = (v) => String(v),
  getValueText = (v) => String(v),
  inverted = false,
  min = 0,
  max = 100,
}: {
  showStepMarkers?: SliderProps["showStepMarkers"];
  formatValue?: SliderProps["formatValue"];
  getValueText?: SliderProps["getValueText"];
  inverted?: SliderProps["inverted"];
  min?: SliderProps["min"];
  max?: SliderProps["max"];
}) {
  return { showStepMarkers, formatValue, getValueText, inverted, min, max };
}

function resolveSliderOptions3({ step = 1 }: { step?: SliderProps["step"] }) {
  return { step };
}

function resolveRangeSliderOptions(
  options: Pick<
    RangeSliderProps,
    | "defaultValue"
    | "showValue"
    | "required"
    | "readOnly"
    | "tooltipMode"
    | "tooltipPosition"
  >,
) {
  const fallback: [number, number] = [25, 75];

  return resolveSliderDisplayOptions(options, fallback);
}

function resolveRangeSliderOptions2({
  showStepMarkers = false,
  formatValue = (v) => String(v),
  inverted = false,
  min = 0,
  max = 100,
  step = 1,
}: {
  showStepMarkers?: RangeSliderProps["showStepMarkers"];
  formatValue?: RangeSliderProps["formatValue"];
  inverted?: RangeSliderProps["inverted"];
  min?: RangeSliderProps["min"];
  max?: RangeSliderProps["max"];
  step?: RangeSliderProps["step"];
}) {
  return { showStepMarkers, formatValue, inverted, min, max, step };
}

function resolveKiraRangeSliderOptions({
  showInputs = true,
  readOnly = false,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (v) => String(v),
}: {
  showInputs?: KiraRangeSliderProps["showInputs"];
  readOnly?: KiraRangeSliderProps["readOnly"];
  min?: KiraRangeSliderProps["min"];
  max?: KiraRangeSliderProps["max"];
  step?: KiraRangeSliderProps["step"];
  formatValue?: KiraRangeSliderProps["formatValue"];
}) {
  return { showInputs, readOnly, min, max, step, formatValue };
}

function SliderHeaderView({
  label,
  required,
  description,
  error,
  descriptionId,
}: {
  label: string | undefined;
  required: boolean | undefined;
  description: string | undefined;
  error: string | undefined;
  descriptionId: string | undefined;
}) {
  return (
    <div
      data-slot="slider-header"
      className="mb-3 flex w-full items-start justify-between gap-3"
    >
      {label && (
        <SliderPrimitive.Label
          data-slot="slider-label"
          render={<label>{label}</label>}
          className="text-sm font-medium wrap-anywhere"
        >
          {label}
          {required && <span className="ms-1 text-destructive">*</span>}
        </SliderPrimitive.Label>
      )}
      {(description || error) && (
        <p
          id={descriptionId}
          data-slot="slider-description"
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {error ?? description}
        </p>
      )}
    </div>
  );
}

type SingleSliderOptions = ReturnType<typeof useSliderOptions> &
  ReturnType<typeof useSliderOptions2> &
  ReturnType<typeof useSliderOptions3>;

function useSliderModel(input: SliderProps) {
  const display = useSliderOptions(input);
  const scale = useSliderOptions2(input);
  const increment = useSliderOptions3(input);
  const options = { ...display, ...scale, ...increment };
  const control = useSingleSliderControl(input, options);

  return { ...sliderPresentationProps(input), ...options, ...control };
}

function useSingleSliderControl(
  input: SliderProps,
  options: SingleSliderOptions,
) {
  const { min, max, inverted, readOnly } = options;
  const [internal, setInternal] = React.useState(options.defaultValue);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const autoId = React.useId();

  const descriptionId =
    input.description || input.error ? `${autoId}-description` : undefined;

  const stepOptions = validSliderOptions(input.stepOptions, min, max);

  const current = snapToStepOption(
    stepOptions,
    clampValue(input.value ?? internal, min, max),
  );

  const vertical = input.orientation === "vertical";

  // The same involution maps external values to Base UI values and back.
  const flipValue = React.useCallback(
    (value: number) => (inverted ? min + max - value : value),
    [inverted, min, max],
  );

  const markers = useSliderMarkerModel(input.markers, stepOptions, options);

  const setInternalValue = React.useCallback(
    (next: number) => setInternal(next),
    [setInternal],
  );

  const callbacks = useValueCallbacks({
    readOnly,
    externalValue: input.value,
    commit: setInternalValue,
    onValueChange: input.onValueChange,
    onValueCommitted: input.onValueCommitted,
  });

  const actions = useSliderActions({
    readOnly,
    stepOptions,
    flipValue,
    current,
    ...callbacks,
    disabled: input.disabled,
  });

  return {
    ...markers,
    ...actions,
    current,
    flipValue,
    vertical,
    thumbRef,
    descriptionId,
    interactive: !readOnly && !input.disabled,
  };
}

function validSliderOptions(
  options: number[] | undefined,
  min: number,
  max: number,
) {
  return options?.filter(
    (option) => Number.isFinite(option) && option >= min && option <= max,
  );
}

function useSliderMarkerModel(
  markers: SliderMarker[] | undefined,
  stepOptions: number[] | undefined,
  {
    showStepMarkers,
    min,
    max,
    step,
  }: Pick<SingleSliderOptions, "showStepMarkers" | "min" | "max" | "step">,
) {
  const markersToRender = React.useMemo(
    () => buildMarkers(markers, showStepMarkers, stepOptions, min, max, step),
    [markers, showStepMarkers, stepOptions, min, max, step],
  );

  return {
    markersToRender,
    stepped: isStepped(markersToRender, step, min, max),
  };
}

function sliderPresentationProps({
  className,
  size,
  variant,
  value: _value,
  defaultValue: _defaultValue,
  onValueChange: _onValueChange,
  onValueCommitted: _onValueCommitted,
  showValue: _showValue,
  label,
  description,
  error,
  required: _required,
  readOnly: _readOnly,
  tooltipMode: _tooltipMode,
  tooltipPosition: _tooltipPosition,
  renderTooltip,
  markers: _markers,
  showStepMarkers: _showStepMarkers,
  stepOptions: _stepOptions,
  thumbLabel,
  thumbIcon,
  formatValue: _formatValue,
  getValueText: _getValueText,
  inverted: _inverted,
  min: _min,
  max: _max,
  step: _step,
  disabled,
  orientation,
  ...props
}: SliderProps) {
  return {
    className,
    size,
    variant,
    label,
    description,
    error,
    renderTooltip,
    thumbLabel,
    thumbIcon,
    disabled,
    orientation,
    props,
  };
}

function SliderView({
  size,
  variant,
  error,
  readOnly,
  className,
  flipValue,
  current,
  handleChangeWrapped,
  handleCommittedWrapped,
  disabled,
  min,
  max,
  step,
  orientation,
  props,
  label,
  description,
  required,
  descriptionId,
  markersToRender,
  onJump,
  interactive,
  thumbRef,
  thumbIcon,
  thumbLabel,
  tooltipMode,
  tooltipPosition,
  renderTooltip,
  formatValue,
  getValueText,
  stepped,
  vertical,
  showValue,
}: ReturnType<typeof useSliderModel>) {
  return (
    <SliderView2
      size={size}
      variant={variant}
      error={error}
      readOnly={readOnly}
      className={className}
      flipValue={flipValue}
      current={current}
      handleChangeWrapped={handleChangeWrapped}
      handleCommittedWrapped={handleCommittedWrapped}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      props={props}
      label={label}
      description={description}
      required={required}
      descriptionId={descriptionId}
      markersToRender={markersToRender}
      onJump={onJump}
      interactive={interactive}
      thumbRef={thumbRef}
      thumbIcon={thumbIcon}
      thumbLabel={thumbLabel}
      tooltipMode={tooltipMode}
      tooltipPosition={tooltipPosition}
      renderTooltip={renderTooltip}
      formatValue={formatValue}
      getValueText={getValueText}
      stepped={stepped}
      vertical={vertical}
      showValue={showValue}
    />
  );
}

type RangeSliderOptions = ReturnType<typeof useRangeSliderOptions> &
  ReturnType<typeof useRangeSliderOptions2>;

function useRangeSliderModel(input: RangeSliderProps) {
  const display = useRangeSliderOptions(input);
  const scale = useRangeSliderOptions2(input);
  const options = { ...display, ...scale };
  const control = useRangeSliderControl(input, options);

  return { ...rangeSliderPresentationProps(input), ...options, ...control };
}

function useRangeThumbRefs() {
  const first = React.useRef<HTMLDivElement>(null);
  const second = React.useRef<HTMLDivElement>(null);

  return React.useMemo(() => [first, second] as const, [first, second]);
}

function useRangeSliderControl(
  input: RangeSliderProps,
  options: RangeSliderOptions,
) {
  const { min, max, inverted, readOnly } = options;

  const [internal, setInternal] = React.useState<[number, number]>(
    options.defaultValue,
  );

  const thumbRefs = useRangeThumbRefs();
  const autoId = React.useId();

  const descriptionId =
    input.description || input.error ? `${autoId}-description` : undefined;

  const stepOptions = validSliderOptions(input.stepOptions, min, max);

  const current = normalizeRangeValues(
    input.value ?? internal,
    stepOptions,
    min,
    max,
  );

  const vertical = input.orientation === "vertical";

  const flipValue = React.useCallback(
    (value: number) => (inverted ? min + max - value : value),
    [inverted, min, max],
  );

  // Inverted thumb order is the reverse of the sorted public pair.
  const flipTuple = React.useCallback(
    (tuple: [number, number]): [number, number] =>
      inverted ? [flipValue(tuple[1]), flipValue(tuple[0])] : tuple,
    [inverted, flipValue],
  );

  const markers = useSliderMarkerModel(input.markers, stepOptions, options);

  const setInternalValue = React.useCallback(
    (next: [number, number]) => setInternal(next),
    [setInternal],
  );

  const callbacks = useValueCallbacks({
    readOnly,
    externalValue: input.value,
    commit: setInternalValue,
    onValueChange: input.onValueChange,
    onValueCommitted: input.onValueCommitted,
  });

  const actions = useRangeSliderActions({
    readOnly,
    stepOptions,
    current,
    inverted,
    flipTuple,
    ...callbacks,
  });

  const inRange = (value: number) =>
    value >= current[0] - EPS && value <= current[1] + EPS;

  return {
    ...markers,
    ...actions,
    current,
    flipValue,
    flipTuple,
    vertical,
    thumbRefs,
    descriptionId,
    inRange,
  };
}

type RangeSliderActions = {
  readOnly: boolean;
  stepOptions: number[] | undefined;
  current: [number, number];
  inverted: boolean;
  flipTuple: (tuple: [number, number]) => [number, number];
  handleChange: (tuple: [number, number]) => void;
  handleCommitted: (tuple: [number, number]) => void;
};

function snapRangeSliderChange(
  next: number | readonly number[],
  details: SliderPrimitive.Root.ChangeEventDetails,
  { flipTuple, stepOptions, current, inverted }: RangeSliderActions,
): [number, number] {
  const raw = flipTuple(toTuple(next));
  const key = "key" in details.event ? details.event.key : null;

  const adjacent =
    details.reason === "keyboard" && key !== "Home" && key !== "End";

  const active = inverted
    ? 1 - details.activeThumbIndex
    : details.activeThumbIndex;

  const snapped: [number, number] = [
    snapToStepOption(stepOptions, raw[0]),
    snapToStepOption(stepOptions, raw[1]),
  ];

  if (adjacent && (active === 0 || active === 1)) {
    snapped[active] = snapToStepOption(
      stepOptions,
      raw[active],
      current[active],
    );
    snapped[active] =
      active === 0
        ? Math.min(snapped[active], current[1])
        : Math.max(snapped[active], current[0]);
  }

  return snapped;
}

function useRangeSliderActions(options: RangeSliderActions) {
  const { readOnly, current, handleChange, handleCommitted } = options;
  const latest = React.useRef<[number, number] | null>(null);

  const handleChangeWrapped = (
    next: number | readonly number[],
    details: SliderPrimitive.Root.ChangeEventDetails,
  ) => {
    if (readOnly) {
      details.cancel();

      return;
    }

    const snapped = snapRangeSliderChange(next, details, options);

    if (close(snapped[0], current[0]) && close(snapped[1], current[1])) {
      details.cancel();

      return;
    }

    latest.current = snapped;
    handleChange(snapped);
  };

  const handleCommittedWrapped = React.useCallback(() => {
    if (latest.current == null) return;
    const committed = latest.current;
    latest.current = null;
    handleCommitted(committed);
  }, [handleCommitted]);

  return { handleChangeWrapped, handleCommittedWrapped };
}

function rangeSliderPresentationProps({
  className,
  size,
  variant,
  value: _value,
  defaultValue: _defaultValue,
  onValueChange: _onValueChange,
  onValueCommitted: _onValueCommitted,
  showValue: _showValue,
  label,
  description,
  error,
  required: _required,
  readOnly: _readOnly,
  tooltipMode: _tooltipMode,
  tooltipPosition: _tooltipPosition,
  markers: _markers,
  showStepMarkers: _showStepMarkers,
  stepOptions: _stepOptions,
  thumbLabels,
  thumbIcons,
  formatValue: _formatValue,
  inverted: _inverted,
  min: _min,
  max: _max,
  step: _step,
  disabled,
  orientation,
  ...props
}: RangeSliderProps) {
  return {
    className,
    size,
    variant,
    label,
    description,
    error,
    thumbLabels,
    thumbIcons,
    disabled,
    orientation,
    props,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function RangeSliderView({
  size,
  variant,
  error,
  readOnly,
  className,
  flipTuple,
  current,
  handleChangeWrapped,
  handleCommittedWrapped,
  disabled,
  min,
  max,
  step,
  orientation,
  props,
  label,
  description,
  required,
  descriptionId,
  markersToRender,
  flipValue,
  inverted,
  inRange,
  thumbRefs,
  thumbLabels,
  thumbIcons,
  tooltipMode,
  tooltipPosition,
  formatValue,
  stepped,
  vertical,
  showValue,
}: ReturnType<typeof useRangeSliderModel>) {
  return (
    <SliderPrimitive.Root
      className={rootClassName(size, variant, error, readOnly, className)}
      data-slot="range-slider"
      data-readonly={readOnly || undefined}
      thumbCollisionBehavior="none"
      value={flipTuple(current)}
      onValueChange={handleChangeWrapped}
      onValueCommitted={handleCommittedWrapped}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      {...props}
    >
      <SliderHeader
        label={label}
        description={description}
        error={error}
        required={required}
        descriptionId={descriptionId}
      />
      <RangeControlArea
        markersToRender={markersToRender}
        min={min}
        max={max}
        orientation={orientation ?? "horizontal"}
        flipValue={flipValue}
        inverted={inverted}
        inRange={inRange}
        error={error}
        descriptionId={descriptionId}
        thumbRefs={thumbRefs}
        label={label}
        thumbLabels={thumbLabels}
        thumbIcons={thumbIcons}
        tooltipMode={tooltipMode}
        tooltipPosition={tooltipPosition}
        bubbles={
          inverted
            ? [formatValue(current[1]), formatValue(current[0])]
            : [formatValue(current[0]), formatValue(current[1])]
        }
        formatValue={formatValue}
        stepped={stepped}
      />
      <SliderMarkerLabels
        markers={markersToRender}
        min={min}
        max={max}
        vertical={vertical}
        flipValue={flipValue}
        isActive={inRange}
      />
      {showValue && (
        <SliderPrimitive.Value
          data-slot="slider-value"
          className="mt-2 flex w-full justify-between text-sm font-medium tabular-nums text-muted-foreground"
        >
          {(_, values) => {
            const real = flipTuple(toTuple(values));

            return (
              <>
                <span>{formatValue(real[0])}</span>
                <span>{formatValue(real[1])}</span>
              </>
            );
          }}
        </SliderPrimitive.Value>
      )}
    </SliderPrimitive.Root>
  );
}

function normalizeRangeValues(
  values: readonly number[],
  stepOptions: number[] | undefined,
  min: number,
  max: number,
): [number, number] {
  const bounded = values.map((value) => clampValue(value, min, max));

  return [
    snapToStepOption(stepOptions, Math.min(...bounded)),
    snapToStepOption(stepOptions, Math.max(...bounded)),
  ];
}

function useKiraRangeSliderModel({
  showInputs: showInputsInput,
  disabled,
  disabledReason,
  value,
  defaultValue,
  onValueChange,
  onValueCommitted,
  readOnly: readOnlyInput,
  stepOptions,
  min: minInput,
  max: maxInput,
  step: stepInput,
  formatValue: formatValueInput,
  label,
  ...props
}: KiraRangeSliderProps) {
  const { showInputs, readOnly, min, max, step, formatValue } =
    useKiraRangeSliderOptions({
      showInputs: showInputsInput,
      readOnly: readOnlyInput,
      min: minInput,
      max: maxInput,
      step: stepInput,
      formatValue: formatValueInput,
    });

  const [internal, setInternal] = React.useState<[number, number]>(
    defaultValue ?? [25, 75],
  );

  stepOptions = stepOptions?.filter(
    (option) => Number.isFinite(option) && option >= min && option <= max,
  );
  const raw = value ?? internal;

  const current = normalizeRangeValues(raw, stepOptions, min, max);

  const setRange = React.useCallback(
    (next: [number, number]) => {
      if (disabled || readOnly) return;

      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, onValueChange, disabled, readOnly],
  );

  const slider = (
    <RangeSlider
      value={current}
      onValueChange={setRange}
      onValueCommitted={onValueCommitted}
      readOnly={readOnly}
      stepOptions={stepOptions}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      formatValue={formatValue}
      label={label}
      {...props}
    />
  );

  return {
    disabled,
    disabledReason,
    slider,
    showInputs,
    label,
    readOnly,
    stepOptions,
    min,
    max,
    current,
    setRange,
    onValueCommitted,
    step,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function KiraRangeSliderView({
  disabled,
  disabledReason,
  slider,
  showInputs,
  label,
  readOnly,
  stepOptions,
  min,
  max,
  current,
  setRange,
  onValueCommitted,
  step,
}: ReturnType<typeof useKiraRangeSliderModel>) {
  return (
    <div data-slot="kira-range-slider" className="w-full">
      {disabled && disabledReason ? (
        <SliderDisabledReason reason={disabledReason}>
          {slider}
        </SliderDisabledReason>
      ) : (
        slider
      )}
      {showInputs && (
        <div
          data-slot="kira-range-slider-inputs"
          className="mt-2 flex w-full items-center justify-between gap-2"
        >
          {([0, 1] as const).map((index) => {
            const resolveArialabel3 = () =>
              sliderResolveArialabel3(label, index);

            const update = (v: number) => {
              if (disabled || readOnly) return;

              const snapped = snapToStepOption(
                stepOptions,
                clampValue(v, min, max),
              );

              const next: [number, number] =
                index === 0
                  ? [Math.max(min, Math.min(current[1], snapped)), current[1]]
                  : [current[0], Math.min(max, Math.max(current[0], snapped))];

              if (close(next[0], current[0]) && close(next[1], current[1]))
                return;
              setRange(next);
              onValueCommitted?.(next);
            };

            return (
              <label
                key={index}
                data-slot="kira-range-slider-input-label"
                className="min-w-0 flex-1 space-y-1 text-xs text-muted-foreground"
              >
                {index === 0 ? "From" : "To"}
                <NumericInput
                  value={current[index]}
                  min={index === 0 ? min : current[0]}
                  max={index === 0 ? current[1] : max}
                  step={step}
                  size="sm"
                  disabled={disabled}
                  readOnly={readOnly}
                  showButtons={!readOnly && !stepOptions?.length}
                  aria-label={resolveArialabel3()}
                  onKeyDown={(event) =>
                    sliderCallback(
                      event,
                      stepOptions,
                      disabled,
                      readOnly,
                      update,
                      current,
                      index,
                    )
                  }
                  onValueChange={(v) => {
                    if (v != null) update(v);
                  }}
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function sliderResolveValue1(
  candidates: number[],
  forward: boolean,
  current: number,
) {
  if (candidates.length) {
    if (forward) {
      return Math.min(...candidates);
    }

    return Math.max(...candidates);
  }

  return current;
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function SliderView2({
  size,
  variant,
  error,
  readOnly,
  className,
  flipValue,
  current,
  handleChangeWrapped,
  handleCommittedWrapped,
  disabled,
  min,
  max,
  step,
  orientation,
  props,
  label,
  description,
  required,
  descriptionId,
  markersToRender,
  onJump,
  interactive,
  thumbRef,
  thumbIcon,
  thumbLabel,
  tooltipMode,
  tooltipPosition,
  renderTooltip,
  formatValue,
  getValueText,
  stepped,
  vertical,
  showValue,
}: SliderView2Params) {
  return (
    <SliderPrimitive.Root
      className={rootClassName(size, variant, error, readOnly, className)}
      data-slot="slider"
      data-readonly={readOnly || undefined}
      value={flipValue(current)}
      onValueChange={handleChangeWrapped}
      onValueCommitted={handleCommittedWrapped}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      {...props}
    >
      <SliderHeader
        label={label}
        description={description}
        error={error}
        required={required}
        descriptionId={descriptionId}
      />
      <SliderControlArea
        markersToRender={markersToRender}
        min={min}
        max={max}
        orientation={orientation ?? "horizontal"}
        flipValue={flipValue}
        isActive={(v) => v <= current + EPS}
        onJump={onJump}
        interactive={interactive}
        error={error}
        descriptionId={descriptionId}
        thumbRef={thumbRef}
        thumbIcon={thumbIcon}
        thumbLabel={thumbLabel}
        tooltipMode={tooltipMode}
        tooltipPosition={tooltipPosition}
        bubble={renderTooltip ? renderTooltip(current) : formatValue(current)}
        getValueText={getValueText}
        stepped={stepped}
      />
      <SliderMarkerLabels
        markers={markersToRender}
        min={min}
        max={max}
        vertical={vertical}
        flipValue={flipValue}
        isActive={(v) => close(current, v)}
        onJump={onJump}
        interactive={interactive}
      />
      {showValue && (
        <SliderPrimitive.Value
          data-slot="slider-value"
          className="mt-2 text-sm font-medium tabular-nums text-muted-foreground"
        >
          {(_, values) => formatValue(flipValue(firstValue(values)))}
        </SliderPrimitive.Value>
      )}
    </SliderPrimitive.Root>
  );
}

function useSliderOptions({
  defaultValue: defaultValueInput,
  showValue: showValueInput,
  required: requiredInput,
  readOnly: readOnlyInput,
  tooltipMode: tooltipModeInput,
  tooltipPosition: tooltipPositionInput,
}: Parameters<typeof resolveSliderOptions>[0]) {
  return React.useMemo(
    () =>
      resolveSliderOptions({
        defaultValue: defaultValueInput,
        showValue: showValueInput,
        required: requiredInput,
        readOnly: readOnlyInput,
        tooltipMode: tooltipModeInput,
        tooltipPosition: tooltipPositionInput,
      }),
    [
      defaultValueInput,
      showValueInput,
      requiredInput,
      readOnlyInput,
      tooltipModeInput,
      tooltipPositionInput,
    ],
  );
}

function useSliderOptions2({
  showStepMarkers: showStepMarkersInput,
  formatValue: formatValueInput,
  getValueText: getValueTextInput,
  inverted: invertedInput,
  min: minInput,
  max: maxInput,
}: Parameters<typeof resolveSliderOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveSliderOptions2({
        showStepMarkers: showStepMarkersInput,
        formatValue: formatValueInput,
        getValueText: getValueTextInput,
        inverted: invertedInput,
        min: minInput,
        max: maxInput,
      }),
    [
      showStepMarkersInput,
      formatValueInput,
      getValueTextInput,
      invertedInput,
      minInput,
      maxInput,
    ],
  );
}

function useSliderOptions3({
  step: stepInput,
}: Parameters<typeof resolveSliderOptions3>[0]) {
  return React.useMemo(
    () => resolveSliderOptions3({ step: stepInput }),
    [stepInput],
  );
}

function useRangeSliderOptions({
  defaultValue: defaultValueInput,
  showValue: showValueInput,
  required: requiredInput,
  readOnly: readOnlyInput,
  tooltipMode: tooltipModeInput,
  tooltipPosition: tooltipPositionInput,
}: Parameters<typeof resolveRangeSliderOptions>[0]) {
  return React.useMemo(
    () =>
      resolveRangeSliderOptions({
        defaultValue: defaultValueInput,
        showValue: showValueInput,
        required: requiredInput,
        readOnly: readOnlyInput,
        tooltipMode: tooltipModeInput,
        tooltipPosition: tooltipPositionInput,
      }),
    [
      defaultValueInput,
      showValueInput,
      requiredInput,
      readOnlyInput,
      tooltipModeInput,
      tooltipPositionInput,
    ],
  );
}

function useRangeSliderOptions2({
  showStepMarkers: showStepMarkersInput,
  formatValue: formatValueInput,
  inverted: invertedInput,
  min: minInput,
  max: maxInput,
  step: stepInput,
}: Parameters<typeof resolveRangeSliderOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveRangeSliderOptions2({
        showStepMarkers: showStepMarkersInput,
        formatValue: formatValueInput,
        inverted: invertedInput,
        min: minInput,
        max: maxInput,
        step: stepInput,
      }),
    [
      showStepMarkersInput,
      formatValueInput,
      invertedInput,
      minInput,
      maxInput,
      stepInput,
    ],
  );
}

function useKiraRangeSliderOptions({
  showInputs: showInputsInput,
  readOnly: readOnlyInput,
  min: minInput,
  max: maxInput,
  step: stepInput,
  formatValue: formatValueInput,
}: Parameters<typeof resolveKiraRangeSliderOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraRangeSliderOptions({
        showInputs: showInputsInput,
        readOnly: readOnlyInput,
        min: minInput,
        max: maxInput,
        step: stepInput,
        formatValue: formatValueInput,
      }),
    [
      showInputsInput,
      readOnlyInput,
      minInput,
      maxInput,
      stepInput,
      formatValueInput,
    ],
  );
}

function sliderResolveDynamic2(mode: TooltipMode) {
  if (mode === "always") {
    return "opacity-100" as const;
  }

  if (mode === "on-drag") {
    return "group-data-[dragging]/thumb:opacity-100 group-data-[focused]/thumb:opacity-100" as const;
  }

  return "group-hover/thumb:opacity-100 group-data-[focused]/thumb:opacity-100" as const;
}

function sliderUseCallback(
  next: number | readonly number[],
  details: SliderPrimitive.Root.ChangeEventDetails,
  readOnly: boolean,
  stepOptions: number[] | undefined,
  flipValue: (v: number) => number,
  current: number,
  latest: React.RefObject<number | null>,
  handleChange: (nextValue: number) => void,
) {
  if (readOnly) {
    details.cancel();

    return;
  }

  const key = "key" in details.event ? details.event.key : null;

  const adjacent =
    details.reason === "keyboard" && key !== "Home" && key !== "End";

  const snapped = snapToStepOption(
    stepOptions,
    flipValue(firstValue(next)),
    adjacent ? current : undefined,
  );

  if (close(snapped, current)) {
    details.cancel();

    return;
  }

  latest.current = snapped;
  handleChange(snapped);
}

function sliderResolveArialabel3(label: string | undefined, index: 0 | 1) {
  if (label) {
    return `${label} ${index === 0 ? "from" : "to"}`;
  }

  if (index === 0) {
    return "From" as const;
  }

  return "To" as const;
}

function sliderCallback(
  event: React.KeyboardEvent<HTMLInputElement>,
  stepOptions: number[] | undefined,
  disabled: boolean | undefined,
  readOnly: boolean,
  update: (v: number) => void,
  current: [number, number],
  index: 0 | 1,
) {
  if (!stepOptions?.length || disabled || readOnly) return;

  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    update(
      snapToStepOption(
        stepOptions,
        current[index] + (event.key === "ArrowUp" ? 1 : -1),
        current[index],
      ),
    );
  }
}

function resolveSliderDisplayOptions<Value>(
  {
    defaultValue,
    showValue = false,
    required = false,
    readOnly = false,
    tooltipMode = "on-drag",
    tooltipPosition = "top",
  }: {
    defaultValue?: Value;
    showValue?: boolean;
    required?: boolean;
    readOnly?: boolean;
    tooltipMode?: TooltipMode;
    tooltipPosition?: TooltipPosition;
  },
  fallback: Value,
) {
  return {
    defaultValue: defaultValue === undefined ? fallback : defaultValue,
    showValue,
    required,
    readOnly,
    tooltipMode,
    tooltipPosition,
  };
}

function useSliderActions({
  readOnly,
  stepOptions,
  flipValue,
  current,
  handleChange,
  handleCommitted,
  disabled,
}: {
  readOnly: boolean;
  stepOptions: SliderProps["stepOptions"];
  flipValue: (v: number) => number;
  current: number;
  handleChange: (nextValue: number) => void;
  handleCommitted: (nextValue: number) => void;
  disabled: SliderProps["disabled"];
}) {
  const latest = React.useRef<number | null>(null);

  const handleChangeWrapped = React.useCallback(
    (
      next: number | readonly number[],
      details: SliderPrimitive.Root.ChangeEventDetails,
    ) =>
      sliderUseCallback(
        next,
        details,
        readOnly,
        stepOptions,
        flipValue,
        current,
        latest,
        handleChange,
      ),
    [handleChange, stepOptions, flipValue, current, readOnly],
  );

  const handleCommittedWrapped = React.useCallback(() => {
    if (latest.current == null) return;
    const committed = latest.current;
    latest.current = null;
    handleCommitted(committed);
  }, [handleCommitted]);

  const onJump = React.useCallback(
    (markerValue: number) => {
      if (disabled || readOnly) return;
      const snapped = snapToStepOption(stepOptions, markerValue);

      if (close(snapped, current)) return;
      handleChange(snapped);
      handleCommitted(snapped);
    },
    [disabled, readOnly, stepOptions, handleChange, handleCommitted, current],
  );

  return { handleChangeWrapped, handleCommittedWrapped, onJump } satisfies {
    handleChangeWrapped: typeof handleChangeWrapped;
    handleCommittedWrapped: typeof handleCommittedWrapped;
    onJump: typeof onJump;
  };
}

type SliderControlAreaParams = {
  markersToRender: SliderMarker[];
  min: number;
  max: number;
  orientation: SliderOrientation;
  flipValue: (value: number) => number;
  isActive: (v: number) => boolean;
  onJump?: (value: number) => void;
  interactive?: boolean;
  error?: string;
  descriptionId?: string;
  thumbRef: React.RefObject<HTMLDivElement | null>;
  thumbIcon?: React.ReactNode;
  thumbLabel?: string;
  tooltipMode: TooltipMode;
  tooltipPosition: TooltipPosition;
  bubble: React.ReactNode;
  getValueText: (value: number) => string;
  stepped?: boolean;
};

type RangeControlAreaParams = {
  markersToRender: SliderMarker[];
  min: number;
  max: number;
  orientation: SliderOrientation;
  flipValue: (value: number) => number;
  inverted: boolean;
  inRange: (v: number) => boolean;
  error?: string;
  descriptionId?: string;
  thumbRefs: readonly [
    React.RefObject<HTMLDivElement | null>,
    React.RefObject<HTMLDivElement | null>,
  ];
  label?: string;
  thumbLabels?: [string, string];
  thumbIcons?: [React.ReactNode, React.ReactNode];
  tooltipMode: TooltipMode;
  tooltipPosition: TooltipPosition;
  bubbles: [React.ReactNode, React.ReactNode];
  formatValue: (value: number) => string;
  stepped?: boolean;
};

type SliderView2Params = {
  size: ReturnType<typeof useSliderModel>["size"];
  variant: ReturnType<typeof useSliderModel>["variant"];
  error: ReturnType<typeof useSliderModel>["error"];
  readOnly: ReturnType<typeof useSliderModel>["readOnly"];
  className: ReturnType<typeof useSliderModel>["className"];
  flipValue: ReturnType<typeof useSliderModel>["flipValue"];
  current: ReturnType<typeof useSliderModel>["current"];
  handleChangeWrapped: ReturnType<typeof useSliderModel>["handleChangeWrapped"];
  handleCommittedWrapped: ReturnType<
    typeof useSliderModel
  >["handleCommittedWrapped"];
  disabled: ReturnType<typeof useSliderModel>["disabled"];
  min: ReturnType<typeof useSliderModel>["min"];
  max: ReturnType<typeof useSliderModel>["max"];
  step: ReturnType<typeof useSliderModel>["step"];
  orientation: ReturnType<typeof useSliderModel>["orientation"];
  props: ReturnType<typeof useSliderModel>["props"];
  label: ReturnType<typeof useSliderModel>["label"];
  description: ReturnType<typeof useSliderModel>["description"];
  required: ReturnType<typeof useSliderModel>["required"];
  descriptionId: ReturnType<typeof useSliderModel>["descriptionId"];
  markersToRender: ReturnType<typeof useSliderModel>["markersToRender"];
  onJump: ReturnType<typeof useSliderModel>["onJump"];
  interactive: ReturnType<typeof useSliderModel>["interactive"];
  thumbRef: ReturnType<typeof useSliderModel>["thumbRef"];
  thumbIcon: ReturnType<typeof useSliderModel>["thumbIcon"];
  thumbLabel: ReturnType<typeof useSliderModel>["thumbLabel"];
  tooltipMode: ReturnType<typeof useSliderModel>["tooltipMode"];
  tooltipPosition: ReturnType<typeof useSliderModel>["tooltipPosition"];
  renderTooltip: ReturnType<typeof useSliderModel>["renderTooltip"];
  formatValue: ReturnType<typeof useSliderModel>["formatValue"];
  getValueText: ReturnType<typeof useSliderModel>["getValueText"];
  stepped: ReturnType<typeof useSliderModel>["stepped"];
  vertical: ReturnType<typeof useSliderModel>["vertical"];
  showValue: ReturnType<typeof useSliderModel>["showValue"];
};
