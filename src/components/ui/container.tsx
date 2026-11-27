"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";

const containerVariants = cva("mx-auto min-w-0 w-full wrap-break-word", {
  variants: {
    size: {
      sm: "max-w-(--breakpoint-sm)",
      md: "max-w-(--breakpoint-md)",
      lg: "max-w-(--breakpoint-lg)",
      xl: "max-w-(--breakpoint-xl)",
      "2xl": "max-w-(--breakpoint-2xl)",
      full: "max-w-full",
      prose: "max-w-[65ch]",
    },
    padding: {
      none: "",
      sm: "px-3 sm:px-4",
      default: "px-4 sm:px-6 lg:px-8",
      lg: "px-6 sm:px-8 lg:px-12",
    },
    centered: {
      true: "flex flex-col items-center",
      false: "",
    },
    query: {
      true: "@container",
      false: "",
    },
  },
  defaultVariants: {
    size: "xl",
    padding: "default",
    centered: false,
    query: false,
  },
});

type ContainerElement =
  "div" | "section" | "main" | "article" | "aside" | "header" | "footer";

type ContainerProps<T extends ContainerElement = "div"> = VariantProps<
  typeof containerVariants
> & {
  as?: T;
  render?: useRender.RenderProp;
  /** Optional CSS container name, used when query is enabled. */
  queryName?: string;
} & Omit<React.ComponentPropsWithRef<T>, "as" | "render">;

function Container<T extends ContainerElement = "div">({
  as,
  render,
  ref,
  className,
  size,
  padding,
  centered,
  query,
  queryName,
  style,
  ...props
}: ContainerProps<T>) {
  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: the ref's element type follows the selected native tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a native data attribute absent from HTMLAttributes.
      {
        "data-slot": "container",
        className: cn(
          containerVariants({ size, padding, centered, query }),
          className,
        ),
        style: { containerName: queryName, ...style },
      } as React.HTMLAttributes<HTMLElement>,
      props,
    ),
  });
}

type KiraContainerProps<T extends ContainerElement = "div"> = Omit<
  ContainerProps<T>,
  "children"
> & {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

function KiraContainer<T extends ContainerElement = "div">({
  children,
  header,
  footer,
  ...props
}: KiraContainerProps<T>) {
  // SAFETY: composition props were removed; the remainder belongs to Container.
  const containerProps = props as ContainerProps<T>;

  return (
    <Container<T> {...containerProps} data-slot="kira-container">
      {header != null && (
        <div data-slot="kira-container-header" className="mb-6 w-full min-w-0">
          {header}
        </div>
      )}
      <div data-slot="kira-container-body" className="w-full min-w-0">
        {children}
      </div>
      {footer != null && (
        <div data-slot="kira-container-footer" className="mt-6 w-full min-w-0">
          {footer}
        </div>
      )}
    </Container>
  );
}

export { Container, KiraContainer, containerVariants };

export type { ContainerProps, ContainerElement, KiraContainerProps };
