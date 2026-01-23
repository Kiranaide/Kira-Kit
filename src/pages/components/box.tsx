import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  APIReference,
} from "@/components/docs";

function BasicBoxDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box p={4} bg="muted" rounded="lg">
          Box with padding
        </Box>
        <Box p={4} shadow="md" rounded="lg" bg="background" border>
          Box with shadow
        </Box>
        <Box p={4} bg="primary" color="primary-foreground" rounded="lg">
          Custom colors
        </Box>
      </div>
    </div>
  );
}

const basicBoxCode = `import { Box } from "@/components/ui/box"

// Padding & Background
<Box p={4} bg="muted" rounded="lg">
  Box with padding
</Box>

// Shadow
<Box p={4} shadow="md" rounded="lg" bg="background" border>
  Box with shadow
</Box>

// Custom Colors
<Box p={4} bg="primary" color="primary-foreground" rounded="lg">
  Custom colors
</Box>`;

function RoundedBoxDemo() {
  const [selected, setSelected] = useState("lg");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium">Selected:</span>
        <Badge>{selected}</Badge>
      </div>
      <div className="flex flex-wrap gap-4">
        {(
          ["none", "sm", "default", "md", "lg", "xl", "2xl", "full"] as const
        ).map((rounded) => (
          <Box
            key={rounded}
            p={4}
            bg={rounded === selected ? "primary/20" : "muted"}
            rounded={rounded}
            className={
              rounded === selected
                ? "ring-2 ring-primary ring-offset-2"
                : "cursor-pointer"
            }
            onClick={() => setSelected(rounded)}
          >
            <span className="text-xs">{rounded}</span>
          </Box>
        ))}
      </div>
    </div>
  );
}

const roundedBoxCode = `import { Box } from "@/components/ui/box"

// Border radius variants
<Box p={4} rounded="lg">Large radius</Box>
<Box p={4} rounded="full">Pill</Box>
<Box p={4} rounded="none">No radius</Box>

// All variants
{["none", "sm", "default", "md", "lg", "xl", "2xl", "full"].map((rounded) => (
  <Box key={rounded} p={4} rounded={rounded}>
    {rounded}
  </Box>
))}`;

function ShadowBoxDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {(["none", "sm", "default", "md", "lg", "xl", "2xl"] as const).map(
        (shadow) => (
          <Box
            key={shadow}
            p={4}
            shadow={shadow}
            rounded="lg"
            bg="background"
            className="min-w-24 text-center"
          >
            <span className="text-xs">{shadow}</span>
          </Box>
        ),
      )}
    </div>
  );
}

const shadowBoxCode = `import { Box } from "@/components/ui/box"

// Shadow variants
<Box p={4} shadow="sm">Small shadow</Box>
<Box p={4} shadow="md">Medium shadow</Box>
<Box p={4} shadow="lg">Large shadow</Box>
<Box p={4} shadow="xl">Extra large</Box>

// All variants
{["none", "sm", "default", "md", "lg", "xl", "2xl"].map((shadow) => (
  <Box key={shadow} p={4} shadow={shadow} rounded="lg" bg="background">
    {shadow}
  </Box>
))}`;

function SemanticBoxDemo() {
  return (
    <div className="space-y-4">
      <Box as="article" p={6} rounded="lg" border shadow="sm" bg="background">
        <h4 className="font-semibold mb-2">Article Title</h4>
        <p className="text-muted-foreground text-sm">
          This Box renders as an &lt;article&gt; element for semantic HTML. Good
          for blog posts, news items, and independent content.
        </p>
      </Box>

      <Box as="section" p={6} rounded="lg" border shadow="sm" bg="muted/50">
        <h4 className="font-semibold mb-2">Section Title</h4>
        <p className="text-muted-foreground text-sm">
          This Box renders as a &lt;section&gt; element. Good for grouping
          related content.
        </p>
      </Box>
    </div>
  );
}

const semanticBoxCode = `import { Box } from "@/components/ui/box"

// Semantic Box (renders as <article>)
<Box as="article" p={6} rounded="lg" border shadow="sm">
  <h2>Article Title</h2>
  <p>Content</p>
</Box>

// Section element
<Box as="section" p={6} rounded="lg" border shadow="sm">
  <h2>Section Title</h2>
  <p>Content</p>
</Box>

// Other semantic elements
<Box as="header" p={4}>Header content</Box>
<Box as="footer" p={4}>Footer content</Box>
<Box as="nav" p={4}>Navigation</Box>
<Box as="aside" p={4}>Sidebar content</Box>`;

function CardLikeBoxDemo() {
  return (
    <Box
      p={6}
      rounded="xl"
      shadow="lg"
      bg="background"
      border
      className="max-w-sm"
    >
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">John Doe</span>
            <Badge variant="secondary">Pro</Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            Software Engineer
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Badge variant="secondary">React</Badge>
        <Badge variant="secondary">TypeScript</Badge>
        <Badge variant="secondary">Node.js</Badge>
      </div>
    </Box>
  );
}

const cardLikeBoxCode = `import { Box } from "@/components/ui/box"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Quick card with Box
<Box p={6} rounded="xl" shadow="lg" bg="background" border>
  <div className="flex items-center gap-4">
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <div className="flex-1 space-y-1">
      <div className="flex items-center gap-2">
        <span className="font-semibold">John Doe</span>
        <Badge variant="secondary">Pro</Badge>
      </div>
      <span className="text-sm text-muted-foreground">Software Engineer</span>
    </div>
  </div>
  <div className="flex gap-2 mt-4">
    <Badge variant="secondary">React</Badge>
    <Badge variant="secondary">TypeScript</Badge>
  </div>
</Box>`;

function NotificationBoxDemo() {
  return (
    <div className="space-y-4 max-w-md">
      <Box
        p={4}
        rounded="lg"
        bg="primary/10"
        border
        className="border-primary/20"
      >
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <IconCheck className="size-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-medium">Success!</span>
            <span className="text-sm text-muted-foreground">
              Your changes have been saved successfully.
            </span>
          </div>
        </div>
      </Box>

      <Box
        p={4}
        rounded="lg"
        bg="destructive/10"
        border
        className="border-destructive/20"
      >
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
            <IconX className="size-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-medium">Error!</span>
            <span className="text-sm text-muted-foreground">
              Something went wrong. Please try again.
            </span>
          </div>
        </div>
      </Box>
    </div>
  );
}

const notificationBoxCode = `import { Box } from "@/components/ui/box"
import { IconCheck, IconX } from "@tabler/icons-react"

// Success notification
<Box p={4} rounded="lg" bg="primary/10" border className="border-primary/20">
  <div className="flex items-start gap-3">
    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
      <IconCheck className="size-5 text-primary" />
    </div>
    <div className="flex-1 space-y-1">
      <span className="font-medium">Success!</span>
      <span className="text-sm text-muted-foreground">Your changes have been saved.</span>
    </div>
  </div>
</Box>

// Error notification
<Box p={4} rounded="lg" bg="destructive/10" border className="border-destructive/20">
  <div className="flex items-start gap-3">
    <div className="size-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
      <IconX className="size-5 text-destructive" />
    </div>
    <div className="flex-1 space-y-1">
      <span className="font-medium">Error!</span>
      <span className="text-sm text-muted-foreground">Something went wrong.</span>
    </div>
  </div>
</Box>`;

function SizingBoxDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box p={4} bg="muted" rounded="lg" w="full" h="24">
          w="full" h="24"
        </Box>
        <Box p={4} bg="muted" rounded="lg" w="64" h="24">
          w="64" h="24"
        </Box>
        <Box p={4} bg="muted" rounded="lg" minW="32" minH="24">
          minW="32" minH="24"
        </Box>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box p={4} bg="muted" rounded="lg" maxW="md" h="24">
          maxW="md"
        </Box>
        <Box p={4} bg="muted" rounded="lg" maxH="24">
          maxH="24" (overflow hidden)
        </Box>
      </div>
    </div>
  );
}

const sizingBoxCode = `import { Box } from "@/components/ui/box"

// Full width and fixed height
<Box w="full" h="24" p={4} bg="muted" rounded="lg">
  Full width, fixed height
</Box>

// Fixed width and height
<Box w="64" h="24" p={4} bg="muted" rounded="lg">
  Fixed width and height
</Box>

// Minimum dimensions
<Box minW="32" minH="24" p={4} bg="muted" rounded="lg">
  Minimum width and height
</Box>

// Maximum dimensions
<Box maxW="md" p={4} bg="muted" rounded="lg">
  Max width (responsive)
</Box>

// Max height (with overflow)
<Box maxH="24" p={4} bg="muted" rounded="lg" className="overflow-auto">
  Max height with scroll
</Box>`;

function DisplayBoxDemo() {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <Box display="block" p={4} bg="muted" rounded="lg" className="w-24">
        block
      </Box>
      <Box display="inline-block" p={4} bg="muted" rounded="lg">
        inline
      </Box>
      <Box display="inline" p={4} bg="muted" rounded="lg" className="w-16">
        inline
      </Box>
      <Box display="flex" p={4} bg="muted" rounded="lg" className="gap-2">
        <span>flex</span>
        <span>item</span>
      </Box>
      <Box
        display="inline-flex"
        p={4}
        bg="muted"
        rounded="lg"
        className="gap-2"
      >
        <span>inline</span>
        <span>flex</span>
      </Box>
    </div>
  );
}

const displayBoxCode = `import { Box } from "@/components/ui/box"

// Display variants
<Box display="block" p={4}>Block element</Box>
<Box display="inline-block" p={4}>Inline block</Box>
<Box display="inline" p={4}>Inline element</Box>
<Box display="flex" p={4}>Flex container</Box>
<Box display="inline-flex" p={4}>Inline flex</Box>
<Box display="grid" p={4}>Grid container</Box>
<Box display="hidden" p={4}>Hidden</Box>`;

export default function BoxPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Box"
        description="A polymorphic wrapper with utility props for quick styling. Provides semantic HTML support and common styling shortcuts without className bloat."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Polymorphic",
            description:
              "Render as any HTML element (div, article, section, etc.) with the 'as' prop for semantic markup.",
          },
          {
            title: "Utility Props",
            description:
              "Quick styling with shorthand props like p, rounded, shadow, bg, w, h, and more.",
          },
          {
            title: "Flexible",
            description:
              "Combine with Tailwind classes for unlimited styling options while keeping code clean.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Usage"
                description="Common utility props for quick styling."
                code={basicBoxCode}
              >
                <BasicBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "rounded",
            label: "Rounded",
            demo: (
              <DemoWrapper
                title="Border Radius"
                description="All available rounded variants from none to full. Click to select."
                code={roundedBoxCode}
              >
                <RoundedBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "shadow",
            label: "Shadow",
            demo: (
              <DemoWrapper
                title="Box Shadow"
                description="All available shadow variants from none to 2xl."
                code={shadowBoxCode}
              >
                <ShadowBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "semantic",
            label: "Semantic",
            demo: (
              <DemoWrapper
                title="Semantic HTML"
                description="Use the 'as' prop to render semantic elements for better accessibility and SEO."
                code={semanticBoxCode}
              >
                <SemanticBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "card-like",
            label: "Card Like",
            demo: (
              <DemoWrapper
                title="Quick Card Pattern"
                description="Build cards quickly with Box utility props."
                code={cardLikeBoxCode}
              >
                <CardLikeBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "notification",
            label: "Notification",
            demo: (
              <DemoWrapper
                title="Notification Box"
                description="Success and error notifications styled with Box."
                code={notificationBoxCode}
              >
                <NotificationBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sizing",
            label: "Sizing",
            demo: (
              <DemoWrapper
                title="Width and Height"
                description="Control dimensions with w, h, minW, minH, maxW, maxH props."
                code={sizingBoxCode}
              >
                <SizingBoxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "display",
            label: "Display",
            demo: (
              <DemoWrapper
                title="Display Property"
                description="Control CSS display property with variants."
                code={displayBoxCode}
              >
                <DisplayBoxDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <APIReference
        sections={[
          {
            title: "Box Props",
            props: [
              {
                prop: "as",
                type: "BoxElement",
                default: "div",
                description: "Semantic HTML element to render",
              },
              {
                prop: "p",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12",
                default: "-",
                description: "Padding on all sides",
              },
              {
                prop: "px",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8",
                default: "-",
                description: "Horizontal padding",
              },
              {
                prop: "py",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8",
                default: "-",
                description: "Vertical padding",
              },
              {
                prop: "m",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | auto",
                default: "-",
                description: "Margin on all sides",
              },
              {
                prop: "rounded",
                type: "RoundedVariant",
                default: "-",
                description: "Border radius value",
              },
              {
                prop: "shadow",
                type: "ShadowVariant",
                default: "-",
                description: "Box shadow value",
              },
              {
                prop: "bg",
                type: "string",
                default: "-",
                description: "Background color (Tailwind without bg-)",
              },
              {
                prop: "color",
                type: "string",
                default: "-",
                description: "Text color (Tailwind without text-)",
              },
              {
                prop: "border",
                type: "boolean | string",
                default: "-",
                description: "Border (true or custom)",
              },
              {
                prop: "w",
                type: "string",
                default: "-",
                description: "Width (Tailwind without w-)",
              },
              {
                prop: "h",
                type: "string",
                default: "-",
                description: "Height (Tailwind without h-)",
              },
              {
                prop: "minW",
                type: "string",
                default: "-",
                description: "Min width (Tailwind without min-w-)",
              },
              {
                prop: "minH",
                type: "string",
                default: "-",
                description: "Min height (Tailwind without min-h-)",
              },
              {
                prop: "maxW",
                type: "string",
                default: "-",
                description: "Max width (Tailwind without max-w-)",
              },
              {
                prop: "maxH",
                type: "string",
                default: "-",
                description: "Max height (Tailwind without max-h-)",
              },
              {
                prop: "display",
                type: "DisplayVariant",
                default: "-",
                description: "CSS display property",
              },
              {
                prop: "position",
                type: "PositionVariant",
                default: "-",
                description: "CSS position property",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional Tailwind classes",
              },
            ],
          },
          {
            title: "Available Elements",
            props: [
              {
                prop: "div",
                type: "string",
                default: "-",
                description: "Generic container",
              },
              {
                prop: "span",
                type: "string",
                default: "-",
                description: "Inline text container",
              },
              {
                prop: "section",
                type: "string",
                default: "-",
                description: "Thematic grouping",
              },
              {
                prop: "article",
                type: "string",
                default: "-",
                description: "Self-contained content",
              },
              {
                prop: "aside",
                type: "string",
                default: "-",
                description: "Tangential content",
              },
              {
                prop: "main",
                type: "string",
                default: "-",
                description: "Main content area",
              },
              {
                prop: "header",
                type: "string",
                default: "-",
                description: "Page or section header",
              },
              {
                prop: "footer",
                type: "string",
                default: "-",
                description: "Page or section footer",
              },
              {
                prop: "nav",
                type: "string",
                default: "-",
                description: "Navigation links",
              },
              {
                prop: "form",
                type: "string",
                default: "-",
                description: "Form container",
              },
              {
                prop: "fieldset",
                type: "string",
                default: "-",
                description: "Form field grouping",
              },
              {
                prop: "ul/ol/li",
                type: "string",
                default: "-",
                description: "List elements",
              },
              {
                prop: "figure",
                type: "string",
                default: "-",
                description: "Self-contained media",
              },
              {
                prop: "figcaption",
                type: "string",
                default: "-",
                description: "Caption for figure",
              },
              {
                prop: "address",
                type: "string",
                default: "-",
                description: "Contact information",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
