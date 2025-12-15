import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from "date-fns";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Calendar button styles
const calendarButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-muted",
        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
        today: "bg-muted text-foreground",
        range: "bg-primary/10 text-primary",
        rangeStart: "bg-primary text-primary-foreground rounded-r-none",
        rangeEnd: "bg-primary text-primary-foreground rounded-l-none",
        outside: "text-muted-foreground opacity-50",
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

// Day of week headers
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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
  const [currentMonth, setCurrentMonth] = React.useState(
    selected instanceof Date ? selected : new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const isDateDisabled = (date: Date) => {
    if (disabled?.(date)) return true;
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    if (selected instanceof Date) return isSameDay(date, selected);
    if (Array.isArray(selected))
      return selected.some((d) => isSameDay(date, d));
    return false;
  };

  const isInRange = (date: Date) => {
    if (!selected || typeof selected !== "object" || !("from" in selected))
      return false;
    const { from, to } = selected;
    if (!from || !to) return false;
    return isWithinInterval(date, { start: from, end: to });
  };

  const isRangeStart = (date: Date) => {
    if (!selected || typeof selected !== "object" || !("from" in selected))
      return false;
    return selected.from ? isSameDay(date, selected.from) : false;
  };

  const isRangeEnd = (date: Date) => {
    if (!selected || typeof selected !== "object" || !("from" in selected))
      return false;
    return selected.to ? isSameDay(date, selected.to) : false;
  };

  const handleDayClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === "single") {
      onSelect?.(date);
    } else if (mode === "multiple") {
      const currentSelected = Array.isArray(selected) ? selected : [];
      const exists = currentSelected.some((d) => isSameDay(date, d));
      if (exists) {
        onSelect?.(currentSelected.filter((d) => !isSameDay(date, d)));
      } else {
        onSelect?.([...currentSelected, date]);
      }
    } else if (mode === "range") {
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

  const getDayVariant = (date: Date): any => {
    if (!isSameMonth(date, currentMonth)) return "outside";
    if (isRangeStart(date)) return "rangeStart";
    if (isRangeEnd(date)) return "rangeEnd";
    if (isSelected(date)) return "selected";
    if (isInRange(date)) return "range";
    if (isSameDay(date, new Date())) return "today";
    return "default";
  };

  return (
    <div
      className={cn(
        "p-3 bg-popover border border-border rounded-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 rounded-md hover:bg-muted"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 rounded-md hover:bg-muted"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="h-9 flex items-center justify-center text-xs text-muted-foreground font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => handleDayClick(day)}
            disabled={isDateDisabled(day)}
            className={cn(
              calendarButtonVariants({ variant: getDayVariant(day) }),
              !isSameMonth(day, currentMonth) && "opacity-30"
            )}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  );
}

// Month Picker
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

// Year Picker
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
