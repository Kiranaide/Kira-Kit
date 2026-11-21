/* oxlint-disable react/only-export-components -- public compound component and variant exports */
"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconCheck,
  IconX,
  IconLoader2,
  IconArrowRight,
  IconArrowLeft,
  IconPlayerSkipForward,
} from "@tabler/icons-react";
import { z } from "zod";
import { cn } from "cn";
import { useAnnounce } from "@/hooks/use-announce";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";

const stepperVariants = cva("w-full min-w-0 space-y-6", {
  variants: {
    orientation: { horizontal: "", vertical: "" },
    size: {
      sm: "[--step-size:1.75rem] [--step-gap:0.5rem]",
      default: "[--step-size:2.25rem] [--step-gap:0.75rem]",
      lg: "[--step-size:2.75rem] [--step-gap:1rem]",
    },
  },
  defaultVariants: { orientation: "horizontal", size: "default" },
});

const stepperItemVariants = cva("group/step relative min-w-0", {
  variants: {
    orientation: {
      horizontal: "flex-1",
      vertical: "w-full pb-6 last:pb-0",
    },
    clickable: { true: "", false: "" },
  },
  defaultVariants: { orientation: "horizontal", clickable: false },
});

const stepperIndicatorVariants = cva(
  "relative z-10 flex size-[var(--step-size)] shrink-0 items-center justify-center rounded-full border font-medium tabular-nums motion-safe:transition-[color,background-color,border-color,box-shadow] motion-safe:duration-200",
  {
    variants: {
      size: { sm: "text-xs", default: "text-sm", lg: "text-base" },
      state: {
        pending: "border-border bg-background text-muted-foreground",
        active:
          "border-primary bg-primary text-background ring-4 ring-primary/15",
        completed: "border-primary/20 bg-primary/10 text-primary",
        error: "border-destructive/30 bg-destructive/10 text-destructive",
        loading: "border-primary/30 bg-background text-primary",
        skipped:
          "border-dashed border-border bg-background text-muted-foreground",
      },
    },
    defaultVariants: { size: "default", state: "pending" },
  },
);

const stepperSeparatorVariants = cva(
  "pointer-events-none absolute motion-safe:transition-colors motion-safe:duration-200",
  {
    variants: {
      orientation: {
        horizontal:
          "start-[calc(50%+var(--step-size)/2+var(--step-gap))] end-[calc(-50%+var(--step-size)/2+var(--step-gap))] top-[calc(var(--step-size)/2+0.25rem)] h-px",
        vertical:
          "start-[calc(var(--step-size)/2+0.25rem)] top-[calc(var(--step-size)+0.75rem)] bottom-2 w-px",
      },
      state: {
        pending: "bg-border",
        active: "bg-border",
        completed: "bg-primary/50",
      },
    },
    defaultVariants: { orientation: "horizontal", state: "pending" },
  },
);

const stepperContentVariants = cva("min-w-0 space-y-1", {
  variants: {
    orientation: {
      horizontal: "w-full text-center",
      vertical: "flex-1 pt-1 text-start",
    },
  },
  defaultVariants: { orientation: "horizontal" },
});

type StepState =
  "pending" | "active" | "completed" | "error" | "loading" | "skipped";

interface StepRegistration {
  condition: boolean;
  disabled: boolean;
  optional: boolean;
}

interface StepperProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "onChange">,
    VariantProps<typeof stepperVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  linear?: boolean;
  editable?: boolean;
  completedSteps?: number[];
  errorSteps?: number[];
  loadingSteps?: number[];
  skippedSteps?: number[];
  skippableSteps?: number[];
  onSkip?: (step: number) => void;
  onComplete?: () => void;
  persistKey?: string;
  /** Stack horizontal steps below sm; disable to keep a compact horizontal rail. */
  mobileStacked?: boolean;
  children: React.ReactNode;
}

const savedStepperSchema = z.object({
  currentStep: z.number().int().nonnegative(),
  skippedSteps: z.array(z.number().int().nonnegative()).default([]),
});

function readStepperStorage(
  persistKey: string | undefined,
  defaultValue: number,
) {
  const skippedSteps: number[] = [];
  const fallback = { currentStep: defaultValue, skippedSteps };

  if (!persistKey) return fallback;

  try {
    const saved = savedStepperSchema.safeParse(
      JSON.parse(localStorage.getItem(`stepper-${persistKey}`) ?? "null"),
    );

    return saved.success ? saved.data : fallback;
  } catch {
    return fallback;
  }
}

function useStepperValue(props: StepperProps) {
  const {
    persistKey,
    defaultValue = 0,
    value: controlledValue,
    onValueChange,
  } = props;

  const [stored, setStored] = React.useState(() => ({
    key: persistKey,
    ...readStepperStorage(persistKey, defaultValue),
  }));

  if (stored.key !== persistKey) {
    setStored({
      key: persistKey,
      ...readStepperStorage(persistKey, defaultValue),
    });
  }

  const value = controlledValue ?? stored.currentStep;

  const skippedSteps = React.useMemo(
    () => new Set([...stored.skippedSteps, ...(props.skippedSteps ?? [])]),
    [stored.skippedSteps, props.skippedSteps],
  );

  React.useEffect(() => {
    if (!persistKey) return;

    try {
      localStorage.setItem(
        `stepper-${persistKey}`,
        JSON.stringify({ currentStep: value, skippedSteps: [...skippedSteps] }),
      );
    } catch {
      // Storage can be unavailable or full; navigation remains usable.
    }
  }, [persistKey, value, skippedSteps]);

  const changeValue = (next: number) => {
    if (controlledValue === undefined)
      setStored((previous) => ({ ...previous, currentStep: next }));

    onValueChange?.(next);
  };

  const skipStep = (step: number) => {
    setStored((previous) => ({
      ...previous,
      skippedSteps: [...new Set([...previous.skippedSteps, step])],
    }));
    props.onSkip?.(step);
  };

  const unskipStep = (step: number) => {
    setStored((previous) => ({
      ...previous,
      skippedSteps: previous.skippedSteps.filter((item) => item !== step),
    }));
  };

  return {
    value,
    onValueChange: changeValue,
    skippedSteps,
    skipStep,
    unskipStep,
  };
}

function useStepRegistry() {
  const [entries, setEntries] = React.useState(
    new Map<number, StepRegistration>(),
  );

  const registerStep = React.useCallback(
    (index: number, condition = true, disabled = false, optional = false) => {
      setEntries((previous) =>
        new Map(previous).set(index, { condition, disabled, optional }),
      );
    },
    [],
  );

  const unregisterStep = React.useCallback((index: number) => {
    setEntries((previous) => {
      const next = new Map(previous);
      next.delete(index);

      return next;
    });
  }, []);

  const visibleSteps = [...entries]
    .flatMap(([index, item]) => (item.condition ? [index] : []))
    .sort((a, b) => a - b);

  const enabledSteps = visibleSteps.filter(
    (index) => !entries.get(index)?.disabled,
  );

  const optionalSteps = visibleSteps.filter(
    (index) => entries.get(index)?.optional,
  );

  return {
    registerStep,
    unregisterStep,
    visibleSteps,
    enabledSteps,
    optionalSteps,
  };
}

function stepState(
  index: number,
  value: number,
  sets: {
    loadingSteps: Set<number>;
    errorSteps: Set<number>;
    skippedSteps: Set<number>;
    completedSteps: Set<number>;
  },
): StepState {
  if (sets.loadingSteps.has(index)) return "loading";

  if (sets.errorSteps.has(index)) return "error";

  if (sets.skippedSteps.has(index)) return "skipped";

  if (sets.completedSteps.has(index)) return "completed";

  if (index === value) return "active";

  if (sets.completedSteps.has(index) || index < value) return "completed";

  return "pending";
}

function useStepAccess(
  props: StepperProps,
  state: ReturnType<typeof useStepperValue>,
  registry: ReturnType<typeof useStepRegistry>,
) {
  const { value } = state;
  const { linear = false, editable = true } = props;
  const completedSteps = new Set(props.completedSteps);
  const errorSteps = new Set(props.errorSteps);
  const loadingSteps = new Set(props.loadingSteps);

  const skippableSteps = new Set([
    ...(props.skippableSteps ?? []),
    ...registry.optionalSteps,
  ]);

  const sets = {
    completedSteps,
    errorSteps,
    loadingSteps,
    skippedSteps: state.skippedSteps,
  };

  const currentVisibleIndex = registry.visibleSteps.indexOf(value);

  const canNavigateTo = (index: number) => {
    if (!registry.enabledSteps.includes(index) || loadingSteps.has(value))
      return false;

    if (index === value) return true;

    if (index < value) return editable;

    if (!linear) return true;

    return (
      index === registry.enabledSteps.find((step) => step > value) &&
      completedSteps.has(value)
    );
  };

  return {
    ...sets,
    skippableSteps,
    linear,
    editable,
    currentVisibleIndex,
    totalSteps: registry.visibleSteps.length,
    visibleStepsCount: registry.visibleSteps.length,
    getStepState: (index: number) => stepState(index, value, sets),
    isStepVisible: (index: number) => registry.visibleSteps.includes(index),
    canNavigateTo,
  };
}

function useStepperModel(props: StepperProps) {
  const id = React.useId();
  const state = useStepperValue(props);
  const registry = useStepRegistry();
  const access = useStepAccess(props, state, registry);
  const { announce } = useAnnounce();

  const announceStep = (step: number, title?: string) => {
    const position = registry.visibleSteps.indexOf(step) + 1;
    const suffix = title ? ": " + title : "";
    announce(`Step ${position} of ${access.totalSteps}${suffix}`);
  };

  const focusStep = (index: number) =>
    document
      .getElementById(`${id}-step-${index}`)
      ?.querySelector<HTMLButtonElement>("button")
      ?.focus();

  const onValueChange = (next: number) => {
    state.onValueChange(next);

    if (
      next === registry.visibleSteps.at(-1) &&
      access.completedSteps.has(next)
    )
      props.onComplete?.();
  };

  const skipStep = (index: number) => {
    if (access.skippableSteps.has(index)) state.skipStep(index);
  };

  return {
    ...state,
    ...registry,
    ...access,
    id,
    announceStep,
    focusStep,
    onValueChange,
    skipStep,
    orientation: props.orientation ?? "horizontal",
    size: props.size ?? "default",
  };
}

type StepperContextValue = ReturnType<typeof useStepperModel>;

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = React.useContext(StepperContext);

  if (!context)
    throw new Error("Stepper components must be used within Stepper");

  return context;
}

function flattenSteps(children: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (
      React.isValidElement<{ children?: React.ReactNode }>(child) &&
      child.type === React.Fragment
    )
      return flattenSteps(child.props.children);

    return [child];
  });
}

function isStepperPart(child: React.ReactNode, name: string) {
  if (!React.isValidElement(child)) return false;

  // Display names survive React Fast Refresh replacing a forwardRef object.
  // SAFETY: React component types can have displayName; tag-name strings safely yield undefined.
  return (child.type as React.NamedExoticComponent).displayName === name;
}

function isItem(child: React.ReactNode) {
  return isStepperPart(child, "StepperItem");
}

const Stepper = React.forwardRef<HTMLElement, StepperProps>(
  function StepperRoot(props, ref) {
    const model = useStepperModel(props);

    const {
      children,
      className,
      orientation: _orientation,
      size: _size,
      value: _value,
      defaultValue: _defaultValue,
      onValueChange: _onValueChange,
      linear: _linear,
      editable: _editable,
      completedSteps: _completedSteps,
      errorSteps: _errorSteps,
      loadingSteps: _loadingSteps,
      skippedSteps: _skippedSteps,
      skippableSteps: _skippableSteps,
      onSkip: _onSkip,
      onComplete: _onComplete,
      persistKey: _persistKey,
      mobileStacked = true,
      ...rootProps
    } = props;

    const allChildren = flattenSteps(children);
    const rail = allChildren.filter(isItem);
    const body = allChildren.filter((child) => !isItem(child));

    return (
      <StepperContext.Provider value={model}>
        <nav
          ref={ref}
          aria-label="Progress steps"
          data-slot="stepper"
          data-orientation={model.orientation}
          className={cn(
            stepperVariants({
              orientation: model.orientation,
              size: model.size,
            }),
            mobileStacked &&
              model.orientation === "horizontal" &&
              mobileStackClasses,
            className,
          )}
          {...rootProps}
        >
          {rail.length > 0 && (
            <ol
              data-slot="stepper-list"
              className={cn(
                "isolate flex w-full min-w-0",
                model.orientation === "vertical" ? "flex-col" : "items-start",
              )}
            >
              {rail}
            </ol>
          )}
          {body}
        </nav>
      </StepperContext.Provider>
    );
  },
);

interface StepperItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: number;
  optional?: boolean;
  disabled?: boolean;
  condition?: boolean;
  title?: string;
  children: React.ReactNode;
}

interface StepperItemContextValue {
  stepValue: number;
  state: StepState;
  isActive: boolean;
  optional: boolean;
  disabled: boolean;
  isLast: boolean;
  title?: string;
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(
  null,
);

function useStepperItemContext() {
  const context = React.useContext(StepperItemContext);

  if (!context)
    throw new Error(
      "StepperIndicator/StepperContent must be used within StepperItem",
    );

  return context;
}

function handleStepKey(
  event: React.KeyboardEvent<HTMLButtonElement>,
  model: StepperContextValue,
  step: number,
) {
  const candidates = model.visibleSteps.filter(model.canNavigateTo);
  const current = candidates.indexOf(step);

  const horizontal =
    model.orientation === "horizontal" &&
    getComputedStyle(event.currentTarget).flexDirection === "column";

  const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
  const right = rtl ? "ArrowLeft" : "ArrowRight";
  const forward = horizontal ? right : "ArrowDown";
  const left = rtl ? "ArrowRight" : "ArrowLeft";
  const backward = horizontal ? left : "ArrowUp";

  const targets = new Map([
    [forward, Math.min(current + 1, candidates.length - 1)],
    [backward, Math.max(current - 1, 0)],
    ["Home", 0],
    ["End", candidates.length - 1],
  ]);

  const target = targets.get(event.key);

  if (target === undefined) return;

  event.preventDefault();
  const next = candidates[target];

  if (next !== undefined) model.focusStep(next);
}

function StepTarget({ children }: { children: React.ReactNode }) {
  const model = useStepperContext();
  const item = useStepperItemContext();
  const navigable = model.canNavigateTo(item.stepValue) && !item.disabled;

  const activate = () => {
    if (!navigable || item.isActive) return;

    model.onValueChange(item.stepValue);
    model.announceStep(item.stepValue, item.title);
  };

  return (
    <button
      type="button"
      data-slot="stepper-item-button"
      aria-current={item.isActive ? "step" : undefined}
      aria-disabled={!navigable || undefined}
      aria-busy={item.state === "loading" || undefined}
      tabIndex={navigable ? 0 : -1}
      onClick={activate}
      onKeyDown={(event) => handleStepKey(event, model, item.stepValue)}
      className={cn(
        "relative flex min-h-11 w-full min-w-0 rounded-lg p-1 text-start outline-none focus-visible:ring-[3px] focus-visible:ring-ring motion-safe:transition-colors motion-safe:duration-150",
        model.orientation === "horizontal"
          ? "flex-col items-center gap-3"
          : "items-start gap-3",
        navigable
          ? "cursor-pointer hover:bg-muted/50 active:bg-muted"
          : "cursor-default",
        item.disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {children}
      <span className="sr-only">{item.state}</span>
    </button>
  );
}

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  function StepperItemRoot(
    {
      value: stepValue,
      optional = false,
      disabled = false,
      condition = true,
      title,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const model = useStepperContext();
    const { registerStep, unregisterStep } = model;

    React.useEffect(() => {
      registerStep(stepValue, condition, disabled, optional);

      return () => unregisterStep(stepValue);
    }, [
      stepValue,
      condition,
      disabled,
      optional,
      registerStep,
      unregisterStep,
    ]);

    const item = {
      stepValue,
      state: model.getStepState(stepValue),
      isActive: stepValue === model.value,
      optional: optional || model.skippableSteps.has(stepValue),
      disabled,
      isLast: stepValue === model.visibleSteps.at(-1),
      title,
    };

    const childArray = React.Children.toArray(children);

    const separators = childArray.filter((child) =>
      isStepperPart(child, "StepperSeparator"),
    );

    const content = childArray.filter((child) => !separators.includes(child));

    if (!condition) return null;

    return (
      <StepperItemContext.Provider value={item}>
        <li
          ref={ref}
          id={`${model.id}-step-${stepValue}`}
          data-slot="stepper-item"
          data-state={item.state}
          data-value={stepValue}
          data-optional={item.optional || undefined}
          data-skippable={item.optional || undefined}
          data-disabled={disabled || undefined}
          className={cn(
            stepperItemVariants({
              orientation: model.orientation,
              clickable: model.canNavigateTo(stepValue),
            }),
            className,
          )}
          {...props}
        >
          <StepTarget>{content}</StepTarget>
          {separators}
        </li>
      </StepperItemContext.Provider>
    );
  },
);

StepperItem.displayName = "StepperItem";

interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  completedIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

const StepperIndicator = React.forwardRef<
  HTMLDivElement,
  StepperIndicatorProps
>(function StepperIndicatorRoot(
  {
    completedIcon = <IconCheck className="size-4" />,
    errorIcon = <IconX className="size-4" />,
    loadingIcon,
    className,
    children,
    ...props
  },
  ref,
) {
  const model = useStepperContext();
  const item = useStepperItemContext();
  const reduced = useReducedMotion();

  const icons = {
    completed: completedIcon,
    error: errorIcon,
    loading: loadingIcon ?? (
      <IconLoader2 className={cn("size-4", !reduced && "animate-spin")} />
    ),
    skipped: <IconPlayerSkipForward className="size-4" />,
  };

  const number = Math.max(model.visibleSteps.indexOf(item.stepValue), 0) + 1;

  const stateIcon = Object.entries(icons).find(
    ([state]) => state === item.state,
  )?.[1];

  const content = stateIcon ?? children ?? number;

  return (
    <div
      ref={ref}
      data-slot="stepper-indicator"
      aria-hidden="true"
      className={cn(
        stepperIndicatorVariants({ size: model.size, state: item.state }),
        className,
      )}
      {...props}
    >
      {content}
    </div>
  );
});

interface StepperTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepperTitle = React.forwardRef<HTMLDivElement, StepperTitleProps>(
  function StepperTitleRoot({ className, children, ...props }, ref) {
    const { state, optional } = useStepperItemContext();

    return (
      <div
        ref={ref}
        data-slot="stepper-title"
        className={cn(
          "text-sm font-medium leading-5 wrap-anywhere text-foreground",
          state === "pending" && "text-muted-foreground",
          state === "error" && "text-destructive",
          className,
        )}
        {...props}
      >
        {children}
        {optional && (
          <span
            data-slot="stepper-optional"
            className="block text-xs font-normal text-muted-foreground"
          >
            Optional
          </span>
        )}
      </div>
    );
  },
);

interface StepperDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  StepperDescriptionProps
>(function StepperDescriptionRoot({ className, children, ...props }, ref) {
  const { state } = useStepperItemContext();

  return (
    <p
      ref={ref}
      data-slot="stepper-description"
      className={cn(
        "text-xs leading-5 text-muted-foreground wrap-anywhere",
        state === "error" && "text-destructive",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
});

type StepperSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  StepperSeparatorProps
>(function StepperSeparatorRoot({ className, ...props }, ref) {
  const { orientation } = useStepperContext();
  const { state, isLast } = useStepperItemContext();

  if (isLast) return null;

  return (
    <div
      ref={ref}
      data-slot="stepper-separator"
      aria-hidden="true"
      className={cn(
        stepperSeparatorVariants({
          orientation,
          state: state === "completed" ? "completed" : "pending",
        }),
        className,
      )}
      {...props}
    />
  );
});

StepperSeparator.displayName = "StepperSeparator";

interface StepperContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const StepperContent = React.forwardRef<HTMLDivElement, StepperContentProps>(
  function StepperContentRoot({ className, children, ...props }, ref) {
    const { orientation } = useStepperContext();

    return (
      <div
        ref={ref}
        data-slot="stepper-content"
        className={cn(stepperContentVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

interface StepperPanelProps extends React.HTMLAttributes<HTMLElement> {
  value: number;
  forceMount?: boolean;
  children: React.ReactNode;
}

const StepperPanel = React.forwardRef<HTMLElement, StepperPanelProps>(
  function StepperPanelRoot(
    { value, forceMount = false, className, children, ...props },
    ref,
  ) {
    const model = useStepperContext();
    const active = value === model.value;

    if (!active && !forceMount) return null;

    return (
      <section
        ref={ref}
        id={`${model.id}-panel-${value}`}
        aria-labelledby={`${model.id}-step-${value}`}
        hidden={!active}
        data-slot="stepper-panel"
        data-state={active ? "active" : "inactive"}
        className={cn(
          "min-w-0 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring",
          !active && "hidden",
          className,
        )}
        {...props}
      >
        {children}
      </section>
    );
  },
);

interface StepperActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StepperActions = React.forwardRef<HTMLDivElement, StepperActionsProps>(
  function StepperActionsRoot({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="stepper-actions"
        className={cn("flex flex-wrap items-center gap-3 pt-4", className)}
        {...props}
      />
    );
  },
);

interface StepperProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  showLabels?: boolean;
  labels?: string[];
  steps?: number;
}

const StepperProgress = React.forwardRef<HTMLDivElement, StepperProgressProps>(
  function StepperProgressRoot(
    { showLabels = false, labels = [], steps, className, ...props },
    ref,
  ) {
    const model = useStepperContext();
    const total = Math.max(0, steps ?? (labels.length || model.totalSteps));

    const index =
      model.totalSteps > 0 ? model.currentVisibleIndex : model.value;

    const position = Math.max(0, Math.min(total, index + 1));

    const progress =
      total > 1 ? Math.max(0, Math.min(100, (index / (total - 1)) * 100)) : 0;

    const reduced = useReducedMotion();

    return (
      <div
        ref={ref}
        data-slot="stepper-progress"
        className={cn("w-full min-w-0 space-y-2", className)}
        {...props}
      >
        <div
          data-slot="stepper-progress-caption"
          className="flex items-center justify-between gap-3 text-xs text-muted-foreground"
        >
          <span>
            Step {position} of {total}
          </span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
        </div>
        <ProgressPrimitive.Root
          value={progress}
          aria-label="Step progress"
          aria-valuetext={`Step ${position} of ${total}`}
          data-slot="stepper-progress-track"
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            data-slot="stepper-progress-fill"
            className={cn(
              "h-full w-full origin-left rounded-full bg-primary rtl:origin-right",
              !reduced && "transition-transform duration-200 ease-out",
            )}
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </ProgressPrimitive.Root>
        {showLabels && labels.length > 0 && (
          <div
            data-slot="stepper-progress-labels"
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${labels.length}, minmax(0, 1fr))`,
            }}
          >
            {labels.map((label) => (
              <span
                key={label}
                className="text-xs leading-5 text-muted-foreground wrap-anywhere"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  },
);

interface StepperNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  showBack?: boolean;
  showNext?: boolean;
  showSkip?: boolean;
  backLabel?: string;
  nextLabel?: string;
  skipLabel?: string;
  finishLabel?: string;
  onBack?: () => void;
  onNext?: () => Promise<boolean> | boolean;
  onSkip?: () => void;
  onFinish?: () => void;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  loading?: boolean;
}

function useStepNavigation(props: StepperNavigationProps) {
  const model = useStepperContext();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const inFlight = React.useRef(false);
  const revision = React.useRef(0);
  React.useEffect(
    () => () => {
      revision.current += 1;
    },
    [model.value],
  );
  const latestModel = React.useRef(model);
  React.useEffect(() => {
    latestModel.current = model;
  }, [model]);
  const candidates = model.enabledSteps;
  const previous = [...candidates].reverse().find((step) => step < model.value);
  const next = candidates.find((step) => step > model.value);
  const isLast = next === undefined;
  const busy = pending || props.loading || model.loadingSteps.has(model.value);

  const go = (step: number | undefined) => {
    if (step === undefined) return;

    latestModel.current.onValueChange(step);
    latestModel.current.announceStep(step);
  };

  const back = () => {
    if (props.onBack) props.onBack();
    else go(previous);
  };

  const skip = () => {
    if (props.onSkip) props.onSkip();
    else {
      model.skipStep(model.value);
      go(next);
    }
  };

  const advance = async () => {
    if (inFlight.current || busy) return;

    const requestRevision = revision.current;
    inFlight.current = true;
    setPending(true);
    setError("");

    try {
      if (props.onNext && !(await props.onNext())) return;

      if (requestRevision !== revision.current) return;

      const destination = latestModel.current.enabledSteps.find(
        (step) => step > latestModel.current.value,
      );

      if (destination === undefined) props.onFinish?.();
      else go(destination);
    } catch {
      setError("Couldn't continue. Try again.");
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  };

  return {
    model,
    busy,
    error,
    back,
    skip,
    advance,
    isFirst: previous === undefined,
    isLast,
  };
}

function StepLoadingIcon() {
  const reduced = useReducedMotion();

  return (
    <IconLoader2
      aria-hidden="true"
      className={cn("size-4", !reduced && "animate-spin")}
    />
  );
}

function StepNextButton({
  props,
  navigation,
}: {
  props: StepperNavigationProps;
  navigation: ReturnType<typeof useStepNavigation>;
}) {
  if (props.showNext === false) return null;

  const nextLabel = props.nextLabel ?? "Continue";
  const finishLabel = props.finishLabel ?? "Finish";
  const label = navigation.isLast ? finishLabel : nextLabel;

  const disabled = Boolean(
    props.nextDisabled || navigation.busy || navigation.model.totalSteps === 0,
  );

  const showArrow = !navigation.isLast && !navigation.busy;

  return (
    <Button
      type="button"
      onClick={navigation.advance}
      className="text-background hover:bg-primary hover:brightness-95"
      disabled={disabled}
      aria-busy={navigation.busy}
    >
      {navigation.busy && <StepLoadingIcon />}
      {label}
      {showArrow && (
        <IconArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
      )}
    </Button>
  );
}

function StepBackButton({
  show,
  label,
  disabled,
  navigation,
}: {
  show: boolean;
  label: string;
  disabled?: boolean;
  navigation: ReturnType<typeof useStepNavigation>;
}) {
  if (!show) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={navigation.back}
      disabled={disabled || navigation.isFirst || navigation.busy}
    >
      <IconArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
      {label}
    </Button>
  );
}

const StepperNavigation = React.forwardRef<
  HTMLDivElement,
  StepperNavigationProps
>(function StepperNavigationRoot(props, ref) {
  const navigation = useStepNavigation(props);

  const {
    className,
    showBack = true,
    showSkip = true,
    backLabel = "Back",
    skipLabel = "Skip for now",
    backDisabled,
    showNext: _showNext,
    nextLabel: _nextLabel,
    finishLabel: _finishLabel,
    onBack: _onBack,
    onNext: _onNext,
    onSkip: _onSkip,
    onFinish: _onFinish,
    nextDisabled: _nextDisabled,
    loading: _loading,
    ...rootProps
  } = props;

  const errorId = React.useId();

  const showSkipButton =
    showSkip &&
    navigation.model.skippableSteps.has(navigation.model.value) &&
    !navigation.isLast;

  return (
    <div
      ref={ref}
      data-slot="stepper-navigation"
      className={cn("space-y-3 border-t border-border pt-5", className)}
      {...rootProps}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StepBackButton
          show={showBack}
          label={backLabel}
          disabled={backDisabled}
          navigation={navigation}
        />
        <div className="ms-auto flex flex-wrap items-center gap-2">
          {showSkipButton && (
            <Button
              type="button"
              variant="ghost"
              onClick={navigation.skip}
              disabled={navigation.busy}
            >
              {skipLabel}
            </Button>
          )}
          <StepNextButton props={props} navigation={navigation} />
        </div>
      </div>
      {navigation.error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {navigation.error}
        </p>
      )}
    </div>
  );
});

interface KiraStepperStep {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
  icon?: React.ReactNode;
}

interface KiraStepperProps extends Omit<StepperProps, "children"> {
  steps: KiraStepperStep[];
  mobileStacked?: boolean;
  children?: React.ReactNode;
}

const mobileStackClasses =
  "[&>[data-slot=stepper-list]]:max-sm:flex-col [&_[data-slot=stepper-item]]:max-sm:w-full [&_[data-slot=stepper-item]]:max-sm:flex-none [&_[data-slot=stepper-item]]:max-sm:pb-6 [&_[data-slot=stepper-item]:last-child]:max-sm:pb-0 [&_[data-slot=stepper-item-button]]:max-sm:flex-row [&_[data-slot=stepper-item-button]]:max-sm:items-start [&_[data-slot=stepper-content]]:max-sm:w-auto [&_[data-slot=stepper-content]]:max-sm:flex-1 [&_[data-slot=stepper-content]]:max-sm:pt-1 [&_[data-slot=stepper-content]]:max-sm:text-start [&_[data-slot=stepper-separator]]:max-sm:start-[calc(var(--step-size)/2+0.25rem)] [&_[data-slot=stepper-separator]]:max-sm:end-auto [&_[data-slot=stepper-separator]]:max-sm:top-[calc(var(--step-size)+0.75rem)] [&_[data-slot=stepper-separator]]:max-sm:bottom-2 [&_[data-slot=stepper-separator]]:max-sm:h-auto [&_[data-slot=stepper-separator]]:max-sm:w-px";

function KiraStepper({
  steps,
  mobileStacked = true,
  orientation = "horizontal",
  className,
  children,
  ...props
}: KiraStepperProps) {
  return (
    <Stepper
      orientation={orientation}
      mobileStacked={mobileStacked}
      className={className}
      {...props}
    >
      {steps.map((step, index) => (
        <StepperItem
          key={step.id}
          value={index}
          optional={step.optional}
          title={step.title}
        >
          <StepperIndicator>{step.icon}</StepperIndicator>
          <StepperContent>
            <StepperTitle>{step.title}</StepperTitle>
            {step.description && (
              <StepperDescription>{step.description}</StepperDescription>
            )}
          </StepperContent>
          <StepperSeparator />
        </StepperItem>
      ))}
      {children}
    </Stepper>
  );
}

export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
  StepperPanel,
  StepperActions,
  StepperProgress,
  StepperNavigation,
  KiraStepper,
  stepperVariants,
  stepperItemVariants,
  stepperIndicatorVariants,
  stepperSeparatorVariants,
  stepperContentVariants,
  useStepperContext,
  useStepperItemContext,
};

export type {
  StepperProps,
  StepperItemProps,
  StepperIndicatorProps,
  StepperTitleProps,
  StepperDescriptionProps,
  StepperSeparatorProps,
  StepperContentProps,
  StepperPanelProps,
  StepperActionsProps,
  StepperProgressProps,
  StepperNavigationProps,
  StepState,
  KiraStepperProps,
  KiraStepperStep,
};
