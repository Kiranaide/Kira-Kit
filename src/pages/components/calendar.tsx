import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconCalendar,
  IconCalendarEvent,
  IconClock,
} from "@tabler/icons-react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Calendar,
  MonthYearPicker,
  formatDateValue,
  getToday,
  type CalendarMarker,
} from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
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

function SingleDateDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="max-w-xs">
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
      {date && (
        <p className="text-sm text-muted-foreground mt-2">
          Selected: {format(date, "PPP")}
        </p>
      )}
    </div>
  );
}

const singleDateCode = `import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

export function SingleDateDemo() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <DatePicker
      mode="single"
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
    />
  )
}`;

function DateRangeDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <div className="max-w-xs">
      <DatePicker
        mode="range"
        value={range}
        onChange={setRange}
        placeholder="Select date range"
      />
      {range?.from && (
        <p className="text-sm text-muted-foreground mt-2">
          From: {format(range.from, "PPP")}
          {range.to && ` — To: ${format(range.to, "PPP")}`}
        </p>
      )}
    </div>
  );
}

const dateRangeCode = `import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

export function DateRangeDemo() {
  const [range, setRange] = useState<DateRange | undefined>()

  return (
    <DatePicker
      mode="range"
      value={range}
      onChange={setRange}
      placeholder="Select date range"
    />
  )
}`;

function TypedEntryDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="max-w-xs">
      <DatePicker
        mode="single"
        editable
        value={date}
        onChange={setDate}
        ariaLabel="Appointment date"
        placeholder="Type or pick a date"
      />
      {date && (
        <p className="text-sm text-muted-foreground mt-2">
          Parsed as: {format(date, "PPP")}
        </p>
      )}
    </div>
  );
}

const typedEntryCode = `import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

// editable adds a text input: locale formats (P/PP/PPP) and ISO yyyy-MM-dd
// are parsed, validated against minDate/maxDate/disabled days, and
// Alt+ArrowDown opens the calendar.
export function TypedEntryDemo() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <DatePicker
      mode="single"
      editable
      value={date}
      onChange={setDate}
      placeholder="Type or pick a date"
    />
  )
}`;

function TimeZoneDemo() {
  const TZ = "America/New_York";
  const [date, setDate] = React.useState<Date | undefined>();
  const today = getToday(TZ);

  return (
    <div className="max-w-xs space-y-2">
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        timeZone={TZ}
        placeholder="America/New_York (UTC−5)"
      />
      <p className="text-sm text-muted-foreground">
        New York today: {format(today, "PPP")}
        {date && ` — picked: ${format(date, "PPP")}`}
      </p>
    </div>
  );
}

const timeZoneCode = `import { DatePicker, getToday } from "@/components/ui/date-picker"
import { format } from "date-fns"

// "Today", presets and typed-entry parsing all run in the given IANA zone.
// Useful when the server or the user is in a different zone than the browser.
export function TimeZoneDemo() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <DatePicker
      mode="single"
      value={date}
      onChange={setDate}
      timeZone="America/New_York"
    />
  )
}`;

function BookingDemo() {
  const [stay, setStay] = React.useState<DateRange | undefined>();
  const today = getToday();

  const booked: DateRange[] = [
    { from: addDays(today, 3), to: addDays(today, 5) },
  ];

  return (
    <div className="max-w-xs space-y-2">
      <DatePicker
        mode="range"
        value={stay}
        onChange={setStay}
        minDate={today}
        maxDate={addDays(today, 60)}
        disabledDays={booked}
        minNights={1}
        maxNights={14}
        excludeDisabled
        showPresets={false}
        ariaLabel="Stay"
        placeholder="Check-in — check-out"
      />
      {stay?.from && (
        <p className="text-sm text-muted-foreground">
          {formatDateValue(stay, { pattern: "PPP" })}
        </p>
      )}
    </div>
  );
}

const bookingCode = `import { addDays } from "date-fns"
import { DatePicker } from "@/components/ui/date-picker"

// Booking rules: min/max stay length, booked ranges can't be crossed,
// and a range that would include a disabled day resets (excludeDisabled).
export function BookingDemo() {
  const [stay, setStay] = useState<DateRange | undefined>()
  const today = getToday()

  return (
    <DatePicker
      mode="range"
      value={stay}
      onChange={setStay}
      minDate={today}
      maxDate={addDays(today, 60)}
      disabledDays={[{ from: addDays(today, 3), to: addDays(today, 5) }]}
      minNights={1}
      maxNights={14}
      excludeDisabled
      showPresets={false}
    />
  )
}`;

function MarkerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();
  const today = getToday();

  const markers: CalendarMarker[] = [
    { match: addDays(today, 8), label: "Maintenance", tone: "destructive" },
    { match: { dayOfWeek: [0, 6] }, label: "Weekend rate", tone: "warning" },
  ];

  return (
    <div className="max-w-xs">
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        markers={markers}
        placeholder="Pick a day"
      />
    </div>
  );
}

const markerCode = `import { addDays } from "date-fns"
import { DatePicker, getToday } from "@/components/ui/date-picker"
import { Calendar, type CalendarMarker } from "@/components/ui/calendar"

// Markers annotate days (dots + legend) and are appended to each
// day's accessible name for screen readers.
const markers: CalendarMarker[] = [
  { match: addDays(getToday(), 8), label: "Maintenance", tone: "destructive" },
  { match: { dayOfWeek: [0, 6] }, label: "Weekend rate", tone: "warning" },
]

<Calendar mode="single" markers={markers} />

// In a DatePicker:
<DatePicker mode="single" markers={markers} />`;

function PresetsDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <div className="max-w-xs">
      <DatePicker
        mode="range"
        value={range}
        onChange={setRange}
        placeholder="Report period"
      />
      {range?.from && (
        <p className="text-sm text-muted-foreground mt-2">
          {format(range.from, "MMM d")}
          {range.to && ` – ${format(range.to, "MMM d, yyyy")}`}
        </p>
      )}
    </div>
  );
}

const presetsCode = `import { DatePicker } from "@/components/ui/date-picker"

// Presets that fall outside minDate/maxDate or hit disabled days are
// disabled automatically. Pass your own via presets, or showPresets={false}.
<DatePicker
  mode="range"
  value={range}
  onChange={setRange}
  maxDate={new Date()}
/>`;

function WithoutPresetsDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker mode="single" placeholder="No presets" showPresets={false} />
    </div>
  );
}

const withoutPresetsCode = `<DatePicker
  mode="single"
  placeholder="No presets"
  showPresets={false}
/>`;

function DisabledDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker mode="single" placeholder="Disabled picker" disabled />
    </div>
  );
}

const disabledCode = `<DatePicker mode="single" placeholder="Disabled picker" disabled />`;

function DateConstraintsDemo() {
  const [today] = React.useState(() => new Date());

  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Only future dates (from today)
        </Label>
        <DatePicker
          mode="single"
          value={date}
          onChange={setDate}
          placeholder="Select future date"
          minDate={today}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Only past dates (until today)
        </Label>
        <DatePicker
          mode="single"
          placeholder="Select past date"
          maxDate={today}
        />
      </div>
    </div>
  );
}

const dateConstraintsCode = `<DatePicker mode="single" minDate={new Date()} />
<DatePicker mode="single" maxDate={new Date()} />`;

function SizeVariantsDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Small (sm)
        </Label>
        <div className="max-w-xs">
          <DatePicker mode="single" size="sm" placeholder="Small date picker" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Default
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            size="default"
            placeholder="Default date picker"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Large (lg)
        </Label>
        <div className="max-w-xs">
          <DatePicker mode="single" size="lg" placeholder="Large date picker" />
        </div>
      </div>
    </div>
  );
}

const sizeVariantsCode = `<DatePicker mode="single" size="sm" placeholder="Small" />
<DatePicker mode="single" size="default" placeholder="Default" />
<DatePicker mode="single" size="lg" placeholder="Large" />`;

function StyleVariantsDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Default
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            variant="default"
            placeholder="Default variant"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Outline
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            variant="outline"
            placeholder="Outline variant"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Ghost
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            variant="ghost"
            placeholder="Ghost variant"
          />
        </div>
      </div>
    </div>
  );
}

const styleVariantsCode = `<DatePicker mode="single" variant="default" />
<DatePicker mode="single" variant="outline" />
<DatePicker mode="single" variant="ghost" />`;

function ApplyModeDemo() {
  const [immediate, setImmediate] = React.useState<DateRange | undefined>();
  const [confirm, setConfirm] = React.useState<DateRange | undefined>();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Immediate (default) — applies each click
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="range"
            value={immediate}
            onChange={setImmediate}
            applyMode="immediate"
            placeholder="Immediate apply"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Confirm — Apply/Cancel buttons
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="range"
            value={confirm}
            onChange={setConfirm}
            applyMode="confirm"
            placeholder="Confirm apply"
          />
        </div>
      </div>
    </div>
  );
}

const applyModeCode = `<DatePicker mode="range" applyMode="immediate" />
<DatePicker mode="range" applyMode="confirm" />`;

function BasicCalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg inline-block">
        <Calendar mode="single" selected={date} onSelect={(d) => setDate(d)} />
      </div>
      {date && (
        <p className="text-sm text-muted-foreground">
          Selected: {format(date, "PPP")}
        </p>
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
    <div className="border border-border rounded-lg inline-block">
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        min={1}
        max={3}
      />
    </div>
  );
}

const multipleCalendarCode = `import { Calendar } from "@/components/ui/calendar"

// Multiple mode with min/max selected dates. DayPickers's own
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
    <div className="border border-border rounded-lg inline-block">
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

function CalendarSizesDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Small
        </Label>
        <div className="border border-border rounded-lg inline-block">
          <Calendar mode="single" size="sm" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Default
        </Label>
        <div className="border border-border rounded-lg inline-block">
          <Calendar mode="single" size="default" />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Large
        </Label>
        <div className="border border-border rounded-lg inline-block">
          <Calendar mode="single" size="lg" />
        </div>
      </div>
    </div>
  );
}

const calendarSizesCode = `<Calendar mode="single" size="sm" />
<Calendar mode="single" size="default" />
<Calendar mode="single" size="lg" />`;

function CalendarWithoutTodayDemo() {
  return (
    <div className="border border-border rounded-lg inline-block">
      <Calendar mode="single" showTodayButton={false} />
    </div>
  );
}

const calendarWithoutTodayCode = `<Calendar mode="single" showTodayButton={false} />`;

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
        <p className="text-sm text-muted-foreground">
          Selected: {format(period, "MMMM yyyy")}
        </p>
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

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function CalendarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Date Picker & Calendar"
        description="Date selection built on DayPicker v10: typed entry, booking rules, markers, time zones, and a native-popover picker that anchors to its trigger and becomes a bottom sheet on mobile."
        version="v2.0.0"
      />

      <FeatureGrid features={calendarPageFeatureGridFeatures} />

      <DemoTabs defaultValue="single" tabs={calendarPageDemoTabsTabs} />

      <KeyboardShortcuts shortcuts={calendarPageKeyboardShortcutsShortcuts} />

      <UsageBlock
        code={`import { DatePicker, singlePresets, rangePresets } from "@/components/ui/date-picker"
import { Calendar, MonthYearPicker, formatDateValue, getToday } from "@/components/ui/calendar"

{/* Single date */}
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>

{/* Typed entry (single mode) */}
<DatePicker mode="single" editable value={date} onChange={setDate} />

{/* Date range */}
<DatePicker
  mode="range"
  value={{ from: startDate, to: endDate }}
  onChange={setDateRange}
/>

{/* Form integration — hidden inputs serialize as yyyy-MM-dd */}
<DatePicker mode="single" name="dob" value={dob} onChange={setDob} />
<DatePicker mode="range" name="stay" value={stay} onChange={setStay} />
<DatePicker
  mode="range"
  name={{ from: "checkin", to: "checkout" }}
  value={stay}
  onChange={setStay}
/>

{/* Time zone + locale — import { enUS } from "date-fns/locale" */}
<DatePicker timeZone="America/New_York" locale={enUS} weekStartsOn={1} />

{/* Booking rules */}
<DatePicker
  mode="range"
  minNights={1}
  maxNights={14}
  excludeDisabled
  disabledDays={bookedRanges}
/>

{/* Controlled open state */}
<DatePicker open={open} onOpenChange={setOpen} />

{/* Custom presets */}
<DatePicker
  mode="range"
  presets={[{ label: "Last 7 days", getValue: (t) => ({ from: subDays(t, 6), to: t }) }]}
/>

{/* Without presets */}
<DatePicker showPresets={false} />

{/* Disabled */}
<DatePicker disabled />

{/* Date constraints */}
<DatePicker minDate={new Date()} />
<DatePicker maxDate={new Date()} />
<DatePicker minDate={startDate} maxDate={endDate} />

{/* Size variants */}
<DatePicker size="sm" />
<DatePicker size="default" />
<DatePicker size="lg" />

{/* Style variants */}
<DatePicker variant="default" />
<DatePicker variant="outline" />
<DatePicker variant="ghost" />

{/* Apply mode */}
<DatePicker applyMode="immediate" />
<DatePicker applyMode="confirm" />

{/* Standalone Calendar */}
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>

{/* Multiple selection */}
<Calendar mode="multiple" selected={dates} onSelect={setDates} min={1} max={3} />

{/* Range with markers */}
<Calendar
  mode="range"
  numberOfMonths={2}
  markers={[{ match: { dayOfWeek: [5, 6] }, label: "Weekend", tone: "warning" }]}
/>

{/* Calendar with custom size */}
<Calendar mode="single" size="lg" />

{/* Calendar without Today button */}
<Calendar mode="single" showTodayButton={false} />

{/* Month/Year picker */}
<MonthYearPicker
  value={period}
  onChange={(d, part) => part === "month" && setPeriod(d)}
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date()}
/>`}
      />

      <APIReference sections={calendarPageAPIReferenceSections} />

      <Changelog entries={calendarPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const calendarPageFeatureGridFeatures = [
  {
    title: "Flexible Selection",
    description:
      "Single, multiple and range modes with immediate or confirm apply, typed entry and presets.",
    icon: <IconCalendar className="h-5 w-5" />,
  },
  {
    title: "Real-World Rules",
    description:
      "minNights/maxNights, excludeDisabled, markers with legend, IANA time zones and locales.",
    icon: <IconCalendarEvent className="h-5 w-5" />,
  },
  {
    title: "Accessible",
    description:
      "Native Popover API (light dismiss, Escape, focus return), full keyboard grids, and ARIA labels derived from the selection.",
    icon: <IconClock className="h-5 w-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const calendarPageDemoTabsTabs = [
  {
    value: "single",
    label: "Single Date",
    demo: (
      <DemoWrapper
        title="Single Date Selection"
        description="Pick a single date from the calendar."
        code={singleDateCode}
      >
        <SingleDateDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "range",
    label: "Date Range",
    demo: (
      <DemoWrapper
        title="Date Range Selection"
        description="Select a start and end date for ranges."
        code={dateRangeCode}
      >
        <DateRangeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "typed",
    label: "Typed Entry",
    demo: (
      <DemoWrapper
        title="Typed Entry"
        description="editable renders a text input: locale formats and ISO dates are parsed and validated."
        code={typedEntryCode}
      >
        <TypedEntryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "timezone",
    label: "Time Zone",
    demo: (
      <DemoWrapper
        title="Time Zone Support"
        description="Today, presets and typed-entry parsing run in the picker's IANA time zone."
        code={timeZoneCode}
      >
        <TimeZoneDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "booking",
    label: "Booking Rules",
    demo: (
      <DemoWrapper
        title="Booking Rules"
        description="minNights, maxNights, disabled (booked) ranges and excludeDisabled."
        code={bookingCode}
      >
        <BookingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "markers",
    label: "Markers",
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
    value: "presets",
    label: "Presets",
    demo: (
      <DemoWrapper
        title="Presets"
        description="Quick ranges that respect bounds; out-of-range presets disable themselves."
        code={presetsCode}
      >
        <PresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "without-presets",
    label: "No Presets",
    demo: (
      <DemoWrapper
        title="Without Presets"
        description="A plain single-date picker with no preset sidebar."
        code={withoutPresetsCode}
      >
        <WithoutPresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled",
    label: "Disabled",
    demo: (
      <DemoWrapper
        title="Disabled Picker"
        description="The whole picker is disabled and non-interactive."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "constraints",
    label: "Constraints",
    demo: (
      <DemoWrapper
        title="Date Constraints"
        description="Restrict selection to future or past dates."
        code={dateConstraintsCode}
      >
        <DateConstraintsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Small, default, and large pickers."
        code={sizeVariantsCode}
      >
        <SizeVariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "styles",
    label: "Styles",
    demo: (
      <DemoWrapper
        title="Style Variants"
        description="Default, outline, and ghost trigger styles."
        code={styleVariantsCode}
      >
        <StyleVariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "apply-mode",
    label: "Apply Mode",
    demo: (
      <DemoWrapper
        title="Apply Mode Variants"
        description="Immediate or confirm mode for date selection."
        code={applyModeCode}
      >
        <ApplyModeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "calendar-basic",
    label: "Calendar",
    demo: (
      <DemoWrapper
        title="Standalone Calendar"
        description="A single-month calendar with the Today button."
        code={basicCalendarCode}
      >
        <BasicCalendarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "calendar-multiple",
    label: "Multiple",
    demo: (
      <DemoWrapper
        title="Multiple Selection"
        description="Pick between 1 and 3 dates; nav respects minDate/maxDate."
        code={multipleCalendarCode}
      >
        <MultipleCalendarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "calendar-range",
    label: "Range Calendar",
    demo: (
      <DemoWrapper
        title="Range Calendar"
        description="Two months with markers, min nights and bounds."
        code={rangeCalendarCode}
      >
        <RangeCalendarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "calendar-sizes",
    label: "Calendar Sizes",
    demo: (
      <DemoWrapper
        title="Calendar Sizes"
        description="Small, default, and large calendars."
        code={calendarSizesCode}
      >
        <CalendarSizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "calendar-no-today",
    label: "No Today",
    demo: (
      <DemoWrapper
        title="Without Today Button"
        description="Calendar without the Today footer button."
        code={calendarWithoutTodayCode}
      >
        <CalendarWithoutTodayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "month-year",
    label: "Month/Year",
    demo: (
      <DemoWrapper
        title="MonthYearPicker"
        description="Standalone month/year grid with full keyboard support."
        code={monthYearPickerCode}
      >
        <MonthYearPickerDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const calendarPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description: "Navigate between focusable elements",
  },
  {
    keys: "Arrow Keys",
    description: "Navigate between days/months/years",
  },
  { keys: "Home", description: "Go to first day of month" },
  { keys: "End", description: "Go to last day of month" },
  { keys: "Page Up", description: "Go to previous month" },
  { keys: "Page Down", description: "Go to next month" },
  { keys: "Enter / Space", description: "Select focused day" },
  { keys: "Escape", description: "Close the popover or overlay" },
  {
    keys: "Alt + ArrowDown",
    description: "Open the calendar from the typed input",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const calendarPageAPIReferenceSections = [
  {
    title: "DatePicker",
    props: [
      {
        prop: "mode",
        type: "'single' | 'range'",
        default: "'single'",
        description: "Selection mode for the date picker.",
      },
      {
        prop: "value",
        type: "Date | DateRange",
        default: "undefined",
        description:
          "Controlled value; per-mode types are enforced by the prop union.",
      },
      {
        prop: "onChange",
        type: "(value: Date | DateRange | undefined) => void",
        default: "undefined",
        description: "Callback when the selection changes (after apply).",
      },
      {
        prop: "editable",
        type: "boolean",
        default: "false",
        description:
          "single mode only: render a text input for typed entry (locale formats and ISO).",
      },
      {
        prop: "name",
        type: "string | { from: string; to: string }",
        default: "undefined",
        description:
          "Hidden form inputs serialized as yyyy-MM-dd. Range default: name_from / name_to.",
      },
      {
        prop: "disabledDays",
        type: "Matcher | Matcher[]",
        default: "undefined",
        description: "Days that cannot be picked (booked nights, holidays…).",
      },
      {
        prop: "minDate / maxDate",
        type: "Date",
        default: "undefined",
        description: "Bounds for selection, navigation and typed entry.",
      },
      {
        prop: "showPresets",
        type: "boolean",
        default: "true",
        description: "Show the presets sidebar (chips on mobile).",
      },
      {
        prop: "presets",
        type: "DatePreset[]",
        default: "singlePresets / rangePresets",
        description:
          "Custom presets; receive 'today' in the picker's time zone.",
      },
      {
        prop: "applyMode",
        type: "'immediate' | 'confirm'",
        default: "'immediate'",
        description: "Apply each click, or wait for the Apply button.",
      },
      {
        prop: "closeOnSelect",
        type: "boolean",
        default: "true",
        description: "Close after a complete selection in immediate mode.",
      },
      {
        prop: "timeZone",
        type: "string (IANA)",
        default: "undefined",
        description: "Zone for 'today', presets and typed-entry parsing.",
      },
      {
        prop: "locale",
        type: "Locale (date-fns)",
        default: "undefined",
        description: "Formatting and month names.",
      },
      {
        prop: "weekStartsOn",
        type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
        default: "undefined",
        description: "First day of the week.",
      },
      {
        prop: "displayFormat",
        type: "string (date-fns pattern)",
        default: "Intl medium date",
        description: "Trigger label and typed-input pattern.",
      },
      {
        prop: "markers",
        type: "CalendarMarker[]",
        default: "undefined",
        description: "Day annotations rendered as dots with a legend.",
      },
      {
        prop: "numberOfMonths",
        type: "number",
        default: "2 for ranges on ≥640px, else 1",
        description: "Months shown in the popover.",
      },
      {
        prop: "open / onOpenChange",
        type: "boolean / ((open: boolean) => void)",
        default: "undefined",
        description: "Controlled open state.",
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
        default: "true (range)",
        description: "Start a fresh range after a completed one.",
      },
      {
        prop: "required / invalid",
        type: "boolean",
        default: "false",
        description: "Form semantics and error styling.",
      },
      {
        prop: "ariaLabel",
        type: "string",
        default: "'Date' / 'Date range'",
        description: "Accessible name prefix for the trigger.",
      },
      {
        prop: "size",
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
        description: "Size variant of the component.",
      },
      {
        prop: "variant",
        type: "'default' | 'outline' | 'ghost'",
        default: "'default'",
        description: "Style variant of the trigger.",
      },
    ],
  },
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
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const calendarPageChangelogEntries = [
  {
    version: "v2.0.1",
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
    version: "v2.0.0",
    date: "24 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Discriminated-union props",
        description:
          "Calendar and DatePicker props are now typed per mode. Narrow your onSelect/onChange handlers (e.g. (d: Date | undefined) => void). 'react-day-picker/style.css' and the old .rdp-* CSS overrides are gone — day styling is computed from modifiers in JS.",
      },
      {
        type: "changed",
        title: "Native Popover API",
        description:
          "The DatePicker popup is a native popover: top layer, light dismiss, Escape and focus return without document-level listeners. CSS anchor positioning keeps it tethered to the trigger (flips when it would overflow); small screens get a bottom sheet with preset chips. Browsers without anchor positioning get a centered dialog.",
      },
      {
        type: "added",
        title: "Typed entry",
        description:
          "editable (single mode) parses locale formats (P/PP/PPP) and ISO dates, validates against bounds and disabled days, shows an inline error with a format example, and opens the calendar with Alt+ArrowDown.",
      },
      {
        type: "added",
        title: "Form and time-zone support",
        description:
          "name emits hidden yyyy-MM-dd inputs (name_from/name_to in range mode) that work with form actions; timeZone moves 'Today', presets and parsing into any IANA zone.",
      },
      {
        type: "added",
        title: "Booking rules and markers",
        description:
          "minNights/maxNights, excludeDisabled and resetOnSelect model real stays; markers annotate days with colored dots, a legend and accessible names.",
      },
      {
        type: "fixed",
        title: "Range visual glitches",
        description:
          "Day styling is now computed in JS from modifiers — the !important battles between selected and range_middle (fully-filled middle days) are gone. Preset math is off-by-one correct ('Last 7 days' is 7 days), out-of-range presets disable themselves, and Apply requires a complete range.",
      },
      {
        type: "fixed",
        title: "Range hover preview and booking second-click",
        description:
          "DayPicker v10 dropped v9's hover-range modifiers, so picking a start day showed no preview band while hovering the end date — the Calendar now tracks the hovered day and paints the range band live. Worse, a second click on a day whose span crossed a disabled (booked) day or exceeded maxNights silently RESTARTED the range instead of completing it (DayPicker's excludeDisabled reset); those days are now disabled up front, so the second click always lands on a valid end and the picker closes on a complete pick. The popover also syncs from beforetoggle as well as toggle: toggle fires after the open transition, which stalls on backgrounded tabs and left the calendar panel unmounted while the popover looked open.",
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
