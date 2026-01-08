import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function Tabs({ ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground relative",
  {
    variants: {
      variant: {
        default: "bg-muted",
        outline: "border border-border bg-transparent",
        pills: "bg-transparent gap-1",
        underline:
          "bg-transparent gap-1 rounded-none p-0 border-b border-border",
        soft: "bg-transparent gap-1",
        card: "bg-muted/30 gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TabsListProps
  extends TabsPrimitive.List.Props,
    VariantProps<typeof tabsListVariants> {}

function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "text-muted-foreground hover:text-foreground",
          "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-md data-[active]:font-semibold",
        ],
        outline: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary data-[active]:text-primary-foreground data-[active]:font-semibold data-[active]:shadow-md",
        ],
        pills: [
          "text-muted-foreground border border-transparent hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary data-[active]:text-primary-foreground data-[active]:border-primary data-[active]:font-semibold data-[active]:shadow-md",
        ],
        underline: [
          "text-muted-foreground rounded-none border-b-2 border-transparent -mb-px hover:text-foreground hover:border-muted-foreground/30",
          "data-[active]:text-primary data-[active]:border-primary data-[active]:font-semibold",
        ],
        soft: [
          "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "data-[active]:bg-primary/10 data-[active]:text-primary data-[active]:font-semibold",
        ],
        card: [
          "text-muted-foreground hover:text-foreground",
          "data-[active]:bg-card data-[active]:text-foreground data-[active]:shadow-lg data-[active]:font-semibold data-[active]:border data-[active]:border-border",
        ],
      },
      color: {
        default: "",
        primary: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    compoundVariants: [
      // Primary color
      {
        variant: "pills",
        color: "primary",
        className:
          "data-[active]:bg-primary data-[active]:text-primary-foreground",
      },
      {
        variant: "soft",
        color: "primary",
        className: "data-[active]:bg-primary/10 data-[active]:text-primary",
      },
      {
        variant: "underline",
        color: "primary",
        className: "data-[active]:text-primary data-[active]:border-primary",
      },
      // Success color
      {
        variant: "pills",
        color: "success",
        className:
          "data-[active]:bg-green-600 data-[active]:text-white data-[active]:border-green-600",
      },
      {
        variant: "soft",
        color: "success",
        className: "data-[active]:bg-green-500/10 data-[active]:text-green-600",
      },
      {
        variant: "underline",
        color: "success",
        className:
          "data-[active]:text-green-600 data-[active]:border-green-600",
      },
      // Warning color
      {
        variant: "pills",
        color: "warning",
        className:
          "data-[active]:bg-amber-500 data-[active]:text-white data-[active]:border-amber-500",
      },
      {
        variant: "soft",
        color: "warning",
        className: "data-[active]:bg-amber-500/10 data-[active]:text-amber-600",
      },
      {
        variant: "underline",
        color: "warning",
        className:
          "data-[active]:text-amber-600 data-[active]:border-amber-500",
      },
      // Destructive color
      {
        variant: "pills",
        color: "destructive",
        className:
          "data-[active]:bg-destructive data-[active]:text-destructive-foreground data-[active]:border-destructive",
      },
      {
        variant: "soft",
        color: "destructive",
        className:
          "data-[active]:bg-destructive/10 data-[active]:text-destructive",
      },
      {
        variant: "underline",
        color: "destructive",
        className:
          "data-[active]:text-destructive data-[active]:border-destructive",
      },
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
);

interface TabsTriggerProps
  extends TabsPrimitive.Tab.Props,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({
  className,
  variant,
  color,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, color }), className)}
      {...props}
    />
  );
}

const tabsContentVariants = cva(
  "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      animation: {
        none: "",
        fade: "animate-in fade-in-0 duration-200",
        slide: "animate-in slide-in-from-right-4 fade-in-0 duration-300",
        slideUp: "animate-in slide-in-from-bottom-4 fade-in-0 duration-300",
        zoom: "animate-in zoom-in-95 fade-in-0 duration-200",
      },
    },
    defaultVariants: {
      animation: "fade",
    },
  }
);

interface TabsContentProps
  extends TabsPrimitive.Panel.Props,
    VariantProps<typeof tabsContentVariants> {}

function TabsContent({ className, animation, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(tabsContentVariants({ animation }), className)}
      {...props}
    />
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out",
        className
      )}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  tabsTriggerVariants,
  tabsContentVariants,
};
