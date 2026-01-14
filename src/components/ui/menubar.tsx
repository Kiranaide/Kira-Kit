"use client";

import * as React from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";
import {
  IconLoader,
  IconCheck,
  IconPointFilled,
  IconChevronRight,
} from "@tabler/icons-react";

// =============================================================================
// Types
// =============================================================================

type MenubarProps = React.HTMLAttributes<HTMLDivElement>;

type MenubarMenuProps = MenuPrimitive.Root.Props;

type MenubarPortalProps = MenuPrimitive.Portal.Props;

type MenubarTriggerProps = MenuPrimitive.Trigger.Props;

interface MenubarContentProps extends MenuPrimitive.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  keepMounted?: boolean;
  showBackdrop?: boolean;
}

type MenubarGroupProps = MenuPrimitive.Group.Props;

interface MenubarLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}

interface MenubarItemProps extends MenuPrimitive.Item.Props {
  inset?: boolean;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
  loading?: boolean;
  closeOnClick?: boolean;
}

interface MenubarCheckboxItemProps extends MenuPrimitive.CheckboxItem.Props {
  icon?: React.ReactNode;
  iconChecked?: React.ReactNode;
  inset?: boolean;
  closeOnClick?: boolean;
}

type MenubarRadioGroupProps = MenuPrimitive.RadioGroup.Props;

interface MenubarRadioItemProps extends MenuPrimitive.RadioItem.Props {
  icon?: React.ReactNode;
  inset?: boolean;
  closeOnClick?: boolean;
}

type MenubarSeparatorProps = MenuPrimitive.Separator.Props;

type MenubarShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

type MenubarSubProps = MenuPrimitive.SubmenuRoot.Props;

interface MenubarSubTriggerProps extends MenuPrimitive.SubmenuTrigger.Props {
  inset?: boolean;
  icon?: React.ReactNode;
}

interface MenubarSubContentProps extends MenuPrimitive.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  keepMounted?: boolean;
}

type MenubarBackdropProps = MenuPrimitive.Backdrop.Props;

type MenubarArrowProps = MenuPrimitive.Arrow.Props;

interface MenubarWithContentProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentProps?: Omit<MenubarContentProps, "children">;
}

// =============================================================================
// Menubar Root
// =============================================================================

const Menubar = React.forwardRef<HTMLDivElement, MenubarProps>(function Menubar(
  { className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot="menubar"
      role="menubar"
      className={cn(
        "flex h-10 items-center gap-1 rounded-lg border border-border bg-background p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

// =============================================================================
// MenubarMenu
// =============================================================================

function MenubarMenu({ children, ...props }: MenubarMenuProps) {
  return (
    <MenuPrimitive.Root data-slot="menubar-menu" {...props}>
      {children}
    </MenuPrimitive.Root>
  );
}

// =============================================================================
// MenubarPortal
// =============================================================================

function MenubarPortal(props: MenubarPortalProps) {
  return <MenuPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

// =============================================================================
// MenubarTrigger
// =============================================================================

const MenubarTrigger = React.forwardRef<HTMLDivElement, MenubarTriggerProps>(
  function MenubarTrigger({ className, children, ...props }, ref) {
    return (
      <MenuPrimitive.Trigger
        ref={ref}
        data-slot="menubar-trigger"
        className={cn(
          "flex cursor-pointer select-none items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors",
          "hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "data-[popup-open]:bg-muted",
          className
        )}
        {...props}
      >
        {children}
      </MenuPrimitive.Trigger>
    );
  }
);

// =============================================================================
// MenubarBackdrop
// =============================================================================

const MenubarBackdrop = React.forwardRef<HTMLDivElement, MenubarBackdropProps>(
  function MenubarBackdrop({ className, ...props }, ref) {
    return (
      <MenuPrimitive.Backdrop
        ref={ref}
        data-slot="menubar-backdrop"
        className={cn("fixed inset-0 z-50 bg-black/50", className)}
        {...props}
      />
    );
  }
);

// =============================================================================
// MenubarContent
// =============================================================================

const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(
  function MenubarContent(
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
    ref
  ) {
    return (
      <MenuPrimitive.Portal keepMounted={keepMounted}>
        {showBackdrop && <MenubarBackdrop />}
        <MenuPrimitive.Positioner
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          align={align}
          side={side}
        >
          <MenuPrimitive.Popup
            ref={ref}
            data-slot="menubar-content"
            className={cn(
              "z-[100] min-w-[12rem] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg",
              "max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
              "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            {...props}
          />
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    );
  }
);

// =============================================================================
// MenubarArrow
// =============================================================================

const MenubarArrow = React.forwardRef<HTMLDivElement, MenubarArrowProps>(
  function MenubarArrow({ className, ...props }, ref) {
    return (
      <MenuPrimitive.Arrow
        ref={ref}
        data-slot="menubar-arrow"
        className={cn(
          "z-50 h-2 w-4",
          "[&>polygon]:fill-popover [&>polygon]:stroke-border",
          className
        )}
        {...props}
      />
    );
  }
);

// =============================================================================
// MenubarGroup
// =============================================================================

const MenubarGroup = React.forwardRef<HTMLDivElement, MenubarGroupProps>(
  function MenubarGroup({ ...props }, ref) {
    return (
      <MenuPrimitive.Group ref={ref} data-slot="menubar-group" {...props} />
    );
  }
);

// =============================================================================
// MenubarItem
// =============================================================================

const MenubarItem = React.forwardRef<HTMLDivElement, MenubarItemProps>(
  function MenubarItem(
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
    ref
  ) {
    return (
      <MenuPrimitive.Item
        ref={ref}
        data-slot="menubar-item"
        data-inset={inset}
        data-variant={variant}
        data-loading={loading}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
          "group/menubar-item [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          variant === "destructive" &&
            "text-destructive data-[highlighted]:bg-destructive/10 dark:data-[highlighted]:bg-destructive/20 data-[highlighted]:text-destructive",
          inset && "pl-8",
          className
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
          <span
            className="h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <span className="flex-1">{children}</span>
        {shortcut && (
          <MenubarShortcut aria-hidden="true">{shortcut}</MenubarShortcut>
        )}
      </MenuPrimitive.Item>
    );
  }
);

// =============================================================================
// MenubarCheckboxItem
// =============================================================================

const MenubarCheckboxItem = React.forwardRef<
  HTMLDivElement,
  MenubarCheckboxItemProps
>(function MenubarCheckboxItem(
  { className, children, icon, iconChecked, inset, closeOnClick, ...props },
  ref
) {
  return (
    <MenuPrimitive.CheckboxItem
      ref={ref}
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      closeOnClick={closeOnClick}
      {...props}
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center"
        aria-hidden="true"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          {iconChecked || <IconCheck className="h-4 w-4" />}
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </MenuPrimitive.CheckboxItem>
  );
});

// =============================================================================
// MenubarRadioGroup
// =============================================================================

const MenubarRadioGroup = React.forwardRef<
  HTMLDivElement,
  MenubarRadioGroupProps
>(function MenubarRadioGroup({ children, ...props }, ref) {
  return (
    <MenuPrimitive.RadioGroup
      ref={ref}
      data-slot="menubar-radio-group"
      {...props}
    >
      {children}
    </MenuPrimitive.RadioGroup>
  );
});

// =============================================================================
// MenubarRadioItem
// =============================================================================

const MenubarRadioItem = React.forwardRef<
  HTMLDivElement,
  MenubarRadioItemProps
>(function MenubarRadioItem(
  { className, children, icon, inset, closeOnClick, ...props },
  ref
) {
  return (
    <MenuPrimitive.RadioItem
      ref={ref}
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      closeOnClick={closeOnClick}
      {...props}
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center"
        aria-hidden="true"
      >
        <MenuPrimitive.RadioItemIndicator>
          <IconPointFilled className="h-3 w-3 fill-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </MenuPrimitive.RadioItem>
  );
});

// =============================================================================
// MenubarSeparator
// =============================================================================

const MenubarSeparator = React.forwardRef<
  HTMLDivElement,
  MenubarSeparatorProps
>(function MenubarSeparator({ className, ...props }, ref) {
  return (
    <MenuPrimitive.Separator
      ref={ref}
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
});

// =============================================================================
// MenubarLabel
// =============================================================================

const MenubarLabel = React.forwardRef<HTMLDivElement, MenubarLabelProps>(
  function MenubarLabel({ className, inset, ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot="menubar-label"
        className={cn(
          "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
          inset && "pl-8",
          className
        )}
        {...props}
      />
    );
  }
);

// =============================================================================
// MenubarShortcut
// =============================================================================

const MenubarShortcut = React.forwardRef<HTMLSpanElement, MenubarShortcutProps>(
  function MenubarShortcut({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        data-slot="menubar-shortcut"
        aria-hidden="true"
        className={cn(
          "ml-auto text-xs tracking-widest text-muted-foreground",
          className
        )}
        {...props}
      />
    );
  }
);

// =============================================================================
// MenubarSub
// =============================================================================

function MenubarSub({ children, ...props }: MenubarSubProps) {
  return (
    <MenuPrimitive.SubmenuRoot data-slot="menubar-sub" {...props}>
      {children}
    </MenuPrimitive.SubmenuRoot>
  );
}

// =============================================================================
// MenubarSubTrigger
// =============================================================================

const MenubarSubTrigger = React.forwardRef<
  HTMLDivElement,
  MenubarSubTriggerProps
>(function MenubarSubTrigger(
  { className, inset, icon, children, ...props },
  ref
) {
  return (
    <MenuPrimitive.SubmenuTrigger
      ref={ref}
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        "data-[popup-open]:bg-accent data-[popup-open]:text-accent-foreground",
        inset && "pl-8",
        className
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
    </MenuPrimitive.SubmenuTrigger>
  );
});

// =============================================================================
// MenubarSubContent
// =============================================================================

const MenubarSubContent = React.forwardRef<
  HTMLDivElement,
  MenubarSubContentProps
>(function MenubarSubContent(
  {
    className,
    sideOffset = 4,
    alignOffset = 0,
    align = "start",
    keepMounted = false,
    ...props
  },
  ref
) {
  return (
    <MenuPrimitive.Portal keepMounted={keepMounted}>
      <MenuPrimitive.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side="right"
      >
        <MenuPrimitive.Popup
          ref={ref}
          data-slot="menubar-sub-content"
          className={cn(
            "z-[100] min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg",
            "max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
            "data-open:animate-in data-closed:animate-out data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-95 data-open:zoom-in-95",
            "slide-in-from-left-2",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
});

// =============================================================================
// MenubarWithContent (Convenience Wrapper)
// =============================================================================

function MenubarWithContent({
  trigger,
  children,
  className,
  contentProps,
}: MenubarWithContentProps) {
  return (
    <MenubarMenu>
      <MenubarTrigger className={className}>{trigger}</MenubarTrigger>
      <MenubarContent {...contentProps}>{children}</MenubarContent>
    </MenubarMenu>
  );
}

// =============================================================================
// Exports
// =============================================================================

export {
  Menubar,
  MenubarMenu,
  MenubarPortal,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
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
  MenubarWithContent,
};

// =============================================================================
// Type Exports
// =============================================================================

export type {
  MenubarProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarTriggerProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarLabelProps,
  MenubarItemProps,
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
  MenubarWithContentProps,
};
