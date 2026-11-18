/* oxlint-disable react/only-export-components -- compound component exports are the public API */
import * as React from "react";
import type { BaseUIEvent } from "@base-ui/react/types";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconDots,
  IconGripVertical,
  IconLayoutSidebar,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconStar,
  IconSun,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SkeletonBone } from "@/components/ui/skeleton";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import { isFunctionProp, isStringProp } from "@/components/ui/prop-guards";

type Theme = "light" | "dark";

type CollapsibleMode = "offcanvas" | "icon" | "none";

type SidebarSide = "left" | "right";

type SidebarVariant = "default" | "floating" | "inset";

const STORAGE_KEY = "kira-sidebar-collapsed";
const STORAGE_EVENT = "kira-sidebar-storage";
const MOBILE_QUERY = "(max-width: 767px)";
const sidebarEase = "cubic-bezier(0.23, 1, 0.32, 1)";
const sidebarDrawerEase = "cubic-bezier(0.32, 0.72, 0, 1)";

gsap.registerPlugin(CustomEase);

const sidebarLayoutEase = CustomEase.create("kira-sidebar", "0.23,1,0.32,1");

// Layout changes commit once. Only the visual displacement is animated, so
// workspace text never stretches and no width tween runs on every frame.
function useSidebarLayoutMotion(
  rootRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  pointerRef: React.RefObject<boolean>,
) {
  const contextRef = React.useRef<gsap.Context | null>(null);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);
  const snapshotRef = React.useRef<Map<HTMLElement, DOMRect> | null>(null);

  const [, requestLayout] = React.useReducer(
    (revision: number) => revision + 1,
    0,
  );

  const cancel = React.useCallback(() => {
    snapshotRef.current = null;
    contextRef.current?.revert();
    contextRef.current = null;
    timelineRef.current = null;
  }, []);

  React.useLayoutEffect(() => {
    if (!enabled) cancel();

    return cancel;
  }, [enabled, cancel]);

  React.useLayoutEffect(() => {
    const before = snapshotRef.current;
    snapshotRef.current = null;

    if (!before) return;
    const root = rootRef.current;
    // Restore, measure and invert in the same commit, before the browser paints.
    // An interrupted tween stays frozen until this point, never flashing its end.
    cancel();

    if (!root || !enabled || !pointerRef.current) return;
    const offsets = new Map<HTMLElement, { x: number; y: number }>();

    for (const [node, previous] of before) {
      if (!node.isConnected || !node.checkVisibility()) continue;
      const next = node.getBoundingClientRect();
      offsets.set(node, { x: previous.x - next.x, y: previous.y - next.y });
    }

    // GSAP runs this callback synchronously, so defer reading `context` to avoid the TDZ.
    const context = gsap.context(
      () =>
        sidebarContext(
          contextRef,
          () => context,
          cancel,
          timelineRef,
          offsets,
          Math,
        ),
      root,
    );

    contextRef.current = context;

    if (!timelineRef.current?.duration()) cancel();
  });

  const capture = React.useCallback(() => {
    const root = rootRef.current;

    if (!root || !enabled || !pointerRef.current) {
      cancel();

      return;
    }

    // Batched requests share the visual position before their first commit.
    if (snapshotRef.current) return;

    const targets = sidebarLayoutTargets(root);

    snapshotRef.current = new Map(
      targets.flatMap((node) =>
        node.checkVisibility()
          ? [[node, node.getBoundingClientRect()] as const]
          : [],
      ),
    );
    timelineRef.current?.pause();
    // Also covers child-owned disclosures and reorders, not just shell state.
    requestLayout();
  }, [rootRef, enabled, pointerRef, cancel]);

  return { capture, cancel };
}

const focusRing =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring";

function readStorage(key: string) {
  try {
    return typeof window === "undefined"
      ? null
      : window.localStorage.getItem(key);
  } catch {
    // Private browsing and embedded apps may deny storage; state still works.
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Persistence is optional; never interrupt navigation when it is unavailable.
  }
}

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORAGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORAGE_EVENT, onChange);
  };
}

function subscribeMobile(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);

  return () => media.removeEventListener("change", onChange);
}

function mobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function desktopSnapshot() {
  return false;
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => sidebarUseState());

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    writeStorage("kira-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () =>
          setTheme((previous) => (previous === "light" ? "dark" : "light")),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) throw new Error("useTheme must be used within ThemeProvider");

  return context;
}

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  collapsible: CollapsibleMode;
  side: SidebarSide;
  width: string;
  collapsedWidth: string;
  hoverExpand: boolean;
  isHoverExpanded: boolean;
  setIsHoverExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  reducedMotion: boolean;
  motion: boolean;
  loadingMotion: boolean;
  captureLayout: () => void;
  setPointerIntent: (pointer: boolean) => void;
  expanded: boolean;
  sidebarId: string;
  contentId: string;
  searchRef: React.RefObject<HTMLInputElement | null>;
  searchPendingRef: React.RefObject<boolean>;
  mobileTriggerRef: React.RefObject<HTMLButtonElement | null>;
  focusSearch: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps extends Omit<
  React.ComponentProps<"div">,
  "ref"
> {
  collapsible?: CollapsibleMode;
  side?: SidebarSide;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  openMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  persistState?: boolean;
  storageKey?: string;
  width?: string;
  collapsedWidth?: string;
  hoverExpand?: boolean;
  /** Pointer motion only. Keyboard and reduced-motion changes stay immediate. */
  motion?: boolean;
  /** Omit to use the viewport. Useful for embedded navigation previews. */
  mobile?: boolean;
  keyboardShortcut?: string | false;
  shortcutScope?: "provider" | "global";
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest(
      "input, textarea, select, [contenteditable]:not([contenteditable=false])",
    )
  );
}

// Requests in one event turn compose before React commits, without putting
// persistence or consumer callbacks inside a replayable state updater.
function useBooleanRequests(
  value: boolean,
  onRequest: (next: boolean) => void,
) {
  const pending = React.useRef<boolean | undefined>(undefined);
  React.useLayoutEffect(() => {
    pending.current = undefined;
  });

  return React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (update) => sidebarUseCallback(update, pending, value, onRequest),
    [value, onRequest],
  );
}

function useCollapsedState({
  defaultCollapsed = false,
  collapsed: controlled,
  onCollapsedChange,
  persistState = true,
  storageKey = STORAGE_KEY,
}: SidebarProviderProps) {
  const getSnapshot = React.useCallback(
    () => sidebarUseCallback2(persistState, storageKey),
    [persistState, storageKey],
  );

  const stored = React.useSyncExternalStore(
    subscribeStorage,
    getSnapshot,
    () => null,
  );

  const [local, setLocal] = React.useState({
    key: storageKey,
    stored,
    value: stored ?? defaultCollapsed,
  });

  // Adopt external changes, but don't let an unchanged storage snapshot defeat
  // an in-memory update when a persistence write was denied.
  const changed = local.key !== storageKey || local.stored !== stored;
  const fallback = changed ? (stored ?? defaultCollapsed) : local.value;

  if (changed) setLocal({ key: storageKey, stored, value: fallback });
  const collapsed = controlled ?? fallback;

  const request = React.useCallback(
    (next: boolean) =>
      sidebarUseCallback3(
        next,
        controlled,
        setLocal,
        storageKey,
        stored,
        persistState,
        onCollapsedChange,
      ),
    [controlled, onCollapsedChange, persistState, storageKey, stored],
  );

  const setCollapsed = useBooleanRequests(collapsed, request);

  return { collapsed, setCollapsed };
}

function SidebarProvider(arg0: SidebarProviderProps) {
  const model = useSidebarProviderModel(arg0);

  return <SidebarProviderView {...model} />;
}

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");

  return context;
}

const sidebarVariants = cva(
  "flex h-full min-h-0 min-w-0 flex-col text-sidebar-foreground",
  {
    variants: {
      variant: {
        default: "border-sidebar-border bg-sidebar",
        floating:
          "rounded-xl border border-sidebar-border bg-sidebar shadow-sm",
        inset: "bg-muted/30",
      },
      side: { left: "border-r", right: "border-l" },
    },
    defaultVariants: { variant: "default", side: "left" },
  },
);

const sidebarMenuButtonVariants = cva(
  `relative flex min-h-9 w-full min-w-0 items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-start text-sm leading-5 touch-manipulation ${focusRing} hover:bg-sidebar-accent active:bg-sidebar-accent disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 [@media(pointer:coarse)]:min-h-11`,
  {
    variants: {
      isActive: {
        // kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics
        true: "bg-sidebar-accent font-semibold text-sidebar-accent-foreground before:absolute before:inset-y-2.5 before:start-0 before:w-0.5 before:rounded-full before:bg-sidebar-primary",
        false: "text-sidebar-foreground",
      },
      compact: { true: "justify-center px-2", false: "" },
    },
    defaultVariants: { isActive: false, compact: false },
  },
);

const sidebarActionVariants = cva(
  `inline-flex min-h-8 min-w-8 shrink-0 touch-manipulation items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground active:bg-sidebar-accent disabled:opacity-50 aria-disabled:opacity-50 [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:min-w-11 ${focusRing}`,
);

interface SidebarProps extends Omit<React.ComponentProps<"nav">, "ref" | "id"> {
  variant?: SidebarVariant;
}

function useSidebarShell({
  children,
  variant = "default",
  className,
  style,
  ...props
}: SidebarProps) {
  const {
    collapsed,
    isMobile,
    openMobile,
    setOpenMobile,
    collapsible,
    side,
    width,
    collapsedWidth,
    hoverExpand,
    isHoverExpanded,
    setIsHoverExpanded,
    sidebarId,
    mobileTriggerRef,
    searchRef,
    searchPendingRef,
    motion,
    captureLayout,
    setPointerIntent,
  } = useSidebar();

  const { navRef, peek, handlers } = useSidebarPeek(
    {
      isMobile,
      hoverExpand,
      collapsed,
      collapsible,
      isHoverExpanded,
      setIsHoverExpanded,
      captureLayout,
      setPointerIntent,
    },
    props,
  );

  const hidden = collapsed && collapsible === "offcanvas";

  return {
    children,
    variant,
    className,
    style,
    props,
    collapsed,
    isMobile,
    openMobile,
    setOpenMobile,
    collapsible,
    side,
    width,
    collapsedWidth,
    sidebarId,
    mobileTriggerRef,
    searchRef,
    searchPendingRef,
    motion,
    navRef,
    hidden,
    peek,
    handlers,
  };
}

type SidebarShellModel = ReturnType<typeof useSidebarShell>;

function Sidebar(input: SidebarProps) {
  const model = useSidebarShell(input);

  return model.isMobile ? (
    <SidebarMobileShell model={model} />
  ) : (
    <SidebarDesktopShell model={model} />
  );
}

function SidebarMobileShell({ model }: { model: SidebarShellModel }) {
  const {
    children,
    className,
    style,
    props,
    openMobile,
    setOpenMobile,
    side,
    width,
    sidebarId,
    mobileTriggerRef,
    searchRef,
    searchPendingRef,
    motion,
  } = model;

  return (
    <Drawer side={side} open={openMobile} onOpenChange={setOpenMobile}>
      <DrawerContent
        showCloseButton={false}
        className={cn(
          "max-w-[calc(100vw-2rem)] bg-sidebar p-0 transition-transform duration-200 data-ending-style:duration-150",
          { "transition-none": !motion },
        )}
        overlayProps={{
          className: cn("duration-200 data-ending-style:duration-150", {
            "transition-none": !motion,
          }),
          style: { transitionTimingFunction: sidebarEase },
        }}
        style={{
          width: `min(${width}, calc(100vw - 2rem))`,
          transitionTimingFunction: sidebarDrawerEase,
        }}
        portalProps={{ keepMounted: true }}
        initialFocus={() => sidebarCallback(searchPendingRef, searchRef)}
        finalFocus={() => mobileTriggerRef.current ?? true}
      >
        <div
          data-slot="sidebar-mobile-header"
          className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]"
        >
          <DrawerTitle className="text-sm font-medium">
            {props["aria-label"] ?? "Navigation"}
          </DrawerTitle>
          <DrawerClose
            aria-label="Close navigation"
            className={sidebarActionVariants()}
          >
            <IconX aria-hidden="true" className="size-5" />
          </DrawerClose>
        </div>
        <nav
          {...props}
          data-sidebar-owner={sidebarId}
          id={sidebarId}
          data-slot="sidebar"
          data-mobile="true"
          data-collapsed="false"
          aria-label={props["aria-label"] ?? "Main navigation"}
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col bg-sidebar pb-[env(safe-area-inset-bottom)]",
            className,
          )}
          style={style}
        >
          {children}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}

function SidebarDesktopShell({ model }: { model: SidebarShellModel }) {
  const {
    children,
    variant,
    className,
    style,
    props,
    collapsed,
    collapsible,
    side,
    width,
    collapsedWidth,
    sidebarId,
    navRef,
    hidden,
    peek,
    handlers,
  } = model;

  return (
    <div
      data-slot="sidebar-frame"
      data-side={side}
      className={cn(
        "relative min-h-0 shrink-0 self-stretch",
        { "m-2": variant === "floating" },
        "isolate",
        { "z-40": peek },
      )}
      style={{
        width: sidebarResolveWidth2(hidden, collapsed, collapsedWidth, width),
      }}
    >
      <SidebarShellSurfaces model={model} />
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- This container delegates hover/focus behavior and scoped shortcuts to its interactive descendants. */}
      <nav
        {...props}
        data-sidebar-owner={sidebarId}
        ref={navRef}
        id={sidebarId}
        data-slot="sidebar"
        data-collapsed={collapsed && !peek}
        data-collapsible={collapsible}
        data-side={side}
        data-hover-expanded={peek}
        aria-label={props["aria-label"] ?? "Main navigation"}
        aria-hidden={hidden || undefined}
        inert={hidden || undefined}
        className={cn(
          sidebarVariants({ variant, side }),
          "relative border-transparent bg-transparent",
          { "absolute inset-y-0 z-40": peek },
          { invisible: hidden },
          peek && (side === "left" ? "left-0" : "right-0"),
          className,
        )}
        style={{ width: peek || hidden ? width : "100%", ...style }}
        {...handlers}
      >
        {children}
      </nav>
    </div>
  );
}

function SidebarShellSurfaces({ model }: { model: SidebarShellModel }) {
  const {
    variant,
    side,
    width,
    motion,
    hidden,
    collapsed,
    peek,
    collapsedWidth,
  } = model;

  return (
    <>
      <div
        data-slot="sidebar-surface"
        aria-hidden="true"
        className={cn(
          sidebarVariants({ variant, side }),
          "pointer-events-none absolute inset-y-0 -z-10",
          side === "left" ? "left-0" : "right-0",
          motion ? "transition-[clip-path] duration-200" : "transition-none",
        )}
        style={{
          width,
          transitionTimingFunction: sidebarEase,
          clipPath:
            side === "left"
              ? `inset(0 ${sidebarResolveClipPath3(hidden, collapsed, peek, collapsedWidth)} 0 0)`
              : `inset(0 0 0 ${sidebarResolveClipPath3(hidden, collapsed, peek, collapsedWidth)})`,
        }}
      />
      <div
        data-slot="sidebar-elevation"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 -z-10 shadow-lg",
          side === "left" ? "left-0" : "right-0",
          { "rounded-xl": variant === "floating" },
          peek ? "opacity-100" : "opacity-0",
          motion ? "transition-opacity duration-150" : "transition-none",
        )}
        style={{ width, transitionTimingFunction: sidebarEase }}
      />
      <SidebarShellBoundary model={model} />
    </>
  );
}

interface SidebarTriggerProps extends React.ComponentProps<"button"> {
  showOnDesktop?: boolean;
}

function SidebarTrigger({
  className,
  showOnDesktop = false,
  onClick,
  children,
  ...props
}: SidebarTriggerProps) {
  const {
    toggleSidebar,
    isMobile,
    openMobile,
    collapsed,
    sidebarId,
    mobileTriggerRef,
    collapsible,
  } = useSidebar();

  if (!isMobile && (!showOnDesktop || collapsible === "none")) return null;
  const expanded = isMobile ? openMobile : !collapsed;

  return (
    <button
      {...props}
      type="button"
      data-slot="sidebar-trigger"
      aria-label={
        props["aria-label"] ??
        (expanded ? "Collapse navigation" : "Expand navigation")
      }
      aria-expanded={expanded}
      aria-controls={sidebarId}
      className={cn(sidebarActionVariants(), className)}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          if (isMobile) mobileTriggerRef.current = event.currentTarget;
          toggleSidebar();
        }
      }}
    >
      {children ??
        (isMobile ? (
          <IconMenu2 aria-hidden="true" className="size-5" />
        ) : (
          <IconLayoutSidebar aria-hidden="true" className="size-5" />
        ))}
    </button>
  );
}

function SidebarHint({
  children,
  label,
  slot,
}: {
  children: React.ReactElement;
  label: React.ReactNode;
  slot?: string;
}) {
  const { expanded, side } = useSidebar();

  return (
    <Tooltip disabled={expanded}>
      <TooltipTrigger data-slot={slot} render={children} />
      <TooltipContent side={side === "left" ? "right" : "left"}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

interface SidebarHeaderProps extends Omit<
  React.ComponentProps<"div">,
  "title"
> {
  showToggle?: boolean;
  logo?: React.ReactNode;
  title?: string;
  sticky?: boolean;
}

function SidebarHeader({
  children,
  className,
  showToggle = true,
  logo,
  title,
  sticky = false,
  ...props
}: SidebarHeaderProps) {
  const { expanded, isMobile } = useSidebar();

  return (
    <div
      {...props}
      data-slot="sidebar-header"
      className={cn(
        "flex min-h-14 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar p-3",
        { "justify-center px-2": !expanded },
        { "sticky top-0 z-10": sticky },
        className,
      )}
    >
      {(expanded || !showToggle) && (
        <SidebarBrandView logo={logo} title={title} expanded={expanded} />
      )}
      {children}
      {showToggle && !isMobile && <SidebarTrigger showOnDesktop />}
    </div>
  );
}

interface SidebarContentProps extends Omit<
  React.ComponentProps<"div">,
  "ref" | "id"
> {
  showScrollTop?: boolean;
}

function SidebarContent({
  children,
  className,
  showScrollTop = true,
  onScroll,
  ...props
}: SidebarContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const { reducedMotion, contentId } = useSidebar();

  return (
    <div
      {...props}
      ref={contentRef}
      id={contentId}
      data-slot="sidebar-content"
      className={cn(
        "min-h-0 min-w-0 flex-1 space-y-1 overflow-x-hidden overflow-y-auto overscroll-contain scroll-py-3 p-2 scrollbar-thin",
        className,
      )}
      onScroll={(event) => {
        onScroll?.(event);
        setShowScrollButton(event.currentTarget.scrollTop > 100);
      }}
    >
      {children}
      {showScrollTop && showScrollButton && (
        <div
          data-slot="sidebar-scroll-top"
          className="sticky bottom-0 flex justify-center pt-2"
        >
          <button
            type="button"
            className={cn(
              sidebarActionVariants(),
              "border-sidebar-border bg-sidebar shadow-sm",
            )}
            aria-label="Scroll navigation to top"
            onClick={() =>
              contentRef.current?.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth",
              })
            }
          >
            <IconArrowUp aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

interface SidebarSearchProps extends Omit<
  React.ComponentProps<"input">,
  "ref" | "onChange" | "size" | "value" | "defaultValue"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
}

function SidebarSearch(arg0: SidebarSearchProps) {
  const model = useSidebarSearchModel(arg0);

  return <SidebarSearchView {...model} />;
}

interface SidebarGroupProps extends React.ComponentProps<"div"> {
  label: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  action?: React.ReactNode;
}

function SidebarGroup({
  label,
  children,
  defaultOpen = true,
  open: controlled,
  onOpenChange,
  className,
  action,
  ...props
}: SidebarGroupProps) {
  const { expanded, motion, captureLayout } = useSidebar();
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const open = controlled ?? localOpen;

  return (
    <Collapsible
      {...props}
      data-slot="sidebar-group"
      open={!expanded || open}
      motion={motion}
      onOpenChange={(next) => {
        captureLayout();

        if (controlled === undefined) setLocalOpen(next);
        onOpenChange?.(next);
      }}
      className={cn("min-w-0 space-y-1", className)}
    >
      <SidebarGroupHeaderView
        expanded={expanded}
        label={label}
        open={open}
        motion={motion}
        action={action}
      />
      <CollapsibleContent
        data-slot="sidebar-group-content"
        size="none"
        className="space-y-0.5"
        style={{ transitionTimingFunction: sidebarEase }}
      >
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md text-xs font-medium tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-sidebar-accent text-sidebar-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-sidebar-border text-sidebar-foreground",
        success: "bg-success/15 text-foreground",
        warning: "bg-warning/20 text-foreground",
      },
      size: {
        // kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics
        default: "h-5 min-w-5 px-1.5",
        sm: "h-4 min-w-4 px-1 text-xs",
        dot: "size-2 rounded-full p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

interface SidebarBadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

function SidebarBadge({
  children,
  variant,
  size,
  className,
  ...props
}: SidebarBadgeProps) {
  return (
    <span
      {...props}
      data-slot="sidebar-badge"
      className={cn(badgeVariants({ variant, size }), className)}
    >
      {size !== "dot" && children}
    </span>
  );
}

type SidebarBadgeVariant = NonNullable<SidebarBadgeProps["variant"]>;

function SidebarRowContent({
  children,
  icon,
  badge,
  badgeVariant,
  shortcut,
  disabledReason,
}: {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: SidebarBadgeVariant;
  shortcut?: string;
  disabledReason?: string;
}) {
  const { expanded, motion } = useSidebar();
  const hasBadge = badge !== undefined && badge !== null && badge !== false;

  return (
    <>
      <SidebarRowIcon
        icon={icon}
        expanded={expanded}
        hasBadge={hasBadge}
        badgeVariant={badgeVariant}
      />
      <span
        data-slot="sidebar-item-label"
        className={cn(
          "min-w-0 flex-1 wrap-anywhere",
          { "sr-only opacity-0": !expanded },
          motion ? "transition-opacity duration-150" : "transition-none",
        )}
        style={{ transitionTimingFunction: sidebarEase }}
      >
        {children}
        {disabledReason && (
          <span
            data-slot="sidebar-item-reason"
            className="mt-0.5 block text-xs font-normal leading-4"
          >
            {disabledReason}
          </span>
        )}
      </span>
      {hasBadge && (
        <SidebarBadge
          variant={badgeVariant}
          className={cn({ "sr-only": !expanded })}
        >
          {badge}
        </SidebarBadge>
      )}
      {expanded && shortcut && (
        <kbd
          data-slot="sidebar-item-shortcut"
          className="shrink-0 text-xs font-normal text-muted-foreground"
        >
          {shortcut}
        </kbd>
      )}
    </>
  );
}

interface SidebarItemProps extends Omit<React.ComponentProps<"a">, "href"> {
  to: string;
  icon?: React.ReactNode;
  level?: number;
  badge?: React.ReactNode;
  badgeVariant?: SidebarBadgeVariant;
  shortcut?: string;
  disabled?: boolean;
  disabledReason?: string;
  isActive?: boolean;
  closeMobileOnClick?: boolean;
}

function SidebarItem(arg0: SidebarItemProps) {
  const model = useSidebarItemModel(arg0);

  return <SidebarItemView {...model} />;
}

type SidebarMenuProps = React.ComponentProps<"ul">;

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    // kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics
    <ul
      {...props}
      data-slot="sidebar-menu"
      className={cn("flex min-w-0 list-none flex-col gap-0.5", className)}
    />
  );
}

type SidebarMenuItemProps = React.ComponentProps<"li">;

function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      {...props}
      data-slot="sidebar-menu-item"
      className={cn("relative min-w-0", className)}
    />
  );
}

interface SidebarMenuButtonProps extends Omit<
  ButtonPrimitive.Props,
  "className" | "children"
> {
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: React.ReactNode;
  badgeVariant?: SidebarBadgeVariant;
  disabledReason?: string;
}

function SidebarMenuButton({
  children,
  icon,
  isActive = false,
  badge,
  badgeVariant = "default",
  className,
  disabledReason,
  disabled,
  ...props
}: SidebarMenuButtonProps) {
  const { expanded } = useSidebar();

  return (
    <SidebarHint
      label={
        <>
          {children}
          {disabled && disabledReason && (
            <span className="block text-xs">{disabledReason}</span>
          )}
        </>
      }
    >
      <ButtonPrimitive
        {...props}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        disabled={disabled}
        focusableWhenDisabled={
          disabledReason ? true : props.focusableWhenDisabled
        }
        className={cn(
          sidebarMenuButtonVariants({ isActive, compact: !expanded }),
          className,
        )}
      >
        <SidebarRowContent
          icon={icon}
          badge={badge}
          badgeVariant={badgeVariant}
          disabledReason={disabled ? disabledReason : undefined}
        >
          {children}
        </SidebarRowContent>
      </ButtonPrimitive>
    </SidebarHint>
  );
}

type SidebarMenuSubProps = React.ComponentProps<"ul">;

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  const { expanded } = useSidebar();

  if (!expanded) return null;

  return (
    <ul
      {...props}
      data-slot="sidebar-menu-sub"
      className={cn(
        "ms-4 list-none space-y-0.5 border-s border-sidebar-border ps-2",
        className,
      )}
    />
  );
}

interface SidebarItemGroupProps extends Omit<SidebarGroupProps, "action"> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: SidebarBadgeVariant;
}

function SidebarItemGroup({
  label,
  icon,
  children,
  defaultOpen = false,
  open: controlled,
  onOpenChange,
  badge,
  badgeVariant = "default",
  className,
  ...props
}: SidebarItemGroupProps) {
  const { expanded, setCollapsed, motion, captureLayout } = useSidebar();
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const open = controlled ?? localOpen;

  const change = (next: boolean) => {
    captureLayout();

    if (controlled === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Collapsible
      {...props}
      data-slot="sidebar-item-group"
      open={expanded && open}
      onOpenChange={change}
      motion={motion}
      className={cn("min-w-0 space-y-0.5", className)}
    >
      <SidebarHint label={label} slot="sidebar-item-group-trigger">
        <CollapsibleTrigger
          showArrow={false}
          className={cn(
            sidebarMenuButtonVariants({ compact: !expanded }),
            "transition-none",
          )}
          onClick={() => {
            if (!expanded) setCollapsed(false);
          }}
        >
          <SidebarItemGroupLabelView
            icon={icon}
            badge={badge}
            badgeVariant={badgeVariant}
            label={label}
            expanded={expanded}
            open={open}
            motion={motion}
          />
        </CollapsibleTrigger>
      </SidebarHint>
      <CollapsibleContent
        data-slot="sidebar-item-group-content"
        size="none"
        style={{ transitionTimingFunction: sidebarEase }}
      >
        <SidebarMenuSub>{children}</SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}

type SidebarDividerProps = React.ComponentProps<"hr">;

function SidebarDivider({ className, ...props }: SidebarDividerProps) {
  return (
    <hr
      {...props}
      data-slot="sidebar-divider"
      className={cn("my-2 border-0 border-t border-sidebar-border", className)}
    />
  );
}

interface SidebarFooterProps extends React.ComponentProps<"div"> {
  sticky?: boolean;
}

function SidebarFooter({
  className,
  sticky = false,
  ...props
}: SidebarFooterProps) {
  return (
    <div
      {...props}
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto shrink-0 border-t border-sidebar-border bg-sidebar p-2",
        { "sticky bottom-0 z-10": sticky },
        className,
      )}
    />
  );
}

interface SidebarUserProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  name: string;
  email?: string;
  avatar?: string | React.ReactNode;
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    destructive?: boolean;
  }>;
}

function SidebarUser({
  name,
  email,
  avatar,
  menuItems,
  className,
  ...props
}: SidebarUserProps) {
  const resolveSide5 = () => sidebarResolveSide5(isMobile, side);

  const { expanded, side, isMobile, motion } = useSidebar();

  const content = (
    <SidebarUserAvatarView
      avatar={avatar}
      expanded={expanded}
      name={name}
      email={email}
      menuItems={menuItems}
    />
  );

  return (
    <div
      {...props}
      data-slot="sidebar-user"
      className={cn("min-w-0", className)}
    >
      {menuItems?.length ? (
        <SidebarUserTriggerView
          name={name}
          expanded={expanded}
          content={content}
          resolveSide5={resolveSide5}
          motion={motion}
          menuItems={menuItems}
        />
      ) : (
        <div
          data-slot="sidebar-user-profile"
          className="flex min-w-0 items-center gap-2 p-2"
        >
          {content}
        </div>
      )}
    </div>
  );
}

type ThemeToggleProps = Omit<
  SidebarMenuButtonProps,
  "icon" | "children" | "onClick"
>;

function ThemeToggle(props: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarMenuButton
      {...props}
      data-slot="sidebar-theme-toggle"
      icon={theme === "light" ? <IconMoon /> : <IconSun />}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
      onClick={toggleTheme}
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </SidebarMenuButton>
  );
}

interface SidebarSkeletonProps extends React.ComponentProps<"div"> {
  items?: number;
}

function SidebarSkeleton({
  items = 5,
  className,
  ...props
}: SidebarSkeletonProps) {
  const { expanded, loadingMotion } = useSidebar();
  const rowsRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(
    () => sidebarUseEffect(rowsRef, loadingMotion),
    [loadingMotion],
  );

  const count = Number.isFinite(items)
    ? Math.max(1, Math.min(30, Math.floor(items)))
    : 5;

  const label = props["aria-label"] ?? "Loading navigation";

  return (
    <div
      {...props}
      data-slot="sidebar-skeleton"
      className={cn("p-2", className)}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <SidebarSkeletonRowsView
        rowsRef={rowsRef}
        loadingMotion={loadingMotion}
        count={count}
        expanded={expanded}
      />
    </div>
  );
}

interface SidebarEmptyProps extends Omit<React.ComponentProps<"div">, "title"> {
  title?: string;
  action?: React.ReactNode;
}

function SidebarEmpty({
  title = "No views yet",
  children,
  action,
  className,
  ...props
}: SidebarEmptyProps) {
  const { expanded } = useSidebar();

  return (
    <div
      {...props}
      data-slot="sidebar-empty"
      className={cn("space-y-2 p-3 text-sm", className)}
    >
      <p
        data-slot="sidebar-empty-title"
        className={cn("font-medium wrap-anywhere", { "sr-only": !expanded })}
      >
        {title}
      </p>
      {children && (
        <div
          data-slot="sidebar-empty-description"
          className={cn(
            "text-xs leading-5 text-muted-foreground wrap-anywhere",
            { "sr-only": !expanded },
          )}
        >
          {children}
        </div>
      )}
      {expanded && action}
    </div>
  );
}

interface SidebarNavItem {
  /** Unique across all sections. */
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  keywords?: readonly string[];
  badge?: React.ReactNode;
  badgeVariant?: SidebarBadgeVariant;
  disabled?: boolean;
  disabledReason?: string;
}

interface SidebarSection {
  id: string;
  label: string;
  items: readonly SidebarNavItem[];
  defaultOpen?: boolean;
}

interface KiraSidebarProps extends Omit<SidebarProps, "children"> {
  sections: readonly SidebarSection[];
  title?: string;
  logo?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  user?: SidebarUserProps;
  activeId?: string;
  defaultActiveId?: string;
  onNavigate?: (item: SidebarNavItem) => void;
  searchable?: boolean;
  searchLabel?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  favorites?: boolean;
  pinnedIds?: readonly string[];
  defaultPinnedIds?: readonly string[];
  onPinnedIdsChange?: (ids: string[]) => void;
  reorderable?: boolean;
  /** Locks personalization; available destinations remain usable. */
  readOnly?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage?: string;
}

function searchableText(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase();
}

function SidebarDestination({
  item,
  active,
  onNavigate,
}: {
  item: SidebarNavItem;
  active: boolean;
  onNavigate: (item: SidebarNavItem) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarContentView
      item={item}
      active={active}
      onNavigate={onNavigate}
      isMobile={isMobile}
      setOpenMobile={setOpenMobile}
    />
  );
}

interface SidebarFavoriteListProps {
  items: readonly SidebarNavItem[];
  activeId?: string;
  onNavigate: (item: SidebarNavItem) => void;
  onReorder: (ids: string[], label: string, position: number) => void;
  reorderable: boolean;
}

function SidebarFavoriteList(arg0: SidebarFavoriteListProps) {
  const model = useSidebarFavoriteListModel(arg0);

  return <SidebarFavoriteListView {...model} />;
}

function KiraSidebar(arg0: KiraSidebarProps) {
  const model = useKiraSidebarModel(arg0);

  return <KiraSidebarView {...model} />;
}

export {
  ThemeProvider,
  useTheme,
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarSearch,
  SidebarGroup,
  SidebarItem,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarItemGroup,
  SidebarDivider,
  SidebarFooter,
  SidebarUser,
  ThemeToggle,
  SidebarSkeleton,
  SidebarBadge,
  SidebarEmpty,
  KiraSidebar,
  sidebarVariants,
  sidebarMenuButtonVariants,
  sidebarActionVariants,
  badgeVariants,
};

export type {
  Theme,
  SidebarVariant,
  CollapsibleMode,
  SidebarSide,
  SidebarContextValue,
  SidebarProviderProps,
  SidebarProps,
  SidebarTriggerProps,
  SidebarHeaderProps,
  SidebarContentProps,
  SidebarSearchProps,
  SidebarGroupProps,
  SidebarItemProps,
  SidebarItemGroupProps,
  SidebarMenuProps,
  SidebarMenuItemProps,
  SidebarMenuButtonProps,
  SidebarMenuSubProps,
  SidebarDividerProps,
  SidebarFooterProps,
  SidebarUserProps,
  ThemeToggleProps,
  SidebarBadgeProps,
  SidebarSkeletonProps,
  SidebarEmptyProps,
  SidebarNavItem,
  SidebarSection,
  KiraSidebarProps,
};

function resolveSidebarProviderOptions({
  collapsible = "icon",
  side = "left",
  defaultCollapsed = false,
  persistState = true,
  storageKey = STORAGE_KEY,
  width = "16rem",
}: {
  collapsible?: SidebarProviderProps["collapsible"];
  side?: SidebarProviderProps["side"];
  defaultCollapsed?: SidebarProviderProps["defaultCollapsed"];
  persistState?: SidebarProviderProps["persistState"];
  storageKey?: SidebarProviderProps["storageKey"];
  width?: SidebarProviderProps["width"];
}) {
  return {
    collapsible,
    side,
    defaultCollapsed,
    persistState,
    storageKey,
    width,
  };
}

function resolveSidebarProviderOptions2({
  collapsedWidth = "4rem",
  hoverExpand = false,
  motion = true,
  keyboardShortcut = "b",
  shortcutScope = "provider",
}: {
  collapsedWidth?: SidebarProviderProps["collapsedWidth"];
  hoverExpand?: SidebarProviderProps["hoverExpand"];
  motion?: SidebarProviderProps["motion"];
  keyboardShortcut?: SidebarProviderProps["keyboardShortcut"];
  shortcutScope?: SidebarProviderProps["shortcutScope"];
}) {
  return {
    collapsedWidth,
    hoverExpand,
    motion,
    keyboardShortcut,
    shortcutScope,
  };
}

function resolveSidebarItemOptions({
  level = 0,
  badgeVariant = "default",
  disabled = false,
  closeMobileOnClick = true,
}: {
  level?: SidebarItemProps["level"];
  badgeVariant?: SidebarItemProps["badgeVariant"];
  disabled?: SidebarItemProps["disabled"];
  closeMobileOnClick?: SidebarItemProps["closeMobileOnClick"];
}) {
  return { level, badgeVariant, disabled, closeMobileOnClick };
}

function resolveKiraSidebarOptions({
  title = "Workspace",
  searchable = true,
  searchLabel = "Search navigation",
  favorites = true,
  defaultPinnedIds = [],
  reorderable = true,
}: {
  title?: KiraSidebarProps["title"];
  searchable?: KiraSidebarProps["searchable"];
  searchLabel?: KiraSidebarProps["searchLabel"];
  favorites?: KiraSidebarProps["favorites"];
  defaultPinnedIds?: KiraSidebarProps["defaultPinnedIds"];
  reorderable?: KiraSidebarProps["reorderable"];
}) {
  return {
    title,
    searchable,
    searchLabel,
    favorites,
    defaultPinnedIds,
    reorderable,
  };
}

function resolveKiraSidebarOptions2({
  readOnly = false,
  loading = false,
  emptyMessage = "Views will appear here when they are available.",
}: {
  readOnly?: KiraSidebarProps["readOnly"];
  loading?: KiraSidebarProps["loading"];
  emptyMessage?: KiraSidebarProps["emptyMessage"];
}) {
  return { readOnly, loading, emptyMessage };
}

function SidebarBrandView({
  logo,
  title,
  expanded,
}: {
  logo: React.ReactNode;
  title: string | undefined;
  expanded: boolean;
}) {
  return (
    <div
      data-slot="sidebar-brand"
      className="flex min-w-0 flex-1 items-center gap-2"
    >
      <span
        data-slot="sidebar-logo"
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground"
      >
        {logo ?? "K"}
      </span>
      {title && (
        <span
          data-slot="sidebar-title"
          className={cn("min-w-0 text-sm font-semibold wrap-anywhere", {
            "sr-only": !expanded,
          })}
        >
          {title}
        </span>
      )}
    </div>
  );
}

function SidebarGroupHeaderView({
  expanded,
  label,
  open,
  motion,
  action,
}: {
  expanded: boolean;
  label: string;
  open: boolean;
  motion: boolean;
  action: React.ReactNode;
}) {
  return (
    <div
      data-slot="sidebar-group-header"
      className={cn("flex min-w-0 items-center gap-1", {
        "sr-only": !expanded,
      })}
    >
      {/* kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics */}
      <CollapsibleTrigger
        showArrow={false}
        tabIndex={expanded ? undefined : -1}
        className={cn(
          "min-h-8 min-w-0 flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-none",
          focusRing,
        )}
      >
        <span
          data-slot="sidebar-group-label"
          className="flex min-w-0 items-center justify-between gap-2"
        >
          <span className="wrap-anywhere">{label}</span>
          {/* kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics */}
          <IconChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0",
              { "-rotate-90": !open },
              motion ? "transition-transform duration-200" : "transition-none",
            )}
            style={{ transitionTimingFunction: sidebarEase }}
          />
        </span>
      </CollapsibleTrigger>
      {expanded && action}
    </div>
  );
}

function SidebarItemGroupLabelView({
  icon,
  badge,
  badgeVariant,
  label,
  expanded,
  open,
  motion,
}: {
  icon: React.ReactNode;
  badge: React.ReactNode;
  badgeVariant: SidebarBadgeVariant;
  label: string;
  expanded: boolean;
  open: boolean;
  motion: boolean;
}) {
  return (
    <span
      data-slot="sidebar-item-group-label"
      className="flex min-w-0 flex-1 items-center gap-2"
    >
      <SidebarRowContent icon={icon} badge={badge} badgeVariant={badgeVariant}>
        {label}
      </SidebarRowContent>
      {expanded && (
        <IconChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0",
            { "-rotate-90": !open },
            motion ? "transition-transform duration-200" : "transition-none",
          )}
          style={{ transitionTimingFunction: sidebarEase }}
        />
      )}
    </span>
  );
}

function SidebarUserAvatarView({
  avatar,
  expanded,
  name,
  email,
  menuItems,
}: {
  avatar: React.ReactNode;
  expanded: boolean;
  name: string;
  email: string | undefined;
  menuItems: SidebarUserProps["menuItems"];
}) {
  return (
    <>
      <Avatar data-slot="sidebar-user-avatar" className="size-8 shrink-0">
        {isStringProp(avatar) ? <AvatarImage src={avatar} alt="" /> : avatar}
        <AvatarFallback>
          <IconUser aria-hidden="true" className="size-4" />
        </AvatarFallback>
      </Avatar>
      <span
        data-slot="sidebar-user-details"
        className={cn("min-w-0 flex-1 text-start", { "sr-only": !expanded })}
      >
        <span
          data-slot="sidebar-user-name"
          className="block text-sm font-medium wrap-anywhere"
        >
          {name}
        </span>
        {email && (
          <span
            data-slot="sidebar-user-email"
            className="block text-xs text-muted-foreground wrap-anywhere"
          >
            {email}
          </span>
        )}
      </span>
      {menuItems?.length && expanded ? (
        <IconDots aria-hidden="true" className="size-4 shrink-0" />
      ) : null}
    </>
  );
}

function SidebarUserTriggerView({
  name,
  expanded,
  content,
  resolveSide5,
  motion,
  menuItems,
}: {
  name: string;
  expanded: boolean;
  content: React.JSX.Element;
  resolveSide5: () => "right" | "top" | "left";
  motion: boolean;
  menuItems: NonNullable<SidebarUserProps["menuItems"]>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            data-slot="sidebar-user-trigger"
            aria-label={`Account for ${name}`}
            className={cn(
              sidebarMenuButtonVariants({ compact: !expanded }),
              "px-2",
            )}
          >
            {content}
          </button>
        }
      />
      <DropdownMenuContent
        side={resolveSide5()}
        align="end"
        className={cn("max-w-[calc(100vw-2rem)]", {
          "transition-none": !motion,
        })}
        style={{ transitionTimingFunction: sidebarEase }}
      >
        {menuItems.map((item) =>
          item.href ? (
            <DropdownMenuLinkItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              variant={item.destructive ? "destructive" : "default"}
              onClick={item.onClick}
            >
              {item.label}
            </DropdownMenuLinkItem>
          ) : (
            <DropdownMenuItem
              key={item.label}
              icon={item.icon}
              variant={item.destructive ? "destructive" : "default"}
              onClick={item.onClick}
            >
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarSkeletonRowsView({
  rowsRef,
  loadingMotion,
  count,
  expanded,
}: {
  rowsRef: React.RefObject<HTMLDivElement | null>;
  loadingMotion: boolean;
  count: number;
  expanded: boolean;
}) {
  return (
    <div
      ref={rowsRef}
      data-slot="sidebar-skeleton-rows"
      aria-hidden="true"
      className={cn(
        "space-y-1",
        loadingMotion ? "motion-safe:animate-pulse" : "animate-none",
      )}
      style={{ animationPlayState: "paused" }}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          data-slot="sidebar-skeleton-row"
          className={cn(
            "flex min-h-9 items-center gap-2 px-2 py-2 pointer-coarse:min-h-11",
            { "justify-center": !expanded },
          )}
        >
          <SkeletonBone
            data-slot="sidebar-skeleton-icon"
            animated={false}
            className="size-5 shrink-0 rounded bg-sidebar-accent"
          />
          {expanded && (
            <SkeletonBone
              data-slot="sidebar-skeleton-label"
              animated={false}
              className={cn(
                "h-4 rounded bg-sidebar-accent",
                index % 2 ? "w-1/2" : "w-3/4",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SidebarContentView({
  item,
  active,
  onNavigate,
  isMobile,
  setOpenMobile,
}: {
  item: SidebarNavItem;
  active: boolean;
  onNavigate: (item: SidebarNavItem) => void;
  isMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <SidebarMenuButton
      icon={item.icon ?? <IconMenu2 />}
      isActive={active}
      badge={item.badge}
      badgeVariant={item.badgeVariant}
      disabled={item.disabled}
      disabledReason={item.disabledReason}
      aria-current={active ? "page" : undefined}
      render={
        item.href && !item.disabled ? (
          <a href={item.href}>{item.label}</a>
        ) : undefined
      }
      nativeButton={!item.href || item.disabled}
      onClick={(event) =>
        sidebarCallback2(event, item, onNavigate, isMobile, setOpenMobile)
      }
    >
      {item.label}
    </SidebarMenuButton>
  );
}

function SidebarReorderActionsView({
  index,
  items,
  item,
  setDraggedId,
  move,
}: {
  index: number;
  items: readonly SidebarNavItem[];
  item: SidebarNavItem;
  setDraggedId: React.Dispatch<React.SetStateAction<string | null>>;
  move: (id: string, destination: number) => void;
}) {
  return (
    <div
      data-slot="sidebar-reorder-actions"
      className="flex items-center justify-end gap-1 pb-1"
    >
      {/* kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics */}
      <span
        data-slot="sidebar-favorite-position"
        className="me-auto ps-2.5 text-xs text-muted-foreground tabular-nums"
      >
        {index + 1} of {items.length}
      </span>
      <button
        type="button"
        data-slot="sidebar-drag-handle"
        draggable
        aria-label={`Drag ${item.label} to reorder; arrow buttons also available`}
        className={cn(
          sidebarActionVariants(),
          "cursor-grab active:cursor-grabbing",
        )}
        onDragStart={(event) => {
          setDraggedId(item.id);
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData(
            "application/x-kira-sidebar-favorite",
            item.id,
          );
        }}
        onDragEnd={() => setDraggedId(null)}
      >
        <IconGripVertical aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        data-slot="sidebar-move-up"
        aria-label={`Move ${item.label} up`}
        aria-disabled={index === 0}
        className={sidebarActionVariants()}
        onClick={() => move(item.id, index - 1)}
      >
        <IconArrowUp aria-hidden="true" className="size-4" />
      </button>
      <button
        type="button"
        data-slot="sidebar-move-down"
        aria-label={`Move ${item.label} down`}
        aria-disabled={index === items.length - 1}
        className={sidebarActionVariants()}
        onClick={() => move(item.id, index + 1)}
      >
        <IconArrowDown aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

function SidebarPinView({
  item,
  pinned,
  updatePinned,
}: {
  item: SidebarNavItem;
  pinned: string[];
  updatePinned: (next: string[], message: string) => void;
}) {
  return (
    <TogglePrimitive
      data-slot="sidebar-pin"
      aria-label={`Favorite ${item.label}`}
      pressed={pinned.includes(item.id)}
      className={cn(
        sidebarActionVariants(),
        "mt-0.5 data-pressed:text-sidebar-primary",
      )}
      onPressedChange={(pressed) =>
        updatePinned(
          pressed
            ? [...pinned, item.id]
            : pinned.filter((id) => id !== item.id),
          `${item.label} ${pressed ? "added to" : "removed from"} Favorites.`,
        )
      }
    >
      <IconStar
        aria-hidden="true"
        className={cn(
          "size-4",
          { "fill-current": pinned.includes(item.id) },
          "motion-safe:transition-colors motion-safe:duration-150",
        )}
      />
    </TogglePrimitive>
  );
}

function useSidebarProviderSettings({
  children,
  collapsible: collapsibleInput,
  side: sideInput,
  defaultCollapsed: defaultCollapsedInput,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  openMobile: controlledMobile,
  onOpenMobileChange,
  persistState: persistStateInput,
  storageKey: storageKeyInput,
  width: widthInput,
  collapsedWidth: collapsedWidthInput,
  hoverExpand: hoverExpandInput,
  motion: motionInput,
  mobile,
  keyboardShortcut: keyboardShortcutInput,
  shortcutScope: shortcutScopeInput,
  className,
  onKeyDown,
  ...props
}: SidebarProviderProps) {
  const {
    collapsible,
    side,
    defaultCollapsed,
    persistState,
    storageKey,
    width,
  } = useSidebarProviderOptions({
    collapsible: collapsibleInput,
    side: sideInput,
    defaultCollapsed: defaultCollapsedInput,
    persistState: persistStateInput,
    storageKey: storageKeyInput,
    width: widthInput,
  });

  const {
    collapsedWidth,
    hoverExpand,
    motion,
    keyboardShortcut,
    shortcutScope,
  } = useSidebarProviderOptions2({
    collapsedWidth: collapsedWidthInput,
    hoverExpand: hoverExpandInput,
    motion: motionInput,
    keyboardShortcut: keyboardShortcutInput,
    shortcutScope: shortcutScopeInput,
  });

  return {
    children,
    collapsible,
    side,
    defaultCollapsed,
    controlledCollapsed,
    onCollapsedChange,
    controlledMobile,
    onOpenMobileChange,
    persistState,
    storageKey,
    width,
    collapsedWidth,
    hoverExpand,
    motion,
    mobile,
    keyboardShortcut,
    shortcutScope,
    className,
    onKeyDown,
    props,
  };
}

function useSidebarProviderModel(input: SidebarProviderProps) {
  const settings = useSidebarProviderSettings(input);

  const { motion, keyboardShortcut, shortcutScope } = settings;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const searchPendingRef = React.useRef(false);
  const mobileTriggerRef = React.useRef<HTMLButtonElement>(null);
  const id = React.useId();

  const viewportMobile = React.useSyncExternalStore(
    subscribeMobile,
    mobileSnapshot,
    desktopSnapshot,
  );

  const isMobile = settings.mobile ?? viewportMobile;

  const { reducedMotion, animate, captureLayout, setPointerIntent } =
    useSidebarPointerMotion(rootRef, motion, isMobile);

  const {
    collapsed,
    setCollapsed,
    openMobile,
    setOpenMobile,
    isHoverExpanded,
    setIsHoverExpanded,
  } = useSidebarDisclosure(settings, isMobile, captureLayout);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((previous) => !previous);
    else setCollapsed((previous) => !previous);
  }, [isMobile, setOpenMobile, setCollapsed]);

  const { handleShortcut, focusSearch } = useSidebarShortcuts({
    searchRef,
    searchPendingRef,
    isMobile,
    setOpenMobile,
    setCollapsed,
    openMobile,
    id,
    keyboardShortcut,
    toggleSidebar,
  });

  React.useEffect(
    () =>
      sidebarUseEffect2(
        shortcutScope,
        rootRef,
        setPointerIntent,
        handleShortcut,
      ),
    [shortcutScope, handleShortcut, setPointerIntent],
  );

  return {
    ...settings,
    collapsed,
    setCollapsed,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    isHoverExpanded,
    setIsHoverExpanded,
    reducedMotion,
    animate,
    captureLayout,
    setPointerIntent,
    id,
    searchRef,
    searchPendingRef,
    mobileTriggerRef,
    focusSearch,
    rootRef,
    handleShortcut,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function SidebarProviderView({
  collapsed,
  setCollapsed,
  isMobile,
  openMobile,
  setOpenMobile,
  toggleSidebar,
  collapsible,
  side,
  width,
  collapsedWidth,
  hoverExpand,
  isHoverExpanded,
  setIsHoverExpanded,
  reducedMotion,
  animate,
  motion,
  captureLayout,
  setPointerIntent,
  id,
  searchRef,
  searchPendingRef,
  mobileTriggerRef,
  focusSearch,
  props,
  rootRef,
  className,
  onKeyDown,
  handleShortcut,
  children,
}: ReturnType<typeof useSidebarProviderModel>) {
  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        collapsible,
        side,
        width,
        collapsedWidth,
        hoverExpand,
        isHoverExpanded,
        setIsHoverExpanded,
        reducedMotion,
        motion: animate,
        loadingMotion: motion && !reducedMotion,
        captureLayout,
        setPointerIntent,
        expanded:
          isMobile ||
          !collapsed ||
          (hoverExpand && collapsible === "icon" && isHoverExpanded),
        sidebarId: `${id}-sidebar`,
        contentId: `${id}-content`,
        searchRef,
        searchPendingRef,
        mobileTriggerRef,
        focusSearch,
      }}
    >
      <SidebarProviderView2
        props={props}
        rootRef={rootRef}
        id={id}
        animate={animate}
        collapsed={collapsed}
        side={side}
        collapsible={collapsible}
        className={className}
        setPointerIntent={setPointerIntent}
        onKeyDown={onKeyDown}
        handleShortcut={handleShortcut}
      >
        {children}
      </SidebarProviderView2>
    </SidebarContext.Provider>
  );
}

function useSidebarSearchModel({
  placeholder = "Find a view…",
  value,
  defaultValue = "",
  onChange,
  label = "Search navigation",
  className,
  ...props
}: SidebarSearchProps) {
  const {
    expanded,
    isMobile,
    searchRef,
    searchPendingRef,
    focusSearch,
    contentId,
  } = useSidebar();

  const [localValue, setLocalValue] = React.useState(defaultValue);
  const id = React.useId();
  const searchValue = value ?? localValue;

  const change = (next: string) => {
    if (value === undefined) setLocalValue(next);
    onChange?.(next);
  };

  React.useEffect(() => {
    // Drawer initialFocus owns mobile focus; an effect would race its autofocus.
    if (
      !isMobile &&
      expanded &&
      searchPendingRef.current &&
      searchRef.current
    ) {
      searchRef.current.focus();
      searchPendingRef.current = false;
    }
  }, [expanded, isMobile, searchRef, searchPendingRef]);

  return {
    expanded,
    label,
    className,
    focusSearch,
    props,
    id,
    searchRef,
    searchValue,
    placeholder,
    contentId,
    change,
  };
}

function SidebarSearchView({
  expanded,
  label,
  className,
  focusSearch,
  props,
  id,
  searchRef,
  searchValue,
  placeholder,
  contentId,
  change,
}: ReturnType<typeof useSidebarSearchModel>) {
  return (
    <div data-slot="sidebar-search" className="shrink-0 px-2 py-2">
      {!expanded && (
        <SidebarHint label={label} slot="sidebar-search-trigger">
          <button
            type="button"
            data-slot="sidebar-search-trigger"
            className={cn(
              sidebarMenuButtonVariants({ compact: true }),
              className,
            )}
            aria-label={label}
            onClick={focusSearch}
          >
            <IconSearch aria-hidden="true" className="size-5" />
          </button>
        </SidebarHint>
      )}
      <div data-slot="sidebar-search-field" hidden={!expanded}>
        <label
          data-slot="sidebar-search-label"
          htmlFor={props.id ?? id}
          className="mb-1.5 block px-1 text-xs font-medium text-muted-foreground"
        >
          {label}
        </label>
        <div data-slot="sidebar-search-control" className="relative">
          <IconSearch
            aria-hidden="true"
            className="pointer-events-none absolute inset-s-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <SidebarSearchInputView
            props={props}
            searchRef={searchRef}
            id={id}
            searchValue={searchValue}
            placeholder={placeholder}
            contentId={contentId}
            className={className}
            change={change}
          />
          {searchValue && (
            <button
              type="button"
              data-slot="sidebar-search-clear"
              aria-label="Clear navigation search"
              className={cn(
                sidebarActionVariants(),
                "absolute inset-e-0.5 top-1/2 -translate-y-1/2",
              )}
              onClick={() => {
                change("");
                searchRef.current?.focus();
              }}
            >
              <IconX aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function useSidebarItemModel({
  to,
  icon,
  children,
  level: levelInput,
  badge,
  badgeVariant: badgeVariantInput,
  shortcut,
  disabled: disabledInput,
  disabledReason,
  isActive: activeProp,
  className,
  closeMobileOnClick: closeMobileOnClickInput,
  onClick,
  style,
  ...props
}: SidebarItemProps) {
  const { level, badgeVariant, disabled, closeMobileOnClick } =
    useSidebarItemOptions({
      level: levelInput,
      badgeVariant: badgeVariantInput,
      disabled: disabledInput,
      closeMobileOnClick: closeMobileOnClickInput,
    });

  const { expanded, isMobile, setOpenMobile } = useSidebar();
  const matchRoute = useMatchRoute();
  const isActive = activeProp ?? !!matchRoute({ to, fuzzy: false });

  const link = (
    <Link
      {...props}
      to={to}
      disabled={disabled}
      data-slot="sidebar-item"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? 0 : props.tabIndex}
      className={cn(
        sidebarMenuButtonVariants({ isActive, compact: !expanded }),
        className,
      )}
      style={{
        paddingInlineStart:
          expanded && level > 0
            ? `${0.625 + Math.min(6, Math.max(0, level)) * 0.75}rem`
            : undefined,
        ...style,
      }}
      onClick={(event) =>
        sidebarCallback3(
          event,
          disabled,
          onClick,
          isMobile,
          closeMobileOnClick,
          setOpenMobile,
        )
      }
    >
      <SidebarRowContent
        icon={icon}
        badge={badge}
        badgeVariant={badgeVariant}
        shortcut={shortcut}
        disabledReason={disabled ? disabledReason : undefined}
      >
        {children}
      </SidebarRowContent>
    </Link>
  );

  return { children, disabled, disabledReason, link };
}

function SidebarItemView({
  children,
  disabled,
  disabledReason,
  link,
}: ReturnType<typeof useSidebarItemModel>) {
  return (
    <SidebarHint
      label={
        <>
          {children}
          {disabled && disabledReason && (
            <span className="block text-xs">{disabledReason}</span>
          )}
        </>
      }
    >
      {link}
    </SidebarHint>
  );
}

function useSidebarFavoriteListModel({
  items,
  activeId,
  onNavigate,
  onReorder,
  reorderable,
}: SidebarFavoriteListProps) {
  const { expanded, captureLayout } = useSidebar();
  const [editing, setEditing] = React.useState(false);
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const canEdit = expanded && reorderable && items.length > 1;
  const showControls = canEdit && editing;

  const move = (id: string, destination: number) =>
    sidebarMove(id, destination, items, captureLayout, onReorder);

  return {
    canEdit,
    editing,
    setEditing,
    showControls,
    items,
    draggedId,
    move,
    setDraggedId,
    activeId,
    onNavigate,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function SidebarFavoriteListView({
  canEdit,
  editing,
  setEditing,
  showControls,
  items,
  draggedId,
  move,
  setDraggedId,
  activeId,
  onNavigate,
}: ReturnType<typeof useSidebarFavoriteListModel>) {
  return (
    <SidebarGroup
      label="Favorites"
      action={
        canEdit && (
          <button
            type="button"
            data-slot="sidebar-reorder-toggle"
            aria-label="Reorder favorites"
            aria-pressed={editing}
            className={sidebarActionVariants()}
            onClick={() => setEditing((previous) => !previous)}
          >
            {editing ? (
              <IconX aria-hidden="true" className="size-4" />
            ) : (
              <IconGripVertical aria-hidden="true" className="size-4" />
            )}
          </button>
        )
      }
    >
      {showControls && (
        // kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics
        <p
          data-slot="sidebar-reorder-help"
          className="px-2.5 pb-1 text-xs leading-5 text-muted-foreground"
        >
          Drag a handle or use the arrow buttons.
        </p>
      )}
      <SidebarMenu aria-label="Favorite views">
        {items.map((item, index) => (
          <SidebarMenuItem key={item.id} data-favorite-id={item.id}>
            <div
              data-slot="sidebar-favorite-row"
              data-dragging={draggedId === item.id || undefined}
              className="min-w-0 rounded-lg data-dragging:opacity-50"
              onDragOver={(event) => {
                if (showControls && draggedId) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }
              }}
              onDrop={(event) =>
                sidebarCallback4(
                  event,
                  showControls,
                  draggedId,
                  move,
                  index,
                  setDraggedId,
                )
              }
            >
              <SidebarDestination
                item={item}
                active={activeId === item.id}
                onNavigate={onNavigate}
              />
              {showControls && (
                <SidebarReorderActionsView
                  index={index}
                  items={items}
                  item={item}
                  setDraggedId={setDraggedId}
                  move={move}
                />
              )}
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function useKiraSidebarSettings({
  sections,
  title: titleInput,
  logo,
  header,
  footer,
  user,
  activeId: controlledActive,
  defaultActiveId,
  onNavigate,
  searchable: searchableInput,
  searchLabel: searchLabelInput,
  searchValue,
  onSearchValueChange,
  favorites: favoritesInput,
  pinnedIds: controlledPinned,
  defaultPinnedIds: defaultPinnedIdsInput,
  onPinnedIdsChange,
  reorderable: reorderableInput,
  readOnly: readOnlyInput,
  loading: loadingInput,
  error,
  onRetry,
  emptyMessage: emptyMessageInput,
  ...props
}: KiraSidebarProps) {
  const {
    title,
    searchable,
    searchLabel,
    favorites,
    defaultPinnedIds,
    reorderable,
  } = useKiraSidebarOptions({
    title: titleInput,
    searchable: searchableInput,
    searchLabel: searchLabelInput,
    favorites: favoritesInput,
    defaultPinnedIds: defaultPinnedIdsInput,
    reorderable: reorderableInput,
  });

  const { readOnly, loading, emptyMessage } = useKiraSidebarOptions2({
    readOnly: readOnlyInput,
    loading: loadingInput,
    emptyMessage: emptyMessageInput,
  });

  return {
    sections,
    title,
    logo,
    header,
    footer,
    user,
    controlledActive,
    defaultActiveId,
    onNavigate,
    searchable,
    searchLabel,
    searchValue,
    onSearchValueChange,
    favorites,
    controlledPinned,
    defaultPinnedIds,
    onPinnedIdsChange,
    reorderable,
    readOnly,
    loading,
    error,
    onRetry,
    emptyMessage,
    props,
  };
}

function useKiraSidebarModel(input: KiraSidebarProps) {
  const settings = useKiraSidebarSettings(input);

  const {
    sections,
    title,
    logo,
    header,
    controlledActive,
    defaultActiveId,
    onNavigate,
    searchable,
    searchValue,
    onSearchValueChange,
    controlledPinned,
    defaultPinnedIds,
    onPinnedIdsChange,
    readOnly,
    loading,
    error,
    props,
  } = settings;

  const { expanded } = useSidebar();
  const [localActive, setLocalActive] = React.useState(defaultActiveId);
  const [localQuery, setLocalQuery] = React.useState("");

  const [localPinned, setLocalPinned] =
    React.useState<readonly string[]>(defaultPinnedIds);

  const [announcement, setAnnouncement] = React.useState("");
  const activeId = controlledActive ?? localActive;
  const query = searchValue ?? localQuery;
  const filter = searchable ? searchableText(query.trim()) : "";

  const collection = sidebarCollection(
    sections,
    controlledPinned ?? localPinned,
    filter,
  );

  const { matchCount } = collection;

  const changeQuery = (next: string) => {
    if (searchValue === undefined) setLocalQuery(next);
    onSearchValueChange?.(next);
  };

  const navigate = (item: SidebarNavItem) => {
    if (item.disabled) return;

    if (controlledActive === undefined) setLocalActive(item.id);
    onNavigate?.(item);
  };

  const updatePinned = (next: string[], message: string) => {
    if (readOnly) return;

    if (controlledPinned === undefined) setLocalPinned(next);
    onPinnedIdsChange?.(next);
    setAnnouncement(message);
  };

  const buildContent = () => (
    <KiraSidebarCollectionView
      {...settings}
      {...collection}
      filter={filter}
      activeId={activeId}
      navigate={navigate}
      updatePinned={updatePinned}
      expanded={expanded}
      changeQuery={changeQuery}
      query={query}
    />
  );

  return {
    props,
    title,
    buildHeader: () => header ?? <SidebarHeader title={title} logo={logo} />,
    searchable,
    query,
    changeQuery,
    searchLabel: settings.searchLabel,
    loading,
    buildContent,
    buildFooter: () => sidebarFooterContent(settings),
    resolveValue6: () =>
      sidebarResolveValue6(loading, error, filter, matchCount, announcement),
  };
}

function KiraSidebarView({
  props,
  title,
  buildHeader,
  searchable,
  query,
  changeQuery,
  searchLabel,
  loading,
  buildContent,
  buildFooter,
  resolveValue6,
}: ReturnType<typeof useKiraSidebarModel>) {
  return (
    <Sidebar
      {...props}
      aria-label={props["aria-label"] ?? `${title} navigation`}
    >
      {buildHeader()}
      {searchable && (
        <SidebarSearch
          value={query}
          onChange={changeQuery}
          label={searchLabel}
        />
      )}
      <SidebarContent aria-busy={loading || undefined}>
        {buildContent()}
      </SidebarContent>
      {buildFooter()}
      <output
        data-slot="sidebar-status"

        aria-atomic="true"
        className="block sr-only"
      >
        {resolveValue6()}
      </output>
    </Sidebar>
  );
}

function sidebarResolveValue6(
  loading: boolean,
  error: string | undefined,
  filter: string,
  matchCount: number,
  announcement: string,
) {
  if (loading) {
    return "Loading navigation." as const;
  }

  if (error) {
    return `Navigation unavailable. ${error}`;
  }

  if (filter) {
    return `${matchCount} ${matchCount === 1 ? "view matches" : "views match"} your search.`;
  }

  return announcement;
}

function SidebarProviderView2({
  props,
  rootRef,
  id,
  animate,
  collapsed,
  side,
  collapsible,
  className,
  setPointerIntent,
  onKeyDown,
  handleShortcut,
  children,
}: SidebarProviderView2Params) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- This container delegates hover/focus behavior and scoped shortcuts to its interactive descendants.
    <div
      {...props}
      ref={rootRef}
      data-slot="sidebar-provider"
      data-sidebar-provider={id}
      data-motion={animate ? "pointer" : "instant"}
      data-collapsed={collapsed}
      data-side={side}
      data-collapsible={collapsible}
      className={cn("min-h-0 min-w-0", className)}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event);

        if (
          event.defaultPrevented ||
          event.pointerType !== "mouse" ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        setPointerIntent(true);
      }}
      onPointerDownCapture={(event) => {
        props.onPointerDownCapture?.(event);

        if (event.defaultPrevented) return;
        setPointerIntent(true);
      }}
      onClickCapture={(event) => {
        props.onClickCapture?.(event);

        if (event.defaultPrevented) return;
        setPointerIntent(event.detail > 0);
      }}
      onKeyDownCapture={(event) => {
        props.onKeyDownCapture?.(event);
        setPointerIntent(false);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) return;
        handleShortcut(event.nativeEvent);

        if (event.nativeEvent.defaultPrevented) event.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}

function SidebarSearchInputView({
  props,
  searchRef,
  id,
  searchValue,
  placeholder,
  contentId,
  className,
  change,
}: {
  props: ReturnType<typeof useSidebarSearchModel>["props"];
  searchRef: ReturnType<typeof useSidebarSearchModel>["searchRef"];
  id: ReturnType<typeof useSidebarSearchModel>["id"];
  searchValue: ReturnType<typeof useSidebarSearchModel>["searchValue"];
  placeholder: ReturnType<typeof useSidebarSearchModel>["placeholder"];
  contentId: ReturnType<typeof useSidebarSearchModel>["contentId"];
  className: ReturnType<typeof useSidebarSearchModel>["className"];
  change: ReturnType<typeof useSidebarSearchModel>["change"];
}) {
  return (
    <input
      {...props}
      ref={searchRef}
      id={props.id ?? id}
      data-slot="sidebar-search-input"
      type="search"
      value={searchValue}
      placeholder={placeholder}
      autoComplete="off"
      aria-controls={contentId}
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-sidebar-border bg-sidebar pe-9 ps-8 text-sm [&::-webkit-search-cancel-button]:appearance-none pointer-coarse:h-11 pointer-coarse:text-base",
        focusRing,
        className,
      )}
      onChange={(event) => change(event.target.value)}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);

        if (!event.defaultPrevented && event.key === "Escape" && searchValue) {
          event.preventDefault();
          event.stopPropagation();
          change("");
        }
      }}
    />
  );
}

function useSidebarProviderOptions({
  collapsible: collapsibleInput,
  side: sideInput,
  defaultCollapsed: defaultCollapsedInput,
  persistState: persistStateInput,
  storageKey: storageKeyInput,
  width: widthInput,
}: Parameters<typeof resolveSidebarProviderOptions>[0]) {
  return React.useMemo(
    () =>
      resolveSidebarProviderOptions({
        collapsible: collapsibleInput,
        side: sideInput,
        defaultCollapsed: defaultCollapsedInput,
        persistState: persistStateInput,
        storageKey: storageKeyInput,
        width: widthInput,
      }),
    [
      collapsibleInput,
      sideInput,
      defaultCollapsedInput,
      persistStateInput,
      storageKeyInput,
      widthInput,
    ],
  );
}

function useSidebarProviderOptions2({
  collapsedWidth: collapsedWidthInput,
  hoverExpand: hoverExpandInput,
  motion: motionInput,
  keyboardShortcut: keyboardShortcutInput,
  shortcutScope: shortcutScopeInput,
}: Parameters<typeof resolveSidebarProviderOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveSidebarProviderOptions2({
        collapsedWidth: collapsedWidthInput,
        hoverExpand: hoverExpandInput,
        motion: motionInput,
        keyboardShortcut: keyboardShortcutInput,
        shortcutScope: shortcutScopeInput,
      }),
    [
      collapsedWidthInput,
      hoverExpandInput,
      motionInput,
      keyboardShortcutInput,
      shortcutScopeInput,
    ],
  );
}

function useSidebarItemOptions({
  level: levelInput,
  badgeVariant: badgeVariantInput,
  disabled: disabledInput,
  closeMobileOnClick: closeMobileOnClickInput,
}: Parameters<typeof resolveSidebarItemOptions>[0]) {
  return React.useMemo(
    () =>
      resolveSidebarItemOptions({
        level: levelInput,
        badgeVariant: badgeVariantInput,
        disabled: disabledInput,
        closeMobileOnClick: closeMobileOnClickInput,
      }),
    [levelInput, badgeVariantInput, disabledInput, closeMobileOnClickInput],
  );
}

function useKiraSidebarOptions({
  title: titleInput,
  searchable: searchableInput,
  searchLabel: searchLabelInput,
  favorites: favoritesInput,
  defaultPinnedIds: defaultPinnedIdsInput,
  reorderable: reorderableInput,
}: Parameters<typeof resolveKiraSidebarOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraSidebarOptions({
        title: titleInput,
        searchable: searchableInput,
        searchLabel: searchLabelInput,
        favorites: favoritesInput,
        defaultPinnedIds: defaultPinnedIdsInput,
        reorderable: reorderableInput,
      }),
    [
      titleInput,
      searchableInput,
      searchLabelInput,
      favoritesInput,
      defaultPinnedIdsInput,
      reorderableInput,
    ],
  );
}

function useKiraSidebarOptions2({
  readOnly: readOnlyInput,
  loading: loadingInput,
  emptyMessage: emptyMessageInput,
}: Parameters<typeof resolveKiraSidebarOptions2>[0]) {
  return React.useMemo(
    () =>
      resolveKiraSidebarOptions2({
        readOnly: readOnlyInput,
        loading: loadingInput,
        emptyMessage: emptyMessageInput,
      }),
    [readOnlyInput, loadingInput, emptyMessageInput],
  );
}

function sidebarContext(
  contextRef: React.RefObject<gsap.Context | null>,
  getContext: () => gsap.Context,
  cancel: () => void,
  timelineRef: React.RefObject<gsap.core.Timeline | null>,
  offsets: Map<HTMLElement, { x: number; y: number }>,
  Math: Math,
) {
  const timeline = gsap.timeline({
    defaults: { duration: 0.2, ease: sidebarLayoutEase },
    onComplete: () => {
      if (contextRef.current === getContext()) cancel();
    },
  });

  timelineRef.current = timeline;

  for (const [node, offset] of offsets) {
    const { x, y } = sidebarRelativeOffset(node, offset, offsets);

    if (Math.abs(x) < 0.5 && Math.abs(y) < 0.5) continue;
    const originalX = gsap.getProperty(node, "x");
    const originalY = gsap.getProperty(node, "y");
    timeline.fromTo(
      node,
      { x: `+=${x}`, y: `+=${y}` },
      { x: originalX, y: originalY },
      0,
    );
  }
}

function sidebarUseState() {
  const stored = readStorage("kira-theme");

  if (stored === "light" || stored === "dark") return stored;

  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function sidebarUseCallback(
  update: React.SetStateAction<boolean>,
  pending: React.RefObject<boolean | undefined>,
  value: boolean,
  onRequest: (next: boolean) => void,
) {
  const previous = pending.current ?? value;
  const next = isFunctionProp(update) ? update(previous) : update;

  if (next === previous) return;
  pending.current = next;
  queueMicrotask(() => {
    pending.current = undefined;
  });
  onRequest(next);
}

function sidebarUseCallback2(persistState: boolean, storageKey: string) {
  const resolveValue1 = () => {
    if (stored === "true") {
      return true;
    }

    if (stored === "false") {
      return false;
    }

    return null;
  };

  if (!persistState) return null;
  const stored = readStorage(storageKey);

  return resolveValue1();
}

function sidebarUseCallback3(
  next: boolean,
  controlled: boolean | undefined,
  setLocal: React.Dispatch<
    React.SetStateAction<{
      key: string;
      stored: boolean | null;
      value: boolean;
    }>
  >,
  storageKey: string,
  stored: boolean | null,
  persistState: boolean,
  onCollapsedChange: ((collapsed: boolean) => void) | undefined,
) {
  if (controlled === undefined) {
    setLocal({ key: storageKey, stored, value: next });

    if (persistState) writeStorage(storageKey, String(next));
  }

  onCollapsedChange?.(next);
}

function sidebarResolveWidth2(
  hidden: boolean,
  collapsed: boolean,
  collapsedWidth: string,
  width: string,
) {
  if (hidden) {
    return "0px" as const;
  }

  if (collapsed) {
    return collapsedWidth;
  }

  return width;
}

function sidebarResolveClipPath3(
  hidden: boolean,
  collapsed: boolean,
  peek: boolean,
  collapsedWidth: string,
) {
  if (hidden) {
    return "100%" as const;
  }

  if (collapsed && !peek) {
    return `calc(100% - ${collapsedWidth})`;
  }

  return "0px" as const;
}

function sidebarCallback(
  searchPendingRef: React.RefObject<boolean>,
  searchRef: React.RefObject<HTMLInputElement | null>,
) {
  if (
    searchPendingRef.current &&
    searchRef.current &&
    !searchRef.current.disabled
  ) {
    searchPendingRef.current = false;

    return searchRef.current;
  }

  return true;
}

function sidebarSetTimeout(
  hoverTimer: React.RefObject<number | null>,
  navRef: React.RefObject<HTMLElement | null>,
  captureLayout: () => void,
  setIsHoverExpanded: React.Dispatch<React.SetStateAction<boolean>>,
) {
  hoverTimer.current = null;

  if (
    navRef.current &&
    !navRef.current.matches(":hover") &&
    !navRef.current.contains(document.activeElement)
  ) {
    captureLayout();
    setIsHoverExpanded(false);
  }
}

function sidebarResolveSide5(isMobile: boolean, side: SidebarSide) {
  if (isMobile) {
    return "top" as const;
  }

  if (side === "left") {
    return "right" as const;
  }

  return "left" as const;
}

function sidebarUseEffect(
  rowsRef: React.RefObject<HTMLDivElement | null>,
  loadingMotion: boolean,
) {
  const rows = rowsRef.current;

  if (!rows || !loadingMotion) return;
  let visible = false;

  const update = () => {
    rows.style.animationPlayState =
      visible && !document.hidden ? "running" : "paused";
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });

  observer.observe(rows);
  document.addEventListener("visibilitychange", update);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
    rows.style.animationPlayState = "paused";
  };
}

function sidebarCallback2(
  event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>,
  item: SidebarNavItem,
  onNavigate: (item: SidebarNavItem) => void,
  isMobile: boolean,
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (
    event.defaultPrevented ||
    item.disabled ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  onNavigate(item);

  if (isMobile) setOpenMobile(false);
}

function sidebarUseCallback4(
  searchRef: React.RefObject<HTMLInputElement | null>,
  searchPendingRef: React.RefObject<boolean>,
  isMobile: boolean,
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>,
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
  openMobile: boolean,
) {
  if (!searchRef.current || searchRef.current.disabled) return;
  searchPendingRef.current = true;

  if (isMobile) setOpenMobile(true);
  else setCollapsed(false);

  if (
    (!isMobile || openMobile) &&
    !searchRef.current.closest("[hidden], [inert]")
  ) {
    searchRef.current.focus();
    searchPendingRef.current = false;
  }
}

function sidebarUseCallback5(
  event: KeyboardEvent,
  id: string,
  keyboardShortcut: string | false,
  toggleSidebar: () => void,
  searchRef: React.RefObject<HTMLInputElement | null>,
  focusSearch: () => void,
) {
  if (
    !sidebarShortcutEligible(event) ||
    !sidebarShortcutOwner(event.target, id)
  )
    return;

  if (
    keyboardShortcut &&
    event.key.toLowerCase() === keyboardShortcut.toLowerCase()
  ) {
    event.preventDefault();
    toggleSidebar();
  } else if (
    event.key.toLowerCase() === "k" &&
    searchRef.current &&
    !searchRef.current.disabled
  ) {
    event.preventDefault();
    focusSearch();
  }
}

function sidebarUseEffect2(
  shortcutScope: "provider" | "global",
  rootRef: React.RefObject<HTMLDivElement | null>,
  setPointerIntent: (pointer: boolean) => void,
  handleShortcut: (event: KeyboardEvent) => void,
) {
  if (shortcutScope !== "global") return;

  const onGlobalKeyDown = (event: KeyboardEvent) => {
    const root = rootRef.current;

    if (!root?.getClientRects().length) return;

    const nearest =
      event.target instanceof Element
        ? event.target.closest("[data-sidebar-provider]")
        : null;

    if (nearest && nearest !== root) return;
    setPointerIntent(false);
    handleShortcut(event);
  };

  window.addEventListener("keydown", onGlobalKeyDown);

  return () => window.removeEventListener("keydown", onGlobalKeyDown);
}

function sidebarCallback3(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  disabled: boolean,
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined,
  isMobile: boolean,
  closeMobileOnClick: boolean,
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>,
) {
  if (disabled) {
    event.preventDefault();

    return;
  }

  onClick?.(event);

  if (
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey &&
    isMobile &&
    closeMobileOnClick
  )
    setOpenMobile(false);
}

function sidebarMove(
  id: string,
  destination: number,
  items: readonly SidebarNavItem[],
  captureLayout: () => void,
  onReorder: (ids: string[], label: string, position: number) => void,
) {
  const source = items.findIndex((item) => item.id === id);
  const item = items[source];

  if (
    !item ||
    source === destination ||
    destination < 0 ||
    destination >= items.length
  )
    return;
  const ids = items.map((entry) => entry.id);
  ids.splice(source, 1);
  ids.splice(destination, 0, id);
  captureLayout();
  onReorder(ids, item.label, destination + 1);
}

function sidebarCallback4(
  event: React.DragEvent<HTMLDivElement>,
  showControls: boolean,
  draggedId: string | null,
  move: (id: string, destination: number) => void,
  index: number,
  setDraggedId: React.Dispatch<React.SetStateAction<string | null>>,
) {
  if (
    !showControls ||
    !draggedId ||
    event.dataTransfer.getData("application/x-kira-sidebar-favorite") !==
      draggedId
  )
    return;
  event.preventDefault();
  move(draggedId, index);
  setDraggedId(null);
}

function useSidebarShortcuts({
  searchRef,
  searchPendingRef,
  isMobile,
  setOpenMobile,
  setCollapsed,
  openMobile,
  id,
  keyboardShortcut,
  toggleSidebar,
}: {
  searchRef: React.RefObject<HTMLInputElement | null>;
  searchPendingRef: React.RefObject<boolean>;
  isMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  id: string;
  keyboardShortcut: string | false;
  toggleSidebar: () => void;
}) {
  const focusSearch = React.useCallback(
    () =>
      sidebarUseCallback4(
        searchRef,
        searchPendingRef,
        isMobile,
        setOpenMobile,
        setCollapsed,
        openMobile,
      ),
    [
      isMobile,
      openMobile,
      setOpenMobile,
      setCollapsed,
      searchRef,
      searchPendingRef,
    ],
  );

  const handleShortcut = React.useCallback(
    (event: KeyboardEvent) =>
      sidebarUseCallback5(
        event,
        id,
        keyboardShortcut,
        toggleSidebar,
        searchRef,
        focusSearch,
      ),
    [id, keyboardShortcut, toggleSidebar, focusSearch, searchRef],
  );

  return { handleShortcut, focusSearch } satisfies {
    handleShortcut: typeof handleShortcut;
    focusSearch: typeof focusSearch;
  };
}

type SidebarProviderView2Params = {
  props: ReturnType<typeof useSidebarProviderModel>["props"];
  rootRef: ReturnType<typeof useSidebarProviderModel>["rootRef"];
  id: ReturnType<typeof useSidebarProviderModel>["id"];
  animate: ReturnType<typeof useSidebarProviderModel>["animate"];
  collapsed: ReturnType<typeof useSidebarProviderModel>["collapsed"];
  side: ReturnType<typeof useSidebarProviderModel>["side"];
  collapsible: ReturnType<typeof useSidebarProviderModel>["collapsible"];
  className: ReturnType<typeof useSidebarProviderModel>["className"];
  setPointerIntent: ReturnType<
    typeof useSidebarProviderModel
  >["setPointerIntent"];
  onKeyDown: ReturnType<typeof useSidebarProviderModel>["onKeyDown"];
  handleShortcut: ReturnType<typeof useSidebarProviderModel>["handleShortcut"];
  children: ReturnType<typeof useSidebarProviderModel>["children"];
};

function useSidebarPointerMotion(
  rootRef: React.RefObject<HTMLDivElement | null>,
  motion: boolean,
  isMobile: boolean,
) {
  const reducedMotion = useReducedMotion();
  const pointerRef = React.useRef(false);
  const [pointerMotion, setPointerMotion] = React.useState(false);

  const { capture: captureLayout, cancel: cancelLayout } =
    useSidebarLayoutMotion(
      rootRef,
      motion && !reducedMotion && !isMobile,
      pointerRef,
    );

  const animate = motion && !reducedMotion && pointerMotion;

  const setPointerIntent = React.useCallback(
    (pointer: boolean) => {
      pointerRef.current = pointer;
      setPointerMotion(pointer);

      if (!pointer) cancelLayout();
    },
    [cancelLayout],
  );

  return { reducedMotion, animate, captureLayout, setPointerIntent };
}

function useSidebarDisclosure(
  {
    collapsible,
    defaultCollapsed,
    controlledCollapsed,
    onCollapsedChange,
    controlledMobile,
    onOpenMobileChange,
    persistState,
    storageKey,
    hoverExpand,
  }: ReturnType<typeof useSidebarProviderSettings>,
  isMobile: boolean,
  captureLayout: () => void,
) {
  const [localMobile, setLocalMobile] = React.useState(false);
  const [previousMobile, setPreviousMobile] = React.useState(isMobile);
  const [isHoverExpanded, setIsHoverExpanded] = React.useState(false);

  const { collapsed: requestedCollapsed, setCollapsed: requestCollapsed } =
    useCollapsedState({
      defaultCollapsed,
      collapsed: controlledCollapsed,
      onCollapsedChange,
      persistState,
      storageKey,
    });

  const collapsed = collapsible !== "none" && requestedCollapsed;

  const [previousLayout, setPreviousLayout] = React.useState({
    collapsed,
    collapsible,
    hoverExpand,
  });

  if (
    previousLayout.collapsed !== collapsed ||
    previousLayout.collapsible !== collapsible ||
    previousLayout.hoverExpand !== hoverExpand
  ) {
    setPreviousLayout({ collapsed, collapsible, hoverExpand });
    setIsHoverExpanded(false);
  }

  const openMobile = isMobile && (controlledMobile ?? localMobile);

  if (previousMobile !== isMobile) {
    setPreviousMobile(isMobile);
    setLocalMobile(false);
    setIsHoverExpanded(false);
  }

  const setCollapsed = React.useCallback<
    React.Dispatch<React.SetStateAction<boolean>>
  >(
    (value) => {
      if (collapsible !== "none") {
        captureLayout();
        requestCollapsed(value);
      }
    },
    [collapsible, requestCollapsed, captureLayout],
  );

  const requestMobile = React.useCallback(
    (next: boolean) => {
      if (!isMobile) return;

      if (controlledMobile === undefined) setLocalMobile(next);
      onOpenMobileChange?.(next);
    },
    [isMobile, controlledMobile, onOpenMobileChange],
  );

  const setOpenMobile = useBooleanRequests(openMobile, requestMobile);

  return {
    collapsed,
    setCollapsed,
    openMobile,
    setOpenMobile,
    isHoverExpanded,
    setIsHoverExpanded,
  };
}

function sidebarCollection(
  sections: KiraSidebarProps["sections"],
  pinnedIds: readonly string[],
  filter: string,
) {
  const allItems = sections.flatMap((section) => section.items);

  const pinned = pinnedIds.filter(
    (id, index, ids) =>
      ids.indexOf(id) === index && allItems.some((item) => item.id === id),
  );

  const pinnedItems = pinned.flatMap((id) => {
    const item = allItems.find((entry) => entry.id === id);

    return item ? [item] : [];
  });

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !filter ||
          searchableText(
            [section.label, item.label, ...(item.keywords ?? [])].join(" "),
          ).includes(filter),
      ),
    }))
    .filter((section) => section.items.length > 0);

  const matchCount = filteredSections.reduce(
    (count, section) => count + section.items.length,
    0,
  );

  return { allItems, pinned, pinnedItems, filteredSections, matchCount };
}

type KiraSidebarCollection = ReturnType<typeof sidebarCollection> & {
  loading: boolean;
  error: KiraSidebarProps["error"];
  onRetry: KiraSidebarProps["onRetry"];
  favorites: boolean;
  filter: string;
  activeId: string | undefined;
  navigate: (item: SidebarNavItem) => void;
  reorderable: boolean;
  readOnly: boolean;
  updatePinned: (next: string[], message: string) => void;
  expanded: boolean;
  changeQuery: (next: string) => void;
  query: string;
  emptyMessage: string;
};

function KiraSidebarCollectionView(model: KiraSidebarCollection) {
  const {
    loading,
    error,
    onRetry,
    filter,
    matchCount,
    changeQuery,
    query,
    emptyMessage,
  } = model;

  return (() => {
    if (loading) return <SidebarSkeleton />;

    if (error)
      return (
        <SidebarEmpty
          title="Navigation unavailable"
          action={
            onRetry && (
              <SidebarMenuButton onClick={onRetry}>Try again</SidebarMenuButton>
            )
          }
        >
          {error}
        </SidebarEmpty>
      );

    return (
      <>
        <KiraSidebarFavorites model={model} />
        <KiraSidebarSections model={model} />
        {matchCount === 0 && (
          <SidebarEmpty
            title={filter ? "No matching views" : "No views yet"}
            action={
              filter && (
                <SidebarMenuButton onClick={() => changeQuery("")}>
                  Clear search
                </SidebarMenuButton>
              )
            }
          >
            {filter
              ? `No views match “${query.trim()}”. Try a different name or keyword.`
              : emptyMessage}
          </SidebarEmpty>
        )}
      </>
    );
  })();
}

function KiraSidebarFavorites({ model }: { model: KiraSidebarCollection }) {
  const {
    favorites,
    filter,
    pinnedItems,
    activeId,
    navigate,
    reorderable,
    readOnly,
    updatePinned,
    expanded,
  } = model;

  return (
    <>
      {favorites && !filter && pinnedItems.length > 0 && (
        <SidebarFavoriteList
          items={pinnedItems}
          activeId={activeId}
          onNavigate={navigate}
          reorderable={reorderable && !readOnly}
          onReorder={(ids, label, position) =>
            updatePinned(
              ids,
              `${label} moved to position ${position} of ${ids.length}.`,
            )
          }
        />
      )}
      <KiraSidebarFavoriteHint model={model} />
      {readOnly && favorites && expanded && (
        // kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics
        <p
          data-slot="sidebar-read-only"
          className="px-2.5 py-2 text-xs text-muted-foreground"
        >
          Favorites are managed by your workspace.
        </p>
      )}
    </>
  );
}

function KiraSidebarSections({ model }: { model: KiraSidebarCollection }) {
  const {
    filteredSections,
    filter,
    activeId,
    navigate,
    favorites,
    expanded,
    readOnly,
    pinned,
    updatePinned,
  } = model;

  return (
    <>
      {filteredSections.map((section) => (
        <SidebarGroup
          key={section.id}
          label={section.label}
          defaultOpen={section.defaultOpen ?? true}
          open={filter ? true : undefined}
        >
          <SidebarMenu>
            {section.items.map((item) => (
              <SidebarMenuItem key={item.id}>
                {/* kira-kit-ignore spacing-scale: sidebar nav chrome keeps compact optical metrics */}
                <div
                  data-slot="sidebar-destination-row"
                  className="flex min-w-0 items-start gap-0.5"
                >
                  <SidebarDestination
                    item={item}
                    active={activeId === item.id}
                    onNavigate={navigate}
                  />
                  {favorites && expanded && !readOnly && (
                    <SidebarPinView
                      item={item}
                      pinned={pinned}
                      updatePinned={updatePinned}
                    />
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

function sidebarShortcutEligible(event: KeyboardEvent) {
  return (
    !event.defaultPrevented &&
    !event.repeat &&
    !event.isComposing &&
    !event.altKey &&
    !event.shiftKey &&
    (event.metaKey || event.ctrlKey) &&
    !isEditable(event.target)
  );
}

function sidebarShortcutOwner(target: EventTarget | null, id: string) {
  const owner =
    target instanceof Element
      ? target.closest("[data-sidebar-provider], [data-sidebar-owner]")
      : null;

  return (
    !owner ||
    owner.getAttribute("data-sidebar-provider") === id ||
    owner.getAttribute("data-sidebar-owner") === `${id}-sidebar`
  );
}

function sidebarLayoutTargets(root: HTMLElement) {
  const targets = [
    ...root.querySelectorAll<HTMLElement>(
      '[data-slot="sidebar-menu-item"], [data-slot="sidebar-item-icon"], [data-slot="sidebar-logo"], [data-slot="sidebar-user-avatar"]',
    ),
  ].filter((node) => node.closest("[data-sidebar-provider]") === root);

  for (const frame of root.querySelectorAll<HTMLElement>(
    '[data-slot="sidebar-frame"]',
  )) {
    if (frame.closest("[data-sidebar-provider]") !== root) continue;

    for (const sibling of frame.parentElement?.children ?? []) {
      if (
        sibling instanceof HTMLElement &&
        sibling !== frame &&
        !sibling.contains(frame)
      )
        targets.push(sibling);
    }
  }

  return targets;
}

function sidebarRelativeOffset(
  node: HTMLElement,
  offset: { x: number; y: number },
  offsets: Map<HTMLElement, { x: number; y: number }>,
) {
  let parent = node.parentElement;

  while (parent && !offsets.has(parent)) parent = parent.parentElement;
  const ancestor = parent ? offsets.get(parent) : undefined;

  return { x: offset.x - (ancestor?.x ?? 0), y: offset.y - (ancestor?.y ?? 0) };
}

function SidebarRowIcon({
  icon,
  expanded,
  hasBadge,
  badgeVariant,
}: {
  icon: React.ReactNode;
  expanded: boolean;
  hasBadge: boolean;
  badgeVariant: SidebarBadgeVariant | undefined;
}) {
  return (
    <>
      {(icon || !expanded) && (
        <span
          data-slot="sidebar-item-icon"
          aria-hidden="true"
          className="relative flex size-5 shrink-0 items-center justify-center [&>svg]:size-5"
        >
          {icon ?? <IconMenu2 />}
          {!expanded && hasBadge && (
            <SidebarBadge
              size="dot"
              variant={badgeVariant}
              className="absolute -inset-e-1 -top-0.5 bg-sidebar-primary"
            />
          )}
        </span>
      )}
    </>
  );
}

function useSidebarPeek(
  {
    isMobile,
    hoverExpand,
    collapsed,
    collapsible,
    isHoverExpanded,
    setIsHoverExpanded,
    captureLayout,
    setPointerIntent,
  }: SidebarPeekOptions,
  props: SidebarProps,
) {
  const navRef = React.useRef<HTMLElement>(null);
  const hoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const canPeek =
    !isMobile && hoverExpand && collapsed && collapsible === "icon";

  const peek = canPeek && isHoverExpanded;

  const clearHoverTimer = () => sidebarClearHoverTimer(hoverTimer);

  React.useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    },
    [canPeek],
  );

  const handlers = {
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) =>
      sidebarPeekEnter(
        event,
        props.onPointerEnter,
        canPeek,
        clearHoverTimer,
        setPointerIntent,
        captureLayout,
        setIsHoverExpanded,
      ),
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      props.onPointerLeave?.(event);

      if (event.defaultPrevented) return;
      clearHoverTimer();

      if (!canPeek) return;
      hoverTimer.current = setTimeout(
        () =>
          sidebarSetTimeout(
            hoverTimer,
            navRef,
            captureLayout,
            setIsHoverExpanded,
          ),
        150,
      );
    },
    onFocusCapture: (event: React.FocusEvent<HTMLElement>) => {
      props.onFocusCapture?.(event);

      if (!event.defaultPrevented && canPeek) {
        clearHoverTimer();
        setIsHoverExpanded(true);
      }
    },
    onBlurCapture: (event: React.FocusEvent<HTMLElement>) => {
      props.onBlurCapture?.(event);

      if (
        !event.defaultPrevented &&
        !event.currentTarget.contains(event.relatedTarget)
      )
        setIsHoverExpanded(false);
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      props.onKeyDown?.(event);

      if (!event.defaultPrevented && event.key === "Escape" && peek) {
        setIsHoverExpanded(false);
        event.preventDefault();
      }
    },
  };

  return { navRef, peek, handlers };
}

function sidebarClearHoverTimer(
  timer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (timer.current) clearTimeout(timer.current);
  timer.current = null;
}

function SidebarShellBoundary({ model }: { model: SidebarShellModel }) {
  const { side, hidden, motion, peek, collapsed, width, collapsedWidth } =
    model;

  return (
    <div
      data-slot="sidebar-boundary"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 w-px bg-sidebar-border",
        side === "left" ? "left-0" : "right-0",
        { "opacity-0": hidden },
        motion ? "transition-transform duration-200" : "transition-none",
      )}
      style={{
        transitionTimingFunction: sidebarEase,
        transform:
          side === "left"
            ? `translateX(calc(${peek || !collapsed ? width : collapsedWidth} - 1px))`
            : `translateX(calc(1px - ${peek || !collapsed ? width : collapsedWidth}))`,
      }}
    />
  );
}

function KiraSidebarFavoriteHint({ model }: { model: KiraSidebarCollection }) {
  const { favorites, filter, pinnedItems, allItems, expanded, readOnly } =
    model;

  return (
    <>
      {favorites &&
        !filter &&
        pinnedItems.length === 0 &&
        allItems.length > 0 &&
        expanded &&
        !readOnly && (
          <SidebarEmpty title="Keep your views close">
            Use a star beside a view to add it to Favorites.
          </SidebarEmpty>
        )}
    </>
  );
}

function sidebarPeekEnter(
  event: React.PointerEvent<HTMLElement>,
  onPointerEnter: SidebarProps["onPointerEnter"],
  canPeek: boolean,
  clearHoverTimer: () => void,
  setPointerIntent: (pointer: boolean) => void,
  captureLayout: () => void,
  setIsHoverExpanded: React.Dispatch<React.SetStateAction<boolean>>,
) {
  onPointerEnter?.(event);

  if (
    event.defaultPrevented ||
    event.pointerType !== "mouse" ||
    !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
    !canPeek
  )
    return;
  clearHoverTimer();
  setPointerIntent(true);
  captureLayout();
  setIsHoverExpanded(true);
}

function sidebarFooterContent({
  footer,
  user,
}: ReturnType<typeof useKiraSidebarSettings>) {
  return (
    footer ??
    (user ? (
      <SidebarFooter>
        <SidebarUser {...user} />
      </SidebarFooter>
    ) : null)
  );
}

type SidebarPeekOptions = Pick<
  ReturnType<typeof useSidebar>,
  | "isMobile"
  | "hoverExpand"
  | "collapsed"
  | "collapsible"
  | "isHoverExpanded"
  | "setIsHoverExpanded"
  | "captureLayout"
  | "setPointerIntent"
>;
