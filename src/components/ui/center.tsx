"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";

const centerVariants = cva("min-w-0 wrap-break-word", {
  variants: {
    type: {
      flex: "",
      grid: "",
      absolute: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    inline: { true: "", false: "" },
    safe: { true: "", false: "" },
  },
  compoundVariants: [
    { type: "flex", safe: false, className: "items-center justify-center" },
    { type: "grid", safe: false, className: "place-items-center" },
    {
      type: "flex",
      safe: true,
      className: "[align-items:safe_center] [justify-content:safe_center]",
    },
    {
      type: "grid",
      safe: true,
      className: "[align-items:safe_center] [justify-items:safe_center]",
    },
    { type: "flex", inline: true, className: "inline-flex" },
    { type: "flex", inline: false, className: "flex" },
    { type: "grid", inline: true, className: "inline-grid" },
    { type: "grid", inline: false, className: "grid" },
  ],
  defaultVariants: { type: "flex", inline: false, safe: true },
});

type CenterType = "flex" | "grid" | "absolute";

type CenterElement = "div" | "span" | "section" | "main" | "article";

type CenterProps<Tag extends CenterElement = "div"> = VariantProps<
  typeof centerVariants
> & {
  as?: Tag;
  render?: useRender.RenderProp;
} & Omit<React.ComponentPropsWithRef<Tag>, "as" | "render" | "type">;

function Center<Tag extends CenterElement = "div">({
  as,
  render,
  ref,
  className,
  type = "flex",
  inline = false,
  safe = true,
  ...props
}: CenterProps<Tag>) {
  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: native props and ref follow the selected tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a standard native data attribute.
      {
        "data-slot": "center",
        className: cn(centerVariants({ type, inline, safe }), className),
      } as React.HTMLAttributes<HTMLElement>,
      props,
    ),
  });
}

const centerContentVariants = cva("w-full min-w-0 wrap-break-word", {
  variants: {
    width: {
      sm: "max-w-sm",
      md: "max-w-md",
      prose: "max-w-[65ch]",
      full: "max-w-full",
    },
  },
  defaultVariants: { width: "md" },
});

const kiraCenterVariants = cva("", {
  variants: {
    padding: {
      none: "p-0 [--center-gutter:0px]",
      sm: "p-3 [--center-gutter:calc(var(--spacing,0.25rem)*3)]",
      default: "p-6 [--center-gutter:calc(var(--spacing,0.25rem)*6)]",
      lg: "p-8 [--center-gutter:calc(var(--spacing,0.25rem)*8)]",
    },
    viewport: {
      none: "",
      small: "min-h-[max(0px,calc(100svh-var(--center-offset)))]",
      dynamic: "min-h-[max(0px,calc(100dvh-var(--center-offset)))]",
    },
    safeArea: {
      true: "[padding-top:max(var(--center-gutter),env(safe-area-inset-top,0px))] [padding-right:max(var(--center-gutter),env(safe-area-inset-right,0px))] [padding-bottom:max(var(--center-gutter),env(safe-area-inset-bottom,0px))] [padding-left:max(var(--center-gutter),env(safe-area-inset-left,0px))]",
      false: "",
    },
  },
  defaultVariants: { padding: "default", viewport: "none", safeArea: false },
});

type KiraCenterProps<Tag extends CenterElement = "div"> = Omit<
  CenterProps<Tag>,
  "type" | "inline"
> &
  VariantProps<typeof kiraCenterVariants> &
  VariantProps<typeof centerContentVariants> & {
    /** CSS length of surrounding app chrome, subtracted from viewport height. */
    offset?: string;
    contentClassName?: string;
  };

function KiraCenter<Tag extends CenterElement = "div">({
  children,
  padding,
  viewport,
  safeArea,
  width,
  offset = "0px",
  contentClassName,
  className,
  style,
  ...props
}: KiraCenterProps<Tag>) {
  // SAFETY: composition-only props were removed; native props retain the same Tag.
  const centerProps = props as CenterProps<Tag>;

  const buildContent = () => (
    <div
      data-slot="center-content"
      className={cn(centerContentVariants({ width }), contentClassName)}
    >
      {children}
    </div>
  );

  const wrapCenter = () => (
    <Center<Tag>
      {...centerProps}
      type="grid"
      data-slot="kira-center"
      className={cn(
        kiraCenterVariants({ padding, viewport, safeArea }),
        className,
      )}
      // SAFETY: this component-owned CSS variable accepts the documented CSS length.
      style={{ "--center-offset": offset, ...style } as React.CSSProperties}
    >
      {buildContent()}
    </Center>
  );

  return wrapCenter();
}

export {
  Center,
  KiraCenter,
  centerVariants,
  centerContentVariants,
  kiraCenterVariants,
};

export type { KiraCenterProps, CenterProps, CenterType, CenterElement };
