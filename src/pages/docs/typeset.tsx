import { CodeBlock } from "@/components/ui/code-block";
import {
  DocGuidePage,
  DocGuideSection,
  type DocGuideTocItem,
} from "@/components/docs/doc-guide";
import {
  DEFAULT_DOC_MONO,
  DEFAULT_DOC_SANS,
  DOC_FONT_PRESETS,
  DOC_MONO_FONTS,
  DOC_SANS_FONTS,
  DOC_SERIF_FONTS,
  findDocFont,
  type DocsFont,
} from "@/lib/fonts";

const SECTIONS: readonly DocGuideTocItem[] = [
  { id: "font-presets", label: "Font pairings" },
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
    sampleClass: "text-5xl font-semibold tracking-tight",
  },
  {
    utility: "text-4xl",
    metrics: "36/40",
    sample: "Hero",
    sampleClass: "text-4xl font-semibold tracking-tight",
  },
  {
    utility: "text-3xl",
    metrics: "30/36",
    sample: "Page title",
    sampleClass: "text-3xl font-semibold tracking-tight",
  },
  {
    utility: "text-2xl",
    metrics: "24/32",
    sample: "Subsection",
    sampleClass: "text-2xl font-semibold tracking-tight",
  },
  {
    utility: "text-xl",
    metrics: "20/28",
    sample: "Section title",
    sampleClass: "text-xl font-semibold tracking-tight",
  },
  {
    utility: "text-lg",
    metrics: "18/28",
    sample: "Lead",
    sampleClass: "text-lg font-normal",
  },
  {
    utility: "text-base",
    metrics: "16/24",
    sample: "Body",
    sampleClass: "text-base font-normal",
  },
  {
    utility: "text-sm",
    metrics: "14/20",
    sample: "Supporting text",
    sampleClass: "text-sm font-normal",
  },
  {
    utility: "text-xs",
    metrics: "12/16",
    sample: "Labels",
    sampleClass: "text-xs font-normal",
  },
] as const;

const HEADING_RECIPE_CODE = `<h2 className="text-3xl font-semibold tracking-tight">Section heading</h2>`;

const CODE_TYPOGRAPHY_CODE = `code {
  font-family: var(--font-mono);
}`;

const FLUID_TYPE_CODE = `<h1 className="text-4xl lg:text-5xl">Build with the system</h1>`;

function FontSpecimens({
  title,
  fonts,
  defaultName,
}: {
  title: string;
  fonts: readonly DocsFont[];
  defaultName: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-3">
        {fonts.map((font) => (
          <li
            key={font.name}
            className="flex min-w-0 flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-sm font-medium">
                {font.family.replace(/ Variable$/, "")}
              </span>
              {font.name === defaultName && (
                <span className="text-xs text-muted-foreground">Default</span>
              )}
            </div>
            <p
              className="text-3xl font-semibold leading-tight tracking-tight"
              style={{ fontFamily: font.stack }}
            >
              Aa 012
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FontPresetsSection() {
  return (
    <DocGuideSection
      id="font-presets"
      title="Curated font pairings"
      description="Install a complete Display + Body + Mono variable font stack with one --font-preset flag."
    >
      <ul
        data-slot="typeset-font-presets"
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {DOC_FONT_PRESETS.map((preset) => {
          const display = findDocFont("display", preset.display);
          const sans = findDocFont("sans", preset.sans);
          const mono = findDocFont("mono", preset.mono);

          return (
            <li
              key={preset.name}
              className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-card-foreground"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {preset.name}
                </span>
                <span className="rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  {preset.badge}
                </span>
              </div>
              <p
                className="text-2xl font-semibold leading-tight"
                style={{
                  fontFamily: display.stack,
                  letterSpacing: preset.headingTracking,
                }}
              >
                {preset.title}
              </p>
              <p
                className="text-xs leading-relaxed text-muted-foreground"
                style={{ fontFamily: sans.stack }}
              >
                {preset.description}
              </p>
              <p
                className="mt-auto pt-1 text-xs text-muted-foreground"
                style={{ fontFamily: mono.stack }}
              >
                {display.family.replace(/ Variable$/, "")} /{" "}
                {sans.family.replace(/ Variable$/, "")} /{" "}
                {mono.family.replace(/ Variable$/, "")}
              </p>
            </li>
          );
        })}
      </ul>
    </DocGuideSection>
  );
}

function FontStackSection() {
  return (
    <DocGuideSection
      id="font-stack"
      title="Font stack"
      description="Use sans-serif for interface text, optional display serifs for editorial headlines, and monospace for code and tabular data."
    >
      <FontSpecimens
        title="Sans-serif"
        fonts={DOC_SANS_FONTS}
        defaultName={DEFAULT_DOC_SANS}
      />
      <FontSpecimens
        title="Display serif"
        fonts={DOC_SERIF_FONTS}
        defaultName=""
      />
      <FontSpecimens
        title="Monospace"
        fonts={DOC_MONO_FONTS}
        defaultName={DEFAULT_DOC_MONO}
      />
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
            className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-6"
          >
            <span className="flex w-44 shrink-0 items-center gap-3 font-mono text-xs leading-snug tabular-nums docs-accent">
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
      <FontPresetsSection />
      <FontStackSection />
      <TypeScaleSection />
      <HeadingRecipesSection />
      <CodeTypographySection />
      <FluidTypeSection />
    </DocGuidePage>
  );
}
