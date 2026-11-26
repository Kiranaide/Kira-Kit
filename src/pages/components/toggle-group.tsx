import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
// oxlint-disable anti-slop/no-shape-in-symbol-names -- `shapeMorph` is the Material 3 Expressive term of art; the demo mirrors the component's prop name.
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconBold,
  IconItalic,
  IconUnderline,
  IconAccessible,
  IconPalette,
  IconStack2,
} from "@tabler/icons-react";
import {
  ToggleGroup,
  ToggleGroupItem,
  KiraToggleGroup,
} from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
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

function MultipleSelectionDemo() {
  return (
    <ToggleGroup aria-label="Text formatting" multiple defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconBold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconItalic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconUnderline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

const multipleSelectionCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

export function MultipleSelectionDemo() {
  return (
    <ToggleGroup aria-label="Text formatting" multiple defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <IconBold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <IconItalic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <IconUnderline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function SingleSelectionDemo() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <IconAlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <IconAlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <IconAlignRight className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Align justify">
        <IconAlignJustified className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

const singleSelectionCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified } from "@tabler/icons-react"

export function SingleSelectionDemo() {
  return (
    <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <IconAlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <IconAlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <IconAlignRight className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Align justify">
        <IconAlignJustified className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Outline</p>
        <ToggleGroup
          aria-label="Text alignment"
          variant="outline"
          defaultValue={["left"]}
        >
          <ToggleGroupItem value="left" aria-label="Align left">
            <IconAlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align center">
            <IconAlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align right">
            <IconAlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Segment (iOS Style)</p>
        <ToggleGroup
          aria-label="View mode"
          variant="segment"
          defaultValue={["grid"]}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Pills</p>
        <ToggleGroup
          aria-label="Filter options"
          variant="pills"
          multiple
          defaultValue={["all"]}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="active">Active</ToggleGroupItem>
          <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const variantsCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from "@tabler/icons-react"

export function VariantsDemo() {
  return (
    <div className="space-y-6">
      <ToggleGroup
        aria-label="Text alignment"
        variant="outline"
        defaultValue={["left"]}
      >
        <ToggleGroupItem value="left" aria-label="Align left">
          <IconAlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <IconAlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <IconAlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        aria-label="View mode"
        variant="segment"
        defaultValue={["grid"]}
      >
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="board">Board</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        aria-label="Filter options"
        variant="pills"
        multiple
        defaultValue={["all"]}
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="completed">Completed</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Small</p>
        <ToggleGroup aria-label="Small alignment" variant="outline" size="sm">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <ToggleGroup aria-label="Default alignment" variant="outline">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Large</p>
        <ToggleGroup aria-label="Large alignment" variant="outline" size="lg">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const sizesCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function SizesDemo() {
  return (
    <div className="space-y-4">
      <ToggleGroup aria-label="Small alignment" variant="outline" size="sm">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup aria-label="Default alignment" variant="outline">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup aria-label="Large alignment" variant="outline" size="lg">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function VerticalDemo() {
  return (
    <ToggleGroup
      aria-label="Vertical options"
      variant="outline"
      orientation="vertical"
    >
      <ToggleGroupItem value="top">Top</ToggleGroupItem>
      <ToggleGroupItem value="middle">Middle</ToggleGroupItem>
      <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
    </ToggleGroup>
  );
}

const verticalCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function VerticalDemo() {
  return (
    <ToggleGroup
      aria-label="Vertical options"
      variant="outline"
      orientation="vertical"
    >
      <ToggleGroupItem value="top">Top</ToggleGroupItem>
      <ToggleGroupItem value="middle">Middle</ToggleGroupItem>
      <ToggleGroupItem value="bottom">Bottom</ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function ControlledDemo() {
  const [value, setValue] = useState<string[]>(["bold"]);

  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="Text formatting"
        multiple
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconItalic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="text-sm text-muted-foreground">
        Selected: {value.length > 0 ? value.join(", ") : "None"}
      </div>
    </div>
  );
}

const controlledCode = `import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

export function ControlledDemo() {
  const [value, setValue] = useState<string[]>(["bold"])

  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="Text formatting"
        multiple
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <IconBold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <IconItalic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <IconUnderline className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="text-sm text-muted-foreground">
        Selected: {value.length > 0 ? value.join(", ") : "None"}
      </div>
    </div>
  )
}`;

function ColorVariantsDemo() {
  return (
    <ToggleGroup
      aria-label="Filter options"
      variant="pills"
      multiple
      defaultValue={["all"]}
    >
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="active" colorVariant="success">
        Active
      </ToggleGroupItem>
      <ToggleGroupItem value="warning" colorVariant="warning">
        Warning
      </ToggleGroupItem>
      <ToggleGroupItem value="delete" colorVariant="destructive">
        Delete
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

const colorVariantsCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ColorVariantsDemo() {
  return (
    <ToggleGroup
      aria-label="Filter options"
      variant="pills"
      multiple
      defaultValue={["all"]}
    >
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="active" colorVariant="success">
        Active
      </ToggleGroupItem>
      <ToggleGroupItem value="warning" colorVariant="warning">
        Warning
      </ToggleGroupItem>
      <ToggleGroupItem value="delete" colorVariant="destructive">
        Delete
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function DisabledDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Entire group disabled</p>
        <ToggleGroup
          aria-label="Disabled group"
          disabled
          defaultValue={["bold"]}
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <IconBold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <IconItalic className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Individual items disabled
        </p>
        <ToggleGroup
          aria-label="Group with disabled items"
          defaultValue={["left"]}
        >
          <ToggleGroupItem value="left" aria-label="Left">
            <IconAlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Center">
            <IconAlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" disabled aria-label="Right (disabled)">
            <IconAlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const disabledCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconBold, IconItalic } from "@tabler/icons-react"
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from "@tabler/icons-react"

export function DisabledDemo() {
  return (
    <div className="space-y-4">
      <ToggleGroup aria-label="Disabled group" disabled defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <IconBold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <IconItalic className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup aria-label="Group with disabled items" defaultValue={["left"]}>
        <ToggleGroupItem value="left" aria-label="Left">
          <IconAlignLeft className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">
          <IconAlignCenter className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" disabled aria-label="Right (disabled)">
          <IconAlignRight className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function MixedContentDemo() {
  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="View options"
        variant="segment"
        defaultValue={["list"]}
      >
        <ToggleGroupItem value="list" aria-label="List view">
          <IconAlignLeft className="h-4 w-4 mr-1" />
          List
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <IconAlignCenter className="h-4 w-4 mr-1" />
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" aria-label="Kanban view">
          <IconAlignJustified className="h-4 w-4 mr-1" />
          Kanban
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        aria-label="Density"
        variant="pills"
        defaultValue={["comfortable"]}
      >
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
        <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
        <ToggleGroupItem value="spacious">Spacious</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

const mixedContentCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignJustified } from "@tabler/icons-react"

export function MixedContentDemo() {
  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="View options"
        variant="segment"
        defaultValue={["list"]}
      >
        <ToggleGroupItem value="list" aria-label="List view">
          <IconAlignLeft className="h-4 w-4 mr-1" />
          List
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <IconAlignCenter className="h-4 w-4 mr-1" />
          Grid
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" aria-label="Kanban view">
          <IconAlignJustified className="h-4 w-4 mr-1" />
          Kanban
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        aria-label="Density"
        variant="pills"
        defaultValue={["comfortable"]}
      >
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
        <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
        <ToggleGroupItem value="spacious">Spacious</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function OneSelectedAlwaysDemo() {
  const [value, setValue] = useState<string[]>(["day"]);

  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="Date range"
        variant="segment"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-sm text-muted-foreground">
        Selected: {value.join(", ") || "None"} — clicking the active segment
        cannot clear it.
      </p>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          <code>allowEmpty</code> opts out, for filter-style groups
        </p>
        <ToggleGroup aria-label="Optional filter" variant="segment" allowEmpty>
          <ToggleGroupItem value="starred">Starred</ToggleGroupItem>
          <ToggleGroupItem value="mine">Mine</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const oneSelectedAlwaysCode = `import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function OneSelectedAlwaysDemo() {
  const [value, setValue] = useState<string[]>(["day"])

  return (
    <>
      {/* Single-select keeps one segment selected always (default) */}
      <ToggleGroup
        aria-label="Date range"
        variant="segment"
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>

      {/* Opt out for filter-style groups */}
      <ToggleGroup aria-label="Optional filter" variant="segment" allowEmpty>
        <ToggleGroupItem value="starred">Starred</ToggleGroupItem>
        <ToggleGroupItem value="mine">Mine</ToggleGroupItem>
      </ToggleGroup>
    </>
  )
}`;

function SemanticsDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <code>semantics="current"</code> (default) — the active segment gets{" "}
          <code>aria-current="true"</code>, conveying "one of a set"
        </p>
        <ToggleGroup
          aria-label="View mode"
          variant="segment"
          defaultValue={["grid"]}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <code>semantics="radio"</code> — ARIA17-normative for a
          mutually-exclusive set. See the Radio Mode tab for the keyboard
          behaviour.
        </p>
        <ToggleGroup
          aria-label="View mode (radio semantics)"
          variant="segment"
          semantics="radio"
          defaultValue={["grid"]}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <code>semantics="toggle"</code> — on/off buttons with{" "}
          <code>aria-pressed</code>
        </p>
        <ToggleGroup
          aria-label="View mode (toggle semantics)"
          variant="segment"
          semantics="toggle"
          defaultValue={["grid"]}
        >
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Multi-select is always <code>aria-pressed</code> — independent
          toggles, per the APG
        </p>
        <ToggleGroup
          aria-label="Text formatting"
          multiple
          defaultValue={["bold"]}
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <IconBold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <IconItalic className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const semanticsCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

{/* Default: aria-current="true" on the active segment (Primer/eBay model) */}
<ToggleGroup aria-label="View mode" variant="segment" defaultValue={["grid"]}>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>

{/* Opt into aria-pressed on/off semantics */}
<ToggleGroup
  aria-label="View mode"
  variant="segment"
  semantics="toggle"
  defaultValue={["grid"]}
>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>`;

function RadioModeDemo() {
  const [value, setValue] = useState<string[]>(["standard"]);

  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="Shipping speed"
        variant="segment"
        semantics="radio"
        showSelectedIcon
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
        <ToggleGroupItem value="express">Express</ToggleGroupItem>
        <ToggleGroupItem value="overnight">Overnight</ToggleGroupItem>
      </ToggleGroup>
      <p className="text-sm text-muted-foreground">
        Selected: {value.join(", ")}
      </p>
      <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
        <li>
          Tab once to enter the group — the selected segment is the only tab
          stop. Arrow keys move focus <em>and</em> selection
          (selection-follows-focus).
        </li>
        <li>
          The container is <code>role="radiogroup"</code>; each segment is{" "}
          <code>role="radio"</code> with <code>aria-checked</code> — never{" "}
          <code>aria-pressed</code>.
        </li>
        <li>
          A radio group has no "none" state, so <code>allowEmpty</code> is
          ignored: pressing the checked segment keeps it checked.
        </li>
      </ul>
    </div>
  );
}

const radioModeCode = `import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function RadioModeDemo() {
  const [value, setValue] = useState<string[]>(["standard"])

  return (
    <ToggleGroup
      aria-label="Shipping speed"
      variant="segment"
      semantics="radio"
      showSelectedIcon
      value={value}
      onValueChange={setValue}
    >
      <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
      <ToggleGroupItem value="express">Express</ToggleGroupItem>
      <ToggleGroupItem value="overnight">Overnight</ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function FormFieldDemo() {
  const [value, setValue] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [entries, setEntries] = useState<string[] | null>(null);
  const invalid = submitted && value.length === 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        // The proof: read the real FormData the browser built from the DOM.
        setEntries(new FormData(e.currentTarget).getAll("billing").map(String));
      }}
    >
      <ToggleGroup
        aria-label="Billing period"
        variant="segment"
        multiple
        required
        name="billing"
        invalid={invalid}
        errorMessage="Pick a billing period to continue."
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
      </ToggleGroup>
      <Button type="submit" size="sm">
        Submit
      </Button>
      {entries && (
        <pre
          data-slot="formdata-readout"
          className="rounded-md border bg-muted/50 p-3 text-xs"
        >
          formData.getAll("billing") = {JSON.stringify(entries)}
        </pre>
      )}
      <p className="text-xs text-muted-foreground">
        Select both and submit: two separate entries, not one comma-joined
        string. Select none: <code>[]</code> — an empty selection emits no
        hidden input at all, so the key is absent rather than blank.
      </p>
      <p className="text-xs text-muted-foreground">
        Per ARIA21, <code>aria-invalid</code> appears only after validation runs
        — not on mount. <code>required</code> is <code>aria-required</code>{" "}
        only: browsers skip native validation on hidden inputs, so enforce it in
        your submit handler.
      </p>
    </form>
  );
}

const formFieldCode = `import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function FormFieldDemo() {
  const [value, setValue] = useState<string[]>([])
  const [entries, setEntries] = useState<string[] | null>(null)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // name="billing" emits one hidden input per selected value,
        // so getAll returns each value as its own entry.
        setEntries(new FormData(e.currentTarget).getAll("billing").map(String))
      }}
    >
      <ToggleGroup
        aria-label="Billing period"
        variant="segment"
        multiple
        required
        name="billing"
        errorMessage="Pick a billing period to continue."
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
      </ToggleGroup>
      <button type="submit">Submit</button>
      {entries && <pre>{JSON.stringify(entries)}</pre>}
    </form>
  )
}`;

function SelectedIconDemo() {
  return (
    <ToggleGroup
      aria-label="Sort order"
      variant="segment"
      showSelectedIcon
      defaultValue={["newest"]}
    >
      <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
      <ToggleGroupItem value="oldest">Oldest</ToggleGroupItem>
      <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
    </ToggleGroup>
  );
}

const selectedIconCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function SelectedIconDemo() {
  return (
    <ToggleGroup
      aria-label="Sort order"
      variant="segment"
      showSelectedIcon
      defaultValue={["newest"]}
    >
      <ToggleGroupItem value="newest">Newest</ToggleGroupItem>
      <ToggleGroupItem value="oldest">Oldest</ToggleGroupItem>
      <ToggleGroupItem value="popular">Popular</ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function OverflowDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <code>overflowMode="scroll"</code> — segments never wrap; the row
          scrolls instead
        </p>
        <div className="max-w-[260px]">
          <ToggleGroup
            aria-label="Workspace"
            variant="segment"
            overflowMode="scroll"
            defaultValue={["overview"]}
          >
            <ToggleGroupItem value="overview">Overview</ToggleGroupItem>
            <ToggleGroupItem value="activity">Activity</ToggleGroupItem>
            <ToggleGroupItem value="members">Members</ToggleGroupItem>
            <ToggleGroupItem value="settings">Settings</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <code>overflowMode="hideLabels"</code> — collapses to icons, with the
          label kept as the accessible name and shown on hover
        </p>
        <ToggleGroup
          aria-label="Text alignment"
          variant="segment"
          overflowMode="hideLabels"
          defaultValue={["left"]}
        >
          <ToggleGroupItem value="left">
            <IconAlignLeft className="h-4 w-4" />
            Left
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <IconAlignCenter className="h-4 w-4" />
            Center
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <IconAlignRight className="h-4 w-4" />
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

const overflowCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

{/* Never wrap — scroll the row instead */}
<ToggleGroup
  aria-label="Workspace"
  variant="segment"
  overflowMode="scroll"
  defaultValue={["overview"]}
>
  <ToggleGroupItem value="overview">Overview</ToggleGroupItem>
  <ToggleGroupItem value="activity">Activity</ToggleGroupItem>
  <ToggleGroupItem value="members">Members</ToggleGroupItem>
</ToggleGroup>

{/* Collapse to icon-only; the text stays as the accessible name + tooltip */}
<ToggleGroup
  aria-label="Text alignment"
  variant="segment"
  overflowMode="hideLabels"
  defaultValue={["left"]}
>
  <ToggleGroupItem value="left">
    <IconAlignLeft className="h-4 w-4" />
    Left
  </ToggleGroupItem>
  <ToggleGroupItem value="center">
    <IconAlignCenter className="h-4 w-4" />
    Center
  </ToggleGroupItem>
</ToggleGroup>`;

function SlidingIndicatorDemo() {
  const [value, setValue] = useState<string[]>(["week"]);

  return (
    <div className="space-y-4">
      <ToggleGroup
        aria-label="Date range"
        variant="segment"
        slidingIndicator
        value={value}
        onValueChange={setValue}
      >
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
      </ToggleGroup>
      <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
        <li>
          The pill is measured from the pressed item, not guessed from an index,
          so it survives uneven segment widths.
        </li>
        <li>
          Single-select only — a multi-select group has no one active item to
          slide to, so the pill turns itself off.
        </li>
        <li>
          Reduced-motion gated: with the OS setting on, the pill jumps instead
          of sliding. Selection also changes weight and text colour, so it is
          never signalled by the moving fill alone.
        </li>
      </ul>
    </div>
  );
}

const slidingIndicatorCode = `import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function SlidingIndicatorDemo() {
  const [value, setValue] = useState<string[]>(["week"])

  return (
    <ToggleGroup
      aria-label="Date range"
      variant="segment"
      slidingIndicator
      value={value}
      onValueChange={setValue}
    >
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  )
}`;

function GroupStatesInteractiveSection() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Interactive — hover, focus-visible, and pressed states across variants.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          aria-label="States pills"
          variant="pills"
          defaultValue={["a"]}
        >
          <ToggleGroupItem value="a">Selected</ToggleGroupItem>
          <ToggleGroupItem value="b">Default</ToggleGroupItem>
          <ToggleGroupItem value="c">Hover me</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          aria-label="States segment"
          variant="segment"
          defaultValue={["one"]}
        >
          <ToggleGroupItem value="one">One</ToggleGroupItem>
          <ToggleGroupItem value="two">Two</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

function GroupStatesReasonSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Disabled + reason — Tab reaches the anchor; the reason announces via
        aria-label and shows as a tooltip.
      </p>
      <KiraToggleGroup
        aria-label="Disabled demo"
        variant="segment"
        items={[
          { value: "on", label: "Editable" },
          {
            value: "locked",
            label: "Locked",
            disabled: true,
            disabledReason: "Managed by your organization.",
          },
        ]}
        defaultValue={["on"]}
      />
    </div>
  );
}

function GroupStatesLoadingSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Loading — per-item spinner via <code>loading</code>.
      </p>
      <ToggleGroup
        aria-label="Loading demo"
        variant="pills"
        defaultValue={["a"]}
      >
        <ToggleGroupItem value="a">Synced</ToggleGroupItem>
        <ToggleGroupItem value="b" loading>
          Syncing
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function GroupStatesStressSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Stress — narrow container with overflowMode="scroll" and a very long
        label.
      </p>
      <div className="w-[320px]">
        <ToggleGroup
          aria-label="Overflow states"
          variant="segment"
          overflowMode="scroll"
          defaultValue={["first"]}
        >
          <ToggleGroupItem value="first">First</ToggleGroupItem>
          <ToggleGroupItem value="second">Second</ToggleGroupItem>
          <ToggleGroupItem value="third">Third</ToggleGroupItem>
          <ToggleGroupItem value="fourth">Fourth</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

function GroupStatesDemo() {
  return (
    <div className="space-y-6">
      <GroupStatesInteractiveSection />
      <GroupStatesReasonSection />
      <GroupStatesLoadingSection />
      <GroupStatesStressSection />
    </div>
  );
}

const statesCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { KiraToggleGroup } from "@/components/ui/toggle-group"

{/* States matrix */}
<ToggleGroup aria-label="States" variant="pills" defaultValue={["a"]}>
  <ToggleGroupItem value="a">Selected</ToggleGroupItem>
  <ToggleGroupItem value="b">Default</ToggleGroupItem>
</ToggleGroup>

{/* Disabled + reason: keyboard-reachable (Tab) */}
<KiraToggleGroup
  aria-label="Disabled demo"
  items={[
    { value: "on", label: "Editable" },
    { value: "locked", label: "Locked", disabled: true, disabledReason: "Managed by your organization." },
  ]}
/>`;

function ShapeMorphDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <code>shapeMorph</code> — the selected segment morphs its radius and
          springs into place (M3 Expressive button-group behavior).
        </p>
        <ToggleGroup
          aria-label="Alignment"
          variant="pills"
          shapeMorph
          defaultValue={["center"]}
        >
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2 border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Guards hold: <code>shapeMorph</code> is visually inert on{" "}
          <code>variant=&quot;outline&quot;</code> /{" "}
          <code>variant=&quot;segment&quot;</code> and under{" "}
          <code>slidingIndicator</code>.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <ToggleGroup
            aria-label="Outline morph guard"
            variant="outline"
            shapeMorph
            defaultValue={["a"]}
          >
            <ToggleGroupItem value="a">Outline</ToggleGroupItem>
            <ToggleGroupItem value="b">Guarded</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            aria-label="Sliding morph guard"
            variant="pills"
            shapeMorph
            slidingIndicator
            defaultValue={["a"]}
          >
            <ToggleGroupItem value="a">Sliding</ToggleGroupItem>
            <ToggleGroupItem value="b">Guarded</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}

const shapeMorphCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

<ToggleGroup aria-label="Alignment" variant="pills" shapeMorph defaultValue={["center"]}>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>`;

function DensitySection() {
  const [density, setDensity] = useState<string[]>(["comfortable"]);

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        <code>items</code> as data, with <code>label</code> /{" "}
        <code>description</code> wired to <code>aria-labelledby</code> /{" "}
        <code>aria-describedby</code>.
      </p>
      <KiraToggleGroup
        aria-label="Row density"
        variant="segment"
        label="Row density"
        description="Applies to every table in this workspace."
        items={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfortable" },
          { value: "spacious", label: "Spacious" },
        ]}
        value={density}
        onValueChange={setDensity}
      />
    </div>
  );
}

function DenseSection() {
  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        <code>dense</code> collapses to icon-only, moving each label into a
        tooltip and onto <code>aria-label</code>.
      </p>
      <KiraToggleGroup
        aria-label="Text alignment"
        variant="outline"
        dense
        defaultValue={["left"]}
        items={denseSectionKiraToggleGroupItems}
      />
    </div>
  );
}

function AsyncSection() {
  const [failNext, setFailNext] = useState(false);

  const save = () =>
    new Promise<void>((resolve, reject) => {
      setTimeout(
        () => (failNext ? reject(new Error("offline")) : resolve()),
        900,
      );
    });

  return (
    <div className="space-y-2 border-t pt-4">
      <p className="text-sm text-muted-foreground">
        <code>onValueChangeAsync</code> flips instantly (
        <code>useOptimistic</code>), shows a spinner on the pending item, then
        commits — or rolls back and toasts on rejection. Flip the switch, then
        pick a plan.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <KiraToggleGroup
          aria-label="Plan"
          variant="segment"
          defaultValue={["starter"]}
          onValueChangeAsync={save}
          asyncErrorMessage="Couldn't switch plans — try again."
          items={[
            { value: "starter", label: "Starter" },
            { value: "pro", label: "Pro" },
            { value: "team", label: "Team" },
          ]}
        />
        <Toggle
          variant="outline"
          size="sm"
          pressed={failNext}
          onPressedChange={setFailNext}
        >
          Simulate failure
        </Toggle>
      </div>
    </div>
  );
}

function KiraGroupDemo() {
  return (
    <div className="space-y-6">
      <DensitySection />
      <DenseSection />
      <AsyncSection />
    </div>
  );
}

const kiraGroupCode = `import { KiraToggleGroup } from "@/components/ui/toggle-group"

{/* Items as data, with label/description wired to ARIA */}
<KiraToggleGroup
  aria-label="Row density"
  variant="segment"
  label="Row density"
  description="Applies to every table in this workspace."
  items={[
    { value: "compact", label: "Compact" },
    { value: "comfortable", label: "Comfortable" },
    { value: "spacious", label: "Spacious" },
  ]}
/>

{/* dense: icon-only, labels become tooltips + aria-label */}
<KiraToggleGroup
  aria-label="Text alignment"
  dense
  defaultValue={["left"]}
  items={[
    { value: "left", label: "Align left", icon: <IconAlignLeft className="h-4 w-4" /> },
    { value: "center", label: "Align center", icon: <IconAlignCenter className="h-4 w-4" /> },
  ]}
/>

{/* Optimistic async: flips instantly, rolls back + toasts on rejection */}
<KiraToggleGroup
  aria-label="Plan"
  variant="segment"
  defaultValue={["starter"]}
  onValueChangeAsync={async (value) => { await api.setPlan(value) }}
  asyncErrorMessage="Couldn't switch plans — try again."
  items={[
    { value: "starter", label: "Starter" },
    { value: "pro", label: "Pro" },
  ]}
/>`;

const features = [
  {
    title: "Accessible",
    description:
      "WCAG 2.2 AA compliant with proper aria-label, keyboard navigation with arrow keys, and screen reader support.",
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Flexible Selection",
    description:
      "Supports single selection (radio behavior) or multiple selection (checkbox behavior) with controlled and uncontrolled modes.",
    icon: <IconPalette className="h-4 w-4" />,
  },
  {
    title: "Multiple Variants",
    description:
      "Default, outline, segment (iOS-style), and pills variants with sm, default, and lg sizes for both horizontal and vertical orientations.",
    icon: <IconStack2 className="h-4 w-4" />,
  },
];

const keyboardShortcuts = [
  {
    keys: "Space / Enter",
    description:
      "Toggle the focused item (selects, never deselects, in radio mode)",
  },
  {
    keys: "Arrow Left / Right",
    description:
      'Navigate items (horizontal). Also selects under semantics="radio"',
  },
  {
    keys: "Arrow Up / Down",
    description:
      'Navigate items (vertical). Also selects under semantics="radio"',
  },
  { keys: "Home", description: "Focus first item" },
  { keys: "End", description: "Focus last item" },
  { keys: "Tab", description: "Move focus out of group" },
];

const apiSections = [
  {
    title: "ToggleGroup",
    props: [
      {
        prop: "aria-label",
        type: "string",
        description:
          "Required for accessibility - describes the toggle group purpose.",
      },
      {
        prop: "value",
        type: "string[]",
        description:
          "Controlled value of the selected items (array of values).",
      },
      {
        prop: "defaultValue",
        type: "string[]",
        description: "Default selected values for uncontrolled mode.",
      },
      {
        prop: "onValueChange",
        type: "(value: string[]) => void",
        description: "Callback fired when selection changes.",
      },
      {
        prop: "multiple",
        type: "boolean",
        default: "false",
        description: "Allow multiple items to be selected simultaneously.",
      },
      {
        prop: "variant",
        type: '"default" | "outline" | "segment" | "pills"',
        default: '"default"',
        description: "Visual style variant of the toggle group.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size of all toggle items in the group.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout orientation of the toggle group.",
      },
      {
        prop: "loopFocus",
        type: "boolean",
        default: "true",
        description:
          "Whether keyboard navigation loops from last to first item.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables all toggle items in the group.",
      },
      {
        prop: "semantics",
        type: '"current" | "radio" | "toggle"',
        default: '"current"',
        description:
          'ARIA model for single-select groups. "current" puts aria-current="true" on the active segment (Primer/eBay); "radio" is ARIA17-normative — role="radiogroup" + role="radio"/aria-checked, one tab stop, arrow keys move and select; "toggle" keeps aria-pressed on/off buttons. Ignored when multiple is set — multi-select is always aria-pressed.',
      },
      {
        prop: "allowEmpty",
        type: "boolean",
        default: "false",
        description:
          'Allow the last selected item to be deselected. Off by default: single-select segmented controls keep one item selected always. Ignored under semantics="radio" — a radio group has no "none" state.',
      },
      {
        prop: "showSelectedIcon",
        type: "boolean",
        default: "false",
        description:
          "Render a checkmark on the selected item (Material 3's default selected affordance).",
      },
      {
        prop: "overflowMode",
        type: '"none" | "scroll" | "hideLabels"',
        default: '"none"',
        description:
          "Tight-width behaviour. Segments never wrap: 'scroll' keeps one line and scrolls, 'hideLabels' collapses to icon-only with the label as accessible name + tooltip.",
      },
      {
        prop: "required",
        type: "boolean",
        default: "false",
        description: "Forwards aria-required on the group.",
      },
      {
        prop: "invalid",
        type: "boolean",
        default: "false",
        description:
          "Forwards aria-invalid. Per ARIA21, set only after validation runs — not on mount.",
      },
      {
        prop: "errorMessage",
        type: "React.ReactNode",
        description:
          "Error text rendered below the group and linked via aria-describedby when invalid.",
      },
      {
        prop: "slidingIndicator",
        type: "boolean",
        default: "false",
        description:
          "Animate a sliding pill behind the active item. Single-selection only; reduced-motion gated.",
      },
      {
        prop: "shapeMorph",
        type: "boolean",
        default: "false",
        description:
          'M3 Expressive: the selected item\'s radius grows (rounded-xl) and it springs into place. Visually inert under variant="outline" / "segment", slidingIndicator, or multiple.',
      },
      {
        prop: "name",
        type: "string",
        description:
          "Submits with the enclosing form: one hidden input per selected value, so formData.getAll(name) returns each value as its own entry (not a comma-joined string). An empty selection emits no input at all, leaving the key absent rather than blank. Note required is aria-required only — browsers skip native validation on hidden inputs, so enforce it in your submit handler.",
      },
    ],
  },
  {
    title: "KiraToggleGroup",
    props: [
      {
        prop: "items",
        type: "KiraToggleGroupItem[]",
        description:
          "Items as data — each becomes a ToggleGroupItem. Supports value, label, icon, tooltip, disabled, disabledReason, loading, colorVariant.",
      },
      {
        prop: "onValueChangeAsync",
        type: "(value: string[]) => Promise<void>",
        description:
          "Async selection handler. Selection flips instantly via useOptimistic, shows a spinner on the pending item, then commits — or rolls back and toasts if this rejects.",
      },
      {
        prop: "asyncErrorMessage",
        type: "string",
        default: '"Couldn\'t update"',
        description:
          "Toast text shown when onValueChangeAsync rejects. Distinct from errorMessage, which is the inline validation text rendered below the group.",
      },
      {
        prop: "dense",
        type: "boolean",
        default: "false",
        description:
          "Render labels as tooltips only, for an icon-only dense bar. The label is kept as the accessible name.",
      },
      {
        prop: "label",
        type: "React.ReactNode",
        description:
          "Label rendered above the group and wired via aria-labelledby.",
      },
      {
        prop: "description",
        type: "React.ReactNode",
        description:
          "Supporting text rendered below the group and wired via aria-describedby.",
      },
    ],
  },
  {
    title: "ToggleGroupItem",
    props: [
      {
        prop: "value",
        type: "string",
        description:
          "Unique value for the item. Required for selection tracking.",
      },
      {
        prop: "colorVariant",
        type: '"default" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Color variant for the pressed state.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Shows a loading spinner and disables the item.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        description: "Override the group size for this specific item.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables this specific toggle item.",
      },
      {
        prop: "aria-label",
        type: "string",
        description:
          "Required for icon-only items to provide accessible label.",
      },
    ],
  },
];

const demoTabs = [
  {
    value: "multiple",
    label: "Multiple Selection",
    demo: (
      <DemoWrapper
        title="Multiple Selection"
        description="Multiple items can be selected simultaneously. Uses checkbox behavior with the multiple prop."
        code={multipleSelectionCode}
      >
        <MultipleSelectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "single",
    label: "Single Selection",
    demo: (
      <DemoWrapper
        title="Single Selection"
        description="Only one item can be selected at a time. Uses radio behavior (default)."
        code={singleSelectionCode}
      >
        <SingleSelectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    demo: (
      <DemoWrapper
        title="Visual Variants"
        description="Outline, segment (iOS-style), and pills variants for different use cases."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Small, default, and large sizes for different contexts."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "vertical",
    label: "Vertical",
    demo: (
      <DemoWrapper
        title="Vertical Orientation"
        description="Toggle group with vertical layout using orientation prop."
        code={verticalCode}
      >
        <VerticalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "controlled",
    label: "Controlled",
    demo: (
      <DemoWrapper
        title="Controlled Mode"
        description="Full control over selection with value and onValueChange props."
        code={controlledCode}
      >
        <ControlledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "colors",
    label: "Color Variants",
    demo: (
      <DemoWrapper
        title="Semantic Color Variants"
        description="Individual items can have success, warning, or destructive colors when pressed."
        code={colorVariantsCode}
      >
        <ColorVariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disabled",
    label: "Disabled",
    demo: (
      <DemoWrapper
        title="Disabled States"
        description="Disable the entire group or individual items."
        code={disabledCode}
      >
        <DisabledDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "mixed",
    label: "Mixed Content",
    demo: (
      <DemoWrapper
        title="Icons and Text"
        description="Combine icons and text for rich toggle items."
        code={mixedContentCode}
      >
        <MixedContentDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "one-selected",
    label: "One Selected Always",
    demo: (
      <DemoWrapper
        title="One Selected Always"
        description="Single-select segmented controls never allow an empty selection — pressing the active segment can't clear it. Material 3, Apple HIG, eBay and the VA design system all agree. Pass allowEmpty to opt out for filter-style groups."
        code={oneSelectedAlwaysCode}
      >
        <OneSelectedAlwaysDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "semantics",
    label: "ARIA Semantics",
    demo: (
      <DemoWrapper
        title="ARIA Semantics"
        description='Single-select groups default to aria-current="true" on the active segment (the Primer/eBay model), conveying "one of a set is active". Pass semantics="toggle" for aria-pressed on/off buttons. Multi-select groups are always aria-pressed, per the APG.'
        code={semanticsCode}
      >
        <SemanticsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "radio-mode",
    label: "Radio Mode",
    demo: (
      <DemoWrapper
        title='semantics="radio"'
        description='The ARIA17-normative model for a mutually-exclusive set: role="radiogroup" on the container, role="radio" + aria-checked on each segment, one tab stop, and arrow keys that move focus and selection together. Use it when the group is a real form field. allowEmpty is ignored — a radio group has no "none" state.'
        code={radioModeCode}
      >
        <RadioModeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "form-field",
    label: "Form Field",
    demo: (
      <DemoWrapper
        title="Form Field Semantics"
        description="required forwards aria-required; invalid forwards aria-invalid and links errorMessage via aria-describedby. Per ARIA21, set invalid only after validation runs — never on mount."
        code={formFieldCode}
      >
        <FormFieldDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "selected-icon",
    label: "Selected Icon",
    demo: (
      <DemoWrapper
        title="Selected Checkmark"
        description="showSelectedIcon renders a checkmark on the active segment — Material 3's default affordance, so selection isn't signalled by background colour alone."
        code={selectedIconCode}
      >
        <SelectedIconDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="State Matrix"
        description="Every state the group can render: interactive, disabled (with a keyboard-reachable reason), loading per item, and stress cases. All sizes keep ≥ 24×24 targets (sm = 28px) per WCAG 2.5.8."
        code={statesCode}
      >
        <GroupStatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sliding",
    label: "Sliding Indicator",
    demo: (
      <DemoWrapper
        title="Sliding Pill Indicator"
        description="The defining 2026 segmented-control affordance: a pill that slides behind the active segment. Position is measured from the pressed item rather than guessed from an index, so it survives uneven widths. Single-select only, and reduced-motion gated — with the OS setting on it jumps instead of sliding."
        code={slidingIndicatorCode}
      >
        <SlidingIndicatorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shape-morph",
    label: "Shape Morph",
    demo: (
      <DemoWrapper
        title="Shape Morph (M3 Expressive)"
        description='Selecting a segment grows its radius and springs the item — the Material 3 Expressive button-group behavior. Guarded off under variant="outline" / "segment" and when a sliding indicator owns the fill.'
        code={shapeMorphCode}
      >
        <ShapeMorphDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraToggleGroup",
    demo: (
      <DemoWrapper
        title="KiraToggleGroup"
        description="One prop-driven entry point over the group family: items as data, label/description wired to ARIA, dense icon-only mode with tooltips, and optimistic async selection that rolls back with a toast when the handler rejects."
        code={kiraGroupCode}
      >
        <KiraGroupDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "overflow",
    label: "Overflow",
    demo: (
      <DemoWrapper
        title="Responsive Overflow"
        description="Segments must never wrap. overflowMode='scroll' keeps them on one line and scrolls; 'hideLabels' collapses to icon-only while keeping the label as the accessible name and tooltip."
        code={overflowCode}
      >
        <OverflowDemo />
      </DemoWrapper>
    ),
  },
];

const usageCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

{/* Single selection (default) */}
<ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
<ToggleGroupItem value="left">Left</ToggleGroupItem>
<ToggleGroupItem value="center">Center</ToggleGroupItem>
<ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>

{/* Multiple selection */}
<ToggleGroup aria-label="Text formatting" multiple defaultValue={["bold"]}>
<ToggleGroupItem value="bold" aria-label="Bold">
  <IconBold className="h-4 w-4" />
</ToggleGroupItem>
<ToggleGroupItem value="italic" aria-label="Italic">
  <IconItalic className="h-4 w-4" />
</ToggleGroupItem>
</ToggleGroup>

{/* Segment variant (iOS style) */}
<ToggleGroup aria-label="View mode" variant="segment">
<ToggleGroupItem value="grid">Grid</ToggleGroupItem>
<ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>

{/* Controlled mode */}
const [value, setValue] = useState<string[]>([])
<ToggleGroup
aria-label="Filters"
value={value}
onValueChange={setValue}
>
<ToggleGroupItem value="all">All</ToggleGroupItem>
<ToggleGroupItem value="active">Active</ToggleGroupItem>
</ToggleGroup>`;

const changelogEntries = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "changed",
        title: "Shared useOptimisticCommit seam",
        description:
          "Removed the direct toast dependency; optimistic group updates now route through useOptimisticCommit while retaining the GSAP sliding pill indicator.",
      },
      {
        type: "fixed",
        title: "Focus ring at full strength",
        description:
          "Every toggle in a group now paints border-ring + ring-ring + ring-[3px] without the /50 alpha; the half-strength ring measured 1.63–2.82:1 against the page, below WCAG 1.4.11.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "20 October 2026",
    changes: [
      {
        type: "breaking",
        title: "shape → radius",
        description:
          'The shape prop is renamed to radius on ToggleGroup and ToggleGroupItem (values unchanged: default | pill). Mechanical find-and-replace; "shape" described structure, "radius" describes what it sets.',
      },
      {
        type: "added",
        title: "shapeMorph (M3 Expressive)",
        description:
          'Selecting an item grows its radius (rounded-xl) and springs it into place (scale 0.92 → 1, back.out(2)) — the Material 3 Expressive button-group behavior. Guards keep it visually inert under variant="outline" / "segment", slidingIndicator, or multiple. Reduced-motion aware.',
      },
      {
        type: "added",
        title: "Keyboard-reachable disabled reasons",
        description:
          "A disabled item with a disabledReason now renders a focusable anchor (accordion pattern): Tab reaches it, the reason is announced via aria-label, and focus/hover shows the tooltip. Previously hover-only.",
      },
      {
        type: "changed",
        title: "Interruptible motion",
        description:
          'Press bounce and the sliding indicator tween pass overwrite: "auto" to GSAP, so rapid segment switches restart toward the new target instead of stacking tweens.',
      },
      {
        type: "changed",
        title: "Focus ring aligned to button exemplar",
        description:
          "focus-visible now uses border-ring + ring-ring/50 + ring-[3px], matching Button and Tabs.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "8 August 2026",
    changes: [
      {
        type: "added",
        title: "Form Submission",
        description:
          'New `name` prop emits one hidden input per selected value, so formData.getAll(name) returns each value as its own entry — matching native checkbox/radio behaviour rather than a comma-joined string. An empty selection emits no input at all, leaving the key absent. This makes semantics="radio", required, invalid and errorMessage usable in a real form instead of visual-only.',
      },
      {
        type: "added",
        title: "Radio Semantics",
        description:
          'semantics="radio" applies the ARIA17-normative model for a mutually-exclusive set: role="radiogroup" on the container, role="radio" + aria-checked on each segment, one tab stop, and arrow keys that move focus and selection together (selection-follows-focus). Each mode exposes exactly one state attribute — aria-pressed and aria-checked are never both present.',
      },
      {
        type: "added",
        title: "Sliding Indicator, Selected Icon, Overflow Modes",
        description:
          "slidingIndicator animates a pill behind the active segment, measured from the pressed item so it survives uneven widths (single-select only, reduced-motion gated). showSelectedIcon renders a checkmark on the active item so selection isn't signalled by colour alone. overflowMode handles tight widths without wrapping: 'scroll' keeps one line, 'hideLabels' collapses to icon-only with the label kept as accessible name and tooltip.",
      },
      {
        type: "added",
        title: "Form-Field Semantics",
        description:
          "required forwards aria-required; invalid forwards aria-invalid and links errorMessage via aria-describedby. Per ARIA21, set invalid only after validation runs — not on mount. A dev-only warning fires when a segmented control exceeds the 2–5 segment consensus.",
      },
      {
        type: "fixed",
        title: "Async Rollback Now Explains Itself",
        description:
          "KiraToggleGroup's optimistic path had a finally but no catch, so a rejected onValueChangeAsync rolled back silently while its KiraToggle sibling toasted. It now surfaces asyncErrorMessage via toast.error, matching the rest of the system.",
      },
      {
        type: "breaking",
        title: "Single-Select Now Defaults to aria-current",
        description:
          'Single-select groups previously exposed aria-pressed on every item. They now emit aria-current="true" on the active segment (the Primer/eBay model), conveying "one of a set is active" rather than a set of independent on/off buttons. Pass semantics="toggle" to restore the previous behaviour. Multi-select groups are unaffected — they remain aria-pressed, per the APG.',
      },
      {
        type: "breaking",
        title: "Single-Select No Longer Allows an Empty Selection",
        description:
          'Pressing the active segment used to clear the group. Single-select segmented controls now keep one item selected always (Material 3, Apple HIG, eBay and the VA design system all agree), so selection can only move, never empty. Pass allowEmpty to restore the previous behaviour for filter-style groups. Ignored under semantics="radio", which has no "none" state.',
      },
    ],
  },
] satisfies React.ComponentProps<typeof Changelog>["entries"];

export default function ToggleGroupPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Toggle Group"
        description="A group of toggle buttons where one or multiple items can be selected. Three ARIA models (aria-current, radiogroup, aria-pressed), a sliding indicator, one-selected-always, form-field semantics, and full keyboard accessibility."
        version="v2.2"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="multiple" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for ToggleGroup including single/multiple selection, variants, and controlled mode."
      />

      <APIReference sections={apiSections} />

      <Changelog entries={changelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const denseSectionKiraToggleGroupItems = [
  {
    value: "left",
    label: "Align left",
    icon: <IconAlignLeft className="h-4 w-4" />,
  },
  {
    value: "center",
    label: "Align center",
    icon: <IconAlignCenter className="h-4 w-4" />,
  },
  {
    value: "right",
    label: "Align right",
    icon: <IconAlignRight className="h-4 w-4" />,
  },
] satisfies ReactComponentProps<typeof KiraToggleGroup>["items"];
