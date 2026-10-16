import * as React from "react";
import {
  DayPicker,
  type DateRange,
  type DayPickerProps,
} from "react-day-picker";
import "react-day-picker/style.css";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";
import { setMonth, setYear, format } from "date-fns";

const calendarSizeConfig = {
  sm: {
    day: "h-7 w-7 text-xs",
    dayButton: "h-7 w-7 text-xs",
    weekday: "h-6 text-[10px]",
    nav: "h-6 w-6",
    navIcon: "h-3.5 w-3.5",
    caption: "text-xs",
    root: "p-2",
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
    root: "p-3",
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
    root: "p-4",
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
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const toggleButtonVariants = cva(
  "h-7 w-16 rounded text-xs font-medium transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      active: {
        true: "bg-background text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10 font-bold",
        false:
          "text-muted-foreground hover:text-foreground hover:bg-background/50",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const gridCellVariants = cva(
  "h-10 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      state: {
        default: "text-muted-foreground hover:bg-muted hover:text-foreground",
        selected:
          "bg-primary text-primary-foreground font-bold shadow-sm ring-1 ring-primary",
        today:
          "border border-primary text-primary bg-primary/5 hover:bg-primary/10 font-bold",
        outside: "text-muted-foreground/50 hover:bg-muted font-normal",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

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

interface MonthYearPickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  size?: "sm" | "default" | "lg";
  defaultView?: "month" | "year";
  className?: string;
}

function MonthYearPicker({
  value,
  onChange,
  // size = "default",
  defaultView = "month",
  className,
}: MonthYearPickerProps) {
  const [view, setView] = React.useState<"month" | "year">(defaultView);

  const [displayYear, setDisplayYear] = React.useState(
    value?.getFullYear() ?? new Date().getFullYear()
  );

  React.useEffect(() => {
    if (value) {
      setDisplayYear(value.getFullYear());
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const startDecade = Math.floor(displayYear / 10) * 10;

  const handlePrev = () =>
    setDisplayYear((prev) => prev - (view === "year" ? 10 : 1));

  const handleNext = () =>
    setDisplayYear((prev) => prev + (view === "year" ? 10 : 1));

  const handleMonthClick = (monthIndex: number) => {
    const newDate = setMonth(
      setYear(value ?? new Date(), displayYear),
      monthIndex
    );

    onChange?.(newDate);
  };

  const handleYearClick = (year: number) => {
    const newDate = setYear(value ?? new Date(), year);
    onChange?.(newDate);
    setDisplayYear(year);
    setView("month");
  };

  return (
    <div
      data-slot="month-year-picker"
      className={cn(
        "w-[280px] bg-popover rounded-xl shadow-lg border border-border flex flex-col transition-all duration-300",
        className
      )}
    >
      <div className="h-12 flex items-center justify-between px-2 border-b border-border shrink-0">
        <button
          type="button"
          onClick={handlePrev}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Previous ${view === "year" ? "decade" : "year"}`}
        >
          <IconChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setView("month")}
            className={toggleButtonVariants({ active: view === "month" })}
          >
            Month
          </button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <button
            type="button"
            onClick={() => setView("year")}
            className={toggleButtonVariants({ active: view === "year" })}
          >
            {view === "year" ? `${startDecade}s` : displayYear}
          </button>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Next ${view === "year" ? "decade" : "year"}`}
        >
          <IconChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="h-[220px] p-3 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-2 w-full h-full content-center">
          {view === "month"
            ? MONTHS.map((month, idx) => {
                const isSelected =
                  value?.getMonth() === idx &&
                  value?.getFullYear() === displayYear;

                const isToday =
                  currentMonth === idx && currentYear === displayYear;

                return (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthClick(idx)}
                    className={gridCellVariants({
                      state: isSelected
                        ? "selected"
                        : isToday
                          ? "today"
                          : "default",
                    })}
                  >
                    {month.slice(0, 3)}
                  </button>
                );
              })
            : Array.from({ length: 12 }, (_, i) => startDecade - 1 + i).map(
                (year) => {
                  const isSelected = value?.getFullYear() === year;
                  const isToday = currentYear === year;

                  const isOutside =
                    year < startDecade || year >= startDecade + 10;

                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleYearClick(year)}
                      className={gridCellVariants({
                        state: isSelected
                          ? "selected"
                          : isToday
                            ? "today"
                            : isOutside
                              ? "outside"
                              : "default",
                      })}
                    >
                      {year}
                    </button>
                  );
                }
              )}
        </div>
      </div>
    </div>
  );
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

interface CalendarProps {
  mode?: "single" | "range" | "multiple";
  size?: "sm" | "default" | "lg";
  selected?: Date | Date[] | DateRange;
  onSelect?: (date: Date | Date[] | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  autoFocus?: boolean;
  ariaLabel?: string;
  showTodayButton?: boolean;
  footer?: React.ReactNode;
  animate?: boolean;
  className?: string;
}

function Calendar({
  mode = "single",
  size = "default",
  selected,
  onSelect,
  disabled,
  minDate,
  maxDate,
  autoFocus = false,
  ariaLabel,
  showTodayButton = true,
  footer,
  animate = true,
  className,
}: CalendarProps) {
  const sizeConfig = calendarSizeConfig[size];
  const [month, setMonth] = React.useState<Date>(new Date());

  const handleSelect = React.useCallback(
    (date: Date | Date[] | DateRange | undefined) => {
      onSelect?.(date);
    },
    [onSelect]
  );

  const disabledMatcher = React.useMemo(() => {
    const matchers: Array<
      { before: Date } | { after: Date } | ((date: Date) => boolean)
    > = [];

    if (minDate) matchers.push({ before: minDate });

    if (maxDate) matchers.push({ after: maxDate });

    if (disabled) matchers.push(disabled);

    return matchers.length > 0 ? matchers : undefined;
  }, [minDate, maxDate, disabled]);

  const handleTodayClick = React.useCallback(() => {
    const today = new Date();
    setMonth(today);

    if (mode === "single") {
      onSelect?.(today);
    } else if (mode === "range") {
      onSelect?.({ from: today, to: today });
    } else if (mode === "multiple") {
      onSelect?.([today]);
    }
  }, [mode, onSelect]);

  const ChevronComponent = React.useCallback(
    (props: {
      orientation?: "left" | "right" | "up" | "down";
      className?: string;
      size?: number;
      disabled?: boolean;
    }) => <CustomChevron orientation={props.orientation} size={size} />,
    [size]
  );

  return (
    <div className={cn(sizeConfig.root, className)}>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => {
            const prevMonth = new Date(month);
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            setMonth(prevMonth);
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
          onMonthChange={setMonth}
          size={size}
        />

        <button
          type="button"
          onClick={() => {
            const nextMonth = new Date(month);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            setMonth(nextMonth);
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

      {(() => {
        const dayPickerProps = {
          mode,
          selected,
          onSelect: handleSelect,
          disabled: disabledMatcher,
          autoFocus,
          animate,
          "aria-label": ariaLabel,
          month,
          onMonthChange: setMonth,
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
              "flex items-center justify-center text-muted-foreground font-medium"
            ),
            week: "grid grid-cols-7",
            day: cn(sizeConfig.day, "flex items-center justify-center p-0"),
            day_button: cn(
              sizeConfig.dayButton,
              "w-full h-full flex items-center justify-center rounded-md",
              "hover:bg-muted transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            ),
            selected:
              "!bg-primary !text-primary-foreground font-medium hover:!bg-primary/90",
            today: "font-semibold text-primary",
            outside: "text-muted-foreground/40",
            disabled: "opacity-40 cursor-not-allowed",
            range_start: "rounded-r-none !bg-primary !text-primary-foreground",
            range_end: "rounded-l-none !bg-primary !text-primary-foreground",
            range_middle: "rounded-none !bg-primary/10",
            hidden: "invisible",
          },
          footer:
            footer === undefined ? showTodayButton ? (
              <div className="mt-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleTodayClick}
                  className={cn(
                    "w-full py-1.5 rounded-md transition-colors font-medium",
                    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    sizeConfig.caption
                  )}
                >
                  Today
                </button>
              </div>
            ) : null : (
              footer
            ),
        } as DayPickerProps;

        return <DayPicker {...dayPickerProps} />;
      })()}
    </div>
  );
}

export {
  Calendar,
  MonthYearPicker,
  calendarButtonVariants,
  toggleButtonVariants,
  gridCellVariants,
};

export type { CalendarProps, MonthYearPickerProps };
