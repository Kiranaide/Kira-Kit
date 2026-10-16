import * as React from "react";
import {
  IconCalendar,
  IconCalendarEvent,
  IconClock,
} from "@tabler/icons-react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { Calendar } from "@/components/ui/calendar";
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
} from "@/components/docs";
import { Label } from "@/components/ui/label";

function SingleDateDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="max-w-xs">
      <DatePicker
        mode="single"
        value={date}
        onChange={(d) => setDate(d as Date)}
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
        onChange={(d) => setRange(d as DateRange | undefined)}
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
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

export function DateRangeDemo() {
  const [range, setRange] = useState<{
    from?: Date
    to?: Date
  }>()

  return (
    <DatePicker
      mode="range"
      value={range}
      onChange={setRange}
      placeholder="Select date range"
    />
  )
}`;

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
  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Only future dates (from today)
        </Label>
        <DatePicker
          mode="single"
          placeholder="Select future date"
          minDate={new Date()}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Only past dates (up to today)
        </Label>
        <DatePicker
          mode="single"
          placeholder="Select past date"
          maxDate={new Date()}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Next 7 days only
        </Label>
        <DatePicker
          mode="single"
          placeholder="Select within 7 days"
          minDate={new Date()}
          maxDate={addDays(new Date(), 7)}
        />
      </div>
    </div>
  );
}

const dateConstraintsCode = `import { addDays } from "date-fns"

<DatePicker
  mode="single"
  placeholder="Select future date"
  minDate={new Date()}
/>

<DatePicker
  mode="single"
  placeholder="Select past date"
  maxDate={new Date()}
/>

<DatePicker
  mode="single"
  placeholder="Select within 7 days"
  minDate={new Date()}
  maxDate={addDays(new Date(), 7)}
/>`;

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
  const [date, setDate] = React.useState<Date | undefined>();
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Immediate (Default) - Applies on selection
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            value={date}
            onChange={(d) => setDate(d as Date)}
            placeholder="Pick a date (immediate)"
            applyMode="immediate"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Confirm Mode - Requires Apply button click
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="single"
            value={date}
            onChange={(d) => setDate(d as Date)}
            placeholder="Pick a date (confirm mode)"
            applyMode="confirm"
          />
        </div>
        {date && (
          <p className="text-sm text-muted-foreground">
            Selected: {format(date, "PPP")}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Select a date then click "Apply" to confirm, or "Cancel" to reset.
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Confirm Mode with Date Range
        </Label>
        <div className="max-w-xs">
          <DatePicker
            mode="range"
            value={range as DateRange | undefined}
            onChange={(d) => setRange(d as DateRange | undefined)}
            placeholder="Select date range (confirm mode)"
            applyMode="confirm"
          />
        </div>
        {range?.from && (
          <p className="text-sm text-muted-foreground">
            From: {format(range.from, "PPP")}
            {range.to && ` — To: ${format(range.to, "PPP")}`}
          </p>
        )}
      </div>
    </div>
  );
}

const applyModeCode = `<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  applyMode="immediate"
/>

<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  applyMode="confirm"
/>

<DatePicker
  mode="range"
  value={range}
  onChange={setRange}
  applyMode="confirm"
/>`;

function BasicCalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg inline-block">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => setDate(d as Date)}
        />
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

// function MonthPickerDemo() {
//   const [date, setDate] = React.useState<Date | undefined>()
//   return (
//     <div className="space-y-4">
//       <div className="inline-block">
//         <MonthPicker
//           mode="single"
//           selected={date}
//           onSelect={(d) => setDate(d as Date)}
//         />
//       </div>
//       {date && (
//         <p className="text-sm text-muted-foreground">
//           Selected: {format(date, "MMMM yyyy")}
//         </p>
//       )}
//     </div>
//   )
// }

// const monthPickerCode = `import { useState } from "react"
// import { MonthPicker } from "@/components/ui/calendar"
// import { format } from "date-fns"

// export function MonthPickerDemo() {
//   const [date, setDate] = useState<Date | undefined>()

//   return (
//     <MonthPicker
//       mode="single"
//       selected={date}
//       onSelect={setDate}
//     />
//   )
// }`

// function YearPickerDemo() {
//   const [year, setYear] = React.useState<number | undefined>()
//   return (
//     <div className="space-y-4">
//       <div className="inline-block">
//         <YearPicker
//           mode="single"
//           selected={year}
//           onSelect={(y) => setYear(y as number)}
//         />
//       </div>
//       {year && (
//         <p className="text-sm text-muted-foreground">
//           Selected: {year}
//         </p>
//       )}
//     </div>
//   )
// }

// const yearPickerCode = `import { useState } from "react"
// import { YearPicker } from "@/components/ui/calendar"

// export function YearPickerDemo() {
//   const [year, setYear] = useState<number | undefined>()

//   return (
//     <YearPicker
//       mode="single"
//       selected={year}
//       onSelect={setYear}
//     />
//   )
// }`

export default function CalendarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Date Picker & Calendar"
        description="Date selection components with presets, month/year navigation, and various customization options."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Flexible Selection",
            description:
              "Single date and date range modes with immediate or confirm apply options.",
            icon: <IconCalendar className="h-5 w-5" />,
          },
          {
            title: "Customizable",
            description:
              "Size variants, style variants, min/max date constraints, and configurable presets.",
            icon: <IconCalendarEvent className="h-5 w-5" />,
          },
          {
            title: "Accessible",
            description:
              "Full keyboard navigation, ARIA attributes, and screen reader support.",
            icon: <IconClock className="h-5 w-5" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="single"
        tabs={[
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
            value: "presets",
            label: "Presets",
            demo: (
              <DemoWrapper
                title="Without Presets"
                description="Disable the presets sidebar for a cleaner look."
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
                title="Disabled State"
                description="Disable the date picker input."
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
                title="Date Constraints (Min/Max)"
                description="Restrict selectable dates using minDate and maxDate."
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
                description="Small, default, and large size options."
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
                description="Default, outline, and ghost variants."
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
            value: "calendar",
            label: "Calendar",
            demo: (
              <DemoWrapper
                title="Standalone Calendar"
                description="Use the Calendar component directly without an input."
                code={basicCalendarCode}
              >
                <BasicCalendarDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "calendar-sizes",
            label: "Calendar Sizes",
            demo: (
              <DemoWrapper
                title="Calendar Size Variants"
                description="Different sizes for the standalone Calendar component."
                code={calendarSizesCode}
              >
                <CalendarSizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "no-today",
            label: "Without Today",
            demo: (
              <DemoWrapper
                title="Calendar Without Today Button"
                description="Hide the Today button from the calendar footer."
                code={calendarWithoutTodayCode}
              >
                <CalendarWithoutTodayDemo />
              </DemoWrapper>
            ),
          },
          // {
          //   value: "month",
          //   label: "Month Picker",
          //   demo: (
          //     <DemoWrapper
          //       title="Month Picker"
          //       description="Select a month from the month grid."
          //       code={monthPickerCode}
          //     >
          //       <MonthPickerDemo />
          //     </DemoWrapper>
          //   ),
          // },
          // {
          //   value: "year",
          //   label: "Year Picker",
          //   demo: (
          //     <DemoWrapper
          //       title="Year Picker"
          //       description="Select a year from the year grid."
          //       code={yearPickerCode}
          //     >
          //       <YearPickerDemo />
          //     </DemoWrapper>
          //   ),
          // },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift + Tab",
            description: "Navigate between focusable elements",
          },
          {
            keys: "Arrow Keys",
            description: "Navigate between days/months/years",
          },
          { keys: "Home", description: "Go to first day/month/year" },
          { keys: "End", description: "Go to last day/month/year" },
          { keys: "Page Up", description: "Go to previous month/year" },
          { keys: "Page Down", description: "Go to next month/year" },
          {
            keys: "Enter / Space",
            description: "Select focused day/month/year",
          },
          { keys: "Escape", description: "Close the popover" },
        ]}
      />

      <UsageBlock
        code={`import { DatePicker } from "@/components/ui/date-picker"
import { Calendar, MonthPicker, YearPicker } from "@/components/ui/calendar"

{/* Single date */}
<DatePicker
  mode="single"
  value={date}
  onChange={setDate}
  placeholder="Pick a date"
/>

{/* Date range */}
<DatePicker
  mode="range"
  value={{ from: startDate, to: endDate }}
  onChange={setDateRange}
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

{/* Calendar with custom size */}
<Calendar mode="single" size="lg" />

{/* Calendar without Today button */}
<Calendar mode="single" showTodayButton={false} />

{/* Month Picker */}
<MonthPicker
  mode="single"
  selected={monthDate}
  onSelect={setMonthDate}
/>

{/* Year Picker */}
<YearPicker
  mode="single"
  selected={year}
  onSelect={setYear}
/>`}
      />

      <APIReference
        sections={[
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
                type: "Date | { from?: Date; to?: Date }",
                default: "undefined",
                description: "Currently selected date or date range.",
              },
              {
                prop: "onChange",
                type: "(value: Date | { from?: Date; to?: Date }) => void",
                default: "undefined",
                description: "Callback when selection changes.",
              },
              {
                prop: "placeholder",
                type: "string",
                default: "'Select date'",
                description: "Placeholder text for the input field.",
              },
              {
                prop: "showPresets",
                type: "boolean",
                default: "true",
                description: "Show/hide the presets sidebar.",
              },
              {
                prop: "minDate",
                type: "Date",
                default: "undefined",
                description: "Minimum selectable date.",
              },
              {
                prop: "maxDate",
                type: "Date",
                default: "undefined",
                description: "Maximum selectable date.",
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
                description: "Style variant of the input field.",
              },
              {
                prop: "applyMode",
                type: "'immediate' | 'confirm'",
                default: "'immediate'",
                description: "Apply mode for date selection.",
              },
              {
                prop: "disabled",
                type: "boolean",
                default: "false",
                description: "Disable the date picker input.",
              },
            ],
          },
          {
            title: "Calendar",
            props: [
              {
                prop: "mode",
                type: "'single'",
                default: "'single'",
                description: "Selection mode for the calendar.",
              },
              {
                prop: "selected",
                type: "Date",
                default: "undefined",
                description: "Currently selected date.",
              },
              {
                prop: "onSelect",
                type: "(date: Date) => void",
                default: "undefined",
                description: "Callback when a date is selected.",
              },
              {
                prop: "size",
                type: "'sm' | 'default' | 'lg'",
                default: "'default'",
                description: "Size variant of the calendar.",
              },
              {
                prop: "showTodayButton",
                type: "boolean",
                default: "true",
                description: "Show/hide the Today button in the footer.",
              },
            ],
          },
          {
            title: "MonthPicker",
            props: [
              {
                prop: "mode",
                type: "'single'",
                default: "'single'",
                description: "Selection mode for the month picker.",
              },
              {
                prop: "selected",
                type: "Date",
                default: "undefined",
                description: "Currently selected month (Date object).",
              },
              {
                prop: "onSelect",
                type: "(date: Date) => void",
                default: "undefined",
                description: "Callback when a month is selected.",
              },
            ],
          },
          {
            title: "YearPicker",
            props: [
              {
                prop: "mode",
                type: "'single'",
                default: "'single'",
                description: "Selection mode for the year picker.",
              },
              {
                prop: "selected",
                type: "number",
                default: "undefined",
                description: "Currently selected year.",
              },
              {
                prop: "onSelect",
                type: "(year: number) => void",
                default: "undefined",
                description: "Callback when a year is selected.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
