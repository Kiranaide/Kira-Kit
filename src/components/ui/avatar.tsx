"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AvatarSize =
  | "xs"
  | "sm"
  | "default"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden align-middle select-none",
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
        true: "cursor-pointer transition-opacity hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
  },
  defaultVariants: { ring: "default" },
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
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "top-right": "top-0 right-0",
        "top-left": "top-0 left-0",
      },
    },
    defaultVariants: {
      status: "online",
      size: "default",
      position: "bottom-right",
    },
  }
);

const avatarBadgeVariants = cva(
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
    defaultVariants: { gradient: "default" },
  }
);

// Pixel sizes per token — used for numeric spacing math (fixes the old
// AvatarStack bug that used a class name like "w-8" as a CSS length).
const sizePx: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  default: 40,
  lg: 48,
  xl: 64,
  "2xl": 80,
  "3xl": 96,
  "4xl": 128,
};

// -----------------------------------------------------------------------------
// Avatar (Base UI Root)
// -----------------------------------------------------------------------------

interface AvatarProps
  extends
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
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
  /** Pulse the status dot (e.g. for "online"). Respects reduced motion. */
  statusPulse?: boolean;
  /**
   * Corner badge, typically an `<AvatarBadge />`. Rendered next to (not
   * inside) the avatar's image so it isn't clipped by its overflow-hidden
   * shape — same reasoning as `status` above.
   */
  badge?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  "aria-label"?: string;
}

function Avatar({
  className,
  size = "default",
  shape = "circle",
  ring,
  status,
  statusPosition = "bottom-right",
  statusPulse = false,
  badge,
  children,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: AvatarProps) {
  const isInteractive = Boolean(onClick);
  const reducedMotion = useReducedMotion();

  return (
    // The status dot must live outside the image-clipping box: `Avatar`'s
    // own `overflow-hidden` (needed to crop the image/fallback to its
    // shape) would otherwise clip a corner-positioned dot that sits right
    // at the circle's edge, cutting most of it off. This wrapper is an
    // unstyled, size-less positioning context (it shrinks to fit its one
    // child) so the dot can be a sibling instead.
    <span data-slot="avatar-wrapper" className="relative inline-flex shrink-0 align-middle">
      <AvatarPrimitive.Root
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
                  (e.currentTarget as HTMLElement).click();
                }
              }
            : undefined
        }
        className={cn(
          avatarVariants({ size, shape, interactive: isInteractive }),
          ring && ring !== "default" && avatarRingVariants({ ring }),
          className
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
      {status && (
        <span
          aria-hidden="true"
          className={cn(
            statusVariants({ status, size: size ?? "default", position: statusPosition })
          )}
        >
          {statusPulse && status === "online" && !reducedMotion && (
            <span className="absolute inset-0 rounded-full bg-success animate-ping" />
          )}
        </span>
      )}
      {badge}
    </span>
  );
}

// -----------------------------------------------------------------------------
// AvatarImage (Base UI Image, blur-up)
// -----------------------------------------------------------------------------

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  onLoadingStatusChange?: (
    status: "idle" | "loading" | "loaded" | "error"
  ) => void;
}

function AvatarImage({
  className,
  onLoadingStatusChange,
  ...props
}: AvatarImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square h-full w-full object-cover",
        !reducedMotion && "transition-[filter,opacity] duration-500",
        !loaded && "scale-105 blur-md",
        className
      )}
      onLoadingStatusChange={(status) => {
        if (status === "loaded") setLoaded(true);
        onLoadingStatusChange?.(status);
      }}
      {...props}
    />
  );
}

// -----------------------------------------------------------------------------
// AvatarFallback (Base UI Fallback)
// -----------------------------------------------------------------------------

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
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
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex h-full w-full items-center justify-center font-medium",
        variant === "gradient"
          ? gradientVariants({ gradient })
          : "bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}

// -----------------------------------------------------------------------------
// AvatarBadge
// -----------------------------------------------------------------------------

interface AvatarBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "content"> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline";
  size?: AvatarSize;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  content?: React.ReactNode;
}

function AvatarBadge({
  className,
  variant = "destructive",
  size = "default",
  position = "top-right",
  content,
  children,
  ...props
}: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(avatarBadgeVariants({ variant, size, position }), className)}
      {...props}
    >
      {content ?? children}
    </span>
  );
}

// -----------------------------------------------------------------------------
// AvatarTyping — animated typing dots
// -----------------------------------------------------------------------------

function AvatarTyping({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <span
      data-slot="avatar-typing"
      role="status"
      aria-label="typing"
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-1 rounded-full bg-muted-foreground",
            !reducedMotion && "animate-badge-pulse"
          )}
          style={!reducedMotion ? { animationDelay: `${i * 0.15}s` } : undefined}
        />
      ))}
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

// -----------------------------------------------------------------------------
// AvatarGroup — overlapped, tooltips, expandable overflow
// -----------------------------------------------------------------------------

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  /** Overlap in px (negative overlaps). */
  overlap?: number;
  size?: AvatarSize;
  /** Show a per-avatar tooltip using each child's `data-name`. */
  tooltips?: boolean;
  /** Names for the overflow popover (index-aligned with hidden children). */
  overflowNames?: string[];
  /** Render an "add member" affordance at the end. */
  onAddMember?: () => void;
}

function AvatarGroup({
  max = 3,
  overlap = -8,
  size = "default",
  tooltips = false,
  overflowNames,
  onAddMember,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visible = avatars.slice(0, max);
  const hidden = avatars.slice(max);
  const remaining = hidden.length;

  const overflowChipSize = cn(
    "flex items-center justify-center bg-muted text-muted-foreground font-medium rounded-full ring-2 ring-background",
    avatarVariants({ size })
  );

  const wrap = (node: React.ReactNode, index: number) => {
    const name =
      (React.isValidElement(node) &&
        (node.props as { "data-name"?: string })["data-name"]) ||
      undefined;
    if (!tooltips || !name) return node;
    return (
      <Tooltip key={index}>
        <TooltipTrigger render={<span>{node as React.ReactElement}</span>} />
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center", className)}
      {...props}
    >
      {visible.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-background rounded-full"
          style={{
            marginLeft: index === 0 ? 0 : `${overlap}px`,
            zIndex: visible.length - index,
          }}
        >
          {wrap(avatar, index)}
        </div>
      ))}

      {remaining > 0 && (
        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                className={overflowChipSize}
                style={{ marginLeft: `${overlap}px`, zIndex: 0 }}
                aria-label={`Show ${remaining} more`}
              >
                +{remaining}
              </button>
            }
          />
          <PopoverContent className="w-auto max-w-xs">
            <div className="flex flex-wrap gap-2">
              {hidden.map((avatar, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  {avatar}
                  {overflowNames?.[i] && (
                    <span className="text-[10px] text-muted-foreground">
                      {overflowNames[i]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {onAddMember && (
        <button
          type="button"
          onClick={onAddMember}
          aria-label="Add member"
          className={cn(
            overflowChipSize,
            "border border-dashed border-border hover:bg-muted/80"
          )}
          style={{ marginLeft: `${overlap}px` }}
        >
          <IconPlus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// AvatarStack — horizontally scrollable overlap (fixed padding)
// -----------------------------------------------------------------------------

interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
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

  return (
    <div
      data-slot="avatar-stack"
      className={cn(
        "flex items-center overflow-x-auto scrollbar-hide",
        className
      )}
      // Numeric left pad so the first (negatively-margined) avatar isn't clipped.
      style={{ paddingLeft: `${Math.round(sizePx[size] / 3)}px` }}
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
      {showCount && count > 0 && (
        <div
          className={cn(
            "shrink-0 flex items-center justify-center bg-muted text-muted-foreground font-medium rounded-full -ml-3",
            avatarVariants({ size })
          )}
          style={{ zIndex: 0 }}
        >
          +{count}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// KiraAvatar — one prop-driven avatar (supersedes AutoAvatar)
// -----------------------------------------------------------------------------

interface KiraAvatarProps extends Omit<AvatarProps, "children"> {
  name: string;
  src?: string;
  /** Fallback icon shown when there's no image and no initials. */
  icon?: React.ReactNode;
  /** Corner badge (e.g. a count). */
  badge?: React.ReactNode;
  badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  /** Last-seen text shown in a tooltip on hover. */
  lastSeen?: string;
  gradient?: AvatarFallbackProps["gradient"];
}

function KiraAvatar({
  name,
  src,
  icon,
  badge,
  badgePosition = "top-right",
  lastSeen,
  gradient,
  size = "default",
  ...avatarProps
}: KiraAvatarProps) {
  const initials = React.useMemo(() => getInitials(name), [name]);

  const buildAvatar = () => (
    <Avatar
      size={size}
      aria-label={name}
      data-name={name}
      badge={
        badge && (
          <AvatarBadge
            size={size ?? "default"}
            position={badgePosition}
            content={badge}
          />
        )
      }
      {...avatarProps}
    >
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback variant={gradient ? "gradient" : "default"} gradient={gradient}>
        {icon ?? initials}
      </AvatarFallback>
    </Avatar>
  );

  if (lastSeen) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span>{buildAvatar()}</span>} />
        <TooltipContent>Last seen {lastSeen}</TooltipContent>
      </Tooltip>
    );
  }

  return buildAvatar();
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarTyping,
  AvatarGroup,
  AvatarStack,
  KiraAvatar,
  avatarVariants,
  avatarRingVariants,
  statusVariants,
  avatarBadgeVariants,
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
  KiraAvatarProps,
  AvatarSize,
};
