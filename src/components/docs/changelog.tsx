import * as React from "react";
import { cn } from "cn";
import { DocsSection, Reveal, SectionRule } from "@/components/docs/layout";

interface ChangelogChange {
  type: "added" | "changed" | "fixed" | "deprecated" | "removed" | "breaking";
  title: string;
  description?: string;
}

interface ChangelogEntryProps {
  version: string;
  date: string;
  changes: ChangelogChange[];
  /** The newest release gets the accent version, as in the design. */
  highlight?: boolean;
}

/**
 * Each category borrows a semantic theme colour; the tint and the readable text
 * shade are mixed from it in CSS, so a preset recolours the chips with everything
 * else. `removed` reads as a deprecation that has landed, so it shares that chip.
 */
const chipTokens: Record<ChangelogChange["type"], string> = {
  added: "docs-chip-added",
  fixed: "docs-chip-fixed",
  changed: "docs-chip-changed",
  breaking: "docs-chip-breaking",
  deprecated: "docs-chip-deprecated",
  removed: "docs-chip-deprecated",
};

const chipOrder: ChangelogChange["type"][] = [
  "added",
  "changed",
  "fixed",
  "deprecated",
  "removed",
  "breaking",
];

function ReleaseChips({ changes }: { changes: ChangelogChange[] }) {
  const present = chipOrder.filter((type) =>
    changes.some((c) => c.type === type),
  );

  return (
    <div className="flex flex-wrap gap-1.5 lg:gap-2">
      {present.map((type) => (
        <span
          key={type}
          className={cn(
            "flex h-[21px] items-center rounded-[5px] px-[7px] text-[11px] font-semibold",
            chipTokens[type],
          )}
        >
          {type}
        </span>
      ))}
    </div>
  );
}

/**
 * One release: version and its category chips on the left, the changes on the
 * right. The divider belongs to the list, so a standalone entry stays clean.
 */
export function ChangelogEntry({
  version,
  date,
  changes,
  highlight = false,
}: ChangelogEntryProps) {
  const label = version.replace(/^v/, "");

  return (
    <div className="flex flex-col gap-3 py-3.5 lg:flex-row lg:gap-5 lg:py-5">
      <div className="flex flex-col gap-1.5 lg:shrink-0 lg:gap-1.5 lg:w-[138px]">
        <div className="flex items-center gap-2.5 lg:flex-col lg:items-start lg:gap-1.5">
          <span
            className={cn(
              "font-mono text-lg leading-tight font-semibold",
              highlight ? "docs-accent" : "text-foreground",
            )}
          >
            v{label}
          </span>
          <span className="text-xs text-foreground/80">{date}</span>
        </div>
        <ReleaseChips changes={changes} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        {changes.map((change) => (
          <div
            key={`${change.type}-${change.title}`}
            className="flex flex-col gap-1"
          >
            <h3 className="text-sm leading-[1.4] font-semibold text-foreground">
              {change.title}
            </h3>
            {change.description && (
              <p className="text-[13px] leading-[1.5] text-foreground/80">
                {change.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface ChangelogProps {
  entries: ChangelogEntryProps[];
  title?: string;
  description?: React.ReactNode;
  className?: string;
}

export function Changelog({
  entries,
  title = "Changelog",
  description = "What shipped in each release, newest first.",
  className,
}: ChangelogProps) {
  return (
    <DocsSection
      title={title}
      description={description}
      className={className}
      contentClassName="flex flex-col"
    >
      {entries.map((entry, index) => (
        <React.Fragment key={entry.version}>
          {index > 0 && <SectionRule />}
          <Reveal delay={Math.min(index, 4) * 40}>
            <ChangelogEntry {...entry} highlight={index === 0} />
          </Reveal>
        </React.Fragment>
      ))}
    </DocsSection>
  );
}
