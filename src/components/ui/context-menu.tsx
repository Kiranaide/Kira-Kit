"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "@/lib/utils";
import {
  IconCheck,
  IconChevronRight,
  IconLoader,
  IconPointFilled,
} from "@tabler/icons-react";

export type ContextMenuProps = ContextMenuPrimitive.Root.Props;

function ContextMenu({ children, ...props }: ContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root data-slot="context-menu" {...props}>
      {children}
    </ContextMenuPrimitive.Root>
  );
}

export type ContextMenuTriggerProps = ContextMenuPrimitive.Trigger.Props;

const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(function ContextMenuTrigger({ className, children, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Trigger
      ref={ref}
      data-slot="context-menu-trigger"
      className={cn("focus:outline-none", className)}
      {...props}
    >
      {children}
    </ContextMenuPrimitive.Trigger>
  );
});

export type ContextMenuBackdropProps = ContextMenuPrimitive.Backdrop.Props;

const ContextMenuBackdrop = React.forwardRef<
  HTMLDivElement,
  ContextMenuBackdropProps
>(function ContextMenuBackdrop({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Backdrop
      ref={ref}
      data-slot="context-menu-backdrop"
      className={cn("fixed inset-0 z-50 bg-black/50", className)}
      {...props}
    />
  );
});

export interface ContextMenuContentProps
  extends ContextMenuPrimitive.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  keepMounted?: boolean;
  showBackdrop?: boolean;
}

const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(function ContextMenuContent(
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
    <ContextMenuPrimitive.Portal keepMounted={keepMounted}>
      {showBackdrop && <ContextMenuBackdrop />}
      <ContextMenuPrimitive.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side={side}
      >
        <ContextMenuPrimitive.Popup
          ref={ref}
          data-slot="context-menu-content"
          className={cn(
            "z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
});

export type ContextMenuArrowProps = ContextMenuPrimitive.Arrow.Props;

const ContextMenuArrow = React.forwardRef<
  HTMLDivElement,
  ContextMenuArrowProps
>(function ContextMenuArrow({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Arrow
      ref={ref}
      data-slot="context-menu-arrow"
      className={cn(
        "z-50 h-2 w-4",
        "[&>polygon]:fill-popover [&>polygon]:stroke-border",
        className
      )}
      {...props}
    />
  );
});

export interface ContextMenuItemProps extends ContextMenuPrimitive.Item.Props {
  inset?: boolean;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  shortcut?: string;
  loading?: boolean;
  closeOnClick?: boolean;
}

const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  function ContextMenuItem(
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
      <ContextMenuPrimitive.Item
        ref={ref}
        data-slot="context-menu-item"
        data-inset={inset}
        data-variant={variant}
        data-loading={loading}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
          "data-highlighted:relative data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm",
          "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
          "data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          variant === "destructive" &&
            "data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 data-[variant=destructive]:data-highlighted:text-destructive",
          inset && "pl-8",
          className
        )}
        disabled={disabled || loading}
        closeOnClick={closeOnClick}
        {...props}
      >
        {loading ? (
          <IconLoader
            className="h-4 w-4 animate-spin"
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
          <ContextMenuShortcut aria-hidden="true">
            {shortcut}
          </ContextMenuShortcut>
        )}
      </ContextMenuPrimitive.Item>
    );
  }
);

export interface ContextMenuCheckboxItemProps
  extends ContextMenuPrimitive.CheckboxItem.Props {
  icon?: React.ReactNode;
  iconChecked?: React.ReactNode;
  inset?: boolean;
  closeOnClick?: boolean;
}

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(function ContextMenuCheckboxItem(
  { className, children, icon, iconChecked, inset, closeOnClick, ...props },
  ref
) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      data-slot="context-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      closeOnClick={closeOnClick}
      {...props}
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center"
        aria-hidden="true"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          {iconChecked || <IconCheck className="h-4 w-4" />}
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
});

export type ContextMenuRadioGroupProps = ContextMenuPrimitive.RadioGroup.Props;

const ContextMenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  ContextMenuRadioGroupProps
>(function ContextMenuRadioGroup({ ...props }, ref) {
  return (
    <ContextMenuPrimitive.RadioGroup
      ref={ref}
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
});

export interface ContextMenuRadioItemProps
  extends ContextMenuPrimitive.RadioItem.Props {
  inset?: boolean;
  icon?: React.ReactNode;
  closeOnClick?: boolean;
}

const ContextMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuRadioItemProps
>(function ContextMenuRadioItem(
  { className, children, inset, icon, closeOnClick, ...props },
  ref
) {
  return (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      data-slot="context-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      closeOnClick={closeOnClick}
      {...props}
    >
      <span
        className="absolute left-2 flex h-4 w-4 items-center justify-center"
        aria-hidden="true"
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <IconPointFilled className="h-3 w-3 fill-current" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {icon && (
        <span className="h-4 w-4 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
});

export type ContextMenuSeparatorProps = ContextMenuPrimitive.Separator.Props;

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  ContextMenuSeparatorProps
>(function ContextMenuSeparator({ className, ...props }, ref) {
  return (
    <ContextMenuPrimitive.Separator
      ref={ref}
      data-slot="context-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
});

export type ContextMenuGroupProps = ContextMenuPrimitive.Group.Props;

const ContextMenuGroup = React.forwardRef<
  HTMLDivElement,
  ContextMenuGroupProps
>(function ContextMenuGroup({ ...props }, ref) {
  return (
    <ContextMenuPrimitive.Group
      ref={ref}
      data-slot="context-menu-group"
      {...props}
    />
  );
});

export interface ContextMenuLabelProps
  extends ContextMenuPrimitive.GroupLabel.Props {
  inset?: boolean;
}

const ContextMenuLabel = React.forwardRef<
  HTMLDivElement,
  ContextMenuLabelProps
>(function ContextMenuLabel({ className, inset, ...props }, ref) {
  return (
    <ContextMenuPrimitive.GroupLabel
      ref={ref}
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-xs font-semibold text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
});

export type ContextMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  ContextMenuShortcutProps
>(function ContextMenuShortcut({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      data-slot="context-menu-shortcut"
      aria-hidden="true"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});

export type ContextMenuSubProps = ContextMenuPrimitive.SubmenuRoot.Props;

function ContextMenuSub({ ...props }: ContextMenuSubProps) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}

export interface ContextMenuSubTriggerProps
  extends ContextMenuPrimitive.SubmenuTrigger.Props {
  inset?: boolean;
  icon?: React.ReactNode;
}

const ContextMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubTriggerProps
>(function ContextMenuSubTrigger(
  { className, inset, icon, children, ...props },
  ref
) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      ref={ref}
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2",
        "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
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
        className="ml-auto h-4 w-4 shrink-0 transition-transform data-popup-open:translate-x-0.5"
        aria-hidden="true"
      />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
});

export interface ContextMenuSubContentProps
  extends ContextMenuPrimitive.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  keepMounted?: boolean;
}

const ContextMenuSubContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubContentProps
>(function ContextMenuSubContent(
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
    <ContextMenuPrimitive.Portal keepMounted={keepMounted}>
      <ContextMenuPrimitive.Positioner
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side="right"
      >
        <ContextMenuPrimitive.Popup
          ref={ref}
          data-slot="context-menu-sub-content"
          className={cn(
            "z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-left-2",
            className
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
});

export interface ContextMenuWithContentProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentProps?: Omit<ContextMenuContentProps, "children">;
}

function ContextMenuWithContent({
  trigger,
  children,
  className,
  contentProps,
}: ContextMenuWithContentProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{trigger}</ContextMenuTrigger>
      <ContextMenuContent {...contentProps}>{children}</ContextMenuContent>
    </ContextMenu>
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuBackdrop,
  ContextMenuContent,
  ContextMenuArrow,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuWithContent,
};
