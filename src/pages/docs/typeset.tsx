import { Link } from "@tanstack/react-router";
import { IconArrowRight } from "@tabler/icons-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ComponentPage, PageHeader, Section } from "@/components/docs";

const fontStackCode = `/* index.css */
@import "@fontsource-variable/geist";

@theme inline {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
}`;

const typeScale = [
  {
    className: "text-xs",
    px: "12px",
    lineHeight: "16px",
    usage: "Captions, timestamps, dense metadata",
  },
  {
    className: "text-sm",
    px: "14px",
    lineHeight: "20px",
    usage: "Secondary text, helper text, table cells",
  },
  {
    className: "text-base",
    px: "16px",
    lineHeight: "24px",
    usage: "Body default — never go below this for prose",
  },
  {
    className: "text-lg",
    px: "18px",
    lineHeight: "28px",
    usage: "Lead paragraphs, section intros",
  },
  {
    className: "text-xl",
    px: "20px",
    lineHeight: "28px",
    usage: "Section headings (h2), card titles",
  },
  {
    className: "text-2xl",
    px: "24px",
    lineHeight: "32px",
    usage: "h3, prominent card titles",
  },
  {
    className: "text-3xl",
    px: "30px",
    lineHeight: "36px",
    usage: "Page titles (h1) in app shells",
  },
  {
    className: "text-4xl",
    px: "36px",
    lineHeight: "40px",
    usage: "Marketing h1, hero headings",
  },
  {
    className: "text-5xl",
    px: "48px",
    lineHeight: "48px",
    usage: "Large-screen hero headings",
  },
];

const headingRecipes = [
  {
    label: "h1",
    className: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    sample: "Build with the system",
  },
  {
    label: "h2",
    className:
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight",
    sample: "Section heading",
  },
  {
    label: "h3",
    className: "scroll-m-20 text-2xl font-semibold tracking-tight",
    sample: "Subsection heading",
  },
  {
    label: "h4",
    className: "scroll-m-20 text-xl font-semibold tracking-tight",
    sample: "Card heading",
  },
  {
    label: "lead",
    className: "text-xl text-muted-foreground",
    sample: "A lead paragraph introduces the page in one sentence.",
  },
  {
    label: "p",
    className: "leading-7",
    sample:
      "Body copy uses the base size with relaxed line height. Keep measure between 45 and 75 characters for comfortable reading.",
  },
  {
    label: "small",
    className: "text-sm font-medium leading-none",
    sample: "Small print and legal text",
  },
  {
    label: "muted",
    className: "text-sm text-muted-foreground",
    sample: "Helper text and secondary descriptions",
  },
];

const weights = [400, 500, 600, 700, 800];

const fluidTypeCode = `/* Fluid display type — sanctioned for marketing surfaces.
   The spacing contract allows clamp() for page gutters and type. */
.hero-title {
  font-size: clamp(2rem, 1.4rem + 2.5vw, 3.5rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
}`;

const inlineCode = `// Inline code in prose:
// <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
// Block code: use the CodeBlock component (Shiki highlighting, copy button).`;

const dos = [
  "Pick sizes from the Tailwind scale — every step is a documented token.",
  "Use tracking-tight on large headings only; body text keeps default tracking.",
  "Keep inputs at 16px or larger below the md breakpoint (prevents iOS focus zoom).",
  "Use font-mono for code, IDs, and CLI output.",
];

const donts = [
  "Arbitrary sizes like text-[13px] — they break the scale and the CLI flags them.",
  "Body text below 14px, or prose below 16px.",
  "tracking-tight on paragraphs — it hurts readability at text sizes.",
  "All-caps body copy; reserve uppercase for short labels with added tracking.",
];

function FontStackSection() {
  return (
    <Section
      title="Font stack"
      description="Geist Variable is self-hosted through @fontsource-variable/geist — one variable file covers weights 100–900 with no layout shift from font swapping."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-6 pt-6">
            <span
              className="text-6xl font-semibold tracking-tight"
              aria-hidden="true"
            >
              Aa
            </span>
            <div className="space-y-1">
              <p className="text-2xl font-medium">Geist Variable</p>
              <p className="text-sm text-muted-foreground">
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
                <br />
                abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CodeBlock code={fontStackCode} language="css" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {weights.map((weight) => (
          <Card key={weight}>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl" style={{ fontWeight: weight }}>
                Ag
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {weight}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function TypeScaleSection() {
  return (
    <Section
      title="Type scale"
      description="Nine steps, each with a fixed size and line height. The specimen column renders the actual utility class."
    >
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Class</th>
                  <th className="py-2 text-left font-medium">Size / LH</th>
                  <th className="py-2 text-left font-medium">Specimen</th>
                  <th className="py-2 text-left font-medium">Use for</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {typeScale.map((step) => (
                  <tr key={step.className}>
                    <td className="py-2 font-mono text-xs">{step.className}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">
                      {step.px} / {step.lineHeight}
                    </td>
                    <td className="py-2">
                      <span className={step.className}>Design once</span>
                    </td>
                    <td className="py-2 text-muted-foreground">{step.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

function HeadingRecipesSection() {
  return (
    <Section
      title="Heading recipes"
      description="The same recipes used by the Typography component page. scroll-m-20 keeps anchored headings clear of sticky headers."
    >
      <Card>
        <CardContent className="space-y-6 pt-6">
          {headingRecipes.map((recipe) => (
            <div key={recipe.label} className="space-y-1">
              <p className="font-mono text-xs text-muted-foreground">
                {recipe.label} · {recipe.className}
              </p>
              <p className={recipe.className}>{recipe.sample}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}

function CodeTypographySection() {
  return (
    <Section
      title="Code typography"
      description="Inline code gets a muted chip; block code uses the CodeBlock component with Shiki highlighting and a copy button — never a raw pre."
    >
      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm">
            Install with{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
              npx kira-kit init
            </code>{" "}
            and import from{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
              @/components/ui
            </code>
            .
          </p>
          <CodeBlock code={inlineCode} language="tsx" />
        </CardContent>
      </Card>
    </Section>
  );
}

function FluidTypeSection() {
  return (
    <Section
      title="Fluid type"
      description="App UI uses the fixed scale so controls stay on the spacing ladder. Marketing and hero surfaces may use clamp() — the spacing contract explicitly sanctions it for page gutters and display type."
    >
      <Card>
        <CardContent className="pt-6">
          <CodeBlock code={fluidTypeCode} language="css" />
        </CardContent>
      </Card>
    </Section>
  );
}

function DoDontSection() {
  return (
    <Section title="Do / Don't">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-success/40">
          <CardHeader>
            <CardTitle className="text-base text-success">Do</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {dos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-base text-destructive">
              Don&apos;t
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {donts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function TypographyCta() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-6">
      <p className="text-sm text-muted-foreground">
        Live demos of every recipe, including lists and blockquotes, are on the
        Typography component page.
      </p>
      <Link
        to="/components/typography"
        className={cn(buttonVariants({ size: "sm" }), "gap-2")}
      >
        Typography demos
        <IconArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function TypesetPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Typeset"
        description="The kit's typography is a fixed Tailwind scale set in Geist Variable, with heading recipes shared across every docs page. This page is the reference — every specimen below renders the real classes."
      />
      <FontStackSection />
      <TypeScaleSection />
      <HeadingRecipesSection />
      <CodeTypographySection />
      <FluidTypeSection />
      <DoDontSection />
      <TypographyCta />
    </ComponentPage>
  );
}
