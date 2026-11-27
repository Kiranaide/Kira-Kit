import type { ComponentProps as ReactComponentProps } from "react";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

function HeadingsDemo() {
  return (
    <div className="space-y-4">
      {headingSpecimens.map((item) => (
        <div
          key={item.tag}
          className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
        >
          <p className={item.className}>{item.label}</p>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {item.meta}
          </span>
        </div>
      ))}
    </div>
  );
}

const headingsCode = `<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Heading 1
</h1>
<h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
  Heading 2
</h2>
<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
  Heading 3
</h3>
<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
  Heading 4
</h4>
<h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
  Heading 5
</h5>
<h6 className="scroll-m-20 text-base font-semibold tracking-tight">
  Heading 6
</h6>`;

function ParagraphDemo() {
  return (
    <div className="max-w-prose space-y-6">
      <p className="leading-7 text-foreground">
        Clear typographic rhythm guides attention without extra chrome. Pairing
        a 65-character measure with generous line-height keeps multi-paragraph
        documentation effortless to scan.
      </p>
      <p className="leading-7 text-foreground">
        Consistent vertical spacing separates ideas while preserving visual
        continuity across desktop and mobile viewports.
      </p>
    </div>
  );
}

const paragraphCode = `<div className="max-w-prose space-y-6">
  <p className="leading-7">
    Clear typographic rhythm guides attention without extra chrome.
  </p>
  <p className="leading-7">
    Consistent vertical spacing separates ideas across viewports.
  </p>
</div>`;

function TextVariantsDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">Lead</p>
        <p className="text-xl leading-relaxed text-muted-foreground">
          A modal dialog that interrupts the user with important content and
          expects a response.
        </p>
      </div>
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">Large</p>
        <p className="text-lg font-semibold text-foreground">
          Are you absolutely sure?
        </p>
      </div>
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">Small</p>
        <small className="text-sm leading-none font-medium text-foreground">
          Email address
        </small>
      </div>
      <div className="space-y-1">
        <p className="font-mono text-xs text-muted-foreground">Muted</p>
        <p className="text-sm text-muted-foreground">
          Enter your email address.
        </p>
      </div>
    </div>
  );
}

const textVariantsCode = `<p className="text-xl text-muted-foreground">Lead intro text</p>
<p className="text-lg font-semibold">Large emphasized text</p>
<small className="text-sm font-medium leading-none">Small label</small>
<p className="text-sm text-muted-foreground">Muted helper text</p>`;

function BlockquoteDemo() {
  return (
    <blockquote className="border-l-2 border-border pl-6 italic text-foreground">
      "Good typography is invisible until it fails; great typography makes
      hierarchy effortless."
    </blockquote>
  );
}

const blockquoteCode = `<blockquote className="border-l-2 border-border pl-6 italic">
  "Good typography is invisible until it fails; great typography makes hierarchy effortless."
</blockquote>`;

function InlineCodeDemo() {
  return (
    <p className="leading-7 text-foreground">
      Use the{" "}
      <code className="relative rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold text-foreground">
        @tanstack/react-table
      </code>{" "}
      package for headless data tables.
    </p>
  );
}

const inlineCodeCode = `<p className="leading-7">
  Use the{" "}
  <code className="relative rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold">
    @tanstack/react-table
  </code>{" "}
  package for headless data tables.
</p>`;

function ListsDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-foreground">
          Unordered List
        </h4>
        <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
          <li>Semantic hierarchy</li>
          <li>Accessible contrast ratios</li>
          <li>Responsive line measure</li>
        </ul>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-semibold text-foreground">
          Ordered List
        </h4>
        <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
          <li>Choose a heading level by structure</li>
          <li>Constrain prose with max-w-prose</li>
          <li>Pair muted labels with strong contrast</li>
        </ol>
      </div>
    </div>
  );
}

const listsCode = `<ul className="my-4 ml-6 list-disc [&>li]:mt-2">
  <li>Semantic hierarchy</li>
  <li>Accessible contrast ratios</li>
</ul>

<ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
  <li>Choose a heading level by structure</li>
  <li>Constrain prose with max-w-prose</li>
</ol>`;

function LinksDemo() {
  return (
    <p className="leading-7 text-foreground">
      Explore the{" "}
      <a
        href="/docs/typeset"
        className="rounded-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        typeset guide
      </a>{" "}
      for font pairing and scale tokens.
    </p>
  );
}

const linksCode = `<p className="leading-7">
  Explore the{" "}
  <a
    href="/docs/typeset"
    className="rounded-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    typeset guide
  </a>{" "}
  for font pairing and scale tokens.
</p>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <p className="text-balance text-2xl font-semibold tracking-tight text-foreground">
        Multi-Line Balanced Heading Inside a Narrow Container
      </p>
      <p className="text-sm leading-6 text-foreground">
        Long inline token{" "}
        <code className="break-all rounded bg-muted px-1 py-0.5 font-mono text-xs font-semibold">
          --kira-surface-elevated-popover-foreground-high-contrast
        </code>{" "}
        wraps cleanly instead of forcing horizontal scroll.
      </p>
      <p className="text-sm text-muted-foreground">
        <span
          aria-disabled="true"
          className="cursor-not-allowed underline underline-offset-4 opacity-50"
        >
          Disabled link text state
        </span>
      </p>
    </div>
  );
}

const stressCode = `// Narrow max-w-xs column: balanced multi-line heading, break-all inline code, disabled link
<div className="max-w-xs space-y-4">
  <p className="text-balance text-2xl font-semibold tracking-tight">
    Multi-Line Balanced Heading Inside a Narrow Container
  </p>
  <code className="break-all rounded bg-muted px-1 py-0.5 font-mono text-xs font-semibold">
    --kira-surface-elevated-popover-foreground-high-contrast
  </code>
</div>`;

const usageCode = `// Heading 1 (use once per page for the main document title)
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Page Title
</h1>

// Lead intro
<p className="text-xl text-muted-foreground">
  Concise summary introducing the section.
</p>

// Body paragraph with readable line measure
<p className="max-w-prose leading-7 [&:not(:first-child)]:mt-6">
  Body content with comfortable 1.75rem leading.
</p>

// Inline code on the 4px spacing ladder
<code className="relative rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold">
  @kira-kit/cli
</code>`;

export default function TypographyPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Typography"
        description="Semantic HTML5 typography scale and Tailwind utility patterns for headings, body copy, lists, blockquotes, inline code, and links."
        version="v1.0.0"
      />

      <FeatureGrid
        features={typographyPageFeatures}
        description="Consistent hierarchy, readable line measure, and semantic document structure."
      />

      <DemoTabs defaultValue="headings" tabs={typographyPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={typographyPageShortcuts}
        description="Keyboard and screen-reader navigation across headings and inline links."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Apply semantic HTML elements paired with Tailwind typography utilities."
        notes={typographyPageUsageNotes}
      />

      <APIReference
        sections={typographyPageAPISections}
        description="Recommended Tailwind CSS class recipes for each typographic role."
      />

      <Changelog
        entries={typographyPageChangelogEntries}
        title="Changelog"
        description="Version history for typography patterns."
      />
    </ComponentPage>
  );
}

const headingSpecimens = [
  {
    tag: "h1",
    label: "Heading 1",
    meta: "h1 · 4xl/5xl · 800",
    className:
      "scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl",
  },
  {
    tag: "h2",
    label: "Heading 2",
    meta: "h2 · 3xl · 600",
    className:
      "scroll-m-20 text-3xl font-semibold tracking-tight text-foreground",
  },
  {
    tag: "h3",
    label: "Heading 3",
    meta: "h3 · 2xl · 600",
    className:
      "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
  },
  {
    tag: "h4",
    label: "Heading 4",
    meta: "h4 · xl · 600",
    className:
      "scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
  },
  {
    tag: "h5",
    label: "Heading 5",
    meta: "h5 · lg · 600",
    className:
      "scroll-m-20 text-lg font-semibold tracking-tight text-foreground",
  },
  {
    tag: "h6",
    label: "Heading 6",
    meta: "h6 · base · 600",
    className:
      "scroll-m-20 text-base font-semibold tracking-tight text-foreground",
  },
] as const;

const typographyPageFeatures = [
  {
    title: "Semantic HTML5",
    description:
      "Headings, lists, blockquotes, and code elements preserve document outline for assistive tech and SEO.",
  },
  {
    title: "Readable Rhythm",
    description:
      "Balanced line-heights (leading-7), tight display tracking, and max-w-prose measure.",
  },
  {
    title: "Token-Aligned",
    description:
      "Inherits foreground, muted-foreground, primary, and mono font tokens from the active theme.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const typographyPageDemoTabs = [
  {
    value: "headings",
    label: "Headings",
    group: "Hierarchy",
    demo: (
      <DemoWrapper
        title="Heading Levels"
        description="Six semantic heading levels with scale and weight metadata."
        code={headingsCode}
      >
        <HeadingsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "paragraph",
    label: "Paragraph",
    group: "Hierarchy",
    demo: (
      <DemoWrapper
        title="Paragraph Text"
        description="Body copy constrained to a comfortable reading measure."
        code={paragraphCode}
      >
        <ParagraphDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Text Variants",
    group: "Hierarchy",
    demo: (
      <DemoWrapper
        title="Text Styles"
        description="Lead, large, small, and muted roles for scannable hierarchy."
        code={textVariantsCode}
      >
        <TextVariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "blockquote",
    label: "Blockquote",
    group: "Rich Text",
    demo: (
      <DemoWrapper
        title="Blockquote"
        description="Left-bordered quotation styling using semantic border tokens."
        code={blockquoteCode}
      >
        <BlockquoteDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "code",
    label: "Code",
    group: "Rich Text",
    demo: (
      <DemoWrapper
        title="Inline Code"
        description="Monospace inline snippets padded on the 4px spacing scale."
        code={inlineCodeCode}
      >
        <InlineCodeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "lists",
    label: "Lists",
    group: "Rich Text",
    demo: (
      <DemoWrapper
        title="Ordered & Unordered Lists"
        description="Disc and decimal markers with consistent item rhythm."
        code={listsCode}
      >
        <ListsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "links",
    label: "Links",
    group: "Rich Text",
    demo: (
      <DemoWrapper
        title="Text Links"
        description="Underlined inline anchors with clear keyboard focus outlines."
        code={linksCode}
      >
        <LinksDemo />
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
        description="Balanced multi-line headings, unbroken inline code wrapping, and disabled link styling inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const typographyPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    group: "Navigation",
    description: "Move keyboard focus between inline links inside prose.",
  },
  {
    keys: "Enter",
    group: "Activation",
    description: "Follow the focused anchor link.",
  },
  {
    keys: "H / 1–6",
    group: "Assistive technology",
    description:
      "Screen readers jump by semantic heading hierarchy when h1–h6 are used without skipping levels.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const typographyPageUsageNotes = [
  {
    label: "Single h1 per page",
    body: "Reserve h1 for the page title and nest h2–h6 in order without skipping levels; use size utilities if a lower-level heading needs larger visual emphasis.",
  },
  {
    label: "Comfortable measure",
    body: "Constrain long body copy with max-w-prose (65ch) so lines stay effortless to read on wide monitors.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const typographyPageAPISections = [
  {
    title: "Heading Classes (h1–h6)",
    props: [
      {
        prop: "scroll-m-20",
        type: "class",
        default: "-",
        description: "Scroll offset so anchored headings clear sticky headers.",
      },
      {
        prop: "font-extrabold / font-semibold",
        type: "class",
        default: "-",
        description: "Extra bold for h1; semibold for h2–h6.",
      },
      {
        prop: "tracking-tight",
        type: "class",
        default: "-",
        description: "Tighter letter spacing for large display headings.",
      },
    ],
  },
  {
    title: "Paragraph & Variants",
    props: [
      {
        prop: "leading-7",
        type: "class",
        default: "-",
        description: "1.75rem line-height for comfortable reading.",
      },
      {
        prop: "max-w-prose",
        type: "class",
        default: "-",
        description: "Constrains line length to ~65 characters.",
      },
      {
        prop: "text-xl text-muted-foreground",
        type: "class",
        default: "-",
        description: "Lead introductory paragraph styling.",
      },
      {
        prop: "text-sm text-muted-foreground",
        type: "class",
        default: "-",
        description: "Helper text, captions, and secondary copy.",
      },
    ],
  },
  {
    title: "Rich Text (Code, Quotes, Lists, Links)",
    props: [
      {
        prop: "rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold",
        type: "class",
        default: "-",
        description: "Inline code chip aligned with the 4px spacing scale.",
      },
      {
        prop: "border-l-2 border-border pl-6 italic",
        type: "class",
        default: "-",
        description: "Semantic blockquote styling.",
      },
      {
        prop: "my-4 ml-6 list-disc / list-decimal [&>li]:mt-2",
        type: "class",
        default: "-",
        description: "Unordered and ordered list indentation and spacing.",
      },
      {
        prop: "font-medium text-primary underline underline-offset-4",
        type: "class",
        default: "-",
        description: "High-visibility inline link with underline offset.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const typographyPageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Typography scale guide",
        description:
          "Documented semantic heading hierarchy, prose measure, token-aligned inline code (px-1 py-0.5), accessible link focus rings, and narrow-column stress cases.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
