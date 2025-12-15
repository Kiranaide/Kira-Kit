import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconInbox,
  IconFileOff,
  IconSearch,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const emptyVariants = cva(
  "flex flex-col items-center justify-center text-center p-8",
  {
    variants: {
      size: {
        sm: "py-6 gap-2",
        default: "py-8 gap-3",
        lg: "py-12 gap-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const emptyIcons = {
  inbox: IconInbox,
  file: IconFileOff,
  search: IconSearch,
  alert: IconAlertCircle,
};

interface EmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {
  icon?: keyof typeof emptyIcons | React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

function Empty({
  className,
  size,
  icon = "inbox",
  title = "No data",
  description,
  action,
  children,
  ...props
}: EmptyProps) {
  const IconComponent = typeof icon === "string" ? emptyIcons[icon] : null;

  return (
    <div
      data-slot="empty"
      className={cn(emptyVariants({ size }), className)}
      {...props}
    >
      {/* Icon */}
      <div className="text-muted-foreground/50">
        {IconComponent ? (
          <IconComponent
            className={cn(
              size === "sm"
                ? "h-10 w-10"
                : size === "lg"
                ? "h-16 w-16"
                : "h-12 w-12"
            )}
            strokeWidth={1.5}
          />
        ) : (
          icon
        )}
      </div>

      {/* Title */}
      {title && (
        <h3
          className={cn(
            "font-medium text-foreground",
            size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base"
          )}
        >
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-muted-foreground max-w-sm",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div className="mt-2">{action}</div>}

      {/* Children */}
      {children}
    </div>
  );
}

// Specific empty state components
function EmptyInbox(props: Omit<EmptyProps, "icon">) {
  return <Empty icon="inbox" title="No messages" {...props} />;
}

function EmptySearch(props: Omit<EmptyProps, "icon">) {
  return <Empty icon="search" title="No results found" {...props} />;
}

function EmptyFile(props: Omit<EmptyProps, "icon">) {
  return <Empty icon="file" title="No files" {...props} />;
}

export { Empty, EmptyInbox, EmptySearch, EmptyFile, emptyVariants };
