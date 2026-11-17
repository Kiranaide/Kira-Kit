import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconCalendar, IconClock, IconForms } from "@tabler/icons-react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/ui/date-picker";
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

function FormDemo() {
  const [today] = React.useState(() => new Date());

  const [dob, setDob] = React.useState<Date | undefined>();
  const [stay, setStay] = React.useState<DateRange | undefined>();

  const [submitted, setSubmitted] = React.useState<
    Record<string, string> | undefined
  >();

  return (
    <form
      className="max-w-xs space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setSubmitted(
          Object.fromEntries(
            Array.from(data, ([key, value]) => [
              key,
              value instanceof File ? value.name : value,
            ]),
          ),
        );
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="dob" className="text-sm font-medium">
          Date of birth
        </Label>
        <DatePicker
          id="dob"
          mode="single"
          name="dob"
          value={dob}
          onChange={setDob}
          maxDate={today}
          showPresets={false}
          ariaLabel="Date of birth"
          placeholder="YYYY-MM-DD"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stay" className="text-sm font-medium">
          Stay (range)
        </Label>
        <DatePicker
          id="stay"
          mode="range"
          name="stay"
          value={stay}
          onChange={setStay}
          ariaLabel="Stay"
          placeholder="Check-in — check-out"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Submit
      </button>
      {submitted && (
        <pre className="max-w-xs overflow-x-auto rounded-md bg-muted p-3 text-xs">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </form>
  );
}

const formCode = `// name emits hidden yyyy-MM-dd inputs that work with form actions.
// Range mode: stay → stay_from / stay_to.
<form action={createBooking}>
  <DatePicker id="dob" mode="single" name="dob" value={dob} onChange={setDob} />
  <DatePicker id="stay" mode="range" name="stay" value={stay} onChange={setStay} />
  <button type="submit">Book</button>
</form>`;

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
      <DatePicker
        mode="single"
        value={date}
        onChange={setDate}
        placeholder="Select future date"
        minDate={today}
      />
      <DatePicker
        mode="single"
        placeholder="Select past date"
        maxDate={today}
      />
      <DatePicker
        mode="single"
        placeholder="Select within 7 days"
        minDate={today}
        maxDate={addDays(today, 7)}
      />
    </div>
  );
}

const dateConstraintsCode = `import { addDays } from "date-fns"

<DatePicker mode="single" minDate={new Date()} />
<DatePicker mode="single" maxDate={new Date()} />
<DatePicker mode="single" minDate={new Date()} maxDate={addDays(new Date(), 7)} />`;

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

function DateTimeDemo() {
  const [datetime, setDatetime] = React.useState<Date | undefined>();

  return (
    <div className="max-w-sm">
      <DatePicker
        mode="datetime"
        value={datetime}
        onChange={setDatetime}
        placeholder="Select date & time"
        ariaLabel="Starts at"
      />
      {datetime && (
        <p className="text-sm text-muted-foreground mt-2">
          Selected: {format(datetime, "PPP p")}{" "}
          <span className="tabular-nums">
            (hours={datetime.getHours()}, minutes={datetime.getMinutes()})
          </span>
        </p>
      )}
    </div>
  );
}

const dateTimeCode = `import { DatePicker } from "@/components/ui/date-picker"

export function Demo() {
  const [datetime, setDatetime] = useState<Date | undefined>()

  return (
    <DatePicker
      mode="datetime"
      value={datetime}
      onChange={setDatetime}
      placeholder="Select date & time"
    />
  )
}`;

function DateTimeFormDemo() {
  const [datetime, setDatetime] = React.useState<Date | undefined>(
    new Date(2026, 9, 26, 14, 35),
  );

  return (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="starts-at" className="text-sm font-medium">
        Starts at
      </Label>
      <DatePicker
        id="starts-at"
        mode="datetime"
        name="starts_at"
        value={datetime}
        onChange={setDatetime}
        granularity="second"
        ariaLabel="Starts at"
      />
      <p className="text-sm text-muted-foreground">
        Hidden input <code>starts_at</code> ={" "}
        <span className="font-mono tabular-nums">
          {datetime ? format(datetime, "yyyy-MM-dd'T'HH:mm:ss") : "(empty)"}
        </span>
      </p>
    </div>
  );
}

const dateTimeFormCode = `// name emits a hidden ISO "yyyy-MM-dd'T'HH:mm:ss" input.
<DatePicker
  mode="datetime"
  name="starts_at"
  granularity="second"
  value={startsAt}
  onChange={setStartsAt}
/>`;

export default function DatePickerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Date Picker"
        description="A date picker built on the enhanced Calendar: native Popover API popup with CSS anchor positioning, typed entry, form integration, booking rules and responsive presets."
        version="v2.1.0"
      />

      <FeatureGrid features={datePickerPageFeatureGridFeatures} />

      <DemoTabs defaultValue="single" tabs={datePickerPageDemoTabsTabs} />

      <KeyboardShortcuts shortcuts={datePickerPageKeyboardShortcutsShortcuts} />

      <UsageBlock
        code={`import { DatePicker, singlePresets, rangePresets } from "@/components/ui/date-picker"
import { getToday, formatDateValue } from "@/components/ui/calendar"
import { addDays, subDays } from "date-fns"

{/* Single date */}
<DatePicker mode="single" value={date} onChange={setDate} />

{/* Typed entry + form field */}
<DatePicker id="dob" mode="single" editable name="dob" value={dob} onChange={setDob} />

{/* Date range */}
<DatePicker mode="range" value={stay} onChange={setStay} />

{/* Date & time — calendar + inline time comb, one onChange */}
<DatePicker mode="datetime" value={startsAt} onChange={setStartsAt} />
<DatePicker mode="datetime" granularity="second" hourCycle={12}
  timeFormat="h:mm:ss a" name="starts_at"
  value={startsAt} onChange={setStartsAt} editable />

{/* Range with explicit input names */}
<DatePicker mode="range" name={{ from: "checkin", to: "checkout" }} value={stay} onChange={setStay} />

{/* Booking rules */}
const today = getToday("Asia/Jakarta")
<DatePicker
  mode="range"
  value={stay}
  onChange={setStay}
  timeZone="Asia/Jakarta"
  minDate={today}
  maxDate={addDays(today, 365)}
  disabledDays={bookedRanges}
  minNights={1}
  maxNights={14}
  excludeDisabled
  showPresets={false}
  markers={[{ match: { dayOfWeek: [5, 6] }, label: "Weekend rate", tone: "warning" }]}
/>

{/* Custom presets — receive "today" in the picker's time zone */}
<DatePicker
  mode="range"
  presets={[
    { label: "Last 7 days", getValue: (t) => ({ from: subDays(t, 6), to: t }) },
  ]}
/>

{/* Confirm mode */}
<DatePicker mode="range" applyMode="confirm" value={range} onChange={setRange} />

{/* Controlled open state */}
<DatePicker open={open} onOpenChange={setOpen} />

{/* Locale + week start */}
<DatePicker locale={id} weekStartsOn={1} />

{/* Custom display format (date-fns pattern) */}
<DatePicker displayFormat="yyyy/MM/dd" />`}
      />

      <APIReference sections={datePickerPageAPIReferenceSections} />

      <Changelog entries={datePickerPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const datePickerPageFeatureGridFeatures = [
  {
    title: "Date & Time",
    description:
      'mode="datetime" embeds an inline TimePicker comb next to the calendar — one popover picks both parts.',
    icon: <IconClock className="h-5 w-5" />,
  },
  {
    title: "Typed Entry",
    description:
      "editable parses locale formats and ISO dates, validates bounds and shows inline errors.",
    icon: <IconCalendar className="h-5 w-5" />,
  },
  {
    title: "Form-Ready",
    description:
      "name emits hidden yyyy-MM-dd inputs (from/to in range mode) for form actions.",
    icon: <IconForms className="h-5 w-5" />,
  },
  {
    title: "Responsive",
    description:
      "Anchored popover on desktop that flips instead of overflowing; bottom sheet with preset chips on mobile.",
    icon: <IconClock className="h-5 w-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const datePickerPageDemoTabsTabs = [
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
    value: "datetime",
    label: "Date & Time",
    demo: (
      <DemoWrapper
        title="Date & Time Selection"
        description={
          'mode="datetime": day click sets the date part (popover stays open); the time comb updates the trigger. Note: range + time is not supported — time applies to single picks only.'
        }
        code={dateTimeCode}
      >
        <DateTimeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "datetime-form",
    label: "Date & Time (form)",
    demo: (
      <DemoWrapper
        title="Datetime Form Integration"
        description="Hidden input serializes as ISO yyyy-MM-dd'T'HH:mm:ss; second granularity adds the seconds column."
        code={dateTimeFormCode}
      >
        <DateTimeFormDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "form",
    label: "Form",
    demo: (
      <DemoWrapper
        title="Form Integration"
        description="Hidden inputs serialize as yyyy-MM-dd; submit to see the payload."
        code={formCode}
      >
        <FormDemo />
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
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const datePickerPageKeyboardShortcutsShortcuts = [
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
  { keys: "Escape", description: "Close the popover" },
  {
    keys: "Alt + ArrowDown",
    description: "Open the calendar from the typed input",
  },
  {
    keys: "Tab (in popover)",
    description:
      "Datetime mode: move between the calendar and the time columns",
  },
  {
    keys: "Day click (datetime)",
    description:
      "Sets the date part but never closes the popover — use Escape or Apply",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const datePickerPageAPIReferenceSections = [
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
        description:
          "Close after a complete selection in immediate mode. Ignored in datetime mode (always false).",
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
    title: 'DatePicker mode="datetime"',
    props: [
      {
        prop: "mode",
        type: "'datetime'",
        default: "required",
        description:
          "Single date + time-of-day in one popover (calendar + inline TimePicker comb).",
      },
      {
        prop: "value / onChange",
        type: "Date / (value: Date | undefined) => void",
        default: "undefined",
        description:
          "One Date carries both parts; day click keeps the current time-of-day (00:00 when none).",
      },
      {
        prop: "granularity",
        type: "'minute' | 'second'",
        default: "'minute'",
        description: "Granularity of the embedded TimePicker.",
      },
      {
        prop: "hourCycle",
        type: "12 | 24",
        default: "24",
        description: "Hour cycle of the embedded TimePicker.",
      },
      {
        prop: "timeFormat",
        type: "string (date-fns)",
        default: '"HH:mm" / "HH:mm:ss"',
        description: "Time part of the trigger label.",
      },
      {
        prop: "editable",
        type: "boolean",
        default: "false",
        description:
          'Typed entry accepts date+time patterns ("P p", "PP pp", ISO). Without a time part, the current time-of-day is kept.',
      },
      {
        prop: "name",
        type: "string",
        default: "undefined",
        description:
          "Hidden input serialized as ISO \"yyyy-MM-dd'T'HH:mm:ss\".",
      },
      {
        prop: "closeOnSelect",
        type: "boolean",
        default: "ignored",
        description:
          "Hard-coded false in datetime mode: a day click keeps the popover open so time can follow; close via Escape or Apply.",
      },
      {
        prop: "minTime / maxTime / disabledTimes",
        type: "—",
        default: "—",
        description:
          "Pass constraints to the TimePicker via your own composition if needed; minTime/maxTime are not exposed on DatePicker because a datetime min/max crossing midnight is not representable.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const datePickerPageChangelogEntries = [
  {
    version: "v2.1.0",
    date: "26 October 2026",
    changes: [
      {
        type: "added",
        title: 'mode="datetime"',
        description:
          "Single date + time-of-day picking in one popover: inline TimePicker comb next to the calendar, ISO datetime hidden inputs, datetime typed-entry patterns. Day clicks never close the popover in this mode; time-only edits keep the date part.",
      },
      {
        type: "added",
        title: "TimePicker component",
        description:
          "Standalone comb-style time picker (see its own page). Not imported by this demo — linked for discovery.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "24 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Prop union + removed CSS import",
        description:
          "value/onChange are typed per mode, and 'react-day-picker/style.css' plus the old .rdp-* overrides are gone. The popup is now a native popover element styled entirely with Tailwind utilities.",
      },
      {
        type: "changed",
        title: "Native Popover API popup",
        description:
          "Top layer, light dismiss, Escape and focus return come from the platform — no document-level listeners. CSS anchor positioning tethers the popup to the trigger and flips when it would overflow; small screens get a bottom sheet with preset chips.",
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
          "name emits hidden yyyy-MM-dd inputs (name_from/name_to in range mode) that work with React 19 form actions; timeZone moves 'Today', presets and parsing into any IANA zone.",
      },
      {
        type: "fixed",
        title: "Interaction bugs",
        description:
          "The trigger is a real button (no nested interactive content); pending confirm-mode changes are captured once on open instead of being reset by value identity; 'Last 7 days' is actually 7 days and 'This month' no longer includes future days ('Month to date', 'Last month', 'Year to date' added); out-of-range presets disable themselves and the active one shows aria-pressed; Apply requires a complete range.",
      },
      {
        type: "fixed",
        title: "Range hover preview and booking second-click",
        description:
          "Hovering the end date after picking a start now paints the live range band (DayPicker v10 dropped v9's hover modifiers). Days that cannot complete the range — spans crossing disabled/booked days or exceeding maxNights — are disabled up front, so the second click always completes the range and closes the picker instead of silently restarting it. The popover also syncs from beforetoggle (toggle fires after the open transition, which stalls on backgrounded tabs and left the calendar unmounted while the popover looked open).",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
