"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  setMonth,
  setYear,
} from "date-fns";
import {
  IconCalendar,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ============================================
// TYPES
// ============================================

/** Selection mode for the date picker */
type DatePickerMode = "single" | "range";

/** Apply mode - when the selection is committed */
type ApplyMode = "immediate" | "confirm";

/** Configuration for date presets */
interface DatePreset {
  /** Display label for the preset */
  label: string;
  /** Function that returns the preset value */
  getValue: () => Date | { from: Date; to: Date };
}

// ============================================
// CVA VARIANTS
// ============================================

const datePickerTriggerVariants = cva(
  "flex items-center gap-2 rounded-lg border cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-input bg-background hover:bg-muted/50 aria-expanded:ring-2 aria-expanded:ring-ring",
        outline:
          "border-2 border-input bg-transparent hover:border-primary/50 aria-expanded:border-primary",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/50 aria-expanded:bg-muted/50",
      },
      size: {
        sm: "h-8 px-2.5 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const calendarSizeConfig = {
  sm: {
    day: "h-7 w-7 text-xs",
    dayButton: "h-7 w-7 text-xs",
    weekday: "h-6 text-[10px]",
    nav: "h-6 w-6",
    navIcon: "h-3.5 w-3.5",
    caption: "text-xs",
    root: "p-3",
    icon: "h-3.5 w-3.5",
    clearIcon: "h-3 w-3",
    dropdown: "text-xs h-6 px-1.5",
    dropdownIcon: "h-3 w-3 ml-0.5",
  },
  default: {
    day: "h-9 w-9 text-sm",
    dayButton: "h-9 w-9 text-sm",
    weekday: "h-7 text-xs",
    nav: "h-7 w-7",
    navIcon: "h-4 w-4",
    caption: "text-sm",
    root: "p-4",
    icon: "h-4 w-4",
    clearIcon: "h-3.5 w-3.5",
    dropdown: "text-sm h-7 px-2",
    dropdownIcon: "h-3.5 w-3.5 ml-1",
  },
  lg: {
    day: "h-11 w-11 text-base",
    dayButton: "h-11 w-11 text-base",
    weekday: "h-8 text-sm",
    nav: "h-8 w-8",
    navIcon: "h-5 w-5",
    caption: "text-base",
    root: "p-5",
    icon: "h-5 w-5",
    clearIcon: "h-4 w-4",
    dropdown: "text-base h-8 px-2.5",
    dropdownIcon: "h-4 w-4 ml-1",
  },
};

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

// ============================================
// CUSTOM CHEVRON COMPONENT
// ============================================

function CustomChevron({
  orientation = "down",
  size = "default",
}: {
  orientation?: "left" | "right" | "up" | "down";
  size?: "sm" | "default" | "lg";
}) {
  const sizeConfig = calendarSizeConfig[size];

  switch (orientation) {
    case "left":
      return <IconChevronLeft className={sizeConfig.navIcon} />;
    case "right":
      return <IconChevronRight className={sizeConfig.navIcon} />;
    case "down":
      return <IconChevronDown className={sizeConfig.dropdownIcon} />;
    default:
      return <IconChevronDown className={sizeConfig.dropdownIcon} />;
  }
}

// ============================================
// CUSTOM MONTH CAPTION COMPONENT
// ============================================

interface MonthCaptionProps {
  displayMonth: Date;
  onMonthChange: (month: Date) => void;
  size: "sm" | "default" | "lg";
}

function MonthCaption({
  displayMonth,
  onMonthChange,
  size,
}: MonthCaptionProps) {
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [showYearPicker, setShowYearPicker] = React.useState(false);
  const sizeConfig = calendarSizeConfig[size];

  const currentYear = displayMonth.getFullYear();
  const startYear = Math.floor(currentYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(displayMonth, monthIndex);
    onMonthChange(newDate);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = setYear(displayMonth, year);
    onMonthChange(newDate);
    setShowYearPicker(false);
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Month Button */}
      <button
        type="button"
        onClick={() => {
          setShowMonthPicker(!showMonthPicker);
          setShowYearPicker(false);
        }}
        className={cn(
          sizeConfig.dropdown,
          "flex items-center gap-1 rounded-md border border-border bg-background font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        )}
      >
        {format(displayMonth, "MMMM")}
        <IconChevronDown className={sizeConfig.dropdownIcon} />
      </button>

      {/* Year Button */}
      <button
        type="button"
        onClick={() => {
          setShowYearPicker(!showYearPicker);
          setShowMonthPicker(false);
        }}
        className={cn(
          sizeConfig.dropdown,
          "flex items-center gap-1 rounded-md border border-border bg-background font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        )}
      >
        {format(displayMonth, "yyyy")}
        <IconChevronDown className={sizeConfig.dropdownIcon} />
      </button>

      {/* Month Picker Dropdown */}
      {showMonthPicker && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[180px] animate-in fade-in-0 zoom-in-95">
          <div className="grid grid-cols-3 gap-1">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                type="button"
                onClick={() => handleMonthSelect(index)}
                className={cn(
                  "px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                  displayMonth.getMonth() === index
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year Picker Dropdown */}
      {showYearPicker && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[180px] animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => {
                const newDate = setYear(displayMonth, currentYear - 12);
                onMonthChange(newDate);
              }}
              className="p-1 rounded hover:bg-muted"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-medium">
              {startYear} - {startYear + 11}
            </span>
            <button
              type="button"
              onClick={() => {
                const newDate = setYear(displayMonth, currentYear + 12);
                onMonthChange(newDate);
              }}
              className="p-1 rounded hover:bg-muted"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearSelect(year)}
                className={cn(
                  "px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                  currentYear === year
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// PROPS INTERFACE
// ============================================

interface DatePickerProps
  extends VariantProps<typeof datePickerTriggerVariants> {
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
  /** Apply mode: immediate or confirm */
  applyMode?: ApplyMode;
  /** Custom ARIA label */
  ariaLabel?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================
// DATE PICKER COMPONENT
// ============================================

function DatePicker({
  mode = "single",
  variant = "default",
  size = "default",
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  showPresets = true,
  minDate,
  maxDate,
  applyMode = "immediate",
  ariaLabel,
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState<
    Date | { from?: Date; to?: Date } | undefined
  >(undefined);
  const [month, setMonthState] = React.useState<Date>(new Date());

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const sizeConfig = calendarSizeConfig[size || "default"];

  // Initialize pending value when opening in confirm mode
  React.useEffect(() => {
    if (isOpen && applyMode === "confirm") {
      setPendingValue(value);
    }
  }, [isOpen, applyMode, value]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (applyMode === "confirm") {
          setPendingValue(undefined);
        }
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [applyMode]);

  // Handle keyboard
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        if (applyMode === "confirm") {
          setPendingValue(undefined);
        }
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, applyMode]);

  // ============================================
  // HELPERS
  // ============================================

  const currentValue = applyMode === "confirm" && isOpen ? pendingValue : value;

  const formatValue = () => {
    const displayValue = value;
    if (!displayValue) return placeholder;
    if (displayValue instanceof Date) {
      return format(displayValue, "MMM dd, yyyy");
    }
    if ("from" in displayValue) {
      const { from, to } = displayValue;
      if (!from) return placeholder;
      if (!to) return format(from, "MMM dd, yyyy") + " - ...";
      return `${format(from, "MMM dd")} - ${format(to, "MMM dd, yyyy")}`;
    }
    return placeholder;
  };

  const disabledMatcher = React.useMemo(() => {
    const matchers: Array<{ before: Date } | { after: Date }> = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleCalendarSelect = (
    date: Date | Date[] | { from?: Date; to?: Date } | undefined
  ) => {
    if (applyMode === "confirm") {
      setPendingValue(date as Date | { from?: Date; to?: Date });
    } else {
      onChange?.(date as Date | { from?: Date; to?: Date });
    }
  };

  const handlePresetClick = (preset: DatePreset) => {
    const presetValue = preset.getValue() as Date | { from?: Date; to?: Date };
    if (applyMode === "confirm") {
      setPendingValue(presetValue);
    } else {
      onChange?.(presetValue);
    }
  };

  const handleApply = () => {
    onChange?.(pendingValue);
    setPendingValue(undefined);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingValue(undefined);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setMonthState(today);
    handleCalendarSelect(
      mode === "single" ? today : { from: today, to: today }
    );
  };

  const presets = mode === "single" ? singlePresets : rangePresets;

  const ChevronComponent = React.useCallback(
    (props: {
      orientation?: "left" | "right" | "up" | "down";
      className?: string;
      size?: number;
      disabled?: boolean;
    }) => (
      <CustomChevron orientation={props.orientation} size={size || "default"} />
    ),
    [size]
  );

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
        aria-label={ariaLabel || `Date picker, ${formatValue()}`}
        className={cn(
          datePickerTriggerVariants({ variant, size }),
          disabled && "opacity-50 pointer-events-none"
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <IconCalendar
          className={cn(sizeConfig.icon, "text-muted-foreground shrink-0")}
          aria-hidden="true"
        />
        <span className={cn("flex-1", !value && "text-muted-foreground")}>
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
              className={cn(sizeConfig.clearIcon, "text-muted-foreground")}
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
            "absolute z-50 mt-2 flex flex-col rounded-xl border border-border bg-popover shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          <div className="flex">
            {/* Presets Sidebar */}
            {showPresets && (
              <div className="border-r border-border p-4 min-w-[140px] flex flex-col">
                <div className="text-xs font-semibold text-muted-foreground mb-3">
                  Quick Select
                </div>
                <div className="flex flex-col gap-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg",
                        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "transition-colors font-medium",
                        sizeConfig.caption
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar */}
            <div className={sizeConfig.root}>
              {/* Custom Header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => {
                    const prevMonth = new Date(month);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setMonthState(prevMonth);
                  }}
                  className={cn(
                    sizeConfig.nav,
                    "inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  aria-label="Previous month"
                >
                  <IconChevronLeft className={sizeConfig.navIcon} />
                </button>

                <MonthCaption
                  displayMonth={month}
                  onMonthChange={setMonthState}
                  size={size || "default"}
                />

                <button
                  type="button"
                  onClick={() => {
                    const nextMonth = new Date(month);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setMonthState(nextMonth);
                  }}
                  className={cn(
                    sizeConfig.nav,
                    "inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                  aria-label="Next month"
                >
                  <IconChevronRight className={sizeConfig.navIcon} />
                </button>
              </div>

              {/* @ts-expect-error - DayPicker has discriminated union types based on mode that can't be satisfied with dynamic mode prop */}
              <DayPicker
                mode={mode}
                selected={currentValue as unknown as Date | undefined}
                onSelect={
                  handleCalendarSelect as (
                    date: Date | { from?: Date; to?: Date } | undefined
                  ) => void
                }
                disabled={disabledMatcher}
                autoFocus
                month={month}
                onMonthChange={setMonthState}
                hideNavigation
                showOutsideDays
                components={{
                  Chevron: ChevronComponent,
                }}
                classNames={{
                  months: "flex flex-col",
                  month: "",
                  month_caption: "hidden",
                  month_grid: "w-full border-collapse",
                  weekdays: "grid grid-cols-7",
                  weekday: cn(
                    sizeConfig.weekday,
                    "flex items-center justify-center text-muted-foreground font-medium"
                  ),
                  week: "grid grid-cols-7",
                  day: cn(
                    sizeConfig.day,
                    "flex items-center justify-center p-0"
                  ),
                  day_button: cn(
                    sizeConfig.dayButton,
                    "w-full h-full flex items-center justify-center rounded-md",
                    "hover:bg-muted transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  ),
                  selected:
                    "!bg-primary !text-primary-foreground font-medium hover:!bg-primary/90 !rounded-lg",
                  today: "font-semibold text-primary",
                  outside: "text-muted-foreground/40",
                  disabled: "opacity-40 cursor-not-allowed",
                  range_start:
                    "rounded-r-none !bg-primary !text-primary-foreground",
                  range_end:
                    "rounded-l-none !bg-primary !text-primary-foreground",
                  range_middle: "rounded-none !bg-primary/10",
                  hidden: "invisible",
                }}
                footer={
                  applyMode === "immediate" ? (
                    <div className="mt-3 pt-3 border-t border-border">
                      <button
                        type="button"
                        onClick={handleTodayClick}
                        className={cn(
                          "w-full py-1.5 rounded-lg transition-colors font-medium",
                          "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          sizeConfig.caption
                        )}
                      >
                        Today
                      </button>
                    </div>
                  ) : null
                }
              />
            </div>
          </div>

          {/* Confirm Mode Footer */}
          {applyMode === "confirm" && (
            <div className="flex items-center justify-between gap-2 p-3 border-t border-border">
              <div className={cn("text-muted-foreground", sizeConfig.caption)}>
                {pendingValue
                  ? pendingValue instanceof Date
                    ? format(pendingValue, "PPP")
                    : "from" in pendingValue && pendingValue.from
                    ? `${format(pendingValue.from, "MMM dd")}${
                        pendingValue.to
                          ? ` - ${format(pendingValue.to, "MMM dd, yyyy")}`
                          : " - ..."
                      }`
                    : "Select a date"
                  : "Select a date"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size={size === "lg" ? "default" : "sm"}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  size={size === "lg" ? "default" : "sm"}
                  onClick={handleApply}
                  disabled={!pendingValue}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { DatePicker, datePickerTriggerVariants };
export type { DatePickerProps, DatePreset, ApplyMode };
