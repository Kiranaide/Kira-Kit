import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconSettings,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";

export function TooltipPage() {
  return (
    <TooltipProvider>
      <div className="p-8 max-w-4xl space-y-12">
        <header>
          <h1 className="text-3xl font-bold mb-2">Tooltip</h1>
          <p className="text-muted-foreground">
            A popup that displays information on hover or focus.
          </p>
        </header>

        {/* Basic Tooltip */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Basic Tooltip
          </h2>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Hover me</Button>}
              />
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Style Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Style Variants
          </h2>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Secondary</Button>}
              />
              <TooltipContent variant="secondary">
                Secondary tooltip
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Outline</Button>}
              />
              <TooltipContent variant="outline">Outline tooltip</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="destructive">Destructive</Button>}
              />
              <TooltipContent variant="destructive">
                Destructive action
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Size Variants
          </h2>
          <div className="flex gap-4 items-center">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="sm">
                    Small
                  </Button>
                }
              />
              <TooltipContent size="sm">Small tooltip</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Default</Button>}
              />
              <TooltipContent>Default tooltip</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="lg">
                    Large
                  </Button>
                }
              />
              <TooltipContent size="lg">Large tooltip text</TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Interactive */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Interactive (Hoverable)
          </h2>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">Hoverable Content</Button>}
              />
              <TooltipContent className="p-0 overflow-hidden">
                <div className="p-3 bg-card border border-border rounded-md shadow-sm w-48">
                  <p className="font-medium text-sm mb-2">
                    Interactive Content
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    You can move your mouse into this tooltip to click links or
                    buttons.
                  </p>
                  <Button size="sm" className="w-full">
                    Click Me
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* With Arrow */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            With Arrow
          </h2>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="outline">With Arrow</Button>}
              />
              <TooltipContent>
                <TooltipArrow />
                Tooltip with arrow
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Icon Buttons with Tooltips */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Icon Buttons with Tooltips
          </h2>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon">
                    <IconPlus className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Add new item</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon">
                    <IconEdit className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" size="icon">
                    <IconSettings className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <IconTrash className="h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Usage */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Usage
          </h2>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">
              {`import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<Button>Hover me</Button>} />
    <TooltipContent>
      Tooltip content
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
