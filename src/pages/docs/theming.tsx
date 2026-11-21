import * as React from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Code,
  DocCallout,
  DocChecklist,
  DocPage,
  DocSection,
  DocTable,
  GuideLink,
} from "@/components/docs/doc-page";
import {
  DEFAULT_PRESET,
  presetSwatch,
  usePreset,
  type ThemePreset,
} from "@/lib/theme-presets";

const tokenRoles = [
  { token: "--primary", role: "Primary actions" },
  { token: "--background", role: "Page background" },
  { token: "--foreground", role: "Text and icons" },
  { token: "--muted", role: "Supporting surfaces" },
  { token: "--ring", role: "Focus indicator" },
];

const radiusSteps = [
  { className: "rounded-sm", label: "sm" },
  { className: "rounded-md", label: "md" },
  { className: "rounded-lg", label: "lg" },
  { className: "rounded-xl", label: "xl" },
  { className: "rounded-2xl", label: "2xl" },
];

const customColorCommand = `npx kira-kit theme --primary "#0C7F79" --base-color neutral --apply`;

const typographyCommand = `npx kira-kit theme --font inter --font-mono jetbrains-mono --icon lucide --apply`;

/**
 * A preset is a set of `--*` custom properties, so scoping them to one element
 * restyles every Tailwind token utility inside it. That is how the preview cards
 * show light and dark of the same preset without touching the site theme.
 */
function presetVars(preset: ThemePreset, mode: "light" | "dark") {
  // SAFETY: cssVars holds only `--*` custom properties, which React's closed
  // CSSProperties type cannot express.
  return {
    ...preset.cssVars[mode],
    ...preset.cssVars.theme,
    colorScheme: mode,
  } as React.CSSProperties;
}

function PresetSchematic({
  preset,
  mode,
}: {
  preset: ThemePreset;
  mode: "light" | "dark";
}) {
  // Both modes render the same mock, so the labelling id has to be per instance.
  const emailLabelId = React.useId();

  return (
    <div
      style={presetVars(preset, mode)}
      className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 text-foreground"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[17px] font-semibold">{preset.title}</span>
        <span className="text-xs text-muted-foreground capitalize">{mode}</span>
      </div>

      <div className="flex flex-col gap-4 rounded-[10px] border border-border bg-card p-4 text-card-foreground">
        <div className="flex flex-col gap-1">
          <p className="text-[19px] font-semibold leading-6 lg:text-[22px]">
            Workspace settings
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Manage team access and notification preferences.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span id={emailLabelId}>Email notifications</span>
          <Switch aria-labelledby={emailLabelId} defaultChecked />
        </div>

        <Input placeholder="Workspace name" aria-label="Workspace name" />

        <Button className="w-fit">Save changes</Button>
      </div>
    </div>
  );
}

function PresetChips({
  presets,
  selectedName,
  onSelect,
}: {
  presets: ThemePreset[];
  selectedName: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const active = preset.name === selectedName;

        return (
          <button
            key={preset.name}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(preset.name)}
            className={cn(
              "docs-focus-ring inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors duration-150 ease-out",
              active
                ? "border-primary bg-primary/10 docs-accent"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: presetSwatch(preset) }}
            />
            {preset.title}
          </button>
        );
      })}
    </div>
  );
}

function PresetsSection() {
  const { presets, presetName, setPresetName } = usePreset();

  const [selectedName, setSelectedName] = React.useState(
    () =>
      presets.find((preset) => preset.name === presetName)?.name ??
      "theme-phase-line",
  );

  const selected =
    presets.find((preset) => preset.name === selectedName) ?? presets[0];

  const isApplied = presetName === selected.name;

  return (
    <DocSection
      id="theme-presets"
      title="Theme presets"
      description="Preview a preset in both modes, then install it in your project."
    >
      <PresetChips
        presets={presets}
        selectedName={selected.name}
        onSelect={setSelectedName}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetSchematic preset={selected} mode="light" />
        <PresetSchematic preset={selected} mode="dark" />
      </div>

      <div className="flex flex-col gap-3">
        <CodeBlock
          code={`npx kira-kit add @kira-kit/${selected.name}`}
          language="bash"
          copyFormat="shell"
          showLineNumbers
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant={isApplied ? "default" : "outline"}
            aria-pressed={isApplied}
            onClick={() =>
              setPresetName(isApplied ? DEFAULT_PRESET : selected.name)
            }
          >
            {isApplied && <IconCheck aria-hidden="true" className="h-4 w-4" />}
            {isApplied ? "Applied to this site" : "Apply to this site"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Applying a preset re-skins every page you are reading; the theme
            toggle still governs light and dark.
          </p>
        </div>
      </div>
    </DocSection>
  );
}

function SemanticTokensSection() {
  return (
    <DocSection
      id="semantic-tokens"
      title="Semantic tokens"
      description="Style by role. Switching themes updates every surface that uses the same role."
    >
      <DocTable
        columns={["Token", "Role", "Now"]}
        rows={tokenRoles.map((entry) => [
          <Code key={entry.token}>{entry.token}</Code>,
          entry.role,
          <span
            key="swatch"
            aria-hidden="true"
            className="block h-6 w-10 rounded-[6px] border border-border"
            style={{ background: `var(${entry.token})` }}
          />,
        ])}
        caption="Semantic tokens"
      />
      <p className="text-sm leading-6 text-muted-foreground">
        Swatches show the tokens active on this site, so they follow the preset
        above and the light/dark toggle.
      </p>
    </DocSection>
  );
}

function CustomColorSection() {
  return (
    <DocSection
      id="custom-color"
      title="Custom color"
      description="Generate light and dark OKLCH palettes from a primary color. The CLI checks contrast for text and controls."
    >
      <CodeBlock
        code={customColorCommand}
        language="bash"
        copyFormat="shell"
        showLineNumbers
      />
      <DocChecklist
        items={[
          {
            title: "Neutral families",
            description:
              "--base-color accepts neutral, stone, zinc, slate, gray, mauve, olive, mist, and taupe.",
          },
          {
            title: "Contrast verified",
            description:
              "Generated tokens target WCAG 2.2 AA — 4.5:1 for text, 3:1 for UI — with APCA as a perceptual cross-check.",
          },
          {
            title: "Preview before writing",
            description: (
              <>
                Drop <Code>--apply</Code> to print the palette, or pass{" "}
                <Code>--out theme.json</Code> to save the registry item.
              </>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

function FontsAndIconsSection() {
  return (
    <DocSection
      id="fonts-and-icons"
      title="Fonts and icons"
      description="Choose a sans/mono pair and Tabler or Lucide. Apply typography separately from color."
    >
      <CodeBlock
        code={typographyCommand}
        language="bash"
        copyFormat="shell"
        showLineNumbers
      />
      <DocTable
        columns={["Option", "Choices"]}
        rows={[
          [
            <Code key="f">--font</Code>,
            "geist, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans",
          ],
          [
            <Code key="fm">--font-mono</Code>,
            "geist-mono, jetbrains-mono, fira-code",
          ],
          [<Code key="i">--icon</Code>, "tabler, lucide"],
        ]}
        caption="Typography and icon options"
      />
      <DocCallout title="Icon rewrites happen at install time" variant="info">
        <Code>--icon lucide</Code> rewrites component imports to{" "}
        <Code>lucide-react</Code> as files are copied, keeping local aliases so
        usages keep their names. The docs site itself stays on Tabler.
      </DocCallout>
    </DocSection>
  );
}

function RadiusAndDarkModeSection() {
  return (
    <DocSection
      id="radius-and-dark-mode"
      title="Radius and dark mode"
      description="Adjust --radius to scale corners across controls and surfaces. Keep light and dark values paired so component classes stay the same."
    >
      <div className="flex flex-wrap gap-3">
        {radiusSteps.map((step) => (
          <div key={step.label} className="flex w-[84px] flex-col gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "h-12 w-full border-2 border-primary bg-primary/10",
                step.className,
              )}
            />
            <span className="text-[13px] font-medium text-muted-foreground">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <CodeBlock
        code={`:root {\n  --radius: 0.45rem;\n  --background: oklch(1 0 0);\n  --foreground: oklch(0.145 0 0);\n}\n.dark {\n  --background: oklch(0.145 0 0);\n  --foreground: oklch(0.985 0 0);\n}`}
        language="css"
        showLineNumbers
      />

      <p className="text-sm leading-6 text-muted-foreground">
        Dark mode is a <Code>.dark</Code> class on <Code>&lt;html&gt;</Code>:{" "}
        <GuideLink to="/docs/cli">kira-kit theme</GuideLink> writes both blocks
        from one palette, and a preset ships its own paired light and dark
        values so component classes never change.
      </p>
    </DocSection>
  );
}

export default function ThemingPage() {
  return (
    <DocPage
      title="Theming"
      description="Use semantic CSS variables to give components a consistent light and dark palette."
      previous={{ to: "/docs/installation", label: "Installation" }}
      next={{ to: "/docs/transitions", label: "Transitions" }}
    >
      <PresetsSection />
      <SemanticTokensSection />
      <CustomColorSection />
      <FontsAndIconsSection />
      <RadiusAndDarkModeSection />
    </DocPage>
  );
}
