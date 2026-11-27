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
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup, KbdShortcut } from "@/components/ui/kbd";
import { usePlatform } from "@/hooks/use-platform";

const basicCode = `import { Kbd, KbdGroup } from "@/components/ui/kbd"

export function BasicKbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd>k</Kbd>
      <Kbd>esc</Kbd>
      <Kbd>⌘</Kbd>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
      <KbdGroup separator="+">
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
    </div>
  )
}`;

const grammarCode = `import { Kbd } from "@/components/ui/kbd"

export function GrammarKbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd keys="mod+k" />
      <Kbd keys="ctrl+shift+?" />
      <Kbd keys="ctrl++" />
      <Kbd keys="alt+F4" />
      <Kbd keys="cmd+enter" />
    </div>
  )
}`;

const variantsCode = `import { Kbd } from "@/components/ui/kbd"

export function VariantsKbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd variant="default">⌘K</Kbd>
      <Kbd variant="outline">⌘K</Kbd>
      <Kbd variant="ghost">⌘K</Kbd>
    </div>
  )
}`;

const sizesCode = `import { Kbd } from "@/components/ui/kbd"

export function SizesKbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd size="sm">⌘K</Kbd>
      <Kbd size="default">⌘K</Kbd>
      <Kbd size="lg">⌘K</Kbd>
    </div>
  )
}`;

const shortcutsCode = `import { KbdShortcut } from "@/components/ui/kbd"

export function ShortcutsKbdDemo() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Save</span>
        <KbdShortcut shortcut="mod+s" />
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Command palette</span>
        <KbdShortcut shortcut="mod+shift+p" />
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Delete word</span>
        <KbdShortcut shortcut="alt+backspace" />
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Force quit</span>
        <KbdShortcut shortcut="mod+alt+esc" separator="+" />
      </div>
    </div>
  )
}`;

const platformCode = `import { KbdShortcut } from "@/components/ui/kbd"
import { usePlatform } from "@/hooks/use-platform"

export function PlatformKbdDemo() {
  const platform = usePlatform() // "mac" | "windows" | "linux" | "unknown"

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Detected: <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{platform}</code>
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">win</span>
          <KbdShortcut shortcut="mod+k" platform="windows" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">mac</span>
          <KbdShortcut shortcut="mod+k" platform="mac" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">live</span>
          <KbdShortcut shortcut="mod+k" />
        </div>
      </div>
    </div>
  )
}`;

const stressCode = `import { Button } from "@/components/ui/button"
import { Kbd, KbdShortcut } from "@/components/ui/kbd"

export function StressKbdDemo() {
  return (
    <div className="max-w-xs space-y-3">
      <div className="rounded-lg border p-2">
        <KbdShortcut shortcut="ctrl+shift+alt+mod+delete" className="flex-wrap" />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
        <span className="min-w-0 truncate text-sm">
          Open enterprise workspace command switcher
        </span>
        <KbdShortcut shortcut="mod+k" size="lg" />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-2">
        <span className="text-sm text-muted-foreground">Unassigned</span>
        <Kbd aria-label="No shortcut assigned">—</Kbd>
      </div>
      <Button type="button" variant="outline" disabled className="w-full justify-between">
        <span>Locked action</span>
        <KbdShortcut shortcut="mod+s" />
      </Button>
    </div>
  )
}`;

const usageCode = `import { Kbd, KbdGroup, KbdShortcut } from "@/components/ui/kbd"

// 1. Single keycap — manual content
<Kbd>esc</Kbd>

// 2. Keycap group — manual children
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>Shift</Kbd>
  <Kbd>P</Kbd>
</KbdGroup>

// 3. Grammar string — parses, formats, and resolves platform symbols
<Kbd keys="mod+shift+p" />

// 4. Shortcut — grouped keycaps with an aria-label and aria-keyshortcuts
<KbdShortcut shortcut="mod+s" />

// 5. Forced platform (previews the other OS)
<KbdShortcut shortcut="mod+k" platform="mac" />`;

function BasicDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd>k</Kbd>
      <Kbd>esc</Kbd>
      <Kbd>⌘</Kbd>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
      <KbdGroup separator="+">
        <Kbd>Ctrl</Kbd>
        <Kbd>C</Kbd>
      </KbdGroup>
    </div>
  );
}

function GrammarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd keys="mod+k" />
      <Kbd keys="ctrl+shift+?" />
      <Kbd keys="ctrl++" />
      <Kbd keys="alt+F4" />
      <Kbd keys="cmd+enter" />
    </div>
  );
}

function PlatformDemo() {
  const platform = usePlatform();

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Detected:{" "}
        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {platform}
        </code>
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">win</span>
          <KbdShortcut shortcut="mod+k" platform="windows" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">mac</span>
          <KbdShortcut shortcut="mod+k" platform="mac" />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 text-xs text-muted-foreground">live</span>
          <KbdShortcut shortcut="mod+k" />
        </div>
      </div>
    </div>
  );
}

function VariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd variant="default">⌘K</Kbd>
      <Kbd variant="outline">⌘K</Kbd>
      <Kbd variant="ghost">⌘K</Kbd>
    </div>
  );
}

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Kbd size="sm">⌘K</Kbd>
      <Kbd size="default">⌘K</Kbd>
      <Kbd size="lg">⌘K</Kbd>
    </div>
  );
}

function ShortcutsDemo() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Save</span>
        <KbdShortcut shortcut="mod+s" />
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Command palette</span>
        <KbdShortcut shortcut="mod+shift+p" />
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Delete word</span>
        <KbdShortcut shortcut="alt+backspace" />
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
        <span className="text-sm">Force quit</span>
        <KbdShortcut shortcut="mod+alt+esc" separator="+" />
      </div>
    </div>
  );
}

function StressDemo() {
  return (
    <div className="max-w-xs space-y-3">
      <div className="rounded-lg border p-2">
        <KbdShortcut
          shortcut="ctrl+shift+alt+mod+delete"
          className="flex-wrap"
        />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border p-2">
        <span className="min-w-0 truncate text-sm">
          Open enterprise workspace command switcher
        </span>
        <KbdShortcut shortcut="mod+k" size="lg" />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 p-2">
        <span className="text-sm text-muted-foreground">Unassigned</span>
        <Kbd aria-label="No shortcut assigned">—</Kbd>
      </div>
      <Button
        type="button"
        variant="outline"
        disabled
        className="w-full justify-between"
      >
        <span>Locked action</span>
        <KbdShortcut shortcut="mod+s" />
      </Button>
    </div>
  );
}

export default function KbdPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Kbd"
        description="Keyboard keycaps and shortcut display. 2026 shortcut grammar with platform-aware symbols, physical keycap depth, and composed screen-reader labels."
        version="v2.0.0"
      />

      <FeatureGrid
        features={kbdPageFeatures}
        description="Platform-aware shortcut grammar, tactile keycap depth, and accessible screen-reader labels."
      />

      <DemoTabs defaultValue="basic" tabs={kbdPageDemoTabs} />

      <KeyboardShortcuts
        title="Keyboard shortcuts"
        description="Kbd is display-only — it renders shortcut hints, not interactive controls."
        shortcuts={kbdPageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Every export: Kbd (grammar or manual), KbdGroup, and KbdShortcut."
        notes={kbdPageUsageNotes}
      />

      <APIReference
        sections={kbdPageAPISections}
        description="Props, types, and defaults for Kbd, KbdGroup, and KbdShortcut."
      />

      <Changelog
        entries={kbdPageChangelogEntries}
        title="Changelog"
        description="Version history for Kbd."
      />
    </ComponentPage>
  );
}

const kbdPageFeatures = [
  {
    title: "Platform-aware",
    description:
      "One grammar string renders ⌘ on macOS and Ctrl on Windows/Linux. Force a platform for cross-OS docs, or read the live detection with usePlatform.",
  },
  {
    title: "Shortcut grammar",
    description:
      'keys="mod+shift+p" parses, formats, and resolves modifier symbols. A trailing + is a literal plus key, so ctrl++ works.',
  },
  {
    title: "Keycap craft",
    description:
      "Physical inset bottom edge (no drop shadow), tabular numerals, min-width per size — keycaps read as keys in light and dark.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const kbdPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Kbd"
        description="Single keycaps, keycap groups, and an optional separator between caps."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Kbd Variants"
        description="default (muted fill), outline (border only), ghost (translucent fill). All carry the keycap inset edge."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Kbd Sizes"
        description="sm / default / lg with proportional height, min-width, and padding."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "grammar",
    label: "Grammar",
    group: "Shortcuts",
    demo: (
      <DemoWrapper
        title="Shortcut Grammar"
        description="keys='mod+shift+k' style strings. If both keys and children are passed, keys wins."
        code={grammarCode}
      >
        <GrammarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shortcuts",
    label: "Shortcuts",
    group: "Shortcuts",
    demo: (
      <DemoWrapper
        title="KbdShortcut"
        description="Composed shortcut with a screen-reader label ('Mod plus S') and aria-keyshortcuts on the root span."
        code={shortcutsCode}
      >
        <ShortcutsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "platform",
    label: "Platform",
    group: "Shortcuts",
    demo: (
      <DemoWrapper
        title="Platform Resolution"
        description="Windows and macOS render side-by-side via platform, plus the live usePlatform() readout for this machine."
        code={platformCode}
      >
        <PlatformDemo />
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
        description="Long modifier chains, truncated labels, unassigned fallback, and disabled controls in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const kbdPageShortcuts = [
  {
    keys: "Tab",
    description:
      "kbd elements are not focusable; focus moves past them to the next real control",
  },
  {
    keys: "Screen reader",
    description:
      'KbdShortcut exposes one composed label ("Ctrl plus K") via aria-label; the keycaps themselves are aria-hidden',
  },
  {
    keys: "aria-keyshortcuts",
    description:
      'the root span carries the normalized accelerator ("Meta+K" on macOS, "Control+K" elsewhere) for assistive tech',
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const kbdPageUsageNotes = [
  {
    label: "Kbd vs. KbdShortcut",
    body: 'Use Kbd for standalone keycaps or quick grammar strings (keys="mod+k"). Use KbdShortcut when you want composed screen-reader labels (aria-label) and aria-keyshortcuts.',
  },
  {
    label: "Platform resolution",
    body: 'The "mod" token resolves to ⌘ on macOS and Ctrl on Windows/Linux via usePlatform(). Pass platform to KbdShortcut to force a specific OS.',
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const kbdPageAPISections = [
  {
    title: "Kbd",
    props: [
      {
        prop: "keys",
        type: "string",
        default: "-",
        description:
          'Shortcut grammar string ("+"-separated; trailing "+" is a literal plus). Multi-token strings render as a keycap group. Wins over children when both are given.',
      },
      {
        prop: "variant",
        type: '"default" | "outline" | "ghost"',
        default: '"default"',
        description: "Visual style of the keycap.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description:
          "Keycap height, min-width, and font size (tabular numerals).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional classes on the kbd element.",
      },
    ],
  },
  {
    title: "KbdGroup",
    props: [
      {
        prop: "separator",
        type: "React.ReactNode",
        default: "-",
        description:
          "Separator rendered between keycaps. Default: none — adjacent keycaps (2026 style).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          "Additional classes on the group span (inline-flex, gap-1).",
      },
    ],
  },
  {
    title: "KbdShortcut",
    props: [
      {
        prop: "shortcut",
        type: "string",
        default: "-",
        description:
          'Required shortcut grammar string, e.g. "mod+s". Parsed, platform-formatted, and exposed as aria-label + aria-keyshortcuts.',
      },
      {
        prop: "platform",
        type: '"mac" | "windows" | "linux" | "unknown"',
        default: "auto",
        description: "Force a platform instead of the usePlatform() detection.",
      },
      {
        prop: "separator",
        type: "React.ReactNode",
        default: "-",
        description:
          'Separator rendered between keycaps (e.g. "+"). Default: none.',
      },
      {
        prop: "variant / size",
        type: "Kbd variants",
        default: '"default" / "default"',
        description: "Passed through to every rendered keycap.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const kbdPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "4 November 2026",
    changes: [
      {
        type: "added",
        title: "Shortcut grammar + platform detection",
        description:
          'Kbd accepts keys="mod+shift+k"; new usePlatform hook resolves ⌘/Ctrl/⌥/⇧ per OS. KbdShortcut renders grammar via the shortcut prop.',
      },
      {
        type: "added",
        title: "KbdGroup",
        description:
          "Keycap group wrapper (adjacent caps by default, optional separator).",
      },
      {
        type: "added",
        title: "aria-keyshortcuts",
        description:
          'KbdShortcut root carries the normalized accelerator ("Meta+K" on macOS, "Control+K" elsewhere); composed aria-label with aria-hidden keycaps.',
      },
      {
        type: "changed",
        title: "Keycap visuals",
        description:
          "shadow-sm replaced with a physical inset bottom edge; tabular-nums for stable glyph widths.",
      },
      {
        type: "breaking",
        title: "KbdShortcut API rewrite",
        description:
          'keys: string[] + separator: string props removed — use shortcut="mod+s" (grammar). Manual keycap sequences move to KbdGroup or Kbd keys="...".',
      },
      {
        type: "fixed",
        title: "Duplicate React keys",
        description:
          "Repeated keycap labels (ctrl++) no longer collide in the fragment key.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
