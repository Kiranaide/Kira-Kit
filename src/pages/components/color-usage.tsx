"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { IconMoon, IconSun, IconPalette, IconInfoCircle, IconCircleCheck, IconAlertTriangle, IconX } from "@tabler/icons-react";

interface ColorSwatchProps {
  name: string;
  token: string;
  lightValue: string;
  darkValue?: string;
  description?: string;
}

function ColorSwatch({ name, token, lightValue, darkValue, description }: ColorSwatchProps) {
  const [copied, setCopied] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const displayValue = isDark && darkValue ? darkValue : lightValue;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`var(--${token})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <div
        className={cn(
          "h-20 rounded-lg border border-border transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md",
          "flex items-center justify-center text-xs font-mono"
        )}
        style={{
          backgroundColor: displayValue,
          color: isDark && darkValue ? "white" : "black",
        }}
        onClick={handleCopy}
      >
        <span className={cn("opacity-0 group-hover:opacity-100 transition-opacity", copied && "opacity-100 font-semibold")}>
          {copied ? "Copied!" : "Copy"}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{name}</span>
          {darkValue && (
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1 rounded hover:bg-muted transition-colors"
              title={`Preview ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? (
                <IconSun className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <IconMoon className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono">{token}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-2 p-1 rounded-lg border border-border bg-muted/50">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "px-3 py-1.5 rounded text-sm font-medium transition-colors",
          theme === "light" ? "bg-background shadow-sm" : "hover:bg-background/50"
        )}
      >
        <IconSun className="w-4 h-4 inline mr-1.5" />
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "px-3 py-1.5 rounded text-sm font-medium transition-colors",
          theme === "dark" ? "bg-background shadow-sm" : "hover:bg-background/50"
        )}
      >
        <IconMoon className="w-4 h-4 inline mr-1.5" />
        Dark
      </button>
    </div>
  );
}

function ComponentShowcase() {
  return (
    <div className="space-y-8">
      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Buttons</CardTitle>
          <CardDescription>Primary and secondary action buttons using semantic color tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="success">Success</Button>
            <Button variant="info">Info</Button>
            <Button variant="warning">Warning</Button>
          </div>
        </CardContent>
      </Card>

      {/* Badge Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Badges</CardTitle>
          <CardDescription>Status indicators and labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alert Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alerts</CardTitle>
          <CardDescription>Feedback messages with icon and color integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default">
            <IconInfoCircle className="h-4 w-4" />
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert using the neutral color palette.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <IconInfoCircle className="h-4 w-4" />
            <AlertTitle>Info Alert</AlertTitle>
            <AlertDescription>Information messages to guide users through processes.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <IconCircleCheck className="h-4 w-4" />
            <AlertTitle>Success Alert</AlertTitle>
            <AlertDescription>Confirmation that an action was completed successfully.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <IconAlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning Alert</AlertTitle>
            <AlertDescription>Cautionary messages that require user attention.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <IconX className="h-4 w-4" />
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>Critical errors that block user actions.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Form Elements</CardTitle>
          <CardDescription>Inputs with border, ring, and muted foreground tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Input placeholder="Default input" />
              <p className="text-xs text-muted-foreground">Uses --input for background, --border for border</p>
            </div>
            <div className="space-y-2">
              <Input placeholder="With value" defaultValue="Sample text" />
              <p className="text-xs text-muted-foreground">Focus ring uses --ring token</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cards</CardTitle>
          <CardDescription>Different card variants using surface color tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle className="text-sm">Default Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Uses --card background</p>
              </CardContent>
            </Card>
            <Card variant="bordered">
              <CardHeader>
                <CardTitle className="text-sm">Bordered Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">With visible border</p>
              </CardContent>
            </Card>
            <Card variant="flat">
              <CardHeader>
                <CardTitle className="text-sm">Flat Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Using --muted background</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ColorPaletteSection() {
  const surfaceColors = [
    { name: "Background", token: "background", lightValue: "oklch(1 0 0)", darkValue: "oklch(0.145 0 0)", description: "Main page background" },
    { name: "Card", token: "card", lightValue: "oklch(1 0 0)", darkValue: "oklch(0.205 0 0)", description: "Card and container backgrounds" },
    { name: "Popover", token: "popover", lightValue: "oklch(1 0 0)", darkValue: "oklch(0.205 0 0)", description: "Dropdown and popover backgrounds" },
    { name: "Sidebar", token: "sidebar", lightValue: "oklch(0.985 0 0)", darkValue: "oklch(0.205 0 0)", description: "Sidebar navigation background" },
  ];

  const contentColors = [
    { name: "Foreground", token: "foreground", lightValue: "oklch(0.145 0 0)", darkValue: "oklch(0.985 0 0)", description: "Primary text content" },
    { name: "Muted Foreground", token: "muted-foreground", lightValue: "oklch(0.50 0.03 25)", darkValue: "oklch(0.65 0.03 20)", description: "Secondary and caption text" },
    { name: "Secondary Foreground", token: "secondary-foreground", lightValue: "oklch(0.20 0.03 15)", darkValue: "oklch(0.985 0 0)", description: "Tertiary content" },
    { name: "Accent Foreground", token: "accent-foreground", lightValue: "oklch(0.30 0.04 20)", darkValue: "oklch(0.98 0.01 10)", description: "Accented text elements" },
  ];

  const brandColors = [
    { name: "Primary", token: "primary", lightValue: "oklch(0.59 0.22 1)", darkValue: "oklch(0.66 0.21 354)", description: "Primary actions and brand color" },
    { name: "Primary Foreground", token: "primary-foreground", lightValue: "oklch(0.97 0.01 343)", darkValue: "oklch(0.97 0.01 343)", description: "Text on primary background" },
    { name: "Secondary", token: "secondary", lightValue: "oklch(0.75 0.10 10)", darkValue: "oklch(0.60 0.08 10)", description: "Secondary actions and elements" },
    { name: "Accent", token: "accent", lightValue: "oklch(0.92 0.04 15)", darkValue: "oklch(0.40 0.08 10)", description: "Highlight and decorative elements" },
  ];

  const feedbackColors = [
    { name: "Destructive", token: "destructive", lightValue: "oklch(0.60 0.22 20)", darkValue: "oklch(0.65 0.20 15)", description: "Error states and destructive actions" },
    { name: "Info", token: "info", lightValue: "oklch(0.75 0.16 225)", darkValue: "oklch(0.65 0.14 220)", description: "Informational messages" },
    { name: "Success", token: "success", lightValue: "oklch(0.75 0.18 150)", darkValue: "oklch(0.65 0.16 145)", description: "Success states and confirmations" },
    { name: "Warning", token: "warning", lightValue: "oklch(0.80 0.16 80)", darkValue: "oklch(0.70 0.14 75)", description: "Warning and cautionary states" },
  ];

  const uiColors = [
    { name: "Border", token: "border", lightValue: "oklch(0.90 0.01 20)", darkValue: "oklch(1 0 0 / 15%)", description: "Borders and dividers" },
    { name: "Input", token: "input", lightValue: "oklch(0.90 0.01 20)", darkValue: "oklch(1 0 0 / 20%)", description: "Form input backgrounds" },
    { name: "Ring", token: "ring", lightValue: "oklch(0.70 0.12 350)", darkValue: "oklch(0.65 0.14 350)", description: "Focus rings and indicators" },
  ];

  const chartColors = [
    { name: "Chart 1", token: "chart-1", lightValue: "oklch(0.75 0.14 185)", darkValue: "oklch(0.70 0.12 185)", description: "Teal - data visualization" },
    { name: "Chart 2", token: "chart-2", lightValue: "oklch(0.75 0.18 35)", darkValue: "oklch(0.70 0.16 35)", description: "Coral - data visualization" },
    { name: "Chart 3", token: "chart-3", lightValue: "oklch(0.78 0.14 95)", darkValue: "oklch(0.72 0.12 95)", description: "Golden - data visualization" },
    { name: "Chart 4", token: "chart-4", lightValue: "oklch(0.70 0.12 280)", darkValue: "oklch(0.65 0.10 280)", description: "Soft Purple - data visualization" },
    { name: "Chart 5", token: "chart-5", lightValue: "oklch(0.65 0.10 160)", darkValue: "oklch(0.60 0.08 160)", description: "Sage - data visualization" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {surfaceColors.map((color) => (
          <ColorSwatch key={color.token} {...color} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {contentColors.map((color) => (
          <ColorSwatch key={color.token} {...color} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brandColors.map((color) => (
          <ColorSwatch key={color.token} {...color} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {feedbackColors.map((color) => (
          <ColorSwatch key={color.token} {...color} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {uiColors.map((color) => (
          <ColorSwatch key={color.token} {...color} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {chartColors.map((color) => (
          <ColorSwatch key={color.token} {...color} />
        ))}
      </div>
    </div>
  );
}

function ColorRolesSection() {
  const roles = [
    {
      category: "Surface Colors",
      colors: [
        { token: "--background", usage: "Main page container, body background" },
        { token: "--card", usage: "Cards, content containers, panels" },
        { token: "--popover", usage: "Dropdowns, tooltips, modals" },
        { token: "--sidebar", usage: "Sidebar and navigation panels" },
        { token: "--muted", usage: "Subtle backgrounds, disabled states" },
      ],
    },
    {
      category: "Content Colors",
      colors: [
        { token: "--foreground", usage: "Primary text, headings, body copy" },
        { token: "--muted-foreground", usage: "Helper text, captions, timestamps, metadata" },
        { token: "--secondary-foreground", usage: "Subheadings, labels, decorative text" },
        { token: "--accent-foreground", usage: "Accented text, highlighted content" },
      ],
    },
    {
      category: "Brand Colors",
      colors: [
        { token: "--primary", usage: "Primary buttons, active states, links, brand elements" },
        { token: "--primary-foreground", usage: "Text on primary buttons and backgrounds" },
        { token: "--secondary", usage: "Secondary actions, toggle states, alternative buttons" },
        { token: "--accent", usage: "Highlights, decorative elements, selections" },
      ],
    },
    {
      category: "Feedback Colors",
      colors: [
        { token: "--destructive", usage: "Error messages, delete actions, validation errors" },
        { token: "--success", usage: "Success messages, confirmation, completion states" },
        { token: "--warning", usage: "Warnings, cautions, non-critical issues" },
        { token: "--info", usage: "Informational messages, tips, notifications" },
      ],
    },
    {
      category: "UI Colors",
      colors: [
        { token: "--border", usage: "Borders, dividers, separator lines" },
        { token: "--input", usage: "Form input backgrounds, form fields" },
        { token: "--ring", usage: "Focus indicators, keyboard navigation rings" },
      ],
    },
    {
      category: "Data Colors",
      colors: [
        { token: "--chart-1", usage: "Data series 1, primary data visualization" },
        { token: "--chart-2", usage: "Data series 2, complementary data" },
        { token: "--chart-3", usage: "Data series 3, accent data" },
        { token: "--chart-4", usage: "Data series 4, secondary accent" },
        { token: "--chart-5", usage: "Data series 5, tertiary data" },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {roles.map((role) => (
        <Card key={role.category}>
          <CardHeader>
            <CardTitle className="text-base">{role.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {role.colors.map((color) => (
                <div key={color.token} className="flex items-center gap-3">
                  <code className="text-xs bg-muted px-2 py-1 rounded shrink-0 font-mono">{color.token}</code>
                  <span className="text-sm text-muted-foreground">{color.usage}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AccessibilitySection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contrast Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="font-medium mb-2">WCAG AA (4.5:1)</h4>
              <p className="text-sm text-muted-foreground">
                Normal text requires minimum 4.5:1 contrast ratio. Use for body text, captions, and regular content.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-xs text-primary-foreground font-medium">Aa</span>
                </div>
                <span className="text-xs text-muted-foreground">Primary on primary-foreground: 5.5:1</span>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="font-medium mb-2">WCAG AAA (7:1)</h4>
              <p className="text-sm text-muted-foreground">
                Enhanced contrast for important content. Use for small text, headings, and critical information.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-destructive flex items-center justify-center">
                  <span className="text-xs text-destructive-foreground font-medium">Aa</span>
                </div>
                <span className="text-xs text-muted-foreground">Destructive on destructive-foreground: 6.5:1</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Color Independence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Never use color as the only means of conveying information. Always provide additional cues:
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive">Required</Badge>
                <span className="text-sm font-medium">Error States</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Combine red color with icon (✕), text label, and error message.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="success">Recommended</Badge>
                <span className="text-sm font-medium">Success States</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Use green with checkmark icon and confirmatory text.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Best Practice</Badge>
                <span className="text-sm font-medium">Links and Actions</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Add underline or icon to distinguish links from regular text.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageExamplesSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tailwind + cn() Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">{`import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

// Basic component styling
function Card({ className }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card text-card-foreground",
        className
      )}
    />
  )
}

// Button variants (pre-defined in buttonVariants)
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Confirm</Button>

// Conditional classes
<button
  className={cn(
    "bg-primary text-primary-foreground hover:bg-primary/90",
    isLoading && "opacity-50 cursor-wait"
  )}
>
  {isLoading ? "Loading..." : "Submit"}
</button>`}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">CSS Custom Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">{`/* Direct CSS usage */
.custom-component {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}

/* Hover state with token */
.custom-button:hover {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

/* Responsive tokens */
@media (prefers-color-scheme: dark) {
  .custom-component {
    background-color: var(--card);
    color: var(--card-foreground);
  }
}`}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alert Component Example</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-foreground">{`import { Alert } from "@/components/ui/alert"
import { IconInfoCircle, IconCircleCheck } from "@tabler/icons-react"

// Info alert
<Alert variant="info">
  <IconInfoCircle className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational message using the --info token.
  </AlertDescription>
</Alert>

// Success alert
<Alert variant="success">
  <IconCircleCheck className="h-4 w-4" />
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ColorUsagePage() {
  return (
    <div className="p-8 max-w-6xl space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <IconPalette className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Color System</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          A comprehensive color system built on semantic tokens with OKLCH colors.
          Inspired by Apple Human Interface Guidelines and Carbon Design System principles.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Theme Preview</h2>
            <p className="text-sm text-muted-foreground">Toggle between light and dark modes</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="p-6 rounded-xl border border-border bg-background">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="text-sm font-medium mb-1">Card</p>
              <p className="text-xs text-muted-foreground">Uses --card</p>
            </div>
            <div className="p-4 rounded-lg bg-primary text-primary-foreground">
              <p className="text-sm font-medium mb-1">Primary</p>
              <p className="text-xs opacity-90">Uses --primary</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary text-secondary-foreground">
              <p className="text-sm font-medium mb-1">Secondary</p>
              <p className="text-xs opacity-90">Uses --secondary</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-muted-foreground">
              <p className="text-sm font-medium mb-1">Muted</p>
              <p className="text-xs">Uses --muted</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Component Showcase</h2>
        <p className="text-sm text-muted-foreground">
          Live examples of components using the color system tokens
        </p>
        <ComponentShowcase />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Color Palette</h2>
        <p className="text-sm text-muted-foreground">
          Click any swatch to copy the CSS variable. Toggle the sun/moon icon to preview light/dark values.
        </p>
        <ColorPaletteSection />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Color Roles</h2>
        <p className="text-sm text-muted-foreground">
          Each color has a specific purpose and usage guidelines
        </p>
        <ColorRolesSection />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Accessibility</h2>
        <p className="text-sm text-muted-foreground">
          Guidelines for maintaining accessible color contrast
        </p>
        <AccessibilitySection />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Usage Examples</h2>
        <p className="text-sm text-muted-foreground">
          Code examples showing proper usage of color tokens
        </p>
        <UsageExamplesSection />
      </section>
    </div>
  );
}
