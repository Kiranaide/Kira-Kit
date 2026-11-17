import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { usePlatform, type Platform } from "@/hooks/use-platform";

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded font-mono text-xs font-medium tabular-nums shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--border)_60%,transparent)]",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-muted px-1.5 py-0.5 text-muted-foreground",
        outline: "border border-border px-1.5 py-0.5 text-muted-foreground",
        ghost: "bg-muted/50 px-1.5 py-0.5 text-muted-foreground",
      },
      size: {
        sm: "h-5 min-w-5 text-[10px] px-1",
        default: "h-6 min-w-6 text-xs px-1.5",
        lg: "h-7 min-w-7 text-sm px-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Shortcut grammar: "+"-separated tokens, e.g. "mod+shift+k" or "ctrl++".
 * A trailing "+" is a literal plus key, so "ctrl++" parses to Ctrl, +.
 */
function parseShortcut(shortcut: string): string[] {
  const match = /^(.*)\+$/.exec(shortcut);

  if (match) {
    const base = match[1].split("+").filter(Boolean);

    return [...base, "+"];
  }

  return shortcut.split("+").filter(Boolean);
}

interface KeySym {
  mac: string;
  other: string;
}

const KEY_SYMBOLS = {
  mod: { mac: "⌘", other: "Ctrl" },
  meta: { mac: "⌘", other: "Meta" },
  cmd: { mac: "⌘", other: "Cmd" },
  ctrl: { mac: "⌃", other: "Ctrl" },
  control: { mac: "⌃", other: "Ctrl" },
  shift: { mac: "⇧", other: "Shift" },
  alt: { mac: "⌥", other: "Alt" },
  option: { mac: "⌥", other: "Alt" },
  enter: { mac: "↩", other: "Enter" },
  backspace: { mac: "⌫", other: "Backspace" },
  delete: { mac: "⌦", other: "Del" },
  esc: { mac: "⎋", other: "Esc" },
  escape: { mac: "⎋", other: "Esc" },
  tab: { mac: "⇥", other: "Tab" },
  up: { mac: "↑", other: "↑" },
  down: { mac: "↓", other: "↓" },
  left: { mac: "←", other: "←" },
  right: { mac: "→", other: "→" },
} satisfies Record<string, KeySym>;

type KeyToken = keyof typeof KEY_SYMBOLS;

/** Resolve grammar tokens to platform-appropriate keycap labels. */
function formatKeys(keys: string[], platform: Platform): string[] {
  return keys.map((key) => kbdMap(key, platform));
}

/** Normalize grammar to ARIA `aria-keyshortcuts` accelerator syntax. */
function ariaKeys(keys: string[], platform: Platform): string {
  return keys.map((key) => kbdMap2(key, platform)).join("+");
}

/** Repeated keycaps keep distinct identities without tying them to array positions. */
function keycapEntries(labels: string[]) {
  const occurrences = new Map<string, number>();

  return labels.map((label) => {
    const occurrence = occurrences.get(label) ?? 0;
    occurrences.set(label, occurrence + 1);

    return { label, id: JSON.stringify([label, occurrence]) };
  });
}

interface KbdProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof kbdVariants> {
  /**
   * Shortcut grammar string, e.g. "mod+shift+k" ("+"-separated; a trailing
   * "+" is a literal plus key). Multi-token strings render as a keycap group.
   * Wins over children when both are given.
   */
  keys?: string;
}

function Kbd({ className, variant, size, keys, children, ...props }: KbdProps) {
  const platform = usePlatform();
  const keycaps = keys ? formatKeys(parseShortcut(keys), platform) : undefined;

  if (keycaps && keycaps.length > 1) {
    return (
      <KbdGroup {...props}>
        {keycapEntries(keycaps).map(({ label, id }) => (
          <kbd
            key={id}
            data-slot="kbd"
            className={cn(kbdVariants({ variant, size }), className)}
          >
            {label}
          </kbd>
        ))}
      </KbdGroup>
    );
  }

  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    >
      {keycaps ?? children}
    </kbd>
  );
}

interface KbdGroupProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Separator rendered between keycaps. Default: none — adjacent keycaps. */
  separator?: React.ReactNode;
}

function KbdGroup({ className, separator, children, ...props }: KbdGroupProps) {
  const items = React.Children.toArray(children);

  return (
    <span
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    >
      {separator
        ? React.Children.map(items, (child, index) => (
            <React.Fragment>
              {index > 0 && (
                <span className="text-muted-foreground text-xs">
                  {separator}
                </span>
              )}
              {child}
            </React.Fragment>
          ))
        : children}
    </span>
  );
}

interface KbdShortcutProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof kbdVariants> {
  /** Shortcut grammar, e.g. "mod+s", "ctrl+shift+p". */
  shortcut: string;
  /** Force a platform. Default: auto-detect via `usePlatform`. */
  platform?: Platform;
  /** Separator rendered between keycaps (e.g. "+"). Default: none. */
  separator?: React.ReactNode;
}

function KbdShortcut({
  shortcut,
  platform,
  separator,
  variant,
  size,
  className,
  "aria-label": ariaLabel,
  ...props
}: KbdShortcutProps) {
  const detected = usePlatform();
  const active = platform ?? detected;
  const keys = parseShortcut(shortcut);
  const formatted = formatKeys(keys, active);

  return (
    <span
      data-slot="kbd-shortcut"
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={ariaLabel ?? formatted.join(" plus ")}
      aria-keyshortcuts={ariaKeys(keys, active)}
      {...props}
    >
      <KbdGroup separator={separator}>
        {keycapEntries(formatted).map(({ label, id }) => (
          <Kbd key={id} variant={variant} size={size} aria-hidden="true">
            {label}
          </Kbd>
        ))}
      </KbdGroup>
    </span>
  );
}

export { Kbd, KbdGroup, KbdShortcut, kbdVariants };

function kbdMap(key: string, platform: Platform) {
  // SAFETY: tokens outside KEY_SYMBOLS are literal keys; the cast only
  // types the lookup — a miss yields undefined and falls through below.
  const symbol = KEY_SYMBOLS[key.toLowerCase() as KeyToken];

  if (symbol) return platform === "mac" ? symbol.mac : symbol.other;

  if (key.length === 1) return key.toUpperCase();

  return key;
}

function kbdMap2(key: string, platform: Platform) {
  const k = key.toLowerCase();

  if (k === "mod") return platform === "mac" ? "Meta" : "Control";

  const modifiers = new Map([
    ["meta", "Meta"],
    ["cmd", "Meta"],
    ["ctrl", "Control"],
    ["control", "Control"],
    ["alt", "Alt"],
    ["option", "Alt"],
    ["shift", "Shift"],
  ]);

  const modifier = modifiers.get(k);

  if (modifier) return modifier;

  if (key.length === 1) return key.toUpperCase();

  return key.charAt(0).toUpperCase() + key.slice(1);
}
