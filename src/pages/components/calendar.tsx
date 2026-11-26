import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconCalendar,
  IconCalendarEvent,
  IconClock,
} from "@tabler/icons-react";
import type { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import {
  Calendar,
  MonthYearPicker,
  formatDateValue,
  getToday,
  type CalendarMarker,
} from "@/components/ui/calendar";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";
import { Label } from "@/components/ui/label";

function BasicCalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="space-y-4">
      <div className="inline-block rounded-lg border border-border">
        <Calendar mode="single" selected={date} onSelect={(d) => setDate(d)} />
      </div>
      {date && (
        <output className="block text-sm text-muted-foreground">
          Selected: {format(date, "PPP")}
        </output>
      )}
    </div>
  );
}

const basicCalendarCode = `import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function BasicCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
    />
  )
}`;

function MultipleCalendarDemo() {
  const [today] = React.useState(() => new Date());
  const [dates, setDates] = React.useState<Date[] | undefined>([today]);

  return (
    <div className="space-y-3">
      <div className="inline-block rounded-lg border border-border">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          min={1}
          max={3}
        />
      </div>
      {dates && dates.length > 0 && (
        <output className="block text-sm text-muted-foreground">
          Selected ({dates.length}/3):{" "}
          {dates.map((d) => format(d, "MMM d")).join(", ")}
        </output>
      )}
    </div>
  );
}

const multipleCalendarCode = `import { Calendar } from "@/components/ui/calendar"

// Multiple mode with min/max selected dates. DayPicker's own
// nav buttons enforce minDate/maxDate, including for keyboard paging.
<Calendar
  mode="multiple"
  selected={dates}
  onSelect={setDates}
  min={1}
  max={3}
/>`;

function RangeCalendarDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const today = getToday();

  return (
    <div className="space-y-3">
      <div className="inline-block rounded-lg border border-border">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={range}
          onSelect={setRange}
          minDate={today}
          maxDate={addDays(today, 90)}
          minNights={1}
          excludeDisabled
          markers={[
            {
              match: addDays(today, 10),
              label: "Public holiday",
              tone: "destructive",
            },
            {
              match: { dayOfWeek: [5, 6] },
              label: "Weekend rate",
              tone: "warning",
            },
          ]}
        />
      </div>
      {range?.from && (
        <output className="block text-sm text-muted-foreground">
          {formatDateValue(range, { pattern: "PPP" })}
        </output>
      )}
    </div>
  );
}

const rangeCalendarCode = `import { addDays } from "date-fns"
import { Calendar, getToday } from "@/components/ui/calendar"

const today = getToday()

<Calendar
  mode="range"
  numberOfMonths={2}
  selected={range}
  onSelect={setRange}
  minDate={today}
  maxDate={addDays(today, 90)}
  minNights={1}
  excludeDisabled
  markers={[
    { match: addDays(today, 10), label: "Public holiday", tone: "destructive" },
    { match: { dayOfWeek: [5, 6] }, label: "Weekend rate", tone: "warning" },
  ]}
/>`;

function MonthYearPickerDemo() {
  const [today] = React.useState(() => new Date());
  const [period, setPeriod] = React.useState<Date | undefined>();

  return (
    <div className="space-y-3">
      <MonthYearPicker
        value={period}
        onChange={(d) => setPeriod(d)}
        minDate={new Date(2024, 0, 1)}
        maxDate={today}
      />
      {period && (
        <output className="block text-sm text-muted-foreground">
          Selected: {format(period, "MMMM yyyy")}
        </output>
      )}
    </div>
  );
}

const monthYearPickerCode = `import { MonthYearPicker } from "@/components/ui/calendar"

// Standalone month/year grid. Escape closes, Tab is trapped, arrows /
// Home / End / PageUp / PageDown move focus. onChange reports which
// part was picked.
<MonthYearPicker
  value={period}
  onChange={(d, part) => console.log(part)}
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date()}
/>`;

function CalendarSizesDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Small
        </Label>
        <div className="inline-block rounded-lg border border-border">
          <Calendar mode="single" size="sm" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Default
        </Label>
        <div className="inline-block rounded-lg border border-border">
          <Calendar mode="single" size="default" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Large
        </Label>
        <div className="inline-block rounded-lg border border-border">
          <Calendar mode="single" size="lg" />
        </div>
      </div>
    </div>
  );
}

const calendarSizesCode = `<Calendar mode="single" size="sm" />
<Calendar mode="single" size="default" />
<Calendar mode="single" size="lg" />`;

function MarkerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const today = getToday();

  const markers: CalendarMarker[] = [
    { match: addDays(today, 8), label: "Maintenance", tone: "destructive" },
    { match: { dayOfWeek: [0, 6] }, label: "Weekend rate", tone: "warning" },
  ];

  return (
    <div className="space-y-3">
      <div className="inline-block rounded-lg border border-border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          markers={markers}
        />
      </div>
      {date && (
        <output className="block text-sm text-muted-foreground">
          Selected: {format(date, "PPP")}
        </output>
      )}
    </div>
  );
}

const markerCode = `import { addDays } from "date-fns"
import { Calendar, getToday, type CalendarMarker } from "@/components/ui/calendar"

// Markers annotate days (dots + legend) and are appended to each
// day's accessible name for screen readers.
const markers: CalendarMarker[] = [
  { match: addDays(getToday(), 8), label: "Maintenance", tone: "destructive" },
  { match: { dayOfWeek: [0, 6] }, label: "Weekend rate", tone: "warning" },
]

<Calendar mode="single" markers={markers} />`;

function TimeZoneDemo() {
  const TZ = "America/New_York";
  const [date, setDate] = React.useState<Date | undefined>();
  const today = getToday(TZ);

  return (
    <div className="space-y-3">
      <div className="inline-block rounded-lg border border-border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          timeZone={TZ}
        />
      </div>
      <output className="block text-sm text-muted-foreground">
        New York today: {format(today, "PPP")}
        {date && ` — picked: ${format(date, "PPP")}`}
      </output>
    </div>
  );
}

const timeZoneCode = `import { Calendar, getToday } from "@/components/ui/calendar"

// "Today" highlighting and formatting run in the given IANA zone.
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  timeZone="America/New_York"
/>`;

function DateConstraintsDemo() {
  const [today] = React.useState(() => getToday());
  const [futureDate, setFutureDate] = React.useState<Date | undefined>();
  const [pastDate, setPastDate] = React.useState<Date | undefined>();

  return (
    <div className="flex flex-wrap gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Future weekdays only (from today)
        </Label>
        <div className="inline-block rounded-lg border border-border">
          <Calendar
            mode="single"
            selected={futureDate}
            onSelect={setFutureDate}
            minDate={today}
            disabled={{ dayOfWeek: [0, 6] }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Past dates only (until today)
        </Label>
        <div className="inline-block rounded-lg border border-border">
          <Calendar
            mode="single"
            selected={pastDate}
            onSelect={setPastDate}
            maxDate={today}
          />
        </div>
      </div>
    </div>
  );
}

const dateConstraintsCode = `<Calendar
  mode="single"
  minDate={getToday()}
  disabled={{ dayOfWeek: [0, 6] }}
/>
<Calendar mode="single" maxDate={getToday()} />`;

function CalendarWithoutTodayDemo() {
  return (
    <div className="inline-block rounded-lg border border-border">
      <Calendar mode="single" showTodayButton={false} />
    </div>
  );
}

const calendarWithoutTodayCode = `<Calendar mode="single" showTodayButton={false} />`;

function StressDemo() {
  const [today] = React.useState(() => getToday());
  const [date, setDate] = React.useState<Date | undefined>();
  const [period, setPeriod] = React.useState<Date | undefined>();

  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Compact calendar with long Today label &amp; disabled weekends
        </p>
        <div className="inline-block max-w-full overflow-x-auto rounded-lg border border-border">
          <Calendar
            mode="single"
            size="sm"
            selected={date}
            onSelect={setDate}
            minDate={today}
            disabled={{ dayOfWeek: [0, 6] }}
            todayLabel="Jump to current business day"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Compact MonthYearPicker with empty initial value
        </p>
        <div className="max-w-full overflow-x-auto">
          <MonthYearPicker
            size="sm"
            value={period}
            onChange={(d) => setPeriod(d)}
            minDate={new Date(2024, 0, 1)}
            maxDate={today}
          />
        </div>
      </div>
    </div>
  );
}

const stressCode = `import { Calendar, MonthYearPicker, getToday } from "@/components/ui/calendar"

// Long labels, empty values, and disabled days inside a narrow container
<div className="max-w-xs space-y-4">
  <Calendar
    mode="single"
    size="sm"
    minDate={getToday()}
    disabled={{ dayOfWeek: [0, 6] }}
    todayLabel="Jump to current business day"
  />
  <MonthYearPicker
    size="sm"
    value={period}
    onChange={setPeriod}
    minDate={new Date(2024, 0, 1)}
    maxDate={getToday()}
  />
</div>`;

const usageCode = `import {
  Calendar,
  MonthYearPicker,
  formatDateValue,
  getToday,
} from "@/components/ui/calendar"

{/* Single date */}
<Calendar mode="single" selected={date} onSelect={setDate} />

{/* Range with booking rules and markers */}
<Calendar
  mode="range"
  numberOfMonths={2}
  selected={range}
  onSelect={setRange}
  minDate={getToday()}
  minNights={1}
  maxNights={14}
  excludeDisabled
  markers={[{ match: { dayOfWeek: [5, 6] }, label: "Weekend", tone: "warning" }]}
/>

{/* Standalone MonthYearPicker */}
<MonthYearPicker
  value={period}
  onChange={(d, part) => part === "month" && setPeriod(d)}
  minDate={new Date(2024, 0, 1)}
  maxDate={getToday()}
/>`;

export default function CalendarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Calendar"
        description="Inline calendar and month/year grid built on DayPicker v10 with single, multiple, and range selection, booking rules, day markers, and IANA time zones."
        version="v2.0.1"
      />

      <FeatureGrid
        features={calendarPageFeatures}
        description="Inline date grids and month/year navigation built for scheduling and booking interfaces."
      />

      <DemoTabs defaultValue="basic" tabs={calendarPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={calendarPageShortcuts}
        description="Keyboard navigation across the day grid and month/year overlay."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use Calendar or MonthYearPicker directly for inline grids, multi-date selection, or custom popovers."
        notes={calendarPageUsageNotes}
      />

      <APIReference
        sections={calendarPageAPISections}
        description="Props, types, and defaults for Calendar, MonthYearPicker, and calendar utilities."
      />

      <Changelog
        entries={calendarPageChangelogEntries}
        title="Changelog"
        description="Version history for Calendar and MonthYearPicker."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const calendarPageFeatures = [
  {
    title: "Flexible Selection",
    description:
      "Single, multiple, and multi-month range modes with discriminated-union TypeScript props.",
    icon: <IconCalendar aria-hidden="true" className="size-5" />,
  },
  {
    title: "Real-World Rules",
    description:
      "minNights/maxNights, excludeDisabled, day markers with legend, IANA time zones, and date-fns locales.",
    icon: <IconCalendarEvent aria-hidden="true" className="size-5" />,
  },
  {
    title: "Accessible Grids",
    description:
      "Full arrow-key grid navigation, trapped month/year overlay dialog, and marker labels announced to screen readers.",
    icon: <IconClock aria-hidden="true" className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const calendarPageDemoTabs = [
  {
    value: "basic",
    label: "Single",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Standalone Calendar"
        description="A single-month calendar with the Today footer button."
        code={basicCalendarCode}
      >
        <BasicCalendarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "multiple",
    label: "Multiple",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Multiple Selection"
        description="Pick between 1 and 3 dates; navigation respects minDate/maxDate."
        code={multipleCalendarCode}
      >
        <MultipleCalendarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "range",
    label: "Range",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Range Calendar"
        description="Two months side-by-side with markers, minNights, bounds, and excludeDisabled."
        code={rangeCalendarCode}
      >
        <RangeCalendarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "month-year",
    label: "Month / Year",
    group: "Core",
    demo: (
      <DemoWrapper
        title="MonthYearPicker"
        description="Standalone month/year grid with full keyboard support and date bounds."
        code={monthYearPickerCode}
      >
        <MonthYearPickerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Calendar Sizes"
        description="Small, default, and large calendar densities."
        code={calendarSizesCode}
      >
        <CalendarSizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "markers",
    label: "Markers",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Day Markers"
        description="Annotate days with colored dots and a legend; labels join each day's accessible name."
        code={markerCode}
      >
        <MarkerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "timezone",
    label: "Time Zone",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Time Zone Support"
        description="Today highlighting and formatting run in the calendar's IANA time zone."
        code={timeZoneCode}
      >
        <TimeZoneDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "constraints",
    label: "Constraints",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Date Constraints"
        description="Restrict selection with minDate, maxDate, and DayPicker disabled matchers."
        code={dateConstraintsCode}
      >
        <DateConstraintsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "no-today",
    label: "No Today",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Without Today Button"
        description="Hide the Today footer button with showTodayButton={false}."
        code={calendarWithoutTodayCode}
      >
        <CalendarWithoutTodayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long labels, empty values, and disabled days inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const calendarPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description: "Navigate between header controls, day grid, and footer.",
  },
  {
    keys: "Arrow Keys",
    description: "Navigate between days, months, or years.",
  },
  { keys: "Home", description: "Go to first day of month." },
  { keys: "End", description: "Go to last day of month." },
  { keys: "Page Up", description: "Go to previous month." },
  { keys: "Page Down", description: "Go to next month." },
  { keys: "Enter / Space", description: "Select focused day, month, or year." },
  { keys: "Escape", description: "Close the month/year overlay." },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const calendarPageUsageNotes = [
  {
    label: "Calendar & MonthYearPicker",
    body: "Use Calendar or MonthYearPicker directly when embedding an inline grid, building multi-date pickers, or composing custom popovers.",
  },
  {
    label: "Need a Popover Input?",
    body: "Use DatePicker (/components/date-picker) when you need a trigger button or typed text input, quick presets, form serialization, and responsive mobile bottom-sheet presentation.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const calendarPageAPISections = [
  {
    title: "Calendar",
    props: [
      {
        prop: "mode",
        type: "'single' | 'multiple' | 'range'",
        default: "'single'",
        description:
          "Selection mode; props are a discriminated union per mode.",
      },
      {
        prop: "selected / onSelect",
        type: "Date | Date[] | DateRange",
        default: "undefined",
        description: "Typed per mode (single, multiple, range).",
      },
      {
        prop: "disabled",
        type: "Matcher | Matcher[]",
        default: "undefined",
        description: "Any DayPicker matcher: function, Date, range, dayOfWeek…",
      },
      {
        prop: "defaultMonth",
        type: "Date",
        default: "selection → today",
        description: "Uncontrolled initial month.",
      },
      {
        prop: "month / onMonthChange",
        type: "Date / ((month: Date) => void)",
        default: "undefined",
        description: "Controlled displayed month.",
      },
      {
        prop: "minDate / maxDate",
        type: "Date",
        default: "undefined",
        description: "Also bounds DayPicker's own nav and keyboard paging.",
      },
      {
        prop: "markers",
        type: "CalendarMarker[]",
        default: "undefined",
        description: "Dots + legend; labels join the day's accessible name.",
      },
      {
        prop: "showLegend",
        type: "boolean",
        default: "true when markers exist",
        description: "Render the marker legend.",
      },
      {
        prop: "timeZone",
        type: "string (IANA)",
        default: "undefined",
        description: "Zone for 'Today' and formatting.",
      },
      {
        prop: "locale",
        type: "Locale (date-fns)",
        default: "undefined",
        description: "Month names and formatting.",
      },
      {
        prop: "minNights / maxNights",
        type: "number",
        default: "undefined",
        description: "Range mode: enforce stay length.",
      },
      {
        prop: "excludeDisabled",
        type: "boolean",
        default: "false",
        description: "Reset a range that would include a disabled day.",
      },
      {
        prop: "resetOnSelect",
        type: "boolean",
        default: "false (Calendar)",
        description: "Start a fresh range after a completed one.",
      },
      {
        prop: "showTodayButton / todayLabel",
        type: "boolean / string",
        default: "true / 'Today'",
        description: "Footer Today button.",
      },
      {
        prop: "actions",
        type: "ReactNode",
        default: "undefined",
        description:
          "Extra controls next to the Today button (outside the live region).",
      },
      {
        prop: "numberOfMonths",
        type: "number",
        default: "1",
        description: "Months side-by-side on ≥sm screens.",
      },
      {
        prop: "fixedWeeks / showWeekNumber",
        type: "boolean",
        default: "false",
        description: "Always six rows; show ISO week numbers.",
      },
      {
        prop: "animate",
        type: "boolean",
        default: "false",
        description:
          "Month transition. Keyframes ship with the calendar registry item's CSS.",
      },
      {
        prop: "size",
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
        description: "Calendar density.",
      },
      {
        prop: "classNames",
        type: "Partial<ClassNames>",
        default: "undefined",
        description: "Override DayPicker class names (merged last).",
      },
    ],
  },
  {
    title: "MonthYearPicker",
    props: [
      {
        prop: "value",
        type: "Date",
        default: "undefined",
        description: "Currently selected month/year.",
      },
      {
        prop: "onChange",
        type: "(date: Date, part: 'month' | 'year') => void",
        default: "undefined",
        description: "Fires with which part was picked.",
      },
      {
        prop: "minDate / maxDate",
        type: "Date",
        default: "undefined",
        description: "Disable months/years outside the bounds.",
      },
      {
        prop: "defaultView",
        type: "'month' | 'year'",
        default: "'month'",
        description: "Initial grid view.",
      },
      {
        prop: "size",
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
        description: "Grid density.",
      },
      {
        prop: "autoFocus",
        type: "boolean",
        default: "false",
        description: "Focus the grid on mount.",
      },
    ],
  },
  {
    title: "Utilities & Variants",
    props: [
      {
        prop: "formatDateValue",
        type: "(value: Date | DateRange | undefined, options?: FormatDateValueOptions) => string",
        default: "-",
        description:
          "Locale- and time-zone-aware formatter for single dates and date ranges.",
      },
      {
        prop: "getToday / toISODate / isDateRange",
        type: "Calendar helper functions",
        default: "-",
        description:
          "Time-zone-aware today anchor, yyyy-MM-dd serializer, and DateRange type guard.",
      },
      {
        prop: "calendarSizeConfig / calendarButtonVariants / toggleButtonVariants / gridCellVariants",
        type: "CVA variants & token maps",
        default: "-",
        description:
          "Exported styling helpers for custom calendar compositions.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const calendarPageChangelogEntries = [
  {
    version: "2.0.1",
    date: "20 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Month transitions survive CLI installs",
        description:
          "The animate prop's slide/fade keyframes, kira-calendar-* transition classes, RTL overrides, and a slot-scoped reduced-motion gate now ship in the calendar registry item's css, so kira-kit add backfills them even when your base stylesheet predates them. Previously animate produced unstyled classes and left the old month snapshot stuck in the DOM.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "24 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Discriminated-union props",
        description:
          "Calendar props are now typed per mode. Narrow your onSelect handlers (e.g. (d: Date | undefined) => void). 'react-day-picker/style.css' and the old .rdp-* CSS overrides are gone — day styling is computed from modifiers in JS.",
      },
      {
        type: "added",
        title: "Booking rules and markers",
        description:
          "minNights/maxNights, excludeDisabled and resetOnSelect model real stays; markers annotate days with colored dots, a legend and accessible names.",
      },
      {
        type: "fixed",
        title: "Range hover preview and booking second-click",
        description:
          "DayPicker v10 dropped v9's hover-range modifiers, so picking a start day showed no preview band while hovering the end date — the Calendar now tracks the hovered day and paints the range band live. A second click on a day whose span crossed a disabled (booked) day or exceeded maxNights now disables unreachable days up front so the second click always lands on a valid end.",
      },
      {
        type: "fixed",
        title: "Accessibility and navigation",
        description:
          "Month/year selection moved from DayPicker's footer live region into an overlay dialog with Escape, Tab trap and roving focus; DayPicker's own nav enforces minDate/maxDate; the Today button is a real button next to the grid. The initial month now follows the selection instead of always starting at today.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
