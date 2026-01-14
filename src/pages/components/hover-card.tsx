"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardAnchor,
  HoverCardHeader,
  HoverCardFooter,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardLoading,
  HoverCardImage,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconMapPin, IconUsers } from "@tabler/icons-react";

export function HoverCardPage() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Hover Card</h1>
        <p className="text-muted-foreground">
          A card that appears on hover, for previewing content. Built on Base
          UI's PreviewCard.
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
            <HoverCardArrow />
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

      {/* With Pre-styled Sections */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Pre-styled Sections
        </h2>
        <p className="text-sm text-muted-foreground">
          Use HoverCardHeader, HoverCardTitle, HoverCardDescription, and
          HoverCardFooter for consistent styling.
        </p>
        <HoverCard>
          <HoverCardTrigger
            render={<Button variant="outline">View Profile</Button>}
          />
          <HoverCardContent size="lg">
            <HoverCardArrow />
            <HoverCardHeader>
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <HoverCardTitle>Jane Doe</HoverCardTitle>
                <HoverCardDescription>
                  Senior Software Engineer
                </HoverCardDescription>
              </div>
            </HoverCardHeader>
            <p className="text-sm text-muted-foreground">
              Building beautiful user interfaces with React. Open source
              enthusiast and design systems advocate.
            </p>
            <HoverCardFooter>
              <div className="flex items-center gap-1">
                <IconMapPin className="h-3 w-3" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-1">
                <IconUsers className="h-3 w-3" />
                1.2k followers
              </div>
            </HoverCardFooter>
          </HoverCardContent>
        </HoverCard>
      </section>

      {/* HoverCardAnchor - Fixed for Links */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          HoverCardAnchor (Link Convenience)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use HoverCardAnchor for inline links with hover preview.
        </p>
        <div className="max-w-md p-4 border rounded-lg">
          <p className="text-sm">
            The principles of good{" "}
            <HoverCard>
              <HoverCardAnchor href="#">typography</HoverCardAnchor>
              <HoverCardContent size="lg">
                <HoverCardArrow />
                <HoverCardImage
                  src="https://images.unsplash.com/photo-1619615391095-dfa29e1672ef?q=80&w=448&h=200"
                  alt="Typography"
                  aspectRatio="video"
                />
                <HoverCardTitle>Typography</HoverCardTitle>
                <HoverCardDescription>
                  The art and science of arranging type to make written language
                  clear, visually appealing, and effective.
                </HoverCardDescription>
              </HoverCardContent>
            </HoverCard>{" "}
            remain relevant in the digital age. Good typography makes reading
            effortless and enhances the user experience.
          </p>
        </div>
      </section>

      {/* Blur Variant */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Blur Variant (Glassmorphism)
        </h2>
        <HoverCard>
          <HoverCardTrigger
            render={<Button variant="outline">Hover for Glass Effect</Button>}
          />
          <HoverCardContent variant="blur" size="md">
            <HoverCardArrow />
            <HoverCardTitle>Glassmorphism</HoverCardTitle>
            <HoverCardDescription>
              A translucent backdrop with blur effect for a modern look.
            </HoverCardDescription>
          </HoverCardContent>
        </HoverCard>
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <p className="text-sm text-muted-foreground">
          Use HoverCardLoading for async content.
        </p>
        <HoverCard onOpenChange={(open) => open && simulateLoad()}>
          <HoverCardTrigger
            render={<Button variant="outline">Async Content</Button>}
          />
          <HoverCardContent size="md">
            <HoverCardArrow />
            {isLoading ? (
              <HoverCardLoading message="Fetching profile..." />
            ) : (
              <>
                <HoverCardTitle>Content Loaded!</HoverCardTitle>
                <HoverCardDescription>
                  This content was loaded asynchronously.
                </HoverCardDescription>
              </>
            )}
          </HoverCardContent>
        </HoverCard>
      </section>

      {/* Size Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Size Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Small (w-48)
                </Button>
              }
            />
            <HoverCardContent size="sm">
              <HoverCardArrow />
              <p className="text-sm">Small hover card content.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Medium (w-64)
                </Button>
              }
            />
            <HoverCardContent size="md">
              <HoverCardArrow />
              <p className="text-sm">Medium hover card content.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Large (w-80)
                </Button>
              }
            />
            <HoverCardContent size="lg">
              <HoverCardArrow />
              <p className="text-sm">
                Large hover card content with more space.
              </p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  XL (w-96)
                </Button>
              }
            />
            <HoverCardContent size="xl">
              <HoverCardArrow />
              <p className="text-sm">
                Extra large hover card for rich content.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </section>

      {/* Positioning */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Positioning
        </h2>
        <div className="flex flex-wrap gap-4">
          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Top
                </Button>
              }
            />
            <HoverCardContent side="top" sideOffset={12}>
              <HoverCardArrow />
              <p className="text-sm">Content appears above the trigger.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Left
                </Button>
              }
            />
            <HoverCardContent side="left" sideOffset={12}>
              <HoverCardArrow />
              <p className="text-sm">Content appears to the left.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Right
                </Button>
              }
            />
            <HoverCardContent side="right" sideOffset={12}>
              <HoverCardArrow />
              <p className="text-sm">Content appears to the right.</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger
              render={
                <Button variant="outline" size="sm">
                  Bottom
                </Button>
              }
            />
            <HoverCardContent side="bottom" sideOffset={12}>
              <HoverCardArrow />
              <p className="text-sm">Content appears below (default).</p>
            </HoverCardContent>
          </HoverCard>
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
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardAnchor,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardFooter,
  HoverCardLoading,
  HoverCardImage,
} from "@/components/ui/hover-card"

// Basic usage
<HoverCard>
  <HoverCardTrigger render={<Button>Hover me</Button>} />
  <HoverCardContent size="md" side="bottom">
    <HoverCardArrow />
    <p>Preview content here</p>
  </HoverCardContent>
</HoverCard>

// With pre-styled sections
<HoverCard>
  <HoverCardTrigger render={<Button>View Profile</Button>} />
  <HoverCardContent size="lg" variant="blur">
    <HoverCardHeader>
      <Avatar />
      <div>
        <HoverCardTitle>Jane Doe</HoverCardTitle>
        <HoverCardDescription>Engineer</HoverCardDescription>
      </div>
    </HoverCardHeader>
    <HoverCardFooter>Footer content</HoverCardFooter>
  </HoverCardContent>
</HoverCard>

// For inline links
<HoverCard>
  <HoverCardAnchor href="#">Link text</HoverCardAnchor>
  <HoverCardContent>
    <HoverCardImage src="..." aspectRatio="video" />
    Preview content
  </HoverCardContent>
</HoverCard>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
