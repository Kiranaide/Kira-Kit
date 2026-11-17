import * as React from "react";
import {
  IconPalette,
  IconAccessible,
  IconClipboard,
  IconAdjustments,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  ColorPicker,
  KiraColorPicker,
  type ColorFormat,
  type ColorInput,
} from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { KiraSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  const [color, setColor] = React.useState<ColorInput>("#6366f1");

  return (
    <div className="w-full max-w-sm space-y-3">
      <p className="text-sm font-medium">Calendar accent</p>
      <ColorPicker
        value={color}
        onValueChange={(next) => setColor(next.hsv)}
        label="Calendar accent"
        hideContrastRatio
      />
      <p className="text-xs text-muted-foreground">
        The original compact picker: swatch, saturation, hue and color value.
        Open the swatch or the value field.
      </p>
    </div>
  );
}

const basicCode = `import { useState } from "react";
import { ColorPicker, type ColorInput } from "@/components/ui/color-picker";

export function BasicDemo() {
  const [color, setColor] = useState<ColorInput>("#6366f1");
  return (
    <ColorPicker
      value={color}
      onValueChange={next => setColor(next.hsv)}
      label="Calendar accent"
      hideContrastRatio
    />
  );
}`;

const COLOR_FORMATS: ColorFormat[] = ["hex", "hexa", "rgb", "hsl", "oklch"];

function FormatsDemo() {
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2">
      {COLOR_FORMATS.map((format) => (
        <div key={format} className="space-y-2">
          <p className="text-sm font-medium">{format.toUpperCase()}</p>
          <ColorPicker
            defaultValue="#8b5cf6"
            defaultFormat={format}
            label={format.toUpperCase() + " accent"}
            hideContrastRatio
          />
        </div>
      ))}
      <p className="text-xs text-muted-foreground sm:col-span-2">
        Enter drafts freely. Apply with Enter or blur; Escape restores the
        accepted value. Out-of-gamut OKLCH is mapped to sRGB with a notice.
      </p>
    </div>
  );
}

const formatsCode = `import { ColorPicker, type ColorFormat } from "@/components/ui/color-picker";

const formats: ColorFormat[] = ["hex", "hexa", "rgb", "hsl", "oklch"];

export function FormatsDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {formats.map(format => (
        <ColorPicker key={format} defaultValue="#8b5cf6" defaultFormat={format} hideContrastRatio />
      ))}
    </div>
  );
}`;

function AlphaDemo() {
  const [color, setColor] = React.useState<ColorInput>("#2563eb80");
  const [preview, setPreview] = React.useState("#2563eb80");

  return (
    <div className="w-full max-w-sm space-y-4">
      <ColorPicker
        value={color}
        showAlpha
        defaultFormat="hexa"
        showBackgroundPreview
        label="Overlay color"
        onValueChange={(next) => {
          setColor(next.hsv);
          setPreview(next.hexa);
        }}
      />
      <div
        className="rounded-md border p-5"
        style={{
          background:
            "repeating-conic-gradient(var(--muted) 0% 25%, var(--background) 0% 50%) 50% / 16px 16px",
        }}
      >
        <div
          className="h-16 rounded-md"
          style={{ backgroundColor: preview }}
          aria-label="Selected translucent color over a checkerboard"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Opacity travels with the color through editing, history, previews and
        copying.
      </p>
    </div>
  );
}

const alphaCode = `import { useState } from "react";
import { ColorPicker, type ColorInput } from "@/components/ui/color-picker";

export function AlphaDemo() {
  const [color, setColor] = useState<ColorInput>("#2563eb80");
  return (
    <ColorPicker
      value={color}
      onValueChange={next => setColor(next.hsv)}
      showAlpha
      defaultFormat="hexa"
      showBackgroundPreview
      label="Overlay color"
    />
  );
}`;

function PaletteDemo() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <ColorPicker
        defaultValue="#0f766e"
        hideDefaultSwatches
        showHarmonies
        label="Campaign palette"
        swatches={[
          "#0f766e",
          "#115e59",
          "#f59e0b",
          "#fff7ed",
          "#0f766e",
          "invalid-swatch",
        ]}
      />
      <p className="text-xs text-muted-foreground">
        Choose a campaign swatch or a related harmony. Duplicate and invalid
        swatches are ignored; recent colors stay in this session.
      </p>
    </div>
  );
}

const paletteCode = `import { ColorPicker } from "@/components/ui/color-picker";

export function PaletteDemo() {
  return (
    <ColorPicker
      defaultValue="#0f766e"
      label="Campaign palette"
      hideDefaultSwatches
      showHarmonies
      swatches={["#0f766e", "#115e59", "#f59e0b", "#fff7ed"]}
    />
  );
}`;

function ContrastDemo() {
  const [background, setBackground] = React.useState("#ffffff");
  const [textSize, setTextSize] = React.useState<"normal" | "large">("normal");
  const [level, setLevel] = React.useState<"AA" | "AAA">("AA");
  const id = React.useId();

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor={id + "-surface"}
            className="block text-xs font-medium"
          >
            Background
          </label>
          <KiraSelect
            id={id + "-surface"}
            value={background}
            options={[
              { value: "#ffffff", label: "White" },
              { value: "#0f172a", label: "Ink" },
              { value: "#fff7ed", label: "Warm paper" },
            ]}
            onChange={(next) => {
              if (next !== null && !Array.isArray(next)) setBackground(next);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={id + "-size"} className="block text-xs font-medium">
            Text category
          </label>
          <KiraSelect
            id={id + "-size"}
            value={textSize}
            options={[
              { value: "normal", label: "Normal" },
              { value: "large", label: "Large" },
            ]}
            onChange={(next) => {
              if (next === "normal" || next === "large") setTextSize(next);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor={id + "-level"} className="block text-xs font-medium">
            Contrast target
          </label>
          <KiraSelect
            id={id + "-level"}
            value={level}
            options={["AA", "AAA"]}
            onChange={(next) => {
              if (next === "AA" || next === "AAA") setLevel(next);
            }}
          />
        </div>
      </div>
      <KiraColorPicker
        background={background}
        defaultValue="#3b82f6"
        textSize={textSize}
        contrastLevel={level}
        showAccessibleSuggestion
        showTokenPreview={false}
        tokenName="action.foreground"
        label="Action text"
      />
      <p className="text-xs text-muted-foreground">
        Large text means at least 18pt, or 14pt bold. The suggestion changes
        color only when you apply it and preserves opacity.
      </p>
    </div>
  );
}

const contrastCode = `import { KiraColorPicker } from "@/components/ui/color-picker";

export function ContrastDemo() {
  return (
    <KiraColorPicker
      background="#ffffff"
      defaultValue="#3b82f6"
      textSize="normal"
      contrastLevel="AA"
      showAccessibleSuggestion
      showTokenPreview={false}
      tokenName="action.foreground"
      label="Action text"
    />
  );
}`;

function TokensDemo() {
  const [tokenName, setTokenName] = React.useState("brand.primary");
  const id = React.useId();

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-medium">
          Token name
        </label>
        <Input
          id={id}
          value={tokenName}
          spellCheck={false}
          onChange={(event) => setTokenName(event.target.value)}
          aria-describedby={id + "-hint"}
          placeholder="brand.primary"
        />
        <p id={id + "-hint"} className="text-xs text-muted-foreground">
          Use dot-separated names, such as brand.primary or chart.series-one.
        </p>
      </div>
      <KiraColorPicker
        background="#f8fafc"
        defaultValue="#0f766ecc"
        defaultFormat="oklch"
        showAlpha
        tokenName={tokenName}
        label="Brand token"
      />
    </div>
  );
}

const tokensCode = `import { useId, useState } from "react";
import { KiraColorPicker } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";

export function TokensDemo() {
  const [tokenName, setTokenName] = useState("brand.primary");
  const id = useId();
  return (
    <div className="space-y-4">
      <label htmlFor={id}>Token name</label>
      <Input id={id} value={tokenName} onChange={event => setTokenName(event.target.value)} />
      <KiraColorPicker
        background="#f8fafc"
        defaultValue="#0f766ecc"
        defaultFormat="oklch"
        showAlpha
        tokenName={tokenName}
        label="Brand token"
      />
    </div>
  );
}`;

function waitForCopyFixture(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException("Copy cancelled", "AbortError"));
    };

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, 1200);

    if (signal.aborted) {
      cancel();

      return;
    }

    signal.addEventListener("abort", cancel, { once: true });
  });
}

function AsyncCopyDemo() {
  const [failNext, setFailNext] = React.useState(true);

  const copyText = async (text: string, signal: AbortSignal) => {
    await waitForCopyFixture(signal);

    if (failNext) {
      setFailNext(false);
      throw new Error(
        "Fixture: the clipboard attempt failed. Retry or copy the token text manually.",
      );
    }

    if (!navigator.clipboard)
      throw new Error(
        "Clipboard access is unavailable. Copy the token text manually.",
      );
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <Switch
        label="Fixture: fail the next copy"
        checked={failNext}
        onCheckedChange={setFailNext}
      />
      <p className="text-xs text-muted-foreground">
        A 1.2-second delay and optional failure illustrate pending, cancel and
        retry. Successful attempts write to the real clipboard.
      </p>
      <KiraColorPicker
        background="#ffffff"
        defaultValue="#4338ca"
        tokenName="brand.primary"
        copyText={copyText}
        label="Copy workflow"
      />
    </div>
  );
}

const asyncCopyCode = `import { useState } from "react";
import { KiraColorPicker } from "@/components/ui/color-picker";

function wait(signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cancel = () => { clearTimeout(timer); reject(new DOMException("Copy cancelled", "AbortError")); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", cancel); resolve(); }, 1200);
    if (signal.aborted) { cancel(); return; }
    signal.addEventListener("abort", cancel, { once: true });
  });
}

export function AsyncCopyDemo() {
  const [failNext, setFailNext] = useState(true);
  return (
    <KiraColorPicker background="#ffffff" defaultValue="#4338ca" tokenName="brand.primary"
      copyText={async (text, signal) => {
        await wait(signal); // Demo delay fixture.
        if (failNext) {
          setFailNext(false);
          throw new Error("Fixture: copy failed. Retry.");
        }
        if (!navigator.clipboard) throw new Error("Copy the token text manually.");
        await navigator.clipboard.writeText(text);
      }}
    />
  );
}`;

function FormDemo() {
  const [saved, setSaved] = React.useState("");

  return (
    <form
      className="w-full max-w-sm space-y-4"
      onReset={() => setSaved("")}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(String(new FormData(event.currentTarget).get("accent") ?? ""));
      }}
    >
      <p className="text-sm font-medium">Invoice accent (required)</p>
      <ColorPicker
        name="accent"
        defaultValue=""
        required
        label="Invoice accent"
        showAlpha
        hideContrastRatio
      />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm">
          Save color
        </Button>
        <Button type="reset" variant="outline" size="sm">
          Reset
        </Button>
      </div>
      <output className="min-h-5 wrap-anywhere text-xs text-muted-foreground">
        {saved
          ? "Saved in this form: " + saved
          : "Choose a color, then save. Reset returns to the empty default."}
      </output>
    </form>
  );
}

const formCode = `import { useState } from "react";
import { ColorPicker } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";

export function FormDemo() {
  const [saved, setSaved] = useState("");
  return (
    <form onReset={() => setSaved("")} onSubmit={event => {
      event.preventDefault();
      setSaved(String(new FormData(event.currentTarget).get("accent") ?? ""));
    }}>
      <p>Invoice accent (required)</p>
      <ColorPicker name="accent" defaultValue="" required label="Invoice accent" showAlpha hideContrastRatio />
      <Button type="submit">Save color</Button>
      <Button type="reset" variant="outline">Reset</Button>
      <p role="status">{saved}</p>
    </form>
  );
}`;

function KiraDemo() {
  return (
    <KiraColorPicker
      background="#fff7ed"
      defaultValue="#115e59"
      defaultFormat="oklch"
      tokenName="brand.foreground"
      showAlpha
      showHarmonies
      showAccessibleSuggestion
      label="Brand foreground"
    />
  );
}

const kiraCode = `import { KiraColorPicker } from "@/components/ui/color-picker";

export function KiraDemo() {
  return (
    <KiraColorPicker
      background="#fff7ed"
      defaultValue="#115e59"
      defaultFormat="oklch"
      tokenName="brand.foreground"
      showAlpha
      showHarmonies
      showAccessibleSuggestion
      label="Brand foreground"
    />
  );
}`;

function StatesDemo() {
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2">
      <div className="space-y-3">
        <p className="text-sm font-medium">Sizes</p>
        <div className="flex flex-col items-start gap-3">
          <ColorPicker size="sm" defaultValue="#0f766e" label="Small accent" />
          <ColorPicker defaultValue="#0f766e" label="Default accent" />
          <ColorPicker size="lg" defaultValue="#0f766e" label="Large accent" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Disabled</p>
        <ColorPicker
          defaultValue="#64748b"
          disabled
          disabledReason="Only workspace owners can change this brand color."
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Read only</p>
        <ColorPicker
          defaultValue="#0f766ecc"
          readOnly
          showAlpha
          label="Published accent"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Invalid supplied value fixture</p>
        <ColorPicker
          value="invalid-color"
          invalid
          error="This imported color is invalid. Choose a replacement."
          label="Imported accent"
        />
      </div>
      <div className="w-full max-w-80 space-y-2">
        <p className="wrap-anywhere text-sm font-medium">
          Empty color for the international customer-support calendar
        </p>
        <ColorPicker
          defaultValue=""
          label="International customer-support calendar accent"
          hideDefaultSwatches
        />
      </div>
      <p className="text-xs text-muted-foreground sm:col-span-2">
        Focus and press the swatches, Select, Input and sliders. The Copy
        workflow tab supplies pending, failure, cancellation and success states.
      </p>
    </div>
  );
}

const statesCode = `import { ColorPicker } from "@/components/ui/color-picker";

export function StatesDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker size="sm" defaultValue="#0f766e" />
      <ColorPicker size="lg" defaultValue="#0f766e" />
      <ColorPicker defaultValue="#64748b" disabled disabledReason="Only workspace owners can edit." />
      <ColorPicker defaultValue="#0f766ecc" readOnly showAlpha />
      <ColorPicker value="invalid-color" invalid error="Choose a valid replacement." />
      <ColorPicker defaultValue="" hideDefaultSwatches />
    </div>
  );
}`;

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    title: "Simple color picker",
    description: "The compact original design with shared kit controls.",
    code: basicCode,
    content: <BasicDemo />,
  },
  {
    value: "formats",
    label: "Formats",
    title: "Validated color formats",
    description:
      "HEX, HEXA, RGB, HSL and OKLCH drafts with commit and recovery.",
    code: formatsCode,
    content: <FormatsDemo />,
  },
  {
    value: "alpha",
    label: "Opacity",
    title: "One color, one opacity",
    description: "Translucent previews and consistent alpha in every output.",
    code: alphaCode,
    content: <AlphaDemo />,
  },
  {
    value: "palette",
    label: "Palette",
    title: "Campaign colors and harmonies",
    description: "Immutable swatches, harmonies and session-only history.",
    code: paletteCode,
    content: <PaletteDemo />,
  },
  {
    value: "contrast",
    label: "Contrast",
    title: "Contrast on the real surface",
    description:
      "Explicit backgrounds and text categories with opt-in suggestions.",
    code: contrastCode,
    content: <ContrastDemo />,
  },
  {
    value: "tokens",
    label: "Tokens",
    title: "Portable color tokens",
    description: "Named CSS variables and DTCG 2025.10 color-token JSON.",
    code: tokensCode,
    content: <TokensDemo />,
  },
  {
    value: "copy",
    label: "Copy workflow",
    title: "Pending, cancel and retry",
    description:
      "A labelled delay/failure fixture followed by real clipboard writes.",
    code: asyncCopyCode,
    content: <AsyncCopyDemo />,
  },
  {
    value: "form",
    label: "Form",
    title: "Required form color",
    description: "Native validation, canonical form data and reset.",
    code: formCode,
    content: <FormDemo />,
  },
  {
    value: "kira",
    label: "Kira",
    title: "Brand color handoff",
    description:
      "The simple picker, actual-background contrast and token exports together.",
    code: kiraCode,
    content: <KiraDemo />,
  },
  {
    value: "states",
    label: "States",
    title: "States and narrow layouts",
    description:
      "Sizes, read-only, disabled reasons, invalid input and empty values.",
    code: statesCode,
    content: <StatesDemo />,
  },
].map(({ content, title, description, code, ...tab }) => ({
  ...tab,
  demo: (
    <DemoWrapper title={title} description={description} code={code}>
      {content}
    </DemoWrapper>
  ),
}));

const features = [
  {
    title: "Compact controls",
    description:
      "The original simple design with the kit’s Input, Select, Button and keyboard sliders.",
    icon: <IconAdjustments aria-hidden="true" className="size-4" />,
  },
  {
    title: "Color formats",
    description:
      "Validated HEX, HEXA, RGB, HSL and sRGB-mapped OKLCH with consistent opacity.",
    icon: <IconPalette aria-hidden="true" className="size-4" />,
  },
  {
    title: "Contextual contrast",
    description:
      "Evaluate normal or large text on an explicit background and apply a suggestion.",
    icon: <IconAccessible aria-hidden="true" className="size-4" />,
  },
  {
    title: "Token handoff",
    description:
      "Copy CSS variables or DTCG tokens with pending, cancellation and recovery.",
    icon: <IconClipboard aria-hidden="true" className="size-4" />,
  },
];

const shortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move through the trigger, Input, Select, sliders and swatches. Saturation and brightness alternatives become visible on focus.",
  },
  {
    keys: "Enter / Space",
    description:
      "Open the swatch or select a palette button; inherited from the Base UI Button/Popover.",
  },
  {
    keys: "Enter / ArrowDown",
    description:
      "Open the picker from its read-only value field; Kira addition.",
  },
  {
    keys: "Arrow keys / Home / End",
    description:
      "Adjust hue, saturation, brightness or opacity; inherited from Base UI Slider.",
  },
  {
    keys: "Arrow keys / Enter / typeahead",
    description:
      "Choose a display format; inherited from the kit’s Base UI Select.",
  },
  {
    keys: "Enter / blur",
    description: "Validate and apply a color-value draft; Kira addition.",
  },
  {
    keys: "Escape",
    description:
      "Restore an edited draft first; otherwise close the popup and return focus through Base UI. Also cancels a native EyeDropper selection.",
  },
];

const usageCode =
  `import { useState } from "react";
import { ColorPicker, KiraColorPicker, type ColorInput } from "@/components/ui/color-picker";
import { Button } from "@/components/ui/button";` +
  "\n\n" +
  [basicCode, kiraCode, formCode]
    .map((code) => code.replace(/^import[\s\S]*?;\s*\n/gm, ""))
    .join("\n\n");

const apiSections = [
  {
    title: "ColorPicker",
    props: [
      {
        prop: "value / defaultValue",
        type: "ColorInput (CSS string, HSVA, HSLA, RGBA or OKLCH)",
        default: '"#3b82f6"',
        description:
          "Controlled or initial color. An empty string represents no selection.",
      },
      {
        prop: "onValueChange",
        type: "(value: ColorPickerValue) => void",
        default: "-",
        description:
          "Proposes hex, hexa, rgb, hsl, hsv and oklch from one HSVA value. Keep hsv or hexa to preserve opacity.",
      },
      {
        prop: "format / defaultFormat",
        type: '"hex" | "hexa" | "rgb" | "hsl" | "oklch"',
        default: '"hex"',
        description: "Controlled or initial display/copy format.",
      },
      {
        prop: "onFormatChange",
        type: "(format: ColorFormat) => void",
        default: "-",
        description: "Requests a new display format.",
      },
      {
        prop: "type",
        type: "ColorFormat",
        default: "-",
        description: "Deprecated initial-format alias. Use defaultFormat.",
      },
      {
        prop: "showAlpha / defaultAlpha",
        type: "boolean / number (0–1)",
        default: "false / 1",
        description:
          "Show the opacity slider. defaultAlpha applies only when the initial color has no explicit alpha.",
      },
      {
        prop: "swatches",
        type: "readonly string[]",
        default: "[]",
        description:
          "Custom colors; valid values are copied, normalized and deduplicated.",
      },
      {
        prop: "hideDefaultSwatches",
        type: "boolean",
        default: "false",
        description:
          "Use only custom swatches. Recent colors remain available.",
      },
      {
        prop: "showHarmonies / showBackgroundPreview",
        type: "boolean",
        default: "false",
        description:
          "Show generated related colors or white/black text previews.",
      },
      {
        prop: "hideContrastRatio",
        type: "boolean",
        default: "false",
        description:
          "Hide normal-text AA contrast on white and black. Use KiraColorPicker for another background.",
      },
      {
        prop: "showCopyButton",
        type: "boolean",
        default: "true",
        description:
          "Copy the formatted value with honest pending/success/error feedback.",
      },
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        default: "uncontrolled / false / -",
        description: "Base UI popup state.",
      },
      {
        prop: "children",
        type: "React.ReactElement",
        default: "swatch + Input",
        description: "One custom trigger element composed with Base UI render.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Matched swatch and value-field heights.",
      },
      {
        prop: "disabled / disabledReason / readOnly",
        type: "boolean / string / boolean",
        default: "false / - / false",
        description:
          "Disabled prevents opening; read-only allows inspection and copying.",
      },
      {
        prop: "name / required",
        type: "string / boolean",
        default: "- / false",
        description:
          "Canonical HEX/HEXA native form value, required validation and reset.",
      },
      {
        prop: "invalid / error / label",
        type: "boolean / string / string",
        default: 'false / - / "Color"',
        description:
          "Invalid styling, a visible error and the accessible picker name.",
      },
      {
        prop: "className / contentClassName",
        type: "string",
        default: "-",
        description: "Root and popup styling, respectively.",
      },
      {
        prop: "onError",
        type: "(error: ColorPickerError) => void",
        default: "-",
        description:
          "Receives format, clipboard and screen-selection failures.",
      },
      {
        prop: "onFeedback / announceFeedback",
        type: "(message: string) => void / boolean",
        default: "- / true",
        description:
          "Compose feedback into one live region when nesting workflows.",
      },
    ],
  },
  {
    title: "KiraColorPicker",
    props: [
      {
        prop: "ColorPicker props",
        type: "KiraColorPickerProps",
        default: "-",
        description:
          "Inherits the simple picker except its contrast/copy/live-region toggles, which this workflow composes.",
      },
      {
        prop: "background",
        type: "ColorInput",
        default: "required",
        description:
          "The actual opaque surface behind the text. Translucent or invalid backgrounds cannot produce a contrast verdict.",
      },
      {
        prop: "textSize / contrastLevel",
        type: '"normal" | "large" / "AA" | "AAA"',
        default: '"normal" / "AA"',
        description:
          "Normal AA 4.5:1, large AA 3:1, normal AAA 7:1 and large AAA 4.5:1.",
      },
      {
        prop: "showAccessibleSuggestion",
        type: "boolean",
        default: "false",
        description:
          "Offer a lightness adjustment only when needed and achievable at the current opacity.",
      },
      {
        prop: "tokenName",
        type: "string",
        default: '"brand.primary"',
        description:
          "Dot-separated identifier used for nested DTCG JSON and a CSS custom property.",
      },
      {
        prop: "showTokenPreview",
        type: "boolean",
        default: "true",
        description: "Show selectable DTCG color-token JSON.",
      },
      {
        prop: "copyText",
        type: "(text: string, signal: AbortSignal) => Promise<void>",
        default: "navigator.clipboard.writeText",
        description:
          "Caller-owned copy adapter with cancellation, retry and confirmed completion.",
      },
    ],
  },
  {
    title: "Color utilities and variants",
    props: [
      {
        prop: "colorPickerVariants",
        type: "CVA variant function",
        default: "-",
        description: "Shared size variants for the simple and Kira roots.",
      },
      {
        prop: "getColorAsHsva / hslaToHsva",
        type: "(color: ColorInput) => HsvaColor / (color: HslaColor) => HsvaColor",
        default: "-",
        description:
          "Strict parsing and correct HSL conversion; invalid colors throw.",
      },
      {
        prop: "rgbaToOklch / oklchToRgba",
        type: "(color: RgbaColor) => OklchColor / (color: OklchColor) => RgbaColor",
        default: "-",
        description:
          "Accurate sRGB/OKLCH conversion. Out-of-gamut OKLCH maps by reducing chroma.",
      },
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];

const changelog = [
  {
    version: "v2.0.0",
    date: "November 14, 2026",
    changes: [
      {
        type: "added",
        title: "KiraColorPicker",
        description:
          "Actual-background contrast, optional accessible suggestions and named CSS/DTCG exports. Research cutoff October 31, 2026; Base UI 1.9.0 audited.",
      },
      {
        type: "changed",
        title: "Original compact simple design retained",
        description:
          "Saturation plane and slim hue controls, matched trigger heights and aligned shared Input/Select fields. Advanced workflows live in KiraColorPicker.",
      },
      {
        type: "fixed",
        title: "One color state and accurate conversion",
        description:
          "Correct HSL and OKLCH conversion, consistent alpha, immutable history, sRGB gamut notices and raw contrast thresholds.",
      },
      {
        type: "added",
        title: "Drafts, form values and copy recovery",
        description:
          "Enter/blur commits, Escape restores, native required/reset behavior, clipboard failure feedback and cancellable Kira exports.",
      },
      {
        type: "breaking",
        title: "Controlled values and DOM ownership",
        description:
          "Controlled colors remain caller-owned. The trigger is one native button beside an Input; className now targets the root, and contentClassName targets the popup. Keep hsv or hexa to retain opacity.",
      },
      {
        type: "deprecated",
        title: "type is an initial-format alias",
        description:
          "Use defaultFormat for initial display, or format with onFormatChange for controlled display. Invalid CSS values are rejected rather than silently normalized.",
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "Previous release",
    changes: [
      {
        type: "added",
        title: "Color picker, palettes and clipboard",
        description: "Initial simple color picker.",
      },
    ],
  },
] satisfies React.ComponentProps<typeof Changelog>["entries"];

export default function ColorPickerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Color Picker"
        version="v2.0.0"
        description="A compact color picker with shared controls, accurate color formats and optional contrast and token workflows."
      />
      <FeatureGrid features={features} />
      <DemoTabs tabs={demoTabs} defaultValue="basic" />
      <KeyboardShortcuts shortcuts={shortcuts} />
      <UsageBlock code={usageCode} />
      <APIReference sections={apiSections} />
      <Changelog entries={changelog} />
    </ComponentPage>
  );
}
