"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
  loading?: boolean;
  loadingLabel?: string;
  loadingContent?: React.ReactNode;
  error?: React.ReactNode;
  onRetry?: () => void;
};

function KiraContainer<T extends ContainerElement = "div">({
  children,
  header,
  footer,
  loading = false,
  loadingLabel = "Loading content…",
  loadingContent,
  error,
  onRetry,
  ...props
}: KiraContainerProps<T>) {
  // SAFETY: composition props were removed; the remainder belongs to Container.
  const containerProps = props as ContainerProps<T>;

  const buildHeader = () =>
    header != null && (
      <div data-slot="kira-container-header" className="mb-6 w-full min-w-0">
        {header}
      </div>
    );

  const buildBody = () =>
    renderKiraContainerBodyPart1({
      loading,
      loadingLabel,
      error,
      onRetry,
      children,
      loadingContent,
    });

  const buildFooter = () =>
    footer != null && (
      <div data-slot="kira-container-footer" className="mt-6 w-full min-w-0">
        {footer}
      </div>
    );

  const wrapContainer = () => (
    <Container<T>
      {...containerProps}
      data-slot="kira-container"
      data-loading={loading || undefined}
    >
      {buildHeader()}
      {buildBody()}
      {buildFooter()}
    </Container>
  );

  return wrapContainer();
}

export { Container, KiraContainer, containerVariants };

export type { ContainerProps, ContainerElement, KiraContainerProps };

type renderKiraContainerBodyPart1Args<T extends ContainerElement = "div"> = {
  loading: Exclude<KiraContainerProps<T>["loading"], undefined>;
  loadingLabel: Exclude<KiraContainerProps<T>["loadingLabel"], undefined>;
  error: KiraContainerProps<T>["error"];
  onRetry: KiraContainerProps<T>["onRetry"];
  children: KiraContainerProps<T>["children"];
  loadingContent: KiraContainerProps<T>["loadingContent"];
};

function renderKiraContainerBodyPart1<T extends ContainerElement = "div">({
  loading,
  loadingLabel,
  error,
  onRetry,
  children,
  loadingContent,
}: renderKiraContainerBodyPart1Args<T>) {
  return (
    <div data-slot="kira-container-body" className="w-full min-w-0">
      <output data-slot="container-status" className="sr-only">
        {loading ? loadingLabel : ""}
      </output>
      {!loading && error != null && (
        <div
          data-slot="container-error"
          className="mb-4 space-y-3 rounded-lg border border-destructive/30 p-4"
        >
          <div role="alert" className="text-sm text-destructive">
            {error}
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      )}
      <div
        data-slot="container-loading-region"
        aria-busy={loading}
        className="relative min-h-48"
      >
        <div
          data-slot="container-body-content"
          className={loading ? "opacity-0" : undefined}
          aria-hidden={loading || undefined}
          inert={loading}
        >
          {children}
        </div>
        {loading && (
          <div
            data-slot="container-skeleton"
            aria-hidden="true"
            className="absolute inset-0"
          >
            {loadingContent ?? <Skeleton className="h-full w-full" />}
            <p className="absolute inset-x-4 top-4 text-sm text-muted-foreground">
              {loadingLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
