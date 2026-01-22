import * as React from "react"
import { IconCalendar, IconCalendarEvent, IconClock } from "@tabler/icons-react"
import { DatePicker } from "@/components/ui/date-picker"
import { format, addDays } from "date-fns"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

function SingleDateDemo() {
  const [date, setDate] = React.useState<Date | undefined>()
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
  )
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
}`

function DateRangeDemo() {
  const [range, setRange] = React.useState<{
    from?: Date
    to?: Date
  }>()
  return (
    <div className="max-w-xs">
      <DatePicker
        mode="range"
        value={range}
        onChange={(d) => setRange(d as { from?: Date; to?: Date })}
        placeholder="Select date range"
      />
      {range?.from && (
        <p className="text-sm text-muted-foreground mt-2">
          From: {format(range.from, "PPP")}
          {range.to && ` — To: ${format(range.to, "PPP")}`}
        </p>
      )}
    </div>
  )
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
}`

function WithoutPresetsDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker
        mode="single"
        placeholder="No presets"
        showPresets={false}
      />
    </div>
  )
}

const withoutPresetsCode = `<DatePicker
  mode="single"
  placeholder="No presets"
  showPresets={false}
/>`

function DisabledDemo() {
  return (
    <div className="max-w-xs">
      <DatePicker mode="single" placeholder="Disabled picker" disabled />
    </div>
  )
}

const disabledCode = `<DatePicker mode="single" placeholder="Disabled picker" disabled />`

function DateConstraintsDemo() {
  return (
    <div className="max-w-xs space-y-4">
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
      />
    </div>
  )
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
/>`

function SizeVariantsDemo() {
  return (
    <div className="space-y-4">
      <DatePicker mode="single" size="sm" placeholder="Small date picker" />
      <DatePicker mode="single" size="default" placeholder="Default date picker" />
      <DatePicker mode="single" size="lg" placeholder="Large date picker" />
    </div>
  )
}

const sizeVariantsCode = `<DatePicker mode="single" size="sm" placeholder="Small" />
<DatePicker mode="single" size="default" placeholder="Default" />
<DatePicker mode="single" size="lg" placeholder="Large" />`

function StyleVariantsDemo() {
  return (
    <div className="space-y-4">
      <DatePicker
        mode="single"
        variant="default"
        placeholder="Default variant"
      />
      <DatePicker
        mode="single"
        variant="outline"
        placeholder="Outline variant"
      />
      <DatePicker
        mode="single"
        variant="ghost"
        placeholder="Ghost variant"
      />
    </div>
  )
}

const styleVariantsCode = `<DatePicker mode="single" variant="default" />
<DatePicker mode="single" variant="outline" />
<DatePicker mode="single" variant="ghost" />`

function ApplyModeDemo() {
  const [date, setDate] = React.useState<Date | undefined>()
  const [range, setRange] = React.useState<{
    from?: Date
    to?: Date
  }>()
  return (
    <div className="space-y-6">
      <DatePicker
        mode="single"
        value={date}
        onChange={(d) => setDate(d as Date)}
        placeholder="Pick a date (immediate)"
        applyMode="immediate"
      />
      <DatePicker
        mode="single"
        value={date}
        onChange={(d) => setDate(d as Date)}
        placeholder="Pick a date (confirm mode)"
        applyMode="confirm"
      />
      {date && (
        <p className="text-sm text-muted-foreground">
          Selected: {format(date, "PPP")}
        </p>
      )}
      <DatePicker
        mode="range"
        value={range}
        onChange={(d) => setRange(d as { from?: Date; to?: Date })}
        placeholder="Select date range (confirm mode)"
        applyMode="confirm"
      />
      {range?.from && (
        <p className="text-sm text-muted-foreground">
          From: {format(range.from, "PPP")}
          {range.to && ` — To: ${format(range.to, "PPP")}`}
        </p>
      )}
    </div>
  )
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
/>`

export default function DatePickerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="DatePicker"
        description="Date selection component with presets, date ranges, and various customization options."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Flexible Selection",
            description: "Single date and date range modes with immediate or confirm apply options.",
            icon: <IconCalendar className="h-5 w-5" />,
          },
          {
            title: "Customizable",
            description: "Size variants, style variants, min/max date constraints, and configurable presets.",
            icon: <IconCalendarEvent className="h-5 w-5" />,
          },
          {
            title: "Accessible",
            description: "Full keyboard navigation, ARIA attributes, and screen reader support.",
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
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "Tab / Shift + Tab", description: "Navigate between focusable elements" },
          { keys: "Arrow Keys", description: "Navigate between days/months/years" },
          { keys: "Home", description: "Go to first day of month" },
          { keys: "End", description: "Go to last day of month" },
          { keys: "Page Up", description: "Go to previous month" },
          { keys: "Page Down", description: "Go to next month" },
          { keys: "Enter / Space", description: "Select focused day" },
          { keys: "Escape", description: "Close the popover" },
        ]}
      />

      <UsageBlock
        code={`import { DatePicker } from "@/components/ui/date-picker"

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
<DatePicker applyMode="confirm" />`}
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
              {
                prop: "ariaLabel",
                type: "string",
                default: "undefined",
                description: "Custom ARIA label for accessibility.",
              },
              {
                prop: "className",
                type: "string",
                default: "undefined",
                description: "Additional CSS classes for the container.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
