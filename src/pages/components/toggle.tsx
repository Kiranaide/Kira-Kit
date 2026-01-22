import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustified,
  IconBookmark,
  IconHeart,
  IconStar,
  IconAccessible,
  IconPalette,
  IconStack2,
} from "@tabler/icons-react";

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

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <IconItalic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <IconUnderline className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

const basicCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

export function BasicToggleDemo() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <IconItalic className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <IconUnderline className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function VariantsDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default</p>
        <Toggle variant="default" aria-label="Toggle default">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Outline</p>
        <Toggle variant="outline" aria-label="Toggle outline">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Ghost</p>
        <Toggle variant="ghost" aria-label="Toggle ghost">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Solid</p>
        <Toggle variant="solid" aria-label="Toggle solid">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
}

const variantsCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function ToggleVariantsDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Toggle variant="default" aria-label="Toggle default">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle outline">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="ghost" aria-label="Toggle ghost">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle variant="solid" aria-label="Toggle solid">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function SemanticVariantsDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Success</p>
        <Toggle variant="success" defaultPressed>
          Accept
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Warning</p>
        <Toggle variant="warning" defaultPressed>
          Warn
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Destructive</p>
        <Toggle variant="destructive" defaultPressed>
          Delete
        </Toggle>
      </div>
    </div>
  );
}

const semanticCode = `import { Toggle } from "@/components/ui/toggle"

export function SemanticToggleDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <Toggle variant="success" defaultPressed>
        Accept
      </Toggle>
      <Toggle variant="warning" defaultPressed>
        Warn
      </Toggle>
      <Toggle variant="destructive" defaultPressed>
        Delete
      </Toggle>
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Toggle size="sm" aria-label="Small toggle">
        <IconBold className="h-3.5 w-3.5" />
      </Toggle>
      <Toggle size="default" aria-label="Default toggle">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle size="lg" aria-label="Large toggle">
        <IconBold className="h-5 w-5" />
      </Toggle>
      <Toggle size="icon" aria-label="Icon only toggle">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

const sizesCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function ToggleSizesDemo() {
  return (
    <div className="flex items-center gap-4">
      <Toggle size="sm" aria-label="Small toggle">
        <IconBold className="h-3.5 w-3.5" />
      </Toggle>
      <Toggle size="default" aria-label="Default toggle">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle size="lg" aria-label="Large toggle">
        <IconBold className="h-5 w-5" />
      </Toggle>
      <Toggle size="icon" aria-label="Icon only toggle">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex gap-4 items-center">
      <Toggle loading={isLoading} onClick={handleLoadingDemo}>
        {isLoading ? "Loading..." : "Click to Load"}
      </Toggle>
      <Toggle loading aria-label="Always loading">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

const loadingCode = `import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function LoadingToggleDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex gap-4 items-center">
      <Toggle loading={isLoading} onClick={handleLoadingDemo}>
        {isLoading ? "Loading..." : "Click to Load"}
      </Toggle>
      <Toggle loading aria-label="Always loading">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function IndicatorDemo() {
  return (
    <div className="flex gap-4">
      <Toggle showIndicator defaultPressed>
        Enabled
      </Toggle>
      <Toggle showIndicator indicatorPosition="right" defaultPressed>
        Feature On
      </Toggle>
    </div>
  );
}

const indicatorCode = `import { Toggle } from "@/components/ui/toggle"

export function IndicatorToggleDemo() {
  return (
    <div className="flex gap-4">
      <Toggle showIndicator defaultPressed>
        Enabled
      </Toggle>
      <Toggle showIndicator indicatorPosition="right" defaultPressed>
        Feature On
      </Toggle>
    </div>
  )
}`;

function ShapesDemo() {
  return (
    <div className="flex gap-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Default</p>
        <Toggle aria-label="Default shape">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Pill</p>
        <Toggle shape="pill" aria-label="Pill shape">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Square</p>
        <Toggle shape="square" aria-label="Square shape">
          <IconBold className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  );
}

const shapesCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBold } from "@tabler/icons-react"

export function ShapeToggleDemo() {
  return (
    <div className="flex gap-4">
      <Toggle aria-label="Default shape">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle shape="pill" aria-label="Pill shape">
        <IconBold className="h-4 w-4" />
      </Toggle>
      <Toggle shape="square" aria-label="Square shape">
        <IconBold className="h-4 w-4" />
      </Toggle>
    </div>
  )
}`;

function RichExamplesDemo() {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <Toggle className="gap-2" aria-label="Toggle bookmark">
        <IconBookmark className="h-4 w-4" />
        Bookmark
      </Toggle>

      <Toggle
        className="group gap-2"
        aria-label="Toggle favorite"
        variant="outline"
        shape="pill"
      >
        <IconHeart className="h-4 w-4 group-data-[pressed]:fill-current group-data-[pressed]:text-destructive transition-colors" />
        Like
      </Toggle>

      <Toggle
        className="h-10 w-10 p-0 rounded-full group"
        variant="outline"
        aria-label="Toggle star"
      >
        <IconStar className="h-5 w-5 group-data-[pressed]:fill-warning group-data-[pressed]:text-warning transition-colors" />
      </Toggle>
    </div>
  );
}

const richExamplesCode = `import { Toggle } from "@/components/ui/toggle"
import { IconBookmark, IconHeart, IconStar } from "@tabler/icons-react"

export function RichToggleExamples() {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <Toggle className="gap-2" aria-label="Toggle bookmark">
        <IconBookmark className="h-4 w-4" />
        Bookmark
      </Toggle>

      <Toggle
        className="group gap-2"
        aria-label="Toggle favorite"
        variant="outline"
        shape="pill"
      >
        <IconHeart className="h-4 w-4 group-data-[pressed]:fill-current group-data-[pressed]:text-destructive transition-colors" />
        Like
      </Toggle>

      <Toggle
        className="h-10 w-10 p-0 rounded-full group"
        variant="outline"
        aria-label="Toggle star"
      >
        <IconStar className="h-5 w-5 group-data-[pressed]:fill-warning group-data-[pressed]:text-warning transition-colors" />
      </Toggle>
    </div>
  )
}`;

function GroupMultipleDemo() {
  return (
    <ToggleGroup aria-label="Text formatting" multiple>
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

const groupMultipleCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

export function ToggleGroupMultipleDemo() {
  return (
    <ToggleGroup aria-label="Text formatting" multiple>
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

function GroupSingleDemo() {
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

const groupSingleCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified } from "@tabler/icons-react"

export function ToggleGroupSingleDemo() {
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

function GroupVariantsDemo() {
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

const groupVariantsCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IconAlignLeft, IconAlignCenter, IconAlignRight } from "@tabler/icons-react"

export function ToggleGroupVariantsDemo() {
  return (
    <div className="space-y-6">
      {/* Outline variant */}
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

      {/* Segment variant (iOS style) */}
      <ToggleGroup
        aria-label="View mode"
        variant="segment"
        defaultValue={["grid"]}
      >
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="board">Board</ToggleGroupItem>
      </ToggleGroup>

      {/* Pills variant */}
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

function GroupSizesDemo() {
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

const groupSizesCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupSizesDemo() {
  return (
    <div className="space-y-4">
      {/* Small */}
      <ToggleGroup aria-label="Small alignment" variant="outline" size="sm">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>

      {/* Default */}
      <ToggleGroup aria-label="Default alignment" variant="outline">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>

      {/* Large */}
      <ToggleGroup aria-label="Large alignment" variant="outline" size="lg">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`;

function GroupVerticalDemo() {
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

const groupVerticalCode = `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupVerticalDemo() {
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

// =============================================================================
// Page Component
// =============================================================================

export function TogglePage() {
  const features = [
    {
      title: "Accessible",
      description:
        "WCAG 2.2 AA compliant with proper aria-pressed states and keyboard navigation. Icon-only toggles require aria-label.",
      icon: <IconAccessible className="h-4 w-4" />,
    },
    {
      title: "Multiple Variants",
      description:
        "Default, outline, ghost, solid, and semantic color variants (success, warning, destructive) for different use cases.",
      icon: <IconPalette className="h-4 w-4" />,
    },
    {
      title: "Flexible Groups",
      description:
        "ToggleGroup supports single/multiple selection, segment and pills variants, vertical orientation, and various sizes.",
      icon: <IconStack2 className="h-4 w-4" />,
    },
  ];

  const keyboardShortcuts = [
    { keys: "Space", description: "Toggle the focused button" },
    { keys: "Enter", description: "Toggle the focused button" },
    { keys: "Tab", description: "Move focus to next element" },
    { keys: "Shift + Tab", description: "Move focus to previous element" },
    { keys: "Arrow Left/Right", description: "Navigate within toggle group" },
    { keys: "Arrow Up/Down", description: "Navigate vertical toggle group" },
  ];

  const usageCode = `import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

{/* Single Toggle (icon-only requires aria-label) */}
<Toggle aria-label="Toggle bold">
  <IconBold className="h-4 w-4" />
</Toggle>

{/* Toggle with text and indicator */}
<Toggle showIndicator defaultPressed>
  Enabled
</Toggle>

{/* Loading state */}
<Toggle loading>Processing...</Toggle>

{/* Toggle Group - Multiple selection */}
<ToggleGroup aria-label="Text formatting" multiple>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>

{/* Toggle Group - Single selection (segment style) */}
<ToggleGroup aria-label="View mode" variant="segment">
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
  <ToggleGroupItem value="list">List</ToggleGroupItem>
</ToggleGroup>`;

  const apiSections = [
    {
      title: "Toggle",
      props: [
        {
          prop: "pressed",
          type: "boolean",
          description: "Controlled pressed state of the toggle.",
        },
        {
          prop: "defaultPressed",
          type: "boolean",
          default: "false",
          description: "Default pressed state for uncontrolled mode.",
        },
        {
          prop: "onPressedChange",
          type: "(pressed: boolean) => void",
          description: "Callback fired when the pressed state changes.",
        },
        {
          prop: "variant",
          type: '"default" | "outline" | "ghost" | "solid" | "success" | "warning" | "destructive"',
          default: '"default"',
          description: "Visual style variant of the toggle.",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg" | "icon"',
          default: '"default"',
          description: "Size of the toggle button.",
        },
        {
          prop: "shape",
          type: '"default" | "pill" | "square"',
          default: '"default"',
          description: "Border radius shape of the toggle.",
        },
        {
          prop: "loading",
          type: "boolean",
          default: "false",
          description: "Shows a loading spinner and disables the toggle.",
        },
        {
          prop: "showIndicator",
          type: "boolean",
          default: "false",
          description: "Shows a checkmark indicator when pressed.",
        },
        {
          prop: "indicatorPosition",
          type: '"left" | "right"',
          default: '"left"',
          description: "Position of the check indicator.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the toggle button.",
        },
      ],
    },
    {
      title: "ToggleGroup",
      props: [
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
          description:
            "Allow multiple items to be selected simultaneously.",
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
          description:
            "Unique value for the item. Required for selection tracking.",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables this specific toggle item.",
        },
      ],
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Toggle"
          description="Icon-only toggles require aria-label for accessibility."
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "variants",
      label: "Variants",
      demo: (
        <DemoWrapper
          title="Toggle Variants"
          description="Different visual styles for various contexts."
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "semantic",
      label: "Semantic",
      demo: (
        <DemoWrapper
          title="Semantic Color Variants"
          description="Toggle buttons with semantic colors when pressed. Uses icons in addition to color for accessibility."
          code={semanticCode}
        >
          <SemanticVariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Toggle Sizes"
          description="Small, default, large, and icon-only sizes."
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "loading",
      label: "Loading",
      demo: (
        <DemoWrapper
          title="Loading State"
          description="Show a loading spinner while processing. The toggle is disabled during loading."
          code={loadingCode}
        >
          <LoadingDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "indicator",
      label: "Indicator",
      demo: (
        <DemoWrapper
          title="With Check Indicator"
          description="Shows a checkmark when pressed for additional visual feedback."
          code={indicatorCode}
        >
          <IndicatorDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "shapes",
      label: "Shapes",
      demo: (
        <DemoWrapper
          title="Shape Variants"
          description="Different border radius options for the toggle."
          code={shapesCode}
        >
          <ShapesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "rich",
      label: "Rich Examples",
      demo: (
        <DemoWrapper
          title="Rich Examples"
          description="Creative toggle implementations with icons and custom styling."
          code={richExamplesCode}
        >
          <RichExamplesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-multiple",
      label: "Group (Multiple)",
      demo: (
        <DemoWrapper
          title="Toggle Group (Multiple Selection)"
          description="Multiple items can be selected. Uses Arrow keys for keyboard navigation."
          code={groupMultipleCode}
        >
          <GroupMultipleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-single",
      label: "Group (Single)",
      demo: (
        <DemoWrapper
          title="Toggle Group (Single Selection)"
          description="Only one item can be selected at a time."
          code={groupSingleCode}
        >
          <GroupSingleDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-variants",
      label: "Group Variants",
      demo: (
        <DemoWrapper
          title="Toggle Group Variants"
          description="Outline, segment (iOS style), and pills variants."
          code={groupVariantsCode}
        >
          <GroupVariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-sizes",
      label: "Group Sizes",
      demo: (
        <DemoWrapper
          title="Toggle Group Sizes"
          description="Small, default, and large sizes for toggle groups."
          code={groupSizesCode}
        >
          <GroupSizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group-vertical",
      label: "Vertical",
      demo: (
        <DemoWrapper
          title="Vertical Orientation"
          description="Toggle group with vertical layout."
          code={groupVerticalCode}
        >
          <GroupVerticalDemo />
        </DemoWrapper>
      ),
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Toggle & Toggle Group"
        description="Accessible two-state buttons with WCAG 2.2 AA compliance. Uses proper aria-pressed states and keyboard navigation."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock
        code={usageCode}
        description="Basic implementation examples for Toggle and ToggleGroup."
      />

      <APIReference sections={apiSections} />
    </ComponentPage>
  );
}
