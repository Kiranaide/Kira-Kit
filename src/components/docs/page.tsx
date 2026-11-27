import * as React from "react";
import { cn } from "cn";
import { DocsSection } from "@/components/docs/layout";
import { APIReference } from "@/components/docs/api-reference";
import { Changelog } from "@/components/docs/changelog";
import { DemoTabs } from "@/components/docs/playground";
import { FeatureGrid } from "@/components/docs/features";
import { KeyboardShortcuts } from "@/components/docs/shortcuts";
import { UsageBlock } from "@/components/docs/usage";
import { PageTopBar } from "@/components/site/site-chrome";

interface PageHeaderProps {
  title: string;
  description: string;
  version?: string;
  badge?: React.ReactNode;
  className?: string;
}

/** Pages spell versions four different ways; the pill always reads `v2.1.2`. */
function versionLabel(version: string) {
  return `v${version.replace(/^v/i, "")}`;
}

export function PageHeader({
  title,
  description,
  version,
  badge,
}: PageHeaderProps) {
  return (
    <div data-slot="page-header" className="flex flex-col gap-2 lg:gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[34px] leading-[1.12] font-bold tracking-[-1px] text-foreground lg:text-[42px] lg:leading-[1.14] lg:tracking-[-1.4px]">
          {title}
        </h1>
        {version && (
          <span className="docs-accent-fill flex h-6 items-center rounded-[12px] px-[11px] py-px text-xs font-medium text-background">
            {versionLabel(version)}
          </span>
        )}
        {badge}
      </div>
      <p className="max-w-[680px] text-sm leading-[1.5] text-muted-foreground lg:text-base">
        {description}
      </p>
    </div>
  );
}

interface SectionProps {
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  aside?: React.ReactNode;
}

/** Docs-guide block: same two-column frame as the component sections. */
export function Section({
  title,
  description,
  children,
  className,
  aside,
}: SectionProps) {
  if (!title) {
    return (
      <section
        data-slot="docs-plain-section"
        className={cn("min-w-0", className)}
      >
        {children}
      </section>
    );
  }

  return (
    <DocsSection
      title={title}
      description={description}
      aside={aside}
      className={className}
    >
      {children}
    </DocsSection>
  );
}

interface ComponentPageProps {
  children: React.ReactNode;
  className?: string;
}

type Flow =
  | "playground"
  | "features"
  | "shortcuts"
  | "usage"
  | "api"
  | "changelog"
  | "extra";

const sectionFlow: [unknown, Flow][] = [
  [DemoTabs, "playground"],
  [FeatureGrid, "features"],
  [KeyboardShortcuts, "shortcuts"],
  [UsageBlock, "usage"],
  [APIReference, "api"],
  [Changelog, "changelog"],
];

function DeferredSection({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = React.useState(
    () =>
      typeof window !== "undefined" &&
      (!("IntersectionObserver" in window) || window.location.hash.length > 1),
  );

  React.useEffect(() => {
    const element = ref.current;

    if (!element || mounted || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          React.startTransition(() => setMounted(true));
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div ref={ref} className="docs-deferred-section">
      {mounted ? children : <div aria-hidden="true" className="min-h-80" />}
    </div>
  );
}

/**
 * Pages list their sections in whatever order they were written; the frame owns
 * the reading order from the design — playground, page-specific content,
 * features, keys, usage, API, changelog — so the 79 pages never have to agree.
 * It also carries the sticky top bar, so every menu destination opens the same.
 */
export function ComponentPage({ children, className }: ComponentPageProps) {
  const flow: Record<Flow, React.ReactNode[]> = {
    playground: [],
    features: [],
    shortcuts: [],
    usage: [],
    api: [],
    changelog: [],
    extra: [],
  };

  let header: React.ReactNode = null;
  let crumb: string | null = null;
  let placed = 0;

  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement<PageHeaderProps>(child) &&
      !header &&
      child.type === PageHeader
    ) {
      header = child;
      crumb = child.props.title;

      return;
    }

    const bucket = React.isValidElement(child)
      ? sectionFlow.find(([type]) => type === child.type)?.[1]
      : undefined;

    placed += 1;
    flow[bucket ?? "extra"].push(
      React.isValidElement(child)
        ? // The frame reorders sections, so the elements need keys of their own.
          React.cloneElement(child, { key: `docs-${placed}` })
        : child,
    );
  });

  return (
    <div
      data-slot="component-page"
      className={cn("min-h-full bg-background", className)}
    >
      {crumb && <PageTopBar crumb={crumb} />}

      <div className="px-4 pt-6 pb-8 lg:px-8 lg:py-8">
        <div className="mx-auto flex w-full max-w-[1152px] flex-col gap-8 lg:gap-10">
          <div
            data-slot="playground-showcase"
            className="flex min-w-0 flex-col gap-5 lg:gap-7"
          >
            {header}
            {flow.playground}
          </div>

          {flow.extra}
          {flow.features.length > 0 && (
            <DeferredSection>{flow.features}</DeferredSection>
          )}
          {flow.shortcuts.length > 0 && (
            <DeferredSection>{flow.shortcuts}</DeferredSection>
          )}
          {flow.usage.length > 0 && (
            <DeferredSection>{flow.usage}</DeferredSection>
          )}
          {flow.api.length > 0 && <DeferredSection>{flow.api}</DeferredSection>}
          {flow.changelog.length > 0 && (
            <DeferredSection>{flow.changelog}</DeferredSection>
          )}
        </div>
      </div>
    </div>
  );
}
