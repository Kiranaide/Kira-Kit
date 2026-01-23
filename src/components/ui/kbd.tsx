import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const kbdVariants = cva(
  "inline-flex items-center justify-center rounded font-mono text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-muted px-1.5 py-0.5 text-muted-foreground shadow-sm",
        outline: "border border-border px-1.5 py-0.5 text-muted-foreground",
        ghost: "bg-muted/50 px-1.5 py-0.5 text-muted-foreground",
      },
      size: {
        sm: "h-5 min-w-5 text-[10px] px-1",
        default: "h-6 min-w-6 text-xs px-1.5",
        lg: "h-7 min-w-7 text-sm px-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

function Kbd({ className, variant, size, children, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </kbd>
  );
}


function KbdShortcut({
  keys,
  separator = "+",
  ...props
}: KbdProps & { keys: string[]; separator?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && (
            <span className="text-muted-foreground text-xs">{separator}</span>
          )}
          <Kbd {...props}>{key}</Kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

export { Kbd, KbdShortcut, kbdVariants };
