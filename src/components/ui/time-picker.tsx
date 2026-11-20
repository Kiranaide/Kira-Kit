"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { format, isValid, set } from "date-fns";
import { IconClock, IconMinus, IconPlus, IconX } from "@tabler/icons-react";
import { cn } from "cn";

/*                                   Trigger                                  */

const timePickerTriggerVariants = cva(
  [
    "relative flex w-full items-center gap-2 rounded-lg border transition-colors",
    "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
    "has-[[aria-expanded=true]]:ring-2 has-[[aria-expanded=true]]:ring-ring/60",
    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
    "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/30",
  ],
  {
    variants: {
      variant: {
        default: "border-input bg-background hover:bg-muted/50",
        outline: "border-2 border-input bg-transparent hover:border-primary/50",
        ghost: "border-transparent bg-transparent hover:bg-muted/50",
      },
      size: {
        // kira-kit-ignore spacing-scale: date/time-picker trigger ladder is a documented non-change (PR follow-up)
        sm: "h-8 px-2.5 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

/*                                    Types                                   */

type TimeGranularity = "minute" | "second";

/** Panel content: stepper fields, preset cell grid, or both (default). */
type TimePickerVariant = "full" | "stepper" | "grid";

interface TimePickerProps extends Omit<
  VariantProps<typeof timePickerTriggerVariants>,
  "variant"
> {
  /** Time-of-day is taken from the value's hours/minutes/seconds. */
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  /** "second" adds a seconds stepper field. Default "minute". */
  granularity?: TimeGranularity;
  /** Panel content. Default "stepper"; "grid" shows presets + cell grids, "full" stacks both. */
  variant?: TimePickerVariant;
  /** Trigger styling. Default "default". */
  triggerVariant?: VariantProps<typeof timePickerTriggerVariants>["variant"];
  /** Default 1. */
  hourStep?: number;
  /** Default 1; cell grid uses this step too. */
  minuteStep?: number;
  /** Default 1; only used when granularity is "second". */
  secondStep?: number;
  /** Default 24. 12 shows an AM/PM toggle on the right of the fields. */
  hourCycle?: 12 | 24;
  /** Inclusive lower bound, "HH:mm" or "HH:mm:ss". */
  minTime?: string;
  /** Inclusive upper bound, "HH:mm" or "HH:mm:ss". */
  maxTime?: string;
  disabled?: boolean;
  /** Exact "HH:mm"(:ss) matches that can't be picked. */
  disabledTimes?: string[];
  /** Quick-pick times, "HH:mm". Default: ["09:00", "12:30", "17:00", "21:00"]. */
  presets?: string[];
  placeholder?: string;
  /** date-fns pattern. Defaults to "HH:mm" ("HH:mm:ss" for second granularity). */
  displayFormat?: string;
  /** false renders the panel bare, without popover chrome (for embedding). */
  popover?: boolean;
  id?: string;
  required?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  className?: string;
}

/*                                   Helpers                                  */

// kira-kit-ignore spacing-scale: date/time-picker trigger ladder is a documented non-change (PR follow-up)
const iconSize = { sm: "size-3.5", default: "size-4", lg: "size-5" } as const;

function useMediaQuery(query: string, serverFallback = false) {
  return React.useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);

      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

/** Named contract for hour/minute/second triples shared by parsing, panels and emits. */
interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Parses "HH:mm"(:ss) into TimeParts, or null. */
function parseTimeText(text: string): TimeParts | null {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(text.trim());

  if (!m) return null;
  const hours = Number(m[1]);
  const minutes = Number(m[2]);
  const seconds = m[3] === undefined ? 0 : Number(m[3]);

  if (hours > 23 || minutes > 59 || seconds > 59) return null;

  return { hours, minutes, seconds };
}

function timeParts(date: Date): TimeParts {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}

/** Totals a time-of-day to minutes (or seconds when granularity is "second"). */
function timeTotal(p: TimeParts, granularity: TimeGranularity): number {
  return granularity === "second"
    ? p.hours * 3600 + p.minutes * 60 + p.seconds
    : p.hours * 60 + p.minutes;
}

/*                                   Panel                                    */

const fieldLabels = {
  hours: "Hour",
  minutes: "Minute",
  seconds: "Second",
} as const;

type StepperUnit = keyof typeof fieldLabels;

const unitMax: Record<StepperUnit, number> = {
  hours: 23,
  minutes: 59,
  seconds: 59,
};

interface PanelProps {
  value: Date | undefined;
  emit: (patch: Partial<TimeParts>) => void;
  granularity: TimeGranularity;
  variant: TimePickerVariant;
  hourStep: number;
  minuteStep: number;
  secondStep: number;
  hourCycle: 12 | 24;
  presets: string[];
  isAllowed: (p: TimeParts) => boolean;
  disabled?: boolean;
}

/** Typeable hour/minute(/second) fields with large +/- steppers. */
function StepperFields(arg0: PanelProps) {
  const model = useStepperFieldsModel(arg0);

  return <StepperFieldsView {...model} />;
}

function GridLabel({ children }: { children: string }) {
  return (
    // kira-kit-ignore arbitrary-values: sub-12px micro type is a documented exception
    <p
      data-slot="time-picker-grid-label"
      aria-hidden
      className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
    >
      {children}
    </p>
  );
}

/** Quick-pick chips + tappable hour/minute cell grids. No typing needed. */
function PresetGrid({
  value,
  emit,
  minuteStep,
  hourCycle,
  presets,
  isAllowed,
  disabled,
}: PanelProps) {
  const parts = value && isValid(value) ? timeParts(value) : null;
  const current = parts ?? { hours: -1, minutes: -1, seconds: 0 };
  const hourCount = hourCycle === 12 ? 12 : 24;

  const minutes = timeGridMinutes(minuteStep);

  const chipAllowed = (text: string) => {
    const p = parseTimeText(text);

    return p ? isAllowed(p) : false;
  };

  const chipActive = (text: string) => {
    const p = parseTimeText(text);

    return !!p && p.hours === current.hours && p.minutes === current.minutes;
  };

  return (
    <div
      data-slot="time-picker-grid"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-label="Quick times"
      className="flex flex-col gap-3 p-3"
    >
      {presets.length > 0 && (
        <TimePickerContentView2
          presets={presets}
          chipAllowed={chipAllowed}
          chipActive={chipActive}
          disabled={disabled}
          emit={emit}
        />
      )}

      <div>
        <GridLabel>Hour</GridLabel>
        <div
          className="grid grid-cols-6 gap-1"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Custom scrollable options use roving focus; a native select would change this widget interaction.
          role="listbox"
          aria-label="Hour"
        >
          <TimePickerHourOptions
            hourCount={hourCount}
            hourCycle={hourCycle}
            current={current}
            isAllowed={isAllowed}
            disabled={disabled}
            emit={emit}
          />
        </div>
      </div>

      <div>
        <GridLabel>Minute</GridLabel>
        <div
          className="grid grid-cols-6 gap-1"
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Custom scrollable options use roving focus; a native select would change this widget interaction.
          role="listbox"
          aria-label="Minute"
        >
          {minutes.map((m) =>
            timePickerMap(m, current, isAllowed, disabled, emit),
          )}
        </div>
      </div>
    </div>
  );
}

/*                                  Component                                 */

const DEFAULT_PRESETS = ["09:00", "12:30", "17:00", "21:00"];

function useTimePickerModel(props: TimePickerProps) {
  const {
    value,
    onChange,
    granularity,
    disabled,
    placeholder,
    displayFormat,
    popover,
    id,
    required,
    invalid,
    ariaLabel,
    className,
    triggerVariant,
    size,
  } = { ...props, ...getTimePickerDefaults(props) };

  const resolvedSize = size ?? "default";
  const reactId = React.useId();
  const baseId = id ?? `time-picker-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const popoverId = `${baseId}-popover`;
  const anchorName = `--${baseId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  useMediaQuery("(min-width: 640px)"); // reserve: anchored flip handled in CSS
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isOpen = popover && uncontrolledOpen && !disabled;

  const { panelProps, hasValue } = useTimePickerPanel({
    ...props,
    ...getTimePickerDefaults(props),
  });

  useTimePopover({
    popoverRef,
    isOpen,
    triggerRef,
    setUncontrolledOpen,
  });

  const pattern =
    displayFormat ?? (granularity === "second" ? "HH:mm:ss" : "HH:mm");

  const label = value && hasValue ? format(value, pattern) : placeholder;

  const panel = <TimePickerPanel {...panelProps} />;

  return {
    className,
    triggerVariant,
    size,
    anchorName,
    disabled,
    invalid,
    triggerRef,
    baseId,
    popoverId,
    isOpen,
    ariaLabel,
    hasValue,
    label,
    required,
    resolvedSize,
    onChange,
    popoverRef,
    panel,
    popover,
  };
}

function TimePicker(props: TimePickerProps) {
  const {
    className,
    triggerVariant,
    size,
    anchorName,
    disabled,
    invalid,
    triggerRef,
    baseId,
    popoverId,
    isOpen,
    ariaLabel,
    hasValue,
    label,
    required,
    resolvedSize,
    onChange,
    popoverRef,
    panel,
    popover,
  } = useTimePickerModel(props);

  if (!popover) {
    return (
      <div
        data-slot="time-picker"
        data-slot-panel="inline"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
        role="group"
        aria-label={ariaLabel ?? "Time"}
        className={cn(
          "rounded-xl border border-border bg-popover text-popover-foreground",
          className,
        )}
      >
        {panel}
      </div>
    );
  }

  return (
    <TimePickerPopoverView
      className={className}
      triggerVariant={triggerVariant}
      size={size}
      anchorName={anchorName}
      disabled={disabled}
      invalid={invalid}
      triggerRef={triggerRef}
      baseId={baseId}
      popoverId={popoverId}
      isOpen={isOpen}
      ariaLabel={ariaLabel}
      hasValue={hasValue}
      label={label}
      required={required}
      resolvedSize={resolvedSize}
      onChange={onChange}
      popoverRef={popoverRef}
      panel={panel}
    />
  );
}

export { TimePicker, timePickerTriggerVariants };

export type { TimePickerProps, TimeGranularity, TimePickerVariant };

function TimePickerContentView({
  parts,
  disabled,
  emit,
}: {
  parts: TimeParts | null;
  disabled: boolean | undefined;
  emit: (patch: Partial<TimeParts>) => void;
}) {
  return (
    // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
    <div
      className="flex flex-col items-center gap-1.5"
      style={{
        // Offset past label(20) + gaps(6+6) + plus(56), then pull up by
        // (pairHeight − valueCell) / 2 = (94 − 56) / 2 = 19px to center.
        marginTop: "calc(88px - 19px)",
      }}
    >
      {(["AM", "PM"] as const).map((period) =>
        timePickerMap2(period, parts, disabled, emit),
      )}
    </div>
  );
}

function TimePickerContentView2({
  presets,
  chipAllowed,
  chipActive,
  disabled,
  emit,
}: {
  presets: string[];
  chipAllowed: (text: string) => boolean;
  chipActive: (text: string) => boolean;
  disabled: boolean | undefined;
  emit: (patch: Partial<TimeParts>) => void;
}) {
  return (
    // kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept
    <div className="flex flex-wrap gap-1.5">
      {presets.map((p) =>
        timePickerMap3(p, chipAllowed, chipActive, disabled, emit),
      )}
    </div>
  );
}

function useStepperFieldsModel({
  value,
  emit,
  granularity,
  hourStep,
  minuteStep,
  secondStep,
  hourCycle,
  isAllowed,
  disabled,
}: PanelProps) {
  const reactId = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const parts = value && isValid(value) ? timeParts(value) : null;

  // While typing, show raw digits so "5" doesn't snap to "05" mid-entry.
  const [drafts, setDrafts] = React.useState<
    Partial<Record<StepperUnit, string>>
  >({});

  const steps: Record<StepperUnit, number> = {
    hours: hourStep,
    minutes: minuteStep,
    seconds: granularity === "second" ? secondStep : 1,
  };

  const units: StepperUnit[] =
    granularity === "second"
      ? ["hours", "minutes", "seconds"]
      : ["hours", "minutes"];

  const bump = (unit: StepperUnit, delta: number) =>
    timePickerBump(unit, delta, parts, steps, isAllowed, setDrafts, emit);

  const commit = (unit: StepperUnit, raw: string) =>
    timePickerCommit(
      unit,
      raw,
      setDrafts,
      Number,
      parts,
      steps,
      isAllowed,
      emit,
    );

  const draftValue = (unit: StepperUnit) =>
    drafts[unit] ?? (parts ? pad2(parts[unit]) : "--");

  // Column: label(20) + gap(6) + +(56) + gap(6) + value(56) + gap(6) + −(56).
  // Colon and AM/PM offset 88px (label + gap + plus + gap) to sit beside the value cell.

  return {
    units,
    reactId,
    disabled,
    bump,
    draftValue,
    drafts,
    setDrafts,
    commit,
    hourCycle,
    parts,
    emit,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function StepperFieldsView({
  units,
  reactId,
  disabled,
  bump,
  draftValue,
  drafts,
  setDrafts,
  commit,
  hourCycle,
  parts,
  emit,
}: ReturnType<typeof useStepperFieldsModel>) {
  return (
    <div
      data-slot="time-picker-stepper"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-label="Time fields"
      className="flex items-start justify-center gap-3 p-3"
    >
      {/* Square 56px cells (+ / value / −) stack per unit; colon centers to the middle cell. */}
      {units.map((unit, i) => (
        <React.Fragment key={unit}>
          {i > 0 && (
            <span
              aria-hidden
              className="flex h-14 items-center text-xl font-semibold text-muted-foreground select-none"
              style={{ marginTop: "88px" }}
            >
              :
            </span>
          )}
          {/* kira-kit-ignore spacing-scale: compact optical gap below the 8px tier; pre-contract density metric kept */}
          <div className="flex flex-col items-center gap-1.5">
            {/* kira-kit-ignore arbitrary-values: sub-12px micro type is a documented exception */}
            <label
              htmlFor={`${reactId}-${unit}`}
              className="flex h-5 items-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
            >
              {fieldLabels[unit]}
            </label>
            <button
              type="button"
              aria-label={`Increase ${fieldLabels[unit].toLowerCase()}`}
              disabled={disabled}
              onClick={() => bump(unit, 1)}
              className={cn(
                "flex size-14 items-center justify-center rounded-xl border border-border bg-muted/40",
                "transition-colors hover:bg-muted active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <IconPlus aria-hidden className="size-4" />
            </button>
            <input
              id={`${reactId}-${unit}`}
              type="text"
              inputMode="numeric"
              maxLength={2}
              autoComplete="off"
              disabled={disabled}
              value={draftValue(unit)}
              aria-invalid={
                drafts[unit] !== undefined &&
                !/^\d{1,2}$/.test(drafts[unit] ?? "")
                  ? true
                  : undefined
              }
              onChange={(e) =>
                setDrafts((d) => ({ ...d, [unit]: e.target.value }))
              }
              onBlur={(e) => commit(unit, e.target.value)}
              onKeyDown={(e) => timePickerCallback(e, commit, unit, bump)}
              className={cn(
                "size-14 rounded-xl border border-border bg-background text-center text-xl font-semibold tabular-nums",
                "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            />
            <button
              type="button"
              aria-label={`Decrease ${fieldLabels[unit].toLowerCase()}`}
              disabled={disabled}
              onClick={() => bump(unit, -1)}
              className={cn(
                "flex size-14 items-center justify-center rounded-xl border border-border bg-muted/40",
                "transition-colors hover:bg-muted active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <IconMinus aria-hidden className="size-4" />
            </button>
          </div>
        </React.Fragment>
      ))}
      {/* Meridiem pair at the far right, vertically centered on the value row. */}
      {hourCycle === 12 && (
        <TimePickerContentView parts={parts} disabled={disabled} emit={emit} />
      )}
    </div>
  );
}

function timePickerHourValue(h: number, hourCycle: 12 | 24) {
  const resolveHourValue1 = () => timePickerResolveHourValue1(hourCycle, h);

  return resolveHourValue1();
}

function timePickerResolveH2(hourCycle: 12 | 24, i: number) {
  if (hourCycle === 12) {
    if (i === 0) {
      return 0 as const;
    }

    return i;
  }

  return i;
}

function timePickerMap(
  m: number,
  current: TimeParts,
  isAllowed: (p: TimeParts) => boolean,
  disabled: boolean | undefined,
  emit: (patch: Partial<TimeParts>) => void,
) {
  const candidate = { ...current, minutes: m };
  const allowed = isAllowed(candidate);
  const active = m === current.minutes;

  return (
    <button
      key={m}
      type="button"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This custom roving-focus option remains in its ARIA listbox and exposes aria-selected.
      role="option"
      aria-selected={active}
      disabled={disabled || !allowed}
      onClick={() => emit({ minutes: m })}
      className={cn(
        "h-10 rounded-md border border-transparent text-xs font-medium tabular-nums transition-colors",
        "hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        { "border-primary/40 bg-primary/10 text-primary": active },
      )}
    >
      {pad2(m)}
    </button>
  );
}

function timePickerUseMemo(
  disabledTimes: string[] | undefined,
  granularity: TimeGranularity,
) {
  const set = new Set<number>();

  for (const text of disabledTimes ?? []) {
    const parsed = parseTimeText(text);

    if (parsed) set.add(timeTotal(parsed, granularity));
  }

  return set;
}

function timePickerUseCallback(
  candidate: TimeParts,
  granularity: TimeGranularity,
  disabledSet: Set<number>,
  minTotal: number | null,
  maxTotal: number | null,
) {
  const total = timeTotal(candidate, granularity);

  if (disabledSet.has(total)) return false;

  if (minTotal !== null && total < minTotal) return false;

  if (maxTotal !== null && total > maxTotal) return false;

  return true;
}

function timePickerEmit(
  patch: Partial<TimeParts>,
  disabled: boolean | undefined,
  value: Date | undefined,
  now: Date,
  parts: TimeParts,
  onChange: ((value: Date | undefined) => void) | undefined,
) {
  if (disabled) return;

  const next = set(value && isValid(value) ? value : now, {
    hours: patch.hours ?? parts.hours,
    minutes: patch.minutes ?? parts.minutes,
    seconds: patch.seconds ?? parts.seconds,
    milliseconds: 0,
  });

  onChange?.(next);
}

function timePickerUseCallback2(
  popoverRef: React.RefObject<HTMLDivElement | null>,
) {
  const el = popoverRef.current;

  if (!el || el.matches(":popover-open")) return;

  try {
    el.showPopover();
  } catch {
    // SAFETY: a popover show/hide operation was still in flight (re-entrant
    // effect during beforetoggle, Fast-Refresh remount). Retrying from a
    // microtask runs outside it, and if it can't open, native state governs.
    // An uncaught throw here would abort the commit and kill page events.
    queueMicrotask(() => {
      if (!el.matches(":popover-open")) {
        try {
          el.showPopover();
        } catch {
          /* still blocked — native state governs */
        }
      }
    });
  }
}

function timePickerUseCallback3(
  popoverRef: React.RefObject<HTMLDivElement | null>,
) {
  const el = popoverRef.current;

  if (!el?.matches(":popover-open")) return;

  try {
    el.hidePopover();
  } catch {
    // SAFETY: a popover hide/show operation was still in flight (re-entrant
    // effect during beforetoggle, or Fast-Refresh remount). Retry once the
    // operation settles; light dismiss may have closed it meanwhile.
    queueMicrotask(() => {
      if (el.matches(":popover-open")) {
        try {
          el.hidePopover();
        } catch {
          /* still blocked — native state governs */
        }
      }
    });
  }
}

function timePickerUseEffectEvent(
  event: ToggleEvent,
  popoverRef: React.RefObject<HTMLDivElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  setUncontrolledOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const opened = event.newState === "open";

  if (!opened) {
    requestAnimationFrame(() => {
      const active = document.activeElement;

      // Return focus unless the user already moved it somewhere meaningful.
      if (
        !active ||
        active === document.body ||
        popoverRef.current?.contains(active)
      ) {
        triggerRef.current?.focus();
      }
    });
  }

  setUncontrolledOpen(opened);
}

function timePickerUseEffect(
  popoverRef: React.RefObject<HTMLDivElement | null>,
  onPopoverToggle: (event: ToggleEvent) => void,
) {
  const el = popoverRef.current;

  if (!el) return;
  // SAFETY: "toggle" is a ToggleEvent that fires only after the show/hide
  // operation completes, so syncing state here never re-enters
  // showPopover() mid-operation. beforetoggle would: it fires at the state
  // flip, and setState there re-renders into the open effect mid-operation.
  const listener = (event: Event) => onPopoverToggle(event as ToggleEvent);
  el.addEventListener("toggle", listener);

  return () => {
    el.removeEventListener("toggle", listener);
  };
}

function timePickerMap2(
  period: "AM" | "PM",
  parts: TimeParts | null,
  disabled: boolean | undefined,
  emit: (patch: Partial<TimeParts>) => void,
) {
  const isAm = (parts?.hours ?? 0) < 12;
  const active = period === "AM" ? isAm : !isAm;

  return (
    <button
      key={period}
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={() =>
        emit({
          hours: ((parts?.hours ?? 0) % 12) + (period === "AM" ? 0 : 12),
        })
      }
      className={cn(
        "size-11 rounded-xl border border-border text-xs font-semibold transition-colors",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        { "border-primary/40 bg-primary/10 text-primary": active },
      )}
    >
      {period}
    </button>
  );
}

function timePickerMap3(
  p: string,
  chipAllowed: (text: string) => boolean,
  chipActive: (text: string) => boolean,
  disabled: boolean | undefined,
  emit: (patch: Partial<TimeParts>) => void,
) {
  const allowed = chipAllowed(p);
  const active = chipActive(p);

  return (
    <button
      key={p}
      type="button"
      aria-pressed={active}
      disabled={disabled || !allowed}
      onClick={() => {
        const parsed = parseTimeText(p);

        if (parsed) emit(parsed);
      }}
      className={cn(
        "rounded-full border border-border px-3 py-1 text-xs font-medium tabular-nums transition-colors",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40",
        { "border-primary/40 bg-primary/10 text-primary": active },
      )}
    >
      {p}
    </button>
  );
}

function timePickerBump(
  unit: "seconds" | "hours" | "minutes",
  delta: number,
  parts: TimeParts | null,
  steps: Record<"seconds" | "hours" | "minutes", number>,
  isAllowed: (p: TimeParts) => boolean,
  setDrafts: React.Dispatch<
    React.SetStateAction<
      Partial<Record<"seconds" | "hours" | "minutes", string>>
    >
  >,
  emit: (patch: Partial<TimeParts>) => void,
) {
  const current = parts ?? { hours: 0, minutes: 0, seconds: 0 };
  const max = unitMax[unit];
  const step = steps[unit];
  let n = current[unit];

  // Walk by step within [min,max], skipping disallowed times.
  for (let i = 0; i < Math.ceil((24 * 60) / step) + 2; i++) {
    n += delta * step;

    if (unit === "hours") {
      // Hours wrap through the day; the candidate keeps other parts.
      if (n < 0) n = 24 - step;

      if (n > max) n = 0;
    } else if (n < 0 || n > max) {
      n = Math.min(Math.max(n, 0), max);
      break;
    }

    const candidate = { ...current, [unit]: n };

    if (isAllowed(candidate)) break;
  }

  setDrafts({});
  emit({ [unit]: n });
}

function timePickerCommit(
  unit: "seconds" | "hours" | "minutes",
  raw: string,
  setDrafts: React.Dispatch<
    React.SetStateAction<
      Partial<Record<"seconds" | "hours" | "minutes", string>>
    >
  >,
  Number: NumberConstructor,
  parts: TimeParts | null,
  steps: Record<"seconds" | "hours" | "minutes", number>,
  isAllowed: (p: TimeParts) => boolean,
  emit: (patch: Partial<TimeParts>) => void,
) {
  const text = raw.trim();
  setDrafts((d) => ({ ...d, [unit]: undefined }));

  if (!/^\d{1,2}$/.test(text)) return;
  const n = Number(text);
  const current = parts ?? { hours: 0, minutes: 0, seconds: 0 };

  if (n > unitMax[unit] || n % steps[unit] !== 0) return;

  if (!isAllowed({ ...current, [unit]: n })) return;
  emit({ [unit]: n });
}

function timePickerCallback(
  e: React.KeyboardEvent<HTMLInputElement>,
  commit: (unit: StepperUnit, raw: string) => void,
  unit: "seconds" | "hours" | "minutes",
  bump: (unit: StepperUnit, delta: number) => void,
) {
  if (e.key === "Enter") {
    e.preventDefault();
    commit(unit, e.currentTarget.value);
    e.currentTarget.blur();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    bump(unit, 1);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    bump(unit, -1);
  }
}

function timePickerResolveHourValue1(hourCycle: 12 | 24, h: number) {
  if (hourCycle === 12) {
    if (h === 0) {
      return 12 as const;
    }

    if (h % 12 === 0) {
      return 12 as const;
    }

    return h % 12;
  }

  return h;
}

function useTimeConstraints({
  minTime,
  maxTime,
  disabledTimes,
  granularity,
  parts,
}: {
  minTime: string | undefined;
  maxTime: string | undefined;
  disabledTimes: string[] | undefined;
  granularity: TimeGranularity;
  parts: TimeParts;
}) {
  const minParts = React.useMemo(
    () => (minTime ? parseTimeText(minTime) : null),
    [minTime],
  );

  const maxParts = React.useMemo(
    () => (maxTime ? parseTimeText(maxTime) : null),
    [maxTime],
  );

  const disabledSet = React.useMemo(
    () => timePickerUseMemo(disabledTimes, granularity),
    [disabledTimes, granularity],
  );

  const minTotal = minParts ? timeTotal(minParts, granularity) : null;
  const maxTotal = maxParts ? timeTotal(maxParts, granularity) : null;
  const partsKey = `${parts.hours}:${parts.minutes}:${parts.seconds}`;

  const isAllowed = React.useCallback(
    (candidate: TimeParts) =>
      timePickerUseCallback(
        candidate,
        granularity,
        disabledSet,
        minTotal,
        maxTotal,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- inputs pruned via partsKey/disabledSet/minTotal/maxTotal
    [partsKey, granularity, disabledSet, minTotal, maxTotal],
  );

  return { isAllowed } satisfies { isAllowed: typeof isAllowed };
}

function useTimePopover({
  popoverRef,
  isOpen,
  triggerRef,
  setUncontrolledOpen,
}: {
  popoverRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  setUncontrolledOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const openPopover = React.useCallback(
    () => timePickerUseCallback2(popoverRef),
    [popoverRef],
  );

  const closePopover = React.useCallback(
    () => timePickerUseCallback3(popoverRef),
    [popoverRef],
  );

  React.useEffect(() => {
    if (isOpen) openPopover();
    else closePopover();
  }, [isOpen, openPopover, closePopover]);

  const onPopoverToggle = React.useEffectEvent((event: ToggleEvent) =>
    timePickerUseEffectEvent(
      event,
      popoverRef,
      triggerRef,
      setUncontrolledOpen,
    ),
  );

  React.useEffect(
    () => timePickerUseEffect(popoverRef, onPopoverToggle),
    [popoverRef],
  );
}

function getTimePickerDefaults(props: TimePickerProps) {
  const {
    granularity = "minute",
    variant = "stepper",
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    hourCycle = 24,
    placeholder = "Select time",
    popover = true,
  } = props;

  return {
    granularity,
    variant,
    hourStep,
    minuteStep,
    secondStep,
    hourCycle,
    placeholder,
    popover,
  } satisfies {
    granularity: typeof granularity;
    variant: typeof variant;
    hourStep: typeof hourStep;
    minuteStep: typeof minuteStep;
    secondStep: typeof secondStep;
    hourCycle: typeof hourCycle;
    placeholder: typeof placeholder;
    popover: typeof popover;
  };
}

type TimePickerPopoverViewProps = {
  className: string | undefined;
  triggerVariant: "default" | "outline" | "ghost" | null | undefined;
  size: "default" | "sm" | "lg" | null | undefined;
  anchorName: string;
  disabled: boolean | undefined;
  invalid: boolean | undefined;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  baseId: string;
  popoverId: string;
  isOpen: boolean;
  ariaLabel: string | undefined;
  hasValue: boolean;
  label: string;
  required: boolean | undefined;
  resolvedSize: "default" | "sm" | "lg";
  onChange: ((value: Date | undefined) => void) | undefined;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  panel: React.JSX.Element;
};

// oxlint-disable-next-line eslint/max-lines-per-function -- The pure native-popover renderer keeps its target, paired trigger and labelled dialog contract together.
function TimePickerPopoverView({
  className,
  triggerVariant,
  size,
  anchorName,
  disabled,
  invalid,
  triggerRef,
  baseId,
  popoverId,
  isOpen,
  ariaLabel,
  hasValue,
  label,
  required,
  resolvedSize,
  onChange,
  popoverRef,
  panel,
}: TimePickerPopoverViewProps) {
  return (
    <div data-slot="time-picker" className={cn("relative w-full", className)}>
      <div
        className={timePickerTriggerVariants({ variant: triggerVariant, size })}
        // SAFETY: anchorName is a `--name` custom-property string; the assertion
        // only widens the literal key for the inline style object.
        style={{ anchorName } as React.CSSProperties}
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
      >
        <button
          ref={triggerRef}
          id={baseId}
          type="button"
          popoverTarget={popoverId}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This button opens the custom time-selection popup; a native input would change the public interaction.
          role="combobox"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={popoverId}
          aria-label={`${ariaLabel ?? "Time"}: ${hasValue ? label : "not selected"}`}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className="flex h-full min-w-0 flex-1 items-center gap-2 text-left outline-none"
        >
          <IconClock
            aria-hidden
            className={cn(
              iconSize[resolvedSize],
              "shrink-0 text-muted-foreground",
            )}
          />
          <span
            className={cn("truncate", { "text-muted-foreground": !hasValue })}
          >
            {label}
          </span>
        </button>
        {hasValue && !disabled && (
          <button
            type="button"
            onClick={() => {
              onChange?.(undefined);
              triggerRef.current?.focus();
            }}
            aria-label="Clear time"
            className="rounded p-0.5 text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <IconX aria-hidden className={iconSize[resolvedSize]} />
          </button>
        )}
      </div>

      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The native popover already owns visibility; this ARIA dialog provides the custom focus-trapped popup semantics.
        role="dialog"
        aria-label="Choose time"
        // SAFETY: positionAnchor is a valid csstype anchor property; the
        // assertion only widens the literal key for the inline style object.
        style={{ positionAnchor: anchorName } as React.CSSProperties}
        className={cn(
          "time-picker-popover rounded-xl border border-border bg-popover text-popover-foreground shadow-xl",
          "max-sm:w-full max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0",
        )}
      >
        {isOpen && panel}
      </div>
    </div>
  );
}

function TimePickerPanel(panelProps: PanelProps) {
  const { variant } = panelProps;

  if (variant === "stepper") {
    return <StepperFields {...panelProps} />;
  }

  if (variant === "grid") {
    return <PresetGrid {...panelProps} />;
  }

  return (
    <div className="flex max-h-104 w-76 flex-col overflow-y-auto sm:w-88">
      <StepperFields {...panelProps} />
      <div className="border-t border-border">
        <PresetGrid {...panelProps} />
      </div>
    </div>
  );
}

function useTimePickerPanel({
  value,
  disabled,
  minTime,
  maxTime,
  disabledTimes,
  granularity,
  onChange,
  variant,
  hourStep,
  minuteStep,
  secondStep,
  hourCycle,
  presets,
}: TimePickerProps & ReturnType<typeof getTimePickerDefaults>) {
  const [now] = React.useState(() => new Date());
  const hasValue = !!value && isValid(value);

  const parts = hasValue
    ? timeParts(value)
    : { hours: 0, minutes: 0, seconds: 0 };

  const { isAllowed } = useTimeConstraints({
    minTime,
    maxTime,
    disabledTimes,
    granularity,
    parts,
  });

  const emit = (patch: Partial<TimeParts>) =>
    timePickerEmit(patch, disabled, value, now, parts, onChange);

  const panelProps: PanelProps = {
    value: hasValue ? value : undefined,
    emit,
    granularity,
    variant,
    hourStep,
    minuteStep,
    secondStep,
    hourCycle,
    presets: presets ?? DEFAULT_PRESETS,
    isAllowed,
    disabled,
  };

  return { panelProps, hasValue };
}

function TimePickerHourOptions({
  hourCount,
  hourCycle,
  current,
  isAllowed,
  disabled,
  emit,
}: Pick<PanelProps, "hourCycle" | "isAllowed" | "disabled" | "emit"> & {
  hourCount: number;
  current: TimeParts;
}) {
  const hourValue = (h: number) => timePickerHourValue(h, hourCycle);

  return (
    <>
      {Array.from({ length: hourCount }, (_, i) => {
        const resolveH2 = () => timePickerResolveH2(hourCycle, i);

        const h = resolveH2();
        const candidate = { ...current, hours: h };
        const allowed = isAllowed(candidate);
        const active = h === current.hours;

        return (
          <button
            key={h}
            type="button"
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This custom roving-focus option remains in its ARIA listbox and exposes aria-selected.
            role="option"
            aria-selected={active}
            disabled={disabled || !allowed}
            onClick={() => emit({ hours: h })}
            className={cn(
              "h-10 rounded-md border border-transparent text-xs font-medium tabular-nums transition-colors",
              "hover:border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-40",
              { "border-primary/40 bg-primary/10 text-primary": active },
            )}
          >
            {pad2(hourValue(h))}
            {hourCycle === 12 && (
              <span className="sr-only">{h < 12 ? " AM" : " PM"}</span>
            )}
          </button>
        );
      })}
    </>
  );
}

function timeGridMinutes(minuteStep: number) {
  return Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => i * minuteStep,
  );
}
