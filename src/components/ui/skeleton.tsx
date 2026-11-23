"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import {
  isFunctionProp,
  resolveComponentDefaults,
} from "@/lib/component-utils";

const skeletonVariants = cva("min-w-0 rounded-md bg-muted", {
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
      text: "h-4 w-full",
      shimmer: "relative overflow-hidden",
      wave: "",
    },
    animated: { true: "", false: "animate-none" },
  },
  compoundVariants: [
    {
      variant: ["default", "circle", "text"],
      animated: true,
      className: "motion-safe:animate-pulse",
    },
    {
      variant: "wave",
      animated: true,
      className: "motion-safe:animate-skeleton-wave",
    },
  ],
  defaultVariants: { variant: "default", animated: true },
});

interface SkeletonMotionProps {
  animated?: boolean;
  paused?: boolean;
  /** Milliseconds. Zero disables motion. */
  duration?: number;
  /** Milliseconds, shared by every bone unless overridden. */
  delay?: number;
}

interface SkeletonRootProps
  extends React.ComponentProps<"div">, SkeletonMotionProps {
  loading?: boolean;
  loadingLabel?: string;
  loadedLabel?: string;
  announce?: boolean;
}

interface SkeletonBoneProps
  extends React.ComponentProps<"div">, SkeletonMotionProps {
  variant?: VariantProps<typeof skeletonVariants>["variant"];
}

interface SkeletonLinesProps extends Omit<SkeletonBoneProps, "children"> {
  count?: number;
  gap?: "sm" | "md" | "lg";
  lastLineWidth?: "full" | "3/4" | "1/2" | "2/3";
}

interface SkeletonImageProps extends SkeletonBoneProps {
  aspectRatio?: string;
}

interface SkeletonButtonProps extends SkeletonBoneProps {
  size?: "xs" | "sm" | "default" | "lg" | "xl";
}

interface SkeletonAvatarProps extends Omit<SkeletonBoneProps, "variant"> {
  size?: "sm" | "md" | "lg" | "xl";
}

interface SkeletonTableRowProps extends SkeletonBoneProps {
  columns?: number;
}

const SkeletonContext = React.createContext({
  grouped: false,
  loading: true,
  animated: true,
  paused: false,
  duration: 2000,
  delay: 0,
});

/** One observer per group; standalone bones also stop when hidden or offscreen. */
function useSkeletonActivity(
  ref: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  React.useEffect(() => {
    const node = ref.current;

    if (!node || !enabled) return;

    let visible = typeof IntersectionObserver === "undefined";

    const update = () =>
      node.style.setProperty(
        "--skeleton-play-state",
        visible && !document.hidden ? "running" : "paused",
      );

    const observer =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            update();
          });

    observer?.observe(node);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
      node.style.setProperty("--skeleton-play-state", "paused");
    };
  }, [enabled, ref]);
}

function finiteTime(value: number, fallback: number) {
  return Number.isFinite(value) ? Math.max(0, value) : fallback;
}

function skeletonCount(value: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.max(0, Math.min(100, Math.floor(value)))
    : fallback;
}

function SkeletonRoot(input: SkeletonRootProps) {
  const {
    loading,
    animated,
    paused,
    duration,
    delay,
    loadingLabel,
    loadedLabel,
    announce,
    "aria-label": ariaLabel,
    "aria-live": ariaLive,
    className,
    children,
    style,
    ref,
    ...props
  } = resolveComponentDefaults(input, SKELETON_ROOT_DEFAULTS_1);

  const localRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const parent = React.useContext(SkeletonContext);
  const motion = loading && animated && !paused && !reduced && duration > 0;
  useSkeletonActivity(localRef, motion && !parent.grouped);

  const context = {
    grouped: true,
    loading,
    animated: animated && parent.animated,
    paused: paused || parent.paused,
    duration: finiteTime(duration, 2000),
    delay: finiteTime(delay, 0),
  };

  return (
    <RenderSkeletonRootSectionPart1
      {...{
        context,
        props,
        localRef,
        ref,
        loading,
        ariaLabel,
        className,
        motion,
        parent,
        style,
        children,
        announce,
        ariaLive,
        loadingLabel,
        loadedLabel,
      }}
    />
  );
}

function SkeletonBone({
  className,
  variant = "default",
  animated,
  paused,
  delay,
  duration,
  style,
  ref,
  children,
  ...props
}: SkeletonBoneProps) {
  const group = React.useContext(SkeletonContext);
  const reduced = useReducedMotion();
  const localRef = React.useRef<HTMLDivElement>(null);
  const effectiveDuration = finiteTime(duration ?? group.duration, 2000);

  const enabled = isSkeletonMotionEnabled({
    group,
    animated,
    reduced,
    duration: effectiveDuration,
  });

  const stopped = group.paused || paused === true;
  useSkeletonActivity(localRef, enabled && !stopped && !group.grouped);

  const animationStyle: React.CSSProperties = {
    animationDelay: `${finiteTime(delay ?? group.delay, 0)}ms`,
    animationDuration: `${effectiveDuration}ms`,
    animationPlayState: stopped
      ? "paused"
      : "var(--skeleton-play-state, paused)",
  };

  return (
    <RenderSkeletonBonePart2
      {...{
        props,
        localRef,
        ref,
        variant,
        enabled,
        className,
        animationStyle,
        style,
        children,
      }}
    />
  );
}

function isSkeletonMotionEnabled({
  group,
  animated,
  reduced,
  duration,
}: {
  group: React.ContextType<typeof SkeletonContext>;
  animated: SkeletonBoneProps["animated"];
  reduced: boolean;
  duration: number;
}) {
  return (
    group.loading &&
    group.animated &&
    animated !== false &&
    !reduced &&
    duration > 0
  );
}

function Skeleton({ ...props }: SkeletonBoneProps) {
  return <SkeletonBone data-slot="skeleton" {...props} />;
}

function SkeletonText({ className, ...props }: SkeletonBoneProps) {
  return (
    <SkeletonBone
      data-slot="skeleton-text"
      variant="text"
      className={cn("h-4", className)}
      {...props}
    />
  );
}

function SkeletonHeading({ className, ...props }: SkeletonBoneProps) {
  return (
    <SkeletonBone
      data-slot="skeleton-heading"
      variant="text"
      className={cn("h-6 w-3/4", className)}
      {...props}
    />
  );
}

function SkeletonButton({
  size = "default",
  className,
  ...props
}: SkeletonButtonProps) {
  const sizes = {
    xs: "h-7",
    sm: "h-8",
    default: "h-9",
    lg: "h-10",
    xl: "h-11",
  };

  return (
    <SkeletonBone
      data-slot="skeleton-button"
      className={cn(sizes[size], "w-24", className)}
      {...props}
    />
  );
}

function SkeletonAvatar({
  size = "md",
  className,
  ...props
}: SkeletonAvatarProps) {
  const sizes = { sm: "size-8", md: "size-10", lg: "size-12", xl: "size-16" };

  return (
    <SkeletonBone
      data-slot="skeleton-avatar"
      variant="circle"
      className={cn("shrink-0", sizes[size], className)}
      {...props}
    />
  );
}

function SkeletonImage({
  aspectRatio = "16/9",
  className,
  style,
  ...props
}: SkeletonImageProps) {
  return (
    <SkeletonBone
      data-slot="skeleton-image"
      className={cn("w-full", className)}
      style={{ aspectRatio, ...style }}
      {...props}
    />
  );
}

/** Container attributes stay on the container; motion options reach its bones. */
function SkeletonLines(inputProps: SkeletonLinesProps) {
  const {
    count,
    gap,
    lastLineWidth,
    className,
    variant,
    animated,
    paused,
    duration,
    delay,
    ...props
  } = resolveComponentDefaults(inputProps, {
    count: 3,
    gap: "md",
    lastLineWidth: "3/4",
  });

  const gaps = { sm: "space-y-1.5", md: "space-y-2", lg: "space-y-3" };

  const widths = {
    full: "w-full",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "1/2": "w-1/2",
  };

  const length = skeletonCount(count, 3);

  return (
    <div
      data-slot="skeleton-lines"
      {...props}
      aria-hidden="true"
      inert
      className={cn("min-w-0", gaps[gap], className)}
    >
      {Array.from({ length }, (_, index) => (
        <SkeletonText
          key={index}
          variant={variant}
          animated={animated}
          paused={paused}
          duration={duration}
          delay={delay}
          className={index === length - 1 ? widths[lastLineWidth] : undefined}
        />
      ))}
    </div>
  );
}

function SkeletonCard({
  className,
  variant,
  animated,
  paused,
  duration,
  delay,
  children,
  ...props
}: SkeletonBoneProps) {
  const motion = { variant, animated, paused, duration, delay };

  return (
    <div
      data-slot="skeleton-card"
      {...props}
      aria-hidden="true"
      inert
      className={cn("min-w-0 space-y-3", className)}
    >
      <SkeletonImage {...motion} />
      <SkeletonHeading {...motion} />
      <SkeletonLines count={2} lastLineWidth="1/2" {...motion} />
      {children}
    </div>
  );
}

function SkeletonTableRow({
  columns = 4,
  className,
  variant,
  animated,
  paused,
  duration,
  delay,
  children,
  ...props
}: SkeletonTableRowProps) {
  return (
    <div
      data-slot="skeleton-table-row"
      {...props}
      aria-hidden="true"
      inert
      className={cn("flex min-w-0 gap-4", className)}
    >
      {Array.from({ length: skeletonCount(columns, 4) }, (_, index) => (
        <SkeletonBone
          key={index}
          className="h-4 flex-1"
          variant={variant}
          animated={animated}
          paused={paused}
          duration={duration}
          delay={delay}
        />
      ))}
      {children}
    </div>
  );
}

function SkeletonListItem({
  className,
  variant,
  animated,
  paused,
  duration,
  delay,
  children,
  ...props
}: SkeletonBoneProps) {
  const motion = { animated, paused, duration, delay };

  return (
    <div
      data-slot="skeleton-list-item"
      {...props}
      aria-hidden="true"
      inert
      className={cn("flex min-w-0 items-center gap-3", className)}
    >
      <SkeletonAvatar size="sm" {...motion} />
      <div
        data-slot="skeleton-list-content"
        className="min-w-0 flex-1 space-y-2"
      >
        <SkeletonBone className="h-4 w-3/4" variant={variant} {...motion} />
        <SkeletonBone className="h-3 w-1/2" variant={variant} {...motion} />
      </div>
      {children}
    </div>
  );
}

interface KiraSkeletonProps extends Omit<
  SkeletonRootProps,
  "children" | "loading"
> {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preset?: "text" | "card" | "list" | "table";
  count?: number;
  delayMs?: number;
  minDurationMs?: number;
  retainContent?: boolean;
  minHeight?: React.CSSProperties["minHeight"];
}

type SkeletonPhase =
  { kind: "waiting" } | { kind: "visible"; since: number } | { kind: "ready" };

function useSkeletonPhase(
  loading: boolean,
  delayMs: number,
  minDurationMs: number,
) {
  const [previousLoading, setPreviousLoading] = React.useState(loading);

  const [phase, setPhase] = React.useState<SkeletonPhase>(() => ({
    kind: loading ? "waiting" : "ready",
  }));

  if (previousLoading !== loading) {
    setPreviousLoading(loading);

    if (loading && phase.kind === "ready") setPhase({ kind: "waiting" });

    if (!loading && phase.kind === "waiting") setPhase({ kind: "ready" });
  }

  React.useEffect(() => {
    if (loading && phase.kind === "waiting") {
      const timer = setTimeout(
        () => setPhase({ kind: "visible", since: performance.now() }),
        finiteTime(delayMs, 150),
      );

      return () => clearTimeout(timer);
    }

    if (!loading && phase.kind === "visible") {
      const remaining = Math.max(
        0,
        finiteTime(minDurationMs, 0) - (performance.now() - phase.since),
      );

      const timer = setTimeout(() => setPhase({ kind: "ready" }), remaining);

      return () => clearTimeout(timer);
    }
  }, [loading, phase, delayMs, minDurationMs]);

  return phase;
}

function KiraSkeleton(input: KiraSkeletonProps) {
  const {
    loading,
    children,
    fallback,
    preset,
    count,
    delayMs,
    minDurationMs,
    retainContent,
    minHeight,
    style,
    loadingLabel,
    loadedLabel,
    ...props
  } = resolveComponentDefaults(input, KIRA_SKELETON_DEFAULTS_2);

  const phase = useSkeletonPhase(loading, delayMs, minDurationMs);
  const [revealed, setRevealed] = React.useState(!loading);

  if (phase.kind === "ready" && !revealed) setRevealed(true);
  const retaining = revealed && retainContent;
  const masking = !retaining && phase.kind !== "ready";
  const pending = loading || masking;

  const buildFallback = () => {
    if (fallback !== undefined) return fallback;

    if (preset === "card") return <SkeletonCard />;

    if (preset === "text") return <SkeletonLines count={count} />;

    return (
      <div data-slot="kira-skeleton-rows" className="space-y-4">
        {Array.from({ length: skeletonCount(count, 3) }, (_, index) =>
          preset === "list" ? (
            <SkeletonListItem key={index} />
          ) : (
            <SkeletonTableRow key={index} />
          ),
        )}
      </div>
    );
  };

  const buildContent = () =>
    renderBuildContentSectionPart3({
      masking,
      phase,
      buildFallback,
      revealed,
      children,
    });

  return (
    <SkeletonRoot
      {...props}
      data-slot="kira-skeleton"
      data-state={resolveKiraSkeletonChoice1({ masking, phase, loading })}
      loading={pending}
      loadingLabel={retaining && loading ? "Refreshing content" : loadingLabel}
      loadedLabel={loadedLabel}
      style={{ minHeight, ...style }}
    >
      {buildContent()}
    </SkeletonRoot>
  );
}

const SkeletonGroup = Object.assign(SkeletonRoot, {
  Root: SkeletonRoot,
  Bone: SkeletonBone,
  Text: SkeletonText,
  Lines: SkeletonLines,
  Heading: SkeletonHeading,
  Avatar: SkeletonAvatar,
  Button: SkeletonButton,
  Image: SkeletonImage,
  Card: SkeletonCard,
  TableRow: SkeletonTableRow,
  ListItem: SkeletonListItem,
});

export {
  Skeleton,
  SkeletonGroup,
  SkeletonRoot,
  SkeletonBone,
  SkeletonText,
  SkeletonLines,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonListItem,
  KiraSkeleton,
  skeletonVariants,
};

export type {
  SkeletonRootProps,
  SkeletonBoneProps,
  SkeletonMotionProps,
  SkeletonLinesProps,
  SkeletonImageProps,
  SkeletonButtonProps,
  SkeletonAvatarProps,
  SkeletonTableRowProps,
  KiraSkeletonProps,
};

type resolveKiraSkeletonChoice1Args = {
  masking: boolean;
  phase: ReturnType<typeof useSkeletonPhase>;
  loading: KiraSkeletonProps["loading"];
};

function resolveKiraSkeletonChoice1({
  masking,
  phase,
  loading,
}: resolveKiraSkeletonChoice1Args) {
  if (masking) {
    return phase.kind;
  }

  if (loading) {
    return "refreshing";
  }

  return "ready";
}

type renderSkeletonRootSectionPart1Args = {
  context: {
    grouped: boolean;
    loading: boolean;
    animated: boolean;
    paused: boolean;
    duration: number;
    delay: number;
  };
  props: Omit<
    SkeletonRootProps,
    | "loading"
    | "animated"
    | "paused"
    | "duration"
    | "delay"
    | "loadingLabel"
    | "loadedLabel"
    | "announce"
    | "aria-label"
    | "aria-live"
    | "className"
    | "children"
    | "style"
    | "ref"
  >;
  localRef: React.RefObject<HTMLDivElement | null>;
  ref: SkeletonRootProps["ref"];
  loading: boolean;
  ariaLabel: SkeletonRootProps["aria-label"];
  className: SkeletonRootProps["className"];
  motion: boolean;
  parent: {
    grouped: boolean;
    loading: boolean;
    animated: boolean;
    paused: boolean;
    duration: number;
    delay: number;
  };
  style: SkeletonRootProps["style"];
  children: SkeletonRootProps["children"];
  announce: boolean;
  ariaLive: "off" | "assertive" | "polite";
  loadingLabel: SkeletonRootProps["loadingLabel"];
  loadedLabel: string;
};

function RenderSkeletonRootSectionPart1({
  context,
  props,
  localRef,
  ref,
  loading,
  ariaLabel,
  className,
  motion,
  parent,
  style,
  children,
  announce,
  ariaLive,
  loadingLabel,
  loadedLabel,
}: renderSkeletonRootSectionPart1Args) {
  return (
    <SkeletonContext.Provider value={context}>
      <div
        data-slot="skeleton-root"
        {...props}
        ref={(node) => {
          localRef.current = node;

          if (isFunctionProp(ref)) return ref(node);

          if (ref) ref.current = node;
        }}
        data-loading={loading || undefined}
        aria-busy={loading}
        aria-label={ariaLabel}
        className={cn("relative min-w-0", className)}
        style={Object.assign(
          {
            "--skeleton-play-state":
              motion && parent.grouped ? "inherit" : "paused",
          },
          style,
        )}
      >
        {children}
      </div>
      {announce && !parent.grouped && (
        <div
          data-slot="skeleton-status"
          role={ariaLive === "off" ? undefined : "status"}
          aria-live={ariaLive}
          aria-atomic="true"
          className="sr-only"
        >
          {loading
            ? (loadingLabel ?? ariaLabel ?? "Loading content")
            : loadedLabel}
        </div>
      )}
    </SkeletonContext.Provider>
  );
}

type renderSkeletonBonePart2Args = {
  props: Omit<
    SkeletonBoneProps,
    | "className"
    | "variant"
    | "animated"
    | "paused"
    | "delay"
    | "duration"
    | "style"
    | "ref"
    | "children"
  >;
  localRef: React.RefObject<HTMLDivElement | null>;
  ref: SkeletonBoneProps["ref"];
  variant: Exclude<SkeletonBoneProps["variant"], undefined>;
  enabled: boolean;
  className: SkeletonBoneProps["className"];
  animationStyle: React.CSSProperties;
  style: SkeletonBoneProps["style"];
  children: SkeletonBoneProps["children"];
};

function RenderSkeletonBonePart2({
  props,
  localRef,
  ref,
  variant,
  enabled,
  className,
  animationStyle,
  style,
  children,
}: renderSkeletonBonePart2Args) {
  return (
    <div
      data-slot="skeleton-bone"
      {...props}
      ref={(node) => {
        localRef.current = node;

        if (isFunctionProp(ref)) return ref(node);

        if (ref) ref.current = node;
      }}
      aria-hidden="true"
      inert
      className={cn(
        skeletonVariants({ variant, animated: enabled }),
        className,
      )}
      style={{ ...animationStyle, ...style }}
    >
      {children}
      {variant === "shimmer" && enabled && (
        <span
          data-slot="skeleton-shimmer"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-foreground/10 to-transparent motion-safe:animate-shimmer motion-reduce:hidden"
          style={animationStyle}
        />
      )}
    </div>
  );
}

type renderBuildContentSectionPart3Args = {
  masking: boolean;
  phase: ReturnType<typeof useSkeletonPhase>;
  buildFallback: () => React.ReactNode;
  revealed: boolean;
  children: KiraSkeletonProps["children"];
};

function renderBuildContentSectionPart3({
  masking,
  phase,
  buildFallback,
  revealed,
  children,
}: renderBuildContentSectionPart3Args) {
  return (
    <>
      <div
        data-slot="kira-skeleton-fallback"
        hidden={!masking}
        aria-hidden="true"
        inert
        style={{ visibility: phase.kind === "waiting" ? "hidden" : undefined }}
      >
        {buildFallback()}
      </div>
      <div
        data-slot="kira-skeleton-content"
        hidden={masking}
        inert={masking || undefined}
      >
        {revealed ? children : null}
      </div>
    </>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const SKELETON_ROOT_DEFAULTS_1 = {
  loading: true,
  animated: true,
  paused: false,
  duration: 2000,
  delay: 0,
  loadedLabel: "Content loaded",
  announce: true,
  "aria-live": "polite",
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const KIRA_SKELETON_DEFAULTS_2 = {
  preset: "text",
  count: 3,
  delayMs: 150,
  minDurationMs: 0,
  retainContent: true,
  loadingLabel: "Loading content",
  loadedLabel: "Content loaded",
} as const;
