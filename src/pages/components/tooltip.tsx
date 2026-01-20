import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconSettings,
  IconTrash,
  IconEdit,
  IconInfoCircle,
} from "@tabler/icons-react";

export function TooltipPage() {
  return (
    <TooltipProvider>
      <div className="p-8 max-w-4xl space-y-12">
        <header>
          <h1 className="text-3xl font-bold mb-2">Tooltip</h1>
          <p className="text-muted-foreground">
            Accessible popup that displays information on hover or focus.
            WCAG 2.2 AA compliant with Escape key dismiss and proper ARIA
            attributes.
          </p>
        </header>

        {/* Simple Tooltip API */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Simple Tooltip (Shorthand API)
          </h2>
          <p className="text-sm text-muted-foreground">
            The easiest way to add tooltips. Just wrap your trigger with{" "}
            <code className="bg-muted px-1 rounded">SimpleTooltip</code>.
          </p>
          <div className="flex gap-4">
            <SimpleTooltip content="Save your changes">
              <Button variant="outline">Hover me</Button>
            </SimpleTooltip>

            <SimpleTooltip content="This will delete the item" side="right">
              <Button variant="destructive">Delete</Button>
            </SimpleTooltip>

            <SimpleTooltip content="Open settings panel" side="bottom">
              <Button variant="ghost" size="icon">
                <IconSettings className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          </div>
        </section>

        {/* Keyboard Accessibility */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Keyboard Accessibility
          </h2>
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md space-y-2">
            <p className="flex items-center gap-2">
              <IconInfoCircle className="h-4 w-4" />
              <strong>Tab</strong> - Focus trigger to show tooltip
            </p>
            <p className="flex items-center gap-2">
              <IconInfoCircle className="h-4 w-4" />
              <strong>Escape</strong> - Dismiss tooltip (WCAG 1.4.13 requirement)
            </p>
          </div>
          <div className="flex gap-4">
            <SimpleTooltip content="Tab to focus, Escape to dismiss">
              <Button variant="outline">Try keyboard navigation</Button>
            </SimpleTooltip>
          </div>
        </section>

        {/* Style Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Style Variants
          </h2>
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
        </section>

        {/* Size Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Size Variants
          </h2>
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
        </section>

        {/* Positioning */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Positioning
          </h2>
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
        </section>

        {/* Without Arrow */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Without Arrow
          </h2>
          <div className="flex gap-4">
            <SimpleTooltip content="No arrow tooltip" showArrow={false}>
              <Button variant="outline">No Arrow</Button>
            </SimpleTooltip>
          </div>
        </section>

        {/* Custom Delay */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Custom Delay
          </h2>
          <p className="text-sm text-muted-foreground">
            Default delay is 500ms (industry standard). Customize with{" "}
            <code>delayDuration</code> prop.
          </p>
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
        </section>

        {/* Advanced API */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Advanced API (Compound Components)
          </h2>
          <p className="text-sm text-muted-foreground">
            For more control, use the compound component pattern.
          </p>
          <div className="flex gap-4">
            <Tooltip delayDuration={300}>
              <TooltipTrigger>
                <Button variant="outline">Advanced Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent side="top" variant="outline" showArrow={true}>
                <p className="font-medium">Advanced Tooltip</p>
                <p className="text-xs text-muted-foreground mt-1">
                  With custom content structure
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Icon Buttons with Tooltips */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Icon Buttons with Tooltips
          </h2>
          <p className="text-sm text-muted-foreground">
            Tooltips are essential for icon-only buttons to provide context.
          </p>
          <div className="flex gap-2">
            <SimpleTooltip content="Add new item">
              <Button variant="outline" size="icon">
                <IconPlus className="h-4 w-4" />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Edit">
              <Button variant="outline" size="icon">
                <IconEdit className="h-4 w-4" />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Settings">
              <Button variant="outline" size="icon">
                <IconSettings className="h-4 w-4" />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Delete" variant="destructive">
              <Button variant="ghost" size="icon">
                <IconTrash className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          </div>
        </section>

        {/* Toolbar Example */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Toolbar Example
          </h2>
          <div className="inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30">
            <SimpleTooltip content="Add new (Ctrl+N)" delayDuration={300}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconPlus className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content="Edit (Ctrl+E)" delayDuration={300}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconEdit className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
            <div className="w-px h-6 bg-border mx-1" />
            <SimpleTooltip content="Settings" delayDuration={300}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconSettings className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip
              content="Delete (Del)"
              variant="destructive"
              delayDuration={300}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <IconTrash className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          </div>
        </section>

        {/* Usage */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">
              {`import { SimpleTooltip } from "@/components/ui/tooltip"
// Or for advanced usage:
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

{/* Simple API (recommended for most cases) */}
<SimpleTooltip content="Save your changes">
  <Button>Save</Button>
</SimpleTooltip>

{/* With options */}
<SimpleTooltip 
  content="Delete permanently"
  variant="destructive"
  side="right"
  delayDuration={300}
>
  <Button variant="destructive">Delete</Button>
</SimpleTooltip>

{/* Advanced API for complex content */}
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
</TooltipProvider>`}
            </pre>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
}
