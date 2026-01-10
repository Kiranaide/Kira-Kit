import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DateRange,
  type Matcher,
} from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { isBefore } from "date-fns";

// ============================================
// CALENDAR COMPONENT
// ============================================

interface CalendarProps {
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (
    date: Date | Date[] | { from?: Date; to?: Date } | undefined
  ) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  className,
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  // Convert our API to react-day-picker's API
  const handleSelect = React.useCallback(
    (date: Date | Date[] | { from?: Date; to?: Date } | undefined) => {
      onSelect?.(date);
    },
    [onSelect]
  );

  // Build disabled matcher
  const disabledMatcher = React.useMemo(() => {
    const matchers: Matcher[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    if (disabled) matchers.push(disabled);
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate, disabled]);

  // Render different DayPicker instances based on mode for proper type safety
  if (mode === "range") {
    return (
      <DayPicker
        mode="range"
        selected={selected as DateRange | undefined}
        onSelect={handleSelect as (date: DateRange | undefined) => void}
        disabled={disabledMatcher}
        required={false}
        className={cn("p-3", className)}
        showOutsideDays
        classNames={{
          root: `${defaultClassNames.root}`,
          months: `${defaultClassNames.months}`,
          month: `${defaultClassNames.month}`,
          month_caption: `${defaultClassNames.month_caption} flex items-center justify-center mb-4`,
          caption_label: `${defaultClassNames.caption_label} text-sm font-medium`,
          nav: `${defaultClassNames.nav} flex items-center gap-1`,
          button_previous: `${defaultClassNames.button_previous} p-1 rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
          button_next: `${defaultClassNames.button_next} p-1 rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
          month_grid: `${defaultClassNames.month_grid} w-full border-collapse`,
          weekdays: `${defaultClassNames.weekdays}`,
          weekday: `${defaultClassNames.weekday} h-9 text-center text-xs text-muted-foreground font-medium p-0`,
          week: `${defaultClassNames.week}`,
          day: `${defaultClassNames.day} h-9 text-center p-0`,
          day_button: `${defaultClassNames.day_button} w-full h-full flex flex-col items-center justify-center hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all relative rounded-md`,
          selected: `bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
          today: `${defaultClassNames.today} bg-muted/30 font-medium text-foreground`,
          outside: `${defaultClassNames.outside} text-muted-foreground/60`,
          disabled: `${defaultClassNames.disabled} text-muted-foreground/50 opacity-60 cursor-not-allowed aria-disabled:true`,
          range_start: `${defaultClassNames.range_start} bg-primary text-primary-foreground font-medium rounded-r-none hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
          range_end: `${defaultClassNames.range_end} bg-primary text-primary-foreground font-medium rounded-l-none hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
          range_middle: `bg-primary/10 text-foreground font-medium rounded-none hover:bg-primary/15 aria-selected:bg-primary/10 [&_.rdp-day_button]:text-foreground [&_.rdp-day_button]:font-medium`,
          hidden: `${defaultClassNames.hidden} invisible`,
        }}
      />
    );
  }

  // Multiple mode
  if (mode === "multiple") {
    return (
      <DayPicker
        mode="multiple"
        selected={selected as Date[] | undefined}
        onSelect={handleSelect as (date: Date[] | undefined) => void}
        disabled={disabledMatcher}
        required={false}
        className={cn("p-3", className)}
        showOutsideDays
        classNames={{
          root: `${defaultClassNames.root}`,
          months: `${defaultClassNames.months}`,
          month: `${defaultClassNames.month}`,
          month_caption: `${defaultClassNames.month_caption} flex items-center justify-center mb-4`,
          caption_label: `${defaultClassNames.caption_label} text-sm font-medium`,
          nav: `${defaultClassNames.nav} flex items-center gap-1`,
          button_previous: `${defaultClassNames.button_previous} p-1 rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
          button_next: `${defaultClassNames.button_next} p-1 rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
          month_grid: `${defaultClassNames.month_grid} w-full border-collapse`,
          weekdays: `${defaultClassNames.weekdays}`,
          weekday: `${defaultClassNames.weekday} h-9 text-center text-xs text-muted-foreground font-medium p-0`,
          week: `${defaultClassNames.week}`,
          day: `${defaultClassNames.day} h-9 text-center p-0`,
          day_button: `${defaultClassNames.day_button} w-full h-full flex flex-col items-center justify-center hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-background transition-all relative rounded-md`,
          selected: `bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
          today: `${defaultClassNames.today} bg-muted/30 font-medium text-foreground`,
          outside: `${defaultClassNames.outside} text-muted-foreground/60`,
          disabled: `${defaultClassNames.disabled} text-muted-foreground/50 opacity-60 cursor-not-allowed aria-disabled:true`,
          range_start: `${defaultClassNames.range_start} bg-primary text-primary-foreground font-medium rounded-r-none hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
          range_end: `${defaultClassNames.range_end} bg-primary text-primary-foreground font-medium rounded-l-none hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
          range_middle: `${defaultClassNames.range_middle} bg-primary/10 text-foreground font-medium rounded-none hover:bg-primary/15 aria-selected:bg-primary/10`,
          hidden: `${defaultClassNames.hidden} invisible`,
        }}
      />
    );
  }

  // Single mode
  return (
    <DayPicker
      mode="single"
      selected={selected as Date | undefined}
      onSelect={handleSelect as (date: Date | undefined) => void}
      disabled={disabledMatcher}
      className={cn("p-3", className)}
      showOutsideDays
      classNames={{
        root: `${defaultClassNames.root}`,
        months: `${defaultClassNames.months}`,
        month: `${defaultClassNames.month}`,
        month_caption: `${defaultClassNames.month_caption} flex items-center justify-center mb-4`,
        caption_label: `${defaultClassNames.caption_label} text-sm font-medium`,
        nav: `${defaultClassNames.nav} flex items-center gap-1`,
        button_previous: `${defaultClassNames.button_previous} p-1 rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
        button_next: `${defaultClassNames.button_next} p-1 rounded-md hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`,
        month_grid: `${defaultClassNames.month_grid} w-full border-collapse`,
        weekdays: `${defaultClassNames.weekdays}`,
        weekday: `${defaultClassNames.weekday} h-9 text-center text-xs text-muted-foreground font-medium p-0`,
        week: `${defaultClassNames.week}`,
        day: `${defaultClassNames.day} h-9 text-center p-0`,
        day_button: `${defaultClassNames.day_button} w-full h-full flex flex-col items-center justify-center hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-background transition-all relative rounded-md`,
        selected: `bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
        today: `${defaultClassNames.today} bg-muted/30 font-medium text-foreground`,
        outside: `${defaultClassNames.outside} text-muted-foreground/60`,
        disabled: `${defaultClassNames.disabled} text-muted-foreground/50 opacity-60 cursor-not-allowed aria-disabled:true`,
        range_start: `${defaultClassNames.range_start} bg-primary text-primary-foreground font-medium rounded-r-none hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
        range_end: `${defaultClassNames.range_end} bg-primary text-primary-foreground font-medium rounded-l-none hover:bg-primary/90 aria-selected:bg-primary aria-selected:text-primary-foreground`,
        range_middle: `${defaultClassNames.range_middle} bg-primary/10 text-foreground font-medium rounded-none hover:bg-primary/15 aria-selected:bg-primary/10`,
        hidden: `${defaultClassNames.hidden} invisible`,
      }}
    />
  );
}

// ============================================
// MONTH PICKER (Keep existing implementation)
// ============================================

const calendarButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-muted",
        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-7 w-7 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthPickerProps {
  mode?: "single" | "range";
  selected?: Date | { from?: Date; to?: Date };
  onSelect?: (date: Date | { from?: Date; to?: Date }) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  currentYear?: number;
}

function MonthPicker({
  mode = "single",
  selected,
  onSelect,
  className,
  size = "default",
  currentYear: propCurrentYear,
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = React.useState(
    propCurrentYear ??
      (selected instanceof Date
        ? selected.getFullYear()
        : new Date().getFullYear())
  );

  // Sync with prop when it changes - always update when prop changes
  React.useEffect(() => {
    if (propCurrentYear !== undefined) {
      setCurrentYear(propCurrentYear);
    }
  }, [propCurrentYear]);

  // Use prop value directly if available, otherwise use state
  const displayYear = propCurrentYear ?? currentYear;

  // Match calendar size configuration
  const buttonSize = React.useMemo(() => {
    switch (size) {
      case "sm":
        return "h-9";
      case "lg":
        return "h-12";
      default:
        return "h-11";
    }
  }, [size]);

  const handleMonthClick = (monthIndex: number) => {
    const date = new Date(displayYear, monthIndex, 1);
    if (mode === "single") {
      onSelect?.(date);
    } else {
      const range = selected as { from?: Date; to?: Date } | undefined;
      if (!range?.from || (range.from && range.to)) {
        onSelect?.({ from: date, to: undefined });
      } else {
        if (isBefore(date, range.from)) {
          onSelect?.({ from: date, to: range.from });
        } else {
          onSelect?.({ from: range.from, to: date });
        }
      }
    }
  };

  const isMonthSelected = (monthIndex: number) => {
    if (!selected) return false;
    if (selected instanceof Date) {
      return (
        selected.getMonth() === monthIndex &&
        selected.getFullYear() === displayYear
      );
    }
    return false;
  };

  return (
    <div
      data-picker-container
      className={cn("w-full min-w-0", className)}
      style={{ width: "100%" }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentYear(displayYear - 1)}
          className={cn(
            buttonSize,
            "w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{displayYear}</span>
        <button
          onClick={() => setCurrentYear(displayYear + 1)}
          className={cn(
            buttonSize,
            "w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        data-picker-grid
        className="grid grid-cols-3 gap-2 w-full border-collapse"
        style={{
          gridTemplateRows: "repeat(4, minmax(0, 1fr))",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={cn(
              calendarButtonVariants({
                variant: isMonthSelected(index) ? "selected" : "default",
              }),
              buttonSize,
              "w-full"
            )}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// YEAR PICKER (Keep existing implementation)
// ============================================

interface YearPickerProps {
  mode?: "single" | "range";
  selected?: number | { from?: number; to?: number };
  onSelect?: (year: number | { from?: number; to?: number }) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
}

function YearPicker({
  selected,
  onSelect,
  className,
  size = "default",
}: YearPickerProps) {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = React.useState(
    Math.floor((typeof selected === "number" ? selected : currentYear) / 12) *
      12
  );

  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  // Match calendar size configuration
  const buttonSize = React.useMemo(() => {
    switch (size) {
      case "sm":
        return "h-9";
      case "lg":
        return "h-12";
      default:
        return "h-11";
    }
  }, [size]);

  const handleYearClick = (year: number) => {
    // Always call onSelect with the year number for date picker integration
    // The date picker will handle the mode logic
    onSelect?.(year);
  };

  const isYearSelected = (year: number) => {
    if (typeof selected === "number") return selected === year;
    return false;
  };

  return (
    <div
      data-picker-container
      className={cn("w-full min-w-0", className)}
      style={{ width: "100%" }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setStartYear(startYear - 12)}
          className={cn(
            buttonSize,
            "w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {startYear} - {startYear + 11}
        </span>
        <button
          onClick={() => setStartYear(startYear + 12)}
          className={cn(
            buttonSize,
            "w-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div
        data-picker-grid
        className="grid grid-cols-3 gap-2 w-full border-collapse"
        style={{
          gridTemplateRows: "repeat(4, minmax(0, 1fr))",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
        }}
      >
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className={cn(
              calendarButtonVariants({
                variant: isYearSelected(year) ? "selected" : "default",
              }),
              buttonSize,
              "w-full"
            )}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}

export { Calendar, MonthPicker, YearPicker, calendarButtonVariants };
