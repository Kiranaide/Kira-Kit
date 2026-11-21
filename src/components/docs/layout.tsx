import * as React from "react";
import {
  IconAdjustmentsHorizontal,
  IconArrowsSort,
  IconBolt,
  IconCode,
  IconComponents,
  IconDeviceMobile,
  IconForms,
  IconKeyboard,
  IconMoon,
  IconPalette,
  IconSparkles,
  IconTextResize,
  IconUserCheck,
  IconWaveSine,
} from "@tabler/icons-react";
import { cn } from "cn";

/**
 * Reveal-on-scroll. Sections start translated and faded, and the observer flips
 * `data-revealed` once they cross into view; the transition itself lives in
 * kira-utilities.css so it stays off the main thread.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);

  const [revealed, setRevealed] = React.useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );

  React.useEffect(() => {
    const element = ref.current;

    if (!element || revealed || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [revealed]);

  return { ref, revealed };
}

interface RevealProps extends React.ComponentProps<"div"> {
  delay?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
  ...props
}: RevealProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-revealed={revealed ? "true" : undefined}
      className={cn("docs-reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-px w-full shrink-0 bg-border/70", className)}
    />
  );
}

interface DocsSectionProps {
  title: string;
  description?: React.ReactNode;
  /** Extra intro-column content: the API jump list, usage notes, mobile pickers. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  sticky?: boolean;
}

/**
 * The frame every docs section shares: a 232px intro column beside the content
 * on desktop, stacked above it on mobile.
 */
export function DocsSection({
  title,
  description,
  aside,
  children,
  className,
  contentClassName,
  sticky = false,
}: DocsSectionProps) {
  const { ref, revealed } = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      data-slot="docs-section"
      data-revealed={revealed ? "true" : undefined}
      className={cn(
        "docs-reveal flex flex-col gap-3.5 lg:flex-row lg:gap-8",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1.5 lg:w-[232px] lg:shrink-0 lg:gap-2",
          // top-20 clears the 56px page top bar that every page now carries.
          sticky && "lg:sticky lg:top-20 lg:self-start",
        )}
      >
        <h2 className="text-[23px] font-[650] leading-[1.23] tracking-[-0.55px] text-foreground lg:text-[26px]">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-[1.43] text-foreground/80">
            {description}
          </p>
        )}
        {aside}
      </div>
      <div className={cn("min-w-0 flex-1", contentClassName)}>{children}</div>
    </section>
  );
}

const featureIconRules: [
  RegExp,
  React.ComponentType<{ className?: string }>,
][] = [
  [/accessib|a11y|wcag|aria|screen.?reader/i, IconUserCheck],
  [/keyboard|shortcut/i, IconKeyboard],
  [/color|palette/i, IconPalette],
  [
    /them(e|ing)|token|customi|variant|style|appearance/i,
    IconAdjustmentsHorizontal,
  ],
  [/motion|animat|transition|spring/i, IconWaveSine],
  [/perform|optimi|lazy|virtual|bundle|fast|lightweight/i, IconBolt],
  [/respons|mobile|desktop|breakpoint/i, IconDeviceMobile],
  [/typograph|font|text/i, IconTextResize],
  [/form|input|validat|field/i, IconForms],
  [/drag|reorder|sort/i, IconArrowsSort],
  [/compos|slot|primitiv|headless|modular/i, IconComponents],
  [/dark|light/i, IconMoon],
  [/code|usage|api/i, IconCode],
];

/**
 * Feature rows are icon-led in the design, but page data only carries titles, so
 * the glyph is resolved from the title rather than duplicated across 79 pages.
 */
export function FeatureIcon({
  title,
  icon,
}: {
  title: string;
  icon?: React.ReactNode;
}) {
  const resolved = featureIconRules.find(([pattern]) =>
    pattern.test(title),
  )?.[1];

  const Glyph = resolved ?? IconSparkles;

  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-primary/10 docs-accent"
    >
      {icon ?? <Glyph className="h-[18px] w-[18px]" />}
    </span>
  );
}
