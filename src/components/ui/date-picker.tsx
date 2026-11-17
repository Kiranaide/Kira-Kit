"use client";

import * as React from "react";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import {
  dateMatchModifiers,
  type DateRange,
  type Matcher,
} from "react-day-picker";
import { TZDate } from "@date-fns/tz";
import { cva, type VariantProps } from "class-variance-authority";
import {
  endOfMonth,
  format,
  isSameDay,
  isValid,
  parse,
  set as setFields,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  type Locale,
} from "date-fns";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { TimePicker, type TimeGranularity } from "@/components/ui/time-picker";
import {
  Calendar,
  formatDateValue,
  getToday,
  isDateRange,
  toISODate,
  type CalendarMarker,
} from "@/components/ui/calendar";
import { isStringProp } from "@/lib/component-prop-guards";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type ApplyMode = "immediate" | "confirm";

type DateValue = Date | DateRange | undefined;

interface DatePreset {
  label: string;
  /** Receives "today" in the picker's time zone. */
  getValue: (today: Date) => Date | DateRange;
}

const datePickerTriggerVariants = cva(
  [
    "relative flex w-full items-center gap-2 rounded-lg border transition-all",
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
        sm: "h-8 px-2.5 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

interface DatePickerBaseProps extends VariantProps<
  typeof datePickerTriggerVariants
> {
  placeholder?: string;
  disabled?: boolean;
  /** Days that can't be picked (booked nights, holidays…). */
  disabledDays?: Matcher | Matcher[];
  minDate?: Date;
  maxDate?: Date;
  showPresets?: boolean;
  presets?: DatePreset[];
  applyMode?: ApplyMode;
  /** Close after a complete selection in "immediate" mode. Default: true. */
  closeOnSelect?: boolean;
  locale?: Locale;
  /** IANA time zone, e.g. "Asia/Jakarta". */
  timeZone?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** date-fns pattern for the trigger. Defaults to Intl medium date style. */
  displayFormat?: string;
  markers?: CalendarMarker[];
  /** Defaults to 2 for ranges on ≥640px, otherwise 1. */
  numberOfMonths?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  id?: string;
  required?: boolean;
  invalid?: boolean;
  "aria-describedby"?: string;
  /** Accessible name prefix, e.g. "Check-in date". Should match your visible label. */
  ariaLabel?: string;
  className?: string;
}

interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  /** Render a text input for typed entry. */
  editable?: boolean;
  /** Hidden input name; value is yyyy-MM-dd. */
  name?: string;
}

interface DatePickerDateTimeProps extends DatePickerBaseProps {
  mode: "datetime";
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  /** Time granularity of the embedded TimePicker. Default "minute". */
  granularity?: TimeGranularity;
  /** Default 24. */
  hourCycle?: 12 | 24;
  /** Time part of the trigger label. Default "HH:mm" ("HH:mm:ss" for second granularity). */
  timeFormat?: string;
  /** Typed entry accepts "P p"-style date+time patterns. */
  editable?: boolean;
  /** Hidden input name; value is ISO "yyyy-MM-dd'T'HH:mm:ss". */
  name?: string;
}

interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
  minNights?: number;
  maxNights?: number;
  excludeDisabled?: boolean;
  /** Default: true. */
  resetOnSelect?: boolean;
  /** "stay" → stay_from / stay_to, or pass explicit names. */
  name?: string | { from: string; to: string };
}

type DatePickerProps =
  DatePickerSingleProps | DatePickerDateTimeProps | DatePickerRangeProps;

/* -------------------------------------------------------------------------- */
/*                                   Presets                                  */
/* -------------------------------------------------------------------------- */

const singlePresets: DatePreset[] = [
  { label: "Today", getValue: (t) => t },
  { label: "Yesterday", getValue: (t) => subDays(t, 1) },
  { label: "A week ago", getValue: (t) => subDays(t, 7) },
];

const rangePresets: DatePreset[] = [
  { label: "Last 7 days", getValue: (t) => ({ from: subDays(t, 6), to: t }) },
  { label: "Last 30 days", getValue: (t) => ({ from: subDays(t, 29), to: t }) },
  {
    label: "Month to date",
    getValue: (t) => ({ from: startOfMonth(t), to: t }),
  },
  {
    label: "Last month",
    getValue: (t) => {
      const prev = subMonths(t, 1);

      return { from: startOfMonth(prev), to: startOfDay(endOfMonth(prev)) };
    },
  },
  { label: "Year to date", getValue: (t) => ({ from: startOfYear(t), to: t }) },
];

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const iconSize = { sm: "size-3.5", default: "size-4", lg: "size-5" } as const;

const textSize = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
} as const;

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

function sameValue(a: DateValue, b: DateValue) {
  if (a instanceof Date && b instanceof Date) return isSameDay(a, b);

  if (isDateRange(a) && isDateRange(b)) {
    return eq(a.from, b.from) && eq(a.to, b.to);
  }

  return false;
}

/** Machine-readable ISO date+time for hidden form inputs. */
function toISODateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

/** Returns a Date, `undefined` for empty input, or `null` when unparseable. */
function parseDateInput(
  text: string,
  {
    locale,
    formats,
    timeZone,
  }: { locale?: Locale; formats: string[]; timeZone?: string },
): Date | null | undefined {
  const trimmed = text.trim();

  if (!trimmed) return undefined;
  const reference = new Date();

  for (const pattern of formats) {
    const parsed = parse(trimmed, pattern, reference, { locale });

    if (isValid(parsed)) {
      return timeZone
        ? new TZDate(
            parsed.getFullYear(),
            parsed.getMonth(),
            parsed.getDate(),
            timeZone,
          )
        : startOfDay(parsed);
    }
  }

  return null;
}

function dateInputPatterns(
  inputPattern: string,
  isDatetime: boolean,
  timePattern: string | undefined,
) {
  return isDatetime
    ? [
        `${inputPattern} ${timePattern}`,
        inputPattern,
        "P p",
        "PP pp",
        `yyyy-MM-dd ${timePattern}`,
        "yyyy-MM-dd HH:mm",
        "yyyy-MM-dd HH:mm:ss",
      ]
    : [inputPattern, "P", "PP", "PPP", "yyyy-MM-dd"];
}

/* -------------------------------------------------------------------------- */
/*                                 DatePicker                                 */
/* -------------------------------------------------------------------------- */

function DatePicker(input0: DatePickerProps) {
  const state0 = useDatePickerSetup(input0);
  const state1 = useDatePickerState2(state0);
  const state2 = useDatePickerState3(state1);
  const state3 = useDatePickerState4(state2);
  const state4 = useDatePickerState5(state3);
  const state5 = useDatePickerState6(state4);
  const state6 = useDatePickerState7(state5);
  const state7 = useDatePickerActions(state6);

  return renderDatePicker(state7);
}

export { DatePicker, datePickerTriggerVariants, singlePresets, rangePresets };

export type {
  DatePickerProps,
  DatePickerSingleProps,
  DatePickerRangeProps,
  DatePreset,
  ApplyMode,
};

const eq = (x?: Date, y?: Date) =>
  (!x && !y) || (!!x && !!y && isSameDay(x, y));

type renderDatePickerSectionPart1Args = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  baseId: string;
  inputText: string;
  today: ReturnType<typeof getToday>;
  locale: Locale | undefined;
  inputPattern: string;
  disabled: boolean;
  required: boolean | undefined;
  ariaLabel: string | undefined;
  isInvalid: boolean;
  describedBy: string | undefined;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  commitInput: () => void;
  openPopover: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  popoverId: string;
  isOpen: boolean;
  resolvedSize: "default" | "sm" | "lg";
};

function renderDatePickerSectionPart1({
  inputRef,
  baseId,
  inputText,
  today,
  locale,
  inputPattern,
  disabled,
  required,
  ariaLabel,
  isInvalid,
  describedBy,
  setInputText,
  commitInput,
  openPopover,
  triggerRef,
  popoverId,
  isOpen,
  resolvedSize,
}: renderDatePickerSectionPart1Args) {
  return (
    <>
      <input
        ref={inputRef}
        id={baseId}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={inputText}
        placeholder={formatDateValue(today, {
          locale,
          pattern: inputPattern,
        })}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => setInputText(e.target.value)}
        onBlur={commitInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitInput();
          } else if (e.altKey && e.key === "ArrowDown") {
            e.preventDefault();
            openPopover();
          }
        }}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
      />
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={popoverId}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        aria-label="Open calendar"
        disabled={disabled}
        className="-mr-1 rounded p-1 text-muted-foreground outline-none hover:bg-muted"
      >
        <IconCalendar aria-hidden className={iconSize[resolvedSize]} />
      </button>
    </>
  );
}

type renderDatePickerSectionPart2Args = {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  baseId: string;
  popoverId: string;
  isOpen: boolean;
  ariaLabel: string | undefined;
  isRange: boolean;
  hasValue: boolean;
  label: string;
  describedBy: string | undefined;
  isInvalid: boolean;
  required: boolean | undefined;
  disabled: boolean;
  resolvedSize: "default" | "sm" | "lg";
};

function renderDatePickerSectionPart2({
  triggerRef,
  baseId,
  popoverId,
  isOpen,
  ariaLabel,
  isRange,
  hasValue,
  label,
  describedBy,
  isInvalid,
  required,
  disabled,
  resolvedSize,
}: renderDatePickerSectionPart2Args) {
  return (
    <button
      ref={triggerRef}
      id={baseId}
      type="button"
      popoverTarget={popoverId}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The button is the APG date-picker combobox invoker for a calendar dialog, rather than a text input or select.
      role="combobox"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={popoverId}
      aria-label={`${ariaLabel ?? (isRange ? "Date range" : "Date")}: ${hasValue ? label : "not selected"}`}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      aria-required={required || undefined}
      disabled={disabled}
      className="flex h-full min-w-0 flex-1 items-center gap-2 text-left outline-none"
    >
      <IconCalendar
        aria-hidden
        className={cn(iconSize[resolvedSize], "shrink-0 text-muted-foreground")}
      />
      <span className={cn("truncate", !hasValue && "text-muted-foreground")}>
        {label}
      </span>
    </button>
  );
}

type renderDatePickerSectionPart3Args = {
  rangeNames: { from: string; to: string };
  value: DateValue;
};

function renderDatePickerSectionPart3({
  rangeNames,
  value,
}: renderDatePickerSectionPart3Args) {
  return (
    <>
      <input
        type="hidden"
        name={rangeNames.from}
        value={isDateRange(value) && value.from ? toISODate(value.from) : ""}
      />
      <input
        type="hidden"
        name={rangeNames.to}
        value={isDateRange(value) && value.to ? toISODate(value.to) : ""}
      />
    </>
  );
}

type renderDatePickerSectionPart4Args = {
  presets: DatePreset[];
  today: ReturnType<typeof getToday>;
  currentValue: DateValue;
  isPresetBlocked: (v: Date | DateRange) => boolean;
  handlePreset: (presetValue: Date | DateRange) => void;
  resolvedSize: "default" | "sm" | "lg";
};

function renderDatePickerSectionPart4({
  presets,
  today,
  currentValue,
  isPresetBlocked,
  handlePreset,
  resolvedSize,
}: renderDatePickerSectionPart4Args) {
  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label="Quick select"
      className="flex gap-1 overflow-x-auto border-b border-border p-2 sm:min-w-37.5 sm:flex-col sm:overflow-visible sm:border-r sm:border-b-0 sm:p-3"
    >
      <p
        aria-hidden
        className="mb-2 hidden px-3 text-xs font-semibold text-muted-foreground sm:block"
      >
        Quick select
      </p>
      {presets.map((preset) => {
        const presetValue = preset.getValue(today);
        const active = sameValue(presetValue, currentValue);

        return (
          <button
            key={preset.label}
            type="button"
            aria-pressed={active}
            disabled={isPresetBlocked(presetValue)}
            onClick={() => handlePreset(presetValue)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-left font-medium transition-colors",
              "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-40",
              active && "bg-primary/10 text-primary",
              textSize[resolvedSize],
            )}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

type renderDatePickerSectionPart5Args = {
  currentValue: DateValue;
  handleDatetimeTimeChange: (time: Date | undefined) => void;
  timeGranularity: TimeGranularity;
  timeCycle: 12 | 24;
  resolvedSize: "default" | "sm" | "lg";
};

function renderDatePickerSectionPart5({
  currentValue,
  handleDatetimeTimeChange,
  timeGranularity,
  timeCycle,
  resolvedSize,
}: renderDatePickerSectionPart5Args) {
  return (
    <div className="border-t border-border sm:border-t-0 sm:border-l">
      <TimePicker
        popover={false}
        value={currentValue instanceof Date ? currentValue : undefined}
        onChange={handleDatetimeTimeChange}
        granularity={timeGranularity}
        hourCycle={timeCycle}
        ariaLabel="Time of day"
        size={resolvedSize}
      />
    </div>
  );
}

type renderDatePickerSectionPart6Args = {
  resolvedSize: "default" | "sm" | "lg";
  isDatetime: boolean;
  pendingValue: DateValue;
  locale: Locale | undefined;
  timeZone: string | undefined;
  displayFormat: string | undefined;
  timePattern: string | undefined;
  placeholder: string;
  closePopover: () => void;
  handleApply: () => void;
  canApply: boolean;
};

function renderDatePickerSectionPart6({
  resolvedSize,
  isDatetime,
  pendingValue,
  locale,
  timeZone,
  displayFormat,
  timePattern,
  placeholder,
  closePopover,
  handleApply,
  canApply,
}: renderDatePickerSectionPart6Args) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border p-3">
      <p
        aria-live="polite"
        className={cn("truncate text-muted-foreground", textSize[resolvedSize])}
      >
        {isDatetime && pendingValue instanceof Date && isValid(pendingValue)
          ? `${formatDateValue(pendingValue, {
              locale,
              timeZone,
              pattern: displayFormat,
            })} ${format(pendingValue, timePattern ?? "HH:mm")}`
          : formatDateValue(pendingValue, {
              locale,
              timeZone,
              pattern: displayFormat,
              placeholder,
            })}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size={resolvedSize === "lg" ? "default" : "sm"}
          onClick={closePopover}
        >
          Cancel
        </Button>
        <Button
          size={resolvedSize === "lg" ? "default" : "sm"}
          onClick={handleApply}
          disabled={!canApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

function useDatePickerSetup(props: DatePickerProps) {
  const resolvedProps = resolveComponentDefaults(
    props,
    getDatePickerDefaults(props.mode),
  );

  const {
    size,
    closeOnSelect,
    numberOfMonths: numberOfMonthsProp,
    open: openProp,
  } = resolvedProps;

  const isRange = props.mode === "range";

  const value: DateValue = props.value;

  const resolvedSize = size ?? "default";

  const editable = props.mode !== "range" && !!props.editable;

  const isDatetime = props.mode === "datetime";

  const timeOptions = getDatePickerTimeOptions(
    props,
    isDatetime,
    closeOnSelect,
  );

  return {
    ...resolvedProps,
    props,
    numberOfMonthsProp,
    openProp,
    isRange,
    value,
    resolvedSize,
    editable,
    isDatetime,
    ...timeOptions,
  };
}

function getDatePickerDefaults(mode: DatePickerProps["mode"]) {
  const isRange = mode === "range";

  return {
    variant: "default" as const,
    placeholder: isRange ? "Select dates" : "Select date",
    disabled: false,
    showPresets: true,
    presets: isRange ? rangePresets : singlePresets,
    applyMode: "immediate" as const,
    closeOnSelect: true,
  };
}

function getDatePickerTimeOptions(
  props: DatePickerProps,
  isDatetime: boolean,
  closeOnSelect: boolean,
) {
  if (!isDatetime || props.mode !== "datetime") {
    const timeGranularity: TimeGranularity = "minute";
    const timeCycle: 12 | 24 = 24;

    return {
      timeGranularity,
      timeCycle,
      timePattern: undefined,
      effectiveCloseOnSelect: closeOnSelect,
    };
  }

  const timeGranularity: TimeGranularity = props.granularity ?? "minute";

  return {
    timeGranularity,
    timeCycle: props.hourCycle ?? 24,
    timePattern:
      props.timeFormat ?? (timeGranularity === "second" ? "HH:mm:ss" : "HH:mm"),
    // Datetime selection usually finishes after the time control is set.
    effectiveCloseOnSelect: false,
  };
}

function useDatePickerState2(state: ReturnType<typeof useDatePickerSetup>) {
  const {
    props,
    applyMode,
    timeZone,
    numberOfMonthsProp,
    openProp,
    id,
    isRange,
    value,
    editable,
    isDatetime,
  } = state;

  /* ---------------------------------- Ids ---------------------------------- */
  const reactId = React.useId();

  const baseId = id ?? `date-picker-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverId = `${baseId}-popover`;

  const errorId = `${baseId}-error`;

  const anchorName = `--${baseId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const popoverRef = React.useRef<HTMLDivElement>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  const numberOfMonths = isDatetime
    ? 1 // popover width budget: calendar + time comb side by side
    : (numberOfMonthsProp ?? (isRange && isDesktop ? 2 : 1));

  /* ------------------------------- Open state ------------------------------ */
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isOpen = openProp ?? uncontrolledOpen;

  const [pendingValue, setPendingValue] = React.useState<DateValue>();

  const [month, setMonth] = React.useState<Date>(() =>
    startOfMonth(getToday(timeZone)),
  );

  const today = getToday(timeZone);

  const currentValue: DateValue =
    applyMode === "confirm" ? pendingValue : value;

  const emitChange = (next: DateValue) => {
    if (props.mode === "range")
      props.onChange?.(isDateRange(next) ? next : undefined);
    else props.onChange?.(next instanceof Date ? next : undefined);
  };

  const focusTrigger = () =>
    (editable ? inputRef : triggerRef).current?.focus();

  const closePopover = () => {
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
  };

  return {
    ...state,
    baseId,
    popoverId,
    errorId,
    anchorName,
    popoverRef,
    triggerRef,
    inputRef,
    numberOfMonths,
    setUncontrolledOpen,
    isOpen,
    pendingValue,
    setPendingValue,
    month,
    setMonth,
    today,
    currentValue,
    emitChange,
    focusTrigger,
    closePopover,
  };
}

function useDatePickerState3(state: ReturnType<typeof useDatePickerState2>) {
  const {
    openProp,
    onOpenChange,
    value,
    popoverRef,
    setUncontrolledOpen,
    setPendingValue,
    setMonth,
    today,
    focusTrigger,
  } = state;

  const openPopover = () => {
    const el = popoverRef.current;

    if (!el || el.matches(":popover-open")) return;

    try {
      el.showPopover();
    } catch {
      // SAFETY: a popover show/hide operation was still in flight (re-entrant
      // effect during beforetoggle, or Fast-Refresh remount). Retrying from a
      // microtask runs outside the in-flight operation; if it can't open, the
      // native state governs. An uncaught throw here would abort the React
      // commit and kill all event handling on the page.
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
  };

  // Native popover → React state (light dismiss, Escape, invoker clicks all land here).
  const onPopoverToggle = React.useEffectEvent((event: ToggleEvent) => {
    const opened = event.newState === "open";

    if (opened) {
      setPendingValue(value);
      const anchor = isDateRange(value) ? value.from : value;
      setMonth(startOfMonth(anchor ?? today));
    } else {
      setPendingValue(undefined); // discards un-applied confirm-mode changes
      requestAnimationFrame(() => {
        if (!document.activeElement || document.activeElement === document.body)
          focusTrigger();
      });
    }

    if (openProp === undefined) setUncontrolledOpen(opened);
    onOpenChange?.(opened);
  });

  React.useEffect(() => {
    const el = popoverRef.current;

    if (!el) return;
    // SAFETY: "toggle" on popover elements is a ToggleEvent per spec; it fires
    // only after the show/hide operation completes, so syncing state here never
    // re-enters showPopover() mid-operation (beforetoggle would — it fires
    // synchronously at the state flip, and a setState from it re-renders into
    // the controlled-open effect while the operation is in flight).
    const listener = (event: Event) => onPopoverToggle(event as ToggleEvent);
    el.addEventListener("toggle", listener);

    return () => {
      el.removeEventListener("toggle", listener);
    };
  }, [popoverRef]);

  return { ...state, openPopover };
}

function useDatePickerState4(state: ReturnType<typeof useDatePickerState3>) {
  const {
    disabledDays,
    minDate,
    maxDate,
    applyMode,
    effectiveCloseOnSelect,
    isOpen,
    setPendingValue,
    emitChange,
    closePopover,
    openPopover,
  } = state;

  // React state → native popover (controlled `open`).
  React.useEffect(() => {
    if (isOpen) openPopover();
    else closePopover();
  }, [isOpen, openPopover, closePopover]);

  /* ------------------------------ Blocked days ----------------------------- */
  const blockedMatchers = React.useMemo(() => {
    const list: Matcher[] = [];

    if (minDate) list.push({ before: minDate });

    if (maxDate) list.push({ after: maxDate });

    if (disabledDays)
      list.push(
        ...(Array.isArray(disabledDays) ? disabledDays : [disabledDays]),
      );

    return list;
  }, [minDate, maxDate, disabledDays]);

  const isBlocked = (d: Date) =>
    blockedMatchers.length > 0 && dateMatchModifiers(d, blockedMatchers);

  const isPresetBlocked = (v: Date | DateRange) =>
    v instanceof Date
      ? isBlocked(v)
      : (!!v.from && isBlocked(v.from)) || (!!v.to && isBlocked(v.to));

  /* -------------------------------- Selection ------------------------------ */
  const handleSelect = (next: DateValue) => {
    // eslint-disable-next-line no-console
    console.log(
      "DP.handleSelect",
      JSON.stringify(next instanceof Date ? "Date" : next),
    );

    if (applyMode === "confirm") {
      setPendingValue(next);

      return;
    }

    emitChange(next);

    const complete =
      next instanceof Date || (isDateRange(next) && !!next.from && !!next.to);

    if (effectiveCloseOnSelect && complete) closePopover();
  };

  return { ...state, isBlocked, isPresetBlocked, handleSelect };
}

function useDatePickerState5(state: ReturnType<typeof useDatePickerState4>) {
  const {
    pendingValue,
    setMonth,
    today,
    currentValue,
    emitChange,
    closePopover,
    handleSelect,
  } = state;

  /** Day click in datetime mode: keep the picked time-of-day (default 00:00). */
  const handleDatetimeSelect = (day: Date | undefined) => {
    if (!day) return handleSelect(undefined);

    const source =
      currentValue instanceof Date && isValid(currentValue)
        ? currentValue
        : undefined;

    const next = setFields(day, {
      hours: source?.getHours() ?? 0,
      minutes: source?.getMinutes() ?? 0,
      seconds: source?.getSeconds() ?? 0,
      milliseconds: 0,
    });

    handleSelect(next);
  };

  /** Time column change in datetime mode: merge into the date part. */
  const handleDatetimeTimeChange = (time: Date | undefined) => {
    if (!time) return; // TimePicker never emits undefined from its comb

    const base =
      currentValue instanceof Date && isValid(currentValue)
        ? currentValue
        : startOfDay(today);

    handleSelect(
      setFields(base, {
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
        milliseconds: 0,
      }),
    );
  };

  const handlePreset = (presetValue: Date | DateRange) => {
    const anchor = presetValue instanceof Date ? presetValue : presetValue.from;

    if (anchor) setMonth(startOfMonth(anchor));
    handleSelect(presetValue);
  };

  const handleApply = () => {
    emitChange(pendingValue);
    closePopover();
  };

  return {
    ...state,
    handleDatetimeSelect,
    handleDatetimeTimeChange,
    handlePreset,
    handleApply,
  };
}

function useDatePickerState6(state: ReturnType<typeof useDatePickerState5>) {
  const { isRange, pendingValue, emitChange, focusTrigger } = state;

  const canApply = isRange
    ? isDateRange(pendingValue) && !!pendingValue.from && !!pendingValue.to
    : pendingValue instanceof Date;

  const inputState = useDatePickerTypedInput(state);

  const handleClear = () => {
    emitChange(undefined);
    inputState.setInputText("");
    inputState.setInputError(null);
    focusTrigger();
  };

  return {
    ...state,
    canApply,
    handleClear,
    ...inputState,
  };
}

function useDatePickerTypedInput(
  state: ReturnType<typeof useDatePickerState5>,
) {
  const {
    locale,
    timeZone,
    displayFormat,
    value,
    editable,
    isDatetime,
    timePattern,
    today,
    emitChange,
    setMonth,
    isBlocked,
  } = state;

  const inputPattern = displayFormat ?? "P";

  const [inputText, setInputText] = React.useState("");

  const [inputError, setInputError] = React.useState<string | null>(null);

  const valueKey = value instanceof Date ? value.getTime() : undefined;

  const inputPatterns = dateInputPatterns(
    inputPattern,
    isDatetime,
    timePattern,
  );

  React.useEffect(() => {
    if (!editable) return;
    setInputText(
      value instanceof Date
        ? formatDateValue(value, { locale, timeZone, pattern: inputPattern })
        : "",
    );
    setInputError(null);
    // valueKey stands in for `value` so a new Date with the same time doesn't reset typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, valueKey, locale, timeZone, inputPattern]);

  const commitInput = () => {
    const parsed = parseDateInput(inputText, {
      locale,
      timeZone,
      formats: inputPatterns,
    });

    if (parsed === undefined) {
      resolveEmptyDateInput(parsed, value, emitChange, setInputError);

      return;
    }

    if (parsed === null) {
      resolveInvalidDateInput(parsed, {
        isDatetime,
        today,
        locale,
        inputPattern,
        timePattern,
        setInputError,
      });

      return;
    }

    if (resolveBlockedDateInput(parsed, isBlocked, setInputError)) return;

    const hasTime = /(\d{1,2}:\d{2})/.test(inputText);

    const merged = mergeDateInputTime(parsed, value, isDatetime, hasTime);

    setInputError(null);

    if (value instanceof Date && isSameDay(value, parsed)) {
      setInputText(
        formatDateValue(merged, { locale, timeZone, pattern: inputPattern }),
      );
    } else {
      emitChange(merged);
      setMonth(startOfMonth(parsed));
    }
  };

  return {
    inputPattern,
    inputText,
    setInputText,
    inputError,
    setInputError,
    commitInput,
  };
}

function resolveEmptyDateInput(
  parsed: Date | null | undefined,
  value: DateValue,
  emitChange: (value: DateValue) => void,
  setInputError: React.Dispatch<React.SetStateAction<string | null>>,
) {
  if (parsed !== undefined) return false;
  setInputError(null);

  if (value) emitChange(undefined);

  return true;
}

function resolveInvalidDateInput(
  parsed: Date | null | undefined,
  options: {
    isDatetime: boolean;
    today: Date;
    locale?: Locale;
    inputPattern: string;
    timePattern: string | undefined;
    setInputError: React.Dispatch<React.SetStateAction<string | null>>;
  },
) {
  if (parsed !== null) return false;

  const {
    isDatetime,
    today,
    locale,
    inputPattern,
    timePattern,
    setInputError,
  } = options;

  const example = isDatetime
    ? formatDateValue(today, {
        locale,
        pattern: `${inputPattern} ${timePattern}`,
      })
    : formatDateValue(today, { locale, pattern: inputPattern });

  setInputError(`Enter a date like ${example}`);

  return true;
}

function resolveBlockedDateInput(
  parsed: Date | null | undefined,
  isBlocked: (date: Date) => boolean,
  setInputError: React.Dispatch<React.SetStateAction<string | null>>,
) {
  if (!parsed || !isBlocked(parsed)) return false;
  setInputError("That date isn't available");

  return true;
}

function mergeDateInputTime(
  parsed: Date,
  value: DateValue,
  isDatetime: boolean,
  hasTime: boolean,
) {
  if (!isDatetime || hasTime || !(value instanceof Date) || !isValid(value)) {
    return parsed;
  }

  return setFields(parsed, {
    hours: value.getHours(),
    minutes: value.getMinutes(),
    seconds: value.getSeconds(),
    milliseconds: 0,
  });
}

function useDatePickerState7(state: ReturnType<typeof useDatePickerState6>) {
  const {
    props,
    placeholder,
    locale,
    timeZone,
    displayFormat,
    value,
    isDatetime,
    timePattern,
  } = state;

  const resolveLabel1 = () => {
    if (isDatetime) {
      if (value instanceof Date && isValid(value)) {
        return `${formatDateValue(value, {
          locale,
          timeZone,
          pattern: displayFormat,
        })} ${format(value, timePattern ?? "HH:mm")}`;
      }

      return formatDateValue(value, {
        locale,
        timeZone,
        pattern: displayFormat,
        placeholder: placeholder ?? "Select date & time",
      });
    }

    return formatDateValue(value, {
      locale,
      timeZone,
      pattern: displayFormat,
      placeholder,
    });
  };

  const resolveRangeNames2 = () => {
    if (props.mode === "range" && props.name) {
      if (isStringProp(props.name)) {
        return { from: `${props.name}_from`, to: `${props.name}_to` };
      }

      return props.name;
    }

    return undefined;
  };

  const resolveValue3 = () => {
    if (value instanceof Date && isValid(value)) {
      if (isDatetime) {
        return toISODateTime(value);
      }

      return toISODate(value);
    }

    return "" as const;
  };

  return { ...state, resolveLabel1, resolveRangeNames2, resolveValue3 };
}

function useDatePickerActions(state: ReturnType<typeof useDatePickerState7>) {
  const {
    props,
    disabledDays,
    minDate,
    maxDate,
    locale,
    timeZone,
    weekStartsOn,
    markers,
    invalid,
    value,
    resolvedSize,
    errorId,
    anchorName,
    numberOfMonths,
    month,
    setMonth,
    inputError,
    resolveLabel1,
    resolveRangeNames2,
  } = state;

  /* --------------------------------- Labels -------------------------------- */
  const hasValue = isDateRange(value) ? !!value.from : !!value;

  const label = resolveLabel1();

  const describedBy =
    [props["aria-describedby"], inputError ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const isInvalid = invalid || !!inputError;

  const rangeNames = resolveRangeNames2();

  // SAFETY: anchorName is a `--name` custom-property string; the CSSProperties
  // assertion only widens the literal key for the inline style object.
  const anchorStyle = { anchorName } as React.CSSProperties;

  // SAFETY: positionAnchor is a valid csstype anchor property; the assertion
  // only widens the literal key for the inline style object.
  const popoverStyle = { positionAnchor: anchorName } as React.CSSProperties;

  /* --------------------------------- Calendar ------------------------------ */
  const calendarShared = {
    size: resolvedSize,
    minDate,
    maxDate,
    disabled: disabledDays,
    locale,
    timeZone,
    weekStartsOn,
    markers,
    numberOfMonths,
    month,
    onMonthChange: setMonth,
    autoFocus: true,
  } as const;

  return {
    ...state,
    hasValue,
    label,
    describedBy,
    isInvalid,
    rangeNames,
    anchorStyle,
    popoverStyle,
    calendarShared,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function, eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderDatePicker({
  props,
  variant,
  size,
  placeholder,
  disabled,
  showPresets,
  presets,
  applyMode,
  locale,
  timeZone,
  displayFormat,
  required,
  ariaLabel,
  className,
  isRange,
  value,
  resolvedSize,
  editable,
  isDatetime,
  timeGranularity,
  timeCycle,
  timePattern,
  baseId,
  popoverId,
  errorId,
  popoverRef,
  triggerRef,
  inputRef,
  isOpen,
  pendingValue,
  today,
  currentValue,
  closePopover,
  openPopover,
  isPresetBlocked,
  handleSelect,
  handleDatetimeSelect,
  handleDatetimeTimeChange,
  handlePreset,
  handleApply,
  canApply,
  handleClear,
  inputPattern,
  inputText,
  setInputText,
  inputError,
  commitInput,
  resolveValue3,
  hasValue,
  label,
  describedBy,
  isInvalid,
  rangeNames,
  anchorStyle,
  popoverStyle,
  calendarShared,
}: ReturnType<typeof useDatePickerActions>) {
  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={datePickerTriggerVariants({ variant, size })}
        style={anchorStyle}
        data-disabled={disabled || undefined}
        data-invalid={isInvalid || undefined}
      >
        {editable
          ? renderDatePickerSectionPart1({
              inputRef,
              baseId,
              inputText,
              today,
              locale,
              inputPattern,
              disabled,
              required,
              ariaLabel,
              isInvalid,
              describedBy,
              setInputText,
              commitInput,
              openPopover,
              triggerRef,
              popoverId,
              isOpen,
              resolvedSize,
            })
          : renderDatePickerSectionPart2({
              triggerRef,
              baseId,
              popoverId,
              isOpen,
              ariaLabel,
              isRange,
              hasValue,
              label,
              describedBy,
              isInvalid,
              required,
              disabled,
              resolvedSize,
            })}

        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={isRange ? "Clear dates" : "Clear date"}
            className="rounded p-0.5 text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <IconX aria-hidden className={iconSize[resolvedSize]} />
          </button>
        )}
      </div>

      {inputError && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs text-destructive"
        >
          {inputError}
        </p>
      )}

      {props.mode !== "range" && props.name && (
        <input type="hidden" name={props.name} value={resolveValue3()} />
      )}
      {rangeNames && renderDatePickerSectionPart3({ rangeNames, value })}

      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The native popover owns light-dismiss and focus behavior; a dialog element would introduce a second dialog lifecycle.
        role="dialog"
        aria-label={isRange ? "Choose date range" : "Choose date"}
        style={popoverStyle}
        className={cn(
          "date-picker-popover rounded-xl border border-border bg-popover text-popover-foreground shadow-xl",
          "max-sm:w-full max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0",
        )}
      >
        {isOpen && (
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row">
              {showPresets &&
                presets.length > 0 &&
                renderDatePickerSectionPart4({
                  presets,
                  today,
                  currentValue,
                  isPresetBlocked,
                  handlePreset,
                  resolvedSize,
                })}

              {props.mode === "range" ? (
                <Calendar
                  {...calendarShared}
                  mode="range"
                  selected={
                    isDateRange(currentValue) ? currentValue : undefined
                  }
                  onSelect={handleSelect}
                  minNights={props.minNights}
                  maxNights={props.maxNights}
                  excludeDisabled={props.excludeDisabled}
                  resetOnSelect={props.resetOnSelect ?? true}
                />
              ) : (
                <Calendar
                  {...calendarShared}
                  mode="single"
                  selected={
                    currentValue instanceof Date ? currentValue : undefined
                  }
                  onSelect={isDatetime ? handleDatetimeSelect : handleSelect}
                />
              )}

              {isDatetime &&
                renderDatePickerSectionPart5({
                  currentValue,
                  handleDatetimeTimeChange,
                  timeGranularity,
                  timeCycle,
                  resolvedSize,
                })}
            </div>

            {applyMode === "confirm" &&
              renderDatePickerSectionPart6({
                resolvedSize,
                isDatetime,
                pendingValue,
                locale,
                timeZone,
                displayFormat,
                timePattern,
                placeholder,
                closePopover,
                handleApply,
                canApply,
              })}
          </div>
        )}
      </div>
    </div>
  );
}
