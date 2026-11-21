/* kira-kit-ignore-file spacing-scale: avatar status dots follow the non-control avatar ladder */
/* kira-kit-ignore-file arbitrary-values: avatar fallback/status micro type (documented sub-12px exception) */
"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { IconPlus } from "@tabler/icons-react";
import { cn } from "cn";
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
import { resolveComponentDefaults } from "@/lib/component-defaults";
import { isStringProp } from "@/lib/component-prop-guards";

type AvatarSize = "xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

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

      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
      shape: {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-lg",
      },
      interactive: {
        true: "cursor-pointer transition-[opacity,scale,box-shadow] duration-150 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[3px]",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",

      // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
      shape: "circle",
      interactive: false,
    },
  },
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
  },
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
      variant: "destructive",
      size: "default",
      position: "top-right",
    },
  },
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
  },
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
   * Screen-reader label for the status dot (e.g. "Online"). When omitted
   * the dot stays purely decorative (aria-hidden). Color alone never
   * carries meaning (WCAG 1.4.1) — provide this when status matters.
   */
  statusLabel?: string;
  /**
   * Corner badge, typically an `<AvatarBadge />`. Rendered next to (not
   * inside) the avatar's image so it isn't clipped by its overflow-hidden
   * shape — same reasoning as `status` above.
   */
  badge?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  "aria-label"?: string;
}

function Avatar(input: AvatarProps) {
  const {
    className,
    size,
    // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
    shape: cornerStyle,
    ring,
    status,
    statusPosition,
    statusPulse,
    statusLabel,
    badge,
    children,
    onClick,
    "aria-label": ariaLabel,
    ...props
  } = resolveComponentDefaults(input, AVATAR_DEFAULTS_1);

  const isInteractive = Boolean(onClick);
  const reducedMotion = useReducedMotion();

  return (
    // The status dot must live outside the image-clipping box: `Avatar`'s own
    // `overflow-hidden` (needed to crop the image to its shape) would clip a
    // corner dot sitting at the circle's edge. This wrapper is an unstyled,
    // size-less positioning context so the dot can be a sibling instead.
    renderAvatarWrapperPart1({
      isInteractive,
      onClick,
      ariaLabel,
      size,
      cornerStyle,
      ring,
      className,
      props,
      children,
      status,
      statusPosition,
      statusPulse,
      reducedMotion,
      statusLabel,
      badge,
    })
  );
}

interface AvatarImageProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
> {
  onLoadingStatusChange?: (
    status: "idle" | "loading" | "loaded" | "error",
  ) => void;
  /**
   * Keep the image mounted through the loading state so `data-loading` /
   * `data-starting-style` attributes are emitted and the blur-up transition
   * actually plays (Base UI unmounts the img before `loaded` otherwise).
   * @default true
   */
  keepMounted?: boolean;
}

function AvatarImage({
  className,
  onLoadingStatusChange,
  keepMounted = true,
  ...props
}: AvatarImageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      keepMounted={keepMounted}
      className={cn(
        // Overlay: keepMounted keeps the img in the DOM even on error, so it
        // must not take layout space from the fallback (Base UI Avatar image
        // is a fill overlay; the root owns the box).
        "absolute inset-0 h-full w-full object-cover",
        !reducedMotion &&
          "transition-[filter,opacity,scale] duration-500 ease-out",
        "data-loading:scale-105 data-loading:blur-md",
        "data-starting-style:scale-105 data-starting-style:blur-md",
        // keepMounted keeps the error-state img in the DOM where its alt
        // text / broken-image glyph would paint over the fallback.
        "data-error:invisible",
        className,
      )}
      onLoadingStatusChange={onLoadingStatusChange}
      {...props}
    />
  );
}

interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Fallback
> {
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
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}

interface AvatarBadgeProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "content"
> {
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

function AvatarBadge(inputProps: AvatarBadgeProps) {
  const { className, variant, size, position, content, children, ...props } =
    resolveComponentDefaults(inputProps, {
      variant: "destructive",
      size: "default",
      position: "top-right",
    });

  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        avatarBadgeVariants({ variant, size, position }),
        className,
      )}
      {...props}
    >
      {content ?? children}
    </span>
  );
}

function AvatarTyping({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <output
      data-slot="avatar-typing"

      aria-label="typing"
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-1 rounded-full bg-muted-foreground",
            !reducedMotion && "animate-badge-pulse",
          )}
          style={reducedMotion ? undefined : { animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </output>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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

// oxlint-disable-next-line eslint/max-lines-per-function -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function AvatarGroup(input: AvatarGroupProps) {
  const {
    max,
    overlap,
    size,
    tooltips,
    overflowNames,
    onAddMember,
    className,
    children,
    ...props
  } = resolveComponentDefaults(input, AVATAR_GROUP_DEFAULTS_2);

  const avatars = React.Children.toArray(children);
  const visible = avatars.slice(0, max);
  const hidden = avatars.slice(max);
  const remaining = hidden.length;

  const overflowChipSize = cn(
    "flex items-center justify-center bg-muted text-muted-foreground font-medium rounded-full ring-2 ring-background",
    avatarVariants({ size }),
  );

  const wrap = (node: React.ReactNode) => {
    // Only string names on valid elements can become tooltip labels.
    let name: string | undefined;

    if (
      React.isValidElement<{ "data-name"?: unknown }>(node) &&
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Group children can have arbitrary props; validate the tooltip label.
      isStringProp(node.props["data-name"])
    ) {
      name = node.props["data-name"];
    }

    if (!tooltips || !name) return node;

    return (
      <Tooltip>
        <TooltipTrigger render={<span>{node}</span>} />
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div
      data-slot="avatar-group"

      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This composite div groups controls or content without introducing fieldset form behavior, default styling, or a different public ref element.
      role="group"
      aria-label="Avatar group"
      className={cn("flex items-center", className)}
      {...props}
    >
      {React.Children.map(visible, (avatar, index) => (
        <div
          className="ring-2 ring-background rounded-full"
          style={{
            marginLeft: index === 0 ? 0 : `${overlap}px`,
            zIndex: visible.length - index,
          }}
        >
          {wrap(avatar)}
        </div>
      ))}

      {remaining > 0 &&
        renderAvatarGroupSectionPart2({
          overflowChipSize,
          overlap,
          remaining,
          hidden,
          overflowNames,
        })}

      {onAddMember && (
        <button
          type="button"
          onClick={onAddMember}
          aria-label="Add member"
          className={cn(
            overflowChipSize,
            "border border-dashed border-border hover:bg-muted/80",
          )}
          style={{ marginLeft: `${overlap}px` }}
        >
          <IconPlus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

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
        className,
      )}
      // Numeric left pad so the first (negatively-margined) avatar isn't clipped.
      style={{ paddingLeft: `${Math.round(sizePx[size] / 3)}px` }}
      {...props}
    >
      {React.Children.map(avatars, (avatar, index) => (
        <div
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
            avatarVariants({ size }),
          )}
          style={{ zIndex: 0 }}
          aria-label={`${count} members`}
        >
          {count}
        </div>
      )}
    </div>
  );
}

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
      <AvatarFallback
        variant={gradient ? "gradient" : "default"}
        gradient={gradient}
      >
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

type renderAvatarWrapperPart1Args = {
  isInteractive: boolean;
  onClick: AvatarProps["onClick"];
  ariaLabel: AvatarProps["aria-label"];
  size: "default" | "sm" | "lg" | "xl" | "xs" | "2xl" | "3xl" | "4xl" | null;
  cornerStyle: "circle" | "square" | "rounded" | null;
  ring: AvatarProps["ring"];
  className: AvatarProps["className"];
  props: Omit<
    AvatarProps,
    | "className"
    | "size"
    | "shape"
    | "ring"
    | "status"
    | "statusPosition"
    | "statusPulse"
    | "statusLabel"
    | "badge"
    | "children"
    | "onClick"
    | "aria-label"
  >;
  children: AvatarProps["children"];
  status: AvatarProps["status"];
  statusPosition: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  statusPulse: boolean;
  reducedMotion: ReturnType<typeof useReducedMotion>;
  statusLabel: AvatarProps["statusLabel"];
  badge: AvatarProps["badge"];
};

// oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
function renderAvatarWrapperPart1({
  isInteractive,
  onClick,
  ariaLabel,
  size,
  cornerStyle,
  ring,
  className,
  props,
  children,
  status,
  statusPosition,
  statusPulse,
  reducedMotion,
  statusLabel,
  badge,
}: renderAvatarWrapperPart1Args) {
  return (
    <span
      data-slot="avatar-wrapper"
      className="relative inline-flex shrink-0 align-middle"
    >
      <AvatarPrimitive.Root
        data-slot="avatar"
        // An interactive avatar is a real button: AT announces a control named by
        // aria-label, and native Enter/Space activation and focusability apply —
        // no tabIndex/onKeyDown shim. `role="img"` is for the non-interactive case
        // only; on a button it would erase the button semantics.
        render={
          isInteractive ? (
            <button
              type="button"
              onClick={onClick}
              aria-label={ariaLabel ?? "Avatar"}
            />
          ) : undefined
        }
        role={isInteractive || !ariaLabel ? undefined : "img"}
        aria-label={isInteractive ? undefined : ariaLabel}
        className={cn(
          avatarVariants({
            size,

            // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
            shape: cornerStyle,
            interactive: isInteractive,
          }),
          ring && ring !== "default" && avatarRingVariants({ ring }),
          className,
        )}
        {...props}
      >
        {children}
      </AvatarPrimitive.Root>
      {status && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              statusVariants({
                status,
                size: size ?? "default",
                position: statusPosition,
              }),
            )}
          >
            {statusPulse && status === "online" && !reducedMotion && (
              <span className="absolute inset-0 rounded-full bg-success animate-ping" />
            )}
          </span>
          {statusLabel && <span className="sr-only">{statusLabel}</span>}
        </>
      )}
      {badge}
    </span>
  );
}

type renderAvatarGroupSectionPart2Args = {
  overflowChipSize: ReturnType<typeof cn>;
  overlap: number;
  remaining: number;
  hidden: React.ReactNode[];
  overflowNames: AvatarGroupProps["overflowNames"];
};

function renderAvatarGroupSectionPart2({
  overflowChipSize,
  overlap,
  remaining,
  hidden,
  overflowNames,
}: renderAvatarGroupSectionPart2Args) {
  return (
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
          {React.Children.map(hidden, (avatar, i) => (
            <div className="flex flex-col items-center gap-1">
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
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const AVATAR_DEFAULTS_1 = {
  size: "default",
  // oxlint-disable-next-line anti-slop/no-shape-in-symbol-names -- Shape names denote the intentional public geometric corner API and CVA variant keys; renaming them would break consumers.
  shape: "circle",

  statusPosition: "bottom-right",
  statusPulse: false,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const AVATAR_GROUP_DEFAULTS_2 = {
  max: 3,
  overlap: -8,
  size: "default",
  tooltips: false,
} as const;
