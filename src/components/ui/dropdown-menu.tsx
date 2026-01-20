"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";
import { IconChevronRight, IconCheck, IconLoader } from "@tabler/icons-react";

// =============================================================================
// Types
// =============================================================================

type DropdownMenuProps = Menu.Root.Props;

type DropdownMenuPortalProps = Menu.Portal.Props;

type DropdownMenuTriggerProps = Menu.Trigger.Props;

interface DropdownMenuContentProps extends Menu.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  keepMounted?: boolean;
  showBackdrop?: boolean;
}

type DropdownMenuGroupProps = Menu.Group.Props;

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

interface DropdownMenuItemProps extends Menu.Item.Props {
  inset?: boolean;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
  loading?: boolean;
  closeOnClick?: boolean;
}

type DropdownMenuSubProps = Menu.SubmenuRoot.Props;

interface DropdownMenuSubTriggerProps extends Menu.SubmenuTrigger.Props {
  inset?: boolean;
  icon?: React.ReactNode;
}

interface DropdownMenuSubContentProps extends Menu.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  keepMounted?: boolean;
}

interface DropdownMenuCheckboxItemProps extends Menu.CheckboxItem.Props {
  icon?: React.ReactNode;
  iconChecked?: React.ReactNode;
  inset?: boolean;
  closeOnClick?: boolean;
}

type DropdownMenuRadioGroupProps = Menu.RadioGroup.Props;

interface DropdownMenuRadioItemProps extends Menu.RadioItem.Props {
  inset?: boolean;
  icon?: React.ReactNode;
  closeOnClick?: boolean;
}

type DropdownMenuSeparatorProps = Menu.Separator.Props;

type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

type DropdownMenuBackdropProps = Menu.Backdrop.Props;

type DropdownMenuArrowProps = Menu.Arrow.Props;

interface DropdownMenuWithContentProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentProps?: Omit<DropdownMenuContentProps, "children">;
}

// =============================================================================
// DropdownMenu Root
// =============================================================================

function DropdownMenu({ children, ...props }: DropdownMenuProps) {
  return (
    <Menu.Root data-slot="dropdown-menu" {...props}>
      {children}
    </Menu.Root>
  );
}

// =============================================================================
// DropdownMenuPortal
// =============================================================================

function DropdownMenuPortal(props: DropdownMenuPortalProps) {
  return <Menu.Portal data-slot="dropdown-menu-portal" {...props} />;
}

// =============================================================================
// DropdownMenuTrigger
// =============================================================================

const DropdownMenuTrigger = React.forwardRef<
  HTMLDivElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger({ className, children, ...props }, ref) {
  return (
    <Menu.Trigger
      ref={ref}
      data-slot="dropdown-menu-trigger"
      className={cn("focus:outline-none", className)}
      {...props}
    >
      {children}
    </Menu.Trigger>
  );
});

// =============================================================================
// DropdownMenuBackdrop
// =============================================================================

const DropdownMenuBackdrop = React.forwardRef<
  HTMLDivElement,
  DropdownMenuBackdropProps
>(function DropdownMenuBackdrop({ className, ...props }, ref) {
  return (
    <Menu.Backdrop
      ref={ref}
      data-slot="dropdown-menu-backdrop"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
});

// =============================================================================
// DropdownMenuContent
// =============================================================================

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(
  {
    className,
    sideOffset = 4,
    alignOffset = 0,
    align = "start",
    side,
    keepMounted = false,
    showBackdrop = false,
    ...props
  },
  ref,
) {
  return (
    <Menu.Portal keepMounted={keepMounted}>
      {showBackdrop && <DropdownMenuBackdrop />}
      <Menu.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side={side}
      >
        <Menu.Popup
          ref={ref}
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-32 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
            "max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
            "data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 data-open:zoom-in-95 data-closed:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
});

// =============================================================================
// DropdownMenuArrow
// =============================================================================

const DropdownMenuArrow = React.forwardRef<
  HTMLDivElement,
  DropdownMenuArrowProps
>(function DropdownMenuArrow({ className, ...props }, ref) {
  return (
    <Menu.Arrow
      ref={ref}
      data-slot="dropdown-menu-arrow"
      className={cn(
        "z-50 h-2 w-4",
        "[&>polygon]:fill-popover [&>polygon]:stroke-border",
        className,
      )}
      {...props}
    />
  );
});

// =============================================================================
// DropdownMenuGroup
// =============================================================================

const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuGroupProps
>(function DropdownMenuGroup({ ...props }, ref) {
  return <Menu.Group ref={ref} data-slot="dropdown-menu-group" {...props} />;
});

// =============================================================================
// DropdownMenuLabel
// =============================================================================

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <div
      ref={ref}
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
});

// =============================================================================
// DropdownMenuItem
// =============================================================================

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(function DropdownMenuItem(
  {
    className,
    inset,
    variant = "default",
    icon,
    shortcut,
    loading,
    children,
    disabled,
    closeOnClick,
    ...props
  },
  ref,
) {
  return (
    <Menu.Item
      ref={ref}
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      data-loading={loading}
      className={cn(
        "relative flex flex-row cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "group/dropdown-menu-item [&_.tabler-icon]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        variant === "destructive" &&
          "text-destructive data-[highlighted]:bg-destructive/10 dark:data-[highlighted]:bg-destructive/20 data-[highlighted]:text-destructive",
        inset && "pl-8",
        className,
      )}
      disabled={disabled || loading}
      closeOnClick={closeOnClick}
      {...props}
    >
      {loading ? (
        <IconLoader
          className="h-4 w-4 animate-spin shrink-0"
          aria-label="Loading"
          role="status"
        />
      ) : icon ? (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <DropdownMenuShortcut aria-hidden="true">
          {shortcut}
        </DropdownMenuShortcut>
      )}
    </Menu.Item>
  );
});

// =============================================================================
// DropdownMenuSub
// =============================================================================

function DropdownMenuSub({ ...props }: DropdownMenuSubProps) {
  return <Menu.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

// =============================================================================
// DropdownMenuSubTrigger
// =============================================================================

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(function DropdownMenuSubTrigger(
  { className, inset, icon, children, ...props },
  ref,
) {
  return (
    <Menu.SubmenuTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
      <IconChevronRight
        className="ml-auto h-4 w-4 shrink-0 transition-transform data-[popup-open]:translate-x-0.5"
        aria-hidden="true"
      />
    </Menu.SubmenuTrigger>
  );
});

// =============================================================================
// DropdownMenuSubContent
// =============================================================================

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(function DropdownMenuSubContent(
  {
    className,
    sideOffset = 4,
    alignOffset = 0,
    align = "start",
    keepMounted = false,
    ...props
  },
  ref,
) {
  return (
    <Menu.Portal keepMounted={keepMounted}>
      <Menu.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side="right"
      >
        <Menu.Popup
          ref={ref}
          data-slot="dropdown-menu-sub-content"
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
            "max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
            "data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 data-open:zoom-in-95 data-closed:zoom-out-95",
            "slide-in-from-left-2",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
});

// =============================================================================
// DropdownMenuCheckboxItem
// =============================================================================

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
  { className, children, icon, iconChecked, inset, closeOnClick, ...props },
  ref,
) {
  return (
    <Menu.CheckboxItem
      ref={ref}
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      closeOnClick={closeOnClick}
      {...props}
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center"
        aria-hidden="true"
      >
        <Menu.CheckboxItemIndicator>
          {iconChecked || <IconCheck className="h-4 w-4" />}
        </Menu.CheckboxItemIndicator>
      </span>
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Menu.CheckboxItem>
  );
});

// =============================================================================
// DropdownMenuRadioGroup
// =============================================================================

const DropdownMenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuRadioGroupProps
>(function DropdownMenuRadioGroup({ ...props }, ref) {
  return (
    <Menu.RadioGroup
      ref={ref}
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
});

// =============================================================================
// DropdownMenuRadioItem
// =============================================================================

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(function DropdownMenuRadioItem(
  { className, children, icon, inset, closeOnClick, ...props },
  ref,
) {
  return (
    <Menu.RadioItem
      ref={ref}
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      closeOnClick={closeOnClick}
      {...props}
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center"
        aria-hidden="true"
      >
        <Menu.RadioItemIndicator>
          <IconCheck className="h-4 w-4" />
        </Menu.RadioItemIndicator>
      </span>
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Menu.RadioItem>
  );
});

// =============================================================================
// DropdownMenuSeparator
// =============================================================================

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <Menu.Separator
      ref={ref}
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
});

// =============================================================================
// DropdownMenuShortcut
// =============================================================================

const DropdownMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  DropdownMenuShortcutProps
>(function DropdownMenuShortcut({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      data-slot="dropdown-menu-shortcut"
      aria-hidden="true"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
});

// =============================================================================
// DropdownMenuWithContent (Convenience Wrapper)
// =============================================================================

function DropdownMenuWithContent({
  trigger,
  children,
  className,
  contentProps,
}: DropdownMenuWithContentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent {...contentProps}>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================================
// Exports
// =============================================================================

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
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
  DropdownMenuWithContent,
};

// =============================================================================
// Type Exports
// =============================================================================

export type {
  DropdownMenuProps,
  DropdownMenuPortalProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuItemProps,
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
  DropdownMenuWithContentProps,
};
