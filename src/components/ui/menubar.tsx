"use client";

import * as React from "react";
import type { BaseUIEvent } from "@base-ui/react/types";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { cva, type VariantProps } from "class-variance-authority";
import { IconSearch } from "@tabler/icons-react";

import { cn } from "cn";
import { usePlatform } from "@/hooks/use-platform";
import {
  createDropdownMenuHandle,
  DropdownMenu,
  DropdownMenuBackdrop,
  DropdownMenuArrow,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  type DropdownMenuContentProps,
  type DropdownMenuProps,
  type DropdownMenuPortalProps,
  type DropdownMenuCheckboxItemProps,
  type DropdownMenuSubProps,
  type DropdownMenuBackdropProps,
  type DropdownMenuArrowProps,
  type MenuItemData,
  type MenuActionItem,
  DropdownMenuGroup,
  type DropdownMenuGroupProps,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  DropdownMenuLabel,
  type DropdownMenuLabelProps,
  DropdownMenuLinkItem,
  type DropdownMenuLinkItemProps,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  type DropdownMenuRadioGroupProps,
  DropdownMenuRadioItem,
  type DropdownMenuRadioItemProps,
  DropdownMenuSeparator,
  type DropdownMenuSeparatorProps,
  DropdownMenuShortcut,
  type DropdownMenuShortcutProps,
  DropdownMenuSub,
  DropdownMenuSubContent,
  type DropdownMenuSubContentProps,
  DropdownMenuSubTrigger,
  type DropdownMenuSubTriggerProps,
  DropdownMenuTrigger,
  type DropdownMenuTriggerProps,
  DropdownMenuFilterProvider,
  DropdownMenuInput,
  DropdownMenuList,
  DropdownMenuClear,
  DropdownMenuEmpty,
  DropdownMenuViewport,
  KiraDropdownMenu,
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
} from "@/components/ui/dropdown-menu";
import { isFunctionProp } from "@/components/ui/prop-guards";

/* -------------------------------------------------------------------------- */
/*                                  Variants                                  */
/* -------------------------------------------------------------------------- */

/** Menubar root container; `data-[orientation]` comes from the primitive. */
export const menubarVariants = cva(
  [
    "group/menubar flex min-h-10 w-fit max-w-full items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-xs",
    "data-[orientation=vertical]:min-w-40 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  ],
  {
    variants: {
      variant: {
        default: "",
        outline: "shadow-none",
        soft: "border-transparent bg-muted/60 shadow-none",
      },
      density: {
        comfortable: "",
        compact: "min-h-9",
      },
    },
    defaultVariants: { variant: "default", density: "comfortable" },
  },
);

/** Menubar popups and rows reuse the dropdown CVAs (one-way dependency). */
export const menubarContentVariants = dropdownMenuContentVariants;
export const menubarItemVariants = dropdownMenuItemVariants;

export const menubarTriggerVariants = cva([
  "flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition-colors group-data-[density=compact]/menubar:h-7 group-data-[density=compact]/menubar:px-2",
  "hover:bg-muted focus-visible:bg-muted data-popup-open:bg-muted",
  "motion-reduce:transition-none",
]);

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface MenubarProps
  extends MenubarPrimitive.Props, VariantProps<typeof menubarVariants> {}

type MenubarMenuProps = DropdownMenuProps;

type MenubarPortalProps = DropdownMenuPortalProps;

type MenubarTriggerProps = DropdownMenuTriggerProps;

type MenubarContentProps = DropdownMenuContentProps;

type MenubarGroupProps = DropdownMenuGroupProps;

type MenubarLabelProps = DropdownMenuLabelProps;

type MenubarItemProps = DropdownMenuItemProps;

type MenubarLinkItemProps = DropdownMenuLinkItemProps;

type MenubarCheckboxItemProps = DropdownMenuCheckboxItemProps;

type MenubarRadioGroupProps = DropdownMenuRadioGroupProps;

type MenubarRadioItemProps = DropdownMenuRadioItemProps;

type MenubarSeparatorProps = DropdownMenuSeparatorProps;

type MenubarShortcutProps = DropdownMenuShortcutProps;

type MenubarSubProps = DropdownMenuSubProps;

type MenubarSubTriggerProps = DropdownMenuSubTriggerProps;

type MenubarSubContentProps = DropdownMenuSubContentProps;

type MenubarBackdropProps = DropdownMenuBackdropProps;

type MenubarArrowProps = DropdownMenuArrowProps;

type MenubarFilterProviderProps = React.ComponentProps<
  typeof DropdownMenuFilterProvider
>;

type MenubarInputProps = React.ComponentProps<typeof DropdownMenuInput>;

type MenubarListProps = React.ComponentProps<typeof DropdownMenuList>;

type MenubarClearProps = React.ComponentProps<typeof DropdownMenuClear>;

type MenubarEmptyProps = React.ComponentProps<typeof DropdownMenuEmpty>;

type MenubarViewportProps = React.ComponentProps<typeof DropdownMenuViewport>;

function mergeClassName<S>(
  base: string,
  className: string | ((state: S) => string | undefined) | undefined,
) {
  return isFunctionProp(className)
    ? (state: S) => cn(base, className(state))
    : cn(base, className);
}

/* -------------------------------------------------------------------------- */
/*                                Components                                  */
/* -------------------------------------------------------------------------- */

/**
 * Container for menus. Delegates orientation, loopFocus, disabled, modal and
 * sibling coordination to the Base UI Menubar primitive; each top-level menu
 * is a `Menu.Root` nested inside its context.
 */
function Menubar({
  className,
  variant,
  density = "comfortable",
  ...props
}: MenubarProps) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      data-density={density}
      className={mergeClassName<MenubarPrimitive.State>(
        menubarVariants({ variant, density }),
        className,
      )}
      {...props}
    />
  );
}

/** One top-level menu: a `Menu.Root` under the Menubar context. */
function MenubarMenu({ ...props }: MenubarMenuProps) {
  return <DropdownMenu data-slot="menubar-menu" {...props} />;
}

function MenubarPortal(props: MenubarPortalProps) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />;
}

function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      className={mergeClassName(menubarTriggerVariants(), className)}
      {...props}
    />
  );
}

function MenubarBackdrop(props: MenubarBackdropProps) {
  return <DropdownMenuBackdrop data-slot="menubar-backdrop" {...props} />;
}

function MenubarContent({ className, ...props }: MenubarContentProps) {
  return (
    <DropdownMenuContent
      data-slot="menubar-content"
      className={className}
      {...props}
    />
  );
}

function MenubarArrow(props: MenubarArrowProps) {
  return <DropdownMenuArrow data-slot="menubar-arrow" {...props} />;
}

function MenubarGroup(props: MenubarGroupProps) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />;
}

function MenubarLabel(props: MenubarLabelProps) {
  return <DropdownMenuLabel data-slot="menubar-label" {...props} />;
}

function MenubarItem(props: MenubarItemProps) {
  return <DropdownMenuItem data-slot="menubar-item" {...props} />;
}

function MenubarLinkItem(props: MenubarLinkItemProps) {
  return <DropdownMenuLinkItem data-slot="menubar-link-item" {...props} />;
}

function MenubarCheckboxItem(props: MenubarCheckboxItemProps) {
  return (
    <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />
  );
}

function MenubarRadioGroup(props: MenubarRadioGroupProps) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarRadioItem(props: MenubarRadioItemProps) {
  return <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />;
}

function MenubarSeparator(props: MenubarSeparatorProps) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />;
}

function MenubarShortcut(props: MenubarShortcutProps) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />;
}

function MenubarSub(props: MenubarSubProps) {
  return <DropdownMenuSub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger(props: MenubarSubTriggerProps) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />;
}

function MenubarSubContent(props: MenubarSubContentProps) {
  return <DropdownMenuSubContent data-slot="menubar-sub-content" {...props} />;
}

function MenubarFilterProvider(props: MenubarFilterProviderProps) {
  return <DropdownMenuFilterProvider {...props} />;
}

function MenubarInput(props: MenubarInputProps) {
  return <DropdownMenuInput data-slot="menubar-input" {...props} />;
}

function MenubarList(props: MenubarListProps) {
  return <DropdownMenuList data-slot="menubar-list" {...props} />;
}

function MenubarClear(props: MenubarClearProps) {
  return <DropdownMenuClear data-slot="menubar-clear" {...props} />;
}

function MenubarEmpty(props: MenubarEmptyProps) {
  return <DropdownMenuEmpty data-slot="menubar-empty" {...props} />;
}

function MenubarViewport(props: MenubarViewportProps) {
  return <DropdownMenuViewport data-slot="menubar-viewport" {...props} />;
}

/* -------------------------------------------------------------------------- */
/*                                  Exports                                   */
/* -------------------------------------------------------------------------- */

export {
  Menubar,
  MenubarMenu,
  MenubarPortal,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
  MenubarLinkItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarBackdrop,
  MenubarArrow,
  MenubarFilterProvider,
  MenubarInput,
  MenubarList,
  MenubarClear,
  MenubarEmpty,
  MenubarViewport,
  createDropdownMenuHandle,
};

export type {
  MenubarProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarTriggerProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarLabelProps,
  MenubarItemProps,
  MenubarLinkItemProps,
  MenubarCheckboxItemProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
  MenubarBackdropProps,
  MenubarArrowProps,
  MenubarFilterProviderProps,
  MenubarInputProps,
  MenubarListProps,
  MenubarClearProps,
  MenubarEmptyProps,
  MenubarViewportProps,
};

export { dropdownMenuContentVariants, dropdownMenuItemVariants };

/* -------------------------------------------------------------------------- */
/*                           KiraMenubar (data-driven)                        */
/* -------------------------------------------------------------------------- */

export interface KiraMenubarMenuData {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  searchable?: boolean;
  items: readonly MenuItemData[];
}

export interface KiraMenubarProps {
  menus: readonly KiraMenubarMenuData[];
  rootProps?: MenubarProps;
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- JavaScript can throw any value; the public action-error callback preserves the original failure for consumers.
  onActionError?: (error: unknown, item: MenuActionItem) => void;
  /** Adds one searchable menu of actions and links from every enabled menu. */
  commandSearch?: boolean;
}

/** Preferences stay in their own menus; command search finds invokable actions. */
function menuCommands(
  items: readonly MenuItemData[],
  prefix: string,
): MenuItemData[] {
  return items.flatMap((item) => menubarFlatMap(item, prefix, menuCommands));
}

/**
 * Data-driven editor menubar: a native Menubar root plus one
 * KiraDropdownMenu per top-level menu. Reuses the dropdown's whole data
 * renderer and async lifecycle (no second engine); each Menu.Root stays
 * directly under the Menubar context and the parent controls modality.
 */
export function KiraMenubar(arg0: KiraMenubarProps): React.JSX.Element {
  const model = useKiraMenubarModel(arg0);

  return <KiraMenubarView {...model} />;
}

// Re-exported through dropdown-menu so the registry embeds the hook once
// (menubar → dropdown-menu dependency carries ui/dropdown-menu.tsx, which
// imports the hook directly).
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
} from "@/components/ui/dropdown-menu";

function useKiraMenubarModel(props: KiraMenubarProps) {
  const { menus, rootProps, onActionError, commandSearch = false } = props;
  const commandTrigger = React.useRef<HTMLButtonElement | null>(null);
  const platform = usePlatform();

  const commands: MenuItemData[] = menus
    .filter((menu) => !menu.disabled)
    .flatMap((menu) => menubarFlatMap2(menu));

  return {
    rootProps,
    commandSearch,
    commandTrigger,
    menus,
    onActionError,
    platform,
    commands,
  };
}

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function KiraMenubarView({
  rootProps,
  commandSearch,
  commandTrigger,
  menus,
  onActionError,
  platform,
  commands,
}: ReturnType<typeof useKiraMenubarModel>) {
  return (
    <Menubar
      {...rootProps}
      modal={rootProps?.modal ?? false}
      data-slot="kira-menubar"
      onKeyDown={(event) =>
        menubarCallback(event, rootProps, commandSearch, commandTrigger)
      }
    >
      {menus.length === 0 ? (
        <span
          data-slot="kira-menubar-empty"
          className="px-3 py-1.5 text-sm text-muted-foreground"
        >
          No actions available.
        </span>
      ) : (
        menus.map((menu) => (
          <KiraDropdownMenu
            key={menu.id}
            trigger={
              <button
                type="button"
                data-slot="kira-menubar-trigger"
                className={menubarTriggerVariants()}
              >
                {menu.icon && (
                  <span
                    aria-hidden="true"
                    className="[&_svg]:size-4 [&_svg]:shrink-0"
                  >
                    {menu.icon}
                  </span>
                )}
                {menu.label}
              </button>
            }
            rootProps={{
              disabled: menu.disabled || rootProps?.disabled,
            }}
            items={menu.items}
            searchable={menu.searchable}
            onActionError={onActionError}
          />
        ))
      )}
      {commandSearch && (
        <KiraDropdownMenu
          trigger={
            <button
              type="button"
              aria-label="Find a command"
              aria-keyshortcuts="Control+K Meta+K"
              className={cn(
                menubarTriggerVariants(),
                "ms-auto border-s border-border ps-3 text-muted-foreground",
              )}
            >
              <IconSearch aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">Commands</span>
              <span
                aria-hidden="true"
                className="hidden text-xs font-normal lg:inline"
              >
                {platform === "mac" ? "⌘ K" : "Ctrl K"}
              </span>
            </button>
          }
          triggerProps={{ ref: commandTrigger }}
          rootProps={{ disabled: rootProps?.disabled }}
          searchable
          searchLabel="Find a command"
          items={commands}
          contentProps={{ align: "end", className: "w-72" }}
          onActionError={onActionError}
        />
      )}
    </Menubar>
  );
}

function menubarFlatMap(
  item: MenuItemData,
  prefix: string,
  menuCommands: (
    items: readonly MenuItemData[],
    prefix: string,
  ) => MenuItemData[],
): MenuItemData[] {
  const id = `${prefix}/${item.id}`;

  if (item.type === "action" || item.type === "link") return [{ ...item, id }];

  if (item.type === "group" || (item.type === "submenu" && !item.disabled)) {
    const children = menuCommands(item.items, id);

    return children.length
      ? [{ type: "group", id, label: item.label, items: children }]
      : [];
  }

  return [];
}

function menubarFlatMap2(menu: KiraMenubarMenuData): MenuItemData[] {
  const items = menuCommands(menu.items, menu.id);

  return items.length
    ? [
        {
          type: "group",
          id: `commands/${menu.id}`,
          label: menu.label,
          items,
        },
      ]
    : [];
}

function menubarCallback(
  event: BaseUIEvent<React.KeyboardEvent<HTMLDivElement>>,
  rootProps: MenubarProps | undefined,
  commandSearch: boolean,
  commandTrigger: React.RefObject<HTMLButtonElement | null>,
) {
  rootProps?.onKeyDown?.(event);

  if (!commandSearch || rootProps?.disabled) return;

  if (event.defaultPrevented) return;

  if (isCommandSearchShortcut(event)) {
    event.preventDefault();
    commandTrigger.current?.click();
  }
}

function isCommandSearchShortcut(event: React.KeyboardEvent<HTMLDivElement>) {
  return (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
}
