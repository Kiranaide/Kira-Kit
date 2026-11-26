import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconClock, IconGauge, IconLayout2 } from "@tabler/icons-react";
import { format } from "date-fns";
import {
  TimePicker,
  timePickerTriggerVariants,
  type TimeGranularity,
} from "@/components/ui/time-picker";
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

function LiveDemo() {
  const [time, setTime] = React.useState<Date | undefined>();

  return (
    <div className="max-w-sm">
      <TimePicker
        value={time}
        onChange={setTime}
        ariaLabel="Appointment time"
      />
      {time && (
        <p className="text-sm text-muted-foreground mt-2">
          Selected:{" "}
          <span data-testid="selected-time">{format(time, "HH:mm")}</span>
        </p>
      )}
    </div>
  );
}

const liveCode = `import { useState } from "react"
import { TimePicker } from "@/components/ui/time-picker"

export function Demo() {
  const [time, setTime] = useState<Date | undefined>()

  return (
    <TimePicker value={time} onChange={setTime} ariaLabel="Appointment time" />
  )
}`;

function InlineDemo() {
  const [time, setTime] = React.useState<Date | undefined>(
    new Date(2026, 0, 1, 9, 30),
  );

  return (
    <div className="max-w-sm">
      <TimePicker popover={false} value={time} onChange={setTime} />
      <p className="text-sm text-muted-foreground mt-2">
        Selected: {time ? format(time, "HH:mm") : "none"}
      </p>
    </div>
  );
}

const inlineCode = `import { TimePicker } from "@/components/ui/time-picker"

// Bare panel, no popover chrome — for embedding in your own surfaces.
<TimePicker popover={false} value={time} onChange={setTime} />

// Variants: "full" (default) | "stepper" | "grid"
<TimePicker popover={false} variant="stepper" value={time} onChange={setTime} />`;

function VariantsDemo() {
  const [grid, setGrid] = React.useState<Date | undefined>();
  const [stepper, setStepper] = React.useState<Date | undefined>();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          variant=&quot;stepper&quot; — type or step (default)
        </Label>
        <TimePicker
          popover={false}
          variant="stepper"
          value={stepper}
          onChange={setStepper}
        />
        <p className="text-sm text-muted-foreground">
          {stepper ? format(stepper, "HH:mm") : "none"}
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          variant=&quot;grid&quot; — tap a chip or cell
        </Label>
        <TimePicker
          popover={false}
          variant="grid"
          value={grid}
          onChange={setGrid}
        />
        <p className="text-sm text-muted-foreground">
          {grid ? format(grid, "HH:mm") : "none"}
        </p>
      </div>
    </div>
  );
}

const variantsCode = `<TimePicker value={time} onChange={setTime} /> {/* default: stepper */}
<TimePicker variant="grid" value={time} onChange={setTime} />
<TimePicker variant="full" /> {/* stepper stacked above grid */}`;

function GranularityDemo() {
  const [minute, setMinute] = React.useState<Date | undefined>();
  const [second, setSecond] = React.useState<Date | undefined>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Minute granularity
        </Label>
        <TimePicker value={minute} onChange={setMinute} />
        <p className="text-sm text-muted-foreground">
          {minute ? format(minute, "HH:mm") : "none"}
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Second granularity
        </Label>
        <TimePicker value={second} onChange={setSecond} granularity="second" />
        <p className="text-sm text-muted-foreground">
          {second ? format(second, "HH:mm:ss") : "none"}
        </p>
      </div>
    </div>
  );
}

const granularityCode = `<TimePicker value={time} onChange={setTime} />
<TimePicker value={time} onChange={setTime} granularity="second" />`;

function HourCycleDemo() {
  const [h24, setH24] = React.useState<Date | undefined>();
  const [h12, setH12] = React.useState<Date | undefined>();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          24-hour (default)
        </Label>
        <TimePicker value={h24} onChange={setH24} hourCycle={24} />
        <p className="text-sm text-muted-foreground">
          {h24 ? format(h24, "HH:mm") : "none"}
        </p>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          12-hour with AM/PM
        </Label>
        <TimePicker value={h12} onChange={setH12} hourCycle={12} />
        <p className="text-sm text-muted-foreground">
          {h12 ? format(h12, "h:mm a") : "none"}
        </p>
      </div>
    </div>
  );
}

const hourCycleCode = `<TimePicker hourCycle={24} />
<TimePicker hourCycle={12} />`;

function StepsDemo() {
  const [time, setTime] = React.useState<Date | undefined>();

  return (
    <div className="max-w-xs space-y-2">
      <TimePicker
        value={time}
        onChange={setTime}
        hourStep={2}
        minuteStep={15}
        minTime="09:00"
        maxTime="18:00"
        disabledTimes={["12:00", "12:15", "12:30", "12:45"]}
        ariaLabel="Meeting slot"
      />
      <p className="text-sm text-muted-foreground">
        Even hours, quarter-hour slots, 09:00–18:00, lunch blocked.{" "}
        {time && `Selected: ${format(time, "HH:mm")}`}
      </p>
    </div>
  );
}

const stepsCode = `<TimePicker
  hourStep={2}
  minuteStep={15}
  minTime="09:00"
  maxTime="18:00"
  disabledTimes={["12:00", "12:15", "12:30", "12:45"]}
/>`;

function SizesDemo() {
  const [sm, setSm] = React.useState<Date | undefined>();
  const [md, setMd] = React.useState<Date | undefined>();
  const [lg, setLg] = React.useState<Date | undefined>();

  return (
    <div className="max-w-sm space-y-4">
      <TimePicker size="sm" value={sm} onChange={setSm} placeholder="Small" />
      <TimePicker
        size="default"
        value={md}
        onChange={setMd}
        placeholder="Default"
      />
      <TimePicker size="lg" value={lg} onChange={setLg} placeholder="Large" />
    </div>
  );
}

const sizesCode = `<TimePicker size="sm" />
<TimePicker size="default" />
<TimePicker size="lg" />`;

function StatesDemo() {
  const [empty, setEmpty] = React.useState<Date | undefined>();

  const [filled, setFilled] = React.useState<Date | undefined>(
    new Date(2026, 0, 1, 14, 5),
  );

  return (
    <div className="grid max-w-md gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Disabled
        </Label>
        <TimePicker value={filled} onChange={setFilled} disabled />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Invalid
        </Label>
        <TimePicker value={filled} onChange={setFilled} invalid />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Required
        </Label>
        <TimePicker value={empty} onChange={setEmpty} required />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Clearable
        </Label>
        <TimePicker value={filled} onChange={setFilled} />
      </div>
    </div>
  );
}

const statesCode = `<TimePicker disabled />
<TimePicker invalid />
<TimePicker required />
<TimePicker value={time} onChange={setTime} /> {/* X to clear */}`;

export default function TimePickerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Time Picker"
        description="A time-of-day picker with quick-pick presets, tappable hour/minute cell grids and typeable stepper fields — in one anchored popover or as an embeddable inline panel. Hand-rolled on the native Popover API (no Base UI time primitive exists)."
        version="v1.0.0"
      />

      <FeatureGrid features={timePickerPageFeatureGridFeatures} />

      <DemoTabs defaultValue="live" tabs={timePickerPageDemoTabsTabs} />

      <KeyboardShortcuts shortcuts={timePickerPageKeyboardShortcutsShortcuts} />

      <UsageBlock
        code={`import { TimePicker } from "@/components/ui/time-picker"

{/* Popover (default) */}
<TimePicker value={time} onChange={setTime} />

{/* Seconds + 12-hour clock */}
<TimePicker granularity="second" hourCycle={12} value={time} onChange={setTime} />

{/* Steps, window, blocked slots */}
<TimePicker hourStep={2} minuteStep={15} minTime="09:00" maxTime="18:00"
  disabledTimes={["12:00"]} />

{/* Inline for embedding */}
<TimePicker popover={false} value={time} onChange={setTime} />

{/* Custom display format (date-fns pattern) */}
<TimePicker displayFormat="HH:mm" />`}
      />

      <APIReference sections={timePickerPageAPIReferenceSections} />

      <Changelog entries={timePickerPageChangelogEntries} />
    </ComponentPage>
  );
}

export { timePickerTriggerVariants };

export type { TimeGranularity };

// Static demo metadata stays co-located and follows its source constants.
const timePickerPageFeatureGridFeatures = [
  {
    title: "Quick Presets",
    description:
      "Common times as one-tap chips; hour and minute tappable cell grids — no typing needed.",
    icon: <IconClock className="h-5 w-5" />,
  },
  {
    title: "Typeable Steppers",
    description:
      "Large +/- fields accept raw digits, ArrowUp/Down and Enter; seconds column via granularity.",
    icon: <IconGauge className="h-5 w-5" />,
  },
  {
    title: "Inline + Popover",
    description:
      "Anchored popover on a trigger by default, or popover={false} for a bare panel (DatePicker uses it).",
    icon: <IconLayout2 className="h-5 w-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const timePickerPageDemoTabsTabs = [
  {
    value: "live",
    label: "Live Demo",
    demo: (
      <DemoWrapper
        title="Popover Time Picker"
        description="Click the trigger or pick with arrow keys; the X clears."
        code={liveCode}
      >
        <LiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "inline",
    label: "Inline",
    demo: (
      <DemoWrapper
        title="Inline Panel"
        description="The same panel without popover chrome."
        code={inlineCode}
      >
        <InlineDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Panel Variants"
        description='variant="stepper" (default) shows the typeable fields; "grid" shows quick chips + cell grids; "full" stacks both.'
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "granularity",
    label: "Granularity",
    demo: (
      <DemoWrapper
        title="Minute vs Second"
        description="granularity='second' adds a seconds column."
        code={granularityCode}
      >
        <GranularityDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "hour-cycle",
    label: "Hour Cycle",
    demo: (
      <DemoWrapper
        title="24-hour vs 12-hour"
        description="hourCycle={12} adds an AM/PM toggle on the right side of the fields."
        code={hourCycleCode}
      >
        <HourCycleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "steps",
    label: "Steps & Constraints",
    demo: (
      <DemoWrapper
        title="Steps, Window and Disabled Times"
        description="hourStep/minuteStep thin the columns; minTime/maxTime bound them inclusively."
        code={stepsCode}
      >
        <StepsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="sm, default and lg trigger and comb sizing."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Component States"
        description="Disabled, invalid, required and clearable."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const timePickerPageKeyboardShortcutsShortcuts = [
  {
    keys: "ArrowUp / ArrowDown",
    description: "Step the focused stepper field ±step",
  },
  {
    keys: "Enter",
    description: "Commit a typed value",
  },
  { keys: "Tab", description: "Move between fields and cells" },
  {
    keys: "Click",
    description: "Tap chips, hour/minute cells, +/- steppers",
  },
  {
    keys: "Escape",
    description: "Close the popover, focus the trigger",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const timePickerPageAPIReferenceSections = [
  {
    title: "TimePicker",
    props: [
      {
        prop: "value",
        type: "Date",
        default: "undefined",
        description:
          "Controlled value; time-of-day is taken from hours/minutes/seconds.",
      },
      {
        prop: "onChange",
        type: "(value: Date | undefined) => void",
        default: "undefined",
        description:
          "Called with a new Date on any chip/cell/stepper change, or undefined on clear.",
      },
      {
        prop: "variant",
        type: "'stepper' | 'grid' | 'full'",
        default: "'stepper'",
        description:
          "Panel content: stepper fields ('stepper', default), presets + cell grids ('grid'), or stepper stacked above grids ('full').",
      },
      {
        prop: "granularity",
        type: "'minute' | 'second'",
        default: "'minute'",
        description: "Adds a seconds stepper field when 'second'.",
      },
      {
        prop: "hourStep / minuteStep / secondStep",
        type: "number",
        default: "1",
        description: "Value step per field and cell grid.",
      },
      {
        prop: "hourCycle",
        type: "12 | 24",
        default: "24",
        description:
          "12 swaps the hour cells for an AM/PM toggle to the right of the fields.",
      },
      {
        prop: "minTime / maxTime",
        type: "string",
        default: "undefined",
        description: 'Inclusive bounds, "HH:mm" or "HH:mm:ss".',
      },
      {
        prop: "disabledTimes",
        type: "string[]",
        default: "undefined",
        description: 'Exact "HH:mm"(:ss) matches that can\'t be picked.',
      },
      {
        prop: "presets",
        type: "string[]",
        default: '["09:00", "12:30", "17:00", "21:00"]',
        description: 'Quick-pick chips, "HH:mm".',
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the trigger and panel.",
      },
      {
        prop: "placeholder",
        type: "string",
        default: '"Select time"',
        description: "Trigger label when no value is set.",
      },
      {
        prop: "displayFormat",
        type: "string (date-fns)",
        default: '"HH:mm" / "HH:mm:ss"',
        description: "Trigger label pattern.",
      },
      {
        prop: "popover",
        type: "boolean",
        default: "true",
        description: "false renders the bare panel without trigger/popover.",
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
        default: '"Time"',
        description: "Accessible name prefix for the trigger.",
      },
      {
        prop: "size / variant",
        type: "'sm' | 'default' | 'lg' / 'default' | 'outline' | 'ghost'",
        default: "'default'",
        description: "Trigger sizing and style variants.",
      },
      {
        prop: "id",
        type: "string",
        default: "auto",
        description: "Trigger element id.",
      },
      {
        prop: "className",
        type: "string",
        default: "undefined",
        description: "Root (or comb grid, when inline) class.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const timePickerPageChangelogEntries = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "changed",
        title: "Aligned popup onto kit Popover seam",
        description:
          "Migrated TimePicker's desktop popup from raw @base-ui/react/popover onto kit Popover, PopoverTrigger, and PopoverContent from @/components/ui/popover.",
      },
    ],
  },
  {
    version: "v1.0.1",
    date: "20 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Mobile bottom sheet centering and motion",
        description:
          "Fixed-width panels center in the full-width sheet; the sheet shares the DatePicker's slide-up curve, faster exit, and overscroll containment.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "26 October 2026",
    changes: [
      {
        type: "added",
        title: "TimePicker component",
        description:
          "Comb-style time-of-day picker: listbox columns with keyboard roving, digit typeahead, granularity/step control, 12/24-hour cycles, inclusive min/max windows, disabled times, inline mode, native Popover API with CSS anchor positioning.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
