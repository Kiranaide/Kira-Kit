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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReveal } from "@/components/docs/layout";
import { PageTopBar } from "@/components/site-chrome";

export interface TocEntry {
  id: string;
  label: string;
}

export interface DocNavLink {
  to: string;
  label: string;
  icon?: React.ElementType;
}

/** Jump to a section, skipping the smooth scroll when motion is reduced. */
export function scrollToSection(id: string) {
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
  scrollToSection(id);
}

/**
 * Collects the section headings that actually rendered (or uses an explicit
 * list) and tracks which one the reader is in.
 */
function useDocToc(
  root: React.RefObject<HTMLElement | null>,
  explicitSections?: readonly TocEntry[],
) {
  const [domEntries, setDomEntries] = React.useState<TocEntry[]>([]);
  const entries = explicitSections ?? domEntries;

  const [activeId, setActiveId] = React.useState<string | null>(
    explicitSections?.[0]?.id ?? null,
  );

  React.useEffect(() => {
    const container = root.current;

    if (!container) return;

    const sections = explicitSections
      ? explicitSections.flatMap((item) => {
          const node = document.getElementById(item.id);

          return node ? [node] : [];
        })
      : [...container.querySelectorAll<HTMLElement>("[data-doc-section]")];

    if (!explicitSections) {
      // oxlint-disable-next-line react/set-state-in-effect -- one pass per mount; the scroll handler owns later updates.
      setDomEntries(
        sections.map((section) => ({
          id: section.id,
          label:
            section.dataset.title ??
            section.querySelector("h2")?.textContent ??
            section.id,
        })),
      );
    }

    const update = () => {
      const marker = 128;
      let current = sections[0]?.id ?? null;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }

      setActiveId(current);
    };

    update();

    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    // The scrollable element is the app shell's <main>; listening on document
    // catches it because scroll bubbles in capture phase for nested scrollers.
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
  }, [root, explicitSections]);

  return { entries, activeId: activeId ?? entries[0]?.id ?? null };
}

function MobileJumpToSection({
  entries,
  activeId,
}: {
  entries: readonly TocEntry[];
  activeId: string | null;
}) {
  const [open, setOpen] = React.useState(false);

  if (entries.length < 2) return null;

  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="doc-mobile-toc"
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
            {entries.map((entry) => {
              const active = entry.id === activeId;

              return (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    aria-current={active ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      setOpen(false);
                      navigateToSection(entry.id);
                    }}
                    className={cn(
                      "docs-focus-ring flex min-h-11 items-center rounded-[5px] px-3 text-[13px] leading-[1.42] transition-colors duration-150",
                      active
                        ? "bg-primary/10 font-semibold docs-accent"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {entry.label}
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

export const docDesktopLayout =
  "lg:flex-row lg:gap-10 lg:px-10 lg:pt-8 lg:pb-10";

export function DocTocRail({
  entries,
  activeId,
  onNavigate = navigateToSection,
}: {
  entries: readonly TocEntry[];
  activeId: string | null;
  onNavigate?: (id: string) => void;
}) {
  if (entries.length < 2) return null;

  return (
    <aside
      aria-label="On this page"
      className="hidden shrink-0 lg:block lg:w-52 xl:w-[212px]"
    >
      <div className="sticky top-24 flex flex-col gap-1 py-1">
        <p className="px-2.5 pb-1 text-[13px] font-semibold text-muted-foreground">
          On this page
        </p>
        <ul className="flex flex-col">
          {entries.map((entry) => {
            const active = entry.id === activeId;

            return (
              <li key={entry.id} className="relative">
                {active && (
                  <span
                    aria-hidden="true"
                    className="docs-nav-indicator absolute top-1/2 -left-3 h-4 w-0.5 -translate-y-1/2 rounded-full docs-accent-fill"
                  />
                )}
                <a
                  href={`#${entry.id}`}
                  aria-current={active ? "true" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(entry.id);
                  }}
                  className={cn(
                    "docs-focus-ring flex min-h-9 items-center rounded-[7px] px-2.5 text-[13px] font-medium transition-colors duration-150 ease-out",
                    active
                      ? "docs-accent bg-primary/8"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {entry.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

interface DocPageProps {
  title: string;
  description: string;
  /** Top-bar crumb; falls back to the page title. */
  crumb?: string;
  badge?: React.ReactNode;
  sections?: readonly TocEntry[];
  previous?: DocNavLink;
  next?: DocNavLink;
  children: React.ReactNode;
}

/**
 * Article frame for all docs pages: sticky breadcrumb bar, measure-limited
 * writing column, mobile + desktop scroll-spy "On this page" navigation, and
 * prev/next links at the foot.
 */
export function DocPage({
  title,
  description,
  crumb,
  badge,
  sections,
  previous,
  next,
  children,
}: DocPageProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const toc = useDocToc(root, sections);

  return (
    <div data-slot="doc-page" className="min-h-full bg-background">
      <PageTopBar crumb={crumb ?? title} />

      <div
        ref={root}
        className={cn(
          "mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-4 pt-8 pb-10 sm:px-6",
          docDesktopLayout,
        )}
      >
        <article className="flex min-w-0 flex-1 flex-col gap-9 lg:max-w-[740px]">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.045em] text-balance text-foreground lg:text-[44px]">
                {title}
              </h1>
              {badge}
            </div>
            <p className="max-w-[640px] text-base leading-7 text-muted-foreground lg:text-lg lg:leading-8">
              {description}
            </p>
            <MobileJumpToSection
              entries={toc.entries}
              activeId={toc.activeId}
            />
          </header>

          {children}

          {(previous || next) && (
            <nav
              aria-label="Documentation"
              className="grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2"
            >
              {previous && (
                <DocDirectionLink direction="previous" link={previous} />
              )}
              {next && <DocDirectionLink direction="next" link={next} />}
            </nav>
          )}
        </article>

        <DocTocRail entries={toc.entries} activeId={toc.activeId} />
      </div>
    </div>
  );
}

function DocDirectionLink({
  direction,
  link,
}: {
  direction: "previous" | "next";
  link: DocNavLink;
}) {
  const isNext = direction === "next";
  const CustomIcon = link.icon;

  return (
    <Link
      to={link.to}
      className={cn(
        "docs-focus-ring group flex min-h-11 flex-col justify-center gap-1 rounded-[8px] border border-border px-4 py-3 transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-accent/50",
        isNext && "sm:col-start-2 sm:items-end sm:text-right",
      )}
    >
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {!isNext && (
          <IconArrowLeft
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none"
          />
        )}
        {direction === "next" ? "Next" : "Previous"}
        {isNext && (
          <IconArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        )}
      </span>
      <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        {CustomIcon && (
          <CustomIcon
            aria-hidden="true"
            className="size-4 shrink-0 docs-accent"
          />
        )}
        {link.label}
      </span>
    </Link>
  );
}

interface DocSectionProps {
  id: string;
  title: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** One numbered part of an article. The id feeds the "On this page" rail. */
export function DocSection({
  id,
  title,
  description,
  meta,
  children,
  className,
}: DocSectionProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      tabIndex={-1}
      data-doc-section
      data-title={title}
      data-revealed={revealed ? "true" : undefined}
      className={cn(
        "docs-reveal flex scroll-mt-20 flex-col gap-5 lg:gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-semibold leading-[1.25] tracking-[-0.03em] text-balance text-foreground lg:text-[28px]">
          {title}
        </h2>
        {meta && (
          <p className="font-mono text-[13px] leading-[1.42] text-muted-foreground">
            {meta}
          </p>
        )}
        {description && (
          <p className="max-w-[620px] text-sm leading-6 text-muted-foreground lg:text-base lg:leading-7">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

interface DocStep {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * Explicit number, for pages that number steps across separate sections
   * instead of one contiguous list.
   */
  number?: number;
}

/** Numbered how-to steps: chip, title, body, then whatever block the step needs. */
export function DocSteps({ steps }: { steps: readonly DocStep[] }) {
  return (
    <ol className="flex flex-col gap-7">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[13px] font-semibold docs-accent">
              {step.number ?? index + 1}
            </span>
            <h3 className="text-[17px] font-semibold leading-6 text-foreground">
              {step.title}
            </h3>
          </div>
          {step.description && (
            <p className="max-w-[620px] text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          )}
          {step.children}
        </li>
      ))}
    </ol>
  );
}

/** Feature rows with a check glyph and hairline rules between them. */
export function DocChecklist({
  items,
}: {
  items: readonly { title: string; description: React.ReactNode }[];
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item, index) => (
        <li
          key={item.title}
          className={cn(
            "flex items-start gap-3 py-3.5",
            index > 0 && "border-t border-border/70",
          )}
        >
          <IconCheck
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 docs-accent"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-[15px] font-medium leading-6 text-foreground">
              {item.title}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface DocTableProps {
  columns: readonly string[];
  rows: readonly React.ReactNode[][];
  caption?: string;
}

/** Reference table (commands, flags, tokens, variants). Scrolls sideways rather
 *  than squeezing its columns on narrow screens. */
export function DocTable({ columns, rows, caption }: DocTableProps) {
  return (
    <Table density="compact" label={caption}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          // oxlint-disable-next-line react/no-array-index-key -- reference rows carry no id; they are static per page and reorder only with the source file, so position is the identity.
          <TableRow key={index}>
            {row.map((cell, cellIndex) => (
              // oxlint-disable-next-line react/no-array-index-key -- cells align to `columns` positionally, which is the whole contract of the table.
              <TableCell key={cellIndex} className="align-top">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Inline code inside table cells and prose. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[5px] border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-[12.5px] text-foreground">
      {children}
    </code>
  );
}

export function DocCallout({
  title,
  children,
  variant = "warning",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "warning" | "info";
}) {
  return (
    <Alert variant={variant} size="sm">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

/**
 * The option a segmented group settled on, narrowed to the page's own list.
 * Keeps pages from asserting the group's `string[]` back into their union.
 */
export function pickedValue<T extends string>(
  next: readonly string[],
  allowed: readonly T[],
): T | undefined {
  return allowed.find((option) => next.includes(option));
}

/** An accent inline link inside article prose, with a visible focus ring. */
export function GuideLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="docs-focus-ring rounded-[5px] font-semibold docs-accent underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  );
}

/** Two-up destination cards, used for "pick your path" blocks. */
export function DocPathCards({
  paths,
}: {
  paths: readonly {
    to: string;
    title: string;
    description: string;
    icon: React.ElementType;
  }[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {paths.map((path) => (
        <li key={path.to}>
          <Link
            to={path.to}
            className="docs-focus-ring group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-accent/40"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 docs-accent">
                <path.icon aria-hidden="true" className="h-[17px] w-[17px]" />
              </span>
              <span className="text-[15px] font-semibold text-card-foreground">
                {path.title}
              </span>
              <IconArrowRight
                aria-hidden="true"
                className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </span>
            <span className="text-sm leading-6 text-muted-foreground">
              {path.description}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
