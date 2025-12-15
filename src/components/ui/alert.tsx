import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconAlertCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border border-border [&>svg]:text-foreground",
        info: "bg-info/10 border border-info/30 text-info-foreground [&>svg]:text-info-foreground",
        success:
          "bg-success/10 border border-success/30 text-success-foreground [&>svg]:text-success-foreground",
        warning:
          "bg-warning/10 border border-warning/30 text-warning-foreground [&>svg]:text-warning-foreground",
        destructive:
          "bg-destructive/10 border border-destructive/30 text-destructive-foreground [&>svg]:text-destructive-foreground",
        // Outline variants
        "outline-default":
          "bg-transparent border border-border text-foreground [&>svg]:text-foreground",
        "outline-info":
          "bg-transparent border border-info text-info-foreground [&>svg]:text-info-foreground",
        "outline-success":
          "bg-transparent border border-success text-success-foreground [&>svg]:text-success-foreground",
        "outline-warning":
          "bg-transparent border border-warning text-warning-foreground [&>svg]:text-warning-foreground",
        "outline-destructive":
          "bg-transparent border border-destructive text-destructive-foreground [&>svg]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const alertIcons = {
  default: null,
  info: IconInfoCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  destructive: IconAlertCircle,
  "outline-default": null,
  "outline-info": IconInfoCircle,
  "outline-success": IconCircleCheck,
  "outline-warning": IconAlertTriangle,
  "outline-destructive": IconAlertCircle,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

function Alert({
  className,
  variant = "default",
  showIcon = true,
  closable = false,
  onClose,
  children,
  ...props
}: AlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const alertRef = React.useRef<HTMLDivElement>(null);
  const IconComponent = alertIcons[variant || "default"];

  const handleClose = () => {
    if (alertRef.current) {
      // Use Web Animation API for smooth close animation
      alertRef.current.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-10px)" },
        ],
        {
          duration: 200,
          easing: "ease-in",
          fill: "forwards",
        }
      ).onfinish = () => {
        setIsVisible(false);
        onClose?.();
      };
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={alertRef}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && IconComponent && <IconComponent className="h-4 w-4" />}
      {children}
      {closable && (
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <IconX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="alert-title"
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

// Alert with Heading component
interface AlertWithHeadingProps extends AlertProps {
  title: string;
  description?: string;
}

function AlertWithHeading({
  title,
  description,
  children,
  ...props
}: AlertWithHeadingProps) {
  return (
    <Alert {...props}>
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </Alert>
  );
}

export { Alert, AlertTitle, AlertDescription, AlertWithHeading, alertVariants };
