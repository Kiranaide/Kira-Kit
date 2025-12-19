import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconCalendar } from "@tabler/icons-react";

export function HoverCardPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Hover Card</h1>
        <p className="text-muted-foreground">
          A card that appears on hover, for previewing content.
        </p>
      </header>

      {/* Basic Hover Card */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Hover Card
        </h2>
        <HoverCard>
          <HoverCardTrigger render={<Button variant="link">@kirakit</Button>} />
          <HoverCardContent>
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>KK</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">@kirakit</h4>
                <p className="text-sm text-muted-foreground">
                  A beautiful UI component library built with Base UI.
                </p>
                <div className="flex items-center pt-2 text-xs text-muted-foreground">
                  <IconCalendar className="mr-1 h-3 w-3" />
                  Joined December 2024
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </section>

      {/* Simple Preview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Simple Preview
        </h2>
        <p className="text-sm text-muted-foreground">
          Hover over the link to see more info:
        </p>
        <HoverCard>
          <HoverCardTrigger
            render={
              <a href="#" className="text-primary underline underline-offset-4">
                React Documentation
              </a>
            }
          />
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">React – A JavaScript library</h4>
              <p className="text-sm text-muted-foreground">
                The library for web and native user interfaces. Build user
                interfaces out of individual pieces called components.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

<HoverCard>
  <HoverCardTrigger render={<Button>Hover me</Button>} />
  <HoverCardContent>
    <p>Preview content here</p>
  </HoverCardContent>
</HoverCard>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
