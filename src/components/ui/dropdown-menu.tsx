"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cva } from "class-variance-authority";

import { cn } from "cn";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useMenuAction } from "@/hooks/use-menu-action";
import type {
  MenuActionItem,
  MenuActionState,
  MenuItemData,
  MenuSubmenuData,
  MenuRadioData,
} from "@/hooks/use-menu-action";
import {
  IconChevronRight,
  IconCheck,
  IconLoader,
  IconX,
  IconSearch,
} from "@tabler/icons-react";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isCallbackProp } from "@/lib/component-prop-guards";

/*                                  Helpers                                   */

type StateClassName<S> =
  string | ((state: S) => string | undefined) | undefined;

type StateStyle<S> =
  | React.CSSProperties
  | ((state: S) => React.CSSProperties | undefined)
  | undefined;

/**
 * Preserves Base UI's function-valued `className`/`style` props instead of
 * feeding functions to `cn` (copied from tooltip.tsx convention).
 */
function mergeClassName<S>(base: string, className: StateClassName<S>) {
  return isCallbackProp(className)
    ? (state: S) => cn(base, className(state))
    : cn(base, className);
}

function mergeStyle<S>(base: React.CSSProperties, style: StateStyle<S>) {
  return isCallbackProp(style)
    ? (state: S) => ({ ...base, ...style(state) })
    : { ...base, ...style };
}

function subscribeVisibility(onChange: () => void): () => void {
  document.addEventListener("visibilitychange", onChange);

  return () => document.removeEventListener("visibilitychange", onChange);
}

const getVisibilitySnapshot = () => !document.hidden;

const getVisibilityServerSnapshot = () => true;

/** Whether the document is currently visible (looping spinners pause when hidden). */
function useDocumentVisible(): boolean {
  return React.useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot,
  );
}

/*                                  Variants                                  */

/**
 * Semantic surface + motion for menu popups (shared by Content and
 * SubContent, and reused by the menubar wrappers).
 * `sub` selects submenu sizing: submenus hug their items instead of matching
 * the trigger's anchor width.
 */
export const dropdownMenuContentVariants = cva(
  [
    "z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none",
    "max-h-(--available-height) max-w-(--available-width) origin-(--transform-origin)",
    "overflow-x-hidden overflow-y-auto",
    "transition-[opacity,scale] duration-200 ease-out data-[ending-style]:duration-150",
    "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
    "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
    "data-[instant]:transition-none motion-reduce:transition-none",
  ],
  {
    variants: {
      sub: {
        true: "w-auto",
        false: "min-w-48",
      },
    },
    defaultVariants: { sub: false },
  },
);

/**
 * Row styling shared by action/check/radio/subtrigger/link rows.
 * `indicator` reserves the logical-start column for a check/radio glyph;
 * `inset` indents into that same column (applies once, never stacked).
 */
export const dropdownMenuItemVariants = cva(
  [
    "relative flex min-h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm leading-5 outline-none transition-colors",
    "group/dropdown-menu-item [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
    "data-disabled:opacity-50",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "text-destructive data-highlighted:bg-destructive/10 dark:data-highlighted:bg-destructive/20 data-highlighted:text-destructive",
      },
      inset: {
        true: "ps-8",
        false: "",
      },
      indicator: {
        true: "ps-8",
        false: "",
      },
    },
    defaultVariants: { variant: "default", inset: false, indicator: false },
  },
);

const reasonClassName = "text-xs font-normal text-muted-foreground";

// SAFETY: React's CSSProperties omits custom properties; animationPlayState is a standard property.
const spinnerPauseStyle = {
  animationPlayState: "paused",
} as React.CSSProperties;

const emptyStyle: React.CSSProperties = {};

/**
 * Pending spinners freeze while reduced motion is preferred or the document
 * is hidden; a static glyph plus label remains (§9 tab-hidden pause).
 */
function isSpinnerPaused(
  loading: boolean | undefined,
  reducedMotion: boolean,
  documentVisible: boolean,
) {
  return Boolean(loading) && (reducedMotion || !documentVisible);
}

/**
 * Leading glyph slot shared by every actionable row: pending rows render a
 * paused-aware spinner, otherwise the caller's icon (decorative, aria-hidden).
 */
function menuItemIcon(
  loading: boolean | undefined,
  icon: React.ReactNode,
  paused = false,
) {
  if (loading) {
    return (
      <IconLoader
        data-slot="dropdown-menu-item-spinner"
        className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none"
        style={paused ? spinnerPauseStyle : undefined}
        aria-hidden="true"
      />
    );
  }

  if (!icon) return null;

  return (
    <span
      data-slot="dropdown-menu-item-icon"
      className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

/** Row label plus optional keyboard/touch-reachable disabled explanation. */
function menuItemLabel(
  children: React.ReactNode,
  reasonId?: string,
  disabledReason?: string,
) {
  return (
    <span
      data-slot="dropdown-menu-item-body"
      className="flex min-w-0 flex-1 flex-col"
    >
      <span
        data-slot="dropdown-menu-item-label"
        className="flex min-w-0 items-center gap-2 whitespace-normal wrap-anywhere"
      >
        {children}
      </span>
      {disabledReason && (
        <span
          id={reasonId}
          data-slot="dropdown-menu-item-reason"
          className={reasonClassName}
        >
          {disabledReason}
        </span>
      )}
    </span>
  );
}

/** Joins a consumer `aria-describedby` with the rendered reason element id. */
function describedWithReason(
  describedBy: string | undefined,
  reasonId: string,
  disabledReason: string | undefined,
) {
  return disabledReason
    ? [describedBy, reasonId].filter(Boolean).join(" ")
    : describedBy;
}

/*                                    Types                                   */

type DropdownMenuProps<Payload = unknown> = Menu.Root.Props<Payload>;

type DropdownMenuPortalProps = Menu.Portal.Props;

type DropdownMenuTriggerProps<Payload = unknown> = Menu.Trigger.Props<Payload>;

interface DropdownMenuContentProps extends Menu.Popup.Props {
  side?: Menu.Positioner.Props["side"];
  align?: Menu.Positioner.Props["align"];
  sideOffset?: Menu.Positioner.Props["sideOffset"];
  alignOffset?: Menu.Positioner.Props["alignOffset"];
  keepMounted?: boolean;
  showBackdrop?: boolean;
  portalProps?: Omit<Menu.Portal.Props, "children" | "keepMounted">;
  positionerProps?: Omit<
    Menu.Positioner.Props,
    "children" | "side" | "align" | "sideOffset" | "alignOffset"
  >;
}

type DropdownMenuGroupProps = Menu.Group.Props;

interface DropdownMenuLabelProps extends Menu.GroupLabel.Props {
  inset?: boolean;
}

interface DropdownMenuItemProps extends Menu.Item.Props {
  inset?: boolean;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
  loading?: boolean;
  /** Visible explanation rendered inside the disabled row; keyboard/touch reachable. */
  disabledReason?: string;
  closeOnClick?: boolean;
}

interface DropdownMenuLinkItemProps extends Menu.LinkItem.Props {
  inset?: boolean;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
}

type DropdownMenuSubProps = Menu.SubmenuRoot.Props;

interface DropdownMenuSubTriggerProps extends Menu.SubmenuTrigger.Props {
  inset?: boolean;
  icon?: React.ReactNode;
  disabledReason?: string;
}

interface DropdownMenuSubContentProps extends Menu.Popup.Props {
  align?: Menu.Positioner.Props["align"];
  sideOffset?: Menu.Positioner.Props["sideOffset"];
  alignOffset?: Menu.Positioner.Props["alignOffset"];
  keepMounted?: boolean;
  portalProps?: Omit<Menu.Portal.Props, "children" | "keepMounted">;
  positionerProps?: Omit<
    Menu.Positioner.Props,
    "children" | "side" | "align" | "sideOffset" | "alignOffset"
  >;
}

interface DropdownMenuCheckboxItemProps extends Menu.CheckboxItem.Props {
  icon?: React.ReactNode;
  iconChecked?: React.ReactNode;
  inset?: boolean;
  disabledReason?: string;
  closeOnClick?: boolean;
}

type DropdownMenuRadioGroupProps = Menu.RadioGroup.Props;

interface DropdownMenuRadioItemProps extends Menu.RadioItem.Props {
  inset?: boolean;
  icon?: React.ReactNode;
  disabledReason?: string;
  closeOnClick?: boolean;
}

type DropdownMenuSeparatorProps = Menu.Separator.Props;

type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

type DropdownMenuBackdropProps = Menu.Backdrop.Props;

type DropdownMenuArrowProps = Menu.Arrow.Props;

/*                                Components                                  */

/**
 * Typed factory for a detached-menu handle: multiple triggers can share one
 * popup, each passing its own `payload`.
 */
export function createDropdownMenuHandle<Payload = unknown>() {
  return Menu.createHandle<Payload>();
}

function DropdownMenu<Payload = unknown>({
  children,
  ...props
}: DropdownMenuProps<Payload>) {
  return <Menu.Root {...props}>{children}</Menu.Root>;
}

function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <Menu.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger<Payload = unknown>({
  className,
  children,
  ...props
}: DropdownMenuTriggerProps<Payload>) {
  return (
    <Menu.Trigger
      data-slot="dropdown-menu-trigger"
      className={mergeClassName<Menu.Trigger.State>(
        "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {children}
    </Menu.Trigger>
  );
}

function DropdownMenuBackdrop({
  className,
  ...props
}: DropdownMenuBackdropProps) {
  return (
    <Menu.Backdrop
      data-slot="dropdown-menu-backdrop"
      className={mergeClassName<Menu.Backdrop.State>(
        "fixed inset-0 z-50 bg-foreground/50",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuContent(input: DropdownMenuContentProps) {
  const {
    className,
    style,
    side,
    align,
    sideOffset,
    alignOffset,
    keepMounted,
    showBackdrop,
    portalProps,
    positionerProps,
    ...props
  } = resolveComponentDefaults(input, DROPDOWN_MENU_CONTENT_DEFAULTS_1);

  const {
    className: positionerClassName,
    collisionPadding = 8,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <Menu.Portal keepMounted={keepMounted} {...portalProps}>
      {showBackdrop && <DropdownMenuBackdrop />}
      <Menu.Positioner
        data-slot="dropdown-menu-positioner"
        {...restPositionerProps}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={mergeClassName<Menu.Positioner.State>(
          "z-50 isolate",
          positionerClassName,
        )}
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={mergeClassName<Menu.Popup.State>(
            dropdownMenuContentVariants(),
            className,
          )}
          style={style}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuArrow({ className, ...props }: DropdownMenuArrowProps) {
  return (
    <Menu.Arrow
      data-slot="dropdown-menu-arrow"
      className={mergeClassName<Menu.Arrow.State>(
        cn(
          "z-50 h-2 w-4",
          "[&>polygon]:fill-popover [&>polygon]:stroke-border",
        ),
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuGroup({ ...props }: DropdownMenuGroupProps) {
  return <Menu.Group data-slot="dropdown-menu-group" {...props} />;
}

/**
 * Accessible group label. Renders Base UI's `Menu.GroupLabel`, which must be
 * used inside a `DropdownMenuGroup` (it associates itself with the group via
 * `aria-labelledby`).
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: DropdownMenuLabelProps) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset || undefined}
      className={mergeClassName<Menu.GroupLabel.State>(
        cn(
          "px-2 py-1.5 text-xs font-medium text-muted-foreground",
          inset && "ps-8",
        ),
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  style,
  inset,
  variant = "default",
  icon,
  shortcut,
  loading,
  children,
  disabled,
  disabledReason,
  closeOnClick,
  "aria-describedby": describedBy,
  ...props
}: DropdownMenuItemProps) {
  const reducedMotion = useReducedMotion();
  const documentVisible = useDocumentVisible();

  const reasonId = React.useId();

  const spinnerPaused = isSpinnerPaused(
    loading,
    reducedMotion,
    documentVisible,
  );

  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      data-inset={inset || undefined}
      data-variant={variant}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-describedby={describedWithReason(
        describedBy,
        reasonId,
        disabledReason,
      )}
      disabled={disabled || loading}
      closeOnClick={closeOnClick}
      className={mergeClassName<Menu.Item.State>(
        cn(
          dropdownMenuItemVariants({ variant, inset }),
          !disabledReason && "data-disabled:pointer-events-none",
        ),
        className,
      )}
      style={mergeStyle<Menu.Item.State>(
        spinnerPaused ? spinnerPauseStyle : emptyStyle,
        style,
      )}
      {...props}
    >
      {menuItemIcon(loading, icon, spinnerPaused)}
      {menuItemLabel(children, reasonId, disabledReason)}
      {shortcut && (
        <DropdownMenuShortcut aria-hidden="true">
          {shortcut}
        </DropdownMenuShortcut>
      )}
    </Menu.Item>
  );
}

/**
 * Row that renders a native anchor (`Menu.LinkItem`): modifier clicks,
 * target/rel and middle-click behave natively.
 */
function DropdownMenuLinkItem({
  className,
  inset,
  variant = "default",
  icon,
  shortcut,
  children,
  closeOnClick,
  ...props
}: DropdownMenuLinkItemProps) {
  return (
    <Menu.LinkItem
      data-slot="dropdown-menu-link-item"
      data-inset={inset || undefined}
      data-variant={variant}
      closeOnClick={closeOnClick}
      className={mergeClassName<Menu.LinkItem.State>(
        dropdownMenuItemVariants({ variant, inset }),
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          data-slot="dropdown-menu-item-icon"
          className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {menuItemLabel(children)}
      {shortcut && (
        <DropdownMenuShortcut aria-hidden="true">
          {shortcut}
        </DropdownMenuShortcut>
      )}
    </Menu.LinkItem>
  );
}

function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <Menu.SubmenuRoot {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  icon,
  children,
  disabledReason,
  "aria-describedby": describedBy,
  ...props
}: DropdownMenuSubTriggerProps) {
  const reasonId = React.useId();

  return (
    <Menu.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset || undefined}
      aria-describedby={
        disabledReason
          ? [describedBy, reasonId].filter(Boolean).join(" ")
          : describedBy
      }
      className={mergeClassName<Menu.SubmenuTrigger.State>(
        cn(
          dropdownMenuItemVariants({ inset }),
          !disabledReason && "data-disabled:pointer-events-none",
        ),
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          data-slot="dropdown-menu-item-icon"
          className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {menuItemLabel(children, reasonId, disabledReason)}
      <IconChevronRight
        data-slot="dropdown-menu-sub-trigger-chevron"
        className="ms-auto h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none rtl:-scale-x-100 group-data-popup-open/dropdown-menu-item:translate-x-0.5"
        aria-hidden="true"
      />
    </Menu.SubmenuTrigger>
  );
}

function DropdownMenuSubContent(input: DropdownMenuSubContentProps) {
  const {
    className,
    style,
    align,
    sideOffset,
    alignOffset,
    keepMounted,
    portalProps,
    positionerProps,
    ...props
  } = resolveComponentDefaults(input, DROPDOWN_MENU_SUB_CONTENT_DEFAULTS_2);

  const {
    className: positionerClassName,
    collisionPadding = 8,
    ...restPositionerProps
  } = positionerProps ?? {};

  return (
    <Menu.Portal keepMounted={keepMounted} {...portalProps}>
      <Menu.Positioner
        data-slot="dropdown-menu-sub-positioner"
        {...restPositionerProps}
        side="inline-end"
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={mergeClassName<Menu.Positioner.State>(
          "z-50 isolate",
          positionerClassName,
        )}
      >
        <Menu.Popup
          data-slot="dropdown-menu-sub-content"
          className={mergeClassName<Menu.Popup.State>(
            dropdownMenuContentVariants({ sub: true }),
            className,
          )}
          style={style}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  icon,
  iconChecked,
  inset,
  disabled,
  disabledReason,
  closeOnClick = false,
  "aria-describedby": describedBy,
  ...props
}: DropdownMenuCheckboxItemProps) {
  const reasonId = React.useId();

  return (
    <Menu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset || undefined}
      aria-describedby={
        disabledReason
          ? [describedBy, reasonId].filter(Boolean).join(" ")
          : describedBy
      }
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={mergeClassName<Menu.CheckboxItem.State>(
        cn(
          dropdownMenuItemVariants({ inset, indicator: true }),
          !disabledReason && "data-disabled:pointer-events-none",
        ),
        className,
      )}
      {...props}
    >
      <span
        data-slot="dropdown-menu-checkbox-item-indicator"
        className="absolute inset-s-2 flex size-4 items-center justify-center"
        aria-hidden="true"
      >
        <Menu.CheckboxItemIndicator>
          {iconChecked || <IconCheck className="size-4" />}
        </Menu.CheckboxItemIndicator>
      </span>
      {icon && (
        <span
          data-slot="dropdown-menu-item-icon"
          className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {menuItemLabel(children, reasonId, disabledReason)}
    </Menu.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: DropdownMenuRadioGroupProps) {
  return <Menu.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  icon,
  inset,
  disabled,
  disabledReason,
  closeOnClick = false,
  "aria-describedby": describedBy,
  ...props
}: DropdownMenuRadioItemProps) {
  const reasonId = React.useId();

  return (
    <Menu.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset || undefined}
      aria-describedby={
        disabledReason
          ? [describedBy, reasonId].filter(Boolean).join(" ")
          : describedBy
      }
      disabled={disabled}
      closeOnClick={closeOnClick}
      className={mergeClassName<Menu.RadioItem.State>(
        cn(
          dropdownMenuItemVariants({ inset, indicator: true }),
          !disabledReason && "data-disabled:pointer-events-none",
        ),
        className,
      )}
      {...props}
    >
      <span
        data-slot="dropdown-menu-radio-item-indicator"
        className="absolute inset-s-2 flex size-4 items-center justify-center"
        aria-hidden="true"
      >
        <Menu.RadioItemIndicator>
          <IconCheck className="size-4" />
        </Menu.RadioItemIndicator>
      </span>
      {icon && (
        <span
          data-slot="dropdown-menu-item-icon"
          className="flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {menuItemLabel(children, reasonId, disabledReason)}
    </Menu.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={mergeClassName<Menu.Separator.State>(
        "bg-border -mx-1 my-1 h-px",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      aria-hidden="true"
      className={cn(
        "ms-auto shrink-0 whitespace-nowrap ps-4 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/*                        KiraDropdownMenu (data-driven)                      */

const kiraNoActions = "No actions available.";
const kiraNoItem = "No item selected";

/** Development-only unique-id check over the whole data tree. */
function assertTreeIds(items: readonly MenuItemData[]): void {
  const ids = new Set<string>();

  const walk = (list: readonly MenuItemData[]) => {
    for (const item of list) {
      if (ids.has(item.id)) {
        throw new Error(`Menu item IDs must be unique: ${item.id}`);
      }

      ids.add(item.id);

      if (item.type === "group" || item.type === "submenu") walk(item.items);
    }
  };

  walk(items);
}

/** Row pending text: the spinner renders in the icon slot. */
function kiraPendingLabel(label: string) {
  return `Running ${label}…`;
}

/** Retry row label: re-runs the exact failed action, no duplicate activation. */
function kiraRetryLabel(item: MenuActionItem) {
  return `Retry ${item.label}`;
}

interface KiraActionApi {
  state: MenuActionState;
  activeId: string | null;
  message: string;
  run: (item: MenuActionItem) => Promise<void>;
}

/** Search field + clear button shared by every searchable scope. */
function KiraMenuSearch({
  label,
  clearLabel = "Clear filter",
}: {
  label: string;
  clearLabel?: string;
}) {
  return (
    // kira-kit-ignore spacing-scale: search-header divider chrome keeps optical spacing
    <div
      data-slot="dropdown-menu-search"
      className="relative mb-1.5 border-b border-border px-0.5 pb-2.5"
    >
      <IconSearch
        aria-hidden="true"
        className="pointer-events-none absolute inset-s-3 top-2 size-4 text-muted-foreground"
      />
      <DropdownMenuInput
        aria-label={label}
        placeholder={label}
        className="ps-8"
      />
      <DropdownMenuClear aria-label={clearLabel}>
        {/* kira-kit-ignore spacing-scale: 14px icon optically matches sm/compact controls; documented half-step exception */}
        <IconX aria-hidden="true" className="h-3.5 w-3.5" />
      </DropdownMenuClear>
    </div>
  );
}

/**
 * Renders one data item into actual Base UI parts. Plain `data.label` feeds
 * item registration so status/shortcut/reason never pollute search or
 * typeahead. Pending rows stay mounted/focusable with aria-busy; failure
 * adds a retry row at the failed item's list level.
 */
/** Renders a pending/error action row plus its retry sibling. */
function kiraActionNode(
  item: MenuActionItem,
  action: KiraActionApi,
): React.ReactNode {
  const pending = action.state === "pending" && action.activeId === item.id;
  const failed = action.state === "error" && action.activeId === item.id;

  return (
    <React.Fragment key={item.id}>
      <DropdownMenuItem
        icon={item.icon}
        shortcut={item.shortcut}
        variant={item.variant}
        disabled={item.disabled || action.state === "pending"}
        disabledReason={item.disabledReason}
        loading={pending}
        closeOnClick={false}
        onClick={() => void action.run(item)}
        label={item.label}
      >
        {pending ? kiraPendingLabel(item.label) : item.label}
      </DropdownMenuItem>
      {failed && (
        <DropdownMenuItem
          closeOnClick={false}
          onClick={() => void action.run(item)}
          label={kiraRetryLabel(item)}
        >
          {kiraRetryLabel(item)}
        </DropdownMenuItem>
      )}
    </React.Fragment>
  );
}

/** Searchable submenus wrap their items in their own FilterProvider. */
function kiraSubmenuNode(
  item: MenuSubmenuData,
  action: KiraActionApi,
  emptyMessage: React.ReactNode,
): React.ReactNode {
  const children = item.items.map((child) =>
    kiraItemNode(child, action, emptyMessage),
  );

  const submenu = (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger
        icon={item.icon}
        disabled={item.disabled}
        disabledReason={item.disabledReason}
        label={item.label}
      >
        {item.label}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {item.searchable && <KiraMenuSearch label={`Filter ${item.label}`} />}
        {item.searchable ? (
          <DropdownMenuList>
            {children}
            <DropdownMenuEmpty>{emptyMessage}</DropdownMenuEmpty>
          </DropdownMenuList>
        ) : (
          children
        )}
        {item.items.length === 0 && !item.searchable && (
          <div
            data-slot="dropdown-menu-empty"
            className="px-2 py-6 text-sm text-muted-foreground"
          >
            {kiraNoActions}
          </div>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );

  return item.searchable ? (
    <DropdownMenuFilterProvider autoHighlight key={item.id}>
      {submenu}
    </DropdownMenuFilterProvider>
  ) : (
    <React.Fragment key={item.id}>{submenu}</React.Fragment>
  );
}

/** Controlled radio preference group: stays open on change. */
function kiraRadioNode(item: MenuRadioData): React.ReactNode {
  return (
    <DropdownMenuRadioGroup
      key={item.id}
      value={item.value}
      onValueChange={item.onValueChange}
      aria-label={item.label}
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
        {item.options.map((option) => (
          <DropdownMenuRadioItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            disabledReason={option.disabledReason}
            label={option.label}
          >
            {option.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuGroup>
    </DropdownMenuRadioGroup>
  );
}

function kiraItemNode(
  item: MenuItemData,
  action: KiraActionApi,
  emptyMessage: React.ReactNode,
): React.ReactNode {
  switch (item.type) {
    case "separator":
      return <DropdownMenuSeparator key={item.id} />;

    case "group":
      return (
        <DropdownMenuGroup key={item.id}>
          <DropdownMenuLabel>{item.label}</DropdownMenuLabel>
          {item.items.map((child) => kiraItemNode(child, action, emptyMessage))}
        </DropdownMenuGroup>
      );

    case "submenu":
      return kiraSubmenuNode(item, action, emptyMessage);

    case "link":
      return (
        <DropdownMenuLinkItem
          key={item.id}
          href={item.href}
          target={item.target}
          rel={item.rel}
          icon={item.icon}
          shortcut={item.shortcut}
          label={item.label}
        >
          {item.label}
        </DropdownMenuLinkItem>
      );

    case "checkbox":
      return (
        <DropdownMenuCheckboxItem
          key={item.id}
          checked={item.checked}
          onCheckedChange={item.onCheckedChange}
          icon={item.icon}
          disabled={item.disabled}
          disabledReason={item.disabledReason}
          label={item.label}
        >
          {item.label}
        </DropdownMenuCheckboxItem>
      );

    case "radio":
      return kiraRadioNode(item);

    case "action":
      return kiraActionNode(item, action);

    default:
      return null;
  }
}

/**
 * Data tree → live menu, in three modes: `trigger` + `items` renders static
 * data through the primitive `render` composition; `trigger` + `children`
 * leaves actions to the caller; `handle` + `items(payload)` shares one popup
 * across detached triggers, empty state included when payload is undefined.
 */
export function KiraDropdownMenu<Payload = unknown>(
  props: KiraDropdownMenuProps<Payload>,
): React.JSX.Element {
  return <KiraDropdownMenuSession<Payload> {...props} />;
}

/**
 * Kira mega-component props, one discriminated union for three modes:
 * - `{ trigger, items }`: static data, colocated trigger.
 * - `{ trigger, children }`: low-level composition (own actions).
 * - `{ handle, items(payload) }`: detached triggers sharing one popup.
 */
export interface KiraDropdownCommonProps<Payload = unknown> {
  rootProps?: Omit<Menu.Root.Props<Payload>, "children" | "handle">;
  triggerProps?: Omit<
    Menu.Trigger.Props<Payload>,
    "children" | "render" | "handle"
  >;
  contentProps?: Omit<DropdownMenuContentProps, "children">;
  /** Opt-in Base UI 1.9 preview filtering. @default false */
  searchable?: boolean;
  /** Accessible label for the filter input. @default "Filter actions" */
  searchLabel?: string;
  /** Zero-match message inside the primitive Empty. */
  emptyMessage?: React.ReactNode;

  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- JavaScript promises and action callbacks may reject with any value; the public error callback intentionally receives that original rejection.
  onActionError?: (error: unknown, item: MenuActionItem) => void;
}

export type KiraDropdownMenuProps<Payload = unknown> =
  | (KiraDropdownCommonProps<Payload> & {
      trigger: React.ReactElement;
      items: readonly MenuItemData[];
      children?: never;
      handle?: never;
    })
  | (KiraDropdownCommonProps<Payload> & {
      trigger: React.ReactElement;
      items?: never;
      children: React.ReactNode;
      handle?: never;
    })
  | (KiraDropdownCommonProps<Payload> & {
      trigger?: never;
      items: (payload: Payload) => readonly MenuItemData[];
      children?: never;
      handle: Menu.Handle<Payload>;
    });

/** Resolves the discriminated union into its mode parts (parse at boundary). */
function resolveKiraMode<Payload>(props: KiraDropdownMenuProps<Payload>) {
  return {
    handle: "handle" in props ? props.handle : undefined,
    detachedItems:
      "items" in props && isCallbackProp(props.items) ? props.items : undefined,
    staticItems:
      "items" in props && Array.isArray(props.items) ? props.items : undefined,
    childrenProp: "children" in props ? props.children : undefined,
    triggerProp: "trigger" in props ? props.trigger : undefined,
  };
}

/** Shared popup for all modes. Detached popup consumes the live payload. */
function KiraPopupBody<Payload = unknown>({
  payload,
  action,
  staticItems,
  detachedItems,
  childrenProp,
  searchable,
  searchLabel,
  emptyMessage,
}: {
  payload: Payload | undefined;
  action: KiraActionApi;
  staticItems?: readonly MenuItemData[];
  detachedItems?: (payload: Payload) => readonly MenuItemData[];
  childrenProp?: React.ReactNode;
  searchable: boolean;
  searchLabel: string;
  emptyMessage: React.ReactNode;
}) {
  const body = React.useMemo(() => {
    if (detachedItems) {
      if (payload === undefined) return emptyMenuState(kiraNoItem);

      const data = detachedItems(payload);
      assertTreeIds(data);

      if (data.length === 0) {
        return emptyMenuState(kiraNoActions);
      }

      return data.map((item) => kiraItemNode(item, action, emptyMessage));
    }

    if (staticItems) {
      if (staticItems.length === 0) {
        return emptyMenuState(kiraNoActions);
      }

      assertTreeIds(staticItems);

      return staticItems.map((item) =>
        kiraItemNode(item, action, emptyMessage),
      );
    }

    return childrenProp;
  }, [detachedItems, staticItems, childrenProp, payload, action, emptyMessage]);

  if (!searchable) return <>{body}</>;

  return (
    <>
      <KiraMenuSearch label={searchLabel} />
      <DropdownMenuList className="overflow-y-auto">
        {body}
        <DropdownMenuEmpty>{emptyMessage}</DropdownMenuEmpty>
      </DropdownMenuList>
    </>
  );
}

function emptyMenuState(message: string) {
  return (
    <div
      data-slot="dropdown-menu-empty"
      className="px-2 py-6 text-center text-sm text-muted-foreground"
    >
      {message}
    </div>
  );
}

/**
 * Colocated trigger via `render`. Detached mode uses the external triggers
 * registered with its handle; never add an empty extra trigger.
 */
function sessionTrigger<Payload>(
  triggerProp: React.ReactElement | undefined,
  triggerProps: DropdownMenuTriggerProps<Payload>,
) {
  if (triggerProp) {
    return <DropdownMenuTrigger {...triggerProps} render={triggerProp} />;
  }

  return null;
}

const kiraSearchLabelDefault = "Filter actions";
const kiraEmptyMessageDefault = "No matching actions.";

/**
 * Opening-generation session for detached/data menus: bumps a generation on
 * every accepted closed→open so useMenuAction invalidates stale operations.
 */
function KiraDropdownMenuSession<Payload = unknown>(
  props: KiraDropdownMenuProps<Payload>,
): React.JSX.Element {
  // Base UI detached menu handles are intentionally mutable; preserve the session's manual identity memo.
  "use no memo";

  const sessionProps = resolveKiraDropdownSessionProps(props);

  const {
    rootProps,
    triggerProps,
    contentProps,
    searchable,
    searchLabel,
    emptyMessage,
    onActionError,
    handle,
    detachedItems,
    staticItems,
    childrenProp,
    triggerProp,
  } = sessionProps;

  const statusId = React.useId();

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    rootProps?.defaultOpen ?? false,
  );

  const open = rootProps?.open ?? uncontrolledOpen;
  const [generation, setGeneration] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState("");
  const internalActionsRef = React.useRef<Menu.Root.Actions | null>(null);
  const actionsRef = rootProps?.actionsRef ?? internalActionsRef;

  const sessionKey = React.useMemo(
    () => ({ open, generation, handle }),

    // oxlint-disable-next-line react/preserve-manual-memoization -- The mutable Base UI detached handle participates in manual session identity; this function opts out with use no memo.
    [open, generation, handle],
  );

  const action = useKiraDropdownSessionAction(
    sessionKey,
    onActionError,
    setAnnouncement,
    actionsRef,
  );

  const handleOpenChange = createKiraDropdownOpenChangeHandler({
    rootProps,
    setUncontrolledOpen,
    setGeneration,
    setAnnouncement,
    resetAction: action.reset,
  });

  const popup = (payload: Payload | undefined) =>
    renderPopupSectionPart1({
      contentProps,
      statusId,
      payload,
      action,
      staticItems,
      detachedItems,
      childrenProp,
      searchable,
      searchLabel,
      emptyMessage,
    });

  const triggerEl = sessionTrigger(triggerProp, triggerProps ?? {});

  const menu = (
    <RenderKiraDropdownMenuSessionSectionPart2
      {...{
        rootProps,
        handle,
        open,
        actionsRef,
        handleOpenChange,
        triggerEl,
        popup,
      }}
    />
  );

  return renderKiraDropdownMenuSessionSectionPart3({
    statusId,
    action,
    announcement,
    searchable,
    menu,
  });
}

function createKiraDropdownOpenChangeHandler<Payload>({
  rootProps,
  setUncontrolledOpen,
  setGeneration,
  setAnnouncement,
  resetAction,
}: {
  rootProps: KiraDropdownMenuProps<Payload>["rootProps"];
  setUncontrolledOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGeneration: React.Dispatch<React.SetStateAction<number>>;
  setAnnouncement: React.Dispatch<React.SetStateAction<string>>;
  resetAction: () => void;
}) {
  return (nextOpen: boolean, details: Menu.Root.ChangeEventDetails) => {
    rootProps?.onOpenChange?.(nextOpen, details);

    if (details.isCanceled) return;
    setUncontrolledOpen(nextOpen);

    if (!nextOpen) return;
    setGeneration((value) => value + 1);
    setAnnouncement("");
    resetAction();
  };
}

function useKiraDropdownSessionAction<Payload>(
  sessionKey: object,
  onActionError: KiraDropdownMenuProps<Payload>["onActionError"],
  setAnnouncement: React.Dispatch<React.SetStateAction<string>>,
  actionsRef: React.RefObject<Menu.Root.Actions | null>,
) {
  return useMenuAction({
    sessionKey,
    onError: onActionError,
    onSuccess: (item) => {
      setAnnouncement(item.successMessage ?? `${item.label} completed.`);

      if (item.closeOnSuccess !== false) actionsRef.current?.close();
    },
  });
}

function resolveKiraDropdownSessionProps<Payload>(
  props: KiraDropdownMenuProps<Payload>,
) {
  const defaults = resolveComponentDefaults(props, {
    searchable: false,
    searchLabel: kiraSearchLabelDefault,
    emptyMessage: kiraEmptyMessageDefault,
  });

  const mode = resolveKiraMode(props);

  if (mode.handle && !mode.detachedItems) {
    throw new Error("KiraDropdownMenu: handle mode requires items(payload).");
  }

  return { ...defaults, ...mode };
}

/*                        Filtering parts (Base UI 1.9)                       */

/**
 * Enables filtering for the menu or submenu it wraps (Base UI preview
 * feature, opt-in). Wrap every searchable root or submenu in its own
 * provider; search stays scoped to that provider. Renders no DOM.
 */
function DropdownMenuFilterProvider(props: Menu.FilterProvider.Props) {
  return <Menu.FilterProvider {...props} />;
}

/** Search field that filters the wrapped menu's items. */
function DropdownMenuInput({ className, ...props }: Menu.Input.Props) {
  return (
    <Menu.Input
      data-slot="dropdown-menu-input"
      className={mergeClassName<Menu.Input.State>(
        cn(
          "flex h-8 w-full items-center rounded-md border border-border bg-background ps-3 pe-8 text-sm outline-none",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring",
        ),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Groups items so other content (a filter input) can share the popup.
 * Items and groups must live inside this list when a FilterProvider is used.
 */
function DropdownMenuList({ className, ...props }: Menu.List.Props) {
  return (
    <Menu.List
      data-slot="dropdown-menu-list"
      className={mergeClassName<Menu.List.State>("min-w-0", className)}
      {...props}
    />
  );
}

/** Button that clears the filter input; renders only when the input has text. */
function DropdownMenuClear({ className, ...props }: Menu.Clear.Props) {
  return (
    <Menu.Clear
      data-slot="dropdown-menu-clear"
      className={mergeClassName<Menu.Clear.State>(
        cn(
          "absolute inset-e-1 top-1 flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none",
          "hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
        ),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Zero-match message. The primitive already renders it with role=status and
 * aria-live=polite — never add a second live region around it.
 */
function DropdownMenuEmpty({ className, ...props }: Menu.Empty.Props) {
  return (
    <Menu.Empty
      data-slot="dropdown-menu-empty"
      className={mergeClassName<Menu.Empty.State>(
        cn("px-2 py-6 text-center text-sm text-muted-foreground"),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Content-transition viewport for popups shared by multiple triggers
 * (detached-trigger pattern). Only needed when one popup's content changes
 * per trigger and that switch is animated.
 */
function DropdownMenuViewport({ className, ...props }: Menu.Viewport.Props) {
  return (
    <Menu.Viewport
      data-slot="dropdown-menu-viewport"
      className={mergeClassName<Menu.Viewport.State>(
        cn(
          "relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden outline-none",
        ),
        className,
      )}
      {...props}
    />
  );
}

/*                                  Exports                                   */

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuBackdrop,
  DropdownMenuArrow,
  DropdownMenuFilterProvider,
  DropdownMenuInput,
  DropdownMenuList,
  DropdownMenuClear,
  DropdownMenuEmpty,
  DropdownMenuViewport,
};

export type {
  DropdownMenuProps,
  DropdownMenuPortalProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
  DropdownMenuLinkItemProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuBackdropProps,
  DropdownMenuArrowProps,
};

export type {
  MenuFilterProviderProps,
  MenuInputProps,
  MenuListProps,
  MenuClearProps,
  MenuEmptyProps,
  MenuViewportProps,
} from "@base-ui/react/menu";

export type {
  MenuActionItem,
  MenuActionContext,
  MenuLinkData,
  MenuCheckboxData,
  MenuRadioData,
  MenuRadioOption,
  MenuSeparatorData,
  MenuGroupData,
  MenuSubmenuData,
  MenuItemData,
  MenuActionState,
} from "@/hooks/use-menu-action";

type renderPopupSectionPart1Args<Payload = unknown> = {
  contentProps: Omit<DropdownMenuContentProps, "children"> | undefined;
  statusId: string;
  payload: Payload | undefined;
  action: ReturnType<typeof useMenuAction>;
  staticItems: ReturnType<typeof resolveKiraMode>["staticItems"];
  detachedItems: ((payload: Payload) => readonly MenuItemData[]) | undefined;
  childrenProp: ReturnType<typeof resolveKiraMode>["childrenProp"];
  searchable: boolean;
  searchLabel: string;
  emptyMessage: React.ReactNode;
};

function renderPopupSectionPart1<Payload = unknown>({
  contentProps,
  statusId,
  payload,
  action,
  staticItems,
  detachedItems,
  childrenProp,
  searchable,
  searchLabel,
  emptyMessage,
}: renderPopupSectionPart1Args<Payload>) {
  return (
    <DropdownMenuContent
      {...contentProps}
      aria-describedby={[contentProps?.["aria-describedby"], statusId]
        .filter(Boolean)
        .join(" ")}
    >
      <KiraPopupBody<Payload>
        payload={payload}
        action={action}
        staticItems={staticItems}
        detachedItems={detachedItems}
        childrenProp={childrenProp}
        searchable={searchable}
        searchLabel={searchLabel}
        emptyMessage={emptyMessage}
      />
    </DropdownMenuContent>
  );
}

type renderKiraDropdownMenuSessionSectionPart2Args<Payload = unknown> = {
  rootProps: Omit<Menu.Root.Props<Payload>, "children" | "handle"> | undefined;
  handle: Menu.Handle<Payload> | undefined;
  open: boolean;
  actionsRef: React.RefObject<Menu.Root.Actions | null>;
  handleOpenChange: (
    nextOpen: boolean,
    details: Menu.Root.ChangeEventDetails,
  ) => void;
  triggerEl: ReturnType<typeof sessionTrigger>;
  popup: (payload: Payload | undefined) => React.JSX.Element;
};

function RenderKiraDropdownMenuSessionSectionPart2<Payload = unknown>({
  rootProps,
  handle,
  open,
  actionsRef,
  handleOpenChange,
  triggerEl,
  popup,
}: renderKiraDropdownMenuSessionSectionPart2Args<Payload>) {
  return (
    <DropdownMenu<Payload>
      {...rootProps}
      handle={handle}
      open={open}
      actionsRef={actionsRef}
      onOpenChange={handleOpenChange}
    >
      {({ payload }) => (
        <>
          {triggerEl}
          {popup(payload)}
        </>
      )}
    </DropdownMenu>
  );
}

type renderKiraDropdownMenuSessionSectionPart3Args = {
  statusId: string;
  action: ReturnType<typeof useMenuAction>;
  announcement: string;
  searchable: boolean;
  menu: ReturnType<typeof RenderKiraDropdownMenuSessionSectionPart2>;
};

function renderKiraDropdownMenuSessionSectionPart3({
  statusId,
  action,
  announcement,
  searchable,
  menu,
}: renderKiraDropdownMenuSessionSectionPart3Args) {
  return (
    <>
      {/* One polite status per root, OUTSIDE the Portal: survives closing. */}
      <output
        id={statusId}
        aria-live="polite"
        className="sr-only"
        data-slot="kira-dropdown-menu-status"
      >
        {action.message || announcement}
      </output>
      {searchable ? (
        <DropdownMenuFilterProvider autoHighlight>
          {menu}
        </DropdownMenuFilterProvider>
      ) : (
        menu
      )}
    </>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const DROPDOWN_MENU_CONTENT_DEFAULTS_1 = {
  side: "bottom",
  align: "start",
  sideOffset: 4,
  alignOffset: 0,
  keepMounted: false,
  showBackdrop: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const DROPDOWN_MENU_SUB_CONTENT_DEFAULTS_2 = {
  align: "start",
  sideOffset: 4,
  alignOffset: 0,
  keepMounted: false,
} as const;
