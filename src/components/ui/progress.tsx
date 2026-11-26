import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCircle,
  IconLoader2,
  IconPlayerPause,
  IconAlertCircle,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useVisibilityPause } from "@/hooks/use-visibility-pause";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

const tones = {
  default: { fill: "bg-primary", stroke: "stroke-primary" },
  info: { fill: "bg-info", stroke: "stroke-info" },
  success: { fill: "bg-success", stroke: "stroke-success" },
  warning: { fill: "bg-warning", stroke: "stroke-warning" },
  destructive: { fill: "bg-destructive", stroke: "stroke-destructive" },
};

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: { sm: "h-1", default: "h-2", lg: "h-3", xl: "h-4" },
      variant: {
        default: "[&_[data-slot=progress-indicator]]:bg-primary",
        info: "[&_[data-slot=progress-indicator]]:bg-info",
        success: "[&_[data-slot=progress-indicator]]:bg-success",
        warning: "[&_[data-slot=progress-indicator]]:bg-warning",
        destructive: "[&_[data-slot=progress-indicator]]:bg-destructive",
      },
    },
    defaultVariants: { size: "default", variant: "default" },
  },
);

const indicatorVariants = cva(
  "h-full rounded-full origin-left rtl:origin-right",
  {
    variants: {
      striped: {
        true: "bg-[length:1rem_100%] bg-[linear-gradient(45deg,color-mix(in_oklab,var(--background)_20%,transparent)_25%,transparent_25%,transparent_50%,color-mix(in_oklab,var(--background)_20%,transparent)_50%,color-mix(in_oklab,var(--background)_20%,transparent)_75%,transparent_75%,transparent)]",
        false: "",
      },
      animated: {
        true: "animate-[progress-stripes_1s_linear_infinite] motion-reduce:animate-none",
        false: "",
      },
      indeterminate: {
        true: "w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite] motion-reduce:animate-none",
        false: "",
      },
    },
    defaultVariants: { striped: false, animated: false, indeterminate: false },
  },
);

interface ProgressRange {
  value?: number | null;
  min?: number;
  max?: number;
  locale?: Intl.LocalesArgument;
  format?: Intl.NumberFormatOptions;
}

function normalizeProgressBounds(min: number, max: number) {
  const valid =
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    max > min &&
    Number.isFinite(max - min);

  return valid ? { min, max } : { min: 0, max: 100 };
}

function formatProgressValue(
  value: number | null,
  fraction: number,
  locale?: Intl.LocalesArgument,
  format?: Intl.NumberFormatOptions,
) {
  if (value === null) return null;

  const options = {
    style: "percent",
    maximumFractionDigits: 0,
    ...format,
  } satisfies Intl.NumberFormatOptions;

  return new Intl.NumberFormat(locale, options).format(
    options.style === "percent" ? fraction : value,
  );
}

function normalizeProgress({
  value,
  min = 0,
  max = 100,
  locale,
  format,
}: ProgressRange) {
  const bounds = normalizeProgressBounds(min, max);

  const measured =
    value != null && Number.isFinite(value)
      ? Math.min(bounds.max, Math.max(bounds.min, value))
      : null;

  const fraction =
    measured === null ? 0 : (measured - bounds.min) / (bounds.max - bounds.min);

  return {
    value: measured,
    ...bounds,
    fraction,
    formatted: formatProgressValue(measured, fraction, locale, format),
    complete: measured !== null && measured === bounds.max,
  };
}

type NormalizedProgress = ReturnType<typeof normalizeProgress>;

function useCompletion(complete: boolean, onComplete?: () => void) {
  const notified = React.useRef(false);
  React.useEffect(() => {
    const notify = complete && !notified.current;
    notified.current = complete;

    if (notify) onComplete?.();
  }, [complete, onComplete]);
}

function useProgressActivity() {
  const ref = React.useRef<HTMLDivElement>(null);
  const paused = useVisibilityPause(ref);

  React.useEffect(() => {
    ref.current?.style.setProperty(
      "--progress-play-state",
      paused ? "paused" : "running",
    );
  }, [paused]);

  return ref;
}

type AriaValueText = (
  formattedValue: string | null,
  value: number | null,
) => string;

interface ProgressProps
  extends
    Omit<
      ProgressPrimitive.Root.Props,
      "value" | "getAriaValueText" | "children"
    >,
    VariantProps<typeof progressVariants> {
  value?: number | null;
  showLabel?: boolean;
  striped?: boolean;
  animated?: boolean;
  getAriaValueText?: AriaValueText;
  onComplete?: () => void;
  bufferValue?: number | null;
  paused?: boolean;
}

interface LinearProgressVisualProps {
  range: NormalizedProgress;
  variant: keyof typeof tones;
  striped: boolean;
  animated: boolean;
  paused: boolean;
  bufferValue?: number | null;
}

function linearIndicatorStyle(
  { range, striped, animated, paused }: LinearProgressVisualProps,
  reduced: boolean,
): React.CSSProperties {
  const unknown = range.value === null;
  let animationName = "none";

  if (!reduced) {
    if (unknown) animationName = "progress-indeterminate";
    else if (striped && animated) animationName = "progress-stripes";
  }

  return {
    width: unknown ? "33.333%" : "100%",
    transform: unknown ? undefined : `scaleX(${range.fraction})`,
    animationName,
    animationPlayState: paused
      ? "paused"
      : "var(--progress-play-state, paused)",
    animationDuration: unknown ? "1.5s" : "1s",
    animationIterationCount: "infinite",
    animationTimingFunction: unknown ? "ease-in-out" : "linear",
  };
}

function ProgressBuffer({
  range,
  bufferValue,
  variant,
  reduced,
}: Pick<LinearProgressVisualProps, "range" | "bufferValue" | "variant"> & {
  reduced: boolean;
}) {
  const buffer = normalizeProgress({
    value: bufferValue,
    min: range.min,
    max: range.max,
  });

  if (range.value === null || buffer.value === null) return null;

  return (
    <div
      data-slot="progress-buffer"
      aria-hidden="true"
      className={cn(
        "absolute inset-0 origin-left rtl:origin-right opacity-25",
        tones[variant].fill,
        !reduced &&
          "transition-transform duration-200 motion-reduce:transition-none",
      )}
      style={{
        transform: `scaleX(${Math.max(range.fraction, buffer.fraction)})`,
      }}
    />
  );
}

function LinearProgressVisual(props: LinearProgressVisualProps) {
  const reduced = useReducedMotion();
  const unknown = props.range.value === null;
  const moving = !reduced && !unknown;

  const indicatorClass = cn(
    indicatorVariants({
      striped: props.striped,
      animated: moving && props.striped && props.animated,
      indeterminate: !reduced && unknown,
    }),
    tones[props.variant].fill,
    moving &&
      "transition-transform duration-200 ease-out motion-reduce:transition-none",
  );

  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className="relative h-full w-full"
    >
      <ProgressBuffer
        range={props.range}
        bufferValue={props.bufferValue}
        variant={props.variant}
        reduced={reduced}
      />
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={indicatorClass}
        style={linearIndicatorStyle(props, reduced)}
      />
    </ProgressPrimitive.Track>
  );
}

function progressAriaText(
  range: NormalizedProgress,
  getAriaValueText?: AriaValueText,
) {
  return (
    getAriaValueText?.(range.formatted, range.value) ??
    range.formatted ??
    "Progress amount unknown"
  );
}

function Progress({
  className,
  value,
  min,
  max,
  size,
  variant = "default",
  showLabel = false,
  striped = false,
  animated = false,
  getAriaValueText,
  locale,
  format,
  onComplete,
  bufferValue,
  paused = false,
  ...props
}: ProgressProps) {
  const range = normalizeProgress({ value, min, max, locale, format });
  const activityRef = useProgressActivity();
  useCompletion(range.complete, onComplete);

  return (
    <div
      data-slot="progress-container"
      ref={activityRef}
      className="w-full min-w-0"
    >
      <ProgressPrimitive.Root
        aria-label={props["aria-labelledby"] ? undefined : "Progress"}
        {...props}
        data-slot="progress"
        value={range.value}
        min={range.min}
        max={range.max}
        locale={locale}
        format={format}
        getAriaValueText={() => progressAriaText(range, getAriaValueText)}
        className={(state) =>
          cn(
            progressVariants({ size, variant }),
            className instanceof Function ? className(state) : className,
          )
        }
      >
        <LinearProgressVisual
          range={range}
          variant={variant ?? "default"}
          striped={striped}
          animated={animated}
          paused={paused}
          bufferValue={bufferValue}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <ProgressValue
          data-slot="progress-label-value"
          className="mt-1 block text-end text-xs tabular-nums"
          value={range.value}
          min={range.min}
          max={range.max}
          locale={locale}
          format={format}
        >
          {(formatted) => formatted ?? "Amount unknown"}
        </ProgressValue>
      )}
    </div>
  );
}

interface ProgressLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

function ProgressLabel({
  className,
  htmlFor,
  children,
  ...props
}: ProgressLabelProps) {
  return (
    <label
      data-slot="progress-label"
      htmlFor={htmlFor}
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
    </label>
  );
}

interface ProgressValueProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    ProgressRange {
  children?:
    | ((formattedValue: string | null, value: number | null) => React.ReactNode)
    | null;
}

function ProgressValue({
  className,
  children,
  value,
  min,
  max,
  locale,
  format,
  ...props
}: ProgressValueProps) {
  const range = normalizeProgress({ value, min, max, locale, format });

  return (
    <span
      data-slot="progress-value"
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {children ? children(range.formatted, range.value) : range.formatted}
    </span>
  );
}

interface Segment {
  id?: string;
  value: number;
  variant?: keyof typeof tones;
  label?: string;
}

interface SegmentedProgressProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  segments: Segment[];
  total: number;
  showLabels?: boolean;
  kind?: "progress" | "meter";
  locale?: Intl.LocalesArgument;
  onComplete?: () => void;
}

function normalizeSegments(segments: Segment[], maximum: number) {
  const result: (Segment & { amount: number; start: number })[] = [];

  for (const segment of segments) {
    const previous = result.at(-1);
    const start = previous ? previous.start + previous.amount : 0;

    const amount = Math.min(
      maximum - start,
      Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0,
    );

    result.push({ ...segment, amount, start });
  }

  return result;
}

function SegmentedProgress({
  segments,
  total,
  size,
  variant,
  showLabels = false,
  kind = "progress",
  locale,
  onComplete,
  className,
  ...props
}: SegmentedProgressProps) {
  const maximum = Number.isFinite(total) && total > 0 ? total : 100;
  const safeSegments = normalizeSegments(segments, maximum);

  const consumed = safeSegments.reduce(
    (sum, segment) => sum + segment.amount,
    0,
  );

  const range = normalizeProgress({ value: consumed, max: maximum, locale });
  useCompletion(kind === "progress" && range.complete, onComplete);

  const breakdown = safeSegments
    .map((segment, index) =>
      [
        segment.label ?? "Segment " + (index + 1),
        new Intl.NumberFormat(locale).format(segment.amount),
      ].join(": "),
    )
    .join(", ");

  return (
    <div data-slot="segmented-progress-container" className="w-full min-w-0">
      <ProgressPrimitive.Root
        {...props}
        data-slot="segmented-progress"
        role={kind === "meter" ? "meter" : "progressbar"}
        value={range.value}
        min={0}
        max={maximum}
        locale={locale}
        getAriaValueText={() =>
          `${range.formatted}; ${breakdown || "No segments"}`
        }
        className={cn(progressVariants({ size, variant }), className)}
      >
        <ProgressPrimitive.Track
          data-slot="progress-track"
          className="relative h-full w-full"
        >
          {safeSegments.map((segment, index) => (
            <div
              key={segment.id ?? index}
              data-slot="progress-segment"
              aria-hidden="true"
              className={cn(
                "absolute inset-y-0",
                tones[segment.variant ?? variant ?? "default"].fill,
              )}
              style={{
                width: `${(segment.amount / maximum) * 100}%`,
                insetInlineStart: `${(segment.start / maximum) * 100}%`,
              }}
            />
          ))}
        </ProgressPrimitive.Track>
      </ProgressPrimitive.Root>
      <div
        data-slot="progress-segment-breakdown"
        className={
          showLabels
            ? "mt-2 text-xs text-muted-foreground tabular-nums"
            : "sr-only"
        }
      >
        {breakdown || "No segments"}
      </div>
    </div>
  );
}

interface CircularProgressProps
  extends
    Omit<React.SVGProps<SVGSVGElement>, keyof ProgressRange>,
    VariantProps<typeof progressVariants>,
    ProgressRange {
  showLabel?: boolean;
  indeterminate?: boolean;
  getAriaValueText?: AriaValueText;
  onComplete?: () => void;
}

const circleSizes = {
  sm: "size-12",
  default: "size-16",
  lg: "size-20",
  xl: "size-24",
};

const circleStrokes = { sm: 3, default: 4, lg: 5, xl: 6 };

interface CircularProgressVisualProps extends React.SVGProps<SVGSVGElement> {
  range: NormalizedProgress;
  tone: keyof typeof tones;
  preset: keyof typeof circleSizes;
  reduced: boolean;
}

function CircularProgressVisual({
  range,
  tone,
  preset,
  reduced,
  className,
  ref,
  ...props
}: CircularProgressVisualProps) {
  const unknown = range.value === null;
  const circumference = 2 * Math.PI * 45;

  return (
    <svg
      {...props}
      ref={ref}
      data-slot="circular-progress-svg"
      className={cn("size-full -rotate-90", className)}
      viewBox={props.viewBox ?? "0 0 100 100"}
      aria-hidden="true"
    >
      <circle
        data-slot="circular-progress-track"
        cx="50"
        cy="50"
        r="45"
        strokeWidth={circleStrokes[preset]}
        fill="none"
        className="stroke-muted"
      />
      <circle
        data-slot="circular-progress-indicator"
        cx="50"
        cy="50"
        r="45"
        strokeWidth={circleStrokes[preset]}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={
          unknown
            ? `${circumference * 0.75} ${circumference * 0.25}`
            : circumference
        }
        strokeDashoffset={unknown ? 0 : circumference * (1 - range.fraction)}
        className={cn(
          tones[tone].stroke,
          !reduced &&
            !unknown &&
            "transition-[stroke-dashoffset] duration-200 motion-reduce:transition-none",
          !reduced && unknown && "animate-spin motion-reduce:animate-none",
        )}
        style={{
          transformOrigin: "50% 50%",
          animationPlayState: "var(--progress-play-state, paused)",
        }}
      />
    </svg>
  );
}

const CircularProgress = React.forwardRef<SVGSVGElement, CircularProgressProps>(
  function CircularProgress(
    {
      value,
      min,
      max,
      size,
      variant,
      showLabel = false,
      indeterminate,
      getAriaValueText,
      locale,
      format,
      onComplete,
      "aria-label": ariaLabel,
      "aria-labelledby": labelledBy,
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) {
    const range = normalizeProgress({
      value: indeterminate ? null : value,
      min,
      max,
      locale,
      format,
    });

    const preset = size ?? "default";
    const reduced = useReducedMotion();
    const activityRef = useProgressActivity();
    useCompletion(range.complete, onComplete);

    return (
      <ProgressPrimitive.Root
        ref={activityRef}
        data-slot="circular-progress"
        value={range.value}
        min={range.min}
        max={range.max}
        locale={locale}
        format={format}
        aria-label={ariaLabel ?? (labelledBy ? undefined : "Progress")}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        getAriaValueText={() => progressAriaText(range, getAriaValueText)}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          circleSizes[preset],
        )}
      >
        <CircularProgressVisual
          {...props}
          ref={ref}
          range={range}
          tone={variant ?? "default"}
          preset={preset}
          reduced={reduced}
        />
        {showLabel && (
          <span
            data-slot="circular-progress-value"
            className="absolute text-xs font-medium tabular-nums"
            aria-hidden="true"
          >
            {range.formatted ?? "..."}
          </span>
        )}
      </ProgressPrimitive.Root>
    );
  },
);

type ProgressStatus =
  "idle" | "running" | "paused" | "error" | "complete" | "canceled";

interface ProgressPhase extends ProgressRange {
  id: string;
  label: string;
  weight: number;
}

interface KiraProgressProps extends Omit<
  ProgressProps,
  "aria-label" | "aria-labelledby" | "showLabel"
> {
  label: string;
  status: ProgressStatus;
  description?: React.ReactNode;
  phases?: readonly ProgressPhase[];
  currentPhaseId?: string;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
}

const lifecycleText: Record<ProgressStatus, string> = {
  idle: "Ready",
  running: "Running",
  paused: "Paused",
  error: "Failed",
  complete: "Complete",
  canceled: "Canceled",
};

const lifecycleIcon = {
  idle: IconCircle,
  running: IconLoader2,
  paused: IconPlayerPause,
  error: IconAlertCircle,
  complete: IconCheck,
  canceled: IconX,
};

function weightedPhaseProgress(phases: readonly ProgressPhase[]) {
  const ids = new Set<string>();
  let amount = 0;
  let weights = 0;

  for (const phase of phases) {
    if (
      !phase.id ||
      ids.has(phase.id) ||
      !Number.isFinite(phase.weight) ||
      phase.weight <= 0
    )
      return null;
    const range = normalizeProgress(phase);

    if (range.value === null) return null;
    ids.add(phase.id);
    amount += phase.weight * range.fraction;
    weights += phase.weight;
  }

  return weights > 0 && Number.isFinite(weights)
    ? (amount / weights) * 100
    : null;
}

function useProgressActionFocus() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const focusedAction = React.useRef<HTMLElement | null>(null);
  const summaryRef = React.useRef<HTMLOutputElement>(null);
  React.useLayoutEffect(() => {
    const previous = focusedAction.current;

    if (previous && !previous.isConnected) {
      (
        rootRef.current?.querySelector<HTMLButtonElement>("button") ??
        summaryRef.current
      )?.focus();
      focusedAction.current = null;
    }
  });

  const onActionFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement)
      focusedAction.current = event.target;
  };

  return { rootRef, summaryRef, onActionFocus };
}

interface ProgressAction {
  label: string;
  onClick: (() => void) | undefined;
}

function progressActions({
  status,
  onPause,
  onResume,
  onCancel,
  onRetry,
}: Pick<
  KiraProgressProps,
  "status" | "onPause" | "onResume" | "onCancel" | "onRetry"
>) {
  const actions = {
    idle: [],
    running: [
      { label: "Pause", onClick: onPause },
      { label: "Cancel", onClick: onCancel },
    ],
    paused: [
      { label: "Resume", onClick: onResume },
      { label: "Cancel", onClick: onCancel },
    ],
    error: [{ label: "Retry", onClick: onRetry }],
    canceled: [{ label: "Retry", onClick: onRetry }],
    complete: [],
  } satisfies Record<ProgressStatus, ProgressAction[]>;

  return actions[status].filter((action) => action.onClick);
}

interface ProgressStatusLineProps {
  status: ProgressStatus;
  phase?: ProgressPhase;
  ref: React.Ref<HTMLOutputElement>;
}

function ProgressStatusLine({ status, phase, ref }: ProgressStatusLineProps) {
  const StatusIcon = lifecycleIcon[status];

  return (
    <output
      ref={ref}
      tabIndex={-1}
      data-slot="progress-status"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-center gap-2 text-sm outline-none"
    >
      <StatusIcon
        data-slot="progress-status-icon"
        aria-hidden="true"
        className="size-4 shrink-0"
      />
      {lifecycleText[status]}
      {phase ? " - " + phase.label : ""}
    </output>
  );
}

function kiraProgressRange({
  phases,
  value,
  min,
  max,
  bufferValue,
}: Pick<
  KiraProgressProps,
  "phases" | "value" | "min" | "max" | "bufferValue"
>) {
  if (phases)
    return {
      value: weightedPhaseProgress(phases),
      min: 0,
      max: 100,
      bufferValue: undefined,
    };

  return { value, min, max, bufferValue };
}

interface ProgressActionButtonsProps {
  actions: ProgressAction[];
  onFocusCapture: React.FocusEventHandler<HTMLDivElement>;
}

function ProgressActionButtons({
  actions,
  onFocusCapture,
}: ProgressActionButtonsProps) {
  return (
    <div
      data-slot="progress-actions"
      className="flex flex-wrap gap-2"
      onFocusCapture={onFocusCapture}
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          size="sm"
          variant="outline"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

function KiraProgress(allProps: KiraProgressProps) {
  const {
    label,
    status,
    description,
    phases,
    currentPhaseId,
    onPause: _onPause,
    onResume: _onResume,
    onCancel: _onCancel,
    onRetry: _onRetry,
    value: _value,
    min: _min,
    max: _max,
    locale,
    format,
    bufferValue: _bufferValue,
    ...props
  } = allProps;

  const id = React.useId();
  const focus = useProgressActionFocus();

  const range = kiraProgressRange(allProps);

  const currentPhase = phases?.find((phase) => phase.id === currentPhaseId);

  const actions = progressActions(allProps);

  const buildMeasurement = () => (
    <Progress
      {...props}
      {...range}
      locale={locale}
      format={format}
      aria-labelledby={id + "-label"}
      aria-describedby={description ? id + "-description" : undefined}
      showLabel
      paused={status !== "running"}
      animated={status === "running" && props.animated}
    />
  );

  const buildActions = () => (
    <ProgressActionButtons
      actions={actions}
      onFocusCapture={focus.onActionFocus}
    />
  );

  const wrapProgress = () => (
    <div
      ref={focus.rootRef}
      data-slot="kira-progress"
      data-status={status}
      className="min-w-0 space-y-2"
    >
      <ProgressLabel id={id + "-label"} className="block wrap-break-word">
        {label}
      </ProgressLabel>
      {description && (
        <p
          id={id + "-description"}
          data-slot="progress-description"
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}
      {buildMeasurement()}
      <ProgressStatusLine
        status={status}
        phase={currentPhase}
        ref={focus.summaryRef}
      />
      {buildActions()}
    </div>
  );

  return wrapProgress();
}

export {
  Progress,
  ProgressLabel,
  ProgressValue,
  SegmentedProgress,
  CircularProgress,
  KiraProgress,
  progressVariants,
  indicatorVariants,
};

export type {
  ProgressProps,
  ProgressLabelProps,
  ProgressValueProps,
  ProgressRange,
  CircularProgressProps,
  SegmentedProgressProps,
  Segment,
  KiraProgressProps,
  ProgressStatus,
  ProgressPhase,
};
