import * as React from "react";
import { cn } from "cn";
import { DocsSection, Reveal, SectionRule } from "@/components/docs/layout";

interface KeyboardShortcutProps {
  keys: string;
  description: string;
  /** Optional section heading; auto-classified from the key itself when absent. */
  group?: string;
}

interface KeyboardShortcutsProps {
  shortcuts: KeyboardShortcutProps[];
  title?: string;
  description?: React.ReactNode;
  className?: string;
}

const groups = [
  [
    "Navigation",
    /tab|arrow|←|→|↑|↓|home|end|page|swipe|^type|typeahead|letter/i,
  ],
  ["Shortcuts", /⌘|cmd|ctrl|meta/i],
  ["Editing", /backspace|delete|undo|redo|clear/i],
  ["Activation", /enter|space|escape|esc\b/i],
  ["Assistive technology", /screen reader|aria|announce/i],
] as const;

function groupOf(shortcut: KeyboardShortcutProps) {
  if (shortcut.group) return shortcut.group;

  return (
    groups.find(([, pattern]) => pattern.test(shortcut.keys))?.[0] ?? "Actions"
  );
}

const separator = /[+/→,]/;

/**
 * Key combos arrive as free text ("Tab / Shift + Tab", "Tab → Retry → Enter"),
 * so the chips are split on the separator glyphs rather than trusting a schema
 * the page data does not carry.
 */
function KeyCombination({ keys }: { keys: string }) {
  const parts = keys.split(/\s*([+/→,])\s*/u).filter(Boolean);

  return (
    <span className="flex flex-wrap items-center gap-1 sm:w-[121px] sm:shrink-0">
      {/* oxlint-disable react/no-array-index-key -- A split combo repeats tokens ("/" twice, "Tab" twice), so position is the only identity each part has. */}
      {parts.map((part, index) =>
        separator.test(part) ? (
          <span
            key={index}
            aria-hidden
            className="font-mono text-xs text-muted-foreground"
          >
            {part}
          </span>
        ) : (
          <kbd
            key={index}
            className="flex h-6 min-w-0 items-center justify-center rounded-[5px] border border-border/70 bg-muted px-1.5 font-mono text-xs break-words text-foreground"
          >
            {part}
          </kbd>
        ),
      )}
    </span>
  );
}

const cardClass =
  "flex flex-col rounded-[10px] border border-border/70 bg-muted/30 p-3 lg:px-4 lg:py-3.5";

interface ShortcutCardProps {
  label: string;
  shortcuts: KeyboardShortcutProps[];
}

function ShortcutCard({ label, shortcuts }: ShortcutCardProps) {
  return (
    <div className={cardClass}>
      <h3 className="text-[15px] leading-[1.47] font-semibold text-foreground">
        {label}
      </h3>
      <div className="flex flex-col">
        {/* oxlint-disable react/no-array-index-key -- A page lists the same key twice on purpose (Tab moves focus forward, and Tab reveals a disabled reason), so the row's position is its only identity. */}
        {shortcuts.map((shortcut, index) => (
          <React.Fragment key={index}>
            {index > 0 && <SectionRule />}
            <div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:gap-2.5">
              <KeyCombination keys={shortcut.keys} />
              <p className="min-w-0 flex-1 text-[13px] leading-[1.385] text-foreground/80">
                {shortcut.description}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * The design shows two titled cards; pages only carry a flat list, so the keys
 * decide which card a row belongs to and the grid equalises the heights.
 */
export function KeyboardShortcuts({
  shortcuts,
  title = "Keyboard shortcuts",
  description = "Every binding below is handled by the component itself — nothing to wire up.",
  className,
}: KeyboardShortcutsProps) {
  const cards = new Map<string, KeyboardShortcutProps[]>();

  for (const shortcut of shortcuts) {
    const label = groupOf(shortcut);
    const rows = cards.get(label);

    if (rows) rows.push(shortcut);
    else cards.set(label, [shortcut]);
  }

  const sections = [...cards.entries()];

  return (
    <DocsSection
      title={title}
      description={description}
      className={className}
      contentClassName="flex flex-col gap-2.5 lg:gap-3"
    >
      <div
        className={cn(
          "grid gap-2.5 lg:grid-cols-2 lg:gap-3",
          sections.length < 2 && "lg:grid-cols-1",
        )}
      >
        {sections.map(([label, rows], index) => (
          <Reveal
            key={label}
            delay={index * 40}
            className="flex min-w-0 [&>*]:h-full"
          >
            <ShortcutCard label={label} shortcuts={rows} />
          </Reveal>
        ))}
      </div>
    </DocsSection>
  );
}
