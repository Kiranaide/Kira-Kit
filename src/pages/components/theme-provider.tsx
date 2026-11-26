import type { ComponentProps as ReactComponentProps } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle, useTheme } from "@/components/ui/theme-provider";
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
import { ThemeProviderInstallationCard } from "@/components/docs/segmented-installation-guide";

function BasicToggleDemo() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle variant="outline" />
        <ThemeToggle variant="outline" showLabel={false} />
        <ThemeToggle variant="secondary" size="sm" />
      </div>
      <output className="text-xs text-muted-foreground">
        Current theme:{" "}
        <span className="font-mono font-medium text-foreground">{theme}</span>
      </output>
    </div>
  );
}

const basicToggleCode = `import { ThemeToggle } from "@/components/ui/theme-provider";

export function ThemeActions() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle variant="outline" />
      <ThemeToggle variant="outline" showLabel={false} />
      <ThemeToggle variant="secondary" size="sm" />
    </div>
  );
}`;

function CustomHookDemo() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={theme === "light" ? "default" : "outline"}
          aria-pressed={theme === "light"}
          onClick={() => setTheme("light")}
        >
          <IconSun className="size-4" aria-hidden />
          Light
        </Button>
        <Button
          type="button"
          size="sm"
          variant={theme === "dark" ? "default" : "outline"}
          aria-pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          <IconMoon className="size-4" aria-hidden />
          Dark
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={toggleTheme}>
          Toggle
        </Button>
      </div>
      <output className="text-xs text-muted-foreground">
        Applied class on <code className="font-mono">&lt;html&gt;</code>:{" "}
        <span className="font-mono font-medium text-foreground">.{theme}</span>
      </output>
    </div>
  );
}

const customHookCode = `import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
        Light
      </Button>
      <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
        Dark
      </Button>
      <Button variant="ghost" onClick={toggleTheme}>Toggle</Button>
    </div>
  );
}`;

function StressDemo() {
  const { theme } = useTheme();

  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Narrow sidebar container with full-width toggle and long descriptive
          context copy
        </p>
        <ThemeToggle variant="outline" />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
        <span className="truncate text-xs text-muted-foreground">
          Disabled theme control (active: {theme || "none"})
        </span>
        <ThemeToggle variant="outline" showLabel={false} disabled />
      </div>
      <div className="space-y-2">
        <ThemeToggle variant="secondary" disabled />
      </div>
    </div>
  );
}

const stressCode = `import { ThemeToggle, useTheme } from "@/components/ui/theme-provider";

export function StressDemo() {
  const { theme } = useTheme();

  return (
    <div className="max-w-xs space-y-4">
      <ThemeToggle variant="outline" />
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
        <span className="truncate text-xs text-muted-foreground">
          Disabled theme control (active: {theme || "none"})
        </span>
        <ThemeToggle variant="outline" showLabel={false} disabled />
      </div>
      <ThemeToggle variant="secondary" disabled />
    </div>
  );
}`;

const usageCode = `import { ThemeProvider, ThemeToggle, useTheme } from "@/components/ui/theme-provider";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="kira-theme">
      <header className="flex justify-end p-4">
        <ThemeToggle showLabel={false} />
      </header>
      {children}
    </ThemeProvider>
  );
}`;

export default function ThemeProviderPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Theme Provider"
        version="v1.0.0"
        description="Standalone light and dark theme context with localStorage persistence, prefers-color-scheme fallback, and an accessible ThemeToggle button."
      />

      <FeatureGrid
        features={themeProviderFeatures}
        description="Capabilities built into Kira Kit."
      />

      <DemoTabs defaultValue="toggle" tabs={themeProviderDemoTabs} />

      <ThemeProviderInstallationCard />

      <KeyboardShortcuts
        shortcuts={themeProviderShortcuts}
        description="Keyboard navigation and activation bindings."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Wrap your root route once and read or toggle the theme anywhere below."
        notes={[
          {
            label: "ThemeToggle vs useTheme",
            body: "Use ThemeToggle for ready-made sidebar rows or icon-only header buttons; call useTheme() when building custom segmented controls or settings panels.",
          },
        ]}
      />

      <APIReference
        sections={themeProviderApi}
        description="Props, return values, and defaults for ThemeProvider, useTheme, and ThemeToggle."
      />

      <Changelog
        entries={themeProviderChangelog}
        title="Changelog"
        description="Version history for Theme Provider."
      />
    </ComponentPage>
  );
}

const themeProviderFeatures = [
  {
    title: "Standalone & decoupled",
    description:
      "Lives independently of Sidebar so auth, marketing, and error routes get full theming without sidebar chrome.",
  },
  {
    title: "OS preference & persistence",
    description:
      "Reads localStorage first, falls back to defaultTheme or prefers-color-scheme, and writes .light / .dark to <html>.",
  },
  {
    title: "Sandboxed-frame safe",
    description:
      "Guards all localStorage access in try/catch so embedded previews and restricted browsers never throw.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const themeProviderDemoTabs = [
  {
    value: "toggle",
    label: "ThemeToggle",
    demo: (
      <DemoWrapper
        title="Built-in ThemeToggle"
        description="Supports labeled sidebar rows and compact icon-only header buttons."
        code={basicToggleCode}
      >
        <BasicToggleDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "hook",
    label: "useTheme Hook",
    demo: (
      <DemoWrapper
        title="Programmatic control with useTheme"
        description="Read theme, call setTheme('light' | 'dark'), or call toggleTheme() from any component."
        code={customHookCode}
      >
        <CustomHookDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long context labels, disabled toggles, and narrow max-w-xs containers."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const themeProviderShortcuts = [
  {
    keys: "Tab",
    description: "Moves focus to ThemeToggle with the kit focus-visible ring.",
  },
  {
    keys: "Enter / Space",
    description:
      "Toggles between light and dark mode using native Button semantics.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const themeProviderApi = [
  {
    title: "ThemeProvider",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description: "Application tree that consumes theme state.",
      },
      {
        prop: "defaultTheme",
        type: '"light" | "dark"',
        default: "OS preference",
        description:
          "Fallback theme when no stored preference exists. Omit to follow prefers-color-scheme.",
      },
      {
        prop: "storageKey",
        type: "string",
        default: '"kira-theme"',
        description: "localStorage key used to persist the user's choice.",
      },
    ],
  },
  {
    title: "useTheme()",
    props: [
      {
        prop: "theme",
        type: '"light" | "dark"',
        default: "-",
        description:
          "Currently active theme applied to document.documentElement.",
      },
      {
        prop: "setTheme",
        type: '(theme: "light" | "dark") => void',
        default: "-",
        description: "Explicitly sets light or dark mode.",
      },
      {
        prop: "toggleTheme",
        type: "() => void",
        default: "-",
        description: "Switches between light and dark mode.",
      },
    ],
  },
  {
    title: "ThemeToggle",
    props: [
      {
        prop: "showLabel",
        type: "boolean",
        default: "true",
        description:
          'Displays "Dark mode" / "Light mode" beside the icon; set false for an icon-only button.',
      },
      {
        prop: "variant",
        type: 'ButtonProps["variant"]',
        default: '"ghost"',
        description: "Visual variant forwarded directly to kit Button.",
      },
      {
        prop: "size",
        type: 'ButtonProps["size"]',
        default: '"default" | "icon"',
        description:
          'Button size; defaults to "default" when showLabel is true and "icon" when false.',
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes merged with the toggle button.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const themeProviderChangelog = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Extracted standalone theme-provider module",
        description:
          "Moved ThemeProvider, useTheme, and ThemeToggle out of sidebar.tsx into a dedicated registry item with its own documentation page.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
