import type { ComponentProps as ReactComponentProps } from "react";
import {
  IconAccessible,
  IconPalette,
  IconKeyboard,
  IconLink,
  IconPlus,
  IconPencil,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  SharedTooltip,
  SharedTooltipTrigger,
  createTooltipHandle,
  type SharedTooltipPayload,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

function BasicDemo() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <SimpleTooltip content="Save your changes">
        <Button variant="outline">Hover me</Button>
      </SimpleTooltip>
      <SimpleTooltip content="This will delete the item" side="right">
        <Button variant="destructive">Delete</Button>
      </SimpleTooltip>
    </div>
  );
}

const basicCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function BasicTooltipDemo() {
  return (
    <div className="flex gap-4">
      <SimpleTooltip content="Save your changes">
        <Button variant="outline">Hover me</Button>
      </SimpleTooltip>
      <SimpleTooltip content="This will delete the item" side="right">
        <Button variant="destructive">Delete</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function PositionsDemo() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <SimpleTooltip content="Top tooltip" side="top">
        <Button variant="outline">Top</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Right tooltip" side="right">
        <Button variant="outline">Right</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Bottom tooltip" side="bottom">
        <Button variant="outline">Bottom</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Left tooltip" side="left">
        <Button variant="outline">Left</Button>
      </SimpleTooltip>
    </div>
  );
}

const positionsCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function PositionsDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <SimpleTooltip content="Top tooltip" side="top">
        <Button variant="outline">Top</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Right tooltip" side="right">
        <Button variant="outline">Right</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Bottom tooltip" side="bottom">
        <Button variant="outline">Bottom</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Left tooltip" side="left">
        <Button variant="outline">Left</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function DelayDemo() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <SimpleTooltip content="Instant tooltip" delay={0}>
        <Button variant="outline">No delay (0ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Quick tooltip" delay={200}>
        <Button variant="outline">Quick (200ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Default delay" delay={500}>
        <Button variant="outline">Default (500ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Slow tooltip" delay={1000}>
        <Button variant="outline">Slow (1000ms)</Button>
      </SimpleTooltip>
    </div>
  );
}

const delayCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function DelayDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <SimpleTooltip content="Instant tooltip" delay={0}>
        <Button variant="outline">No delay (0ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Quick tooltip" delay={200}>
        <Button variant="outline">Quick (200ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Default delay" delay={500}>
        <Button variant="outline">Default (500ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Slow tooltip" delay={1000}>
        <Button variant="outline">Slow (1000ms)</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function VariantsDemo() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <SimpleTooltip content="Default tooltip" variant="default">
        <Button variant="outline">Default</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Secondary tooltip" variant="secondary">
        <Button variant="outline">Secondary</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Outline tooltip" variant="outline">
        <Button variant="outline">Outline</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Muted tooltip" variant="muted">
        <Button variant="outline">Muted</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Destructive action!" variant="destructive">
        <Button variant="destructive">Destructive</Button>
      </SimpleTooltip>
    </div>
  );
}

const variantsCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function VariantsDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <SimpleTooltip content="Default tooltip" variant="default">
        <Button variant="outline">Default</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Secondary tooltip" variant="secondary">
        <Button variant="outline">Secondary</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Outline tooltip" variant="outline">
        <Button variant="outline">Outline</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Muted tooltip" variant="muted">
        <Button variant="outline">Muted</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Destructive action!" variant="destructive">
        <Button variant="destructive">Destructive</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function SizesDemo() {
  return (
    <div className="flex gap-4 items-center justify-center">
      <SimpleTooltip content="Small tooltip" size="sm">
        <Button variant="outline" size="sm">
          Small
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Default tooltip">
        <Button variant="outline">Default</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Large tooltip text" size="lg">
        <Button variant="outline" size="lg">
          Large
        </Button>
      </SimpleTooltip>
    </div>
  );
}

const sizesCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function SizesDemo() {
  return (
    <div className="flex gap-4 items-center">
      <SimpleTooltip content="Small tooltip" size="sm">
        <Button variant="outline" size="sm">
          Small
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Default tooltip">
        <Button variant="outline">Default</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Large tooltip text" size="lg">
        <Button variant="outline" size="lg">
          Large
        </Button>
      </SimpleTooltip>
    </div>
  )
}`;

function ArrowDemo() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <SimpleTooltip content="Tooltip with arrow" showArrow={true}>
        <Button variant="outline">With arrow</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Tooltip without arrow" showArrow={false}>
        <Button variant="outline">Without arrow</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Arrow follows the side" side="right">
        <Button variant="outline">Right-side arrow</Button>
      </SimpleTooltip>
    </div>
  );
}

const arrowCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function ArrowDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      <SimpleTooltip content="Tooltip with arrow" showArrow={true}>
        <Button variant="outline">With arrow</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Tooltip without arrow" showArrow={false}>
        <Button variant="outline">Without arrow</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function IconButtonsDemo() {
  return (
    <div className="flex gap-2 items-center justify-center">
      <SimpleTooltip content="Add new item">
        <Button variant="outline" size="icon" aria-label="Add new item">
          <IconPlus className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Edit">
        <Button variant="outline" size="icon" aria-label="Edit">
          <IconPencil className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Settings">
        <Button variant="outline" size="icon" aria-label="Settings">
          <IconSettings className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Delete" variant="destructive">
        <Button variant="ghost" size="icon" aria-label="Delete">
          <IconTrash className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
    </div>
  );
}

const iconButtonsCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { IconPlus, IconPencil, IconSettings, IconTrash } from "@tabler/icons-react"

export function IconButtonsDemo() {
  return (
    <div className="flex gap-2">
      <SimpleTooltip content="Add new item">
        <Button variant="outline" size="icon" aria-label="Add new item">
          <IconPlus className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Edit">
        <Button variant="outline" size="icon" aria-label="Edit">
          <IconPencil className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Settings">
        <Button variant="outline" size="icon" aria-label="Settings">
          <IconSettings className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Delete" variant="destructive">
        <Button variant="ghost" size="icon" aria-label="Delete">
          <IconTrash className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
    </div>
  )
}`;

function ShortcutDemo() {
  return (
    <div className="flex gap-4 flex-wrap items-center justify-center">
      <SimpleTooltip content="Bold" shortcut={["⌘", "B"]}>
        <Button variant="outline">Bold</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Insert link" shortcut={["⌘", "K"]}>
        <Button variant="outline">Insert link</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Search" shortcut="⌘ K">
        <Button variant="outline">Search</Button>
      </SimpleTooltip>
    </div>
  );
}

const shortcutCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function ShortcutDemo() {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* shortcut accepts a string or an array of keys */}
      <SimpleTooltip content="Bold" shortcut={["⌘", "B"]}>
        <Button variant="outline">Bold</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Insert link" shortcut={["⌘", "K"]}>
        <Button variant="outline">Insert link</Button>
      </SimpleTooltip>
    </div>
  )
}`;

// Module scope: one handle per toolbar.
const toolbarTip = createTooltipHandle<SharedTooltipPayload>();

const toolbarActions = [
  {
    id: "bold",
    label: "Bold",
    keys: ["⌘", "B"] as const,
    aria: "Meta+B",
  },
  {
    id: "italic",
    label: "Italic",
    keys: ["⌘", "I"] as const,
    aria: "Meta+I",
  },
  {
    id: "underline",
    label: "Underline",
    keys: ["⌘", "U"] as const,
    aria: "Meta+U",
  },
  {
    id: "link",
    label: "Insert link",
    keys: ["⌘", "K"] as const,
    aria: "Meta+K",
  },
] as const;

function SharedToolbarDemo() {
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex gap-1 rounded-md border bg-background p-1"
    >
      {toolbarActions.map(({ id, label, keys, aria }) => (
        <SharedTooltipTrigger
          key={id}
          handle={toolbarTip}
          label={label}
          shortcut={keys}
          aria-keyshortcuts={aria}
          render={<Button size="icon" variant="ghost" />}
        >
          <IconKeyboard aria-hidden className="h-4 w-4" />
        </SharedTooltipTrigger>
      ))}
      {/* One popup for the whole toolbar — it glides between buttons. */}
      <SharedTooltip handle={toolbarTip} side="bottom" />
    </div>
  );
}

const sharedToolbarCode = `import {
  SharedTooltip,
  SharedTooltipTrigger,
  createTooltipHandle,
  type SharedTooltipPayload,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// Module scope: one handle per toolbar.
const toolbarTip = createTooltipHandle<SharedTooltipPayload>()

export function FormattingToolbar() {
  return (
    <div role="toolbar" aria-label="Formatting" className="flex gap-1">
      <SharedTooltipTrigger
        handle={toolbarTip}
        label="Bold"
        shortcut={["⌘", "B"]}
        aria-keyshortcuts="Meta+B"
        render={<Button size="icon" variant="ghost" />}
      >
        <BoldIcon aria-hidden />
      </SharedTooltipTrigger>
      <SharedTooltipTrigger
        handle={toolbarTip}
        label="Italic"
        shortcut={["⌘", "I"]}
        aria-keyshortcuts="Meta+I"
        render={<Button size="icon" variant="ghost" />}
      >
        <ItalicIcon aria-hidden />
      </SharedTooltipTrigger>
      {/* One popup for the whole toolbar — it glides between buttons. */}
      <SharedTooltip handle={toolbarTip} side="bottom" />
    </div>
  )
}`;

function StressDemo() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex gap-4 flex-wrap items-center justify-center">
        <SimpleTooltip content="Enabled trigger">
          <Button variant="outline">Enabled</Button>
        </SimpleTooltip>
        <SimpleTooltip
          content="Disabled, but the reason is still reachable"
          disabled
        >
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </SimpleTooltip>
        <SimpleTooltip content="" disabled>
          <Button variant="outline">Empty content (disabled)</Button>
        </SimpleTooltip>
        <SimpleTooltip
          content="A tooltip with a very long content string that must wrap instead of overflowing the viewport. It respects the maxWidth cap and the available width."
          maxWidth={200}
        >
          <Button variant="outline">Long content</Button>
        </SimpleTooltip>
      </div>
      <div className="flex max-w-xs flex-col gap-4 rounded-md border p-4">
        <p className="text-xs text-muted-foreground">
          Narrow container (max-w-xs): the tooltip never overflows — it is
          capped by the available viewport width.
        </p>
        <SimpleTooltip
          content="Capped by viewport width, not container width"
          side="bottom"
        >
          <Button variant="outline" className="w-full">
            Narrow container trigger with a long label
          </Button>
        </SimpleTooltip>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <SimpleTooltip content="Works on focusable non-button elements too">
          <Switch aria-label="Toggle setting" />
        </SimpleTooltip>
      </div>
    </div>
  );
}

const stressCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export function StressDemo() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex gap-4 flex-wrap">
        <SimpleTooltip content="Enabled trigger">
          <Button variant="outline">Enabled</Button>
        </SimpleTooltip>
        <SimpleTooltip content="Disabled, but the reason is still reachable" disabled>
          <Button variant="outline" disabled>Disabled</Button>
        </SimpleTooltip>
        <SimpleTooltip content="" disabled>
          <Button variant="outline">Empty content (disabled)</Button>
        </SimpleTooltip>
        <SimpleTooltip
          content="A tooltip with a very long content string that must wrap instead of overflowing the viewport."
          maxWidth={200}
        >
          <Button variant="outline">Long content</Button>
        </SimpleTooltip>
      </div>
      <div className="max-w-xs rounded-md border p-4">
        <SimpleTooltip content="Capped by viewport width, not container width" side="bottom">
          <Button variant="outline" className="w-full">
            Narrow container trigger with a long label
          </Button>
        </SimpleTooltip>
      </div>
      <SimpleTooltip content="Works on focusable non-button elements too">
        <Switch aria-label="Toggle setting" />
      </SimpleTooltip>
    </div>
  )
}`;

function RichContentDemo() {
  return (
    <div className="flex gap-4 items-center justify-center">
      <Tooltip delay={300}>
        <TooltipTrigger render={<Button variant="outline" />}>
          Rich Content
        </TooltipTrigger>
        <TooltipContent side="top" variant="outline" showArrow={true}>
          <p className="font-medium">Advanced Tooltip</p>
          <p className="text-xs text-muted-foreground mt-1">
            With custom content structure
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

const richContentCode = `import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function RichContentDemo() {
  return (
    <div className="flex gap-4">
      <Tooltip delay={300}>
        <TooltipTrigger render={<Button variant="outline" />}>
          Rich Content
        </TooltipTrigger>
        <TooltipContent side="top" variant="outline" showArrow={true}>
          <p className="font-medium">Advanced Tooltip</p>
          <p className="text-xs text-muted-foreground mt-1">
            With custom content structure
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}`;

const usageCode = `import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipShortcut,
  SimpleTooltip,
  SharedTooltip,
  SharedTooltipTrigger,
  createTooltipHandle,
  type SharedTooltipPayload,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

// Simple API (recommended for most cases)
<SimpleTooltip content="Save your changes">
  <Button>Save</Button>
</SimpleTooltip>

// With options
<SimpleTooltip
  content="Delete permanently"
  variant="destructive"
  side="right"
  delay={300}
>
  <Button variant="destructive">Delete</Button>
</SimpleTooltip>

// Keyboard shortcut hints
<SimpleTooltip content="Bold" shortcut={["⌘", "B"]}>
  <Button>Bold</Button>
</SimpleTooltip>

// Advanced API for complex content
<Tooltip delay={300}>
  <TooltipTrigger render={<Button variant="outline" />}>
    Hover me
  </TooltipTrigger>
  <TooltipContent side="top" variant="outline">
    <p className="font-medium">Title</p>
    <p className="text-xs text-muted-foreground">Description text</p>
  </TooltipContent>
</Tooltip>

// Shared toolbar tooltip: one handle per toolbar, module scope
const toolbarTip = createTooltipHandle<SharedTooltipPayload>()

<SharedTooltipTrigger
  handle={toolbarTip}
  label="Bold"
  shortcut={["⌘", "B"]}
  aria-keyshortcuts="Meta+B"
  render={<Button size="icon" variant="ghost" />}
>
  <BoldIcon aria-hidden />
</SharedTooltipTrigger>

{/* Rendered once, after the triggers */}
<SharedTooltip handle={toolbarTip} side="bottom" />

// Mount once at the app root: groups delays between adjacent tooltips
<TooltipProvider delay={500} closeDelay={150}>
  <App />
</TooltipProvider>`;

export default function TooltipPage() {
  return (
    <TooltipProvider>
      <ComponentPage>
        <PageHeader
          title="Tooltip"
          description="Accessible popup that displays information on hover or focus. WCAG 2.2 AA compliant with Escape dismissal, delay grouping, keyboard shortcut hints, and a shared toolbar mode built on Base UI 1.9."
          version="v2.0.0"
        />

        <FeatureGrid
          features={tooltipPageFeatures}
          description="Capabilities built into Tooltip, SimpleTooltip, and SharedTooltip."
        />

        <DemoTabs defaultValue="basic" tabs={tooltipPageDemoTabs} />

        <KeyboardShortcuts
          shortcuts={tooltipPageShortcuts}
          description="Keyboard focus, dismissal, and shortcut announcement behavior."
        />

        <UsageBlock
          code={usageCode}
          title="Usage"
          description="Choose SimpleTooltip for common cases, Tooltip primitives for custom layouts, or SharedTooltip for toolbars."
          notes={[
            {
              label: "SimpleTooltip",
              body: "Renders the trigger directly via render={children} without adding a wrapper button. Pass a child that forwards ref and props.",
            },
            {
              label: "SharedTooltip",
              body: "Use createTooltipHandle() at module scope to glide a single popup across toolbar buttons without reopening.",
            },
          ]}
        />

        <APIReference
          sections={tooltipPageAPISections}
          description="Props, types, and defaults for every exported Tooltip part."
        />

        <Changelog
          entries={tooltipPageChangelogEntries}
          title="Changelog"
          description="Version history and changes for the Tooltip component."
        />
      </ComponentPage>
    </TooltipProvider>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const tooltipPageFeatures = [
  {
    title: "Accessible",
    description:
      "WCAG 2.2 AA compliant. Escape dismisses (1.4.13), hoverable content, and Base UI's own ARIA wiring.",
    icon: <IconAccessible className="w-4 h-4 text-primary" />,
  },
  {
    title: "Customizable",
    description:
      "Variants, sizes, positions, delays, arrows, keyboard shortcuts, and viewport-aware maxWidth.",
    icon: <IconPalette className="w-4 h-4 text-primary" />,
  },
  {
    title: "Shared Tooltips",
    description:
      "One popup per toolbar that glides between buttons and shows keyboard shortcuts — Figma/Linear style.",
    icon: <IconLink className="w-4 h-4 text-primary" />,
  },
  {
    title: "Keyboard-first",
    description:
      "Tooltips open on focus, Escape closes them, and shortcuts are advertised with aria-keyshortcuts.",
    icon: <IconKeyboard className="w-4 h-4 text-primary" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const tooltipPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Simple Tooltip"
        description="The easiest way to add tooltips. Just wrap your trigger with SimpleTooltip."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "positions",
    label: "Positions",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Positioning"
        description="Control which side of the trigger the tooltip appears on."
        code={positionsCode}
      >
        <PositionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "delay",
    label: "Delay",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Custom Delay"
        description="Default delay is 500ms. Grouped tooltips share the provider's skip window. Customize with the delay prop."
        code={delayCode}
      >
        <DelayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Style Variants"
        description="Different visual styles for various contexts."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Small, default, and large tooltip sizes."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "arrow",
    label: "Arrow",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Arrow Options"
        description="Toggle the arrow pointer on or off. The arrow rotates to point at the trigger from every side."
        code={arrowCode}
      >
        <ArrowDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icon-buttons",
    label: "Icon Buttons",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Icon Buttons with Tooltips"
        description="Tooltips are essential for icon-only buttons to provide context."
        code={iconButtonsCode}
      >
        <IconButtonsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rich-content",
    label: "Rich Content",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Advanced API (Compound Components)"
        description="For more control, use the compound component pattern with custom content."
        code={richContentCode}
      >
        <RichContentDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shortcut",
    label: "Shortcuts",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Keyboard Shortcuts"
        description="Render <kbd> key hints like ⌘ B next to the label. Visual only — advertise the real shortcut with aria-keyshortcuts on the trigger."
        code={shortcutCode}
      >
        <ShortcutDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shared-toolbar",
    label: "Shared Toolbar",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Shared Tooltip (one popup, many triggers)"
        description="Built on Base UI 1.9 detached triggers: one popup glides between toolbar buttons, showing label + shortcut. Hover across the buttons to see it move without reopening."
        code={sharedToolbarCode}
      >
        <SharedToolbarDemo />
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
        description="Disabled triggers, empty content, very long content, narrow max-w-xs containers, and non-button triggers."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const tooltipPageShortcuts = [
  {
    keys: "Tab",
    description: "Focus trigger to show tooltip (inherited from Base UI)",
  },
  {
    keys: "Escape",
    description: "Dismiss tooltip (WCAG 1.4.13, inherited from Base UI)",
  },
  {
    keys: "aria-keyshortcuts",
    description:
      "Advertise a trigger's real shortcut; the tooltip's kbd hints are visual-only",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const tooltipPageAPISections = [
  {
    title: "SimpleTooltip",
    props: [
      {
        prop: "content",
        type: "React.ReactNode",
        default: "-",
        description: "The tooltip content to display",
      },
      {
        prop: "children",
        type: "React.ReactElement",
        default: "-",
        description:
          "The trigger element. Must accept ref + props; rendered via render, never wrapped",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"top"',
        description: "Preferred side of trigger to render",
      },
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment along the trigger edge",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "8",
        description: "Distance from trigger in pixels",
      },
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "muted" | "destructive"',
        default: '"default"',
        description: "Visual style variant",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size of the tooltip",
      },
      {
        prop: "showArrow",
        type: "boolean",
        default: "true",
        description: "Whether to show the arrow pointer",
      },
      {
        prop: "maxWidth",
        type: "number | string",
        default: "250",
        description: "Max width; also capped by the available viewport width",
      },
      {
        prop: "shortcut",
        type: "string | readonly string[]",
        default: "-",
        description: "Keyboard shortcut hint(s) rendered as kbd keys",
      },
      {
        prop: "delay",
        type: "number",
        default: "-",
        description: "Open delay in ms (overrides Root/context)",
      },
      {
        prop: "closeDelay",
        type: "number",
        default: "-",
        description: "Close delay in ms (overrides Root/context)",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the tooltip entirely",
      },
      {
        prop: "open",
        type: "boolean",
        default: "-",
        description: "Controlled open state",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, eventDetails) => void",
        default: "-",
        description: "Callback when open state changes",
      },
    ],
  },
  {
    title: "Tooltip",
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "-",
        description: "Controlled open state",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean, eventDetails) => void",
        default: "-",
        description: "Callback when open state changes",
      },
      {
        prop: "delay",
        type: "number",
        default: "-",
        description: "Open delay in ms, forwarded to the trigger via context",
      },
      {
        prop: "closeDelay",
        type: "number",
        default: "-",
        description: "Close delay in ms, forwarded to the trigger via context",
      },
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "muted" | "destructive"',
        default: "-",
        description:
          "Default variant for TooltipContent/TooltipArrow in this root",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: "-",
        description: "Default size for TooltipContent in this root",
      },
      {
        prop: "handle",
        type: "Tooltip.Handle<Payload>",
        default: "-",
        description:
          "Associates this root with detached triggers (created via createTooltipHandle)",
      },
    ],
  },
  {
    title: "TooltipTrigger",
    props: [
      {
        prop: "render",
        type: "ReactElement | (props, state) => ReactElement",
        default: "-",
        description:
          "Render the trigger as this element instead of wrapping children in a button",
      },
      {
        prop: "delay",
        type: "number",
        default: "-",
        description: "Open delay in ms for this trigger",
      },
      {
        prop: "closeDelay",
        type: "number",
        default: "-",
        description: "Close delay in ms for this trigger",
      },
      {
        prop: "handle",
        type: "Tooltip.Handle<Payload>",
        default: "-",
        description: "Attach to a shared handle instead of this root",
      },
      {
        prop: "payload",
        type: "Payload",
        default: "-",
        description: "Payload passed to the Root's render function when opened",
      },
    ],
  },
  {
    title: "TooltipContent",
    props: [
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"top"',
        description: "Preferred side of trigger to render",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "8",
        description: "Distance from trigger in pixels",
      },
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment along the trigger edge",
      },
      {
        prop: "alignOffset",
        type: "number",
        default: "0",
        description: "Additional offset along the aligned edge",
      },
      {
        prop: "collisionPadding",
        type: "number | { top, right, bottom, left }",
        default: "8",
        description: "Padding from the viewport edges when avoiding collisions",
      },
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "muted" | "destructive"',
        default: '"default"',
        description: "Visual style variant",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Size of the tooltip",
      },
      {
        prop: "showArrow",
        type: "boolean",
        default: "true",
        description: "Whether to show the arrow pointer",
      },
      {
        prop: "maxWidth",
        type: "number | string",
        default: "250",
        description: "Max width; also capped by the available viewport width",
      },
      {
        prop: "shortcut",
        type: "string | readonly string[]",
        default: "-",
        description: "Keyboard shortcut hint(s) rendered as kbd keys",
      },
      {
        prop: "positionerProps",
        type: "Tooltip.Positioner.Props",
        default: "-",
        description: "Forwarded to the Positioner (className, id, etc.)",
      },
      {
        prop: "portalProps",
        type: "Tooltip.Portal.Props",
        default: "-",
        description: "Forwarded to the Portal (container, etc.)",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes merged onto the popup",
      },
      {
        prop: "style",
        type: "React.CSSProperties",
        default: "-",
        description:
          "Inline styles merged with the --tooltip-max-width variable",
      },
    ],
  },
  {
    title: "TooltipArrow",
    props: [
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "muted" | "destructive"',
        default: '"default"',
        description:
          "Arrow fill/stroke color; inherits Tooltip context variant",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the arrow wrapper",
      },
    ],
  },
  {
    title: "TooltipShortcut",
    props: [
      {
        prop: "keys",
        type: "string | readonly string[]",
        default: "-",
        description: "Key(s) rendered as kbd elements",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes for the shortcut container",
      },
    ],
  },
  {
    title: "TooltipViewport",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          "Additional CSS classes for the animated shared-tooltip viewport",
      },
    ],
  },
  {
    title: "SharedTooltip",
    props: [
      {
        prop: "handle",
        type: "Tooltip.Handle<SharedTooltipPayload>",
        default: "-",
        description: "The shared handle the triggers attach to",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"top"',
        description: "Preferred side of the trigger to render",
      },
      {
        prop: "variant / size",
        type: "string",
        default: '"default"',
        description: "Same variants and sizes as TooltipContent",
      },
    ],
  },
  {
    title: "SharedTooltipTrigger",
    props: [
      {
        prop: "handle",
        type: "Tooltip.Handle<SharedTooltipPayload>",
        default: "-",
        description: "The shared handle to attach to",
      },
      {
        prop: "label",
        type: "string",
        default: "-",
        description:
          "Label shown in the shared popup and set as the trigger's aria-label",
      },
      {
        prop: "shortcut",
        type: "string | readonly string[]",
        default: "-",
        description: "Shortcut hint(s) shown in the shared popup",
      },
      {
        prop: "render",
        type: "ReactElement | (props, state) => ReactElement",
        default: "-",
        description: "The element to render as (e.g. a Button)",
      },
    ],
  },
  {
    title: "TooltipProvider",
    props: [
      {
        prop: "delay",
        type: "number",
        default: "500",
        description: "Default open delay for all tooltips inside the provider",
      },
      {
        prop: "closeDelay",
        type: "number",
        default: "200",
        description: "Default close delay for all tooltips inside the provider",
      },
      {
        prop: "timeout",
        type: "number",
        default: "400",
        description:
          "Skip window: a tooltip opened within this time of the previous close opens instantly",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const tooltipPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "23 October 2026",
    changes: [
      {
        type: "breaking",
        title: "TooltipProvider Now Renders the Real Provider",
        description:
          "TooltipProvider previously rendered a fragment, so adjacent tooltips never shared delay grouping. It now wraps Base UI's Tooltip.Provider and is mounted once at the app root.",
      },
      {
        type: "breaking",
        title: "Trigger Delays No Longer Forced",
        description:
          "Every trigger previously received delay=500 / closeDelay=200 from context, so provider-level and trigger-level delays could never apply. Delays are now passed only when explicitly set. Rename delayDuration → delay and closeDelayDuration → closeDelay; the old names still work but are deprecated for one release.",
      },
      {
        type: "breaking",
        title: "SimpleTooltip No Longer Wraps Children in a Button",
        description:
          "The trigger child is rendered via render={children}. Children must accept a ref and spread props (a Kira Button does). This fixes invalid nested <button> HTML. Icon-only triggers should carry an aria-label.",
      },
      {
        type: "breaking",
        title: "Escape Handling and ARIA Wiring Delegated to Base UI",
        description:
          'The custom Escape listener, internalOpen state, manual id/aria-describedby/role="tooltip" wiring was removed — Base UI owns it. Controlled open now works and onOpenChange fires for every reason, including escape-key.',
      },
      {
        type: "fixed",
        title: "Arrow Rendering",
        description:
          "overflow-hidden no longer clips the arrow, and the arrow SVG now rotates per side instead of always pointing up. Uncentered arrows (align start/end) fade out instead of sliding off-center.",
      },
      {
        type: "fixed",
        title: "className and style No Longer Dropped",
        description:
          "Function-form className (Base UI state functions) is preserved via a merge helper, and a consumer style prop no longer silently drops maxWidth. Padding moved fully into the size variants.",
      },
      {
        type: "fixed",
        title: "Interruptible, State-Correct Animations",
        description:
          "Enter/exit animations use data-[starting-style]/data-[ending-style] with data-[instant] and motion-reduce opt-outs instead of one-shot animate-in classes, so grouped and keyboard-triggered opens don't animate.",
      },
      {
        type: "added",
        title: "Shared Toolbar Tooltip",
        description:
          "SharedTooltip + SharedTooltipTrigger + createTooltipHandle render one popup for a whole toolbar. It glides between buttons (Base UI 1.9 detached triggers, payload, and Viewport) and shows keyboard shortcuts, like Figma and Linear toolbars.",
      },
      {
        type: "added",
        title: "Keyboard Shortcut Hints",
        description:
          "The shortcut prop and TooltipShortcut component render <kbd> key hints such as ⌘ B. They are visual-only; advertise the real shortcut with aria-keyshortcuts on the trigger.",
      },
      {
        type: "added",
        title: "Positioning Passthrough and Viewport-Aware Width",
        description:
          "New alignOffset, collisionPadding, positionerProps, and portalProps props on TooltipContent, and maxWidth is now additionally capped by --available-width so tooltips never overflow the viewport in narrow containers.",
      },
      {
        type: "added",
        title: "Disabled Support on SimpleTooltip",
        description:
          "SimpleTooltip accepts disabled to turn the tooltip off without unmounting the tree.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
