"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCheck,
  IconMinus,
  IconPlayerPause,
  IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";

type ProgressStepState =
  "pending" | "active" | "completed" | "error" | "paused" | "skipped";

type ProgressStep = {
  label: string;
  value: number;
  icon?: React.ReactNode;
  description?: string;
  state?: ProgressStepState;
  optional?: boolean;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

const tones = {
  default:
    "[--step-tone:var(--primary)] [--step-on-tone:var(--primary-foreground)]",
  success:
    "[--step-tone:var(--success)] [--step-on-tone:var(--success-foreground)]",
  warning:
    "[--step-tone:var(--warning)] [--step-on-tone:var(--warning-foreground)]",
  destructive:
    "[--step-tone:var(--destructive)] [--step-on-tone:var(--destructive-foreground)]",
};

const progressIndicatorVariants = cva("w-full min-w-0", {
  variants: {
    size: {
      sm: "[--progress-step-size:1.5rem]",
      default: "[--progress-step-size:2rem]",
      lg: "[--progress-step-size:2.5rem]",
    },
    variant: tones,
  },
  defaultVariants: { size: "default", variant: "default" },
});

const indicatorVariants = cva(
  "relative z-10 flex size-[var(--progress-step-size)] shrink-0 items-center justify-center rounded-full border-2 font-medium tabular-nums",
  {
    variants: {
      size: {
        sm: "text-xs [--progress-step-size:1.5rem] [&_svg]:size-3",
        default: "text-sm [--progress-step-size:2rem] [&_svg]:size-4",
        lg: "text-base [--progress-step-size:2.5rem] [&_svg]:size-5",
      },
      variant: tones,
      state: {
        pending: "border-border bg-background text-muted-foreground",
        active:
          "border-[var(--step-tone)] bg-[color-mix(in_oklab,var(--step-tone)_12%,var(--background))] text-foreground",
        completed:
          "border-[var(--step-tone)] bg-[var(--step-tone)] text-[var(--step-on-tone)]",
        error:
          "border-destructive bg-destructive/10 text-[color-mix(in_oklab,var(--destructive)_70%,var(--foreground))]",
        paused: "border-warning bg-warning/10 text-foreground",
        skipped: "border-dashed border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { size: "default", variant: "default", state: "pending" },
  },
);

const lineVariants = cva("pointer-events-none absolute z-0 rounded-full", {
  variants: {
    size: {
      sm: "[--progress-line-size:2px]",
      default: "[--progress-line-size:4px]",
      lg: "[--progress-line-size:6px]",
    },
    variant: tones,
    state: {
      pending: "bg-border",
      active: "bg-border",
      completed: "bg-[var(--step-tone)]",
      skipped: "bg-border",
    },
  },
  defaultVariants: { size: "default", variant: "default", state: "pending" },
});

const stateLabels: Record<ProgressStepState, string> = {
  pending: "Not started",
  active: "In progress",
  completed: "Completed",
  error: "Needs attention",
  paused: "Paused",
  skipped: "Skipped",
};

interface ProgressIndicatorProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  steps: readonly ProgressStep[];
  /** Zero-based index. -1 means not started; steps.length means complete. */
  currentStep: number;
  size?: VariantProps<typeof indicatorVariants>["size"];
  variant?: VariantProps<typeof indicatorVariants>["variant"];
  orientation?: "horizontal" | "vertical";
  /** Stack horizontal steps below the sm breakpoint. */
  responsive?: boolean;
  clickable?: boolean;
  animated?: boolean;
  showDescription?: boolean;
  showLabel?: boolean;
  showStatus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  disabledReason?: string;
  emptyMessage?: React.ReactNode;
  onStepClick?: (value: number) => void;
}

function normalizeCurrentStep(currentStep: number, length: number) {
  if (!Number.isFinite(currentStep)) return -1;

  return Math.min(length, Math.max(-1, Math.trunc(currentStep)));
}

function resolveStepState(
  step: ProgressStep,
  index: number,
  currentStep: number,
): ProgressStepState {
  if (step.state) return step.state;

  if (index < currentStep) return "completed";

  if (index === currentStep) return "active";

  return "pending";
}

function useStepActivity(hasSteps: boolean) {
  const ref = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => progressIndicatorUseEffect(ref), [hasSteps]);

  return ref;
}

function ProgressStepGlyph({
  step,
  index,
  state,
  motion,
}: {
  step: ProgressStep;
  index: number;
  state: ProgressStepState;
  motion: boolean;
}) {
  if (state === "completed")
    return <IconCheck data-slot="progress-step-icon" />;

  if (state === "error") return <IconX data-slot="progress-step-icon" />;

  if (state === "paused")
    return <IconPlayerPause data-slot="progress-step-icon" />;

  if (state === "skipped") return <IconMinus data-slot="progress-step-icon" />;

  if (state === "active" && step.loading) {
    return (
      <Spinner
        data-slot="progress-step-spinner"
        className="text-current"
        style={{
          animationName: motion ? undefined : "none",
          animationPlayState: "var(--progress-step-play-state, paused)",
        }}
      />
    );
  }

  if (step.icon != null)
    return (
      <span
        data-slot="progress-step-icon"
        className="flex items-center justify-center"
      >
        {step.icon}
      </span>
    );

  return <span data-slot="progress-step-number">{index + 1}</span>;
}

interface StepContentProps {
  step: ProgressStep;
  index: number;
  state: ProgressStepState;
  size: ProgressIndicatorProps["size"];
  variant: ProgressIndicatorProps["variant"];
  horizontal: boolean;
  responsive: boolean;
  motion: boolean;
  showLabel: boolean;
  showDescription: boolean;
  showStatus: boolean;
  disabled: boolean;
  reasonId: string;
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- The pure step renderer keeps visible labels and their screen-reader equivalents together; all progression state arrives as props.
function ProgressStepContent({
  step,
  index,
  state,
  size,
  variant,
  horizontal,
  responsive,
  motion,
  showLabel,
  showDescription,
  showStatus,
  disabled,
  reasonId,
}: StepContentProps) {
  const visibleStatus =
    showStatus ||
    state === "error" ||
    state === "paused" ||
    state === "skipped";

  return (
    <span
      data-slot="progress-step-content"
      className={cn(
        "relative z-10 flex w-full min-w-0 items-start gap-3 text-start",
        horizontal &&
          (responsive
            ? "sm:flex-col sm:items-center sm:gap-2 sm:text-center"
            : "flex-col items-center gap-2 text-center"),
      )}
    >
      <span
        data-slot="progress-step-indicator"
        data-state={state}
        aria-hidden="true"
        className={cn(
          indicatorVariants({ size, variant, state }),
          { "opacity-50": disabled },
          {
            "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none":
              motion,
          },
        )}
      >
        <ProgressStepGlyph
          step={step}
          index={index}
          state={state}
          motion={motion}
        />
      </span>
      <span
        data-slot="progress-step-text"
        className={cn("min-w-0 flex-1 space-y-1", {
          "sr-only":
            !showLabel &&
            !visibleStatus &&
            !step.optional &&
            !(disabled && step.disabledReason) &&
            !(showDescription && step.description),
        })}
      >
        <span
          data-slot="progress-step-label"
          className={cn(
            "block wrap-anywhere text-sm font-medium text-foreground",
            { "sr-only": !showLabel },
          )}
        >
          {step.label.trim() || "Step " + (index + 1)}
        </span>
        {step.optional && (
          <span
            data-slot="progress-step-optional"
            className="block text-xs text-muted-foreground"
          >
            Optional
          </span>
        )}
        <span
          data-slot="progress-step-status"
          className={cn("block text-xs text-muted-foreground", {
            "sr-only": !visibleStatus,
          })}
        >
          {stateLabels[state]}
        </span>
        {showDescription && step.description && (
          <span
            data-slot="progress-step-description"
            className="block wrap-anywhere text-xs text-muted-foreground"
          >
            {step.description}
          </span>
        )}
        {disabled && step.disabledReason && (
          <span
            data-slot="progress-step-reason"
            id={reasonId}
            className="block wrap-anywhere text-xs text-muted-foreground"
          >
            {step.disabledReason}
          </span>
        )}
      </span>
    </span>
  );
}

function ProgressIndicator(arg0: ProgressIndicatorProps) {
  const model = useProgressIndicatorModel(arg0);

  return <ProgressIndicatorView {...model} />;
}

interface KiraProgressIndicatorProps extends Omit<
  ProgressIndicatorProps,
  "aria-label" | "aria-labelledby"
> {
  label: string;
  description?: React.ReactNode;
  /** Measured current-phase progress from 0 to 100; null means unknown. */
  progress?: number | null;
  progressLabel?: string;
  statusMessage?: string;
  /** The application owns retry execution and updates the steps afterward. */
  onRetry?: (value: number) => void;
  retryLabel?: string;
  retrying?: boolean;
}

function milestoneSummary(steps: readonly ProgressStep[], current: number) {
  const states = steps.map((step, index) =>
    resolveStepState(step, index, current),
  );

  const finished = states.filter(
    (state) => state === "completed" || state === "skipped",
  ).length;

  const failed = steps.find((_, index) => states[index] === "error");
  const paused = steps.find((_, index) => states[index] === "paused");
  const active = steps.find((_, index) => states[index] === "active");
  let message = "Waiting to start";

  if (steps.length === 0) message = "No steps to show";
  else if (failed) message = "Needs attention: " + failed.label;
  else if (paused) message = "Paused: " + paused.label;
  else if (active) message = "In progress: " + active.label;
  else if (finished === steps.length) message = "All steps finished";

  return { finished, failed, paused, active, message };
}

function KiraProgressIndicator(arg0: KiraProgressIndicatorProps) {
  const model = useKiraProgressIndicatorModel(arg0);

  return <KiraProgressIndicatorView {...model} />;
}

export {
  ProgressIndicator,
  KiraProgressIndicator,
  progressIndicatorVariants,
  indicatorVariants,
  lineVariants,
};

export type {
  ProgressIndicatorProps,
  KiraProgressIndicatorProps,
  ProgressStep,
  ProgressStepState,
};

function resolveKiraProgressIndicatorOptions({
  retrying = false,
  size = "default",
  variant = "default",
  orientation = "horizontal",
  responsive = true,
  clickable = false,
}: {
  retrying?: KiraProgressIndicatorProps["retrying"];
  size?: KiraProgressIndicatorProps["size"];
  variant?: KiraProgressIndicatorProps["variant"];
  orientation?: KiraProgressIndicatorProps["orientation"];
  responsive?: KiraProgressIndicatorProps["responsive"];
  clickable?: KiraProgressIndicatorProps["clickable"];
}) {
  return { retrying, size, variant, orientation, responsive, clickable };
}

function resolveKiraProgressIndicatorOptions2({
  animated = false,
  showDescription = true,
  showLabel = true,
  showStatus = true,
  disabled = false,
  readOnly = false,
}: {
  animated?: KiraProgressIndicatorProps["animated"];
  showDescription?: KiraProgressIndicatorProps["showDescription"];
  showLabel?: KiraProgressIndicatorProps["showLabel"];
  showStatus?: KiraProgressIndicatorProps["showStatus"];
  disabled?: KiraProgressIndicatorProps["disabled"];
  readOnly?: KiraProgressIndicatorProps["readOnly"];
}) {
  return {
    animated,
    showDescription,
    showLabel,
    showStatus,
    disabled,
    readOnly,
  };
}

function KiraProgressIndicatorStatusView({
  statusRef,
  message,
  steps,
  summary,
}: {
  statusRef: React.RefObject<HTMLParagraphElement | null>;
  message: string;
  steps: readonly ProgressStep[];
  summary: {
    finished: number;
    failed: ProgressStep | undefined;
    paused: ProgressStep | undefined;
    active: ProgressStep | undefined;
    message: string;
  };
}) {
  return (
    <p
      ref={statusRef}
      tabIndex={-1}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="kira-progress-indicator-status"
      className="min-w-0 flex-1 wrap-anywhere rounded-md text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span
        data-slot="kira-progress-indicator-message"
        className="block font-medium"
      >
        {message}
      </span>
      {steps.length > 0 && (
        <span
          data-slot="kira-progress-indicator-count"
          className="block text-xs text-muted-foreground tabular-nums"
        >
          {summary.finished} of {steps.length} steps finished
        </span>
      )}
    </p>
  );
}

function resolveProgressAppearance({
  size = "default",
  variant = "default",
  orientation = "horizontal",
  responsive = true,
  animated = false,
}: ProgressIndicatorProps) {
  return { size, variant, orientation, responsive, animated };
}

function resolveProgressInteraction({
  clickable = false,
  showDescription = false,
  showLabel = true,
  showStatus = false,
  disabled = false,
  readOnly = false,
  emptyMessage = "No steps to show.",
}: ProgressIndicatorProps) {
  return {
    clickable,
    showDescription,
    showLabel,
    showStatus,
    disabled,
    readOnly,
    emptyMessage,
  };
}

function progressIndicatorPresentationProps({
  steps,
  currentStep: _currentStep,
  size: _size,
  variant: _variant,
  orientation: _orientation,
  responsive: _responsive,
  clickable: _clickable,
  animated: _animated,
  showDescription: _showDescription,
  showLabel: _showLabel,
  showStatus: _showStatus,
  disabled: _disabled,
  readOnly: _readOnly,
  disabledReason,
  emptyMessage: _emptyMessage,
  onStepClick,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": labelledBy,
  ...props
}: ProgressIndicatorProps) {
  return {
    steps,
    disabledReason,
    onStepClick,
    className,
    ariaLabel,
    labelledBy,
    props,
  };
}

function useProgressIndicatorModel(input: ProgressIndicatorProps) {
  const reduced = useReducedMotion();
  const listRef = useStepActivity(input.steps.length > 0);
  const id = React.useId();

  const options = {
    ...resolveProgressAppearance(input),
    ...resolveProgressInteraction(input),
  };

  const current = normalizeCurrentStep(input.currentStep, input.steps.length);
  const horizontal = options.orientation === "horizontal";
  const motion = options.animated && !reduced;

  const interactive =
    options.clickable && input.onStepClick != null && !options.readOnly;

  return {
    ...progressIndicatorPresentationProps(input),
    ...options,
    listRef,
    id,
    current,
    horizontal,
    motion,
    interactive,
  };
}

type ProgressIndicatorModel = ReturnType<typeof useProgressIndicatorModel>;

function ProgressIndicatorView(model: ProgressIndicatorModel) {
  const {
    ariaLabel,
    labelledBy,
    orientation,
    readOnly,
    disabled,
    size,
    variant,
    className,
    props,
    steps,
    emptyMessage,
  } = model;

  return (
    <div
      data-slot="progress-indicator"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This ARIA group preserves the composite layout without form semantics.
      role="group"
      aria-label={ariaLabel ?? (labelledBy ? undefined : "Progress")}
      aria-labelledby={labelledBy}
      data-orientation={orientation}
      data-read-only={readOnly || undefined}
      data-disabled={disabled || undefined}
      className={cn(progressIndicatorVariants({ size, variant }), className)}
      {...props}
    >
      {steps.length === 0 ? (
        <p
          data-slot="progress-indicator-empty"
          className="text-sm text-muted-foreground"
        >
          {emptyMessage}
        </p>
      ) : (
        <ProgressStepList {...model} />
      )}
    </div>
  );
}

function ProgressStepList(model: ProgressIndicatorModel) {
  const { listRef, horizontal, responsive, steps } = model;

  return (
    <ol
      ref={listRef}
      data-slot="progress-indicator-list"
      className={cn(
        "m-0 flex list-none flex-col gap-6 p-0",
        horizontal && (responsive ? "sm:flex-row sm:gap-0" : "flex-row gap-0"),
      )}
    >
      {steps.map((step, index) => (
        <ProgressStepItem
          key={step.value}
          model={model}
          step={step}
          index={index}
        />
      ))}
    </ol>
  );
}

type ProgressStepItemProps = {
  model: ProgressIndicatorModel;
  step: ProgressStep;
  index: number;
};

function ProgressStepItem({ model, step, index }: ProgressStepItemProps) {
  const state = resolveStepState(step, index, model.current);
  const isDisabled = model.disabled || step.disabled === true;
  const reason = step.disabledReason ?? model.disabledReason;
  const displayStep = reason ? { ...step, disabledReason: reason } : step;
  const reasonId = model.id + "-reason-" + index;

  const content = (
    <ProgressStepContent
      {...model}
      step={displayStep}
      index={index}
      state={state}
      disabled={isDisabled}
      reasonId={reasonId}
    />
  );

  return (
    <li
      data-slot="progress-step"
      data-state={state}
      data-disabled={isDisabled || undefined}
      aria-current={state === "active" ? "step" : undefined}
      className={cn("relative min-w-0", { "flex-1": model.horizontal })}
    >
      {index < model.steps.length - 1 && (
        <ProgressStepConnector {...model} state={state} />
      )}
      <ProgressStepTarget
        model={model}
        step={step}
        disabled={isDisabled}
        reason={reason}
        reasonId={reasonId}
      >
        {content}
      </ProgressStepTarget>
    </li>
  );
}

function ProgressStepConnector({
  size,
  variant,
  horizontal,
  responsive,
  motion,
  state,
}: Pick<
  ProgressIndicatorModel,
  "size" | "variant" | "horizontal" | "responsive" | "motion"
> & { state: ProgressStepState }) {
  return (
    <span
      data-slot="progress-line"
      aria-hidden="true"
      className={cn(
        lineVariants({
          size,
          variant,
          state: state === "completed" ? "completed" : "pending",
        }),
        horizontal && !responsive
          ? "start-1/2 top-[calc(var(--progress-step-size)/2)] h-[var(--progress-line-size)] w-full -translate-y-1/2"
          : "start-[calc((var(--progress-step-size)-var(--progress-line-size))/2)] top-[var(--progress-step-size)] -bottom-6 w-[var(--progress-line-size)]",
        {
          "sm:start-1/2 sm:top-[calc(var(--progress-step-size)/2)] sm:bottom-auto sm:h-[var(--progress-line-size)] sm:w-full sm:-translate-y-1/2":
            horizontal && responsive,
        },
        {
          "transition-colors duration-200 ease-out motion-reduce:transition-none":
            motion,
        },
      )}
    />
  );
}

function ProgressStepTarget({
  model,
  step,
  disabled,
  reason,
  reasonId,
  children,
}: {
  model: ProgressIndicatorModel;
  step: ProgressStep;
  disabled: boolean;
  reason: string | undefined;
  reasonId: string;
  children: React.ReactNode;
}) {
  if (!model.interactive) return children;

  return (
    <Button
      type="button"
      variant="ghost"
      data-slot="progress-step-button"
      disabled={disabled}
      focusableWhenDisabled={disabled && Boolean(reason)}
      aria-describedby={disabled && reason ? reasonId : undefined}
      onClick={() => {
        if (!disabled) model.onStepClick?.(step.value);
      }}
      className="relative z-10 h-auto min-h-6 w-full items-start rounded-lg p-0 whitespace-normal transition-none hover:bg-transparent focus-visible:ring-offset-2"
    >
      {children}
    </Button>
  );
}

function kiraProgressIndicatorNativeProps({
  label: _label,
  description: _description,
  progress: _progress,
  progressLabel: _progressLabel,
  statusMessage: _statusMessage,
  onRetry: _onRetry,
  retryLabel: _retryLabel,
  retrying: _retrying,
  steps: _steps,
  currentStep: _currentStep,
  size: _size,
  variant: _variant,
  orientation: _orientation,
  responsive: _responsive,
  clickable: _clickable,
  animated: _animated,
  showDescription: _showDescription,
  showLabel: _showLabel,
  showStatus: _showStatus,
  disabled: _disabled,
  readOnly: _readOnly,
  disabledReason: _disabledReason,
  emptyMessage: _emptyMessage,
  onStepClick: _onStepClick,
  className: _className,
  "aria-describedby": _describedBy,
  ...props
}: KiraProgressIndicatorProps) {
  return props;
}

function useKiraProgressIndicatorModel(input: KiraProgressIndicatorProps) {
  const display = useKiraProgressIndicatorOptions(input);
  const behavior = useKiraProgressIndicatorOptions2(input);
  const options = { ...display, ...behavior };
  const id = React.useId();
  const statusRef = React.useRef<HTMLParagraphElement>(null);
  const current = normalizeCurrentStep(input.currentStep, input.steps.length);
  const summary = milestoneSummary(input.steps, current);

  const message =
    input.statusMessage ??
    (options.retrying && summary.failed
      ? "Retrying: " + summary.failed.label
      : summary.message);

  return {
    input,
    options,
    id,
    statusRef,
    summary,
    message,
    props: kiraProgressIndicatorNativeProps(input),
  };
}

type KiraProgressIndicatorModel = ReturnType<
  typeof useKiraProgressIndicatorModel
>;

function KiraProgressIndicatorSteps({
  input,
  options,
}: KiraProgressIndicatorModel) {
  return (
    <ProgressIndicator
      size={options.size}
      variant={options.variant}
      orientation={options.orientation}
      responsive={options.responsive}
      clickable={options.clickable}
      animated={options.animated}
      showDescription={options.showDescription}
      showLabel={options.showLabel}
      showStatus={options.showStatus}
      disabled={options.disabled}
      readOnly={options.readOnly}
      steps={input.steps}
      currentStep={input.currentStep}
      disabledReason={input.disabledReason}
      emptyMessage={input.emptyMessage}
      onStepClick={input.onStepClick}
      aria-label={input.label + " steps"}
    />
  );
}

function KiraProgressIndicatorPhase({
  input,
  options,
  summary,
}: KiraProgressIndicatorModel) {
  if (input.progress === undefined) return null;

  return (
    <div data-slot="kira-progress-indicator-progress" className="space-y-2">
      <p
        data-slot="kira-progress-indicator-progress-label"
        className="text-xs text-muted-foreground"
      >
        {input.progressLabel ?? summary.active?.label ?? "Current phase"}
      </p>
      <Progress
        value={input.progress}
        size="sm"
        variant={options.variant}
        animated={options.animated}
        showLabel
        paused={Boolean(summary.paused)}
        aria-label={
          input.progressLabel ??
          (summary.active?.label ?? input.label) + " progress"
        }
      />
    </div>
  );
}

function KiraProgressIndicatorRecovery({
  input,
  options,
  summary,
  statusRef,
}: KiraProgressIndicatorModel) {
  const failed = summary.failed;
  const onRetry = input.onRetry;

  if (!failed || !onRetry || options.readOnly) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      data-slot="kira-progress-indicator-retry"
      disabled={options.disabled || options.retrying}
      aria-busy={options.retrying || undefined}
      focusableWhenDisabled={options.retrying}
      className="h-auto min-h-8 max-w-full shrink-0 py-2 whitespace-normal"
      onClick={() => {
        if (options.disabled || options.retrying) return;
        statusRef.current?.focus();
        onRetry(failed.value);
      }}
    >
      {input.retryLabel ?? "Retry " + (failed.label.trim() || "step")}
    </Button>
  );
}

function KiraProgressIndicatorView(model: KiraProgressIndicatorModel) {
  const { input, id, statusRef, message, summary, props } = model;

  return (
    <div
      data-slot="kira-progress-indicator"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This ARIA group preserves the composite layout without form semantics.
      role="group"
      {...props}
      aria-labelledby={id + "-label"}
      aria-describedby={
        [
          input["aria-describedby"],
          input.description == null ? undefined : id + "-description",
        ]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={cn("w-full min-w-0 space-y-5", input.className)}
    >
      <div data-slot="kira-progress-indicator-heading" className="space-y-1">
        <p
          id={id + "-label"}
          data-slot="kira-progress-indicator-label"
          className="wrap-anywhere text-sm font-medium"
        >
          {input.label}
        </p>
        {input.description != null && (
          <div
            id={id + "-description"}
            data-slot="kira-progress-indicator-description"
            className="wrap-anywhere text-sm text-muted-foreground"
          >
            {input.description}
          </div>
        )}
      </div>
      <KiraProgressIndicatorSteps {...model} />
      <KiraProgressIndicatorPhase {...model} />
      <div
        data-slot="kira-progress-indicator-footer"
        className="flex flex-wrap items-center gap-3"
      >
        <KiraProgressIndicatorStatusView
          statusRef={statusRef}
          message={message}
          steps={input.steps}
          summary={summary}
        />
        <KiraProgressIndicatorRecovery {...model} />
      </div>
    </div>
  );
}

function useKiraProgressIndicatorOptions({
  retrying: retryingInput,
  size: sizeInput,
  variant: variantInput,
  orientation: orientationInput,
  responsive: responsiveInput,
  clickable: clickableInput,
}: Parameters<typeof resolveKiraProgressIndicatorOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraProgressIndicatorOptions({
        retrying: retryingInput,
        size: sizeInput,
        variant: variantInput,
        orientation: orientationInput,
        responsive: responsiveInput,
        clickable: clickableInput,
      }),
    [
      retryingInput,
      sizeInput,
      variantInput,
      orientationInput,
      responsiveInput,
      clickableInput,
    ],
  );
}

function useKiraProgressIndicatorOptions2({
  animated: animatedInput,
  showDescription: showDescriptionInput,
  showLabel: showLabelInput,
  showStatus: showStatusInput,
  disabled: disabledInput,
  readOnly: readOnlyInput,
}: Parameters<typeof resolveKiraProgressIndicatorOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveKiraProgressIndicatorOptions2({
        animated: animatedInput,
        showDescription: showDescriptionInput,
        showLabel: showLabelInput,
        showStatus: showStatusInput,
        disabled: disabledInput,
        readOnly: readOnlyInput,
      }),
    [
      animatedInput,
      showDescriptionInput,
      showLabelInput,
      showStatusInput,
      disabledInput,
      readOnlyInput,
    ],
  );
}

function progressIndicatorUseEffect(
  ref: React.RefObject<HTMLOListElement | null>,
) {
  const element = ref.current;

  if (!element) return;

  let intersecting = false;

  const update = () => {
    element.style.setProperty(
      "--progress-step-play-state",
      intersecting && document.visibilityState !== "hidden"
        ? "running"
        : "paused",
    );
  };

  const rect = element.getBoundingClientRect();
  intersecting =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight;
  update();

  const observer = new IntersectionObserver(([entry]) => {
    intersecting = entry.isIntersecting;
    update();
  });

  observer.observe(element);
  document.addEventListener("visibilitychange", update);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
  };
}
