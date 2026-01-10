import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/utils";

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
    const matchers: any[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    if (disabled) matchers.push(disabled);
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate, disabled]);

  return (
    <DayPicker
      mode={mode}
      selected={selected as any}
      onSelect={handleSelect as any}
      disabled={disabledMatcher}
      className={cn("p-3", className)}
      classNames={{
        root: `${defaultClassNames.root}`,
        months: `${defaultClassNames.months}`,
        month: `${defaultClassNames.month}`,
        month_caption: `${defaultClassNames.month_caption} flex items-center justify-center mb-4`,
        caption_label: `${defaultClassNames.caption_label} text-sm font-medium`,
        nav: `${defaultClassNames.nav} flex items-center gap-1`,
        button_previous: `${defaultClassNames.button_previous} p-1 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        button_next: `${defaultClassNames.button_next} p-1 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
        month_grid: `${defaultClassNames.month_grid} w-full border-collapse`,
        weekdays: `${defaultClassNames.weekdays}`,
        weekday: `${defaultClassNames.weekday} h-9 w-9 flex items-center justify-center text-xs text-muted-foreground font-medium`,
        week: `${defaultClassNames.week}`,
        day: `${defaultClassNames.day} h-9 w-9 flex items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none`,
        day_button: `${defaultClassNames.day_button} w-full h-full flex items-center justify-center hover:bg-muted`,
        selected: `${defaultClassNames.selected} bg-primary text-primary-foreground hover:bg-primary/90`,
        today: `${defaultClassNames.today} font-semibold text-primary`,
        outside: `${defaultClassNames.outside} text-muted-foreground/40`,
        disabled: `${defaultClassNames.disabled} opacity-40 cursor-not-allowed`,
        range_start: `${defaultClassNames.range_start} bg-primary text-primary-foreground rounded-r-none`,
        range_end: `${defaultClassNames.range_end} bg-primary text-primary-foreground rounded-l-none`,
        range_middle: `${defaultClassNames.range_middle} bg-primary/10 rounded-none`,
        hidden: `${defaultClassNames.hidden} invisible`,
      }}
      showOutsideDays
    />
  );
}

// ============================================
// MONTH PICKER (Keep existing implementation)
// ============================================

import { cva } from "class-variance-authority";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { isBefore } from "date-fns";

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
}

function MonthPicker({
  mode = "single",
  selected,
  onSelect,
  className,
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = React.useState(
    selected instanceof Date ? selected.getFullYear() : new Date().getFullYear()
  );

  const handleMonthClick = (monthIndex: number) => {
    const date = new Date(currentYear, monthIndex, 1);
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
        selected.getFullYear() === currentYear
      );
    }
    return false;
  };

  return (
    <div
      className={cn(
        "p-3 bg-popover border border-border rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentYear(currentYear - 1)}
          className="p-1 rounded-md hover:bg-muted"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{currentYear}</span>
        <button
          onClick={() => setCurrentYear(currentYear + 1)}
          className="p-1 rounded-md hover:bg-muted"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => handleMonthClick(index)}
            className={cn(
              calendarButtonVariants({
                variant: isMonthSelected(index) ? "selected" : "default",
              }),
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
}

function YearPicker({
  mode = "single",
  selected,
  onSelect,
  className,
}: YearPickerProps) {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = React.useState(
    Math.floor((typeof selected === "number" ? selected : currentYear) / 12) *
      12
  );

  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  const handleYearClick = (year: number) => {
    if (mode === "single") {
      onSelect?.(year);
    } else {
      const range = selected as { from?: number; to?: number } | undefined;
      if (!range?.from || (range.from && range.to)) {
        onSelect?.({ from: year, to: undefined });
      } else {
        if (year < range.from) {
          onSelect?.({ from: year, to: range.from });
        } else {
          onSelect?.({ from: range.from, to: year });
        }
      }
    }
  };

  const isYearSelected = (year: number) => {
    if (typeof selected === "number") return selected === year;
    return false;
  };

  return (
    <div
      className={cn(
        "p-3 bg-popover border border-border rounded-lg",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setStartYear(startYear - 12)}
          className="p-1 rounded-md hover:bg-muted"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {startYear} - {startYear + 11}
        </span>
        <button
          onClick={() => setStartYear(startYear + 12)}
          className="p-1 rounded-md hover:bg-muted"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearClick(year)}
            className={cn(
              calendarButtonVariants({
                variant: isYearSelected(year) ? "selected" : "default",
              }),
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
