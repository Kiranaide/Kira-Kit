import {
  IconAccessible,
  IconPalette,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
} from "@/components/ui/tooltip";
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
      <SimpleTooltip content="Instant tooltip" delayDuration={0}>
        <Button variant="outline">No delay (0ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Quick tooltip" delayDuration={200}>
        <Button variant="outline">Quick (200ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Default delay" delayDuration={500}>
        <Button variant="outline">Default (500ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Slow tooltip" delayDuration={1000}>
        <Button variant="outline">Slow (1000ms)</Button>
      </SimpleTooltip>
    </div>
  );
}

const delayCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function DelayDemo() {
  return (
    <div className="flex gap-4">
      <SimpleTooltip content="Instant tooltip" delayDuration={0}>
        <Button variant="outline">No delay (0ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Quick tooltip" delayDuration={200}>
        <Button variant="outline">Quick (200ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Default delay" delayDuration={500}>
        <Button variant="outline">Default (500ms)</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Slow tooltip" delayDuration={1000}>
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
    <div className="flex gap-4 items-center justify-center">
      <SimpleTooltip content="With arrow (default)" showArrow={true}>
        <Button variant="outline">With Arrow</Button>
      </SimpleTooltip>
      <SimpleTooltip content="No arrow tooltip" showArrow={false}>
        <Button variant="outline">No Arrow</Button>
      </SimpleTooltip>
    </div>
  );
}

const arrowCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function ArrowDemo() {
  return (
    <div className="flex gap-4">
      <SimpleTooltip content="With arrow (default)" showArrow={true}>
        <Button variant="outline">With Arrow</Button>
      </SimpleTooltip>
      <SimpleTooltip content="No arrow tooltip" showArrow={false}>
        <Button variant="outline">No Arrow</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function IconButtonsDemo() {
  return (
    <div className="flex gap-2 items-center justify-center">
      <SimpleTooltip content="Add new item">
        <Button variant="outline" size="icon">
          <IconAccessible className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Edit">
        <Button variant="outline" size="icon">
          <IconPalette className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Settings">
        <Button variant="outline" size="icon">
          <IconAccessible className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Delete" variant="destructive">
        <Button variant="ghost" size="icon">
          <IconAccessible className="h-4 w-4" />
        </Button>
      </SimpleTooltip>
    </div>
  );
}

const iconButtonsCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export function IconButtonsDemo() {
  return (
    <div className="flex gap-2">
      <SimpleTooltip content="Add new item">
        <Button variant="outline" size="icon">+</Button>
      </SimpleTooltip>
      <SimpleTooltip content="Edit">
        <Button variant="outline" size="icon">Edit</Button>
      </SimpleTooltip>
    </div>
  )
}`;

function RichContentDemo() {
  return (
    <div className="flex gap-4 items-center justify-center">
      <Tooltip delayDuration={300}>
        <TooltipTrigger>
          <Button variant="outline">Rich Content</Button>
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
      <Tooltip delayDuration={300}>
        <TooltipTrigger>
          <Button variant="outline">Rich Content</Button>
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

export default function TooltipPage() {
  const features = [
    {
      title: "Accessible",
      description: "WCAG 2.2 AA compliant with proper ARIA attributes and keyboard navigation.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Customizable",
      description: "Multiple variants, sizes, positions, and delay options.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Keyboard Support",
      description: "Full keyboard support for accessibility and screen reader compatibility.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
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
      demo: (
        <DemoWrapper
          title="Custom Delay"
          description="Default delay is 500ms (industry standard). Customize with delayDuration prop."
          code={delayCode}
        >
          <DelayDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "variants",
      label: "Variants",
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
      demo: (
        <DemoWrapper
          title="Arrow Options"
          description="Toggle the arrow pointer on or off."
          code={arrowCode}
        >
          <ArrowDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "icon-buttons",
      label: "Icon Buttons",
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
  ];

  const keyboardShortcuts = [
    { keys: "Tab", description: "Focus trigger to show tooltip" },
    { keys: "Escape", description: "Dismiss tooltip (WCAG 1.4.13)" },
  ];

  const usageCode = `import { SimpleTooltip } from "@/components/ui/tooltip"
// Or for advanced usage:
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

// Simple API (recommended for most cases)
<SimpleTooltip content="Save your changes">
  <Button>Save</Button>
</SimpleTooltip>

// With options
<SimpleTooltip 
  content="Delete permanently"
  variant="destructive"
  side="right"
  delayDuration={300}
>
  <Button variant="destructive">Delete</Button>
</SimpleTooltip>

// Advanced API for complex content
<TooltipProvider>
  <Tooltip delayDuration={300}>
    <TooltipTrigger>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipContent side="top" variant="outline">
      <p className="font-medium">Title</p>
      <p className="text-xs text-muted-foreground">
        Description text
      </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`;

  const apiReference = [
    {
      title: "SimpleTooltip",
      props: [
        { prop: "content", type: "React.ReactNode", default: "-", description: "The tooltip content to display" },
        { prop: "children", type: "React.ReactNode", default: "-", description: "The trigger element" },
        { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side of trigger to render" },
        { prop: "variant", type: '"default" | "secondary" | "outline" | "muted" | "destructive"', default: '"default"', description: "Visual style variant" },
        { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size of the tooltip" },
        { prop: "showArrow", type: "boolean", default: "true", description: "Whether to show the arrow pointer" },
        { prop: "delayDuration", type: "number", default: "500", description: "Delay in ms before showing tooltip" },
      ],
    },
    {
      title: "TooltipContent",
      props: [
        { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side of trigger to render" },
        { prop: "sideOffset", type: "number", default: "4", description: "Distance from trigger in pixels" },
        { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment along the trigger edge" },
        { prop: "variant", type: '"default" | "secondary" | "outline" | "muted" | "destructive"', default: '"default"', description: "Visual style variant" },
        { prop: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Size of the tooltip" },
        { prop: "showArrow", type: "boolean", default: "true", description: "Whether to show the arrow pointer" },
      ],
    },
    {
      title: "Tooltip",
      props: [
        { prop: "open", type: "boolean", default: "-", description: "Controlled open state" },
        { prop: "onOpenChange", type: "(open: boolean) => void", default: "-", description: "Callback when open state changes" },
        { prop: "delayDuration", type: "number", default: "500", description: "Delay in ms before showing tooltip" },
        { prop: "disableHoverableContent", type: "boolean", default: "false", description: "Prevent hovering over content from keeping it open" },
      ],
    },
    {
      title: "TooltipProvider",
      props: [
        { prop: "delayDuration", type: "number", default: "500", description: "Default delay for all tooltips in provider" },
        { prop: "skipDelayDuration", type: "number", default: "300", description: "Delay to skip before showing next tooltip" },
      ],
    },
  ];

  return (
    <TooltipProvider>
      <ComponentPage>
        <PageHeader
          title="Tooltip"
          description="Accessible popup that displays information on hover or focus. WCAG 2.2 AA compliant with Escape key dismiss and proper ARIA attributes."
          version="v1.0"
        />

        <FeatureGrid features={features} />

        <DemoTabs tabs={demoTabs} />

        <KeyboardShortcuts shortcuts={keyboardShortcuts} />

        <UsageBlock code={usageCode} />

        <APIReference sections={apiReference} />
      </ComponentPage>
    </TooltipProvider>
  );
}
