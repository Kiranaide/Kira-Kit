import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";




const toggleGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "gap-1",
      outline: "gap-0 rounded-lg border border-input",
      segment: "gap-0 rounded-lg bg-muted p-1",
      pills: "gap-2",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  compoundVariants: [

    {
      orientation: "vertical",
      variant: "outline",
      className: "rounded-lg",
    },
  ],
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
    size: "default",
  },
});




const toggleGroupItemVariants = cva(
  [

    "inline-flex items-center justify-center gap-2 text-sm font-medium transition-all",

    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",

    "disabled:pointer-events-none disabled:opacity-50",

    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "rounded-md hover:bg-accent hover:text-accent-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        outline: [
          "border-r last:border-r-0 first:rounded-l-lg last:rounded-r-lg",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[pressed]:bg-accent data-[pressed]:text-accent-foreground",
        ],
        segment: [
          "rounded-md",
          "hover:text-foreground",
          "data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-sm",
        ],
        pills: [
          "rounded-full border border-transparent",
          "hover:bg-accent hover:text-accent-foreground",
          "data-[pressed]:border-primary data-[pressed]:bg-primary/10 data-[pressed]:text-primary",
        ],
      },
      size: {
        sm: "h-7 px-2 text-xs [&_svg]:h-3.5 [&_svg]:w-3.5",
        default: "h-9 px-3 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-10 px-4 text-base [&_svg]:h-5 [&_svg]:w-5",
      },
      colorVariant: {
        default: "",
        success:
          "data-[pressed]:bg-success data-[pressed]:text-success-foreground",
        warning:
          "data-[pressed]:bg-warning data-[pressed]:text-warning-foreground",
        destructive:
          "data-[pressed]:bg-destructive data-[pressed]:text-destructive-foreground",
      },
    },
    compoundVariants: [

      {
        variant: "outline",
        className:
          "data-[orientation=vertical]:border-r-0 data-[orientation=vertical]:border-b data-[orientation=vertical]:last:border-b-0 data-[orientation=vertical]:first:rounded-t-lg data-[orientation=vertical]:first:rounded-bl-none data-[orientation=vertical]:last:rounded-b-lg data-[orientation=vertical]:last:rounded-tr-none",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      colorVariant: "default",
    },
  }
);




type ToggleGroupContextValue = {
  variant: VariantProps<typeof toggleGroupVariants>["variant"];
  size: VariantProps<typeof toggleGroupVariants>["size"];
  orientation: VariantProps<typeof toggleGroupVariants>["orientation"];
  disabled?: boolean;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  variant: "default",
  size: "default",
  orientation: "horizontal",
  disabled: false,
});

interface ToggleGroupProps
  extends Omit<ToggleGroupPrimitive.Props, "children" | "orientation">,
    VariantProps<typeof toggleGroupVariants> {




  "aria-label": string;




  multiple?: boolean;




  loopFocus?: boolean;



  children: React.ReactNode;
}

interface ToggleGroupItemProps
  extends Omit<TogglePrimitive.Props, "children">,
    Omit<VariantProps<typeof toggleGroupItemVariants>, "variant"> {



  value: string;



  colorVariant?: VariantProps<typeof toggleGroupItemVariants>["colorVariant"];



  loading?: boolean;



  children?: React.ReactNode;



  "aria-label"?: string;
}




const warnIfMissingAriaLabel = (
  componentName: string,
  props: { "aria-label"?: string; children?: React.ReactNode }
) => {
  if (typeof window !== "undefined" && import.meta.env?.DEV) {
    if (!props["aria-label"]) {
      const hasTextChildren =
        props.children &&
        typeof props.children === "string" &&
        props.children.trim().length > 0;

      if (componentName === "ToggleGroup") {
        console.warn(
          `[${componentName}] Missing required aria-label prop. ` +
            'Example: <ToggleGroup aria-label="Text formatting options">'
        );
      } else if (!hasTextChildren) {
        console.warn(
          `[${componentName}] Icon-only items require aria-label. ` +
            'Example: <ToggleGroupItem aria-label="Bold" value="bold"><IconBold /></ToggleGroupItem>'
        );
      }
    }
  }
};











































function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  orientation = "horizontal",
  multiple = false,
  loopFocus = true,
  disabled,
  children,
  ...props
}: ToggleGroupProps) {

  warnIfMissingAriaLabel("ToggleGroup", props);

  const contextValue = React.useMemo<ToggleGroupContextValue>(
    () => ({
      variant,
      size,
      orientation,
      disabled,
    }),
    [variant, size, orientation, disabled]
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        data-orientation={orientation}
        className={cn(toggleGroupVariants({ variant, orientation }), className)}
        multiple={multiple}
        loopFocus={loopFocus}
        disabled={disabled}
        orientation={orientation ?? "horizontal"}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive>
    </ToggleGroupContext.Provider>
  );
}

























function ToggleGroupItem({
  className,
  value,
  size,
  colorVariant = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ToggleGroupItemProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const context = React.useContext(ToggleGroupContext);


  const resolvedSize = size ?? context.size ?? "default";
  const resolvedVariant = context.variant ?? "default";
  const isDisabled = disabled || context.disabled || loading;


  warnIfMissingAriaLabel("ToggleGroupItem", { children, ...props });


  const handlePressedChange: TogglePrimitive.Props["onPressedChange"] =
    React.useCallback(
      (
        pressed: boolean,
        eventDetails: Parameters<
          NonNullable<TogglePrimitive.Props["onPressedChange"]>
        >[1]
      ) => {

        props.onPressedChange?.(pressed, eventDetails);


        if (ref.current && !loading) {
          ref.current.animate(
            [
              { transform: "scale(1)" },
              { transform: "scale(0.95)" },
              { transform: "scale(1)" },
            ],
            {
              duration: 150,
              easing: "ease-out",
            }
          );
        }
      },
      [props.onPressedChange, loading]
    );

  return (
    <TogglePrimitive
      ref={ref}
      data-slot="toggle-group-item"
      data-orientation={context.orientation}
      data-loading={loading || undefined}
      className={cn(
        toggleGroupItemVariants({
          variant: resolvedVariant,
          size: resolvedSize,
          colorVariant,
        }),
        className
      )}
      value={value}
      disabled={isDisabled}
      onPressedChange={handlePressedChange}
      {...props}
    >
      {loading ? (
        <>
          <IconLoader2 className="animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </TogglePrimitive>
  );
}




export { ToggleGroup, ToggleGroupItem, toggleGroupVariants, toggleGroupItemVariants };
export type { ToggleGroupProps, ToggleGroupItemProps };
