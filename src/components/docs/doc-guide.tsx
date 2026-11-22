import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { Link } from "@tanstack/react-router";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import { cn } from "cn";
import { DocTocRail, docDesktopLayout } from "@/components/docs/doc-page";
import { useReveal } from "@/components/docs/layout";
import { PageTopBar } from "@/components/site-chrome";

export interface DocGuideTocItem {
  id: string;
  label: string;
}

export interface DocGuideNavLink {
  to: string;
  label: string;
  icon?: React.ElementType;
}

export function scrollToAnchor(id: string) {
  const target = document.getElementById(id);

  if (!target) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
}

function navigateToSection(id: string) {
  window.history.replaceState(window.history.state, "", `#${id}`);
  document.getElementById(id)?.focus({ preventScroll: true });
  scrollToAnchor(id);
}

function useActiveSection(sections: readonly DocGuideTocItem[]) {
  const firstId = sections[0]?.id ?? null;
  const [activeId, setActiveId] = React.useState<string | null>(firstId);

  React.useEffect(() => {
    const ids = sections.map((section) => section.id);

    if (ids.length === 0) return;

    const update = () => {
      const marker = 128;
      let current = ids[0] ?? null;

      for (const id of ids) {
        const node = document.getElementById(id);

        if (node && node.getBoundingClientRect().top <= marker) {
          current = id;
        }
      }

      setActiveId(current);
    };

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return activeId ?? firstId;
}

function MobileJumpToSection({
  sections,
  activeId,
}: {
  sections: readonly DocGuideTocItem[];
  activeId: string | null;
}) {
  const [open, setOpen] = React.useState(false);

  if (sections.length < 2) return null;

  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="doc-guide-mobile-toc"
      className="lg:hidden"
    >
      <CollapsiblePrimitive.Trigger className="docs-focus-ring flex h-11 w-full items-center justify-between rounded-[6px] border border-border bg-muted/60 px-3 text-[13px] font-semibold leading-[1.42] text-foreground transition-colors duration-150 hover:bg-muted">
        <span>On this page</span>
        <IconChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Panel className="overflow-hidden">
        <nav
          aria-label="On this page"
          className="mt-1.5 rounded-[6px] border border-border bg-card p-1"
        >
          <ul className="flex flex-col">
            {sections.map((section) => {
              const active = section.id === activeId;

              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      setOpen(false);
                      navigateToSection(section.id);
                    }}
                    className={cn(
                      "docs-focus-ring flex min-h-11 items-center rounded-[5px] px-3 text-[13px] leading-[1.42] transition-colors duration-150",
                      active
                        ? "bg-primary/10 font-semibold docs-accent"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  );
}

function RelatedDocButton({
  direction,
  link,
}: {
  direction: "previous" | "next";
  link: DocGuideNavLink;
}) {
  const Icon =
    link.icon ?? (direction === "previous" ? IconArrowLeft : IconArrowRight);

  return (
    <Link
      to={link.to}
      className="docs-focus-ring group inline-flex h-11 w-fit items-center gap-2 rounded-[7px] border border-border bg-card px-3 text-sm font-semibold leading-[1.42] text-foreground transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-accent/40"
    >
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 docs-accent transition-transform duration-150 ease-out group-hover:scale-105 motion-reduce:transition-none"
      />
      <span>{link.label}</span>
    </Link>
  );
}

interface DocGuidePageProps {
  title: string;
  description: string;
  crumb?: string;
  sections: readonly DocGuideTocItem[];
  previous?: DocGuideNavLink;
  next?: DocGuideNavLink;
  children: React.ReactNode;
}

export function DocGuidePage({
  title,
  description,
  crumb,
  sections,
  previous,
  next,
  children,
}: DocGuidePageProps) {
  const activeId = useActiveSection(sections);

  return (
    <div data-slot="doc-guide-page" className="min-h-full bg-background">
      <PageTopBar crumb={crumb ?? title} />

      <div
        className={cn(
          "mx-auto flex w-full max-w-[1180px] flex-col px-5 pt-[26px] pb-7 sm:px-8",
          docDesktopLayout,
        )}
      >
        <article className="flex min-w-0 flex-1 flex-col gap-7 lg:max-w-[740px] lg:gap-[34px]">
          <header className="flex flex-col gap-3">
            <h1 className="text-[38px] font-semibold leading-[1.05] tracking-[-1.3px] text-balance text-foreground lg:text-[54px] lg:tracking-[-2.6px]">
              {title}
            </h1>
            <p className="max-w-[650px] text-base leading-[1.53] text-muted-foreground lg:text-lg">
              {description}
            </p>
            <div aria-hidden="true" className="h-px w-full bg-border" />
            <MobileJumpToSection sections={sections} activeId={activeId} />
          </header>

          {children}

          {(previous || next) && (
            <div className="flex flex-col gap-7 lg:gap-[34px]">
              <div aria-hidden="true" className="h-px w-full bg-border" />
              <nav
                aria-label="Related documentation"
                className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3.5"
              >
                {previous ? (
                  <RelatedDocButton direction="previous" link={previous} />
                ) : (
                  <span className="hidden sm:block" aria-hidden="true" />
                )}
                {next && <RelatedDocButton direction="next" link={next} />}
              </nav>
            </div>
          )}
        </article>

        <DocTocRail
          entries={sections}
          activeId={activeId}
          onNavigate={navigateToSection}
        />
      </div>
    </div>
  );
}

interface DocGuideSectionProps {
  id: string;
  title: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DocGuideSection({
  id,
  title,
  description,
  meta,
  children,
  className,
}: DocGuideSectionProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      tabIndex={-1}
      data-slot="doc-guide-section"
      data-doc-section
      data-title={title}
      data-revealed={revealed ? "true" : undefined}
      className={cn(
        "docs-reveal flex scroll-mt-20 flex-col gap-3.5",
        className,
      )}
    >
      <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-1.05px] text-balance text-foreground">
        {title}
      </h2>
      {meta && (
        <p className="font-mono text-[13px] leading-[1.42] text-muted-foreground">
          {meta}
        </p>
      )}
      {description && (
        <p className="text-base leading-[1.53] text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export interface DocGuideTableRow {
  key: string;
  term: React.ReactNode;
  detail: React.ReactNode;
}

export function DocGuideTable({
  columns,
  rows,
  caption,
}: {
  columns: readonly [string, string];
  rows: readonly DocGuideTableRow[];
  caption: string;
}) {
  return (
    <div
      data-slot="doc-guide-table"
      className="overflow-hidden rounded-[7px] border border-border bg-card"
    >
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden bg-muted/60 sm:table-header-group">
          <tr className="border-b border-border">
            <th
              scope="col"
              className="w-[199px] px-3 py-2.5 text-[13px] font-semibold leading-[1.42] text-foreground"
            >
              {columns[0]}
            </th>
            <th
              scope="col"
              className="px-3 py-2.5 text-[13px] font-semibold leading-[1.42] text-foreground"
            >
              {columns[1]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr
              key={row.key}
              className="flex flex-col gap-2 px-3 py-2.5 sm:table-row sm:p-0"
            >
              <th
                scope="row"
                className="align-top font-mono text-[13px] font-semibold leading-[1.42] docs-accent sm:w-[199px] sm:px-3 sm:py-2.5"
              >
                {row.term}
              </th>
              <td className="align-top text-sm leading-[1.53] text-muted-foreground sm:px-3 sm:py-2.5">
                {row.detail}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocGuideChecklist({
  items,
  className,
}: {
  items: readonly { title: string; description: React.ReactNode }[];
  className?: string;
}) {
  return (
    <ul
      data-slot="doc-guide-checklist"
      className={cn(
        "flex flex-col divide-y divide-border border-t border-border",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.title} className="flex items-start gap-2.5 py-3">
          <IconCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 docs-accent"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="text-[15px] font-semibold leading-[1.15] tracking-[-0.35px] text-foreground">
              {item.title}
            </p>
            <p className="text-sm leading-[1.53] text-muted-foreground">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
