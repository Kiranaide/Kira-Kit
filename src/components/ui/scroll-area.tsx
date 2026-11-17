"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cva, type VariantProps } from "class-variance-authority";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isCallbackProp } from "@/lib/component-prop-guards";

type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

type ScrollbarSize = "thin" | "default" | "thick";

type ScrollbarVisibility = "always" | "hover";

interface ScrollAreaContextValue {
  orientation: ScrollAreaOrientation;
  scrollbarSize: ScrollbarSize;
  scrollbarVisibility: ScrollbarVisibility;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue>({
  orientation: "vertical",
  scrollbarSize: "default",
  scrollbarVisibility: "always",
});

function partClassName<S>(
  base: string,
  className?: string | ((state: S) => string | undefined),
) {
  return isCallbackProp(className)
    ? (state: S) => cn(base, className(state))
    : cn(base, className);
}

function partStyle<S>(
  base: React.CSSProperties,
  style?: React.CSSProperties | ((state: S) => React.CSSProperties | undefined),
) {
  return isCallbackProp(style)
    ? (state: S) => ({ ...base, ...style(state) })
    : { ...base, ...style };
}

const scrollAreaVariants = cva(
  "group/scroll-area relative size-full min-h-0 min-w-0",
);

const scrollBarVariants = cva(
  "flex touch-none select-none p-0.5 data-[orientation=horizontal]:flex-col",
  {
    variants: {
      scrollbarSize: {
        thin: "data-[orientation=vertical]:w-2 data-[orientation=horizontal]:h-2",
        default:
          "data-[orientation=vertical]:w-3 data-[orientation=horizontal]:h-3",
        thick:
          "data-[orientation=vertical]:w-4 data-[orientation=horizontal]:h-4",
      },
    },
    defaultVariants: { scrollbarSize: "default" },
  },
);

interface ScrollAreaRootProps extends ScrollAreaPrimitive.Root.Props {
  orientation?: ScrollAreaOrientation;
  scrollbarSize?: ScrollbarSize;
  scrollbarVisibility?: ScrollbarVisibility;
  scrollShadows?: boolean;
}

function ScrollAreaRoot(input: ScrollAreaRootProps) {
  const {
    orientation,
    scrollbarSize,
    scrollbarVisibility,
    scrollShadows,
    className,
    children,
    ...props
  } = resolveComponentDefaults(input, SCROLL_AREA_ROOT_DEFAULTS_1);

  return (
    <ScrollAreaContext.Provider
      value={{ orientation, scrollbarSize, scrollbarVisibility }}
    >
      <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        data-orientation={orientation}
        className={partClassName(scrollAreaVariants(), className)}
        {...props}
      >
        {children}
        {scrollShadows && <ScrollAreaOverflow />}
      </ScrollAreaPrimitive.Root>
    </ScrollAreaContext.Provider>
  );
}

type ScrollAreaViewportProps = ScrollAreaPrimitive.Viewport.Props;

function ScrollAreaViewport({
  className,
  style,
  ...props
}: ScrollAreaViewportProps) {
  const { orientation } = React.useContext(ScrollAreaContext);

  return (
    <ScrollAreaPrimitive.Viewport
      data-slot="scroll-area-viewport"
      className={partClassName(
        "size-full min-h-0 min-w-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        className,
      )}
      style={partStyle(
        {
          overflowX: orientation === "vertical" ? "hidden" : "auto",
          overflowY: orientation === "horizontal" ? "hidden" : "auto",
        },
        style,
      )}
      {...props}
    />
  );
}

type ScrollAreaContentProps = ScrollAreaPrimitive.Content.Props;

function ScrollAreaContent({
  className,
  style,
  ...props
}: ScrollAreaContentProps) {
  const { orientation } = React.useContext(ScrollAreaContext);

  return (
    <ScrollAreaPrimitive.Content
      data-slot="scroll-area-content"
      className={partClassName("min-h-full", className)}
      style={partStyle(
        { minWidth: orientation === "vertical" ? 0 : "fit-content" },
        style,
      )}
      {...props}
    />
  );
}

type ScrollAreaThumbProps = ScrollAreaPrimitive.Thumb.Props;

function ScrollAreaThumb({ className, ...props }: ScrollAreaThumbProps) {
  const reduced = useReducedMotion();

  return (
    <ScrollAreaPrimitive.Thumb
      data-slot="scroll-area-thumb"
      className={partClassName(
        cn(
          "relative flex-1 rounded-full bg-border hover:bg-muted-foreground/60 active:bg-muted-foreground data-[orientation=vertical]:min-h-6 data-[orientation=horizontal]:min-w-6",
          !reduced && "transition-colors duration-150",
        ),
        className,
      )}
      {...props}
    />
  );
}

interface ScrollBarProps
  extends
    ScrollAreaPrimitive.Scrollbar.Props,
    VariantProps<typeof scrollBarVariants> {}

function ScrollBar({
  orientation = "vertical",
  scrollbarSize,
  className,
  children,
  ...props
}: ScrollBarProps) {
  const context = React.useContext(ScrollAreaContext);
  const reduced = useReducedMotion();

  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={partClassName(
        cn(
          scrollBarVariants({
            scrollbarSize: scrollbarSize ?? context.scrollbarSize,
          }),
          context.scrollbarVisibility === "hover" &&
            "opacity-0 data-hovering:opacity-100 data-scrolling:opacity-100 group-focus-within/scroll-area:opacity-100",
          !reduced && "transition-opacity duration-150",
        ),
        className,
      )}
      {...props}
    >
      {children ?? <ScrollAreaThumb />}
    </ScrollAreaPrimitive.Scrollbar>
  );
}

type ScrollAreaCornerProps = ScrollAreaPrimitive.Corner.Props;

function ScrollAreaCorner({ className, ...props }: ScrollAreaCornerProps) {
  return (
    <ScrollAreaPrimitive.Corner
      data-slot="scroll-area-corner"
      className={partClassName("bg-background", className)}
      {...props}
    />
  );
}

interface ScrollAreaProps extends ScrollAreaRootProps {
  viewportRef?: React.Ref<HTMLDivElement>;
  viewportProps?: Omit<ScrollAreaViewportProps, "children" | "ref">;
  contentProps?: ScrollAreaContentProps;
}

function ScrollArea({
  orientation = "vertical",
  children,
  viewportRef,
  viewportProps,
  contentProps,
  onScroll,
  onScrollCapture,
  tabIndex,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaRoot orientation={orientation} {...props}>
      <ScrollAreaViewport
        ref={viewportRef}
        onScroll={onScroll}
        onScrollCapture={onScrollCapture}
        {...(tabIndex === undefined ? {} : { tabIndex })}
        role={role ?? (ariaLabel || ariaLabelledBy ? "region" : undefined)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...viewportProps}
      >
        <ScrollAreaContent {...contentProps}>{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      {orientation !== "horizontal" && <ScrollBar />}
      {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
      {orientation === "both" && <ScrollAreaCorner />}
    </ScrollAreaRoot>
  );
}

// Compatibility name; both use the same primitive composition.
const SimpleScrollArea = ScrollArea;

function ScrollAreaOverflow() {
  const { orientation } = React.useContext(ScrollAreaContext);

  return (
    <div
      data-slot="scroll-area-overflow"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
    >
      {orientation !== "horizontal" && (
        <>
          <div
            data-slot="scroll-area-overflow-top"
            className="absolute inset-x-0 top-0 h-4 bg-linear-to-b from-background to-transparent opacity-0 group-data-[overflow-y-start]/scroll-area:opacity-100"
          />
          <div
            data-slot="scroll-area-overflow-bottom"
            className="absolute inset-x-0 bottom-0 h-4 bg-linear-to-t from-background to-transparent opacity-0 group-data-[overflow-y-end]/scroll-area:opacity-100"
          />
        </>
      )}
      {orientation !== "vertical" && (
        <>
          <div
            data-slot="scroll-area-overflow-start"
            className="absolute inset-y-0 start-0 w-4 bg-linear-to-r from-background to-transparent opacity-0 group-data-[overflow-x-start]/scroll-area:opacity-100 rtl:bg-linear-to-l"
          />
          <div
            data-slot="scroll-area-overflow-end"
            className="absolute inset-y-0 end-0 w-4 bg-linear-to-l from-background to-transparent opacity-0 group-data-[overflow-x-end]/scroll-area:opacity-100 rtl:bg-linear-to-r"
          />
        </>
      )}
    </div>
  );
}

function useJoinedRefs<T>(
  first: React.Ref<T> | undefined,
  second: React.Ref<T> | undefined,
): React.RefCallback<T> {
  return React.useCallback(
    (node) => {
      const assign = (ref: React.Ref<T> | undefined, value: T | null) => {
        if (isCallbackProp(ref)) return ref(value);

        if (ref) ref.current = value;
      };

      const cleanFirst = assign(first, node);
      const cleanSecond = assign(second, node);

      return () => {
        if (isCallbackProp(cleanFirst)) cleanFirst();
        else assign(first, null);

        if (isCallbackProp(cleanSecond)) cleanSecond();
        else assign(second, null);
      };
    },
    [first, second],
  );
}

function useScrollFollower(
  enabled: boolean,
  contentVersion: string | number | undefined,
  onFollowingChange?: (following: boolean) => void,
) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const followingRef = React.useRef(true);
  const notifyContentRef = React.useRef<(() => void) | null>(null);
  const [following, setFollowing] = React.useState(true);
  const [unseen, setUnseen] = React.useState(false);
  const followingChangeRef = React.useRef(onFollowingChange);
  React.useLayoutEffect(() => {
    followingChangeRef.current = onFollowingChange;
  }, [onFollowingChange]);

  const changeFollowing = React.useCallback((next: boolean) => {
    if (next) setUnseen(false);

    if (followingRef.current === next) return;
    followingRef.current = next;
    setFollowing(next);
    followingChangeRef.current?.(next);
  }, []);

  React.useEffect(() => {
    return subscribeScrollFollower({
      viewportRef,
      contentRef,
      enabled,
      followingRef,
      setUnseen,
      notifyContentRef,
      changeFollowing,
    });
  }, [enabled, changeFollowing]);

  React.useEffect(() => {
    if (enabled) notifyContentRef.current?.();
  }, [enabled, contentVersion]);

  const jumpToLatest = () => {
    changeFollowing(true);
    const viewport = viewportRef.current;

    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  };

  return { viewportRef, contentRef, following, unseen, jumpToLatest };
}

interface KiraScrollAreaProps extends Omit<
  ScrollAreaProps,
  "orientation" | "className"
> {
  className?: string;
  followOutput?: boolean;
  /** Change this when content changes without changing its height. */
  contentVersion?: string | number;
  onFollowingChange?: (following: boolean) => void;
}

function KiraScrollArea({
  followOutput = false,
  contentVersion,
  onFollowingChange,
  children,
  className,
  viewportRef,
  viewportProps,
  contentProps,
  ...props
}: KiraScrollAreaProps) {
  const follower = useScrollFollower(
    followOutput,
    contentVersion,
    onFollowingChange,
  );

  const joinedViewportRef = useJoinedRefs(follower.viewportRef, viewportRef);

  const joinedContentRef = useJoinedRefs(
    follower.contentRef,
    contentProps?.ref,
  );

  const buildContent = () => (
    <ScrollArea
      {...props}
      viewportRef={joinedViewportRef}
      viewportProps={viewportProps}
      contentProps={{ ...contentProps, ref: joinedContentRef }}
    >
      {children}
    </ScrollArea>
  );

  const buildFollowControls = () =>
    followOutput && (
      <div
        data-slot="scroll-area-follow-controls"
        className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-3 py-2"
      >
        <output
          data-slot="scroll-area-follow-status"

          className="text-xs text-muted-foreground"
        >
          {resolvebuildFollowControlsChoice1({ follower })}
        </output>
        <Button
          size="sm"
          variant="outline"
          disabled={follower.following}
          onClick={follower.jumpToLatest}
        >
          Jump to latest
        </Button>
      </div>
    );

  return (
    <div
      data-slot="kira-scroll-area"
      className={cn(
        "flex size-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border",
        className,
      )}
    >
      <div data-slot="scroll-area-body" className="min-h-0 flex-1">
        {buildContent()}
      </div>
      {buildFollowControls()}
    </div>
  );
}

export {
  ScrollArea,
  SimpleScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollBar,
  ScrollAreaThumb,
  ScrollAreaCorner,
  KiraScrollArea,
  ScrollAreaOverflow,
  scrollAreaVariants,
  scrollBarVariants,
};

export type {
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaContentProps,
  ScrollBarProps,
  ScrollAreaThumbProps,
  ScrollAreaCornerProps,
  KiraScrollAreaProps,
  ScrollAreaOrientation,
  ScrollbarSize,
  ScrollbarVisibility,
};

type resolvebuildFollowControlsChoice1Args = {
  follower: ReturnType<typeof useScrollFollower>;
};

function resolvebuildFollowControlsChoice1({
  follower,
}: resolvebuildFollowControlsChoice1Args) {
  if (follower.following) {
    return "Following latest activity";
  }

  if (follower.unseen) {
    return "New activity below";
  }

  return "Reading earlier activity";
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const SCROLL_AREA_ROOT_DEFAULTS_1 = {
  orientation: "vertical",
  scrollbarSize: "default",
  scrollbarVisibility: "always",
  scrollShadows: false,
} as const;

type subscribeScrollFollowerArgs = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  followingRef: React.RefObject<boolean>;
  setUnseen: React.Dispatch<React.SetStateAction<boolean>>;
  notifyContentRef: React.RefObject<(() => void) | null>;
  changeFollowing: (next: boolean) => void;
};

function subscribeScrollFollower({
  viewportRef,
  contentRef,
  enabled,
  followingRef,
  setUnseen,
  notifyContentRef,
  changeFollowing,
}: subscribeScrollFollowerArgs) {
  const viewport = viewportRef.current;
  const content = contentRef.current;

  if (!enabled || !viewport || !content) return;
  let measuredHeight = 0;
  let ready = false;
  let frame = 0;
  let notified = false;

  const measure = () => {
    frame = 0;

    if (!viewport.clientHeight) return;
    const height = viewport.scrollHeight;
    const changed = notified || (ready && height !== measuredHeight);
    notified = false;
    measuredHeight = height;
    ready = true;

    if (followingRef.current) viewport.scrollTop = height;
    else if (changed) setUnseen(true);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };

  notifyContentRef.current = () => {
    notified = true;
    schedule();
  };

  const observer = new ResizeObserver(schedule);
  observer.observe(viewport);
  observer.observe(content);

  const onScroll = () => {
    if (!ready) return;

    const atEnd =
      viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <= 2;

    if (atEnd) changeFollowing(true);
    // A growing document must not turn a previously pinned reader into a
    // history reader before ResizeObserver has had a chance to follow it.
    else if (viewport.scrollHeight === measuredHeight || !followingRef.current)
      changeFollowing(false);
  };

  const {
    onWheel,
    onKeyDown,
    onFocus,
    onTouchStart,
    onTouchMove,
    onPointerDown,
  } = scrollFollowerIntentHandlers(viewport, changeFollowing);

  const unbind = bindScrollFollowerInputs(
    viewport,
    {
      onScroll,
      onWheel,
      onKeyDown,
      onFocus,
      onTouchStart,
      onTouchMove,
      onPointerDown,
    },
    schedule,
  );

  schedule();

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    notifyContentRef.current = null;
    unbind();
  };
}

function scrollFollowerIntentHandlers(
  viewport: HTMLDivElement,
  changeFollowing: (next: boolean) => void,
) {
  const onWheel = (event: WheelEvent) => {
    if (event.deltaY < 0) changeFollowing(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.target === viewport &&
      (event.key === "ArrowUp" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        (event.key === " " && event.shiftKey))
    )
      changeFollowing(false);
  };

  const onFocus = (event: FocusEvent) => {
    if (event.target !== viewport) changeFollowing(false);
  };

  let touchY = 0;

  const onTouchStart = (event: TouchEvent) => {
    touchY = event.touches[0]?.clientY ?? 0;
  };

  const onTouchMove = (event: TouchEvent) => {
    const next = event.touches[0]?.clientY ?? touchY;

    if (next > touchY) changeFollowing(false);
    touchY = next;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (
      event.target instanceof Element &&
      event.target.closest('[data-slot="scroll-area-scrollbar"]')
    )
      changeFollowing(false);
  };

  return {
    onWheel,
    onKeyDown,
    onFocus,
    onTouchStart,
    onTouchMove,
    onPointerDown,
  };
}

type ScrollFollowerListeners = ReturnType<
  typeof scrollFollowerIntentHandlers
> & { onScroll: () => void };

function bindScrollFollowerInputs(
  viewport: HTMLDivElement,
  {
    onScroll,
    onWheel,
    onKeyDown,
    onFocus,
    onTouchStart,
    onTouchMove,
    onPointerDown,
  }: ScrollFollowerListeners,
  schedule: () => void,
) {
  const root = viewport.parentElement;
  root?.addEventListener("pointerdown", onPointerDown);
  viewport.addEventListener("scroll", onScroll);
  viewport.addEventListener("wheel", onWheel, { passive: true });
  viewport.addEventListener("keydown", onKeyDown);
  viewport.addEventListener("focusin", onFocus);
  viewport.addEventListener("touchstart", onTouchStart, { passive: true });
  viewport.addEventListener("touchmove", onTouchMove, { passive: true });
  document.addEventListener("visibilitychange", schedule);

  return () => {
    root?.removeEventListener("pointerdown", onPointerDown);
    viewport.removeEventListener("scroll", onScroll);
    viewport.removeEventListener("wheel", onWheel);
    viewport.removeEventListener("keydown", onKeyDown);
    viewport.removeEventListener("focusin", onFocus);
    viewport.removeEventListener("touchstart", onTouchStart);
    viewport.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("visibilitychange", schedule);
  };
}
