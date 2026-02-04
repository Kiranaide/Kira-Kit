"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 transition-all duration-200",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
        "2xl": "h-20 w-20 text-xl",
        "3xl": "h-24 w-24 text-2xl",
        "4xl": "h-32 w-32 text-3xl",
      },

      shape: {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-lg",
      },

      interactive: {
        true: "cursor-pointer hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      shape: "circle",
      interactive: false,
    },
  }
);

const avatarContentVariants = cva("relative flex shrink-0 overflow-hidden", {
  variants: {
    shape: {
      circle: "rounded-full",
      square: "rounded-none",
      rounded: "rounded-lg",
    },
  },
  defaultVariants: {
    shape: "circle",
  },
});

const avatarRingVariants = cva("", {
  variants: {
    ring: {
      default: "",
      primary: "ring-2 ring-primary ring-offset-2 ring-offset-background",
      secondary: "ring-2 ring-secondary ring-offset-2 ring-offset-background",
      destructive:
        "ring-2 ring-destructive ring-offset-2 ring-offset-background",
      success: "ring-2 ring-success ring-offset-2 ring-offset-background",
      warning: "ring-2 ring-warning ring-offset-2 ring-offset-background",
      info: "ring-2 ring-info ring-offset-2 ring-offset-background",
    },

    shape: {
      circle: "rounded-full",
      square: "rounded-none",
      rounded: "rounded-lg",
    },
  },
  defaultVariants: {
    ring: "default",
    shape: "circle",
  },
});

const statusVariants = cva(
  "absolute rounded-full border-2 border-background z-10",
  {
    variants: {
      status: {
        online: "bg-success",
        offline: "bg-muted-foreground/50",
        busy: "bg-destructive",
        away: "bg-warning",
        offline_gray: "bg-muted",
      },

      size: {
        xs: "h-2.5 w-2.5",
        sm: "h-3 w-3",
        default: "h-3.5 w-3.5",
        lg: "h-4 w-4",
        xl: "h-5 w-5",
        "2xl": "h-6 w-6",
        "3xl": "h-7 w-7",
        "4xl": "h-8 w-8",
      },
      position: {
        "bottom-right": "-bottom-0.5 -right-0.5",
        "bottom-left": "-bottom-0.5 -left-0.5",
        "top-right": "-top-0.5 -right-0.5",
        "top-left": "-top-0.5 -left-0.5",
      },
    },
    defaultVariants: {
      status: "online",
      size: "default",
      position: "bottom-right",
    },
  }
);

const badgeVariants = cva(
  "absolute rounded-full border-2 border-background flex items-center justify-center font-medium z-10",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-white",
        success: "bg-success text-white",
        warning: "bg-warning text-black",
        info: "bg-info text-white",
        outline: "bg-background text-foreground border border-border",
      },
      size: {
        xs: "h-3 w-3 text-[8px]",
        sm: "h-4 w-4 text-[10px]",
        default: "h-5 w-5 text-xs",
        lg: "h-6 w-6 text-xs",
        xl: "h-7 w-7 text-sm",
        "2xl": "h-8 w-8 text-sm",
        "3xl": "h-10 w-10 text-base",
        "4xl": "h-12 w-12 text-lg",
      },
      position: {
        "top-right": "-top-1 -right-1",
        "top-left": "-top-1 -left-1",
        "bottom-right": "-bottom-1 -right-1",
        "bottom-left": "-bottom-1 -left-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "top-right",
    },
  }
);

const gradientVariants = cva(
  "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
  {
    variants: {
      gradient: {
        default: "from-primary/20 via-primary/10 to-primary/5",
        blue: "from-blue-400/20 via-blue-400/10 to-blue-400/5",
        purple: "from-purple-400/20 via-purple-400/10 to-purple-400/5",
        green: "from-green-400/20 via-green-400/10 to-green-400/5",
        orange: "from-orange-400/20 via-orange-400/10 to-orange-400/5",
        pink: "from-pink-400/20 via-pink-400/10 to-pink-400/5",
      },
    },
    defaultVariants: {
      gradient: "default",
    },
  }
);

interface AvatarProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  ring?:
    | "default"
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info";

  status?: "online" | "offline" | "busy" | "away" | "offline_gray";

  statusPosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";

  "aria-label"?: string;
}

function Avatar({
  className,
  size,
  shape = "circle",
  ring,
  status,
  statusPosition = "top-right",
  children,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: AvatarProps) {
  const isInteractive = Boolean(onClick);

  return (
    <span
      data-slot="avatar"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.currentTarget.click();
              }
            }
          : undefined
      }
      className={cn(
        "relative inline-flex",
        avatarVariants({ size, shape, interactive: isInteractive }),
        className
      )}
      {...props}
    >
      <span
        data-slot="avatar-content"
        className={cn(avatarContentVariants({ shape }), "h-full w-full")}
      >
        {children}
      </span>
      {ring && ring !== "default" && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 pointer-events-none",
            avatarRingVariants({ ring, shape })
          )}
        />
      )}
      {status && (
        <span
          aria-hidden="true"
          className={cn(
            statusVariants({ status, size: size || "default" }),
            statusPosition === "top-right" && "top-0 right-0",
            statusPosition === "top-left" && "top-0 left-0",
            statusPosition === "bottom-right" && "bottom-0 right-0",
            statusPosition === "bottom-left" && "bottom-0 left-0"
          )}
        />
      )}
    </span>
  );
}

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoad?: () => void;
}

function AvatarImage({
  className,
  src,
  alt = "",
  onLoad,
  ...props
}: AvatarImageProps) {
  const [hasError, setHasError] = React.useState(false);

  if (hasError || !src) {
    return null;
  }

  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={() => setHasError(true)}
      onLoad={onLoad}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gradient";
  gradient?: "default" | "blue" | "purple" | "green" | "orange" | "pink";
}

function AvatarFallback({
  className,
  variant = "default",
  gradient = "default",
  children,
  ...props
}: AvatarFallbackProps) {
  if (variant === "gradient") {
    return (
      <span
        data-slot="avatar-fallback"
        className={cn(
          "flex h-full w-full items-center justify-center font-medium",
          gradientVariants({ gradient }),
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center bg-muted font-medium text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface AvatarBadgeProps {
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  content?: React.ReactNode;
  children?: React.ReactNode;
}

function AvatarBadge({
  className,
  variant = "destructive",
  size = "default",
  position = "top-right",
  content,
  ...props
}: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(badgeVariants({ variant, size, position }), className)}
      {...props}
    >
      {content}
    </span>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AutoAvatarProps extends Omit<AvatarProps, "children"> {
  name: string;
  src?: string;
  children?: React.ReactNode;
}

function AutoAvatar({ name, src, ...props }: AutoAvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const initials = React.useMemo(() => getInitials(name), [name]);

  return (
    <Avatar {...props}>
      {src && !imageError ? (
        <AvatarImage src={src} alt={name} onError={() => setImageError(true)} />
      ) : null}
      {(!src || imageError) && <AvatarFallback>{initials}</AvatarFallback>}
    </Avatar>
  );
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  overlap?: number;
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

function AvatarGroup({
  max = 3,
  overlap = -8,
  size = "default",
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
    "2xl": "h-20 w-20 text-xl",
    "3xl": "h-24 w-24 text-2xl",
    "4xl": "h-32 w-32 text-3xl",
  };

  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center", className)}
      style={{ marginLeft: `${Math.abs(overlap)}px` }}
      {...props}
    >
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-background rounded-full"
          style={{
            marginLeft: index === 0 ? 0 : `${overlap}px`,
            zIndex: visibleAvatars.length - index,
          }}
        >
          {avatar}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "ring-2 ring-background rounded-full flex items-center justify-center bg-muted text-muted-foreground font-medium",
            sizeClasses[size]
          )}
          style={{
            marginLeft: `${overlap}px`,
            zIndex: 0,
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  showCount?: boolean;
}

function AvatarStack({
  size = "default",
  showCount = true,
  className,
  children,
  ...props
}: AvatarStackProps) {
  const avatars = React.Children.toArray(children);
  const count = avatars.length;

  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-20 w-20",
    "3xl": "h-24 w-24",
    "4xl": "h-32 w-32",
  };

  return (
    <div
      data-slot="avatar-stack"
      className={cn(
        "flex items-center overflow-x-auto scrollbar-hide",
        className
      )}
      style={{
        paddingLeft: `${
          sizeClasses[size as keyof typeof sizeClasses].split(" ")[1]
        }`,
      }}
      {...props}
    >
      {avatars.map((avatar, index) => (
        <div
          key={index}
          className="shrink-0 ring-2 ring-background rounded-full first:ml-0 -ml-3"
          style={{ zIndex: count - index }}
        >
          {avatar}
        </div>
      ))}
      {showCount && (
        <div
          className={cn(
            "shrink-0 flex items-center justify-center bg-muted text-muted-foreground font-medium rounded-full -ml-3",
            sizeClasses[size]
          )}
          style={{ zIndex: 0 }}
        >
          +{count}
        </div>
      )}
    </div>
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarStack,
  AutoAvatar,
  avatarVariants,
  avatarContentVariants,
  avatarRingVariants,
  statusVariants,
  badgeVariants,
  gradientVariants,
  getInitials,
};
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarBadgeProps,
  AvatarGroupProps,
  AvatarStackProps,
  AutoAvatarProps,
};
