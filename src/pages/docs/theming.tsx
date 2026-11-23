import * as React from "react";
import {
  IconCheck,
  IconRotateClockwise,
  IconSparkles,
} from "@tabler/icons-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  DEFAULT_DOC_FONT_PRESET,
  DOC_BASE_COLORS,
  DOC_FONT_PRESETS,
  DOC_RADIUS_PRESETS,
  DOC_SURFACE_PRESETS,
  findDocFont,
  findDocFontPreset,
  findThemeRecipeMeta,
  resolveThemeTokens,
  type DocBaseColorPreset,
  type DocFontPresetName,
} from "@/lib/theme-studio";
import {
  AUTO_VALUE,
  DEFAULT_PRESET,
  presetSwatch,
  usePreset,
  type BaseColorSelection,
  type RadiusSelection,
  type SurfaceSelection,
  type ThemePreset,
} from "@/lib/theme-presets";

const tokenRoles = [
  { token: "--primary", role: "Primary actions & focus" },
  { token: "--background", role: "Page canvas" },
  { token: "--card", role: "Elevated surface cards" },
  { token: "--muted", role: "Supporting fills & chips" },
  { token: "--foreground", role: "Primary ink & icons" },
  { token: "--border", role: "Hairlines & separators" },
  { token: "--ring", role: "WCAG 3:1 focus ring" },
];

const radiusSteps = [
  { className: "rounded-sm", label: "sm" },
  { className: "rounded-md", label: "md" },
  { className: "rounded-lg", label: "lg" },
  { className: "rounded-xl", label: "xl" },
  { className: "rounded-2xl", label: "2xl" },
];

// kira-kit-ignore raw-colors: CLI usage snippet demonstrating the --primary hex argument
const customColorCommand = `npx kira-kit theme --primary "#2552D9" --base-color anthracite --font-preset fintech --radius balanced --surface tactile --apply`;

const typographyCommand = `npx kira-kit theme --font-preset editorial --radius crisp --surface tactile --apply`;

interface PreviewSelection {
  preset: ThemePreset;
  baseColor: BaseColorSelection;
  fontPreset: DocFontPresetName;
  radius: RadiusSelection;
  surface: SurfaceSelection;
}

interface PreviewTokenVars {
  [token: string]: string;
}

/**
 * Scope composed theme, base color, font pairing, radius, and surface tokens
 * to one preview container so light and dark render side-by-side without
 * mutating the rest of the page until applied.
 */
function buildPreviewStyle(
  selection: PreviewSelection,
  mode: "light" | "dark",
): React.CSSProperties {
  const resolved = resolveThemeTokens({
    cssVars: selection.preset.cssVars,
    baseColor: selection.baseColor,
    radius: selection.radius,
    surface: selection.surface,
  });

  const vars: PreviewTokenVars = { ...resolved[mode] };
  const fontSpec = findDocFontPreset(selection.fontPreset);
  const sansFont = findDocFont("sans", fontSpec.sans);
  const displayFont = findDocFont("display", fontSpec.display);
  const monoFont = findDocFont("mono", fontSpec.mono);

  vars["--font-sans"] = sansFont.stack;
  vars["--font-display"] = displayFont.stack;
  vars["--font-mono"] = monoFont.stack;

  // SAFETY: vars holds CSS custom properties alongside standard style keys,
  // which React's closed CSSProperties interface cannot index directly.
  return {
    ...vars,
    colorScheme: mode,
    fontFamily: sansFont.stack,
  } as React.CSSProperties;
}

function buildCliCommand(selection: PreviewSelection): string {
  const flags: string[] = [];

  if (selection.baseColor !== AUTO_VALUE) {
    flags.push(`--base-color ${selection.baseColor}`);
  }

  flags.push(`--font-preset ${selection.fontPreset}`);

  if (selection.radius !== AUTO_VALUE) {
    flags.push(`--radius ${selection.radius}`);
  }

  if (selection.surface !== AUTO_VALUE) {
    flags.push(`--surface ${selection.surface}`);
  }

  return `npx kira-kit add @kira-kit/${selection.preset.name}\nnpx kira-kit theme ${flags.join(" ")} --apply`;
}

function PresetSchematic({
  selection,
  mode,
}: {
  selection: PreviewSelection;
  mode: "light" | "dark";
}) {
  const emailLabelId = React.useId();
  const fontSpec = findDocFontPreset(selection.fontPreset);
  const displayFont = findDocFont("display", fontSpec.display);
  const monoFont = findDocFont("mono", fontSpec.mono);

  const effectiveBase =
    selection.baseColor === AUTO_VALUE
      ? (findThemeRecipeMeta(selection.preset.name)?.baseColor ?? "neutral")
      : selection.baseColor;

  return (
    <div
      data-slot="preset-schematic"
      style={buildPreviewStyle(selection, mode)}
      className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 text-foreground"
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className="text-lg font-semibold leading-snug"
          style={{
            fontFamily: displayFont.stack,
            letterSpacing: fontSpec.headingTracking,
          }}
        >
          {selection.preset.title}
        </span>
        <span
          className="rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
          style={{ fontFamily: monoFont.stack }}
        >
          {effectiveBase} · {mode}
        </span>
      </div>

      <Card size="sm" className="gap-4 rounded-lg">
        <div className="flex flex-col gap-1">
          <p
            className="text-xl font-semibold leading-snug lg:text-2xl"
            style={{
              fontFamily: displayFont.stack,
              letterSpacing: fontSpec.headingTracking,
            }}
          >
            Workspace settings
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Calibrated OKLCH surfaces paired with {fontSpec.title.toLowerCase()}{" "}
            typography.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-muted/60 px-3 py-2 text-sm">
          <span id={emailLabelId}>Live contrast guard</span>
          <Switch aria-labelledby={emailLabelId} defaultChecked />
        </div>

        <Input placeholder="Workspace name" aria-label="Workspace name" />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button className="w-fit">Save changes</Button>
          <span
            className="text-xs text-muted-foreground"
            style={{ fontFamily: monoFont.stack }}
          >
            AA 4.5:1+
          </span>
        </div>
      </Card>
    </div>
  );
}

function BaseColorCard({
  base,
  active,
  onSelect,
}: {
  base: DocBaseColorPreset;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${base.title} base color (${base.family})`}
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "docs-focus-ring flex min-h-11 flex-col gap-2 rounded-xl border p-3 text-left transition-colors duration-150 ease-out",
        active
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:bg-accent/50",
      )}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span className="text-xs font-semibold text-foreground">
          {base.title}
        </span>
        <span className="font-mono text-xs capitalize text-muted-foreground">
          {base.family}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <div
          className="flex flex-col gap-1 rounded-md border p-2"
          style={{
            backgroundColor: base.light["--background"],
            borderColor: base.light["--border"],
          }}
        >
          <span
            className="block h-3 rounded-sm border"
            style={{
              backgroundColor: base.light["--card"],
              borderColor: base.light["--border"],
            }}
          />
          <span
            className="block h-2 w-2/3 rounded-sm"
            style={{ backgroundColor: base.light["--muted"] }}
          />
        </div>
        <div
          className="flex flex-col gap-1 rounded-md border p-2"
          style={{
            backgroundColor: base.dark["--background"],
            borderColor: base.dark["--border"],
          }}
        >
          <span
            className="block h-3 rounded-sm border"
            style={{
              backgroundColor: base.dark["--card"],
              borderColor: base.dark["--border"],
            }}
          />
          <span
            className="block h-2 w-2/3 rounded-sm"
            style={{ backgroundColor: base.dark["--muted"] }}
          />
        </div>
      </div>
    </button>
  );
}

function AccentRecipePicker({
  presets,
  selectedName,
  onSelect,
  onApplyRecipe,
}: {
  presets: ThemePreset[];
  selectedName: string;
  onSelect: (name: string) => void;
  onApplyRecipe: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          1. Accent &amp; starter recipe
        </span>
        <button
          type="button"
          onClick={onApplyRecipe}
          className="docs-focus-ring inline-flex min-h-11 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:min-h-8"
        >
          <IconSparkles aria-hidden="true" className="size-4" />
          Use recipe defaults
        </button>
      </div>
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
                "docs-focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors duration-150 ease-out sm:min-h-9",
                active
                  ? "border-primary bg-primary/10 docs-accent"
                  : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <span
                aria-hidden="true"
                className="size-3 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: presetSwatch(preset) }}
              />
              {preset.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BaseColorPicker({
  selectedThemeName,
  draftBase,
  onSelect,
}: {
  selectedThemeName: string;
  draftBase: BaseColorSelection;
  onSelect: (value: BaseColorSelection) => void;
}) {
  const effectiveBase =
    draftBase === AUTO_VALUE
      ? findThemeRecipeMeta(selectedThemeName)?.baseColor
      : draftBase;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          2. Base color foundation (OKLCH light + dark ramp)
        </span>
        {draftBase !== AUTO_VALUE && (
          <button
            type="button"
            onClick={() => onSelect(AUTO_VALUE)}
            className="docs-focus-ring inline-flex min-h-11 items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground sm:min-h-8"
          >
            <IconRotateClockwise aria-hidden="true" className="size-3" />
            Follow theme
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {DOC_BASE_COLORS.map((base) => (
          <BaseColorCard
            key={base.name}
            base={base}
            active={effectiveBase === base.name}
            onSelect={() => onSelect(base.name)}
          />
        ))}
      </div>
    </div>
  );
}

function FontPairingPicker({
  draftFont,
  onSelect,
}: {
  draftFont: DocFontPresetName;
  onSelect: (value: DocFontPresetName) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        3. Font pairing preset (Display + Body + Mono)
      </span>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {DOC_FONT_PRESETS.map((item) => {
          const active = draftFont === item.name;
          const displayFace = findDocFont("display", item.display);
          const sansFace = findDocFont("sans", item.sans);
          const monoFace = findDocFont("mono", item.mono);
          const displayLabel = displayFace.family.replace(/ Variable$/, "");
          const sansLabel = sansFace.family.replace(/ Variable$/, "");

          const pairingLabel =
            item.display === item.sans
              ? displayLabel
              : `${displayLabel} + ${sansLabel}`;

          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(item.name)}
              className={cn(
                "docs-focus-ring flex min-h-11 flex-col gap-2 rounded-xl border p-3 text-left transition-colors duration-150 ease-out",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/50",
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className="text-base font-semibold text-foreground"
                  style={{
                    fontFamily: displayFace.stack,
                    letterSpacing: item.headingTracking,
                  }}
                >
                  {item.title}
                </span>
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {item.badge}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: sansFace.stack }}
              >
                {pairingLabel}
              </p>
              <span
                className="text-xs text-muted-foreground"
                style={{ fontFamily: monoFace.stack }}
              >
                {monoFace.family.replace(/ Variable$/, "")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RadiusPicker({
  draftRadius,
  themeRadius,
  onSelect,
}: {
  draftRadius: RadiusSelection;
  themeRadius: string;
  onSelect: (value: RadiusSelection) => void;
}) {
  const followsTheme = draftRadius === AUTO_VALUE;

  const themeRadiusPreset = DOC_RADIUS_PRESETS.find(
    (item) => item.value === themeRadius,
  );

  const activeRadius = followsTheme ? themeRadiusPreset?.name : draftRadius;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          4. Corner radius
        </span>
        {followsTheme ? (
          <span className="text-xs text-muted-foreground">
            Theme default · {themeRadiusPreset?.title ?? themeRadius}
          </span>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="min-h-11 md:min-h-8"
            onClick={() => onSelect(AUTO_VALUE)}
          >
            Follow theme radius
          </Button>
        )}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {DOC_RADIUS_PRESETS.map((item) => {
          const active = activeRadius === item.name;

          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(item.name)}
              className={cn(
                "docs-focus-ring flex min-h-11 flex-col items-center gap-2 rounded-lg border p-2 text-center transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/50",
              )}
            >
              <span
                aria-hidden="true"
                className="h-5 w-full border-2 border-primary bg-primary/15"
                style={{ borderRadius: item.value }}
              />
              <span className="text-xs font-medium text-foreground">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SurfacePicker({
  effectiveSurface,
  onSelect,
}: {
  effectiveSurface: string;
  onSelect: (value: SurfaceSelection) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        5. Surface style
      </span>
      <div className="grid grid-cols-3 gap-2">
        {DOC_SURFACE_PRESETS.map((item) => {
          const active = effectiveSurface === item.name;

          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(item.name)}
              className={cn(
                "docs-focus-ring flex min-h-11 flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/50",
              )}
            >
              <span className="text-xs font-semibold text-foreground">
                {item.title}
              </span>
              <span className="text-xs leading-snug text-muted-foreground">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GeometryPicker({
  preset,
  draftRadius,
  draftSurface,
  onSelectRadius,
  onSelectSurface,
}: {
  preset: ThemePreset;
  draftRadius: RadiusSelection;
  draftSurface: SurfaceSelection;
  onSelectRadius: (value: RadiusSelection) => void;
  onSelectSurface: (value: SurfaceSelection) => void;
}) {
  const recipe = findThemeRecipeMeta(preset.name);

  const themeRadius =
    preset.cssVars.theme?.["--radius"] ?? preset.cssVars.light["--radius"];

  const effectiveSurface =
    draftSurface === AUTO_VALUE ? (recipe?.surface ?? "tactile") : draftSurface;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RadiusPicker
        draftRadius={draftRadius}
        themeRadius={themeRadius}
        onSelect={onSelectRadius}
      />
      <SurfacePicker
        effectiveSurface={effectiveSurface}
        onSelect={onSelectSurface}
      />
    </div>
  );
}

function useStudioDraft() {
  const ctx = usePreset();

  const [selectedName, setSelectedName] = React.useState(
    () =>
      ctx.presets.find((preset) => preset.name === ctx.presetName)?.name ??
      "theme-cobalt-studio",
  );

  const [draftBase, setDraftBase] = React.useState<BaseColorSelection>(
    ctx.baseColor,
  );

  const [draftFont, setDraftFont] = React.useState<DocFontPresetName>(() =>
    selectedName === ctx.presetName || ctx.isCustomized
      ? ctx.fontPreset
      : (findThemeRecipeMeta(selectedName)?.fontPreset ??
        DEFAULT_DOC_FONT_PRESET),
  );

  const [draftRadius, setDraftRadius] = React.useState<RadiusSelection>(
    ctx.radius,
  );

  const [draftSurface, setDraftSurface] = React.useState<SurfaceSelection>(
    ctx.surface,
  );

  const selected =
    ctx.presets.find((preset) => preset.name === selectedName) ??
    ctx.presets[0];

  const isApplied =
    ctx.presetName === selected.name &&
    ctx.baseColor === draftBase &&
    ctx.fontPreset === draftFont &&
    ctx.radius === draftRadius &&
    ctx.surface === draftSurface;

  function selectThemePreset(name: string) {
    setSelectedName(name);
    const meta = findThemeRecipeMeta(name);

    setDraftBase(AUTO_VALUE);
    setDraftRadius(AUTO_VALUE);
    setDraftSurface(AUTO_VALUE);

    if (meta) setDraftFont(meta.fontPreset);
  }

  function toggleApply() {
    if (isApplied) {
      ctx.resetAll();
      setDraftBase(AUTO_VALUE);
      setDraftFont(DEFAULT_DOC_FONT_PRESET);
      setDraftRadius(AUTO_VALUE);
      setDraftSurface(AUTO_VALUE);

      return;
    }

    ctx.setPresetName(selected.name);
    ctx.setBaseColor(draftBase);
    ctx.setFontPreset(draftFont);
    ctx.setRadius(draftRadius);
    ctx.setSurface(draftSurface);
  }

  return {
    ctx,
    selection: {
      preset: selected,
      baseColor: draftBase,
      fontPreset: draftFont,
      radius: draftRadius,
      surface: draftSurface,
    } satisfies PreviewSelection,
    isApplied,
    setDraftBase,
    setDraftFont,
    setDraftRadius,
    setDraftSurface,
    selectThemePreset,
    toggleApply,
  };
}

function PresetStudioSection() {
  const studio = useStudioDraft();
  const { ctx, selection } = studio;

  return (
    <DocSection
      id="theme-presets"
      title="Preset studio"
      description="Compose a theme accent, calibrated OKLCH base color, variable font pairing, corner radius, and surface style. Preview both modes live, then copy one CLI setup."
    >
      <div data-slot="theming-studio" className="flex flex-col gap-6">
        <AccentRecipePicker
          presets={ctx.presets}
          selectedName={selection.preset.name}
          onSelect={studio.selectThemePreset}
          onApplyRecipe={() => {
            ctx.applyRecipe(selection.preset.name);
            studio.selectThemePreset(selection.preset.name);
          }}
        />
        <BaseColorPicker
          selectedThemeName={selection.preset.name}
          draftBase={selection.baseColor}
          onSelect={studio.setDraftBase}
        />
        <FontPairingPicker
          draftFont={selection.fontPreset}
          onSelect={studio.setDraftFont}
        />
        <GeometryPicker
          preset={selection.preset}
          draftRadius={selection.radius}
          draftSurface={selection.surface}
          onSelectRadius={studio.setDraftRadius}
          onSelectSurface={studio.setDraftSurface}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PresetSchematic selection={selection} mode="light" />
        <PresetSchematic selection={selection} mode="dark" />
      </div>

      <div className="flex flex-col gap-3">
        <CodeBlock
          code={buildCliCommand(selection)}
          language="bash"
          copyFormat="shell"
          showLineNumbers
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            className="min-h-11 md:min-h-8"
            variant={studio.isApplied ? "default" : "outline"}
            aria-pressed={studio.isApplied}
            onClick={studio.toggleApply}
          >
            {studio.isApplied && (
              <IconCheck aria-hidden="true" className="size-4" />
            )}
            {studio.isApplied
              ? "Applied to this site"
              : "Apply studio selection"}
          </Button>
          {ctx.presetName !== DEFAULT_PRESET && (
            <Button
              size="sm"
              variant="ghost"
              className="min-h-11 md:min-h-8"
              onClick={ctx.resetAll}
            >
              Reset to default
            </Button>
          )}
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
      description="Style by role. Switching base colors or accent presets updates every surface that uses the same role."
    >
      <DocTable
        columns={["Token", "Role", "Now"]}
        rows={tokenRoles.map((entry) => [
          <Code key={entry.token}>{entry.token}</Code>,
          entry.role,
          <span
            key="swatch"
            aria-hidden="true"
            className="block h-6 w-10 rounded-md border border-border"
            style={{ background: `var(${entry.token})` }}
          />,
        ])}
        caption="Semantic tokens"
      />
      <p className="text-sm leading-relaxed text-muted-foreground">
        Swatches show the tokens active on this site, so they follow the studio
        selection above and the light/dark toggle.
      </p>
    </DocSection>
  );
}

function CustomColorSection() {
  return (
    <DocSection
      id="custom-color"
      title="Custom color & base foundations"
      description="Generate light and dark OKLCH palettes from any primary color, or apply a standalone base color without touching your primary accent."
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
            title: "11 calibrated base foundations",
            description:
              "--base-color accepts neutral, paper, stone, taupe, zinc, gray, anthracite, slate, mist, olive, and mauve — each with a perceptual OKLCH chroma bell curve.",
          },
          {
            title: "Contrast verified",
            description:
              "Generated tokens target WCAG 2.2 AA — 4.5:1 for text (including info, success, warning, destructive) and 3:1 for focus rings — with APCA as a perceptual cross-check.",
          },
          {
            title: "Standalone or combined",
            description: (
              <>
                Run <Code>kira-kit theme --base-color paper --apply</Code> to
                change canvas warmth without overwriting your primary, or add{" "}
                <Code>--primary</Code> to generate a full palette.
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
      title="Fonts, surfaces, and icons"
      description="Apply a curated Display + Body + Mono pairing with --font-preset, or pick individual slots alongside radius, surface, and icon library."
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
            <Code key="fp">--font-preset</Code>,
            "precision, editorial, atelier, terminal, expressive, fintech",
          ],
          [
            <Code key="f">--font</Code>,
            "geist, instrument-sans, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans, bricolage-grotesque, sora, outfit",
          ],
          [
            <Code key="fd">--font-display</Code>,
            "Any --font choice plus newsreader, fraunces",
          ],
          [
            <Code key="fm">--font-mono</Code>,
            "geist-mono, jetbrains-mono, fira-code",
          ],
          [
            <Code key="r">--radius</Code>,
            "sharp (0rem), crisp (0.375rem), balanced (0.625rem), soft (0.875rem), pill (1.25rem), or CSS length",
          ],
          [<Code key="s">--surface</Code>, "hairline, tactile, elevated"],
          [<Code key="i">--icon</Code>, "tabler, lucide"],
        ]}
        caption="Typography, geometry, and icon options"
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
          <div key={step.label} className="flex w-20 flex-col gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "h-12 w-full border-2 border-primary bg-primary/10",
                step.className,
              )}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <CodeBlock
        code={`:root {\n  --radius: 0.625rem;\n  --background: oklch(0.975 0.015 84);\n  --foreground: oklch(0.18 0.022 62);\n}\n.dark {\n  --background: oklch(0.165 0.022 62);\n  --foreground: oklch(0.96 0.01 84);\n}`}
        language="css"
        showLineNumbers
      />

      <p className="text-sm leading-relaxed text-muted-foreground">
        Dark mode is a <Code>.dark</Code> class on <Code>&lt;html&gt;</Code>:{" "}
        <GuideLink to="/docs/cli">kira-kit theme</GuideLink> writes both blocks
        from one palette, and every preset ships paired light and dark tokens so
        component classes never change.
      </p>
    </DocSection>
  );
}

export default function ThemingPage() {
  return (
    <DocPage
      title="Theming"
      description="Compose calibrated OKLCH base colors, accents, variable font pairings, radius, and surface styles."
      previous={{ to: "/docs/installation", label: "Installation" }}
      next={{ to: "/docs/transitions", label: "Transitions" }}
    >
      <PresetStudioSection />
      <SemanticTokensSection />
      <CustomColorSection />
      <FontsAndIconsSection />
      <RadiusAndDarkModeSection />
    </DocPage>
  );
}
