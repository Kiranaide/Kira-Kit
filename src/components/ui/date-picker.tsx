"use client";

import * as React from "react";
import {
  format,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addDays,
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
  subDays,
  startOfYear,
  endOfYear,
} from "date-fns";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ============================================
// CONSTANTS
// ============================================

/** Short day names for calendar header */
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Full day names for accessibility */
const WEEK_DAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Month names */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ============================================
// TYPES
// ============================================

/** Selection mode for the date picker */
type DatePickerMode = "single" | "range";

/** View mode for different calendar views */
type ViewMode = "days" | "months" | "years";

/** Configuration for date presets */
interface DatePreset {
  /** Display label for the preset */
  label: string;
  /** Function that returns the preset value */
  getValue: () => Date | { from: Date; to: Date };
}

// Default presets for single date selection
const singlePresets: DatePreset[] = [
  { label: "Today", getValue: () => new Date() },
  { label: "Yesterday", getValue: () => subDays(new Date(), 1) },
  { label: "A week ago", getValue: () => subDays(new Date(), 7) },
];

// Default presets for range selection
const rangePresets: DatePreset[] = [
  {
    label: "Last 7 days",
    getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    label: "This month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "This year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
];

/** Props for the DatePicker component */
interface DatePickerProps {
  /** Selection mode: 'single' for single date, 'range' for date range */
  mode?: DatePickerMode;
  /** Current selected value */
  value?: Date | { from?: Date; to?: Date };
  /** Callback when value changes */
  onChange?: (value: Date | { from?: Date; to?: Date } | undefined) => void;
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Whether to show preset options */
  showPresets?: boolean;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// DATE PICKER COMPONENT
// ============================================

/**
 * DatePicker component with full accessibility support.
 *
 * @example
 * ```tsx
 * // Single date selection
 * <DatePicker
 *   mode="single"
 *   value={date}
 *   onChange={setDate}
 * />
 *
 * // Date range selection
 * <DatePicker
 *   mode="range"
 *   value={{ from: startDate, to: endDate }}
 *   onChange={setDateRange}
 * />
 * ```
 */
function DatePicker({
  mode = "single",
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  showPresets = true,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("days");
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (value instanceof Date) return value;
    if (value && "from" in value && value.from) return value.from;
    return new Date();
  });
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  // ============================================
  // EFFECTS
  // ============================================

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus first selectable date when opening
  React.useEffect(() => {
    if (isOpen && viewMode === "days") {
      const dateToFocus =
        value instanceof Date
          ? value
          : value && "from" in value && value.from
          ? value.from
          : new Date();
      setFocusedDate(dateToFocus);
      setCurrentMonth(dateToFocus);
    }
  }, [isOpen]);

  // Focus the focused date button when it changes
  React.useEffect(() => {
    if (focusedDate && gridRef.current) {
      const button = gridRef.current.querySelector(
        `button[data-date="${focusedDate.toISOString()}"]`
      ) as HTMLButtonElement;
      button?.focus();
    }
  }, [focusedDate]);

  // ============================================
  // HELPERS
  // ============================================

  // Format display value
  const formatValue = () => {
    if (!value) return placeholder;
    if (value instanceof Date) {
      return format(value, "MMM dd, yyyy");
    }
    if ("from" in value) {
      const { from, to } = value;
      if (!from) return placeholder;
      if (!to) return format(from, "MMM dd, yyyy") + " - ...";
      return `${format(from, "MMM dd")} - ${format(to, "MMM dd, yyyy")}`;
    }
    return placeholder;
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return false;
  };

  // Calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Selection helpers
  const isSelected = (date: Date) => {
    if (!value) return false;
    if (value instanceof Date) return isSameDay(date, value);
    return false;
  };

  const isInRange = (date: Date) => {
    if (!value || !("from" in value)) return false;
    const { from, to } = value;
    if (!from || !to) return false;
    return isWithinInterval(date, { start: from, end: to });
  };

  const isRangeStart = (date: Date) => {
    if (!value || !("from" in value)) return false;
    return value.from ? isSameDay(date, value.from) : false;
  };

  const isRangeEnd = (date: Date) => {
    if (!value || !("from" in value)) return false;
    return value.to ? isSameDay(date, value.to) : false;
  };

  // ============================================
  // HANDLERS
  // ============================================

  // Handle day click
  const handleDayClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === "single") {
      onChange?.(date);
      // Don't auto-close - let user close manually
      // setIsOpen(false);
      // triggerRef.current?.focus();
    } else {
      const range = value as { from?: Date; to?: Date } | undefined;
      if (!range?.from || (range.from && range.to)) {
        onChange?.({ from: date, to: undefined });
      } else {
        if (isBefore(date, range.from)) {
          onChange?.({ from: date, to: range.from });
        } else {
          onChange?.({ from: range.from, to: date });
        }
        // Don't auto-close - let user close manually
      }
    }
  };

  // Handle month click
  const handleMonthClick = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode("days");
  };

  // Handle year click
  const handleYearClick = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode("months");
  };

  // Handle preset click
  const handlePresetClick = (preset: DatePreset) => {
    onChange?.(preset.getValue() as Date | { from?: Date; to?: Date });
    // Don't auto-close - let user close manually
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  // Handle trigger keyboard events
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // Handle calendar keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
    let newDate: Date | null = null;

    switch (e.key) {
      case "ArrowLeft":
        newDate = addDays(date, -1);
        break;
      case "ArrowRight":
        newDate = addDays(date, 1);
        break;
      case "ArrowUp":
        newDate = addDays(date, -7);
        break;
      case "ArrowDown":
        newDate = addDays(date, 7);
        break;
      case "Home":
        newDate = startOfWeek(date);
        break;
      case "End":
        newDate = endOfWeek(date);
        break;
      case "PageUp":
        newDate = e.shiftKey ? subYears(date, 1) : subMonths(date, 1);
        break;
      case "PageDown":
        newDate = e.shiftKey ? addYears(date, 1) : addMonths(date, 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        handleDayClick(date);
        return;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      default:
        return;
    }

    if (newDate) {
      e.preventDefault();
      setFocusedDate(newDate);
      // Update month if needed
      if (!isSameMonth(newDate, currentMonth)) {
        setCurrentMonth(newDate);
      }
    }
  };

  // Years for year picker
  const currentYear = currentMonth.getFullYear();
  const startYear = Math.floor(currentYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  const presets = mode === "single" ? singlePresets : rangePresets;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <div
        ref={triggerRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Date picker, ${formatValue()}`}
        className={cn(
          "flex items-center gap-2 h-10 px-3 rounded-lg border border-input bg-background cursor-pointer",
          "hover:bg-muted/50 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isOpen && "ring-2 ring-ring",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <IconCalendar
          className="h-4 w-4 text-muted-foreground shrink-0"
          aria-hidden="true"
        />
        <span
          className={cn("flex-1 text-sm", !value && "text-muted-foreground")}
        >
          {formatValue()}
        </span>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 hover:bg-muted rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear date"
          >
            <IconX
              className="h-3.5 w-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Dropdown Popup */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Choose ${mode === "range" ? "date range" : "date"}`}
          className={cn(
            "absolute z-50 mt-2 flex rounded-xl border border-border bg-popover shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          {/* Presets Sidebar */}
          {showPresets && (
            <div className="border-r border-border p-4 min-w-[160px] flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground mb-3">
                Quick Select
              </div>
              <div className="flex flex-col gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "w-full text-left text-sm px-3 py-2.5 rounded-lg",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "transition-colors font-medium"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="p-5">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => {
                  if (viewMode === "days")
                    setCurrentMonth(subMonths(currentMonth, 1));
                  else if (viewMode === "years")
                    setCurrentMonth(subYears(currentMonth, 12));
                }}
                className={cn(
                  "p-2 rounded-lg hover:bg-muted transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label={
                  viewMode === "days" ? "Previous month" : "Previous years"
                }
              >
                <IconChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="flex gap-1" aria-live="polite" aria-atomic="true">
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(viewMode === "months" ? "days" : "months")
                  }
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {format(currentMonth, "MMMM")}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewMode(viewMode === "years" ? "days" : "years")
                  }
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {format(currentMonth, "yyyy")}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (viewMode === "days")
                    setCurrentMonth(addMonths(currentMonth, 1));
                  else if (viewMode === "years")
                    setCurrentMonth(addYears(currentMonth, 12));
                }}
                className={cn(
                  "p-2 rounded-lg hover:bg-muted transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
                aria-label={viewMode === "days" ? "Next month" : "Next years"}
              >
                <IconChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Days View */}
            {viewMode === "days" && (
              <>
                {/* Week Day Headers */}
                <div className="grid grid-cols-7 mb-2" role="row">
                  {WEEK_DAYS.map((day, index) => (
                    <div
                      key={day}
                      role="columnheader"
                      aria-label={WEEK_DAYS_FULL[index]}
                      className="h-11 w-11 flex items-center justify-center text-xs text-muted-foreground font-semibold"
                    >
                      <abbr
                        title={WEEK_DAYS_FULL[index]}
                        className="no-underline"
                      >
                        {day}
                      </abbr>
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div
                  ref={gridRef}
                  role="grid"
                  aria-label="Calendar"
                  className="grid grid-cols-7"
                >
                  {days.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());
                    const selected = isSelected(day);
                    const rangeStart = isRangeStart(day);
                    const rangeEnd = isRangeEnd(day);
                    const inRange = isInRange(day);
                    const dateDisabled = isDateDisabled(day);
                    const isFocused =
                      focusedDate && isSameDay(day, focusedDate);

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        role="gridcell"
                        data-date={day.toISOString()}
                        tabIndex={isFocused ? 0 : -1}
                        aria-label={format(day, "EEEE, MMMM d, yyyy")}
                        aria-selected={selected || rangeStart || rangeEnd}
                        aria-current={isToday ? "date" : undefined}
                        aria-disabled={dateDisabled}
                        disabled={dateDisabled}
                        onClick={() => handleDayClick(day)}
                        onKeyDown={(e) => handleKeyDown(e, day)}
                        className={cn(
                          "h-11 w-11 flex items-center justify-center text-sm rounded-full transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                          !isCurrentMonth && "text-muted-foreground/40",
                          isToday &&
                            !selected &&
                            !rangeStart &&
                            !rangeEnd &&
                            "font-semibold text-primary",
                          (selected || rangeStart || rangeEnd) &&
                            "bg-primary text-primary-foreground font-medium",
                          inRange &&
                            !rangeStart &&
                            !rangeEnd &&
                            "bg-primary/10",
                          rangeStart && "rounded-r-none",
                          rangeEnd && "rounded-l-none",
                          inRange && !rangeStart && !rangeEnd && "rounded-none",
                          !dateDisabled &&
                            !selected &&
                            !rangeStart &&
                            !rangeEnd &&
                            "hover:bg-muted",
                          dateDisabled && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>

                {/* Today Button */}
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      setCurrentMonth(today);
                      setFocusedDate(today);
                    }}
                    className={cn(
                      "w-full text-sm py-2 rounded-lg",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "transition-colors"
                    )}
                  >
                    Today
                  </button>
                </div>
              </>
            )}

            {/* Months View */}
            {viewMode === "months" && (
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => {
                  const isCurrentM = index === currentMonth.getMonth();
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleMonthClick(index)}
                      className={cn(
                        "px-4 py-3 text-sm rounded-lg transition-colors",
                        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isCurrentM &&
                          "bg-primary text-primary-foreground font-medium"
                      )}
                    >
                      {month.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years View */}
            {viewMode === "years" && (
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => {
                  const isCurrentY = year === currentMonth.getFullYear();
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearClick(year)}
                      className={cn(
                        "px-4 py-3 text-sm rounded-lg transition-colors",
                        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isCurrentY &&
                          "bg-primary text-primary-foreground font-medium"
                      )}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { DatePicker };
export type { DatePickerProps, DatePreset };
