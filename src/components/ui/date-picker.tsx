"use client";

import * as React from "react";
import { DayPicker, type DayPickerProps } from "react-day-picker";
import "react-day-picker/style.css";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
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
import {
  MonthYearPicker,
  toggleButtonVariants,
} from "@/components/ui/calendar";

type DatePickerMode = "single" | "range";

type ApplyMode = "immediate" | "confirm";

interface DatePreset {
  label: string;

  getValue: () => Date | { from: Date; to: Date };
}

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
  },
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
  const [pickerView, setPickerView] = React.useState<"month" | "year" | null>(
    null,
  );

  return (
    <div className="relative">
      {}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setPickerView(pickerView === "month" ? null : "month")}
          className={toggleButtonVariants({ active: pickerView === "month" })}
        >
          {format(displayMonth, "MMM")}
        </button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <button
          type="button"
          onClick={() => setPickerView(pickerView === "year" ? null : "year")}
          className={toggleButtonVariants({ active: pickerView === "year" })}
        >
          {format(displayMonth, "yyyy")}
        </button>
      </div>

      {}
      {pickerView && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
          <MonthYearPicker
            key={pickerView}
            value={displayMonth}
            onChange={(date) => {
              onMonthChange(date);
              setPickerView(null);
            }}
            size={size}
            defaultView={pickerView}
          />
        </div>
      )}
    </div>
  );
}

interface DatePickerProps extends VariantProps<
  typeof datePickerTriggerVariants
> {
  mode?: DatePickerMode;

  value?: Date | { from?: Date; to?: Date };

  onChange?: (value: Date | { from?: Date; to?: Date } | undefined) => void;

  placeholder?: string;

  disabled?: boolean;

  showPresets?: boolean;

  minDate?: Date;

  maxDate?: Date;

  applyMode?: ApplyMode;

  ariaLabel?: string;

  className?: string;
}

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

  React.useEffect(() => {
    if (isOpen && applyMode === "confirm") {
      setPendingValue(value);
    }
  }, [isOpen, applyMode, value]);

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

  const handleCalendarSelect = (
    date: Date | Date[] | { from?: Date; to?: Date } | undefined,
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
      mode === "single" ? today : { from: today, to: today },
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
    [size],
  );

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {}
      <div
        ref={triggerRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={ariaLabel || `Date picker, ${formatValue()}`}
        className={cn(
          datePickerTriggerVariants({ variant, size }),
          disabled && "opacity-50 pointer-events-none",
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

      {}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Choose ${mode === "range" ? "date range" : "date"}`}
          className={cn(
            "absolute z-50 mt-2 flex flex-col rounded-xl border border-border bg-popover shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-200",
          )}
        >
          <div className="flex">
            {}
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
                        sizeConfig.caption,
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {}
            <div className={sizeConfig.root}>
              {}
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
                    "inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
                    "inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                  aria-label="Next month"
                >
                  <IconChevronRight className={sizeConfig.navIcon} />
                </button>
              </div>

              {}
              {(() => {
                const dayPickerProps = {
                  mode,
                  selected: currentValue as unknown as Date | undefined,
                  onSelect: handleCalendarSelect as (
                    date: Date | { from?: Date; to?: Date } | undefined,
                  ) => void,
                  disabled: disabledMatcher,
                  autoFocus: true,
                  month,
                  onMonthChange: setMonthState,
                  hideNavigation: true,
                  showOutsideDays: true,
                  components: {
                    Chevron: ChevronComponent,
                  },
                  classNames: {
                    months: "flex flex-col",
                    month: "",
                    month_caption: "hidden",
                    month_grid: "w-full border-collapse",
                    weekdays: "grid grid-cols-7",
                    weekday: cn(
                      sizeConfig.weekday,
                      "flex items-center justify-center text-muted-foreground font-medium",
                    ),
                    week: "grid grid-cols-7",
                    day: cn(
                      sizeConfig.day,
                      "flex items-center justify-center p-0",
                    ),
                    day_button: cn(
                      sizeConfig.dayButton,
                      "w-full h-full flex items-center justify-center rounded-md",
                      "hover:bg-muted transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
                  },
                  footer:
                    applyMode === "immediate" ? (
                      <div className="mt-3 pt-3 border-t border-border">
                        <button
                          type="button"
                          onClick={handleTodayClick}
                          className={cn(
                            "w-full py-1.5 rounded-lg transition-colors font-medium",
                            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            sizeConfig.caption,
                          )}
                        >
                          Today
                        </button>
                      </div>
                    ) : null,
                } as unknown as DayPickerProps;

                return <DayPicker {...dayPickerProps} />;
              })()}
            </div>
          </div>

          {}
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
