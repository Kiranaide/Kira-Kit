import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  ThemeToggle,
  getThemeBootstrapScript,
  useTheme,
  type ThemePreference,
} from "@/components/ui/theme-provider";
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
  const { theme, preference } = useTheme();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle variant="outline" />
        <ThemeToggle variant="outline" showLabel={false} />
        <ThemeToggle variant="secondary" size="sm" />
      </div>
      <output className="text-xs text-muted-foreground">
        Resolved:{" "}
        <span className="font-mono font-medium text-foreground">{theme}</span> ·
        Preference:{" "}
        <span className="font-mono font-medium text-foreground">
          {preference}
        </span>
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
  const { theme, preference, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={preference === "light" ? "default" : "outline"}
          aria-pressed={preference === "light"}
          onClick={() => setTheme("light")}
        >
          <IconSun className="size-4" aria-hidden />
          Light
        </Button>
        <Button
          type="button"
          size="sm"
          variant={preference === "dark" ? "default" : "outline"}
          aria-pressed={preference === "dark"}
          onClick={() => setTheme("dark")}
        >
          <IconMoon className="size-4" aria-hidden />
          Dark
        </Button>
        <Button
          type="button"
          size="sm"
          variant={preference === "system" ? "default" : "outline"}
          aria-pressed={preference === "system"}
          onClick={() => setTheme("system")}
        >
          <IconDeviceDesktop className="size-4" aria-hidden />
          System
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={toggleTheme}>
          Toggle
        </Button>
      </div>
      <output className="text-xs text-muted-foreground">
        Preference:{" "}
        <span className="font-mono font-medium text-foreground">
          {preference}
        </span>{" "}
        → Applied class on <code className="font-mono">&lt;html&gt;</code>:{" "}
        <span className="font-mono font-medium text-foreground">.{theme}</span>
      </output>
    </div>
  );
}

const customHookCode = `import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeSwitcher() {
  const { theme, preference, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Button variant={preference === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
        Light
      </Button>
      <Button variant={preference === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
        Dark
      </Button>
      <Button variant={preference === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>
        System
      </Button>
      <Button variant="ghost" onClick={toggleTheme}>
        Toggle ({theme})
      </Button>
    </div>
  );
}`;

function SsrBootstrapDemo() {
  const [cookieMode, setCookieMode] = React.useState(true);

  const [initialTheme, setInitialTheme] =
    React.useState<ThemePreference>("system");

  const script = React.useMemo(
    () =>
      cookieMode
        ? getThemeBootstrapScript({ initialTheme, storageKey: null })
        : getThemeBootstrapScript({
            defaultTheme: initialTheme,
            storageKey: "kira-theme",
          }),
    [cookieMode, initialTheme],
  );

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={cookieMode ? "default" : "outline"}
            aria-pressed={cookieMode}
            onClick={() => setCookieMode(true)}
          >
            SSR Cookie (storageKey=null)
          </Button>
          <Button
            type="button"
            size="sm"
            variant={cookieMode ? "outline" : "default"}
            aria-pressed={!cookieMode}
            onClick={() => setCookieMode(false)}
          >
            localStorage Fallback
          </Button>
        </div>
        <div className="flex items-center gap-1">
          {preferenceChoices.map((choice) => (
            <Button
              key={choice}
              type="button"
              size="sm"
              variant={initialTheme === choice ? "secondary" : "ghost"}
              aria-pressed={initialTheme === choice}
              onClick={() => setInitialTheme(choice)}
            >
              {choice}
            </Button>
          ))}
        </div>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
        <code>{script}</code>
      </pre>
      <output className="text-xs text-muted-foreground">
        {cookieMode
          ? "Cookie mode skips localStorage reads/writes so stale storage can never flash over server-rendered HTML."
          : "Storage mode reads localStorage first, preserves 'system' preferences, and falls back to defaultTheme."}
      </output>
    </div>
  );
}

const ssrBootstrapCode = `import {
  ThemeProvider,
  getThemeBootstrapScript,
  type ThemePreference,
} from "@/components/ui/theme-provider";

// 1. Place in <head> before paint (TanStack Start, Next.js, Remix)
export function HeadThemeScript({ cookieTheme }: { cookieTheme: ThemePreference }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: getThemeBootstrapScript({
          initialTheme: cookieTheme,
          storageKey: null,
        }),
      }}
    />
  );
}

// 2. Own persistence via controlled value + onThemeChange with storageKey={null}
export function AppShell({
  cookieTheme,
  setCookieTheme,
  children,
}: {
  cookieTheme: ThemePreference;
  setCookieTheme: (next: ThemePreference) => void;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      value={cookieTheme}
      storageKey={null}
      onThemeChange={(preference) => setCookieTheme(preference)}
    >
      {children}
    </ThemeProvider>
  );
}`;

function StressDemo() {
  const { theme, preference } = useTheme();

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
          Disabled control ({preference} → {theme})
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
  const { theme, preference } = useTheme();

  return (
    <div className="max-w-xs space-y-4">
      <ThemeToggle variant="outline" />
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
        <span className="truncate text-xs text-muted-foreground">
          Disabled control ({preference} → {theme})
        </span>
        <ThemeToggle variant="outline" showLabel={false} disabled />
      </div>
      <ThemeToggle variant="secondary" disabled />
    </div>
  );
}`;

const usageCode = `import {
  ThemeProvider,
  ThemeToggle,
  getThemeBootstrapScript,
} from "@/components/ui/theme-provider";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kira-theme">
      <header className="flex justify-end p-4">
        <ThemeToggle showLabel={false} />
      </header>
      {children}
    </ThemeProvider>
  );
}

// Optional <head> snippet for zero-flash first paint:
// getThemeBootstrapScript({ defaultTheme: "system", storageKey: "kira-theme" })`;

export default function ThemeProviderPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Theme Provider"
        version="v1.1.0"
        description="SSR-safe light, dark, and system theme context with live OS change tracking, controlled cookie support, a pre-paint bootstrap script helper, and an accessible ThemeToggle button."
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
        description="Wrap your root route once and read or update the theme preference anywhere below."
        notes={[
          {
            label: "Controlled / SSR cookie mode",
            body: "Pass value={cookieTheme}, onThemeChange={saveCookie}, and storageKey={null} so your server cookie stays authoritative with zero localStorage reads or writes.",
          },
          {
            label: "Pre-paint bootstrap script",
            body: "Call getThemeBootstrapScript({ initialTheme, defaultTheme, storageKey }) in <head> so first paint matches ThemeProvider without hand-rolled script drift.",
          },
          {
            label: "ThemeToggle vs useTheme",
            body: "Use ThemeToggle for ready-made sidebar rows or icon-only header buttons; call useTheme() when building 3-way Light / Dark / System switchers.",
          },
        ]}
      />

      <APIReference
        sections={themeProviderApi}
        description="Props, return values, and defaults for ThemeProvider, useTheme, ThemeToggle, and getThemeBootstrapScript."
      />

      <Changelog
        entries={themeProviderChangelog}
        title="Changelog"
        description="Version history for Theme Provider."
      />
    </ComponentPage>
  );
}

const preferenceChoices = ["system", "light", "dark"] as const;

const themeProviderFeatures = [
  {
    title: "Native system preference & live OS sync",
    description:
      'Separates user preference ("light" | "dark" | "system") from resolved theme ("light" | "dark") and subscribes to prefers-color-scheme changes automatically.',
  },
  {
    title: "SSR & cookie authoritative mode",
    description:
      "Pass controlled value + onThemeChange with storageKey={null} to disable localStorage completely and prevent stale storage from flashing over server cookies.",
  },
  {
    title: "Pre-paint bootstrap script helper",
    description:
      "Exports getThemeBootstrapScript() so SSR frameworks can inject a synchronized <head> script with identical resolution rules and zero flash.",
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
        title="Programmatic 3-way control with useTheme"
        description='Read resolved theme and preference, call setTheme("light" | "dark" | "system"), or toggle directly.'
        code={customHookCode}
      >
        <CustomHookDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ssr",
    label: "SSR & Cookies",
    demo: (
      <DemoWrapper
        title="SSR cookie mode & getThemeBootstrapScript"
        description="Inspect the exact pre-paint script generated for cookie-backed SSR or localStorage apps."
        code={ssrBootstrapCode}
      >
        <SsrBootstrapDemo />
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
        type: '"light" | "dark" | "system"',
        default: '"system"',
        description:
          'Fallback preference when no controlled value or stored preference exists. "system" tracks prefers-color-scheme live.',
      },
      {
        prop: "value",
        type: '"light" | "dark" | "system"',
        default: "-",
        description:
          "Authoritative controlled/SSR preference (for example, read from a server cookie). Takes precedence over localStorage.",
      },
      {
        prop: "onThemeChange",
        type: "(preference: ThemePreference, resolved: ResolvedTheme) => void",
        default: "-",
        description:
          "Callback fired when setTheme or toggleTheme is invoked, receiving both the next preference and resolved theme.",
      },
      {
        prop: "storageKey",
        type: "string | null | false",
        default: '"kira-theme"',
        description:
          "localStorage key used to persist user preference. Pass null or false to disable localStorage reads and writes.",
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
          "Resolved concrete theme currently applied to document.documentElement.",
      },
      {
        prop: "preference",
        type: '"light" | "dark" | "system"',
        default: "-",
        description:
          "Active stored, controlled, or fallback preference before OS resolution.",
      },
      {
        prop: "setTheme",
        type: '(theme: "light" | "dark" | "system") => void',
        default: "-",
        description:
          'Sets light, dark, or system preference without overwriting "system" with the resolved OS class.',
      },
      {
        prop: "toggleTheme",
        type: "() => void",
        default: "-",
        description:
          "Switches to the opposite resolved theme (light ↔ dark) and stores the explicit choice.",
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
  {
    title: "getThemeBootstrapScript(options?)",
    props: [
      {
        prop: "initialTheme",
        type: '"light" | "dark" | "system"',
        default: "-",
        description:
          "Authoritative SSR preference (for example, from a server cookie). Skips localStorage when set.",
      },
      {
        prop: "defaultTheme",
        type: '"light" | "dark" | "system"',
        default: '"system"',
        description:
          "Fallback preference used when initialTheme is omitted and localStorage has no valid value.",
      },
      {
        prop: "storageKey",
        type: "string | null | false",
        default: '"kira-theme"',
        description:
          "localStorage key to read when initialTheme is omitted. Pass null or false to omit localStorage access entirely.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const themeProviderChangelog = [
  {
    version: "1.1.0",
    date: "28 November 2026",
    changes: [
      {
        type: "added",
        title: 'Native "system" preference with live OS change tracking',
        description:
          'Added ThemePreference ("light" | "dark" | "system"), ResolvedTheme ("light" | "dark"), preference on useTheme(), and a matchMedia change subscription that updates <html> without overwriting "system" in localStorage.',
      },
      {
        type: "added",
        title: "Controlled SSR cookie mode and getThemeBootstrapScript helper",
        description:
          "Added controlled value, onThemeChange, and storageKey={null | false} props to ThemeProvider plus getThemeBootstrapScript() for zero-flash pre-paint SSR bootstrapping.",
      },
      {
        type: "fixed",
        title: "Prevented stale localStorage from overriding SSR theme state",
        description:
          "Controlled value now takes precedence over localStorage, defaultTheme defaults to 'system', and hydration uses useSyncExternalStore snapshots to avoid flashes and mismatches.",
      },
    ],
  },
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
