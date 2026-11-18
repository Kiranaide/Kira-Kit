"use client";

import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { cn } from "cn";
import { useMenuAction, type MenuActionItem } from "@/hooks/use-menu-action";
import {
  DropdownMenuArrow,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  dropdownMenuContentVariants as contextMenuContentVariants,
  dropdownMenuItemVariants as contextMenuItemVariants,
} from "@/components/ui/dropdown-menu";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isCallbackProp } from "@/lib/component-prop-guards";

function mergeClassName<S>(
  base: string,
  className: string | ((state: S) => string | undefined) | undefined,
) {
  return isCallbackProp(className)
    ? (state: S) => cn(base, className(state))
    : cn(base, className);
}

export type ContextMenuProps = ContextMenuPrimitive.Root.Props;

function ContextMenu({ children, ...props }: ContextMenuProps) {
  return (
    <ContextMenuPrimitive.Root {...props}>{children}</ContextMenuPrimitive.Root>
  );
}

export type ContextMenuTriggerProps = ContextMenuPrimitive.Trigger.Props;

const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuTriggerProps
>(function ContextMenuTrigger(
  { className, children, tabIndex = 0, onKeyDown, ...props },
  ref,
) {
  return (
    <ContextMenuPrimitive.Trigger
      ref={ref}
      data-slot="context-menu-trigger"
      tabIndex={tabIndex}
      className={mergeClassName<ContextMenuPrimitive.Trigger.State>(
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || event.target !== event.currentTarget)
          return;

        if (
          event.key === "ContextMenu" ||
          (event.shiftKey && event.key === "F10")
        ) {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          // Reuse the primitive's contextmenu path, including its disabled guard.
          event.currentTarget.dispatchEvent(
            new MouseEvent("contextmenu", {
              bubbles: true,
              cancelable: true,
              clientX: rect.left + rect.width / 2,
              clientY: rect.top + rect.height / 2,
              button: 2,
            }),
          );
        }
      }}
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
      className={mergeClassName<ContextMenuPrimitive.Backdrop.State>(
        "fixed inset-0 z-50 bg-foreground/50",
        className,
      )}
      {...props}
    />
  );
});

export interface ContextMenuContentProps
  extends ContextMenuPrimitive.Popup.Props {
  sideOffset?: number;
  alignOffset?: number;
  align?: "start" | "center" | "end";
  side?: ContextMenuPrimitive.Positioner.Props["side"];
  keepMounted?: boolean;
  showBackdrop?: boolean;
  portalProps?: Omit<
    ContextMenuPrimitive.Portal.Props,
    "children" | "keepMounted"
  >;
  positionerProps?: Omit<
    ContextMenuPrimitive.Positioner.Props,
    "children" | "side" | "align" | "sideOffset" | "alignOffset"
  >;
}

const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(function ContextMenuContent(input, ref) {
  const {
    className,
    sideOffset,
    alignOffset,
    align,
    side,
    keepMounted,
    showBackdrop,
    portalProps,
    positionerProps,
    ...props
  } = resolveComponentDefaults(input, CONTEXT_MENU_TSX_DEFAULTS_1);

  return (
    <ContextMenuPrimitive.Portal keepMounted={keepMounted} {...portalProps}>
      {showBackdrop && <ContextMenuBackdrop />}
      <ContextMenuPrimitive.Positioner
        {...positionerProps}
        data-slot="context-menu-positioner"
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side={side}
        collisionPadding={positionerProps?.collisionPadding ?? 8}
        className={mergeClassName<ContextMenuPrimitive.Positioner.State>(
          "z-50 isolate",
          positionerProps?.className,
        )}
      >
        <ContextMenuPrimitive.Popup
          ref={ref}
          data-slot="context-menu-content"
          className={mergeClassName<ContextMenuPrimitive.Popup.State>(
            contextMenuContentVariants(),
            className,
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
});

export type ContextMenuArrowProps = React.ComponentProps<
  typeof DropdownMenuArrow
>;

function ContextMenuArrow(props: ContextMenuArrowProps) {
  return <DropdownMenuArrow data-slot="context-menu-arrow" {...props} />;
}

export type ContextMenuItemProps = React.ComponentProps<
  typeof DropdownMenuItem
>;

function ContextMenuItem(props: ContextMenuItemProps) {
  return <DropdownMenuItem data-slot="context-menu-item" {...props} />;
}

export type ContextMenuLinkItemProps = React.ComponentProps<
  typeof DropdownMenuLinkItem
>;

function ContextMenuLinkItem(props: ContextMenuLinkItemProps) {
  return <DropdownMenuLinkItem data-slot="context-menu-link-item" {...props} />;
}

export type ContextMenuCheckboxItemProps = React.ComponentProps<
  typeof DropdownMenuCheckboxItem
>;

function ContextMenuCheckboxItem(props: ContextMenuCheckboxItemProps) {
  return (
    <DropdownMenuCheckboxItem
      data-slot="context-menu-checkbox-item"
      {...props}
    />
  );
}

export type ContextMenuRadioGroupProps = React.ComponentProps<
  typeof DropdownMenuRadioGroup
>;

function ContextMenuRadioGroup(props: ContextMenuRadioGroupProps) {
  return (
    <DropdownMenuRadioGroup data-slot="context-menu-radio-group" {...props} />
  );
}

export type ContextMenuRadioItemProps = React.ComponentProps<
  typeof DropdownMenuRadioItem
>;

function ContextMenuRadioItem(props: ContextMenuRadioItemProps) {
  return (
    <DropdownMenuRadioItem data-slot="context-menu-radio-item" {...props} />
  );
}

export type ContextMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuSeparator
>;

function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
  return (
    <DropdownMenuSeparator data-slot="context-menu-separator" {...props} />
  );
}

export type ContextMenuGroupProps = React.ComponentProps<
  typeof DropdownMenuGroup
>;

function ContextMenuGroup(props: ContextMenuGroupProps) {
  return <DropdownMenuGroup data-slot="context-menu-group" {...props} />;
}

export type ContextMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuLabel
>;

function ContextMenuLabel(props: ContextMenuLabelProps) {
  return <DropdownMenuLabel data-slot="context-menu-label" {...props} />;
}

export type ContextMenuShortcutProps = React.ComponentProps<
  typeof DropdownMenuShortcut
>;

function ContextMenuShortcut(props: ContextMenuShortcutProps) {
  return <DropdownMenuShortcut data-slot="context-menu-shortcut" {...props} />;
}

export type ContextMenuSubProps = ContextMenuPrimitive.SubmenuRoot.Props;

function ContextMenuSub({ ...props }: ContextMenuSubProps) {
  return <ContextMenuPrimitive.SubmenuRoot {...props} />;
}

export type ContextMenuSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuSubTrigger
>;

function ContextMenuSubTrigger(props: ContextMenuSubTriggerProps) {
  return (
    <DropdownMenuSubTrigger data-slot="context-menu-sub-trigger" {...props} />
  );
}

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
>(function ContextMenuSubContent(input, ref) {
  const { className, sideOffset, alignOffset, align, keepMounted, ...props } =
    resolveComponentDefaults(input, CONTEXT_MENU_TSX_DEFAULTS_2);

  return (
    <ContextMenuPrimitive.Portal keepMounted={keepMounted}>
      <ContextMenuPrimitive.Positioner
        data-slot="context-menu-sub-positioner"
        className="z-50 isolate"
        collisionPadding={8}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        align={align}
        side="right"
      >
        <ContextMenuPrimitive.Popup
          ref={ref}
          data-slot="context-menu-sub-content"
          className={mergeClassName<ContextMenuPrimitive.Popup.State>(
            contextMenuContentVariants({ sub: true }),
            className,
          )}
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
});

export interface KiraContextMenuProps {
  trigger: React.ReactNode;
  items?: readonly MenuActionItem[];
  children?: React.ReactNode;
  className?: string;
  contentProps?: Omit<ContextMenuContentProps, "children">;

  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- JavaScript promises and action callbacks may reject with any value; the public error callback intentionally receives that original rejection.
  onActionError?: (error: unknown, item: MenuActionItem) => void;
}

function KiraContextMenu({
  trigger,
  items,
  children,
  className,
  contentProps,
  onActionError,
}: KiraContextMenuProps) {
  const resolveValue1 = () => {
    if (items) {
      if (items.length === 0) {
        return (
          <p
            data-slot="context-menu-empty"
            className="px-2 py-1.5 text-sm text-muted-foreground"
          >
            No actions available.
          </p>
        );
      }

      return items.map((item) => (
        <ContextMenuItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          shortcut={item.shortcut}
          variant={item.variant}
          disabled={item.disabled || action.state === "pending"}
          disabledReason={item.disabledReason}
          loading={action.state === "pending" && action.activeId === item.id}
          closeOnClick={false}
          onClick={() => {
            void action.run(item);
          }}
        >
          {item.label}
        </ContextMenuItem>
      ));
    }

    return children;
  };

  const [open, setOpen] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");

  const action = useMenuAction({
    sessionKey: open,
    onSuccess: (item) => {
      setAnnouncement(item.successMessage ?? `${item.label} completed.`);

      if (item.closeOnSuccess !== false) setOpen(false);
    },
    onError: onActionError,
  });

  return renderKiraContextMenuSectionPart1({
    open,
    setAnnouncement,
    setOpen,
    className,
    trigger,
    contentProps,
    resolveValue1,
    action,
    announcement,
  });
}

/** @deprecated Use KiraContextMenu with composed children or action items. */
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
    <KiraContextMenu
      trigger={trigger}
      className={className}
      contentProps={contentProps}
    >
      {children}
    </KiraContextMenu>
  );
}

export type { MenuActionItem } from "@/hooks/use-menu-action";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuBackdrop,
  ContextMenuContent,
  ContextMenuArrow,
  ContextMenuItem,
  ContextMenuLinkItem,
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
  KiraContextMenu,
  contextMenuContentVariants,
  contextMenuItemVariants,
};

type renderKiraContextMenuSectionPart1Args = {
  open: boolean;
  setAnnouncement: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className: KiraContextMenuProps["className"];
  trigger: KiraContextMenuProps["trigger"];
  contentProps: KiraContextMenuProps["contentProps"];
  resolveValue1: () => React.ReactNode;
  action: ReturnType<typeof useMenuAction>;
  announcement: string;
};

function renderKiraContextMenuSectionPart1({
  open,
  setAnnouncement,
  setOpen,
  className,
  trigger,
  contentProps,
  resolveValue1,
  action,
  announcement,
}: renderKiraContextMenuSectionPart1Args) {
  return (
    <>
      <ContextMenu
        open={open}
        onOpenChange={(next) => {
          if (next) setAnnouncement("");
          setOpen(next);
        }}
      >
        <ContextMenuTrigger className={className}>{trigger}</ContextMenuTrigger>
        <ContextMenuContent {...contentProps}>
          {resolveValue1()}
          {action.state === "error" && (
            <p
              data-slot="context-menu-error"
              className="px-2 py-1.5 text-sm text-destructive wrap-anywhere"
            >
              {action.message}
            </p>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <output
        data-slot="context-menu-status"

        aria-atomic="true"
        className="sr-only"
      >
        {action.message || announcement}
      </output>
    </>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const CONTEXT_MENU_TSX_DEFAULTS_1 = {
  sideOffset: 4,
  alignOffset: 0,
  align: "start",
  keepMounted: false,
  showBackdrop: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const CONTEXT_MENU_TSX_DEFAULTS_2 = {
  sideOffset: 4,
  alignOffset: 0,
  align: "start",
  keepMounted: false,
} as const;
