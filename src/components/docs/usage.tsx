import * as React from "react";
import { CodePanel } from "@/components/docs/code-panel";
import { DocsSection, SectionRule } from "@/components/docs/layout";

interface UsageNote {
  label: string;
  body: string;
}

interface UsageBlockProps {
  code: string;
  title?: string;
  description?: React.ReactNode;
  language?: string;
  /** Short decision guidance under the intro, e.g. which of two APIs to reach for. */
  notes?: UsageNote[];
  className?: string;
}

export function UsageBlock({
  code,
  title = "Usage",
  description = "Copy-ready: every import the snippet needs is already in it.",
  language = "tsx",
  notes,
  className,
}: UsageBlockProps) {
  return (
    <DocsSection
      title={title}
      description={description}
      className={className}
      aside={
        notes?.length && (
          <div className="mt-2 flex flex-col gap-2 lg:mt-3.5">
            {notes.map((note) => (
              <div key={note.label} className="flex flex-col gap-2">
                <SectionRule />
                <span className="font-mono text-xs docs-accent">
                  {note.label}
                </span>
                <p className="text-[13px] leading-[1.45] text-foreground/80">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        )
      }
    >
      <CodePanel code={code} language={language} />
    </DocsSection>
  );
}
