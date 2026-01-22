import { useState } from "react";
import { IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified, IconBold, IconItalic, IconUnderline, IconAccessible, IconPalette, IconStack2 } from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
        <ToggleGroup aria-label="Text alignment" variant="outline" defaultValue={["left"]}>
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
        <ToggleGroup aria-label="View mode" variant="segment" defaultValue={["grid"]}>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="list">List</ToggleGroupItem>
          <ToggleGroupItem value="board">Board</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Pills</p>
        <ToggleGroup aria-label="Filter options" variant="pills" multiple defaultValue={["all"]}>
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
    <ToggleGroup aria-label="Vertical options" variant="outline" orientation="vertical">
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
    <ToggleGroup aria-label="Filter options" variant="pills" multiple defaultValue={["all"]}>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="active" colorVariant="success">Active</ToggleGroupItem>
      <ToggleGroupItem value="warning" colorVariant="warning">Warning</ToggleGroupItem>
      <ToggleGroupItem value="delete" colorVariant="destructive">Delete</ToggleGroupItem>
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
        <ToggleGroup aria-label="Disabled group" disabled defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            <IconBold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <IconItalic className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Individual items disabled</p>
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
      <ToggleGroup aria-label="View options" variant="segment" defaultValue={["list"]}>
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

      <ToggleGroup aria-label="Density" variant="pills" defaultValue={["comfortable"]}>
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

export default function ToggleGroupPage() {
  const features = [
    {
      title: "Accessible",
      description: "WCAG 2.2 AA compliant with proper aria-label, keyboard navigation with arrow keys, and screen reader support.",
      icon: <IconAccessible className="h-4 w-4" />,
    },
    {
      title: "Flexible Selection",
      description: "Supports single selection (radio behavior) or multiple selection (checkbox behavior) with controlled and uncontrolled modes.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Multiple Variants",
      description: "Default, outline, segment (iOS-style), and pills variants with sm, default, and lg sizes for both horizontal and vertical orientations.",
      icon: <IconStack2 className="h-4 w-4" />,
    },
  ];

  const keyboardShortcuts = [
    { keys: "Space / Enter", description: "Toggle the focused item" },
    { keys: "Arrow Left / Right", description: "Navigate items (horizontal)" },
    { keys: "Arrow Up / Down", description: "Navigate items (vertical)" },
    { keys: "Home", description: "Focus first item" },
    { keys: "End", description: "Focus last item" },
    { keys: "Tab", description: "Move focus out of group" },
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

  const apiSections = [
    {
      title: "ToggleGroup",
      props: [
        {
          prop: "aria-label",
          type: "string",
          description: "Required for accessibility - describes the toggle group purpose.",
        },
        {
          prop: "value",
          type: "string[]",
          description: "Controlled value of the selected items (array of values).",
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
          description: "Whether keyboard navigation loops from last to first item.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables all toggle items in the group.",
        },
      ],
    },
    {
      title: "ToggleGroupItem",
      props: [
        {
          prop: "value",
          type: "string",
          description: "Unique value for the item. Required for selection tracking.",
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
          description: "Required for icon-only items to provide accessible label.",
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
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Toggle Group"
        description="A group of toggle buttons where one or multiple items can be selected. Supports single/multiple selection, various visual styles, and full keyboard accessibility."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="multiple" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for ToggleGroup including single/multiple selection, variants, and controlled mode."
      />

      <APIReference sections={apiSections} />
    </ComponentPage>
  );
}
