import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// Context to close other menus when one opens
interface NavigationMenuContextValue {
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  openOnHover: boolean;
  hoverDelay: number;
}

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);

// Navigation Menu Root with context for closing other menus
interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Open dropdowns on hover instead of click */
  openOnHover?: boolean;
  /** Delay in ms before opening on hover (default: 100) */
  hoverDelay?: number;
}

function NavigationMenu({
  className,
  children,
  openOnHover = false,
  hoverDelay = 100,
  ...props
}: NavigationMenuProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  return (
    <NavigationMenuContext.Provider
      value={{ openMenu, setOpenMenu, openOnHover, hoverDelay }}
    >
      <nav
        data-slot="navigation-menu"
        className={cn("relative z-10 flex items-center gap-1", className)}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

// Navigation Menu List
function NavigationMenuList({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

// Navigation Menu Item
function NavigationMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

// Navigation Menu Trigger Style
const navigationMenuTriggerStyle =
  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:bg-muted";

// Navigation Menu using Base UI Menu for dropdown
interface NavigationMenuDropdownProps extends Omit<
  MenuPrimitive.Root.Props,
  "open" | "onOpenChange"
> {
  menuId: string;
}

function NavigationMenuDropdown({
  menuId,
  children,
  ...props
}: NavigationMenuDropdownProps) {
  const context = React.useContext(NavigationMenuContext);
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const isOpen = context?.openMenu === menuId;
  const openOnHover = context?.openOnHover ?? false;
  const hoverDelay = context?.hoverDelay ?? 100;

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (context) {
        context.setOpenMenu(open ? menuId : null);
      }
    },
    [context, menuId],
  );

  const handleMouseEnter = React.useCallback(() => {
    if (!openOnHover) return;

    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Set a timeout to open the menu
    hoverTimeoutRef.current = setTimeout(() => {
      handleOpenChange(true);
    }, hoverDelay);
  }, [openOnHover, hoverDelay, handleOpenChange]);

  const handleMouseLeave = React.useCallback(() => {
    if (!openOnHover) return;

    // Clear any pending open timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Set a timeout to close the menu
    closeTimeoutRef.current = setTimeout(() => {
      handleOpenChange(false);
    }, hoverDelay);
  }, [openOnHover, hoverDelay, handleOpenChange]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="contents"
    >
      <MenuPrimitive.Root
        data-slot="navigation-menu-dropdown"
        open={isOpen}
        onOpenChange={handleOpenChange}
        openOnHover={openOnHover}
        {...props}
      >
        {children}
      </MenuPrimitive.Root>
    </div>
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle, "gap-1", className)}
      {...props}
    >
      {children}
      <svg
        className="h-3 w-3 transition-transform duration-200 group-data-[popup-open]:rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </MenuPrimitive.Trigger>
  );
}

// Navigation Menu Content (dropdown)
interface NavigationMenuContentProps extends MenuPrimitive.Popup.Props {
  megaMenu?: boolean;
}

function NavigationMenuContent({
  className,
  megaMenu = false,
  ...props
}: NavigationMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner sideOffset={4}>
        <MenuPrimitive.Popup
          data-slot="navigation-menu-content"
          data-mega-menu={megaMenu || undefined}
          className={cn(
            "z-[100] w-full rounded-lg border border-border bg-popover shadow-lg md:w-auto",
            megaMenu ? "p-0" : "p-4",
            "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

// Navigation Menu Link (for direct links without dropdown)
interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  active?: boolean;
}

function NavigationMenuLink({
  className,
  to,
  active,
  children,
  ...props
}: NavigationMenuLinkProps) {
  const baseClass = cn(
    navigationMenuTriggerStyle,
    active && "bg-muted",
    className,
  );

  if (to) {
    return (
      <Link to={to} data-slot="navigation-menu-link" className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <a data-slot="navigation-menu-link" className={baseClass} {...props}>
      {children}
    </a>
  );
}

// Navigation Menu Header (for mega menu sections)
function NavigationMenuHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-header"
      className={cn("mb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Navigation Menu Footer (for mega menu footer)
function NavigationMenuFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-menu-footer"
      className={cn(
        "flex items-center justify-between border-t border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Navigation Menu Section (grouped items with title)
interface NavigationMenuSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

function NavigationMenuSection({
  title,
  className,
  children,
  ...props
}: NavigationMenuSectionProps) {
  return (
    <div
      data-slot="navigation-menu-section"
      className={cn("space-y-2", className)}
      {...props}
    >
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

// Navigation Menu View All link
interface NavigationMenuViewAllProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  title: string;
  description?: string;
}

function NavigationMenuViewAll({
  href,
  title,
  description,
  className,
  ...props
}: NavigationMenuViewAllProps) {
  return (
    <a
      href={href}
      data-slot="navigation-menu-view-all"
      className={cn(
        "group flex items-center gap-2 rounded-md p-3 text-sm transition-colors hover:bg-muted",
        className,
      )}
      {...props}
    >
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <svg
        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </a>
  );
}

// List Item component for grid layouts in content
interface ListItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  title: string;
  icon?: React.ReactNode;
  description?: string;
}

function ListItem({
  className,
  title,
  to,
  icon,
  description,
  children,
  ...props
}: ListItemProps) {
  const content = (
    <>
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </span>
      )}
      <div className="flex-1">
        <div className="text-sm font-medium leading-none">{title}</div>
        {(children || description) && (
          <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children || description}
          </p>
        )}
      </div>
    </>
  );

  const baseClass = cn(
    "flex select-none items-start gap-3 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted",
    className,
  );

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <a className={baseClass} {...props}>
      {content}
    </a>
  );
}

// =============================================================================
// Submenu Components
// =============================================================================

// Submenu Root
function NavigationMenuSub({
  children,
  ...props
}: MenuPrimitive.SubmenuRoot.Props) {
  return (
    <MenuPrimitive.SubmenuRoot data-slot="navigation-menu-sub" {...props}>
      {children}
    </MenuPrimitive.SubmenuRoot>
  );
}

// Submenu Trigger
interface NavigationMenuSubTriggerProps
  extends MenuPrimitive.SubmenuTrigger.Props {
  inset?: boolean;
  icon?: React.ReactNode;
}

function NavigationMenuSubTrigger({
  className,
  inset,
  icon,
  children,
  ...props
}: NavigationMenuSubTriggerProps) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="navigation-menu-sub-trigger"
      className={cn(
        "group flex w-full cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors",
        "hover:bg-muted focus:bg-muted",
        "data-[popup-open]:bg-muted",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
      <svg
        className="h-4 w-4 text-muted-foreground transition-transform group-data-[popup-open]:rotate-90"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </MenuPrimitive.SubmenuTrigger>
  );
}

// Submenu Content
interface NavigationMenuSubContentProps extends MenuPrimitive.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
}

function NavigationMenuSubContent({
  className,
  sideOffset = 2,
  alignOffset = -4,
  ...props
}: NavigationMenuSubContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
      >
        <MenuPrimitive.Popup
          data-slot="navigation-menu-sub-content"
          className={cn(
            "z-[110] min-w-[180px] rounded-lg border border-border bg-popover p-1 shadow-lg",
            "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
            "data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2",
            className,
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

// Submenu Item (styled menu item for use inside submenus)
interface NavigationMenuSubItemProps extends MenuPrimitive.Item.Props {
  inset?: boolean;
  icon?: React.ReactNode;
}

function NavigationMenuSubItem({
  className,
  inset,
  icon,
  children,
  ...props
}: NavigationMenuSubItemProps) {
  return (
    <MenuPrimitive.Item
      data-slot="navigation-menu-sub-item"
      className={cn(
        "flex w-full cursor-default select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors",
        "hover:bg-muted focus:bg-muted",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </MenuPrimitive.Item>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuDropdown,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuHeader,
  NavigationMenuFooter,
  NavigationMenuSection,
  NavigationMenuViewAll,
  NavigationMenuSub,
  NavigationMenuSubTrigger,
  NavigationMenuSubContent,
  NavigationMenuSubItem,
  ListItem,
  navigationMenuTriggerStyle,
};
