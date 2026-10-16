import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { resolveResponsive, type ResponsiveValue } from "@/components/ui/flex";

const gapMap: Record<string, string> = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
  "16": "gap-16",
  "20": "gap-20",
  "24": "gap-24",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

const justifyMap: Record<string, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    inline: {
      true: "inline-flex",
      false: "flex",
    },
  },
  defaultVariants: {
    direction: "vertical",
    inline: false,
  },
});

type StackDirection = "vertical" | "horizontal";

type StackAlign = "start" | "end" | "center" | "baseline" | "stretch";

type StackJustify =
  | "start"
  | "end"
  | "center"
  | "between"
  | "around"
  | "evenly";

type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

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

interface StackProps
  extends
    React.HTMLAttributes<HTMLElement>,
    Omit<VariantProps<typeof stackVariants>, "direction"> {
  as?: StackElement;
  direction?: StackDirection;
  gap?: ResponsiveValue<StackGap>;
  align?: ResponsiveValue<StackAlign>;
  justify?: ResponsiveValue<StackJustify>;
  dividers?: boolean;
  dividerElement?: React.ReactNode;
}

function Stack({
  as: Component = "div",
  className,
  direction = "vertical",
  inline,
  gap = 4,
  align,
  justify,
  dividers = false,
  dividerElement,
  children,
  ...props
}: StackProps) {
  const responsiveClasses = cn(
    resolveResponsive(gap, gapMap),
    resolveResponsive(align, alignMap),
    resolveResponsive(justify, justifyMap)
  );

  const renderChildren = () => {
    if (!dividers) return children;

    const childArray = React.Children.toArray(children).filter(Boolean);

    const divider = dividerElement ?? (
      <Separator
        orientation={direction === "vertical" ? "horizontal" : "vertical"}
        decorative
      />
    );

    return childArray.map((child, index) => (
      <React.Fragment key={index}>
        {child}
        {index < childArray.length - 1 && divider}
      </React.Fragment>
    ));
  };

  return (
    <Component
      data-slot="stack"
      className={cn(
        stackVariants({ direction, inline }),
        responsiveClasses,
        className
      )}
      {...props}
    >
      {renderChildren()}
    </Component>
  );
}

function HStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="horizontal" {...props} />;
}

function VStack(props: Omit<StackProps, "direction">) {
  return <Stack direction="vertical" {...props} />;
}

export { Stack, HStack, VStack, stackVariants };

export type { StackProps, StackDirection, StackAlign, StackJustify, StackGap };
