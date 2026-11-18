"use client";

import * as React from "react";
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      className={cn(
        "border-input dark:bg-input/30 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-disabled:bg-input/50 dark:has-disabled:bg-input/80 h-9 rounded-lg border transition-colors has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot][aria-invalid=true]]:ring-[3px] has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5 in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 group/input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  "text-muted-foreground h-auto gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 flex cursor-text items-center justify-center select-none",
  {
    variants: {
      align: {
        "inline-start":
          "pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem] order-first",
        "inline-end":
          "pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem] order-last",
        "block-start":
          "px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start",
        "block-end":
          "px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Click-to-focus is pointer convenience for the already keyboard-focusable input; the addon may contain independent buttons and must not become a nested button.
    <div
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if (
          !(e.target instanceof Element) ||
          e.target.closest("button, a, input, textarea, select")
        ) {
          return;
        }

        e.currentTarget.parentElement
          ?.querySelector<HTMLElement>("input, textarea")
          ?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "gap-2 text-sm shadow-none flex items-center",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton(
  inputProps: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
    VariantProps<typeof inputGroupButtonVariants> & {
      type?: "button" | "submit" | "reset";
    },
) {
  const { className, type, variant, size, ...props } = resolveComponentDefaults(
    inputProps,
    { type: "button", variant: "ghost", size: "xs" },
  );

  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "text-muted-foreground gap-2 text-sm [&_svg:not([class*='size-'])]:size-4 flex items-center [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "size">) {
  return (
    <InputPrimitive
      data-slot="input-group-control"
      className={cn(
        "placeholder:text-muted-foreground dark:bg-transparent disabled:cursor-not-allowed w-full min-w-0 flex-1 bg-transparent px-3 text-base md:text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent flex-1 resize-none",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
};
