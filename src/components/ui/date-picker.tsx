"use client";

import * as React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPES
// ============================================

/** Selection mode for the date picker */
type DatePickerMode = "single" | "range";

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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const defaultClassNames = getDefaultClassNames();

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

  // Build disabled matcher
  const disabledMatcher = React.useMemo(() => {
    const matchers: any[] = [];
    if (minDate) matchers.push({ before: minDate });
    if (maxDate) matchers.push({ after: maxDate });
    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate]);

  // ============================================
  // HANDLERS
  // ============================================

  // Handle preset click
  const handlePresetClick = (preset: DatePreset) => {
    onChange?.(preset.getValue() as Date | { from?: Date; to?: Date });
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

          {/* Calendar using react-day-picker */}
          <div className="p-5">
            <DayPicker
              mode={mode}
              selected={value as any}
              onSelect={onChange as any}
              disabled={disabledMatcher}
              showOutsideDays
              classNames={{
                root: `${defaultClassNames.root}`,
                months: `${defaultClassNames.months}`,
                month: `${defaultClassNames.month}`,
                month_caption: `${defaultClassNames.month_caption} flex items-center justify-between mb-4`,
                caption_label: `${defaultClassNames.caption_label} text-sm font-medium`,
                nav: `${defaultClassNames.nav} flex items-center gap-1`,
                button_previous: `${defaultClassNames.button_previous} p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                button_next: `${defaultClassNames.button_next} p-2 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`,
                month_grid: `${defaultClassNames.month_grid} w-full border-collapse`,
                weekdays: `${defaultClassNames.weekdays}`,
                weekday: `${defaultClassNames.weekday} h-11 w-11 flex items-center justify-center text-xs text-muted-foreground font-semibold`,
                week: `${defaultClassNames.week}`,
                day: `${defaultClassNames.day} h-11 w-11`,
                day_button: `${defaultClassNames.day_button} h-11 w-11 flex items-center justify-center text-sm rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`,
                selected: `${defaultClassNames.selected} bg-primary text-primary-foreground font-medium hover:bg-primary/90`,
                today: `${defaultClassNames.today} font-semibold text-primary`,
                outside: `${defaultClassNames.outside} text-muted-foreground/40`,
                disabled: `${defaultClassNames.disabled} opacity-40 cursor-not-allowed`,
                range_start: `${defaultClassNames.range_start} bg-primary text-primary-foreground rounded-r-none`,
                range_end: `${defaultClassNames.range_end} bg-primary text-primary-foreground rounded-l-none`,
                range_middle: `${defaultClassNames.range_middle} bg-primary/10 rounded-none`,
                hidden: `${defaultClassNames.hidden} invisible`,
              }}
              footer={
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      if (mode === "single") {
                        onChange?.(today);
                      } else {
                        onChange?.({ from: today, to: today });
                      }
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
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { DatePicker };
export type { DatePickerProps, DatePreset };
