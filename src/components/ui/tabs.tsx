import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

function Tabs({ ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        outline: "border border-border bg-transparent",
        pills: "bg-transparent gap-1",
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
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "text-muted-foreground",
          "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm data-[selected]:font-semibold",
        ],
        outline: [
          "text-muted-foreground",
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:font-semibold",
        ],
        pills: [
          "text-muted-foreground border border-transparent",
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:border-primary data-[selected]:font-semibold",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TabsTriggerProps
  extends TabsPrimitive.Tab.Props,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({ className, variant, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        "absolute bottom-0 h-0.5 bg-primary transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, TabsIndicator };
