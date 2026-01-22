import { converter } from "culori";
import { STATIC_STYLES } from "./templates";

const oklch = converter("oklch");

function generatePalette(primaryColor: string) {
  const p = oklch(primaryColor);
  if (!p) throw new Error(`Invalid color: ${primaryColor}`);
  const h = p.h || 0;
  const c = p.c || 0.15;

  const genVal = (lightness: number, chroma: number = c) =>
    `${lightness} ${chroma} ${h}`;

  return {
    light: {
      background: "1 0 0",
      foreground: "0.145 0 0",
      card: "1 0 0",
      cardForeground: "0.145 0 0",
      popover: "1 0 0",
      popoverForeground: "0.145 0 0",
      primary: genVal(0.59, c),
      primaryForeground: "0.97 0.01 343",
      secondary: genVal(0.75, c * 0.5),
      secondaryForeground: "0.2 0.03 15",
      muted: genVal(0.95, c * 0.1),
      mutedForeground: genVal(0.5, c * 0.2),
      accent: genVal(0.92, c * 0.2),
      accentForeground: genVal(0.3, c * 0.2),
      destructive: "0.6 0.22 20",
      destructiveForeground: "0.98 0.01 20",
      border: "0.9 0.01 20",
      input: "0.9 0.01 20",
      ring: genVal(0.7, c * 0.5),
      chart1: genVal(0.75, c),
      chart2: `oklch(0.75 ${c} ${h + 60})`
        .replace("oklch(", "")
        .replace(")", ""),
      chart3: `oklch(0.75 ${c} ${h + 120})`
        .replace("oklch(", "")
        .replace(")", ""),
      chart4: `oklch(0.75 ${c} ${h + 180})`
        .replace("oklch(", "")
        .replace(")", ""),
      chart5: `oklch(0.75 ${c} ${h + 240})`
        .replace("oklch(", "")
        .replace(")", ""),
      sidebar: "0.985 0 0",
      sidebarForeground: "0.145 0 0",
      sidebarPrimary: genVal(0.59, c),
      sidebarPrimaryForeground: "0.97 0.01 343",
      sidebarAccent: genVal(0.9, c * 0.2),
      sidebarAccentForeground: genVal(0.25, c * 0.2),
      sidebarBorder: "0.922 0 0",
      sidebarRing: genVal(0.7, c * 0.5),
    },
    dark: {
      background: "0.145 0 0",
      foreground: "0.985 0 0",
      card: "0.205 0 0",
      cardForeground: "0.985 0 0",
      popover: "0.205 0 0",
      popoverForeground: "0.985 0 0",
      primary: genVal(0.66, c),
      primaryForeground: "0.97 0.01 343",
      secondary: genVal(0.6, c * 0.4),
      secondaryForeground: "0.985 0 0",
      muted: genVal(0.25, c * 0.1),
      mutedForeground: genVal(0.65, c * 0.2),
      accent: genVal(0.4, c * 0.3),
      accentForeground: "0.98 0.01 10",
      destructive: "0.65 0.2 15",
      destructiveForeground: "0.98 0.01 15",
      border: "1 0 0 / 15%",
      input: "1 0 0 / 20%",
      ring: genVal(0.65, c * 0.5),
      chart1: genVal(0.7, c),
      chart2: `oklch(0.7 ${c} ${h + 60})`
        .replace("oklch(", "")
        .replace(")", ""),
      chart3: `oklch(0.7 ${c} ${h + 120})`
        .replace("oklch(", "")
        .replace(")", ""),
      chart4: `oklch(0.7 ${c} ${h + 180})`
        .replace("oklch(", "")
        .replace(")", ""),
      chart5: `oklch(0.7 ${c} ${h + 240})`
        .replace("oklch(", "")
        .replace(")", ""),
      sidebar: "0.205 0 0",
      sidebarForeground: "0.985 0 0",
      sidebarPrimary: genVal(0.73, c),
      sidebarPrimaryForeground: "0.97 0.01 343",
      sidebarAccent: genVal(0.45, c * 0.3),
      sidebarAccentForeground: "0.98 0.01 10",
      sidebarBorder: "1 0 0 / 10%",
      sidebarRing: genVal(0.65, c * 0.5),
    },
  };
}

export function generateCss(primaryColor: string): string {
  const palette = generatePalette(primaryColor);

  return `@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(${palette.light.background});
  --foreground: oklch(${palette.light.foreground});
  --card: oklch(${palette.light.card});
  --card-foreground: oklch(${palette.light.cardForeground});
  --popover: oklch(${palette.light.popover});
  --popover-foreground: oklch(${palette.light.popoverForeground});
  --primary: oklch(${palette.light.primary});
  --primary-foreground: oklch(${palette.light.primaryForeground});
  --secondary: oklch(${palette.light.secondary});
  --secondary-foreground: oklch(${palette.light.secondaryForeground});
  --muted: oklch(${palette.light.muted});
  --muted-foreground: oklch(${palette.light.mutedForeground});
  --accent: oklch(${palette.light.accent});
  --accent-foreground: oklch(${palette.light.accentForeground});
  --destructive: oklch(${palette.light.destructive});
  --destructive-foreground: oklch(${palette.light.destructiveForeground});
  --border: oklch(${palette.light.border});
  --input: oklch(${palette.light.input});
  --ring: oklch(${palette.light.ring});
  --radius: 0.45rem;
  
  --chart-1: oklch(${palette.light.chart1});
  --chart-2: oklch(${palette.light.chart2});
  --chart-3: oklch(${palette.light.chart3});
  --chart-4: oklch(${palette.light.chart4});
  --chart-5: oklch(${palette.light.chart5});

  --sidebar: oklch(${palette.light.sidebar});
  --sidebar-foreground: oklch(${palette.light.sidebarForeground});
  --sidebar-primary: oklch(${palette.light.sidebarPrimary});
  --sidebar-primary-foreground: oklch(${palette.light.sidebarPrimaryForeground});
  --sidebar-accent: oklch(${palette.light.sidebarAccent});
  --sidebar-accent-foreground: oklch(${palette.light.sidebarAccentForeground});
  --sidebar-border: oklch(${palette.light.sidebarBorder});
  --sidebar-ring: oklch(${palette.light.sidebarRing});
}

.dark {
  --background: oklch(${palette.dark.background});
  --foreground: oklch(${palette.dark.foreground});
  --card: oklch(${palette.dark.card});
  --card-foreground: oklch(${palette.dark.cardForeground});
  --popover: oklch(${palette.dark.popover});
  --popover-foreground: oklch(${palette.dark.popoverForeground});
  --primary: oklch(${palette.dark.primary});
  --primary-foreground: oklch(${palette.dark.primaryForeground});
  --secondary: oklch(${palette.dark.secondary});
  --secondary-foreground: oklch(${palette.dark.secondaryForeground});
  --muted: oklch(${palette.dark.muted});
  --muted-foreground: oklch(${palette.dark.mutedForeground});
  --accent: oklch(${palette.dark.accent});
  --accent-foreground: oklch(${palette.dark.accentForeground});
  --destructive: oklch(${palette.dark.destructive});
  --destructive-foreground: oklch(${palette.dark.destructiveForeground});
  --border: oklch(${palette.dark.border});
  --input: oklch(${palette.dark.input});
  --ring: oklch(${palette.dark.ring});
  
  --chart-1: oklch(${palette.dark.chart1});
  --chart-2: oklch(${palette.dark.chart2});
  --chart-3: oklch(${palette.dark.chart3});
  --chart-4: oklch(${palette.dark.chart4});
  --chart-5: oklch(${palette.dark.chart5});

  --sidebar: oklch(${palette.dark.sidebar});
  --sidebar-foreground: oklch(${palette.dark.sidebarForeground});
  --sidebar-primary: oklch(${palette.dark.sidebarPrimary});
  --sidebar-primary-foreground: oklch(${palette.dark.sidebarPrimaryForeground});
  --sidebar-accent: oklch(${palette.dark.sidebarAccent});
  --sidebar-accent-foreground: oklch(${palette.dark.sidebarAccentForeground});
  --sidebar-border: oklch(${palette.dark.sidebarBorder});
  --sidebar-ring: oklch(${palette.dark.sidebarRing});
}

@theme inline {
  --font-sans: "Geist Variable", sans-serif;
  
  /* Animation tokens */
  --animate-shimmer: shimmer 2s infinite;
  --animate-skeleton-wave: skeleton-wave 2s ease-in-out infinite;
  
  /* Colors */
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply font-sans bg-background text-foreground; }
  html { @apply font-sans; }
}

${STATIC_STYLES}
`;
}
