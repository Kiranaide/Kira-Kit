"use client";

import { useState } from "react";
import {
  IconEye,
  IconPhoto,
  IconLink,
  IconCalendar,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";

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
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
    </div>
  );
}

const basicCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function BasicDemo() {
  return (
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
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}`;

function BasicWithSectionsDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
    </div>
  );
}

const basicWithSectionsCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardFooter,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function BasicWithSectionsDemo() {
  return (
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
          Building beautiful user interfaces with React.
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
  )
}`;

function WithImageDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline">Hover for Image</Button>}
        />
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
      </HoverCard>
    </div>
  );
}

const withImageCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardImage,
  HoverCardTitle,
  HoverCardDescription,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function WithImageDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="outline">Hover for Image</Button>}
      />
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
    </HoverCard>
  )
}`;

function InlineLinkDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
    </div>
  );
}

const inlineLinkCode = `import {
  HoverCard,
  HoverCardAnchor,
  HoverCardContent,
  HoverCardArrow,
  HoverCardImage,
  HoverCardTitle,
  HoverCardDescription,
} from "@/components/ui/hover-card"

export function InlineLinkDemo() {
  return (
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
      remain relevant in the digital age.
    </p>
  )
}`;

function BlurDemo() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
    </div>
  );
}

const blurCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTitle,
  HoverCardDescription,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function BlurDemo() {
  return (
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
  )
}`;

function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoad = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
    </div>
  );
}

const loadingCode = `import { useState } from "react"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTitle,
  HoverCardDescription,
  HoverCardLoading,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const simulateLoad = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
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
  )
}`;

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
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
          <p className="text-sm">Large hover card content with more space.</p>
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
          <p className="text-sm">Extra large hover card for rich content.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

const sizesCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function SizesDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">Small (w-48)</Button>}
        />
        <HoverCardContent size="sm">
          <HoverCardArrow />
          <p className="text-sm">Small hover card content.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">Medium (w-64)</Button>}
        />
        <HoverCardContent size="md">
          <HoverCardArrow />
          <p className="text-sm">Medium hover card content.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">Large (w-80)</Button>}
        />
        <HoverCardContent size="lg">
          <HoverCardArrow />
          <p className="text-sm">Large hover card content with more space.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger
          render={<Button variant="outline" size="sm">XL (w-96)</Button>}
        />
        <HoverCardContent size="xl">
          <HoverCardArrow />
          <p className="text-sm">Extra large hover card for rich content.</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}`;

function PositioningDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 min-h-[200px]">
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
  );
}

const positioningCode = `import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

export function PositioningDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Top</Button>} />
        <HoverCardContent side="top" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears above the trigger.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Left</Button>} />
        <HoverCardContent side="left" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears to the left.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Right</Button>} />
        <HoverCardContent side="right" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears to the right.</p>
        </HoverCardContent>
      </HoverCard>

      <HoverCard>
        <HoverCardTrigger render={<Button variant="outline" size="sm">Bottom</Button>} />
        <HoverCardContent side="bottom" sideOffset={12}>
          <HoverCardArrow />
          <p className="text-sm">Content appears below (default).</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}`;

const usageCode = `import {
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
</HoverCard>`;

const apiSections = [
  {
    title: "HoverCard",
    props: [
      {
        prop: "open",
        type: "boolean",
        description: "Controlled open state of the hover card.",
      },
      {
        prop: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state for uncontrolled mode.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback when open state changes.",
      },
      {
        prop: "openDelay",
        type: "number",
        default: "200",
        description: "Delay in ms before the hover card opens.",
      },
      {
        prop: "closeDelay",
        type: "number",
        default: "300",
        description: "Delay in ms before the hover card closes.",
      },
    ],
  },
  {
    title: "HoverCardContent",
    props: [
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Width of the hover card content.",
      },
      {
        prop: "variant",
        type: '"default" | "blur"',
        default: '"default"',
        description: "Visual style variant. Blur adds glassmorphism effect.",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "Preferred side to position the content.",
      },
      {
        prop: "sideOffset",
        type: "number",
        default: "8",
        description: "Distance from the trigger in pixels.",
      },
      {
        prop: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alignment relative to the trigger.",
      },
    ],
  },
  {
    title: "HoverCardTrigger",
    props: [
      {
        prop: "render",
        type: "ReactElement",
        description: "The element to render as the hover trigger.",
      },
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto child element instead of wrapping.",
      },
    ],
  },
  {
    title: "HoverCardAnchor",
    props: [
      {
        prop: "href",
        type: "string",
        description: "URL for the anchor link.",
      },
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for the link.",
      },
    ],
  },
  {
    title: "HoverCardImage",
    props: [
      {
        prop: "src",
        type: "string",
        description: "Image source URL.",
      },
      {
        prop: "alt",
        type: "string",
        description: "Alternative text for the image.",
      },
      {
        prop: "aspectRatio",
        type: '"square" | "video" | "wide"',
        default: '"video"',
        description: "Aspect ratio of the image container.",
      },
    ],
  },
  {
    title: "HoverCardLoading",
    props: [
      {
        prop: "message",
        type: "string",
        default: '"Loading..."',
        description: "Loading message to display.",
      },
    ],
  },
];

const features = [
  {
    title: "Preview on Hover",
    description:
      "Show rich content previews without navigation. Perfect for user profiles, link previews, and contextual information.",
    icon: <IconEye className="h-4 w-4" />,
  },
  {
    title: "Rich Media Support",
    description:
      "Built-in components for images, headers, footers, and loading states with consistent styling.",
    icon: <IconPhoto className="h-4 w-4" />,
  },
  {
    title: "Inline Links",
    description:
      "HoverCardAnchor provides seamless inline link integration with hover previews for enhanced UX.",
    icon: <IconLink className="h-4 w-4" />,
  },
];

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Hover Card"
        description="Simple hover card with avatar and user info."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "basic-with-sections",
    label: "With Sections",
    demo: (
      <DemoWrapper
        title="Pre-styled Sections"
        description="Use HoverCardHeader, HoverCardTitle, HoverCardDescription, and HoverCardFooter for consistent styling."
        code={basicWithSectionsCode}
      >
        <BasicWithSectionsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "with-image",
    label: "With Image",
    demo: (
      <DemoWrapper
        title="Hover Card with Image"
        description="Display an image preview with HoverCardImage component."
        code={withImageCode}
      >
        <WithImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "without-trigger",
    label: "Without Trigger",
    demo: (
      <DemoWrapper
        title="Inline Link (No Separate Trigger)"
        description="Use HoverCardAnchor for inline links that trigger the hover card directly."
        code={inlineLinkCode}
      >
        <InlineLinkDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "blur-variant",
    label: "Blur Variant",
    demo: (
      <DemoWrapper
        title="Blur Variant (Glassmorphism)"
        description="Translucent backdrop with blur effect for a modern look."
        code={blurCode}
      >
        <BlurDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading-state",
    label: "Loading State",
    demo: (
      <DemoWrapper
        title="Loading State"
        description="Use HoverCardLoading for async content fetching."
        code={loadingCode}
      >
        <LoadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="Available sizes: sm (w-48), md (w-64), lg (w-80), xl (w-96)."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "positioning",
    label: "Positioning",
    demo: (
      <DemoWrapper
        title="Positioning"
        description="Control placement with side and sideOffset props."
        code={positioningCode}
      >
        <PositioningDemo />
      </DemoWrapper>
    ),
  },
];

export function HoverCardPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Hover Card"
        description="A card that appears on hover, for previewing content. Built on Base UI's PreviewCard primitive with pre-styled sections and loading states."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation patterns for HoverCard"
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for HoverCard components"
      />
    </ComponentPage>
  );
}
