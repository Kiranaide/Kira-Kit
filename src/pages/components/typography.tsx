import {
  IconTypography,
  IconAlignLeft,
  IconPalette,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function HeadingsDemo() {
  return (
    <div className="space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
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
      </h6>
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
    <div className="space-y-6">
      <p className="leading-7">
        The king, seeing how much happier his subjects were, realized the error
        of his ways. He gave up his greedy nature and began to share the
        kingdom's wealth with all.
      </p>
      <p className="leading-7">
        And so, the kingdom flourished under his benevolent rule, and the people
        lived happily ever after.
      </p>
    </div>
  );
}

const paragraphCode = `<p className="leading-7">
  The king, seeing how much happier his subjects were, realized the error
  of his ways. He gave up his greedy nature and began to share the kingdom's
  wealth with all.
</p>
<p className="leading-7">
  And so, the kingdom flourished under his benevolent rule, and the people
  lived happily ever after.
</p>`;

function TextVariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Lead Text</p>
        <p className="text-xl text-muted-foreground">
          A modal dialog that interrupts the user with important content and
          expects a response.
        </p>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Large Text</p>
        <div className="text-lg font-semibold">Are you absolutely sure?</div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Small Text</p>
        <small className="text-sm font-medium leading-none">
          Email address
        </small>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Muted Text</p>
        <p className="text-sm text-muted-foreground">
          Enter your email address.
        </p>
      </div>
    </div>
  );
}

const textVariantsCode = `<p className="text-xl text-muted-foreground">
  A modal dialog that interrupts the user with important content and
  expects a response.
</p>

<div className="text-lg font-semibold">Are you absolutely sure?</div>

<small className="text-sm font-medium leading-none">
  Email address
</small>

<p className="text-sm text-muted-foreground">
  Enter your email address.
</p>`;

function BlockquoteDemo() {
  return (
    <blockquote className="mt-6 border-l-2 border-border pl-6 italic">
      "After all," he said, "everyone deserves a chance to fly."
    </blockquote>
  );
}

const blockquoteCode = `<blockquote className="mt-6 border-l-2 border-border pl-6 italic">
  "After all," he said, "everyone deserves a chance to fly."
</blockquote>`;

function InlineCodeDemo() {
  return (
    <p className="leading-7">
      Use the{" "}
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        @tanstack/react-table
      </code>{" "}
      library for powerful data tables.
    </p>
  );
}

const inlineCodeCode = `<p className="leading-7">
  Use the{" "}
  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
    @tanstack/react-table
  </code>{" "}
  library for powerful data tables.
</p>`;

function ListsDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h4 className="font-medium mb-2">Unordered List</h4>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">Ordered List</h4>
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>First item</li>
          <li>Second item</li>
          <li>Third item</li>
        </ol>
      </div>
    </div>
  );
}

const listsCode = `<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ol>`;

function LinksDemo() {
  return (
    <p className="leading-7">
      Visit our{" "}
      <a
        href="/components/typography"
        className="font-medium text-primary underline underline-offset-4"
      >
        documentation
      </a>{" "}
      to learn more.
    </p>
  );
}

const linksCode = `<p className="leading-7">
  Visit our{" "}
  <a
    href="#"
    className="font-medium text-primary underline underline-offset-4"
  >
    documentation
  </a>{" "}
  to learn more.
</p>`;

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function TypographyPage() {
  const features = [
    {
      title: "Semantic",
      description:
        "HTML5 semantic elements with proper ARIA attributes for accessibility and SEO.",
      icon: <IconTypography className="h-4 w-4" />,
    },
    {
      title: "Consistent",
      description:
        "Pre-configured Tailwind classes for consistent typography across your application.",
      icon: <IconAlignLeft className="h-4 w-4" />,
    },
    {
      title: "Flexible",
      description:
        "Customizable variants for headings, paragraphs, lists, code, and more.",
      icon: <IconPalette className="h-4 w-4" />,
    },
  ];

  const tabs = [
    {
      value: "headings",
      label: "Headings",
      demo: (
        <DemoWrapper
          title="Heading Levels"
          description="Six levels of semantic headings with proper tracking and sizing."
          code={headingsCode}
        >
          <HeadingsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "paragraph",
      label: "Paragraph",
      demo: (
        <DemoWrapper
          title="Paragraph Text"
          description="Body text with consistent line height and spacing."
          code={paragraphCode}
        >
          <ParagraphDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "variants",
      label: "Text Variants",
      demo: (
        <DemoWrapper
          title="Text Styles"
          description="Lead text, large, small, and muted text variants for different content needs."
          code={textVariantsCode}
        >
          <TextVariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "blockquote",
      label: "Blockquote",
      demo: (
        <DemoWrapper
          title="Blockquote"
          description="Styled blockquote element for citations and quotations."
          code={blockquoteCode}
        >
          <BlockquoteDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "code",
      label: "Code",
      demo: (
        <DemoWrapper
          title="Inline Code"
          description="Inline code elements with distinct styling for technical content."
          code={inlineCodeCode}
        >
          <InlineCodeDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "lists",
      label: "Lists",
      demo: (
        <DemoWrapper
          title="Ordered & Unordered Lists"
          description="Styled list elements with proper spacing and indicators."
          code={listsCode}
        >
          <ListsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "links",
      label: "Links",
      demo: (
        <DemoWrapper
          title="Text Links"
          description="Styled anchor elements with hover states and underlines."
          code={linksCode}
        >
          <LinksDemo />
        </DemoWrapper>
      ),
    },
  ];

  const apiSections = [
    {
      title: "Heading Styles (h1-h6)",
      props: [
        {
          prop: "scroll-m-20",
          type: "string",
          default: "class",
          description: "Scroll margin for anchor links.",
        },
        {
          prop: "font-extrabold",
          type: "string",
          default: "h1 only",
          description: "Extra bold weight for main headings.",
        },
        {
          prop: "font-semibold",
          type: "string",
          default: "h2-h6",
          description: "Semibold weight for subheadings.",
        },
        {
          prop: "tracking-tight",
          type: "string",
          default: "class",
          description: "Tight letter spacing for headings.",
        },
      ],
    },
    {
      title: "Paragraph Styles",
      props: [
        {
          prop: "leading-7",
          type: "string",
          default: "class",
          description: "Line height of 1.75rem for comfortable reading.",
        },
        {
          prop: "[&:not(:first-child)]:mt-6",
          type: "string",
          default: "class",
          description: "Adds margin-top to all paragraphs except the first.",
        },
      ],
    },
    {
      title: "Text Variants",
      props: [
        {
          prop: "text-xl text-muted-foreground",
          type: "string",
          default: "class",
          description: "Lead text - large, muted introductory text.",
        },
        {
          prop: "text-lg font-semibold",
          type: "string",
          default: "class",
          description: "Large text - emphasized content.",
        },
        {
          prop: "text-sm font-medium",
          type: "string",
          default: "class",
          description: "Small text - labels and auxiliary text.",
        },
        {
          prop: "text-sm text-muted-foreground",
          type: "string",
          default: "class",
          description: "Muted text - secondary information.",
        },
      ],
    },
    {
      title: "Inline Code",
      props: [
        {
          prop: "bg-muted",
          type: "string",
          default: "class",
          description: "Muted background color.",
        },
        {
          prop: "px-[0.3rem] py-[0.2rem]",
          type: "string",
          default: "class",
          description: "Horizontal and vertical padding.",
        },
        {
          prop: "font-mono",
          type: "string",
          default: "class",
          description: "Monospace font family.",
        },
        {
          prop: "text-sm font-semibold",
          type: "string",
          default: "class",
          description: "Small, semibold weight.",
        },
      ],
    },
    {
      title: "Blockquote",
      props: [
        {
          prop: "border-l-2 border-border",
          type: "string",
          default: "class",
          description: "Left border for visual separation.",
        },
        {
          prop: "pl-6",
          type: "string",
          default: "class",
          description: "Left padding for text spacing.",
        },
        {
          prop: "italic",
          type: "string",
          default: "class",
          description: "Italic font style for quotations.",
        },
      ],
    },
    {
      title: "Lists",
      props: [
        {
          prop: "my-6 ml-6",
          type: "string",
          default: "class",
          description: "Vertical margin and left indentation.",
        },
        {
          prop: "list-disc",
          type: "string",
          default: "class",
          description: "Disc bullet points for unordered lists.",
        },
        {
          prop: "list-decimal",
          type: "string",
          default: "class",
          description: "Numbered markers for ordered lists.",
        },
        {
          prop: "[&>li]:mt-2",
          type: "string",
          default: "class",
          description: "Adds margin-top to all list items.",
        },
      ],
    },
    {
      title: "Links",
      props: [
        {
          prop: "font-medium text-primary",
          type: "string",
          default: "class",
          description: "Medium weight with primary color.",
        },
        {
          prop: "underline underline-offset-4",
          type: "string",
          default: "class",
          description: "Underline with spacing from text.",
        },
      ],
    },
  ];

  const usageCode = `import { cn } from "@/lib/utils"

// Heading 1
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Title
</h1>

// Lead text
<p className="text-xl text-muted-foreground">
  Description
</p>

// Paragraph
<p className="leading-7 [&:not(:first-child)]:mt-6">
  Content
</p>

// Inline code
<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  code
</code>

// Blockquote
<blockquote className="mt-6 border-l-2 border-border pl-6 italic">
  Quote
</blockquote>

// List
<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>Item</li>
</ul>

// Link
<a href="#" className="font-medium text-primary underline underline-offset-4">
  Link text
</a>`;

  return (
    <ComponentPage>
      <PageHeader
        title="Typography"
        description="Text styles and formatting for consistent typography across your application. Includes headings, paragraphs, lists, code, and more with semantic HTML5 elements and accessibility support."
        version="v1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={tabs} defaultValue="headings" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import the classes directly or use the pre-configured Tailwind utilities for consistent typography."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Tailwind CSS classes used for typography styling"
      />
    </ComponentPage>
  );
}
