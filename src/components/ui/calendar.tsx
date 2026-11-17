"use client";

import * as React from "react";
import {
  DayPicker,
  dateMatchModifiers,
  useDayPicker,
  type ClassNames,
  type DateRange,
  type DayButtonProps,
  type DayPickerProps,
  type Matcher,
  type MonthCaptionProps,
} from "react-day-picker";
import { TZDate } from "@date-fns/tz";
import { cva } from "class-variance-authority";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
  type Locale,
} from "date-fns";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
} from "@tabler/icons-react";
import { cn } from "cn";
import { isObjectProp } from "@/components/ui/prop-guards";

const calendarNavigationIcons = {
  left: IconChevronLeft,
  right: IconChevronRight,
  up: IconChevronUp,
  down: IconChevronDown,
};

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type CalendarSize = "sm" | "default" | "lg";

type CalendarMode = "single" | "multiple" | "range";

type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface CalendarMarker {
  /** Days that get this marker (any DayPicker matcher). */
  match: Matcher | Matcher[];
  /** Appended to the day's accessible name and shown in the legend. */
  label: string;
  tone?: "default" | "success" | "warning" | "destructive";
}

interface CalendarBaseProps {
  size?: CalendarSize;
  /** Days that cannot be selected. Accepts any DayPicker matcher (function, Date, range, dayOfWeek…). */
  disabled?: Matcher | Matcher[];
  minDate?: Date;
  maxDate?: Date;
  /** Uncontrolled initial month. Defaults to the selection, then today. */
  defaultMonth?: Date;
  /** Controlled displayed month. */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  numberOfMonths?: number;
  /** Defaults to `true` for one month, `false` for multi-month layouts. */
  showOutsideDays?: boolean;
  locale?: Locale;
  weekStartsOn?: WeekStartsOn;
  /** IANA time zone, e.g. "Asia/Jakarta". */
  timeZone?: string;
  markers?: CalendarMarker[];
  /** Defaults to `true` when markers are provided. */
  showLegend?: boolean;
  showTodayButton?: boolean;
  todayLabel?: string;
  showWeekNumber?: boolean;
  fixedWeeks?: boolean;
  autoFocus?: boolean;
  /** Month transition animation. Requires DayPicker's style.css keyframes. */
  animate?: boolean;
  "aria-label"?: string;
  /** Live-region content announced politely by DayPicker. Defaults to an sr-only selection summary. */
  footer?: React.ReactNode;
  /** Extra controls rendered below the grid, next to "Today". */
  actions?: React.ReactNode;
  className?: string;
  classNames?: Partial<ClassNames>;
}

interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  required?: boolean;
}

interface CalendarMultipleProps extends CalendarBaseProps {
  mode: "multiple";
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
  required?: boolean;
  min?: number;
  max?: number;
}

interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  required?: boolean;
  minNights?: number;
  maxNights?: number;
  /** Reset the range when it would include a disabled day. */
  excludeDisabled?: boolean;
  /** Start a fresh range when clicking after a completed one. */
  resetOnSelect?: boolean;
}

type CalendarProps =
  CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps;

/* -------------------------------------------------------------------------- */
/*                                 Size tokens                                */
/* -------------------------------------------------------------------------- */

const calendarSizeConfig = {
  sm: {
    root: "p-2",
    text: "text-xs",
    cell: "size-7 text-xs",
    weekday: "h-6 w-7 text-[10px]",
    caption: "h-7",
    nav: "size-6",
    navIcon: "size-3.5",
    toggle: "h-5 min-w-10 px-1.5 text-[11px]",
    grid: "h-8 text-[11px]",
  },
  default: {
    root: "p-3",
    text: "text-sm",
    cell: "size-9 text-sm",
    weekday: "h-7 w-9 text-xs",
    caption: "h-9",
    nav: "size-7",
    navIcon: "size-4",
    toggle: "h-7 min-w-12 px-2.5 text-xs",
    grid: "h-10 text-xs",
  },
  lg: {
    root: "p-4",
    text: "text-base",
    cell: "size-11 text-base",
    weekday: "h-8 w-11 text-sm",
    caption: "h-10",
    nav: "size-8",
    navIcon: "size-5",
    toggle: "h-8 min-w-14 px-3 text-sm",
    grid: "h-12 text-sm",
  },
} as const;

const markerToneClass: Record<NonNullable<CalendarMarker["tone"]>, string> = {
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive",
};

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

const calendarButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-muted",
        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        sm: "h-6 text-xs",
        default: "h-8 text-sm",
        lg: "h-10 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const toggleButtonVariants = cva(
  "flex h-7 min-w-16 items-center justify-center rounded px-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      active: {
        true: "bg-background font-bold text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10",
        false:
          "text-muted-foreground hover:bg-background/50 hover:text-foreground",
      },
    },
    defaultVariants: { active: false },
  },
);

const gridCellVariants = cva(
  "h-10 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed aria-disabled:line-through aria-disabled:opacity-40 aria-disabled:hover:bg-transparent",
  {
    variants: {
      state: {
        default: "text-muted-foreground hover:bg-muted hover:text-foreground",
        selected:
          "bg-primary font-bold text-primary-foreground shadow-sm ring-1 ring-primary",
        today:
          "border border-primary bg-primary/5 font-bold text-primary hover:bg-primary/10",
        outside: "font-normal text-muted-foreground/50 hover:bg-muted",
      },
    },
    defaultVariants: { state: "default" },
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/** Start of "today", in the given IANA time zone when provided. */
function getToday(timeZone?: string): Date {
  return startOfDay(timeZone ? TZDate.tz(timeZone) : new Date());
}

/** Date-only ISO string (yyyy-MM-dd). Safe for forms/APIs; maps 1:1 to Temporal.PlainDate later. */
function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function isDateRange(value: unknown): value is DateRange {
  return (
    !!value &&
    isObjectProp(value) &&
    !(value instanceof Date) &&
    "from" in value
  );
}

interface FormatDateValueOptions {
  locale?: Locale;
  timeZone?: string;
  /** date-fns pattern. When omitted, uses Intl (locale-aware, incl. formatRange). */
  pattern?: string;
  placeholder?: string;
}

function formatDateValue(
  value: Date | DateRange | undefined,
  { locale, timeZone, pattern, placeholder = "" }: FormatDateValueOptions = {},
): string {
  if (!value) return placeholder;

  const intl = new Intl.DateTimeFormat(locale?.code, {
    dateStyle: "medium",
    timeZone,
  });

  const fmt = (d: Date) =>
    pattern ? format(d, pattern, { locale }) : intl.format(d);

  if (value instanceof Date) return fmt(value);

  if (!value.from) return placeholder;

  if (!value.to) return `${fmt(value.from)} – …`;

  return pattern
    ? `${fmt(value.from)} – ${fmt(value.to)}`
    : intl.formatRange(value.from, value.to);
}

function getSelectionAnchor(props: CalendarProps): Date | undefined {
  switch (props.mode) {
    case "range":
      return props.selected?.from;
    case "multiple":
      return props.selected?.[0];
    default:
      return props.selected;
  }
}

/** Keeps Tab inside an overlay container. */
function trapFocus(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;

  const nodes = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([tabindex="-1"]), [tabindex="0"]',
    ),
  );

  if (nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

interface ResolvedMarker extends CalendarMarker {
  key: string;
}

interface CalendarContextValue {
  size: CalendarSize;
  mode: CalendarMode;
  locale?: Locale;
  minDate?: Date;
  maxDate?: Date;
  markers: ResolvedMarker[];
  /** Range mode: the picked start while the range has no end yet. */
  pendingFrom: Date | undefined;
  /** Range mode: the day the pointer is over (hover preview end). */
  hoveredDay: Date | undefined;
}

const CalendarContext = React.createContext<CalendarContextValue | null>(null);

function useCalendarContext() {
  const ctx = React.useContext(CalendarContext);

  if (!ctx)
    throw new Error("Calendar sub-components must render inside <Calendar>.");

  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                         DayPicker custom components                        */
/* (module-level so their identity is stable — no remounts on every render)   */
/* -------------------------------------------------------------------------- */

function CalendarChevron({
  orientation = "down",
  className,
}: {
  orientation?: "up" | "down" | "left" | "right";
  className?: string;
  size?: number;
  disabled?: boolean;
}) {
  const { size } = useCalendarContext();

  const Icon = calendarNavigationIcons[orientation ?? "down"];

  return (
    <Icon
      aria-hidden
      className={cn(calendarSizeConfig[size].navIcon, className)}
    />
  );
}

function CalendarDayButton(arg0: DayButtonProps) {
  const model = useCalendarDayButtonModel(arg0);

  return <CalendarDayButtonView {...model} />;
}

function CalendarMonthCaption(arg0: MonthCaptionProps) {
  const model = useCalendarMonthCaptionModel(arg0);

  return <CalendarMonthCaptionView {...model} />;
}

/* -------------------------------------------------------------------------- */
/*                               MonthYearPicker                              */
/* -------------------------------------------------------------------------- */

interface MonthYearPickerProps {
  value?: Date;
  /** `part` tells you whether a month or a year was picked. */
  onChange?: (date: Date, part: "month" | "year") => void;
  size?: CalendarSize;
  defaultView?: "month" | "year";
  minDate?: Date;
  maxDate?: Date;
  locale?: Locale;
  autoFocus?: boolean;
  className?: string;
}

interface GridCell {
  key: string;
  label: string;
  ariaLabel: string;
  selected: boolean;
  current: boolean;
  outside: boolean;
  disabled: boolean;
  select: () => void;
}

const GRID_KEY_DELTA = new Map([
  ["ArrowLeft", -1],
  ["ArrowRight", 1],
  ["ArrowUp", -3],
  ["ArrowDown", 3],
]);

const TWELVE = Array.from({ length: 12 }, (_, i) => i);

function getCalendarDaySnapshot(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
}

function subscribeToCalendarDay(onStoreChange: () => void) {
  if (typeof document === "undefined") return () => undefined;
  let active = true;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const schedule = () => {
    if (!active) return;
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(24, 0, 0, 0);
    timeoutId = setTimeout(
      () => {
        if (!active) return;
        onStoreChange();
        schedule();
      },
      nextDay.getTime() - now.getTime() + 1,
    );
  };

  const onVisibilityChange = () => {
    if (document.visibilityState !== "visible") return;
    clearTimeout(timeoutId);
    onStoreChange();
    schedule();
  };

  schedule();
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    active = false;
    clearTimeout(timeoutId);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  };
}

function useCalendarToday(): Date {
  const day = React.useSyncExternalStore(
    subscribeToCalendarDay,
    getCalendarDaySnapshot,
    getCalendarDaySnapshot,
  );

  return new Date(day);
}

function MonthYearPicker(arg0: MonthYearPickerProps) {
  const model = useMonthYearPickerModel(arg0);

  return <MonthYearPickerView {...model} />;
}

/* -------------------------------------------------------------------------- */
/*                                  Calendar                                  */
/* -------------------------------------------------------------------------- */

function Calendar(arg0: CalendarProps) {
  const model = useCalendarModel(arg0);

  return <CalendarView {...model} />;
}

export {
  Calendar,
  MonthYearPicker,
  calendarSizeConfig,
  calendarButtonVariants,
  toggleButtonVariants,
  gridCellVariants,
  formatDateValue,
  getToday,
  toISODate,
  isDateRange,
};

export type {
  CalendarProps,
  CalendarSingleProps,
  CalendarMultipleProps,
  CalendarRangeProps,
  CalendarMarker,
  CalendarSize,
  MonthYearPickerProps,
};

function CalendarContentView({
  view,
  setView,
  startDecade,
  displayYear,
}: {
  view: "month" | "year";
  setView: React.Dispatch<React.SetStateAction<"month" | "year">>;
  startDecade: number;
  displayYear: number;
}) {
  return (
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
      role="group"
      aria-label="Picker view"
      className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1"
    >
      <button
        type="button"
        aria-pressed={view === "month"}
        onClick={() => setView("month")}
        className={toggleButtonVariants({ active: view === "month" })}
      >
        Month
      </button>
      <span aria-hidden className="mx-0.5 h-4 w-px bg-border" />
      <button
        type="button"
        aria-pressed={view === "year"}
        onClick={() => setView("year")}
        className={toggleButtonVariants({ active: view === "year" })}
      >
        {view === "year" ? `${startDecade}–${startDecade + 9}` : displayYear}
      </button>
    </div>
  );
}

function getCalendarHoverBand(
  mode: CalendarMode,
  pendingFrom: Date | undefined,
  hoveredDay: Date | undefined,
  disabled: boolean | undefined,
  day: Date,
): "start" | "middle" | "end" | undefined {
  if (mode !== "range" || !pendingFrom || !hoveredDay || disabled)
    return undefined;

  return getDateBandPosition(
    pendingFrom.getTime(),
    hoveredDay.getTime(),
    day.getTime(),
  );
}

function getDateBandPosition(
  a: number,
  b: number,
  day: number,
): "start" | "middle" | "end" | undefined {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  if (day > lo && day < hi) return "middle";

  if (day === lo && day !== hi) return "start";

  if (day === hi && day !== lo) return "end";

  return undefined;
}

function useCalendarDayButtonModel({
  day,
  modifiers,
  className,
  children,
  ...props
}: DayButtonProps) {
  const { mode, markers, pendingFrom, hoveredDay } = useCalendarContext();
  const ref = React.useRef<HTMLButtonElement>(null);

  // We render our own <button>, so mirror DayPicker's focus management.
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isRangeEdge =
    mode === "range" && (modifiers.range_start || modifiers.range_end);

  const isSolid = mode === "range" ? isRangeEdge : modifiers.selected;

  // Hover preview: while the range waits for its end, paint the band between
  // the picked start and the hovered day (DayPicker v10 has no built-in preview).
  const hoverBand = getCalendarHoverBand(
    mode,
    pendingFrom,
    hoveredDay,
    modifiers.disabled,
    day.date,
  );

  const isHoverEdge = hoverBand === "start" || hoverBand === "end";

  const activeMarkers = markers.filter((m) => modifiers[m.key]);
  const markerText = activeMarkers.map((m) => m.label).join(", ");
  const baseLabel = props["aria-label"];

  return {
    ref,
    props,
    baseLabel,
    markerText,
    modifiers,
    hoverBand,
    isHoverEdge,
    isSolid,
    className,
    children,
    activeMarkers,
  };
}

// oxlint-disable-next-line eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function CalendarDayButtonView({
  ref,
  props,
  baseLabel,
  markerText,
  modifiers,
  hoverBand,
  isHoverEdge,
  isSolid,
  className,
  children,
  activeMarkers,
}: ReturnType<typeof useCalendarDayButtonModel>) {
  return (
    <button
      ref={ref}
      {...props}
      aria-label={
        baseLabel && markerText ? `${baseLabel}, ${markerText}` : baseLabel
      }
      className={cn(
        "relative inline-flex size-full items-center justify-center rounded-md font-normal tabular-nums outline-none transition-colors",
        "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        { "text-muted-foreground/50": modifiers.outside },
        { "font-semibold text-primary": modifiers.today },
        {
          "rounded-none text-foreground hover:bg-primary/15":
            modifiers.range_middle,
        },
        { "rounded-none bg-primary/10": hoverBand === "middle" },
        { "bg-primary/10": isHoverEdge },
        {
          "bg-primary font-medium text-primary-foreground hover:bg-primary/90":
            isSolid,
        },
        {
          "cursor-not-allowed text-muted-foreground line-through opacity-50 hover:bg-transparent":
            modifiers.disabled,
        },
        className,
      )}
    >
      {children}
      {!baseLabel && markerText && (
        <span className="sr-only">, {markerText}</span>
      )}
      {modifiers.today && (
        // currentColor → primary normally, primary-foreground when selected
        <span
          aria-hidden
          className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current"
        />
      )}
      {activeMarkers.length > 0 && (
        <span aria-hidden className="absolute top-1 right-1 flex gap-0.5">
          {activeMarkers.slice(0, 3).map((m) => (
            <span
              key={m.key}
              className={cn(
                "size-1 rounded-full ring-1 ring-background",
                markerToneClass[m.tone ?? "default"],
              )}
            />
          ))}
        </span>
      )}
    </button>
  );
}

function useCalendarMonthCaptionModel({
  calendarMonth,
  displayIndex,
  children,
  className,
  ...divProps
}: MonthCaptionProps) {
  const { goToMonth } = useDayPicker();
  const { size, locale, minDate, maxDate } = useCalendarContext();
  const sizeConfig = calendarSizeConfig[size];
  const overlayId = React.useId();
  const [view, setView] = React.useState<"month" | "year" | null>(null);
  const openedFrom = React.useRef<"month" | "year">("month");
  const monthButtonRef = React.useRef<HTMLButtonElement>(null);
  const yearButtonRef = React.useRef<HTMLButtonElement>(null);
  const date = calendarMonth.date;

  const toggle = (next: "month" | "year") => {
    openedFrom.current = next;
    setView((current) => (current === next ? null : next));
  };

  const close = () => {
    const target =
      openedFrom.current === "year" ? yearButtonRef : monthButtonRef;

    setView(null);
    requestAnimationFrame(() => target.current?.focus());
  };

  const toggleClass = cn(
    sizeConfig.toggle,
    "inline-flex items-center justify-center rounded-md font-medium text-foreground transition-colors",
    "hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "aria-expanded:bg-background aria-expanded:font-semibold aria-expanded:text-primary aria-expanded:shadow-sm",
  );

  return {
    divProps,
    className,
    children,
    monthButtonRef,
    view,
    overlayId,
    date,
    locale,
    toggle,
    toggleClass,
    yearButtonRef,
    close,
    size,
    minDate,
    maxDate,
    goToMonth,
    displayIndex,
    openedFrom,
  };
}

function CalendarMonthCaptionView({
  divProps,
  className,
  children,
  monthButtonRef,
  view,
  overlayId,
  date,
  locale,
  toggle,
  toggleClass,
  yearButtonRef,
  close,
  size,
  minDate,
  maxDate,
  goToMonth,
  displayIndex,
  openedFrom,
}: ReturnType<typeof useCalendarMonthCaptionModel>) {
  return (
    <div {...divProps} className={className}>
      {/* Keep DayPicker's caption label: the grid's aria-labelledby and month-change announcements use it. */}
      <span className="sr-only">{children}</span>

      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
        <button
          ref={monthButtonRef}
          type="button"
          aria-expanded={view === "month"}
          aria-controls={view ? overlayId : undefined}
          aria-label={`Choose month, ${format(date, "LLLL", { locale })}`}
          onClick={() => toggle("month")}
          className={toggleClass}
        >
          {format(date, "LLL", { locale })}
        </button>
        <span aria-hidden className="h-4 w-px bg-border" />
        <button
          ref={yearButtonRef}
          type="button"
          aria-expanded={view === "year"}
          aria-controls={view ? overlayId : undefined}
          aria-label={`Choose year, ${format(date, "yyyy", { locale })}`}
          onClick={() => toggle("year")}
          className={toggleClass}
        >
          {format(date, "yyyy", { locale })}
        </button>
      </div>

      {view && (
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- The composite popup delegates bubbling keyboard navigation and focus trapping from its buttons.
        <div
          id={overlayId}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The native popover already owns visibility; this ARIA dialog provides the custom focus-trapped popup semantics.
          role="dialog"
          aria-label={view === "month" ? "Choose month" : "Choose year"}
          className="absolute inset-0 z-20 flex rounded-md bg-popover"
          onKeyDown={(event) => calendarCallback(event, close)}
        >
          <MonthYearPicker
            value={date}
            defaultView={view}
            size={size}
            locale={locale}
            minDate={minDate}
            maxDate={maxDate}
            autoFocus
            className="size-full rounded-md border-0 shadow-none"
            onChange={(picked, part) => {
              // In multi-month layouts, keep the clicked caption's month in place.
              goToMonth(addMonths(startOfMonth(picked), -displayIndex));

              if (part === "month" || openedFrom.current === "year") close();
            }}
          />
        </div>
      )}
    </div>
  );
}

function useMonthYearPickerModel(input: MonthYearPickerProps) {
  const {
    value,
    size = "default",
    minDate,
    maxDate,
    locale,
    className,
  } = input;

  const sizeConfig = calendarSizeConfig[size];

  const navigation = useMonthYearNavigation(input);

  const {
    view,
    displayYear,
    startDecade,
    minYear,
    maxYear,
    now,
    handleMonthClick,
    handleYearClick,
  } = navigation;

  const cells = calendarMonthYearCells({
    view,
    displayYear,
    startDecade,
    minYear,
    maxYear,
    value,
    now,
    minDate,
    maxDate,
    locale,
  }).map((cell): GridCell => ({
    ...cell,
    select: () =>
      view === "month"
        ? handleMonthClick(cell.value)
        : handleYearClick(cell.value),
  }));

  const grid = useMonthYearGridFocus({ ...navigation, cells });

  const headerNavClass = cn(
    sizeConfig.nav,
    "flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "aria-disabled:pointer-events-none aria-disabled:opacity-40",
  );

  const unit = view === "year" ? "decade" : "year";

  return {
    ...navigation,
    ...grid,
    className,
    unit,
    headerNavClass,
    sizeConfig,
    cells,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function MonthYearPickerView({
  className,
  page,
  prevDisabled,
  unit,
  headerNavClass,
  sizeConfig,
  view,
  setView,
  startDecade,
  displayYear,
  nextDisabled,
  onGridKeyDown,
  cells,
  cellRefs,
  focusIndex,
  setFocusState,
  gridKey,
}: ReturnType<typeof useMonthYearPickerModel>) {
  return (
    <div
      data-slot="month-year-picker"
      className={cn(
        "flex w-70 flex-col rounded-xl border border-border bg-popover shadow-lg",
        className,
      )}
    >
      <CalendarAdornmentsView
        page={page}
        prevDisabled={prevDisabled}
        unit={unit}
        headerNavClass={headerNavClass}
        sizeConfig={sizeConfig}
        view={view}
        setView={setView}
        startDecade={startDecade}
        displayYear={displayYear}
        nextDisabled={nextDisabled}
      />

      <div className="flex flex-1 items-center p-3">
        {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- The composite popup delegates bubbling keyboard navigation and focus trapping from its buttons. */}
        <div
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This generic ARIA group preserves the custom composite layout without fieldset defaults or form semantics.
          role="group"
          aria-label={
            view === "month"
              ? `Months of ${displayYear}`
              : `Years ${startDecade}–${startDecade + 9}`
          }
          onKeyDown={onGridKeyDown}
          className="grid w-full grid-cols-3 gap-2"
        >
          {cells.map((cell, i) => {
            const resolveState2 = () => calendarResolveState2(cell);

            return (
              <button
                key={cell.key}
                ref={(el) => {
                  cellRefs.current[i] = el;
                }}
                type="button"
                tabIndex={i === focusIndex ? 0 : -1}
                aria-label={cell.ariaLabel}
                aria-pressed={cell.selected}
                aria-current={cell.current ? "date" : undefined}
                // aria-disabled (not disabled) keeps the cell focusable for keyboard users
                aria-disabled={cell.disabled || undefined}
                onFocus={() => setFocusState({ key: gridKey, index: i })}
                onClick={() => {
                  if (!cell.disabled) cell.select();
                }}
                className={cn(
                  gridCellVariants({
                    state: resolveState2(),
                  }),
                  sizeConfig.grid,
                )}
              >
                {cell.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function useCalendarModel(props: CalendarProps) {
  const resolveSelectionSummary3 = () =>
    calendarResolveSelectionSummary3(props, locale, timeZone);

  const {
    size = "default",
    minDate,
    maxDate,
    locale,
    timeZone,
    markers,
    showLegend,
    showTodayButton = true,
    todayLabel = "Today",
    actions,
    className,
    classNames: classNamesProp,
  } = props;

  const mode: CalendarMode = props.mode ?? "single";
  const sizeConfig = calendarSizeConfig[size];

  const { month, handleMonthChange, disabledMatchers, pendingFrom } =
    useCalendarNavigation(props);

  /* --------------------------------- Markers -------------------------------- */
  const { resolvedMarkers, markerModifiers } = React.useMemo(
    () => calendarUseMemo4(markers),
    [markers],
  );

  const legendItems = React.useMemo(
    () => calendarUseMemo5(resolvedMarkers),
    [resolvedMarkers],
  );

  const shouldShowLegend =
    (showLegend ?? legendItems.length > 0) && legendItems.length > 0;

  /* ------------------------------ Hover preview ----------------------------- */
  const { hoveredDay, rootRefCallback } = useCalendarHover();

  const contextValue = useCalendarContextValue({
    size,
    mode,
    locale,
    minDate,
    maxDate,
    markers: resolvedMarkers,
    pendingFrom,
    hoveredDay,
  });

  /* ------------------------- Selection announcement ------------------------- */
  const selectionSummary = resolveSelectionSummary3();

  /* -------------------------------- Styling --------------------------------- */
  const { classNames } = getCalendarClasses({ sizeConfig, classNamesProp });

  const dayPickerProps = calendarDayPickerProps(
    props,
    month,
    handleMonthChange,
    disabledMatchers,
    markerModifiers,
    classNames,
    selectionSummary,
  );

  /* ---------------------------------- Today --------------------------------- */
  const today = getToday(timeZone);

  const todayDisabled = disabledMatchers
    ? dateMatchModifiers(today, disabledMatchers)
    : false;

  const handleToday = () =>
    calendarHandleToday(handleMonthChange, today, props);

  const hasFooterArea = showTodayButton || !!actions || shouldShowLegend;

  return {
    contextValue,
    rootRefCallback,
    sizeConfig,
    className,
    dayPickerProps,
    hasFooterArea,
    shouldShowLegend,
    legendItems,
    showTodayButton,
    actions,
    handleToday,
    todayDisabled,
    todayLabel,
  };
}

function CalendarView({
  contextValue,
  rootRefCallback,
  sizeConfig,
  className,
  dayPickerProps,
  hasFooterArea,
  shouldShowLegend,
  legendItems,
  showTodayButton,
  actions,
  handleToday,
  todayDisabled,
  todayLabel,
}: ReturnType<typeof useCalendarModel>) {
  return (
    <CalendarContext.Provider value={contextValue}>
      <div
        ref={rootRefCallback}
        data-slot="calendar"
        className={cn("w-fit", sizeConfig.root, className)}
      >
        <DayPicker {...dayPickerProps} />

        {hasFooterArea && (
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {shouldShowLegend && (
              <ul
                aria-label="Legend"
                className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground"
              >
                {legendItems.map((m) => (
                  <li key={m.key} className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 rounded-full",
                        markerToneClass[m.tone ?? "default"],
                      )}
                    />
                    {m.label}
                  </li>
                ))}
              </ul>
            )}
            {(showTodayButton || actions) && (
              <div className="flex items-center gap-2">
                {showTodayButton && (
                  <button
                    type="button"
                    onClick={handleToday}
                    disabled={todayDisabled}
                    className={cn(
                      "flex-1 rounded-md py-1.5 font-medium transition-colors hover:bg-muted",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "disabled:pointer-events-none disabled:opacity-40",
                      sizeConfig.text,
                    )}
                  >
                    {todayLabel}
                  </button>
                )}
                {actions}
              </div>
            )}
          </div>
        )}
      </div>
    </CalendarContext.Provider>
  );
}

function CalendarAdornmentsView({
  page,
  prevDisabled,
  unit,
  headerNavClass,
  sizeConfig,
  view,
  setView,
  startDecade,
  displayYear,
  nextDisabled,
}: {
  page: ReturnType<typeof useMonthYearPickerModel>["page"];
  prevDisabled: ReturnType<typeof useMonthYearPickerModel>["prevDisabled"];
  unit: ReturnType<typeof useMonthYearPickerModel>["unit"];
  headerNavClass: ReturnType<typeof useMonthYearPickerModel>["headerNavClass"];
  sizeConfig: ReturnType<typeof useMonthYearPickerModel>["sizeConfig"];
  view: ReturnType<typeof useMonthYearPickerModel>["view"];
  setView: ReturnType<typeof useMonthYearPickerModel>["setView"];
  startDecade: ReturnType<typeof useMonthYearPickerModel>["startDecade"];
  displayYear: ReturnType<typeof useMonthYearPickerModel>["displayYear"];
  nextDisabled: ReturnType<typeof useMonthYearPickerModel>["nextDisabled"];
}) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-2">
      <button
        type="button"
        onClick={() => page(-1)}
        aria-disabled={prevDisabled || undefined}
        aria-label={`Previous ${unit}`}
        className={headerNavClass}
      >
        <IconChevronLeft aria-hidden className={sizeConfig.navIcon} />
      </button>

      <CalendarContentView
        view={view}
        setView={setView}
        startDecade={startDecade}
        displayYear={displayYear}
      />

      <button
        type="button"
        onClick={() => page(1)}
        aria-disabled={nextDisabled || undefined}
        aria-label={`Next ${unit}`}
        className={headerNavClass}
      >
        <IconChevronRight aria-hidden className={sizeConfig.navIcon} />
      </button>
    </div>
  );
}

function calendarCallback(
  event: React.KeyboardEvent<HTMLDivElement>,
  close: () => void,
) {
  if (event.key === "Escape") {
    // preventDefault stops the surrounding native popover from closing too.
    event.preventDefault();
    event.stopPropagation();
    close();

    return;
  }

  trapFocus(event);
}

function calendarOnGridKeyDown(
  event: React.KeyboardEvent<Element>,
  focusCell: (index: number) => void,
  focusIndex: number,
  page: (direction: -1 | 1, moveFocusIntoGrid?: boolean) => void,
) {
  const delta = GRID_KEY_DELTA.get(event.key);

  if (delta !== undefined) {
    event.preventDefault();
    focusCell(focusIndex + delta);
  } else if (event.key === "Home") {
    event.preventDefault();
    focusCell(0);
  } else if (event.key === "End") {
    event.preventDefault();
    focusCell(11);
  } else if (event.key === "PageUp" || event.key === "PageDown") {
    event.preventDefault();
    page(event.key === "PageUp" ? -1 : 1, true);
  }
}

function calendarResolveState2(cell: GridCell) {
  if (cell.selected) {
    return "selected" as const;
  }

  if (cell.current) {
    return "today" as const;
  }

  if (cell.outside) {
    return "outside" as const;
  }

  return "default" as const;
}

function calendarResolveSelectionSummary3(
  props: CalendarProps,
  locale: Locale | undefined,
  timeZone: string | undefined,
) {
  if (props.mode === "multiple") {
    if (props.selected?.length) {
      return `${props.selected.length} dates selected`;
    }

    return "" as const;
  }

  return formatDateValue(props.selected, { locale, timeZone });
}

function calendarUseMemo(
  minDate: Date | undefined,
  maxDate: Date | undefined,
  disabled: Matcher | Matcher[] | undefined,
) {
  const list: Matcher[] = [];

  if (minDate) list.push({ before: minDate });

  if (maxDate) list.push({ after: maxDate });

  if (disabled) list.push(...(Array.isArray(disabled) ? disabled : [disabled]));

  return list.length > 0 ? list : undefined;
}

function calendarUseMemo2(
  pendingFrom: Date | undefined,
  minNights: number,
  maxNights: number | undefined,
  excludeDisabled: boolean,
  baseDisabledMatchers: Matcher[] | undefined,
) {
  if (!pendingFrom) return undefined;

  if (!excludeDisabled && !maxNights && minNights === 0) return undefined;
  const fromTime = pendingFrom.getTime();
  const maxSpanDays = maxNights ?? undefined;

  // Disabled-day lookup over a bounded window around the pending start.
  let disabledTimes: Set<number> | undefined;

  if (excludeDisabled && baseDisabledMatchers) {
    disabledTimes = new Set<number>();
    const lo = startOfDay(addDays(pendingFrom, -400)).getTime();
    const hi = startOfDay(addDays(pendingFrom, 400)).getTime();

    for (let t = lo; t <= hi; t += 86_400_000) {
      const probe = new Date(t);

      // Skip probes that the base matchers already reject on bounds —
      // dateMatchModifiers doesn't consult startMonth/endMonth.
      if (dateMatchModifiers(probe, baseDisabledMatchers)) disabledTimes.add(t);
    }
  }

  return (day: Date) => {
    const dayTime = startOfDay(day).getTime();
    const lo = Math.min(fromTime, dayTime);
    const hi = Math.max(fromTime, dayTime);

    if (maxSpanDays !== undefined && (hi - lo) / 86_400_000 > maxSpanDays)
      return true;

    if (disabledTimes) {
      for (let t = lo; t <= hi; t += 86_400_000) {
        if (t !== fromTime && disabledTimes.has(t)) return true;
      }
    }

    return false;
  };
  // rangeProps fields are read from the narrowed range union; they're stable
  // per selection because pendingFrom only exists while the range is open.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}

function calendarUseMemo3(
  baseDisabledMatchers: Matcher[] | undefined,
  validEndMatcher: Matcher | undefined,
) {
  const list: Matcher[] = [];

  if (baseDisabledMatchers)
    list.push(
      ...(Array.isArray(baseDisabledMatchers)
        ? baseDisabledMatchers
        : [baseDisabledMatchers]),
    );

  if (validEndMatcher) list.push(validEndMatcher);

  return list.length > 0 ? list : undefined;
}

function calendarUseMemo4(markers: CalendarMarker[] | undefined) {
  const resolved: ResolvedMarker[] = (markers ?? []).map((m, i) => ({
    ...m,
    key: `marker${i}`,
  }));

  const modifiers: Record<string, Matcher | Matcher[]> = {};

  for (const m of resolved) modifiers[m.key] = m.match;

  return { resolvedMarkers: resolved, markerModifiers: modifiers };
}

function calendarUseMemo5(resolvedMarkers: ResolvedMarker[]) {
  const seen = new Set<string>();

  return resolvedMarkers.filter((m) => {
    const id = `${m.tone ?? "default"}:${m.label}`;

    if (seen.has(id)) return false;
    seen.add(id);

    return true;
  });
}

function calendarHandleToday(
  handleMonthChange: (next: Date) => void,
  today: Date,
  props: CalendarProps,
) {
  handleMonthChange(startOfMonth(today));

  switch (props.mode) {
    case "range":
      props.onSelect?.(
        props.minNights
          ? { from: today, to: undefined }
          : { from: today, to: today },
      );
      break;
    case "multiple": {
      const current = props.selected ?? [];

      if (!current.some((d) => isSameDay(d, today)))
        props.onSelect?.([...current, today]);
      break;
    }

    default:
      props.onSelect?.(today);
  }
}

function getCalendarClasses({
  sizeConfig,
  classNamesProp,
}: GetCalendarClassesParams) {
  const navButtonClass = cn(
    sizeConfig.nav,
    "pointer-events-auto inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors",
    "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
  );

  const classNames: Partial<ClassNames> = {
    root: cn("relative w-fit", sizeConfig.text),
    months: "relative flex flex-col gap-4 sm:flex-row",
    month: "relative flex flex-col gap-2",
    month_caption: cn("flex items-center justify-center", sizeConfig.caption),
    nav: cn(
      "pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between",
      sizeConfig.caption,
    ),
    button_previous: navButtonClass,
    button_next: navButtonClass,
    month_grid: "border-collapse",
    weekdays: "flex",
    weekday: cn(
      sizeConfig.weekday,
      "flex items-center justify-center font-medium text-muted-foreground",
    ),
    week: "mt-1 flex",
    week_number_header: cn(
      sizeConfig.weekday,
      "flex items-center justify-center text-muted-foreground",
    ),
    week_number: cn(
      sizeConfig.cell,
      "flex items-center justify-center text-[0.7em] text-muted-foreground",
    ),
    day: cn(sizeConfig.cell, "relative p-0 text-center"),
    day_button: "",
    // Day visuals are computed in CalendarDayButton from modifiers; cells only paint the range band.
    selected: "",
    today: "",
    outside: "",
    disabled: "",
    focused: "",
    range_start: "rounded-l-md bg-primary/10",
    range_middle: "bg-primary/10",
    range_end: "rounded-r-md bg-primary/10",
    hidden: "invisible",
    ...classNamesProp,
  };

  return { classNames } satisfies { classNames: typeof classNames };
}

function useCalendarContextValue({
  size,
  mode,
  locale,
  minDate,
  maxDate,
  markers,
  pendingFrom,
  hoveredDay,
}: CalendarContextValue) {
  return React.useMemo<CalendarContextValue>(
    () => ({
      size,
      mode,
      locale,
      minDate,
      maxDate,
      markers,
      pendingFrom,
      hoveredDay,
    }),
    [size, mode, locale, minDate, maxDate, markers, pendingFrom, hoveredDay],
  );
}

function useCalendarHover() {
  const [hoveredDay, setHoveredDay] = React.useState<Date | undefined>(
    undefined,
  );

  // Native delegation on the calendar root: day cells carry data-day
  // (YYYY-MM-DD). Synthetic mouseenter needs React's over/out pairing,
  // which is fragile under automated pointers; raw listeners are not.
  // A ref callback (not an effect) re-attaches whenever the wrapper node
  // is replaced, and the listeners read only refs + setState, so they
  // stay valid for the lifetime of the node.
  const hoveredRef = React.useRef<Date | undefined>(undefined);

  const rootRefCallback = React.useCallback((el: HTMLDivElement | null) => {
    if (!el) return;

    const parse = (target: EventTarget | null): Date | undefined => {
      const cell =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-day]")
          : null;

      const value = cell?.dataset.day;

      if (!value) return undefined;
      const [y, m, d] = value.split("-").map(Number);

      return new Date(y, m - 1, d);
    };

    const onOver = (event: Event) => {
      const day = parse(event.target);
      const prev = hoveredRef.current;

      if (prev?.getTime() === day?.getTime()) return;
      hoveredRef.current = day;
      setHoveredDay(day);
    };

    const onOut = (event: Event) => {
      if (parse(event.target)) {
        hoveredRef.current = undefined;
        setHoveredDay(undefined);
      }
    };

    el.addEventListener("mouseover", onOver);
    el.addEventListener("mouseout", onOut);
  }, []);

  return { hoveredDay, rootRefCallback } satisfies {
    hoveredDay: typeof hoveredDay;
    rootRefCallback: typeof rootRefCallback;
  };
}

type GetCalendarClassesParams = {
  sizeConfig:
    | {
        readonly root: "p-2";
        readonly text: "text-xs";
        readonly cell: "size-7 text-xs";
        readonly weekday: "h-6 w-7 text-[10px]";
        readonly caption: "h-7";
        readonly nav: "size-6";
        readonly navIcon: "size-3.5";
        readonly toggle: "h-5 min-w-10 px-1.5 text-[11px]";
        readonly grid: "h-8 text-[11px]";
      }
    | {
        readonly root: "p-3";
        readonly text: "text-sm";
        readonly cell: "size-9 text-sm";
        readonly weekday: "h-7 w-9 text-xs";
        readonly caption: "h-9";
        readonly nav: "size-7";
        readonly navIcon: "size-4";
        readonly toggle: "h-7 min-w-12 px-2.5 text-xs";
        readonly grid: "h-10 text-xs";
      }
    | {
        readonly root: "p-4";
        readonly text: "text-base";
        readonly cell: "size-11 text-base";
        readonly weekday: "h-8 w-11 text-sm";
        readonly caption: "h-10";
        readonly nav: "size-8";
        readonly navIcon: "size-5";
        readonly toggle: "h-8 min-w-14 px-3 text-sm";
        readonly grid: "h-12 text-sm";
      };
  classNamesProp: Partial<ClassNames> | undefined;
};

function calendarMonthYearCells({
  view,
  displayYear,
  startDecade,
  minYear,
  maxYear,
  value,
  now,
  minDate,
  maxDate,
  locale,
}: Pick<MonthYearPickerProps, "value" | "minDate" | "maxDate" | "locale"> & {
  view: "month" | "year";
  displayYear: number;
  startDecade: number;
  minYear: number | undefined;
  maxYear: number | undefined;
  now: Date;
}): (Omit<GridCell, "select"> & { value: number })[] {
  return view === "month"
    ? TWELVE.map((m) => {
        const d = new Date(displayYear, m, 1);

        return {
          key: `m-${m}`,
          label: format(d, "LLL", { locale }),
          ariaLabel: format(d, "LLLL yyyy", { locale }),
          selected:
            !!value &&
            value.getFullYear() === displayYear &&
            value.getMonth() === m,
          current: now.getFullYear() === displayYear && now.getMonth() === m,
          outside: false,
          disabled:
            (!!minDate && endOfMonth(d).getTime() < minDate.getTime()) ||
            (!!maxDate && d.getTime() > maxDate.getTime()),
          value: m,
        };
      })
    : TWELVE.map((i) => {
        const year = startDecade - 1 + i;

        return {
          key: `y-${year}`,
          label: String(year),
          ariaLabel: String(year),
          selected: value?.getFullYear() === year,
          current: now.getFullYear() === year,
          outside: year < startDecade || year > startDecade + 9,
          disabled:
            (minYear !== undefined && year < minYear) ||
            (maxYear !== undefined && year > maxYear),
          value: year,
        };
      });
}

function useMonthYearGridFocus({
  view,
  displayYear,
  startDecade,
  cells,
  consumePendingFocus,
  focusAt,
  page,
}: {
  view: "month" | "year";
  displayYear: number;
  startDecade: number;
  cells: GridCell[];
  consumePendingFocus: () => boolean;
  focusAt: (index: number) => void;
  page: (direction: -1 | 1, moveFocusIntoGrid?: boolean) => void;
}) {
  // Roving tabindex, derived per grid page (no effect needed to reset it).
  const gridKey = `${view}:${view === "month" ? displayYear : startDecade}`;

  const fallbackFocus =
    [
      cells.findIndex((c) => c.selected),
      cells.findIndex((c) => c.current),
      cells.findIndex((c) => !c.disabled),
    ].find((i) => i >= 0) ?? 0;

  const [focusState, setFocusState] = React.useState({
    key: gridKey,
    index: fallbackFocus,
  });

  const focusIndex =
    focusState.key === gridKey ? focusState.index : fallbackFocus;

  React.useEffect(() => {
    if (consumePendingFocus()) focusAt(focusIndex);
  });

  const focusCell = (index: number) => {
    const next = Math.max(0, Math.min(11, index));
    setFocusState({ key: gridKey, index: next });
    focusAt(next);
  };

  const onGridKeyDown = (event: React.KeyboardEvent) =>
    calendarOnGridKeyDown(event, focusCell, focusIndex, page);

  return { focusIndex, setFocusState, gridKey, onGridKeyDown };
}

function useCalendarNavigation(props: CalendarProps) {
  const {
    defaultMonth,
    timeZone,
    month: monthProp,
    onMonthChange,
    minDate,
    maxDate,
    disabled,
  } = props;

  /* ---------------------------- Month (nav) state --------------------------- */
  const [uncontrolledMonth, setUncontrolledMonth] = React.useState<Date>(() =>
    startOfMonth(
      defaultMonth ?? getSelectionAnchor(props) ?? getToday(timeZone),
    ),
  );

  const month = monthProp ?? uncontrolledMonth;

  const handleMonthChange = (next: Date) => {
    if (monthProp === undefined) setUncontrolledMonth(next);
    onMonthChange?.(next);
  };

  /* ------------------------------ Disabled days ----------------------------- */
  const baseDisabledMatchers = React.useMemo(
    () => calendarUseMemo(minDate, maxDate, disabled),
    [minDate, maxDate, disabled],
  );

  const { pendingFrom, minNights, maxNights, excludeDisabled } =
    calendarPendingRange(props);

  const validEndMatcher = React.useMemo<Matcher | undefined>(
    () =>
      calendarUseMemo2(
        pendingFrom,
        minNights,
        maxNights,
        excludeDisabled,
        baseDisabledMatchers,
      ),
    [pendingFrom, minNights, maxNights, excludeDisabled, baseDisabledMatchers],
  );

  const disabledMatchers = React.useMemo(
    () => calendarUseMemo3(baseDisabledMatchers, validEndMatcher),
    [baseDisabledMatchers, validEndMatcher],
  );

  return { month, handleMonthChange, disabledMatchers, pendingFrom };
}

function calendarCommonProps(
  props: CalendarProps,
  month: Date,
  handleMonthChange: (next: Date) => void,
  disabledMatchers: Matcher[] | undefined,
  markerModifiers: ReturnType<typeof calendarUseMemo4>["markerModifiers"],
  classNames: ReturnType<typeof getCalendarClasses>["classNames"],
  selectionSummary: string,
) {
  const {
    minDate,
    maxDate,
    locale,
    weekStartsOn,
    timeZone,
    numberOfMonths = 1,
    showOutsideDays = numberOfMonths === 1,
    fixedWeeks,
    showWeekNumber,
    autoFocus = false,
    animate = false,
    footer,
  } = props;

  const common = {
    month,
    onMonthChange: handleMonthChange,
    startMonth: minDate,
    endMonth: maxDate,
    disabled: disabledMatchers,
    modifiers: markerModifiers,
    locale,
    weekStartsOn,
    timeZone,
    numberOfMonths,
    showOutsideDays,
    fixedWeeks,
    showWeekNumber,
    autoFocus,
    animate,
    "aria-label": props["aria-label"],
    footer: footer ?? <span className="sr-only">{selectionSummary}</span>,
    classNames,
    components: {
      Chevron: CalendarChevron,
      DayButton: CalendarDayButton,
      MonthCaption: CalendarMonthCaption,
    },
  };

  return common;
}

function calendarSelectionProps(
  props: CalendarProps,
  common: ReturnType<typeof calendarCommonProps>,
) {
  // The public API is a strict discriminated union. DayPicker additionally discriminates on
  // `required: true`, so this one internal assertion is localized here.
  let dayPickerProps: DayPickerProps;

  switch (props.mode) {
    case "range":
      // SAFETY: the switch narrows props to CalendarRangeProps, so mode/
      // selected/onSelect pairs match DayPicker's range branch.
      dayPickerProps = {
        ...common,
        mode: "range",
        selected: props.selected,
        onSelect: props.onSelect,
        required: props.required,
        min: props.minNights,
        max: props.maxNights,
        excludeDisabled: props.excludeDisabled,
        resetOnSelect: props.resetOnSelect,
      } as DayPickerProps;
      break;
    case "multiple":
      // SAFETY: narrowed to CalendarMultipleProps; multiple-mode prop pairs
      // match DayPicker's multiple branch.
      dayPickerProps = {
        ...common,
        mode: "multiple",
        selected: props.selected,
        onSelect: props.onSelect,
        required: props.required,
        min: props.min,
        max: props.max,
      } as DayPickerProps;
      break;
    default:
      // SAFETY: narrowed to CalendarSingleProps; single-mode prop pairs match
      // DayPicker's single branch.
      dayPickerProps = {
        ...common,
        mode: "single",
        selected: props.selected,
        onSelect: props.onSelect,
        required: props.required,
      } as DayPickerProps;
  }

  return dayPickerProps;
}

function useDisplayedCalendarYear(value: Date | undefined, now: Date) {
  const [displayYear, setDisplayYear] = React.useState(() =>
    (value ?? now).getFullYear(),
  );

  const valueYear = value?.getFullYear();
  const [previousValueYear, setPreviousValueYear] = React.useState(valueYear);

  if (!Object.is(valueYear, previousValueYear)) {
    setPreviousValueYear(valueYear);

    if (valueYear !== undefined) setDisplayYear(valueYear);
  }

  return { displayYear, setDisplayYear };
}

function calendarYearBounds(
  view: "month" | "year",
  displayYear: number,
  minDate: Date | undefined,
  maxDate: Date | undefined,
) {
  const startDecade = Math.floor(displayYear / 10) * 10;
  const minYear = minDate?.getFullYear();
  const maxYear = maxDate?.getFullYear();

  const prevDisabled =
    minYear !== undefined &&
    (view === "year" ? startDecade <= minYear : displayYear - 1 < minYear);

  const nextDisabled =
    maxYear !== undefined &&
    (view === "year" ? startDecade + 10 > maxYear : displayYear + 1 > maxYear);

  return { startDecade, minYear, maxYear, prevDisabled, nextDisabled };
}

function calendarPendingRange(props: CalendarProps) {
  const range = props.mode === "range" ? props : undefined;
  const selected = range?.selected;
  const pendingFrom = calendarPendingFrom(selected);

  return {
    pendingFrom,
    minNights: range?.minNights ?? 0,
    maxNights: range?.maxNights,
    excludeDisabled: range?.excludeDisabled ?? false,
  };
}

function calendarPendingFrom(selected: DateRange | undefined) {
  return selected?.from && !selected.to ? selected.from : undefined;
}

function useMonthYearNavigation({
  value,
  onChange,
  defaultView = "month",
  minDate,
  maxDate,
  autoFocus = false,
}: MonthYearPickerProps) {
  const [view, setView] = React.useState<"month" | "year">(defaultView);

  const cellRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const pendingFocus = React.useRef(autoFocus);

  const now = useCalendarToday();

  const { displayYear, setDisplayYear } = useDisplayedCalendarYear(value, now);

  const { startDecade, minYear, maxYear, prevDisabled, nextDisabled } =
    calendarYearBounds(view, displayYear, minDate, maxDate);

  const handleMonthClick = React.useCallback(
    (monthIndex: number) => {
      onChange?.(
        setMonth(setYear(value ?? new Date(), displayYear), monthIndex),
        "month",
      );
    },
    [value, onChange, displayYear],
  );

  const handleYearClick = React.useCallback(
    (year: number) => {
      onChange?.(setYear(value ?? new Date(), year), "year");
      setDisplayYear(year);
      setView("month");
      pendingFocus.current = true;
    },
    [value, onChange, pendingFocus, setDisplayYear],
  );

  const page = (direction: -1 | 1, moveFocusIntoGrid = false) => {
    if (direction < 0 ? prevDisabled : nextDisabled) return;
    pendingFocus.current = moveFocusIntoGrid;
    setDisplayYear((y) => y + direction * (view === "year" ? 10 : 1));
  };

  const consumePendingFocus = () => {
    const pending = pendingFocus.current;
    pendingFocus.current = false;

    return pending;
  };

  const focusAt = (index: number) => cellRefs.current[index]?.focus();

  return {
    consumePendingFocus,
    focusAt,
    view,
    setView,
    cellRefs,
    pendingFocus,
    now,
    displayYear,
    startDecade,
    minYear,
    maxYear,
    prevDisabled,
    nextDisabled,
    handleMonthClick,
    handleYearClick,
    page,
  };
}

function calendarDayPickerProps(
  ...args: Parameters<typeof calendarCommonProps>
) {
  return calendarSelectionProps(args[0], calendarCommonProps(...args));
}
