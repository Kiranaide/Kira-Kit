import type { ComponentProps as ReactComponentProps } from "react";
import {
  IconBrandGithub,
  IconBell,
  IconSettings,
  IconArrowsLeftRight,
  IconLayoutGrid,
  IconDeviceLaptop,
  IconUser,
  IconMail,
  IconPhone,
  IconHome,
} from "@tabler/icons-react";
import { Flex } from "@/components/ui/flex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const directionCode = `import { Flex } from "@/components/ui/flex"

export function DirectionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row (default)</p>
        <Flex gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Column</p>
        <Flex direction="column" gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row Reverse</p>
        <Flex direction="row-reverse" gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
    </div>
  )
}`;

function DirectionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row (default)</p>
        <Flex gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Column</p>
        <Flex
          direction="column"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30"
        >
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row Reverse</p>
        <Flex
          direction="row-reverse"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30"
        >
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
    </div>
  );
}

const justifyCode = `import { Flex } from "@/components/ui/flex"

export function JustifyDemo() {
  return (
    <div className="space-y-4">
      {(["start", "center", "end", "between", "around", "evenly"] as const).map((justify) => (
        <div key={justify}>
          <p className="text-sm text-muted-foreground mb-2">{justify}</p>
          <Flex justify={justify} gap={4} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-3 bg-primary/20 rounded">A</div>
            <div className="p-3 bg-primary/20 rounded">B</div>
            <div className="p-3 bg-primary/20 rounded">C</div>
          </Flex>
        </div>
      ))}
    </div>
  )
}`;

function JustifyDemo() {
  return (
    <div className="space-y-4">
      {(["start", "center", "end", "between", "around", "evenly"] as const).map(
        (justify) => (
          <div key={justify}>
            <p className="text-sm text-muted-foreground mb-2">{justify}</p>
            <Flex
              justify={justify}
              gap={4}
              className="p-4 border rounded-lg bg-muted/30"
            >
              <div className="p-3 bg-primary/20 rounded">A</div>
              <div className="p-3 bg-primary/20 rounded">B</div>
              <div className="p-3 bg-primary/20 rounded">C</div>
            </Flex>
          </div>
        ),
      )}
    </div>
  );
}

const alignCode = `import { Flex } from "@/components/ui/flex"

export function AlignDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(["start", "center", "end", "stretch", "baseline"] as const).map((align) => (
        <div key={align}>
          <p className="text-sm text-muted-foreground mb-2">{align}</p>
          <Flex align={align} gap={4} className="p-4 border rounded-lg bg-muted/30 h-32">
            <div className="p-2 bg-primary/20 rounded text-sm">Short</div>
            <div className="p-4 bg-primary/20 rounded">Medium</div>
            <div className="p-6 bg-primary/20 rounded text-lg">Tall</div>
          </Flex>
        </div>
      ))}
    </div>
  )
}`;

function AlignDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(["start", "center", "end", "stretch", "baseline"] as const).map(
        (align) => (
          <div key={align}>
            <p className="text-sm text-muted-foreground mb-2">{align}</p>
            <Flex
              align={align}
              gap={4}
              className="p-4 border rounded-lg bg-muted/30 h-32"
            >
              <div className="p-2 bg-primary/20 rounded text-sm">Short</div>
              <div className="p-4 bg-primary/20 rounded">Medium</div>
              <div className="p-6 bg-primary/20 rounded text-lg">Tall</div>
            </Flex>
          </div>
        ),
      )}
    </div>
  );
}

const gapCode = `import { Flex } from "@/components/ui/flex"

export function GapDemo() {
  return (
    <div className="space-y-4">
      {([0, 2, 4, 6, 8, 12] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
          <Flex gap={gap} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-3 bg-primary/20 rounded">1</div>
            <div className="p-3 bg-primary/20 rounded">2</div>
            <div className="p-3 bg-primary/20 rounded">3</div>
            <div className="p-3 bg-primary/20 rounded">4</div>
          </Flex>
        </div>
      ))}
    </div>
  )
}`;

function GapDemo() {
  return (
    <div className="space-y-4">
      {([0, 2, 4, 6, 8, 12] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
          <Flex gap={gap} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-3 bg-primary/20 rounded">1</div>
            <div className="p-3 bg-primary/20 rounded">2</div>
            <div className="p-3 bg-primary/20 rounded">3</div>
            <div className="p-3 bg-primary/20 rounded">4</div>
          </Flex>
        </div>
      ))}
    </div>
  );
}

const wrapCode = `import { Flex } from "@/components/ui/flex"

export function WrapDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap</p>
        <Flex wrap="wrap" gap={4} className="p-4 border rounded-lg bg-muted/30 max-w-md">
          {Array.from({ length: 8 }, (_, i) => ({ id: "item-" + (i + 1), number: i + 1 })).map((item) => (
            <div key={item.id} className="p-4 bg-primary/20 rounded w-24 text-center">{item.number}</div>
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">nowrap (default)</p>
        <Flex wrap="nowrap" gap={4} className="p-4 border rounded-lg bg-muted/30 max-w-md overflow-x-auto">
          {Array.from({ length: 8 }, (_, i) => ({ id: "item-" + (i + 1), number: i + 1 })).map((item) => (
            <div key={item.id} className="p-4 bg-primary/20 rounded w-24 text-center shrink-0">{item.number}</div>
          ))}
        </Flex>
      </div>
    </div>
  )
}`;

function WrapDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap</p>
        <Flex
          wrap="wrap"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30 max-w-md"
        >
          {Array.from({ length: 8 }, (_, i) => ({
            id: "item-" + (i + 1),
            number: i + 1,
          })).map((item) => (
            <div
              key={item.id}
              className="p-4 bg-primary/20 rounded w-24 text-center"
            >
              {item.number}
            </div>
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">nowrap (default)</p>
        <Flex
          wrap="nowrap"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30 max-w-md overflow-x-auto"
        >
          {Array.from({ length: 8 }, (_, i) => ({
            id: "item-" + (i + 1),
            number: i + 1,
          })).map((item) => (
            <div
              key={item.id}
              className="p-4 bg-primary/20 rounded w-24 text-center shrink-0"
            >
              {item.number}
            </div>
          ))}
        </Flex>
      </div>
    </div>
  );
}

const responsiveCode = `import { Flex } from "@/components/ui/flex"

export function ResponsiveDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the window to see the layout change from column on mobile to row on desktop.
      </p>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, lg: 8 }}
        align={{ base: "stretch", md: "center" }}
        className="p-4 border rounded-lg bg-muted/30"
      >
        <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 1</div>
        <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 2</div>
        <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 3</div>
      </Flex>
    </div>
  )
}`;

function ResponsiveDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the window to see the layout change from column on mobile to row
        on desktop.
      </p>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, lg: 8 }}
        align={{ base: "stretch", md: "center" }}
        className="p-4 border rounded-lg bg-muted/30"
      >
        <div className="p-4 bg-primary/20 rounded flex-1">
          Responsive Item 1
        </div>
        <div className="p-4 bg-primary/20 rounded flex-1">
          Responsive Item 2
        </div>
        <div className="p-4 bg-primary/20 rounded flex-1">
          Responsive Item 3
        </div>
      </Flex>
    </div>
  );
}

const semanticCode = `import { Flex } from "@/components/ui/flex"
import { Button } from "@/components/ui/button"

export function SemanticDemo() {
  return (
    <Flex as="nav" justify="between" align="center" className="p-4 border rounded-lg bg-muted/30">
      <Flex as="ul" gap={4} className="list-none">
        <li><a href="/" className="hover:text-primary">Home</a></li>
        <li><a href="/components/flex" className="hover:text-primary">About</a></li>
        <li><a href="/components/flex" className="hover:text-primary">Contact</a></li>
      </Flex>
      <Button size="sm">Sign In</Button>
    </Flex>
  )
}`;

function SemanticDemo() {
  return (
    <Flex
      as="nav"
      justify="between"
      align="center"
      className="p-4 border rounded-lg bg-muted/30"
    >
      <Flex as="ul" gap={4} className="list-none">
        <li>
          <a href="/components/flex" className="hover:text-primary">
            Home
          </a>
        </li>
        <li>
          <a href="/components/flex" className="hover:text-primary">
            About
          </a>
        </li>
        <li>
          <a href="/components/flex" className="hover:text-primary">
            Contact
          </a>
        </li>
      </Flex>
      <Button size="sm">Sign In</Button>
    </Flex>
  );
}

const realWorldCode = `import { Flex } from "@/components/ui/flex"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconBrandGithub, IconBell, IconSettings, IconUser, IconMail, IconPhone, IconHome } from "@tabler/icons-react"

export function RealWorldDemos() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Navigation Header</p>
        <Flex as="header" justify="between" align="center" className="p-4 border rounded-lg bg-background">
          <Flex align="center" gap={2}>
            <div className="size-8 bg-primary rounded-md" />
            <span className="font-semibold">Brand</span>
          </Flex>
          <Flex gap={2}>
            <Button variant="ghost" size="icon-sm"><IconBell className="size-4" /></Button>
            <Button variant="ghost" size="icon-sm"><IconSettings className="size-4" /></Button>
            <Avatar size="sm">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Flex>
        </Flex>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">User Profile Card</p>
        <Flex gap={4} align="center" className="p-4 border rounded-lg bg-background">
          <Avatar size="lg">
            <AvatarImage src="https://github.com/mui.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Flex direction="column" gap={1} className="flex-1">
            <span className="font-semibold">John Doe</span>
            <span className="text-sm text-muted-foreground">Software Engineer</span>
            <Flex gap={2} className="mt-1">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
            </Flex>
          </Flex>
          <Button variant="outline" size="sm">
            <IconBrandGithub className="size-4 mr-2" />
            Follow
          </Button>
        </Flex>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
        <Flex direction="column" gap={3} className="p-4 border rounded-lg bg-background">
          <Flex align="center" gap={3}>
            <IconUser className="size-4 text-muted-foreground" />
            <span>John Doe</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconMail className="size-4 text-muted-foreground" />
            <span>john@example.com</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconPhone className="size-4 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconHome className="size-4 text-muted-foreground" />
            <span>123 Main St, City, Country</span>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}`;

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
function RealWorldDemos() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Navigation Header</p>
        <Flex
          as="header"
          justify="between"
          align="center"
          className="p-4 border rounded-lg bg-background"
        >
          <Flex align="center" gap={2}>
            <div className="size-8 bg-primary rounded-md" />
            <span className="font-semibold">Brand</span>
          </Flex>
          <Flex gap={2}>
            <Button variant="ghost" size="icon-sm">
              <IconBell className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <IconSettings className="size-4" />
            </Button>
            <Avatar size="sm">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Flex>
        </Flex>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">User Profile Card</p>
        <Flex
          gap={4}
          align="center"
          className="p-4 border rounded-lg bg-background"
        >
          <Avatar size="lg">
            <AvatarImage src="https://github.com/mui.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Flex direction="column" gap={1} className="flex-1">
            <span className="font-semibold">John Doe</span>
            <span className="text-sm text-muted-foreground">
              Software Engineer
            </span>
            <Flex gap={2} className="mt-1">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
            </Flex>
          </Flex>
          <Button variant="outline" size="sm">
            <IconBrandGithub className="size-4 mr-2" />
            Follow
          </Button>
        </Flex>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Contact Information
        </p>
        <Flex
          direction="column"
          gap={3}
          className="p-4 border rounded-lg bg-background"
        >
          <Flex align="center" gap={3}>
            <IconUser className="size-4 text-muted-foreground" />
            <span>John Doe</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconMail className="size-4 text-muted-foreground" />
            <span>john@example.com</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconPhone className="size-4 text-muted-foreground" />
            <span>+1 (555) 123-4567</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconHome className="size-4 text-muted-foreground" />
            <span>123 Main St, City, Country</span>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

export default function FlexPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Flex"
        description="Flexible box layout primitive for building responsive layouts with ease."
        version="1.0"
      />

      <FeatureGrid features={flexPageFeatureGridFeatures} />

      <DemoTabs defaultValue="direction" tabs={flexPageDemoTabsTabs} />

      <UsageBlock
        code={`import { Flex } from "@/components/ui/flex"

// Basic row layout
<Flex gap={4} align="center">
  <Avatar />
  <span>Username</span>
</Flex>

// Column layout
<Flex direction="column" gap={2}>
  <Input />
  <Button>Submit</Button>
</Flex>

// Responsive layout
<Flex 
  direction={{ base: "column", md: "row" }} 
  gap={{ base: 4, lg: 8 }}
>
  <Card />
  <Card />
</Flex>

// Semantic HTML
<Flex as="nav" justify="between" align="center">
  <Logo />
  <NavLinks />
</Flex>`}
        title="Usage"
        description="Basic implementation examples for common scenarios"
      />

      <APIReference
        sections={flexPageAPIReferenceSections}
        title="API Reference"
        description="Key props and configuration options"
      />

      <Changelog entries={flexPageChangelogEntries} />
    </ComponentPage>
  );
}

const flexPageChangelogEntries = [
  {
    version: "1.0",
    date: "20 November 2026",
    changes: [
      {
        type: "added",
        title: "Responsive layout props over a static class map",
        description:
          "direction, wrap, justify, align and gap take either a plain value or a breakpoint map ({ base, md, lg }), resolved against fixed class maps so no interpolated class strings are ever built. Breakpoint-prefixed classes are assembled at runtime, so they must be safelisted with @source inline(...) in your global CSS — the kira-base stylesheet installed by init already lists them.",
      },
      {
        type: "added",
        title: "Polymorphic element with a stable styling hook",
        description:
          "as renders any element (nav, section, ul) with its own props and ref forwarded, defaulting to div; data-slot flex stays constant across modes and inline swaps to inline-flex.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const flexPageFeatureGridFeatures = [
  {
    title: "Responsive Values",
    description:
      "All layout props support breakpoint-aware responsive values using Tailwind conventions.",
    icon: <IconDeviceLaptop className="h-5 w-5 text-primary" />,
  },
  {
    title: "Semantic HTML",
    description:
      "Render as any semantic element like nav, header, main, or form using the as prop.",
    icon: <IconLayoutGrid className="h-5 w-5 text-primary" />,
  },
  {
    title: "Type Safe",
    description:
      "Full TypeScript support with strict type inference for direction, justify, align, and more.",
    icon: <IconArrowsLeftRight className="h-5 w-5 text-primary" />,
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];

const flexPageDemoTabsTabs = [
  {
    value: "direction",
    label: "Direction",
    demo: (
      <DemoWrapper
        title="Flex Direction"
        description="Control the direction in which flex items are laid out."
        code={directionCode}
      >
        <DirectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "justify",
    label: "Justify Content",
    demo: (
      <DemoWrapper
        title="Justify Content"
        description="Align flex items along the main axis (row direction)."
        code={justifyCode}
      >
        <JustifyDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "align",
    label: "Align Items",
    demo: (
      <DemoWrapper
        title="Align Items"
        description="Align flex items along the cross axis."
        code={alignCode}
      >
        <AlignDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "gap",
    label: "Gap Spacing",
    demo: (
      <DemoWrapper
        title="Gap Spacing"
        description="Control the spacing between flex items."
        code={gapCode}
      >
        <GapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "wrap",
    label: "Flex Wrap",
    demo: (
      <DemoWrapper
        title="Flex Wrap"
        description="Control whether flex items wrap onto multiple lines."
        code={wrapCode}
      >
        <WrapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    demo: (
      <DemoWrapper
        title="Responsive Values"
        description="Use breakpoint-aware values for adaptive layouts."
        code={responsiveCode}
      >
        <ResponsiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "semantic",
    label: "Semantic HTML",
    demo: (
      <DemoWrapper
        title="Semantic HTML (as prop)"
        description="Render Flex as semantic HTML elements like nav, header, form."
        code={semanticCode}
      >
        <SemanticDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "realworld",
    label: "Real-World Examples",
    demo: (
      <DemoWrapper
        title="Real-World Examples"
        description="Common UI patterns using the Flex component."
        code={realWorldCode}
      >
        <RealWorldDemos />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

const flexPageAPIReferenceSections = [
  {
    title: "Flex",
    props: [
      {
        prop: "as",
        type: "FlexElement",
        default: '"div"',
        description:
          "Semantic HTML element to render (div, nav, header, main, article, aside, footer, ul, ol, form, fieldset, span)",
      },
      {
        prop: "direction",
        type: "ResponsiveValue<FlexDirection>",
        default: '"row"',
        description:
          "Flex direction - row, row-reverse, column, column-reverse",
      },
      {
        prop: "wrap",
        type: "ResponsiveValue<FlexWrap>",
        default: "-",
        description: "Flex wrap behavior - nowrap, wrap, wrap-reverse",
      },
      {
        prop: "justify",
        type: "ResponsiveValue<FlexJustify>",
        default: "-",
        description:
          "Justify content alignment - start, end, center, between, around, evenly",
      },
      {
        prop: "align",
        type: "ResponsiveValue<FlexAlign>",
        default: "-",
        description:
          "Align items alignment - start, end, center, baseline, stretch",
      },
      {
        prop: "gap",
        type: "ResponsiveValue<FlexGap>",
        default: "-",
        description:
          "Gap between items - 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24",
      },
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description: "Render as inline-flex instead of flex",
      },
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];
