"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "cn";
import {
  layoutGapClasses,
  resolveLayoutResponsive,
  type LayoutResponsiveValue,
  type LayoutSpacing,
} from "@/lib/layout-responsive";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { isObjectProp, isStringProp } from "@/components/ui/prop-guards";

const alignClasses = {
  start: [
    "items-start",
    "sm:items-start",
    "md:items-start",
    "lg:items-start",
    "xl:items-start",
    "2xl:items-start",
  ],
  end: [
    "items-end",
    "sm:items-end",
    "md:items-end",
    "lg:items-end",
    "xl:items-end",
    "2xl:items-end",
  ],
  center: [
    "items-center",
    "sm:items-center",
    "md:items-center",
    "lg:items-center",
    "xl:items-center",
    "2xl:items-center",
  ],
  baseline: [
    "items-baseline",
    "sm:items-baseline",
    "md:items-baseline",
    "lg:items-baseline",
    "xl:items-baseline",
    "2xl:items-baseline",
  ],
  stretch: [
    "items-stretch",
    "sm:items-stretch",
    "md:items-stretch",
    "lg:items-stretch",
    "xl:items-stretch",
    "2xl:items-stretch",
  ],
} as const;

const justifyClasses = {
  start: [
    "justify-start",
    "sm:justify-start",
    "md:justify-start",
    "lg:justify-start",
    "xl:justify-start",
    "2xl:justify-start",
  ],
  end: [
    "justify-end",
    "sm:justify-end",
    "md:justify-end",
    "lg:justify-end",
    "xl:justify-end",
    "2xl:justify-end",
  ],
  center: [
    "justify-center",
    "sm:justify-center",
    "md:justify-center",
    "lg:justify-center",
    "xl:justify-center",
    "2xl:justify-center",
  ],
  between: [
    "justify-between",
    "sm:justify-between",
    "md:justify-between",
    "lg:justify-between",
    "xl:justify-between",
    "2xl:justify-between",
  ],
  around: [
    "justify-around",
    "sm:justify-around",
    "md:justify-around",
    "lg:justify-around",
    "xl:justify-around",
    "2xl:justify-around",
  ],
  evenly: [
    "justify-evenly",
    "sm:justify-evenly",
    "md:justify-evenly",
    "lg:justify-evenly",
    "xl:justify-evenly",
    "2xl:justify-evenly",
  ],
} as const;

const directionClasses = {
  vertical: [
    "flex-col [--stack-rule-width:100%] [--stack-rule-height:1px]",
    "sm:flex-col sm:[--stack-rule-width:100%] sm:[--stack-rule-height:1px]",
    "md:flex-col md:[--stack-rule-width:100%] md:[--stack-rule-height:1px]",
    "lg:flex-col lg:[--stack-rule-width:100%] lg:[--stack-rule-height:1px]",
    "xl:flex-col xl:[--stack-rule-width:100%] xl:[--stack-rule-height:1px]",
    "2xl:flex-col 2xl:[--stack-rule-width:100%] 2xl:[--stack-rule-height:1px]",
  ],
  horizontal: [
    "flex-row [--stack-rule-width:1px] [--stack-rule-height:auto]",
    "sm:flex-row sm:[--stack-rule-width:1px] sm:[--stack-rule-height:auto]",
    "md:flex-row md:[--stack-rule-width:1px] md:[--stack-rule-height:auto]",
    "lg:flex-row lg:[--stack-rule-width:1px] lg:[--stack-rule-height:auto]",
    "xl:flex-row xl:[--stack-rule-width:1px] xl:[--stack-rule-height:auto]",
    "2xl:flex-row 2xl:[--stack-rule-width:1px] 2xl:[--stack-rule-height:auto]",
  ],
} as const;

const wrapClasses = {
  true: [
    "flex-wrap",
    "sm:flex-wrap",
    "md:flex-wrap",
    "lg:flex-wrap",
    "xl:flex-wrap",
    "2xl:flex-wrap",
  ],
  false: [
    "flex-nowrap",
    "sm:flex-nowrap",
    "md:flex-nowrap",
    "lg:flex-nowrap",
    "xl:flex-nowrap",
    "2xl:flex-nowrap",
  ],
} as const;

const rowGapClasses = {
  0: [
    "gap-y-0",
    "sm:gap-y-0",
    "md:gap-y-0",
    "lg:gap-y-0",
    "xl:gap-y-0",
    "2xl:gap-y-0",
  ],
  1: [
    "gap-y-1",
    "sm:gap-y-1",
    "md:gap-y-1",
    "lg:gap-y-1",
    "xl:gap-y-1",
    "2xl:gap-y-1",
  ],
  2: [
    "gap-y-2",
    "sm:gap-y-2",
    "md:gap-y-2",
    "lg:gap-y-2",
    "xl:gap-y-2",
    "2xl:gap-y-2",
  ],
  3: [
    "gap-y-3",
    "sm:gap-y-3",
    "md:gap-y-3",
    "lg:gap-y-3",
    "xl:gap-y-3",
    "2xl:gap-y-3",
  ],
  4: [
    "gap-y-4",
    "sm:gap-y-4",
    "md:gap-y-4",
    "lg:gap-y-4",
    "xl:gap-y-4",
    "2xl:gap-y-4",
  ],
  5: [
    "gap-y-5",
    "sm:gap-y-5",
    "md:gap-y-5",
    "lg:gap-y-5",
    "xl:gap-y-5",
    "2xl:gap-y-5",
  ],
  6: [
    "gap-y-6",
    "sm:gap-y-6",
    "md:gap-y-6",
    "lg:gap-y-6",
    "xl:gap-y-6",
    "2xl:gap-y-6",
  ],
  8: [
    "gap-y-8",
    "sm:gap-y-8",
    "md:gap-y-8",
    "lg:gap-y-8",
    "xl:gap-y-8",
    "2xl:gap-y-8",
  ],
  10: [
    "gap-y-10",
    "sm:gap-y-10",
    "md:gap-y-10",
    "lg:gap-y-10",
    "xl:gap-y-10",
    "2xl:gap-y-10",
  ],
  12: [
    "gap-y-12",
    "sm:gap-y-12",
    "md:gap-y-12",
    "lg:gap-y-12",
    "xl:gap-y-12",
    "2xl:gap-y-12",
  ],
  16: [
    "gap-y-16",
    "sm:gap-y-16",
    "md:gap-y-16",
    "lg:gap-y-16",
    "xl:gap-y-16",
    "2xl:gap-y-16",
  ],
  20: [
    "gap-y-20",
    "sm:gap-y-20",
    "md:gap-y-20",
    "lg:gap-y-20",
    "xl:gap-y-20",
    "2xl:gap-y-20",
  ],
  24: [
    "gap-y-24",
    "sm:gap-y-24",
    "md:gap-y-24",
    "lg:gap-y-24",
    "xl:gap-y-24",
    "2xl:gap-y-24",
  ],
} as const;

const columnGapClasses = {
  0: [
    "gap-x-0",
    "sm:gap-x-0",
    "md:gap-x-0",
    "lg:gap-x-0",
    "xl:gap-x-0",
    "2xl:gap-x-0",
  ],
  1: [
    "gap-x-1",
    "sm:gap-x-1",
    "md:gap-x-1",
    "lg:gap-x-1",
    "xl:gap-x-1",
    "2xl:gap-x-1",
  ],
  2: [
    "gap-x-2",
    "sm:gap-x-2",
    "md:gap-x-2",
    "lg:gap-x-2",
    "xl:gap-x-2",
    "2xl:gap-x-2",
  ],
  3: [
    "gap-x-3",
    "sm:gap-x-3",
    "md:gap-x-3",
    "lg:gap-x-3",
    "xl:gap-x-3",
    "2xl:gap-x-3",
  ],
  4: [
    "gap-x-4",
    "sm:gap-x-4",
    "md:gap-x-4",
    "lg:gap-x-4",
    "xl:gap-x-4",
    "2xl:gap-x-4",
  ],
  5: [
    "gap-x-5",
    "sm:gap-x-5",
    "md:gap-x-5",
    "lg:gap-x-5",
    "xl:gap-x-5",
    "2xl:gap-x-5",
  ],
  6: [
    "gap-x-6",
    "sm:gap-x-6",
    "md:gap-x-6",
    "lg:gap-x-6",
    "xl:gap-x-6",
    "2xl:gap-x-6",
  ],
  8: [
    "gap-x-8",
    "sm:gap-x-8",
    "md:gap-x-8",
    "lg:gap-x-8",
    "xl:gap-x-8",
    "2xl:gap-x-8",
  ],
  10: [
    "gap-x-10",
    "sm:gap-x-10",
    "md:gap-x-10",
    "lg:gap-x-10",
    "xl:gap-x-10",
    "2xl:gap-x-10",
  ],
  12: [
    "gap-x-12",
    "sm:gap-x-12",
    "md:gap-x-12",
    "lg:gap-x-12",
    "xl:gap-x-12",
    "2xl:gap-x-12",
  ],
  16: [
    "gap-x-16",
    "sm:gap-x-16",
    "md:gap-x-16",
    "lg:gap-x-16",
    "xl:gap-x-16",
    "2xl:gap-x-16",
  ],
  20: [
    "gap-x-20",
    "sm:gap-x-20",
    "md:gap-x-20",
    "lg:gap-x-20",
    "xl:gap-x-20",
    "2xl:gap-x-20",
  ],
  24: [
    "gap-x-24",
    "sm:gap-x-24",
    "md:gap-x-24",
    "lg:gap-x-24",
    "xl:gap-x-24",
    "2xl:gap-x-24",
  ],
} as const;

const stackVariants = cva("min-w-0 wrap-break-word", {
  variants: {
    direction: {
      vertical: "flex-col [--stack-rule-width:100%] [--stack-rule-height:1px]",
      horizontal:
        "flex-row [--stack-rule-width:1px] [--stack-rule-height:auto]",
    },
    inline: { true: "inline-flex", false: "flex" },
  },
  defaultVariants: { direction: "vertical", inline: false },
});

type StackDirection = "vertical" | "horizontal";

type StackAlign = keyof typeof alignClasses;

type StackJustify = keyof typeof justifyClasses;

type StackGap = LayoutSpacing;

type StackElement =
  | "div"
  | "section"
  | "nav"
  | "main"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "form"
  | "fieldset"
  | "span";

interface StackOwnProps extends Omit<
  VariantProps<typeof stackVariants>,
  "direction"
> {
  direction?: LayoutResponsiveValue<StackDirection>;
  wrap?: LayoutResponsiveValue<boolean>;
  rowGap?: LayoutResponsiveValue<StackGap>;
  columnGap?: LayoutResponsiveValue<StackGap>;
  gap?: LayoutResponsiveValue<StackGap>;
  align?: LayoutResponsiveValue<StackAlign>;
  justify?: LayoutResponsiveValue<StackJustify>;
  dividers?: boolean;
  /** Decorative replacement; fragments are treated as one child group. */
  dividerElement?: React.ReactNode;
}

type StackProps<Tag extends StackElement = "div"> = StackOwnProps & {
  as?: Tag;
  render?: useRender.RenderProp;
} & Omit<
    React.ComponentPropsWithRef<Tag>,
    keyof StackOwnProps | "as" | "render"
  >;

function Stack<Tag extends StackElement = "div">({
  as,
  render,
  ref,
  className,
  direction = "vertical",
  inline,
  gap = 4,
  align,
  justify,
  wrap,
  rowGap,
  columnGap,
  dividers = false,
  dividerElement,
  children,
  ...props
}: StackProps<Tag>) {
  const list = isStackList(as, render);
  const childArray = React.Children.toArray(children);

  return useRender({
    defaultTagName: as ?? "div",
    render,
    // SAFETY: native props and ref follow the selected tag.
    ref: ref as React.Ref<HTMLElement>,
    props: mergeProps(
      // SAFETY: data-slot is a standard native data attribute.
      {
        "data-slot": "stack",
        className: cn(
          stackVariants({
            direction: isObjectProp(direction)
              ? (direction.base ?? "vertical")
              : direction,
            inline,
          }),
          resolveLayoutResponsive(direction, directionClasses),
          resolveLayoutResponsive(wrap, wrapClasses),
          resolveLayoutResponsive(gap, layoutGapClasses),
          resolveLayoutResponsive(rowGap, rowGapClasses),
          resolveLayoutResponsive(columnGap, columnGapClasses),
          resolveLayoutResponsive(align, alignClasses),
          resolveLayoutResponsive(justify, justifyClasses),
          className,
        ),
      } as React.HTMLAttributes<HTMLElement>,
      props,
      {
        children: dividers
          ? withStackDividers(childArray, dividerElement, list)
          : childArray,
      },
    ),
  });
}

function isStackList(
  as: StackElement | undefined,
  render: useRender.RenderProp | undefined,
) {
  const tag =
    React.isValidElement(render) && isStringProp(render.type)
      ? render.type
      : as;

  return tag === "ul" || tag === "ol";
}

function withStackDividers(
  children: React.ReactNode[],
  dividerElement: React.ReactNode,
  list: boolean,
) {
  return children.flatMap((child, index) => {
    if (index === children.length - 1) return [child];

    const key =
      "stack-divider-" + (React.isValidElement(child) ? child.key : index);

    const divider =
      dividerElement === undefined ? (
        <Separator
          key={key}
          render={<span />}
          data-slot="stack-divider"
          decorative
          style={{
            width: "var(--stack-rule-width)",
            height: "var(--stack-rule-height)",
            alignSelf: "stretch",
          }}
        />
      ) : (
        <span
          key={key}
          data-slot="stack-divider"
          aria-hidden="true"
          inert
          className="contents"
        >
          {dividerElement}
        </span>
      );

    return [
      child,
      list ? (
        <li
          key={key}
          data-slot="stack-divider-item"
          role="presentation"
          aria-hidden="true"
          className="contents"
        >
          {divider}
        </li>
      ) : (
        divider
      ),
    ];
  });
}

function HStack<Tag extends StackElement = "div">(
  props: Omit<StackProps<Tag>, "direction">,
) {
  // SAFETY: only the optional direction prop is omitted; this wrapper supplies it.
  const stackProps = props as StackProps<Tag>;

  return <Stack<Tag> {...stackProps} direction="horizontal" />;
}

function VStack<Tag extends StackElement = "div">(
  props: Omit<StackProps<Tag>, "direction">,
) {
  // SAFETY: only the optional direction prop is omitted; this wrapper supplies it.
  const stackProps = props as StackProps<Tag>;

  return <Stack<Tag> {...stackProps} direction="vertical" />;
}

type KiraStackProps<Tag extends StackElement = "div"> = Omit<
  StackProps<Tag>,
  "direction" | "wrap" | "dividers" | "dividerElement"
> & {
  layout?: "switcher" | "vertical";
  /** CSS length at which the local width switches to one column. */
  threshold?: string;
  /** More children than this limit always use one column. */
  limit?: number;
  loading?: boolean;
  loadingLabel?: string;
  loadingContent?: React.ReactNode;
};

function KiraStack<Tag extends StackElement = "div">({
  layout: layoutInput,
  threshold: thresholdInput,
  limit: limitInput,
  loading: loadingInput,
  loadingLabel: loadingLabelInput,
  loadingContent,
  children,
  className,
  style,
  ...props
}: KiraStackProps<Tag>) {
  const { layout, threshold, limit, loading, loadingLabel } =
    useKiraStackOptions({
      layout: layoutInput,
      threshold: thresholdInput,
      limit: limitInput,
      loading: loadingInput,
      loadingLabel: loadingLabelInput,
    });

  // SAFETY: composition-only props were removed; native props retain the same Tag.
  const stackProps = props as StackProps<Tag>;
  const items = React.Children.toArray(children);

  const horizontalLimit = Number.isFinite(limit)
    ? Math.max(1, Math.trunc(limit))
    : 4;

  const switcher = layout === "switcher" && items.length <= horizontalLimit;

  const list = isStackList(props.as, props.render);

  return (
    <Stack<Tag>
      {...stackProps}
      data-slot="kira-stack"
      aria-busy={loading}
      direction="vertical"
      wrap={switcher}
      className={cn(
        "relative",
        {
          "flex-row [&>:not([data-slot=stack-status])]:grow [&>:not([data-slot=stack-status])]:shrink [&>:not([data-slot=stack-status])]:min-w-0 [&>:not([data-slot=stack-status])]:basis-[calc((var(--stack-threshold)-100%)*999)]":
            switcher,
        },
        className,
      )}
      // SAFETY: the variable is a CSS length, resolved by flex-basis in the local container.
      style={
        { "--stack-threshold": threshold, ...style } as React.CSSProperties
      }
    >
      {loading && items.length === 0 ? (
        <StackLoadingPlaceholder list={list} content={loadingContent} />
      ) : (
        items
      )}
      <StackLoadingStatus list={list} message={loading ? loadingLabel : ""} />
    </Stack>
  );
}

function StackLoadingPlaceholder({
  list,
  content,
}: {
  list: boolean;
  content: React.ReactNode;
}) {
  const Element = list ? "li" : "div";

  return (
    <Element
      data-slot="stack-placeholder"
      aria-hidden="true"
      inert
      className={list ? undefined : "w-full"}
    >
      {content ?? <Skeleton className="h-24 w-full" />}
    </Element>
  );
}

function StackLoadingStatus({
  list,
  message,
}: {
  list: boolean;
  message: string;
}) {
  const Element = list ? "li" : "span";

  return (
    <Element
      data-slot="stack-status"
      role={list ? "presentation" : undefined}
      className="sr-only absolute"
    >
      <output data-slot="stack-status-message" aria-live="polite">
        {message}
      </output>
    </Element>
  );
}

export { Stack, HStack, VStack, KiraStack, stackVariants };

export type {
  KiraStackProps,
  StackProps,
  StackElement,
  StackDirection,
  StackAlign,
  StackJustify,
  StackGap,
};

function resolveKiraStackOptions({
  layout = "switcher",
  threshold = "32rem",
  limit = 4,
  loading = false,
  loadingLabel = "Refreshing content…",
}: {
  layout?: KiraStackProps["layout"];
  threshold?: KiraStackProps["threshold"];
  limit?: KiraStackProps["limit"];
  loading?: KiraStackProps["loading"];
  loadingLabel?: KiraStackProps["loadingLabel"];
}) {
  return { layout, threshold, limit, loading, loadingLabel };
}

function useKiraStackOptions({
  layout: layoutInput,
  threshold: thresholdInput,
  limit: limitInput,
  loading: loadingInput,
  loadingLabel: loadingLabelInput,
}: Parameters<typeof resolveKiraStackOptions>[0]) {
  return React.useMemo(
    () =>
      resolveKiraStackOptions({
        layout: layoutInput,
        threshold: thresholdInput,
        limit: limitInput,
        loading: loadingInput,
        loadingLabel: loadingLabelInput,
      }),
    [layoutInput, thresholdInput, limitInput, loadingInput, loadingLabelInput],
  );
}
