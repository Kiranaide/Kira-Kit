import { CodeBlock } from "@/components/ui/code-block";
import {
  DocGuidePage,
  DocGuideSection,
  type DocGuideTocItem,
} from "@/components/docs/doc-guide";

const SECTIONS: readonly DocGuideTocItem[] = [
  { id: "font-stack", label: "Font stack" },
  { id: "type-scale", label: "Type scale" },
  { id: "heading-recipes", label: "Heading recipes" },
  { id: "code-typography", label: "Code typography" },
  { id: "fluid-type", label: "Fluid type" },
];

const TYPE_SCALE = [
  {
    utility: "text-5xl",
    metrics: "48/48",
    sample: "Display",
    sampleClass: "text-5xl font-semibold tracking-[-1.05px]",
  },
  {
    utility: "text-4xl",
    metrics: "36/40",
    sample: "Hero",
    sampleClass: "text-4xl font-semibold tracking-[-1.05px]",
  },
  {
    utility: "text-3xl",
    metrics: "30/36",
    sample: "Page title",
    sampleClass: "text-3xl font-semibold tracking-[-1.05px]",
  },
  {
    utility: "text-2xl",
    metrics: "24/32",
    sample: "Subsection",
    sampleClass: "text-2xl font-semibold tracking-[-0.35px]",
  },
  {
    utility: "text-xl",
    metrics: "20/28",
    sample: "Section title",
    sampleClass: "text-xl font-semibold tracking-[-0.35px]",
  },
  {
    utility: "text-lg",
    metrics: "18/28",
    sample: "Lead",
    sampleClass: "text-lg font-normal tracking-[-0.35px]",
  },
  {
    utility: "text-base",
    metrics: "16/24",
    sample: "Body",
    sampleClass: "text-base font-normal tracking-[-0.35px]",
  },
  {
    utility: "text-sm",
    metrics: "14/20",
    sample: "Supporting text",
    sampleClass: "text-sm font-normal tracking-[-0.35px]",
  },
  {
    utility: "text-xs",
    metrics: "12/16",
    sample: "Labels",
    sampleClass: "text-xs font-normal tracking-[-0.35px]",
  },
] as const;

const HEADING_RECIPE_CODE = `<h2 className="text-3xl font-semibold tracking-tight">Section heading</h2>`;

const CODE_TYPOGRAPHY_CODE = `code {
  font-family: var(--font-mono);
}`;

const FLUID_TYPE_CODE = `<h1 className="text-4xl lg:text-5xl">Build with the system</h1>`;

function FontStackSection() {
  return (
    <DocGuideSection
      id="font-stack"
      title="Font stack"
      description="Geist is the default interface font. Geist Mono is used for code, commands, and tabular data."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          data-slot="typeset-specimen-sans"
          className="flex flex-col gap-2.5 rounded-[14px] border border-border bg-card p-4 lg:gap-3 lg:p-6"
        >
          <span className="font-mono text-[13px] leading-[1.42] docs-accent">
            Geist
          </span>
          <p className="font-sans text-[45px] font-semibold leading-[1.15] tracking-[-1.05px] text-card-foreground lg:text-[53px]">
            Aa 012
          </p>
          <p className="text-sm leading-[1.53] text-muted-foreground">
            Interface &amp; long-form text
          </p>
        </div>

        <div
          data-slot="typeset-specimen-mono"
          className="flex flex-col gap-2.5 rounded-[14px] border border-[#34454A] bg-[#080A0C] p-4 text-[#F4F5F6] lg:gap-3 lg:p-6 dark:border-border"
        >
          <span className="font-mono text-[13px] leading-[1.42] text-[color-mix(in_oklch,var(--primary)_72%,white)]">
            Geist Mono
          </span>
          <p className="font-mono text-[45px] font-semibold leading-[1.15] tracking-[-1.05px] text-[#F4F5F6] lg:text-[53px]">
            Aa 012
          </p>
          <p className="text-sm leading-[1.53] text-[#9C9FA0]">
            Code &amp; tabular data
          </p>
        </div>
      </div>
    </DocGuideSection>
  );
}

function TypeScaleSection() {
  return (
    <DocGuideSection
      id="type-scale"
      title="Type scale"
      description="Use the utility shown beside each sample. Keep paragraphs around 45 to 75 characters per line."
    >
      <ul
        data-slot="typeset-visual-scale"
        className="flex flex-col divide-y divide-border border-t border-border"
      >
        {TYPE_SCALE.map((step) => (
          <li
            key={step.utility}
            className="flex flex-col gap-1.5 py-2.5 sm:flex-row sm:items-center sm:gap-5"
          >
            <span className="flex w-[175px] shrink-0 items-center gap-2.5 font-mono text-xs leading-[1.42] tabular-nums docs-accent">
              <span>{step.utility}</span>
              <span>{step.metrics}</span>
            </span>
            <span
              className={`min-w-0 flex-1 text-foreground ${step.sampleClass}`}
            >
              {step.sample}
            </span>
          </li>
        ))}
      </ul>
    </DocGuideSection>
  );
}

function HeadingRecipesSection() {
  return (
    <DocGuideSection
      id="heading-recipes"
      title="Heading recipes"
      description="Use headings in document order. Set the visual size with utilities to match the content hierarchy."
    >
      <CodeBlock code={HEADING_RECIPE_CODE} language="tsx" showLineNumbers />
    </DocGuideSection>
  );
}

function CodeTypographySection() {
  return (
    <DocGuideSection
      id="code-typography"
      title="Code typography"
      description="Use font-mono for inline code and CodeBlock for copyable examples. Both follow --font-mono."
    >
      <CodeBlock code={CODE_TYPOGRAPHY_CODE} language="css" showLineNumbers />
    </DocGuideSection>
  );
}

function FluidTypeSection() {
  return (
    <DocGuideSection
      id="fluid-type"
      title="Fluid type"
      description="Use responsive sizes for display headings. Keep body copy at a consistent reading size."
    >
      <CodeBlock code={FLUID_TYPE_CODE} language="tsx" showLineNumbers />
    </DocGuideSection>
  );
}

export default function TypesetPage() {
  return (
    <DocGuidePage
      title="Typeset"
      crumb="Typeset"
      description="Use a shared type scale for interface copy, documentation, and code. Choose sizes by reading role."
      sections={SECTIONS}
      previous={{ to: "/docs/cli", label: "CLI" }}
      next={{ to: "/docs/form", label: "Form" }}
    >
      <FontStackSection />
      <TypeScaleSection />
      <HeadingRecipesSection />
      <CodeTypographySection />
      <FluidTypeSection />
    </DocGuidePage>
  );
}
