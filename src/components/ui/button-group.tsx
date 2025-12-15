import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonGroupVariants = cva(
  "inline-flex items-center rounded-lg border border-border",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

function ButtonGroup({
  className,
  orientation = "horizontal",
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        return React.cloneElement(child as React.ReactElement<any>, {
          className: cn(
            (child as React.ReactElement<any>).props.className,
            // Remove border radius based on position
            orientation === "horizontal"
              ? {
                  "rounded-r-none border-r-0": !isLast,
                  "rounded-l-none": !isFirst,
                }
              : {
                  "rounded-b-none border-b-0": !isLast,
                  "rounded-t-none": !isFirst,
                },
            // Remove individual borders since group has border
            "border-0 shadow-none"
          ),
        });
      })}
    </div>
  );
}

export { ButtonGroup, buttonGroupVariants };
