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

const roundedOptions = [
  "none",
  "xs",
  "sm",
  "default",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
] as const;

const shadowOptions = [
  "none",
  "2xs",
  "xs",
  "sm",
  "default",
  "md",
  "lg",
  "xl",
  "2xl",
] as const;

const stressBgTokens = [
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
] as const;

function BasicBoxDemo() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
  const [selected, setSelected] =
    useState<(typeof roundedOptions)[number]>("lg");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Selected:</span>
        <Badge>{selected}</Badge>
      </div>
      <div className="flex flex-wrap gap-3">
        {roundedOptions.map((rounded) => (
          <button
            key={rounded}
            type="button"
            aria-label={`Select rounded ${rounded}`}
            aria-pressed={rounded === selected}
            onClick={() => setSelected(rounded)}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
          >
            <Box
              p={4}
              bg={rounded === selected ? "primary/20" : "muted"}
              rounded={rounded}
              className={
                rounded === selected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : undefined
              }
            >
              <span className="text-xs">{rounded}</span>
            </Box>
          </button>
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
{["none", "xs", "sm", "default", "md", "lg", "xl", "2xl", "3xl", "full"].map((rounded) => (
  <Box key={rounded} p={4} rounded={rounded}>
    {rounded}
  </Box>
))}`;

function ShadowBoxDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {shadowOptions.map((shadow) => (
        <Box
          key={shadow}
          p={4}
          shadow={shadow}
          rounded="lg"
          bg="background"
          border
          className="min-w-24 text-center"
        >
          <span className="text-xs">{shadow}</span>
        </Box>
      ))}
    </div>
  );
}

const shadowBoxCode = `import { Box } from "@/components/ui/box"

// Shadow variants
<Box p={4} shadow="sm">Small shadow</Box>
<Box p={4} shadow="md">Medium shadow</Box>
<Box p={4} shadow="lg">Large shadow</Box>
<Box p={4} shadow="xl">Extra large</Box>`;

function SemanticBoxDemo() {
  return (
    <div className="space-y-4">
      <Box as="article" p={6} rounded="lg" border shadow="sm" bg="background">
        <h4 className="mb-2 font-semibold">Article Title</h4>
        <p className="text-sm text-muted-foreground">
          This Box renders as an &lt;article&gt; element for semantic HTML. Good
          for blog posts, news items, and independent content.
        </p>
      </Box>

      <Box as="section" p={6} rounded="lg" border shadow="sm" bg="muted/50">
        <h4 className="mb-2 font-semibold">Section Title</h4>
        <p className="text-sm text-muted-foreground">
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
      <div className="mt-4 flex flex-wrap gap-2">
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
  <div className="mt-4 flex gap-2">
    <Badge variant="secondary">React</Badge>
    <Badge variant="secondary">TypeScript</Badge>
  </div>
</Box>`;

function NotificationBoxDemo() {
  return (
    <div className="max-w-md space-y-4">
      <Box
        p={4}
        rounded="lg"
        bg="primary/10"
        border
        className="border-primary/20"
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <IconCheck className="size-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="font-medium leading-snug">Success!</p>
            <p className="text-sm text-muted-foreground">
              Your changes have been saved successfully.
            </p>
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/20">
            <IconX className="size-5 text-destructive" aria-hidden="true" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="font-medium leading-snug">Error!</p>
            <p className="text-sm text-muted-foreground">
              Something went wrong. Please try again.
            </p>
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
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
      <IconCheck className="size-5 text-primary" aria-hidden="true" />
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <p className="font-medium leading-snug">Success!</p>
      <p className="text-sm text-muted-foreground">Your changes have been saved successfully.</p>
    </div>
  </div>
</Box>

// Error notification
<Box p={4} rounded="lg" bg="destructive/10" border className="border-destructive/20">
  <div className="flex items-start gap-3">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/20">
      <IconX className="size-5 text-destructive" aria-hidden="true" />
    </div>
    <div className="flex flex-1 flex-col gap-1">
      <p className="font-medium leading-snug">Error!</p>
      <p className="text-sm text-muted-foreground">Something went wrong. Please try again.</p>
    </div>
  </div>
</Box>`;

function SizingBoxDemo() {
  return (
    <div className="w-full space-y-4">
      <Box p={4} bg="muted" rounded="lg" w="full" h={20}>
        {'w="full" h={20}'}
      </Box>
      <div className="flex flex-wrap gap-4">
        <Box p={4} bg="muted" rounded="lg" w={64} h={24} className="max-w-full">
          {"w={64} h={24}"}
        </Box>
        <Box p={4} bg="muted" rounded="lg" minW={32} minH={24}>
          {"minW={32} minH={24}"}
        </Box>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Box p={4} bg="muted" rounded="lg" maxW="md" h={24}>
          {'maxW="md"'}
        </Box>
        <Box
          p={4}
          bg="muted"
          rounded="lg"
          maxH={24}
          className="overflow-auto text-sm"
        >
          <p className="font-medium">{"maxH={24} (overflow-auto)"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Long content scrolls cleanly inside the 96px height cap instead of
            spilling into neighboring boxes.
          </p>
        </Box>
      </div>
    </div>
  );
}

const sizingBoxCode = `import { Box } from "@/components/ui/box"

// Full width and fixed height
<Box w="full" h={20} p={4} bg="muted" rounded="lg">
  Full width, fixed height
</Box>

// Fixed width and height
<Box w={64} h={24} p={4} bg="muted" rounded="lg" className="max-w-full">
  Fixed width and height
</Box>

// Minimum dimensions
<Box minW={32} minH={24} p={4} bg="muted" rounded="lg">
  Minimum width and height
</Box>

// Maximum dimensions
<Box maxW="md" h={24} p={4} bg="muted" rounded="lg">
  Max width (responsive)
</Box>

// Max height (with overflow)
<Box maxH={24} p={4} bg="muted" rounded="lg" className="overflow-auto text-sm">
  Max height with scroll
</Box>`;

function DisplayBoxDemo() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Box display="block" p={4} bg="muted" rounded="lg" w={24}>
        block
      </Box>
      <Box display="inline-block" p={4} bg="muted" rounded="lg">
        inline-block
      </Box>
      <Box display="inline" p={4} bg="muted" rounded="lg">
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

function ResponsiveBoxDemo() {
  return (
    <div className="space-y-6">
      <Box
        p={{ base: 2, sm: 4, md: 8 }}
        bg={{ base: "muted", md: "primary/10" }}
        rounded="lg"
      >
        <span className="text-sm font-medium">
          Padding &amp; background respond to viewport
        </span>
        <p className="mt-1 text-xs text-muted-foreground">
          p: 2 → 4 (sm) → 8 (md) · bg: muted → primary/10 (md). Resize the
          window to see each breakpoint apply.
        </p>
      </Box>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
</Box>`;

function StressBoxDemo() {
  return (
    <div className="space-y-6">
      <div className="max-w-xs space-y-4">
        <Box p={4} bg="background" border rounded="lg" maxW="full">
          <span className="font-medium">
            Narrow container (max-w-xs) with long content that wraps cleanly
            inside the box boundary
          </span>
          <p className="mt-2 break-words text-sm text-muted-foreground">
            Supercalifragilisticexpialidocious
            Pneumonoultramicroscopicsilicovolcanoconiosis
            Antidisestablishmentarianism — long words break with break-words.
          </p>
        </Box>

        <Box
          p={4}
          bg="muted/50"
          border
          rounded="lg"
          minH={12}
          aria-label="Empty box container"
        />

        <Box
          as="fieldset"
          disabled
          p={4}
          bg="muted"
          border
          rounded="lg"
          className="opacity-50"
        >
          <legend className="px-1 text-xs font-medium text-muted-foreground">
            Disabled fieldset Box
          </legend>
          <p className="text-xs text-muted-foreground">
            Polymorphic fieldset inherits native disabled semantics.
          </p>
        </Box>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Background token row — every bg key resolves through a static lookup
          map:
        </p>
        <div className="flex flex-wrap gap-2">
          {stressBgTokens.map((token) => (
            <Box
              key={token}
              bg={token}
              minW={24}
              h={12}
              px={2}
              rounded="md"
              border
              className="flex items-center justify-center text-xs"
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

// Narrow container (max-w-xs): long wrapping copy, empty box, disabled fieldset
<div className="max-w-xs space-y-4">
  <Box p={4} bg="background" border rounded="lg" maxW="full" className="break-words">
    Long content wraps instead of overflowing
  </Box>
  <Box p={4} bg="muted/50" border rounded="lg" minH={12} aria-label="Empty box container" />
  <Box as="fieldset" disabled p={4} bg="muted" border rounded="lg" className="opacity-50">
    <legend className="px-1 text-xs font-medium">Disabled fieldset Box</legend>
  </Box>
</div>`;

const boxUsageCode = `import { Box, boxVariants } from "@/components/ui/box"

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

// Prebuilt variant classes without the Box wrapper
const classes = boxVariants({ rounded: "lg", shadow: "md" })`;

export default function BoxPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Box"
        description="A polymorphic wrapper with utility props for quick styling. Provides semantic HTML support and common styling shortcuts without className bloat."
        version="v2.1.0"
      />

      <FeatureGrid
        features={boxPageFeatures}
        description="Polymorphic, responsive layout primitive with purge-safe token maps."
      />

      <DemoTabs defaultValue="basic" tabs={boxPageDemoTabs} />

      <KeyboardShortcuts
        title="Keyboard Shortcuts"
        description="Box is a passive layout element with no interactive behavior of its own. Interactive children inside a Box remain focusable in normal DOM order."
        shortcuts={boxPageShortcuts}
      />

      <UsageBlock
        code={boxUsageCode}
        title="Usage"
        description="Use Box for semantic containers with shorthand layout props, or call boxVariants directly."
        notes={boxPageUsageNotes}
      />

      <APIReference
        sections={boxPageAPISections}
        description="Props, types, and supported semantic elements for Box and boxVariants."
      />

      <Changelog
        entries={boxPageChangelogEntries}
        title="Changelog"
        description="Version history for Box."
      />
    </ComponentPage>
  );
}

const boxPageFeatures = [
  {
    title: "Polymorphic",
    description:
      "Render as semantic HTML elements (div, article, section, nav, fieldset, and more) via the as prop.",
  },
  {
    title: "Utility Props",
    description:
      "Shorthand props like p, rounded, shadow, bg, w, and h resolved through static lookup maps safe from Tailwind JIT purging.",
  },
  {
    title: "Responsive",
    description:
      "Layout props (p, px, py, m, mx, my, bg, color, w, h, minW, minH, maxW, maxH, border) accept breakpoint objects { base, sm, md, lg, xl, 2xl }.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const boxPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
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
    group: "Core",
    demo: (
      <DemoWrapper
        title="Border Radius"
        description="All available rounded variants from none to full. Select any option to preview."
        code={roundedBoxCode}
      >
        <RoundedBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shadow",
    label: "Shadow",
    group: "Core",
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
    value: "sizing",
    label: "Sizing",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Width and Height"
        description="Control dimensions with w, h, minW, minH, maxW, and maxH props."
        code={sizingBoxCode}
      >
        <SizingBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "display",
    label: "Display",
    group: "Core",
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
    value: "semantic",
    label: "Semantic",
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Semantic HTML"
        description="Use the as prop to render semantic elements for better accessibility and document structure."
        code={semanticBoxCode}
      >
        <SemanticBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "card-like",
    label: "Card Like",
    group: "Patterns",
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
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Notification Box"
        description="Success and error callouts styled with semantic tint tokens."
        code={notificationBoxCode}
      >
        <NotificationBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    group: "Behavior",
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
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Narrow max-w-xs container with long copy, empty box, disabled fieldset, and static background token row."
        code={stressBoxCode}
      >
        <StressBoxDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const boxPageShortcuts = [
  {
    keys: "Tab",
    description:
      "Focus passes through the Box container in DOM order to its interactive children.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const boxPageUsageNotes = [
  {
    label: "Box vs. boxVariants",
    body: "Use <Box> when you want polymorphic semantic HTML (`as`) and responsive spacing/sizing props. Call `boxVariants({ rounded, shadow, display, position })` directly when applying the same visual primitives to another component.",
  },
  {
    label: "Closed Token Unions",
    body: "All bg, color, spacing, border, and size props are closed TypeScript unions backed by static maps and `@source inline()` safelists, preventing silent Tailwind JIT purges.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const boxPageAPISections = [
  {
    title: "Box",
    props: [
      {
        prop: "as",
        type: "BoxElement",
        default: '"div"',
        description: "Semantic HTML element to render.",
      },
      {
        prop: "p",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>",
        default: "-",
        description: "Padding on all sides (responsive).",
      },
      {
        prop: "px",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>",
        default: "-",
        description: "Horizontal padding (responsive).",
      },
      {
        prop: "py",
        type: "ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12>",
        default: "-",
        description: "Vertical padding (responsive).",
      },
      {
        prop: "m",
        type: 'ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | "auto">',
        default: "-",
        description: "Margin on all sides (responsive).",
      },
      {
        prop: "mx",
        type: 'ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | "auto">',
        default: "-",
        description: "Horizontal margin (responsive).",
      },
      {
        prop: "my",
        type: 'ResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | "auto">',
        default: "-",
        description: "Vertical margin (responsive).",
      },
      {
        prop: "rounded",
        type: '"none" | "xs" | "sm" | "default" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"',
        default: "-",
        description: "Border radius variant.",
      },
      {
        prop: "shadow",
        type: '"none" | "2xs" | "xs" | "sm" | "default" | "md" | "lg" | "xl" | "2xl"',
        default: "-",
        description: "Box shadow variant.",
      },
      {
        prop: "bg",
        type: "ResponsiveValue<BoxBg>",
        default: "-",
        description:
          "Semantic background token (e.g. background, card, muted, primary, muted/50, primary/10).",
      },
      {
        prop: "color",
        type: "ResponsiveValue<BoxTextColor>",
        default: "-",
        description:
          "Semantic text color token (e.g. foreground, muted-foreground, primary, destructive).",
      },
      {
        prop: "border",
        type: 'ResponsiveValue<boolean | "none" | 2 | 4 | 8>',
        default: "-",
        description:
          'Border width: true = 1px, false / "none" = none, or 2 / 4 / 8.',
      },
      {
        prop: "w",
        type: "ResponsiveValue<BoxWidth>",
        default: "-",
        description:
          "Width scale (0–96, px, full, fit, min, max, auto, screen, svw, lvw, dvw).",
      },
      {
        prop: "h",
        type: "ResponsiveValue<BoxHeight>",
        default: "-",
        description:
          "Height scale (0–96, px, full, fit, min, max, auto, screen, svh, lvh, dvh).",
      },
      {
        prop: "minW",
        type: "ResponsiveValue<BoxMinWidth>",
        default: "-",
        description: "Minimum width scale.",
      },
      {
        prop: "minH",
        type: "ResponsiveValue<BoxMinHeight>",
        default: "-",
        description: "Minimum height scale.",
      },
      {
        prop: "maxW",
        type: "ResponsiveValue<BoxMaxWidth>",
        default: "-",
        description:
          "Maximum width scale plus container tokens (none, prose, 3xs–7xl).",
      },
      {
        prop: "maxH",
        type: "ResponsiveValue<BoxMaxHeight>",
        default: "-",
        description: "Maximum height scale.",
      },
      {
        prop: "display",
        type: '"block" | "inline-block" | "inline" | "flex" | "inline-flex" | "grid" | "inline-grid" | "hidden"',
        default: "-",
        description: "CSS display property.",
      },
      {
        prop: "position",
        type: '"static" | "relative" | "absolute" | "fixed" | "sticky"',
        default: "-",
        description: "CSS position property.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional Tailwind classes merged last.",
      },
    ],
  },
  {
    title: "boxVariants",
    props: [
      {
        prop: "rounded",
        type: '"none" | "xs" | "sm" | "default" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full"',
        default: "-",
        description: "Border radius class.",
      },
      {
        prop: "shadow",
        type: '"none" | "2xs" | "xs" | "sm" | "default" | "md" | "lg" | "xl" | "2xl"',
        default: "-",
        description: "Box shadow class.",
      },
      {
        prop: "display",
        type: '"block" | "inline-block" | "inline" | "flex" | "inline-flex" | "grid" | "inline-grid" | "hidden"',
        default: "-",
        description: "Display utility class.",
      },
      {
        prop: "position",
        type: '"static" | "relative" | "absolute" | "fixed" | "sticky"',
        default: "-",
        description: "Position utility class.",
      },
    ],
  },
  {
    title: "Available Elements (BoxElement)",
    props: [
      {
        prop: "div / span",
        type: "BoxElement",
        default: '"div"',
        description: "Generic block or inline container.",
      },
      {
        prop: "section / article / aside / main",
        type: "BoxElement",
        default: "-",
        description: "Landmark and document-outline containers.",
      },
      {
        prop: "header / footer / nav",
        type: "BoxElement",
        default: "-",
        description: "Page or section structural landmarks.",
      },
      {
        prop: "form / fieldset",
        type: "BoxElement",
        default: "-",
        description: "Form and field-grouping containers.",
      },
      {
        prop: "ul / ol / li",
        type: "BoxElement",
        default: "-",
        description: "Ordered, unordered, and list-item elements.",
      },
      {
        prop: "figure / figcaption / address",
        type: "BoxElement",
        default: "-",
        description: "Media figures, captions, and contact blocks.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const boxPageChangelogEntries = [
  {
    version: "2.1.0",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Shared layout-responsive engine and Base UI useRender",
        description:
          "Moved responsive resolution onto @/lib/layout-responsive (eliminating the inverted box → flex dependency) and adopted Base UI useRender + mergeProps so Box supports the render prop alongside as.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "22 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Prop types narrowed to token/scale unions",
        description:
          'bg, color, w, h, minW, minH, maxW, maxH, border, p, px, py, m no longer accept free-form strings — values must be map keys (e.g. bg="muted/50", maxW="md", w={64}). Unknown values now fail tsc instead of silently purging at build time. Responsive objects { base, sm, md, lg, xl, 2xl } are accepted on all layout props.',
      },
      {
        type: "fixed",
        title: "Dynamic Tailwind classes removed",
        description:
          // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
          "bg-${bg}, text-${color}, w-${w}, border-${border}-style interpolation replaced with static lookup maps. Previously classes only rendered when the same literal existed elsewhere in source (Tailwind JIT purge).",
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
