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

// Day of week headers
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
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

type DatePickerMode = "single" | "range";
type ViewMode = "days" | "months" | "years";

// Presets for quick selection
interface DatePreset {
  label: string;
  getValue: () => Date | { from: Date; to: Date };
}

const singlePresets: DatePreset[] = [
  { label: "Today", getValue: () => new Date() },
  { label: "Yesterday", getValue: () => subDays(new Date(), 1) },
  { label: "A week ago", getValue: () => subDays(new Date(), 7) },
];

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

interface DatePickerProps {
  mode?: DatePickerMode;
  value?: Date | { from?: Date; to?: Date };
  onChange?: (value: Date | { from?: Date; to?: Date } | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  showPresets?: boolean;
  className?: string;
}

function DatePicker({
  mode = "single",
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  showPresets = true,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<ViewMode>("days");
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (value instanceof Date) return value;
    if (value && "from" in value && value.from) return value.from;
    return new Date();
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

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

  // Handle day click
  const handleDayClick = (date: Date) => {
    if (mode === "single") {
      onChange?.(date);
      setIsOpen(false);
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
        setIsOpen(false);
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
    onChange?.(preset.getValue() as any);
    setIsOpen(false);
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  // Years for year picker
  const currentYear = currentMonth.getFullYear();
  const startYear = Math.floor(currentYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  const presets = mode === "single" ? singlePresets : rangePresets;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border border-input bg-background cursor-pointer",
          "hover:bg-muted/50 transition-colors",
          isOpen && "ring-2 ring-ring",
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconCalendar className="h-4 w-4 text-muted-foreground shrink-0" />
        <span
          className={cn("flex-1 text-sm", !value && "text-muted-foreground")}
        >
          {formatValue()}
        </span>
        {value && (
          <button
            onClick={handleClear}
            className="p-0.5 hover:bg-muted rounded"
          >
            <IconX className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 flex rounded-lg border border-border bg-popover shadow-lg">
          {/* Presets sidebar */}
          {showPresets && (
            <div className="border-r border-border p-2 min-w-[120px]">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Presets
              </div>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full text-left text-sm px-2 py-1.5 rounded-md hover:bg-muted"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Calendar */}
          <div className="p-3">
            {/* Header with month/year buttons */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => {
                  if (viewMode === "days")
                    setCurrentMonth(subMonths(currentMonth, 1));
                  else if (viewMode === "years")
                    setCurrentMonth(subYears(currentMonth, 12));
                }}
                className="p-1 rounded-md hover:bg-muted"
              >
                <IconChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setViewMode(viewMode === "months" ? "days" : "months")
                  }
                  className="px-2 py-1 text-sm font-medium rounded-md hover:bg-muted"
                >
                  {format(currentMonth, "MMMM")}
                </button>
                <button
                  onClick={() =>
                    setViewMode(viewMode === "years" ? "days" : "years")
                  }
                  className="px-2 py-1 text-sm font-medium rounded-md hover:bg-muted"
                >
                  {format(currentMonth, "yyyy")}
                </button>
              </div>

              <button
                onClick={() => {
                  if (viewMode === "days")
                    setCurrentMonth(addMonths(currentMonth, 1));
                  else if (viewMode === "years")
                    setCurrentMonth(addYears(currentMonth, 12));
                }}
                className="p-1 rounded-md hover:bg-muted"
              >
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days view */}
            {viewMode === "days" && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WEEK_DAYS.map((day) => (
                    <div
                      key={day}
                      className="h-8 w-8 flex items-center justify-center text-xs text-muted-foreground font-medium"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());
                    const selected = isSelected(day);
                    const rangeStart = isRangeStart(day);
                    const rangeEnd = isRangeEnd(day);
                    const inRange = isInRange(day);

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleDayClick(day)}
                        className={cn(
                          "h-8 w-8 flex items-center justify-center text-sm rounded-md transition-colors",
                          !isCurrentMonth && "text-muted-foreground/50",
                          isToday &&
                            !selected &&
                            !rangeStart &&
                            !rangeEnd &&
                            "bg-muted",
                          (selected || rangeStart || rangeEnd) &&
                            "bg-primary text-primary-foreground",
                          inRange &&
                            !rangeStart &&
                            !rangeEnd &&
                            "bg-primary/10",
                          rangeStart && "rounded-r-none",
                          rangeEnd && "rounded-l-none",
                          "hover:bg-primary/20"
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Months view */}
            {viewMode === "months" && (
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => {
                  const isCurrentM = index === currentMonth.getMonth();
                  return (
                    <button
                      key={month}
                      onClick={() => handleMonthClick(index)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-md hover:bg-muted",
                        isCurrentM && "bg-primary text-primary-foreground"
                      )}
                    >
                      {month.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Years view */}
            {viewMode === "years" && (
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => {
                  const isCurrentY = year === currentMonth.getFullYear();
                  return (
                    <button
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className={cn(
                        "px-3 py-2 text-sm rounded-md hover:bg-muted",
                        isCurrentY && "bg-primary text-primary-foreground"
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
