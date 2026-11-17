import type { ComponentProps as ReactComponentProps } from "react";
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
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
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
        <Box p={4} bg="muted" rounded="lg" w="full" h={24}>
          w="full" h={24}
        </Box>
        <Box p={4} bg="muted" rounded="lg" w={64} h={24}>
          w={64} h={24}
        </Box>
        <Box p={4} bg="muted" rounded="lg" minW={32} minH={24}>
          minW={32} minH={24}
        </Box>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box p={4} bg="muted" rounded="lg" maxW="md" h={24}>
          maxW="md"
        </Box>
        <Box p={4} bg="muted" rounded="lg" maxH={24}>
          maxH={24} (overflow hidden)
        </Box>
      </div>
    </div>
  );
}

const sizingBoxCode = `import { Box } from "@/components/ui/box"

// Full width and fixed height
<Box w="full" h={24} p={4} bg="muted" rounded="lg">
  Full width, fixed height
</Box>

// Fixed width and height
<Box w={64} h={24} p={4} bg="muted" rounded="lg">
  Fixed width and height
</Box>

// Minimum dimensions
<Box minW={32} minH={24} p={4} bg="muted" rounded="lg">
  Minimum width and height
</Box>

// Maximum dimensions
<Box maxW="md" p={4} bg="muted" rounded="lg">
  Max width (responsive)
</Box>

// Max height (with overflow)
<Box maxH={24} p={4} bg="muted" rounded="lg" className="overflow-auto">
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

// =============================================================================
// Demo: Responsive
// =============================================================================
function ResponsiveBoxDemo() {
  return (
    <div className="space-y-6">
      <Box
        p={{ base: 2, sm: 4, md: 8 }}
        bg={{ base: "muted", md: "primary/10" }}
        rounded="lg"
      >
        <span className="text-sm font-medium">
          Padding & background respond to viewport
        </span>
        <p className="text-xs text-muted-foreground mt-1">
          p: 2 → 4 (sm) → 8 (md) · bg: muted → primary/10 (md). Resize the
          window to see each breakpoint apply.
        </p>
      </Box>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Box
          p={4}
          bg="muted"
          rounded="lg"
          w={{ base: "full", md: "auto" }}
          h={24}
        >
          w: full → auto (md)
        </Box>
        <Box p={4} bg="muted" rounded="lg" maxW={{ base: "sm", lg: "full" }}>
          maxW: sm → full (lg)
        </Box>
        <Box p={4} bg="muted" rounded="lg" border={{ base: true, md: 4 }}>
          border: true → 4 (md)
        </Box>
        <Box
          p={{ base: 4, lg: 6 }}
          bg="muted"
          rounded="lg"
          color={{ base: "foreground", lg: "primary" }}
        >
          color: foreground → primary (lg)
        </Box>
      </div>
    </div>
  );
}

const responsiveBoxCode = `import { Box } from "@/components/ui/box"

// Any layout prop accepts a breakpoint object: { base, sm, md, lg, xl, 2xl }
<Box
  p={{ base: 2, sm: 4, md: 8 }}
  bg={{ base: "muted", md: "primary/10" }}
  rounded="lg"
>
  Padding and background respond to viewport
</Box>

<Box w={{ base: "full", md: "auto" }} h={24} p={4} bg="muted" rounded="lg">
  Width full → auto at md
</Box>

<Box border={{ base: true, md: 4 }} p={4} rounded="lg">
  Border width 1px → 4px at md
</Box>

// Single values remain shorthand for all breakpoints
<Box p={4} bg="muted" rounded="lg">Static spacing</Box>`;

// =============================================================================
// Demo: Stress
// =============================================================================
function StressBoxDemo() {
  return (
    <div className="space-y-6">
      <div className="max-w-[320px]">
        <Box p={4} bg="background" border rounded="lg" maxW="full">
          <span className="font-medium">
            Narrow container (320px) with long content that must wrap instead of
            overflowing the box boundary
          </span>
          <p className="text-sm text-muted-foreground mt-2 break-words">
            Supercalifragilisticexpialidocious
            Pneumonoultramicroscopicsilicovolcanoconiosis
            Antidisestablishmentarianism — long words break with break-words.
          </p>
        </Box>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Full token row — every bg key renders a static class (JIT-purge
          proof):
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              "background",
              "foreground",
              "card",
              "popover",
              "primary",
              "secondary",
              "muted",
              "accent",
              "destructive",
              "success",
              "warning",
              "info",
              "primary/10",
              "muted/50",
              "destructive/10",
              "success/10",
              "warning/10",
              "info/10",
            ] as const
          ).map((token) => (
            <Box
              key={token}
              bg={token}
              w={24}
              h={12}
              rounded="md"
              border
              className="flex items-center justify-center text-[10px]"
            >
              {token}
            </Box>
          ))}
        </div>
      </div>
    </div>
  );
}

const stressBoxCode = `import { Box } from "@/components/ui/box"

// Narrow containers: maxW="full" + break-words keeps long content inside
<Box p={4} border rounded="lg" maxW="full" className="break-words">
  Long content wraps instead of overflowing
</Box>

// Background tokens are a closed union — unknown values fail tsc
<Box bg="primary/10" p={4} rounded="lg">Primary tint</Box>
<Box bg="muted/50" p={4} rounded="lg">Muted tint</Box>
<Box bg="success/10" p={4} rounded="lg">Success tint</Box>`;

export default function BoxPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Box"
        description="A polymorphic wrapper with utility props for quick styling. Provides semantic HTML support and common styling shortcuts without className bloat."
        version="v2.0.0"
      />

      <FeatureGrid features={boxPageFeatureGridFeatures} />

      <DemoTabs defaultValue="basic" tabs={boxPageDemoTabsTabs} />

      <APIReference sections={boxPageAPIReferenceSections} />

      <UsageBlock
        code={`import { Box, boxVariants } from "@/components/ui/box"

// Basic styling shorthand
<Box p={4} bg="muted" rounded="lg" border>Styled box</Box>

// Semantic element + max width
<Box as="article" p={6} rounded="lg" border shadow="sm" maxW="md">
  Article content
</Box>

// Responsive layout props
<Box p={{ base: 2, md: 8 }} w={{ base: "full", md: "auto" }} bg="primary/10">
  Responsive padding and width
</Box>

// Prebuilt variant classes (without the Box wrapper)
const classes = boxVariants({ rounded: "lg", shadow: "md" })`}
        title="Usage"
        description="Box exports the Box component and its boxVariants class builder."
      />

      <KeyboardShortcuts
        title="Keyboard Navigation"
        description="Box is a static, passive element with no interactive behavior of its own — there is no keyboard interaction to document. Content inside a Box (buttons, links, inputs) is focusable as usual."
        shortcuts={[
          {
            keys: "Tab",
            description:
              "Focus passes through the Box itself in DOM order to its interactive children",
          },
        ]}
      />

      <Changelog entries={boxPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const boxPageFeatureGridFeatures = [
  {
    title: "Polymorphic",
    description:
      "Render as any HTML element (div, article, section, etc.) with the 'as' prop for semantic markup.",
  },
  {
    title: "Utility Props",
    description:
      "Quick styling with shorthand props like p, rounded, shadow, bg, w, h, and more — all resolved through static lookup maps, safe from Tailwind's JIT purge.",
  },
  {
    title: "Responsive",
    description:
      "Layout props (p, px, py, m, bg, color, w, h, minW, minH, maxW, maxH, border) accept breakpoint objects { base, sm, md, lg, xl, 2xl }.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const boxPageDemoTabsTabs = [
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
  {
    value: "responsive",
    label: "Responsive",
    demo: (
      <DemoWrapper
        title="Responsive Values"
        description="Layout props accept breakpoint objects — resize the viewport to see each step apply."
        code={responsiveBoxCode}
      >
        <ResponsiveBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress",
    demo: (
      <DemoWrapper
        title="Narrow Containers & Token Row"
        description="320px container with long content, plus every background token rendering its static class."
        code={stressBoxCode}
      >
        <StressBoxDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const boxPageAPIReferenceSections = [
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
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>",
        default: "-",
        description: "Padding on all sides (responsive)",
      },
      {
        prop: "px",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8>",
        default: "-",
        description: "Horizontal padding (responsive)",
      },
      {
        prop: "py",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8>",
        default: "-",
        description: "Vertical padding (responsive)",
      },
      {
        prop: "m",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | auto>",
        default: "-",
        description: "Margin on all sides (responsive)",
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
        type: "ResponsiveValue<BoxBg> — background | foreground | card | popover | primary | primary-foreground | secondary | secondary-foreground | muted | muted-foreground | accent | accent-foreground | destructive | destructive-foreground | success | success-foreground | warning | warning-foreground | info | info-foreground | border | input | ring | primary/10 | primary/20 | muted/50 | destructive/10 | success/10 | warning/10 | info/10",
        default: "-",
        description:
          "Background token. Unknown values fail tsc — no dynamic interpolation, no JIT-purge risk",
      },
      {
        prop: "color",
        type: "ResponsiveValue<BoxTextColor> — foreground | primary | primary-foreground | secondary | secondary-foreground | muted | muted-foreground | accent | accent-foreground | destructive | destructive-foreground | success | success-foreground | warning | warning-foreground | info | info-foreground",
        default: "-",
        description: "Text color token",
      },
      {
        prop: "border",
        type: 'ResponsiveValue<boolean | "none" | 2 | 4 | 8>',
        default: "-",
        description: 'Border: true = 1px, false/"none" = none, or width step',
      },
      {
        prop: "w",
        type: "ResponsiveValue<BoxScale> — auto | full | svw | lvw | dvw | px | 0–3.5 (halves) | 4–12 | 14–16 | 20–96 (see BoxScale)",
        default: "-",
        description: "Width scale",
      },
      {
        prop: "h",
        type: "ResponsiveValue<BoxScale>",
        default: "-",
        description: "Height scale (same keys as w)",
      },
      {
        prop: "minW",
        type: "ResponsiveValue<BoxScale>",
        default: "-",
        description: "Min width scale",
      },
      {
        prop: "minH",
        type: "ResponsiveValue<BoxScale>",
        default: "-",
        description: "Min height scale",
      },
      {
        prop: "maxW",
        type: "ResponsiveValue<BoxMaxWidth> — BoxScale keys + prose | xs | sm | md | lg | xl | 2xl–7xl",
        default: "-",
        description: "Max width scale plus container steps",
      },
      {
        prop: "maxH",
        type: "ResponsiveValue<BoxScale>",
        default: "-",
        description: "Max height scale",
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
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const boxPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "22 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Prop types narrowed to token/scale unions",
        description:
          'bg, color, w, h, minW, minH, maxW, maxH, border, p, px, py, m no longer accept free-form strings — values must be map keys (e.g. bg="muted/50", maxW="md", w="64"). Unknown values now fail tsc instead of silently purging at build time. Responsive objects { base, sm, md, lg, xl, 2xl } are accepted on all layout props.',
      },
      {
        type: "fixed",
        title: "Dynamic Tailwind classes removed",
        description:
          "bg-${bg}, text-${color}, w-${w}, border-${border}-style interpolation replaced with static lookup maps. Previously classes only rendered when the same literal existed elsewhere in source (Tailwind JIT purge) — every demo usage was a latent purge risk.",
      },
      {
        type: "added",
        title: "Responsive breakpoint support",
        description:
          "Layout props accept { base, sm, md, lg, xl, 2xl } objects via the same ResponsiveValue machinery as Flex/Stack. rounded, shadow, display, position remain non-responsive cva variants.",
      },
      {
        type: "added",
        title: "mx/my margins and registry dependency on flex",
        description:
          'Box gains mx and my margin props alongside m; imports resolveResponsive from flex.tsx so the registry entry gains box: ["flex"]. Runtime-assembled size classes are safelisted with @source inline() in index.css.',
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
