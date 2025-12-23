import * as React from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Accordion Root
function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full space-y-1", className)}
      {...props}
    />
  );
}

// Accordion Item
function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border border-border rounded-lg", className)}
      {...props}
    />
  );
}

// Accordion Trigger Variants
const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [[data-panel-open]_&]:rounded-b-none rounded-lg",
  {
    variants: {
      variant: {
        default: "hover:bg-muted/50",
        info: "bg-info/10 text-info-foreground hover:bg-info/20",
        success: "bg-success/10 text-success-foreground hover:bg-success/20",
        warning: "bg-warning/10 text-warning-foreground hover:bg-warning/20",
        destructive:
          "bg-destructive/10 text-destructive-foreground hover:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AccordionTriggerProps
  extends AccordionPrimitive.Trigger.Props,
    VariantProps<typeof accordionTriggerVariants> {
  showArrow?: boolean;
  icon?: React.ReactNode;
}

function AccordionTrigger({
  className,
  children,
  variant,
  showArrow = true,
  icon,
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header data-slot="accordion-header">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerVariants({ variant }), className)}
        {...props}
      >
        <span className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </span>
        {showArrow && (
          <IconChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 [[data-panel-open]_&]:rotate-180" />
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

// Accordion Content / Panel with Base UI CSS variable animation
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-panel"
      className={cn(
        // Use Base UI's built-in CSS variable for height animation
        "h-[var(--accordion-panel-height)] overflow-hidden",
        "transition-[height] duration-300 ease-out",
        "data-[starting-style]:h-0 data-[ending-style]:h-0",
        className
      )}
      {...props}
    >
      <div className="px-4 py-3 text-sm text-muted-foreground border-t border-border">
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionTriggerVariants,
};
