import * as React from "react";
import { IconChevronDown, IconHash } from "@tabler/icons-react";
import { cn } from "cn";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";
import { DocsSection } from "@/components/docs/layout";

interface APIProp {
  prop: string;
  type: string;
  default?: string;
  description: string;
}

interface APISection {
  title: string;
  props: APIProp[];
}

interface APIReferenceProps {
  sections: APISection[];
  title?: string;
  description?: React.ReactNode;
  className?: string;
}

function PropRow({ prop }: { prop: APIProp }) {
  return (
    <div className="flex flex-col gap-1.5 p-3 lg:flex-row lg:gap-5 lg:px-4 lg:py-2.5">
      <div className="flex min-w-0 flex-col gap-[3px] lg:w-[308px] lg:shrink-0">
        <span className="font-mono text-xs font-semibold break-words docs-accent">
          {prop.prop}
        </span>
        <span className="font-mono text-xs break-words text-foreground/80">
          {prop.type}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[13px] leading-[1.46] text-foreground/80">
          {prop.description}
        </p>

        {prop.default && prop.default !== "-" && (
          <span className="font-mono text-xs text-muted-foreground">
            Default {prop.default}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * The index tracks the card in view rather than only the last click, so
 * scrolling the page keeps the selection honest.
 */
function useActiveSection(titles: string[]) {
  const [active, setActive] = React.useState(titles[0] ?? "");
  const refs = React.useRef(new Map<string, HTMLElement>());

  React.useEffect(() => {
    const elements: HTMLElement[] = [];

    for (const title of titles) {
      const element = refs.current.get(title);

      if (element) elements.push(element);
    }

    if (!elements.length || !("IntersectionObserver" in window)) return;

    const visible = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }

        const first = elements.find((element) => visible.has(element));
        const title = first?.dataset.component;

        if (title) setActive(title);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: 0 },
    );

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [titles]);

  const jump = React.useCallback((title: string) => {
    const element = refs.current.get(title);

    if (!element) return;

    const reduced = prefersReducedMotion();

    element.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    setActive(title);
  }, []);

  const setRef = React.useCallback(
    (title: string) => (element: HTMLElement | null) => {
      if (element) refs.current.set(title, element);
      else refs.current.delete(title);
    },
    [],
  );

  return { active, jump, setRef };
}

interface SectionNavProps {
  sections: APISection[];
  active: string;
  onJump: (title: string) => void;
  id: string;
}

/**
 * Two renderings of the same targets: an index list under the intro on desktop,
 * a platform picker on mobile. Neither carries a visible heading — the design
 * marks the block by its layers, so the picker's name stays for assistive tech.
 */
function SectionNav({ sections, active, onJump, id }: SectionNavProps) {
  return (
    <>
      <div className="mt-3 hidden flex-col gap-1 lg:flex">
        {sections.map((section) => {
          const selected = section.title === active;

          return (
            <button
              key={section.title}
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => onJump(section.title)}
              className={cn(
                "docs-focus-ring flex h-8 w-full items-center gap-2 rounded-[5px] px-2 text-left font-mono text-xs transition-colors duration-150 ease-out",
                selected
                  ? "bg-primary/10 docs-accent"
                  : "text-foreground/80 hover:bg-muted",
              )}
            >
              <IconHash aria-hidden className="h-[13px] w-[13px] shrink-0" />
              <span className="truncate">{section.title}</span>
            </button>
          );
        })}
      </div>

      <div className="lg:hidden">
        <label htmlFor={id} className="sr-only">
          Jump to component
        </label>

        <div className="relative">
          <select
            id={id}
            value={active}
            onChange={(event) => onJump(event.target.value)}
            className="docs-focus-ring h-12 w-full appearance-none rounded-[8px] border border-border bg-background pr-10 pl-3 text-sm font-semibold text-foreground"
          >
            {sections.map((section) => (
              <option key={section.title} value={section.title}>
                {section.title}
              </option>
            ))}
          </select>

          <IconChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
    </>
  );
}

export function APIReference({
  sections,
  title = "API reference",
  description = "The props each part accepts, straight from the exported types.",
  className,
}: APIReferenceProps) {
  const titles = React.useMemo(
    () => sections.map((section) => section.title),
    [sections],
  );

  const { active, jump, setRef } = useActiveSection(titles);
  const uid = React.useId();

  return (
    <DocsSection
      title={title}
      description={description}
      className={className}
      sticky
      contentClassName="flex flex-col gap-6"
      aside={
        sections.length > 1 ? (
          <SectionNav
            sections={sections}
            active={active}
            onJump={jump}
            id={`${uid}-jump`}
          />
        ) : null
      }
    >
      {sections.map((section) => (
        <article
          key={section.title}
          ref={setRef(section.title)}
          data-component={section.title}
          data-slot="api-section"
          // 120 clears the top bar down where the shell still stacks its own
          // 56px header above it; from `md` the bar is the only thing on top.
          className="scroll-mt-30 overflow-hidden rounded-[10px] border border-border/70 bg-muted/30 md:scroll-mt-20"
        >
          <h3 className="flex items-center gap-2 bg-muted px-3 py-3 font-mono text-sm font-semibold text-foreground lg:px-4 lg:py-3.5">
            {section.title}
          </h3>

          <div className="flex flex-col divide-y divide-border/70">
            {section.props.map((prop) => (
              <PropRow key={`${section.title}-${prop.prop}`} prop={prop} />
            ))}
          </div>
        </article>
      ))}
    </DocsSection>
  );
}
