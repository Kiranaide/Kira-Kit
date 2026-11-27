import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva } from "class-variance-authority";

import { cn } from "cn";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
} from "@/components/ui/drawer";
import { IconChevronDown, IconMenu2 } from "@tabler/icons-react";
import { isFunctionProp } from "@/lib/component-utils";

/*                                  Variants                                  */

/**
 * Trigger and link row styling. Active page is marked with weight +
 * underline (never colour alone, §9).
 */
export const navigationMenuTriggerVariants = cva(
  [
    // kira-kit-ignore spacing-scale: nav trigger icon gap keeps the compact optical metric
    "group inline-flex h-10 w-max min-w-0 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium outline-none",
    "transition-colors motion-reduce:transition-none",
    "hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
    "data-[popup-open]:bg-muted data-[popup-open]:text-foreground",
    "data-[active]:underline data-[active]:underline-offset-4 data-[active]:font-semibold",
  ],
  {
    variants: {
      variant: {
        default: "",
        ghost: "hover:bg-transparent focus-visible:bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/**
 * Mega-panel surface. Enter/exit motion is opacity + small direction-aware
 * translate driven by `data-activation-direction`; sizes come from the
 * positioner/popup CSS variables and are never animated (§5).
 */
export const navigationMenuContentVariants = cva(
  [
    "z-50 isolate rounded-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none",
    "max-w-(--available-width) max-h-(--available-height)",
    "transition-[opacity,translate] duration-200 ease-out data-[ending-style]:duration-150",
    "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
    "data-[activation-direction=right]:data-[starting-style]:translate-x-[-8px]",
    "data-[activation-direction=left]:data-[starting-style]:translate-x-[8px]",
    "data-[activation-direction=right]:data-[ending-style]:translate-x-[8px]",
    "data-[activation-direction=left]:data-[ending-style]:translate-x-[-8px]",
    "data-[instant]:transition-none motion-reduce:transition-none",
  ],
  {
    variants: {
      megaMenu: {
        true: "p-0",
        false: "p-4",
      },
    },
    defaultVariants: { megaMenu: false },
  },
);

/*                                    Types                                   */

type NavigationMenuProps<Value = string> = Omit<
  NavigationMenuPrimitive.Root.Props<Value>,
  "className"
> & { className?: string };

type NavigationMenuListProps = Omit<
  NavigationMenuPrimitive.List.Props,
  "className"
> & { className?: string };

type NavigationMenuItemProps = Omit<
  NavigationMenuPrimitive.Item.Props,
  "className"
> & { className?: string };

type NavigationMenuTriggerProps = Omit<
  NavigationMenuPrimitive.Trigger.Props,
  "className"
> & { className?: string };

interface NavigationMenuContentProps extends Omit<
  NavigationMenuPrimitive.Content.Props,
  "className"
> {
  className?: string;
  /** Padding mode only: mega panels manage their own internal padding. */
  megaMenu?: boolean;
  keepMounted?: boolean;
}

interface NavigationMenuLinkProps extends Omit<
  NavigationMenuPrimitive.Link.Props,
  "className"
> {
  className?: string;
  active?: boolean;
}

type NavigationMenuPortalProps = NavigationMenuPrimitive.Portal.Props;

interface NavigationMenuPositionerProps extends Omit<
  NavigationMenuPrimitive.Positioner.Props,
  "className"
> {
  className?: string;
}

interface NavigationMenuPopupProps extends Omit<
  NavigationMenuPrimitive.Popup.Props,
  "className"
> {
  className?: string;
}

type NavigationMenuViewportProps = Omit<
  NavigationMenuPrimitive.Viewport.Props,
  "className"
> & { className?: string };

type NavigationMenuIconProps = Omit<
  NavigationMenuPrimitive.Icon.Props,
  "className"
> & { className?: string };

type NavigationMenuArrowProps = Omit<
  NavigationMenuPrimitive.Arrow.Props,
  "className"
> & { className?: string };

type NavigationMenuBackdropProps = Omit<
  NavigationMenuPrimitive.Backdrop.Props,
  "className"
> & { className?: string };

/*                                Components                                  */

/**
 * Website disclosure navigation built on the Base UI primitive (50ms
 * hover/close defaults, popup with `Viewport` for content transitions).
 * This is not an application menubar — links keep native anchor semantics.
 */
function NavigationMenu<Value = string>({
  className,
  children,
  ...props
}: NavigationMenuProps<Value>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative z-10 flex items-center gap-1", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: NavigationMenuListProps) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative min-w-0", className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuTriggerProps) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerVariants(), className)}
      {...props}
    >
      {children}
      <NavigationMenuIcon />
    </NavigationMenuPrimitive.Trigger>
  );
}

/**
 * Item content. Rendered inside the shared popup `Viewport`; moving panels
 * animate opacity/translate only — dimensions and position snap (§5).
 */
function NavigationMenuContent({
  className,
  megaMenu = false,
  keepMounted,
  ...props
}: NavigationMenuContentProps) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      data-mega-menu={megaMenu || undefined}
      keepMounted={keepMounted}
      className={cn(
        "grid min-w-0 max-w-(--available-width) overflow-x-hidden overflow-y-auto",
        megaMenu ? "p-0" : "p-2",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Native link through `NavigationMenu.Link`. Compose router elements via
 * `render={<Link to="…" />}` — handlers, refs and target/rel flow through
 * the primitive. `closeOnClick` defaults to true here (Kira convention for
 * disclosure navigation).
 */
function NavigationMenuLink({
  className,
  active,
  children,
  ...props
}: NavigationMenuLinkProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      active={active}
      closeOnClick
      className={cn(
        navigationMenuTriggerVariants(),
        "h-auto w-auto",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Link>
  );
}

function NavigationMenuPortal(props: NavigationMenuPortalProps) {
  return (
    <NavigationMenuPrimitive.Portal
      data-slot="navigation-menu-portal"
      {...props}
    />
  );
}

/**
 * Positions the shared popup against the active trigger. Bottom/start/4
 * with 8px collision padding.
 */
function NavigationMenuPositioner({
  className,
  side: sideInput,
  align: alignInput,
  sideOffset: sideOffsetInput,
  alignOffset: alignOffsetInput,
  collisionPadding: collisionPaddingInput,
  ...props
}: NavigationMenuPositionerProps) {
  const { side, align, sideOffset, alignOffset, collisionPadding } =
    useNavigationMenuPositionerOptions({
      side: sideInput,
      align: alignInput,
      sideOffset: sideOffsetInput,
      alignOffset: alignOffsetInput,
      collisionPadding: collisionPaddingInput,
    });

  return (
    <NavigationMenuPrimitive.Positioner
      data-slot="navigation-menu-positioner"
      side={side}
      align={align}
      sideOffset={sideOffset}
      alignOffset={alignOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "z-50 isolate h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Popup shell. Renders the shared Viewport when children are omitted;
 * callers may instead compose their own Viewport explicitly.
 */
function NavigationMenuPopup({
  className,
  children,
  ...props
}: NavigationMenuPopupProps) {
  return (
    <NavigationMenuPrimitive.Popup
      data-slot="navigation-menu-popup"
      className={cn(
        navigationMenuContentVariants({ megaMenu: true }),
        "relative h-(--popup-height) w-(--popup-width)",
        className,
      )}
      {...props}
    >
      {children ?? <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Popup>
  );
}

function NavigationMenuViewport({
  className,
  ...props
}: NavigationMenuViewportProps) {
  return (
    <NavigationMenuPrimitive.Viewport
      data-slot="navigation-menu-viewport"
      className={cn("relative h-full w-full overflow-hidden", className)}
      {...props}
    />
  );
}

function NavigationMenuIcon({
  className,
  children,
  ...props
}: NavigationMenuIconProps) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-icon"
      className={cn(
        "flex h-3 w-3 items-center justify-center transition-transform duration-200 motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      {children ?? (
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          data-slot="navigation-menu-icon-chevron"
          className="h-3 w-3 transition-transform duration-200 ease-out group-data-popup-open:rotate-180 motion-reduce:transition-none"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      )}
    </NavigationMenuPrimitive.Icon>
  );
}

function NavigationMenuArrow({
  className,
  ...props
}: NavigationMenuArrowProps) {
  return (
    <NavigationMenuPrimitive.Arrow
      data-slot="navigation-menu-arrow"
      className={cn(
        "z-50 h-2 w-4",
        "[&>polygon]:fill-popover [&>polygon]:stroke-border",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuBackdrop({
  className,
  ...props
}: NavigationMenuBackdropProps) {
  return (
    <NavigationMenuPrimitive.Backdrop
      data-slot="navigation-menu-backdrop"
      className={cn("fixed inset-0 z-50 bg-foreground/50", className)}
      {...props}
    />
  );
}

/*                       Presentational content helpers                       */

function NavigationMenuHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-header"
      className={cn("space-y-1 border-b border-border px-5 py-4", className)}
      {...props}
    />
  );
}

function NavigationMenuFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-footer"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

interface NavigationMenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

/** Labelled group of `li`-wrapped link cards. */
function NavigationMenuSection({
  title,
  className,
  children,
  ...props
}: NavigationMenuSectionProps) {
  return (
    <div
      data-slot="navigation-menu-section"
      className={cn("min-w-0 space-y-2", className)}
      {...props}
    >
      <h4
        data-slot="navigation-menu-section-title"
        className="px-2 text-xs font-medium leading-5 text-muted-foreground"
      >
        {title}
      </h4>
      <ul data-slot="navigation-menu-section-list" className="space-y-1">
        {children}
      </ul>
    </div>
  );
}

interface NavigationMenuViewAllProps extends Omit<
  NavigationMenuPrimitive.Link.Props,
  "className"
> {
  className?: string;
  title: string;
  description?: string;
}

/** "See everything" row rendered through the primitive Link. */
function NavigationMenuViewAll({
  title,
  description,
  className,
  children,
  ...props
}: NavigationMenuViewAllProps) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-view-all"
      closeOnClick
      className={cn(
        "group flex items-center gap-2 rounded-md p-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <span className="flex-1">
        <span className="block font-medium">{title}</span>
        {description && (
          <span className="block text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </span>
      {children ?? (
        <svg
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </NavigationMenuPrimitive.Link>
  );
}

/*                                  Exports                                   */

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuIcon,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuViewport,
  NavigationMenuArrow,
  NavigationMenuBackdrop,
  NavigationMenuHeader,
  NavigationMenuFooter,
  NavigationMenuSection,
  NavigationMenuViewAll,
};

export type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
  NavigationMenuPortalProps,
  NavigationMenuPositionerProps,
  NavigationMenuPopupProps,
  NavigationMenuViewportProps,
  NavigationMenuIconProps,
  NavigationMenuArrowProps,
  NavigationMenuBackdropProps,
  NavigationMenuSectionProps,
  NavigationMenuViewAllProps,
};

/*                        KiraNavigationMenu (data-driven)                    */

export interface NavigationLinkData {
  type: "link";
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
}

export interface NavigationGroupData {
  type: "group";
  id: string;
  label: string;
  description?: string;
  items: readonly NavigationItemData[];
}

export type NavigationItemData = NavigationLinkData | NavigationGroupData;

export interface KiraNavigationMenuProps {
  items: readonly NavigationItemData[];
  /** Accessible name for the nav landmark and the mobile trigger. */
  label: string;
  /** Current route href; matched exactly (caller derives route state). */
  activeHref?: string;
  /** Mobile presentation. @default "drawer" */
  mobileMode?: "drawer" | "inline";
  /** Mobile trigger accessible label. @default "Open navigation" */
  mobileLabel?: string;
  /** Router element factory; default renders a plain anchor. */
  renderLink?: (item: NavigationLinkData) => React.ReactElement;
  rootProps?: Omit<
    NavigationMenuProps,
    "children" | "value" | "defaultValue" | "onValueChange" | "actionsRef"
  >;
  className?: string;
}

/** Development-only unique-id check over the navigation tree. */
function assertNavigationIds(items: readonly NavigationItemData[]): void {
  const ids = new Set<string>();

  const walk = (list: readonly NavigationItemData[]) =>
    navigationMenuWalk(list, ids, walk);

  walk(items);
}

/*                        Responsive presentation switch                      */

const NAV_DESKTOP_QUERY = "(min-width: 768px)";

// One shared MediaQueryList per page (use-reduced-motion pattern).
let navMql: MediaQueryList | null | undefined;

function getNavMql(): MediaQueryList | null {
  if (navMql !== undefined) return navMql;
  navMql =
    typeof window !== "undefined" && isFunctionProp(window.matchMedia)
      ? window.matchMedia(NAV_DESKTOP_QUERY)
      : null;

  return navMql;
}

function subscribeNavBreakpoint(onChange: () => void): () => void {
  const list = getNavMql();

  if (!list) return () => {};

  list.addEventListener("change", onChange);

  return () => list.removeEventListener("change", onChange);
}

const getNavDesktopSnapshot = () => getNavMql()?.matches ?? true;

const getNavDesktopServerSnapshot = () => true;

/**
 * SSR-safe `(min-width: 768px)` subscription. Hydration replaces the desktop
 * server snapshot with the client breakpoint.
 */
function useNavDesktop(): boolean {
  return React.useSyncExternalStore(
    subscribeNavBreakpoint,
    getNavDesktopSnapshot,
    getNavDesktopServerSnapshot,
  );
}

/*                          Context-free nav anchor                           */

const navigationLinkCardVariants = cva([
  "group flex w-full min-w-0 select-none items-start gap-3 rounded-md p-2.5 text-start leading-5 outline-none",
  "transition-colors hover:bg-muted focus-visible:bg-muted",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring",
  "motion-reduce:transition-none",
  "data-[active]:font-semibold data-[active]:underline data-[active]:underline-offset-4",
]);

/**
 * Anchor that works outside the NavigationMenu root context (Drawer body):
 * same LinkCard/trigger styling, aria-current, forwarded props/ref. Uses
 * useRender+mergeProps so a router element composes through `render`.
 * This is a semantic adapter, not a duplicate state machine.
 */
function NavigationAnchor({
  render,
  active,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> &
  useRender.ComponentProps<"a"> & { active?: boolean }) {
  // SAFETY: anchorDefaults is a plain AnchorHTMLAttributes object (data-slot
  // + aria-current only), and useRender's element props type wraps events in
  // BaseUIEvent — anchor DOM props compose cleanly (breadcrumb.tsx convention).
  const anchorDefaults = {
    "data-slot": "navigation-anchor",
    "data-active": active ? "" : undefined,
    "aria-current": active ? ("page" as const) : undefined,
  } as React.AnchorHTMLAttributes<HTMLAnchorElement>;

  const merged = mergeProps(anchorDefaults, props);

  // SAFETY: ReturnValue<undefined> is ReactElement | null; enabled defaults
  // to true here so the result is always a rendered element.
  const rendered = useRender({
    defaultTagName: "a",
    render,
    props: mergeProps(merged, {
      className: cn(navigationLinkCardVariants(), className),
    }),
  }) as React.ReactElement;

  return rendered;
}

/** Title+description card body shared by desktop links and anchors. */
function navCardChildren(
  item: NavigationLinkData,
  children?: React.ReactNode,
): React.ReactNode {
  return (
    <>
      {item.icon && (
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-5"
        >
          {item.icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium leading-5 wrap-anywhere">
          {item.label}
        </span>
        {(children || item.description) && (
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {children ?? item.description}
          </span>
        )}
      </span>
    </>
  );
}

/** Preserve every level of grouped links in desktop panels as labelled lists. */
function renderDesktopItems(
  items: readonly NavigationItemData[],
  activeHref: string | undefined,
  renderLink: KiraNavigationMenuProps["renderLink"],
): React.ReactNode {
  if (items.length === 0) {
    return (
      <li className="px-3 py-2 text-sm text-muted-foreground">
        No pages available.
      </li>
    );
  }

  return items.map((item) => (
    <li key={item.id}>
      {item.type === "link" ? (
        <NavigationMenuLink
          href={item.href}
          active={activeHref === item.href}
          target={item.target}
          rel={item.rel}
          render={renderLink?.(item)}
          className={navigationLinkCardVariants()}
        >
          {navCardChildren(item)}
        </NavigationMenuLink>
      ) : (
        <NavigationMenuSection title={item.label} className="mt-3">
          {renderDesktopItems(item.items, activeHref, renderLink)}
        </NavigationMenuSection>
      )}
    </li>
  ));
}

/*                            KiraNavigationMenu                              */

interface MobileNavDrawerProps {
  label: string;
  mobileLabel: string;
  items: readonly NavigationItemData[];
  activeHref?: string;
  renderLink?: (item: NavigationLinkData) => React.ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emptyRoot: boolean;
}

/** Mobile link row: ≥44px hit target, closes on unmodified activation. */
function MobileNavLink({
  item,
  activeHref,
  renderLink,
  onNavigate,
}: {
  item: NavigationLinkData;
  activeHref?: string;
  renderLink?: (item: NavigationLinkData) => React.ReactElement;
  onNavigate: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const active = activeHref === item.href;

  return (
    <NavigationAnchor
      href={item.href}
      target={item.target}
      rel={item.rel}
      active={active}
      render={renderLink?.(item)}
      onClick={onNavigate}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm",
        navigationLinkCardVariants(),
      )}
    >
      {navCardChildren(item)}
    </NavigationAnchor>
  );
}

/**
 * Labelled modal right-side Drawer with ordinary nav > ul/li links.
 * Nested groups use Collapsible directly (NavigationMenu.Link requires the
 * desktop root context and must not render alone here).
 */
function MobileNavDrawer({
  label,
  mobileLabel,
  items,
  activeHref,
  renderLink,
  open,
  onOpenChange,
  emptyRoot,
}: MobileNavDrawerProps) {
  // Close only on unmodified primary same-window activation not prevented
  // by the consumer router; modifier/new-tab clicks keep native behavior.
  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>) =>
    navigationMenuHandleNavigate(event, onOpenChange);

  const renderItems = (list: readonly NavigationItemData[]) =>
    list.map((item) =>
      item.type === "link" ? (
        <li key={item.id}>
          <MobileNavLink
            item={item}
            activeHref={activeHref}
            renderLink={renderLink}
            onNavigate={handleNavigate}
          />
        </li>
      ) : (
        <NavigationMobileGroupView
          key={item.id}
          item={item}
          renderItems={renderItems}
        />
      ),
    );

  return (
    <KiraNavigationMobileTriggerView
      open={open}
      onOpenChange={onOpenChange}
      mobileLabel={mobileLabel}
      label={label}
      emptyRoot={emptyRoot}
      renderItems={renderItems}
      items={items}
    />
  );
}

/**
 * One typed navigation tree, two presentations: native NavigationMenu mega
 * panels at ≥768px, and a labelled right-side Drawer below that, where
 * nested groups use Collapsible directly (the primitive Link needs root
 * context). Only one renders at a time; `inline` keeps panels at any width.
 */
export function KiraNavigationMenu(
  props: KiraNavigationMenuProps,
): React.JSX.Element {
  const {
    items,
    label,
    activeHref,
    mobileMode = "drawer",
    mobileLabel = "Open navigation",
    renderLink,
    rootProps,
    className,
  } = props;

  assertNavigationIds(items);

  const isDesktop = useNavDesktop();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Breakpoint change: close the overlay and drop its session; restore
  // focus only if it was inside the removed presentation.
  const [lastPresentation, setLastPresentation] = React.useState(isDesktop);

  if (lastPresentation !== isDesktop) {
    setLastPresentation(isDesktop);

    // Render-time state adjustment (react-compiler-safe pattern).
    if (drawerOpen) setDrawerOpen(false);
  }

  const emptyRoot = items.length === 0;

  const buildDesktopTree = () => (
    <NavigationMenu<string>
      {...rootProps}
      aria-label={label}
      className={cn("max-w-full", className, rootProps?.className)}
    >
      {emptyRoot ? (
        <span className="px-2 text-sm text-muted-foreground">
          No navigation links available.
        </span>
      ) : (
        <NavigationMenuContentView
          items={items}
          activeHref={activeHref}
          renderLink={renderLink}
        />
      )}
      <NavigationMenuPortal>
        <NavigationMenuPositioner>
          <NavigationMenuPopup>
            <NavigationMenuViewport />
          </NavigationMenuPopup>
        </NavigationMenuPositioner>
      </NavigationMenuPortal>
    </NavigationMenu>
  );

  return (
    <>
      {isDesktop || mobileMode === "inline" ? (
        buildDesktopTree()
      ) : (
        <MobileNavDrawer
          label={label}
          mobileLabel={mobileLabel}
          items={items}
          activeHref={activeHref}
          renderLink={renderLink}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          emptyRoot={emptyRoot}
        />
      )}
    </>
  );
}

function resolveNavigationMenuPositionerOptions({
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
}: {
  side?: NavigationMenuPositionerProps["side"];
  align?: NavigationMenuPositionerProps["align"];
  sideOffset?: NavigationMenuPositionerProps["sideOffset"];
  alignOffset?: NavigationMenuPositionerProps["alignOffset"];
  collisionPadding?: NavigationMenuPositionerProps["collisionPadding"];
}) {
  return { side, align, sideOffset, alignOffset, collisionPadding };
}

function NavigationMobileGroupView({
  item,
  renderItems,
}: {
  item: NavigationGroupData;
  renderItems: (list: readonly NavigationItemData[]) => React.JSX.Element[];
}) {
  return (
    <li key={item.id}>
      <CollapsiblePrimitive.Root data-slot="navigation-mobile-group">
        <CollapsiblePrimitive.Trigger
          data-slot="navigation-mobile-group-trigger"
          className={cn(
            "group/navgroup flex min-h-11 w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium",
            "hover:bg-muted focus-visible:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring",
            "focus-visible:outline-none motion-reduce:transition-none",
          )}
        >
          {item.label}
          <IconChevronDown
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-data-panel-open/navgroup:rotate-180 motion-reduce:transition-none"
          />
        </CollapsiblePrimitive.Trigger>
        <CollapsiblePrimitive.Panel
          data-slot="navigation-mobile-group-panel"
          className="ps-4"
        >
          <ul className="mt-1 space-y-1 border-s border-border ps-2">
            {item.items.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                No pages available.
              </li>
            ) : (
              renderItems(item.items)
            )}
          </ul>
        </CollapsiblePrimitive.Panel>
      </CollapsiblePrimitive.Root>
    </li>
  );
}

function KiraNavigationMobileTriggerView({
  open,
  onOpenChange,
  mobileLabel,
  label,
  emptyRoot,
  renderItems,
  items,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mobileLabel: string;
  label: string;
  emptyRoot: boolean;
  renderItems: (list: readonly NavigationItemData[]) => React.JSX.Element[];
  items: readonly NavigationItemData[];
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} side="right">
      <DrawerTrigger
        render={
          <button
            type="button"
            data-slot="kira-navigation-mobile-trigger"
            aria-label={mobileLabel}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium",
              "hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none",
              "motion-reduce:transition-none",
            )}
          >
            <IconMenu2 aria-hidden="true" className="h-5 w-5" />
            {label}
          </button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{label}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav aria-label={label} data-slot="kira-navigation-mobile">
            {emptyRoot ? (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No navigation links available.
              </p>
            ) : (
              <ul className="space-y-1">{renderItems(items)}</ul>
            )}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function NavigationMenuContentView({
  items,
  activeHref,
  renderLink,
}: {
  items: readonly NavigationItemData[];
  activeHref: string | undefined;
  renderLink: ((item: NavigationLinkData) => React.ReactElement) | undefined;
}) {
  return (
    <NavigationMenuList>
      {items.map((item) =>
        item.type === "link" ? (
          <NavigationMenuItem key={item.id}>
            <NavigationMenuLink
              href={item.href}
              active={activeHref === item.href}
              target={item.target}
              rel={item.rel}
              render={renderLink?.(item)}
            >
              {item.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem key={item.id} value={item.id}>
            <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
            <NavigationMenuContent megaMenu className="w-160">
              <NavigationMenuHeader>
                <p className="text-sm font-semibold">{item.label}</p>
                {item.description && (
                  <p className="text-sm leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </NavigationMenuHeader>
              <div className="grid gap-5 p-4 sm:grid-cols-2">
                {item.items.some((child) => child.type === "link") && (
                  <ul className="space-y-1">
                    {renderDesktopItems(
                      item.items.filter((child) => child.type === "link"),
                      activeHref,
                      renderLink,
                    )}
                  </ul>
                )}
                {item.items
                  .filter((child) => child.type === "group")
                  .map((group) => (
                    <NavigationMenuSection key={group.id} title={group.label}>
                      {renderDesktopItems(group.items, activeHref, renderLink)}
                    </NavigationMenuSection>
                  ))}
                {item.items.length === 0 && (
                  <p className="px-2 text-sm text-muted-foreground">
                    No pages available.
                  </p>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ),
      )}
    </NavigationMenuList>
  );
}

function useNavigationMenuPositionerOptions({
  side: sideInput,
  align: alignInput,
  sideOffset: sideOffsetInput,
  alignOffset: alignOffsetInput,
  collisionPadding: collisionPaddingInput,
}: Parameters<typeof resolveNavigationMenuPositionerOptions>[0]) {
  return React.useMemo(
    () =>
      resolveNavigationMenuPositionerOptions({
        side: sideInput,
        align: alignInput,
        sideOffset: sideOffsetInput,
        alignOffset: alignOffsetInput,
        collisionPadding: collisionPaddingInput,
      }),
    [
      sideInput,
      alignInput,
      sideOffsetInput,
      alignOffsetInput,
      collisionPaddingInput,
    ],
  );
}

function navigationMenuWalk(
  list: readonly NavigationItemData[],
  ids: Set<string>,
  walk: (list: readonly NavigationItemData[]) => void,
) {
  for (const item of list) {
    if (ids.has(item.id)) {
      throw new Error(`Navigation item IDs must be unique: ${item.id}`);
    }

    ids.add(item.id);

    if (item.type === "group") walk(item.items);
  }
}

function navigationMenuHandleNavigate(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  onOpenChange: (open: boolean) => void,
) {
  if (event.defaultPrevented) return;

  if (event.button !== 0) return;

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  if (event.currentTarget.target && event.currentTarget.target !== "_self")
    return;

  onOpenChange(false);
}
