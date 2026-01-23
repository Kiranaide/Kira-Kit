import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  IconLayoutSidebar,
  IconChevronDown,
  IconSun,
  IconMoon,
  IconMenu2,
  IconSearch,
  IconX,
  IconDots,
  IconArrowUp,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cva, type VariantProps } from "class-variance-authority";

// ============================================================================
// REDUCED MOTION HOOK (2025 Best Practice - WCAG 2.2)
// ============================================================================

function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// ============================================================================
// THEME CONTEXT
// ============================================================================

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("kira-theme") as Theme;
      if (stored) return stored;
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("kira-theme", theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// ============================================================================
// MOBILE DETECTION HOOK
// ============================================================================

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// ============================================================================
// SIDEBAR CONTEXT - ENHANCED
// ============================================================================

type CollapsibleMode = "offcanvas" | "icon" | "none";
type SidebarSide = "left" | "right";

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  collapsible: CollapsibleMode;
  side: SidebarSide;
  width: string;
  collapsedWidth: string;
  hoverExpand: boolean;
  isHoverExpanded: boolean;
  setIsHoverExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  reducedMotion: boolean;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

const STORAGE_KEY = "kira-sidebar-collapsed";

interface SidebarProviderProps {
  children: React.ReactNode;
  /** Collapsible mode: "offcanvas" hides completely, "icon" shows icons only, "none" disables collapse */
  collapsible?: CollapsibleMode;
  /** Side of the screen: "left" or "right" */
  side?: SidebarSide;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
  /** Persist collapsed state to localStorage */
  persistState?: boolean;
  /** Custom expanded width (e.g., "16rem", "256px") */
  width?: string;
  /** Custom collapsed width for icon mode (e.g., "4rem", "64px") */
  collapsedWidth?: string;
  /** Enable hover-to-expand when collapsed (2025 UX pattern) */
  hoverExpand?: boolean;
}

export function SidebarProvider({
  children,
  collapsible = "icon",
  side = "left",
  defaultCollapsed = false,
  persistState = true,
  width = "16rem",
  collapsedWidth = "4rem",
  hoverExpand = false,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(() => {
    if (collapsible === "none") return false;
    if (persistState && typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === "true";
    }
    return defaultCollapsed;
  });
  const [openMobile, setOpenMobile] = React.useState(false);
  const [isHoverExpanded, setIsHoverExpanded] = React.useState(false);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  // Persist collapsed state
  React.useEffect(() => {
    if (persistState && collapsible !== "none") {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    }
  }, [collapsed, persistState, collapsible]);

  // Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        if (isMobile) {
          setOpenMobile((prev) => !prev);
        } else if (collapsible !== "none") {
          setCollapsed((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, collapsible]);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else if (collapsible !== "none") {
      setCollapsed((prev) => !prev);
    }
  }, [isMobile, collapsible]);

  return (
    <SidebarContext.Provider
      value={{
        collapsed: collapsible === "none" ? false : collapsed,
        setCollapsed,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
        collapsible,
        side,
        width,
        collapsedWidth,
        hoverExpand,
        isHoverExpanded,
        setIsHoverExpanded,
        reducedMotion,
      }}
    >
      <div
        data-sidebar-provider=""
        data-collapsed={collapsed}
        data-side={side}
        data-collapsible={collapsible}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

// ============================================================================
// SIDEBAR COMPONENT VARIANTS
// ============================================================================

const sidebarVariants = cva(
  "h-screen flex flex-col",
  {
    variants: {
      variant: {
        default: "bg-sidebar border-sidebar-border",
        floating:
          "bg-sidebar m-2 rounded-xl border border-sidebar-border shadow-lg h-[calc(100vh-16px)]",
        inset: "bg-muted/30",
      },
      side: {
        left: "border-r",
        right: "border-l",
      },
    },
    compoundVariants: [
      {
        variant: "floating",
        side: "left",
        className: "border",
      },
      {
        variant: "floating",
        side: "right",
        className: "border",
      },
    ],
    defaultVariants: {
      variant: "default",
      side: "left",
    },
  },
);

type SidebarVariant = "default" | "floating" | "inset";

interface SidebarProps extends VariantProps<typeof sidebarVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({
  children,
  variant = "default",
  className,
}: SidebarProps) {
  const {
    collapsed,
    isMobile,
    openMobile,
    setOpenMobile,
    collapsible,
    side,
    width,
    collapsedWidth,
    hoverExpand,
    isHoverExpanded,
    setIsHoverExpanded,
    reducedMotion,
  } = useSidebar();

  // Timer ref for delayed hover collapse
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate width based on collapsible mode and hover state
  const sidebarWidth = React.useMemo(() => {
    if (collapsible === "offcanvas" && collapsed && !isHoverExpanded) return "0px";
    if (collapsible === "icon" && collapsed && !isHoverExpanded) return collapsedWidth;
    return width;
  }, [collapsed, collapsible, width, collapsedWidth, isHoverExpanded]);

  // Hover expand handlers
  const handleMouseEnter = React.useCallback(() => {
    if (hoverExpand && collapsed && collapsible === "icon") {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsHoverExpanded(true);
    }
  }, [hoverExpand, collapsed, collapsible, setIsHoverExpanded]);

  const handleMouseLeave = React.useCallback(() => {
    if (hoverExpand && isHoverExpanded) {
      // Delay collapse to prevent flickering
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHoverExpanded(false);
      }, 300);
    }
  }, [hoverExpand, isHoverExpanded, setIsHoverExpanded]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Mobile: Render as Drawer overlay
  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent
          side={side}
          size="sm"
          showCloseButton={false}
          className="p-0"
        >
          <nav
            data-slot="sidebar"
            data-mobile="true"
            role="navigation"
            aria-label="Main navigation"
            className={cn(
              "h-full flex flex-col",
              variant === "default" && "bg-sidebar",
              variant === "floating" && "bg-sidebar",
              variant === "inset" && "bg-muted/30",
              className,
            )}
          >
            {children}
          </nav>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Standard sidebar with ARIA landmark
  // When hover-expanded, we need a wrapper to maintain the collapsed width space
  const sidebarElement = (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed && !isHoverExpanded}
      data-collapsible={collapsible}
      data-side={side}
      data-hover-expanded={isHoverExpanded}
      role="navigation"
      aria-label="Main navigation"
      style={{ width: isHoverExpanded ? width : sidebarWidth }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        sidebarVariants({ variant, side }),
        // Transition classes - respect reduced motion
        !reducedMotion && "transition-all duration-300 ease-in-out",
        reducedMotion && "transition-none",
        collapsible === "offcanvas" && collapsed && !isHoverExpanded && "overflow-hidden opacity-0",
        // Hover expand: show as floating panel over content
        isHoverExpanded && "absolute z-50 shadow-xl top-0 bottom-0",
        isHoverExpanded && side === "left" && "left-0",
        isHoverExpanded && side === "right" && "right-0",
        className,
      )}
    >
      {children}
    </aside>
  );

  // When hover expand is enabled and sidebar is collapsed, wrap in a container
  // that maintains the collapsed width space while allowing the sidebar to float
  if (hoverExpand && collapsed && collapsible === "icon") {
    return (
      <div
        className="relative flex-shrink-0"
        style={{ width: collapsedWidth }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {sidebarElement}
      </div>
    );
  }

  return sidebarElement;
}

// ============================================================================
// SIDEBAR TRIGGER (Mobile Hamburger Menu)
// ============================================================================

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Show on desktop as well */
  showOnDesktop?: boolean;
}

export function SidebarTrigger({
  className,
  showOnDesktop = false,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar, isMobile, openMobile } = useSidebar();

  // Only show on mobile by default
  if (!isMobile && !showOnDesktop) return null;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "p-2 rounded-md hover:bg-muted transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={openMobile ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={openMobile}
      aria-controls="sidebar-content"
      {...props}
    >
      {openMobile ? (
        <IconX className="w-5 h-5" />
      ) : (
        <IconMenu2 className="w-5 h-5" />
      )}
    </button>
  );
}

// ============================================================================
// SIDEBAR HEADER
// ============================================================================

interface SidebarHeaderProps {
  children?: React.ReactNode;
  className?: string;
  /** Show collapse toggle button */
  showToggle?: boolean;
  /** Logo/brand component */
  logo?: React.ReactNode;
  /** Title text */
  title?: string;
  /** Make header sticky */
  sticky?: boolean;
}

export function SidebarHeader({
  children,
  className,
  showToggle = true,
  logo,
  title,
  sticky = false,
}: SidebarHeaderProps) {
  const { collapsed, setCollapsed, collapsible, side, isHoverExpanded } = useSidebar();
  const isExpanded = !collapsed || isHoverExpanded;

  // Don't show toggle if collapsible is none
  const canToggle = collapsible !== "none" && showToggle;

  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "p-4 flex items-center border-b border-sidebar-border bg-sidebar",
        side === "right" ? "flex-row-reverse" : "flex-row",
        !isExpanded ? "justify-center" : "justify-between",
        sticky && "sticky top-0 z-10",
        className,
      )}
    >
      {isExpanded && (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {logo || (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">
                K
              </span>
            </div>
          )}
          {title && (
            <span className="font-semibold text-sidebar-foreground truncate">
              {title}
            </span>
          )}
        </div>
      )}

      {children}

      {canToggle && (
        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "p-2 rounded-md hover:bg-sidebar-accent transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-pressed={!collapsed}
              >
                <IconLayoutSidebar
                  className={cn(
                    "w-5 h-5 text-sidebar-foreground transition-transform",
                    collapsed && !isHoverExpanded && "rotate-180",
                  )}
                />
              </button>
            }
          />
          <TooltipContent side={side === "left" ? "right" : "left"}>
            {collapsed
              ? "Expand sidebar (Ctrl+B)"
              : "Collapse sidebar (Ctrl+B)"}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

// ============================================================================
// SIDEBAR CONTENT - FIXED SCROLL ISSUE
// ============================================================================

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
  /** Show scroll-to-top button when scrolled */
  showScrollTop?: boolean;
}

export function SidebarContent({
  children,
  className,
  showScrollTop = true,
}: SidebarContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const { reducedMotion } = useSidebar();

  // Track scroll position to show/hide scroll-to-top button
  const handleScroll = React.useCallback(() => {
    if (contentRef.current) {
      setShowScrollButton(contentRef.current.scrollTop > 100);
    }
  }, []);

  const scrollToTop = React.useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [reducedMotion]);

  return (
    <div
      ref={contentRef}
      id="sidebar-content"
      data-slot="sidebar-content"
      onScroll={handleScroll}
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 space-y-1",
        "scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent",
        // Custom scrollbar styling for webkit browsers
        "[&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-sidebar-accent",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb:hover]:bg-sidebar-accent-foreground/20",
        className,
      )}
    >
      {children}

      {/* Scroll to Top Button */}
      {showScrollTop && showScrollButton && (
        <div className="sticky bottom-2 flex justify-center pt-2">
          <button
            onClick={scrollToTop}
            className={cn(
              "p-2 rounded-full bg-sidebar-accent hover:bg-sidebar-accent-foreground/20",
              "shadow-md transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "animate-in fade-in-0 zoom-in-95 duration-200",
            )}
            aria-label="Scroll to top"
          >
            <IconArrowUp className="w-4 h-4 text-sidebar-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SIDEBAR SEARCH
// ============================================================================

interface SidebarSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SidebarSearch({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SidebarSearchProps) {
  const { collapsed, side, isHoverExpanded } = useSidebar();
  const [internalValue, setInternalValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isExpanded = !collapsed || isHoverExpanded;

  const searchValue = value ?? internalValue;
  const setSearchValue = onChange ?? setInternalValue;

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              onClick={() => inputRef.current?.focus()}
              className={cn(
                "w-full p-2 rounded-md hover:bg-sidebar-accent transition-colors flex items-center justify-center",
                className,
              )}
              aria-label="Search"
            >
              <IconSearch className="w-5 h-5 text-muted-foreground" />
            </button>
          }
        />
        <TooltipContent side={side === "left" ? "right" : "left"}>
          Search (Ctrl+K)
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div data-slot="sidebar-search" className={cn("px-2 py-2", className)}>
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={cn(
            "w-full h-9 pl-9 pr-3 rounded-md border border-sidebar-border bg-sidebar",
            "text-sm text-sidebar-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "transition-colors",
          )}
          aria-label="Search navigation"
        />
        {searchValue && (
          <button
            onClick={() => setSearchValue("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-sidebar-accent"
            aria-label="Clear search"
          >
            <IconX className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SIDEBAR GROUP
// ============================================================================

interface SidebarGroupProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  /** Action button/icon for the group header */
  action?: React.ReactNode;
}

export function SidebarGroup({
  label,
  children,
  defaultOpen = true,
  className,
  action,
}: SidebarGroupProps) {
  const { collapsed, isHoverExpanded, reducedMotion } = useSidebar();
  const [open, setOpen] = React.useState(defaultOpen);
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const isExpanded = !collapsed || isHoverExpanded;

  React.useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, open]);

  if (!isExpanded) {
    return (
      <div data-slot="sidebar-group" className={cn("space-y-1", className)}>
        {children}
      </div>
    );
  }

  return (
    <div data-slot="sidebar-group" className={cn("space-y-1", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2",
          "text-xs font-medium text-muted-foreground uppercase tracking-wider",
          "hover:text-sidebar-foreground transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded",
        )}
        aria-expanded={open}
      >
        <span>{label}</span>
        <div className="flex items-center gap-1">
          {action}
          <IconChevronDown
            className={cn(
              "w-4 h-4",
              !reducedMotion && "transition-transform duration-200",
              open ? "rotate-0" : "-rotate-90",
            )}
          />
        </div>
      </button>
      <div
        ref={contentRef}
        className={cn(
          "space-y-0.5 overflow-hidden",
          !reducedMotion && "transition-all duration-200",
          open ? "opacity-100" : "opacity-0 h-0",
        )}
        style={{
          maxHeight: open ? (contentHeight ?? 1000) : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// SIDEBAR ITEM BADGE
// ============================================================================

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-current text-muted-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-amber-500 text-white",
      },
      size: {
        default: "px-1.5 min-w-[1.25rem] h-5",
        sm: "px-1 min-w-[1rem] h-4 text-[10px]",
        dot: "w-2.5 h-2.5 p-0", // Dot indicator for collapsed state
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface SidebarBadgeProps extends VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  className?: string;
}

export function SidebarBadge({
  children,
  variant,
  size,
  className,
}: SidebarBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {size !== "dot" && children}
    </span>
  );
}

// ============================================================================
// SIDEBAR ITEM - ENHANCED WITH COLLAPSED BADGES
// ============================================================================

interface SidebarItemProps {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  level?: number;
  /** Badge content (number, text, or custom element) */
  badge?: React.ReactNode;
  /** Badge variant */
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
  /** Keyboard shortcut display */
  shortcut?: string;
  /** Disabled state */
  disabled?: boolean;
  className?: string;
  /** Close mobile sidebar on click */
  closeMobileOnClick?: boolean;
}

export function SidebarItem({
  to,
  icon,
  children,
  level = 0,
  badge,
  badgeVariant = "default",
  shortcut,
  disabled = false,
  className,
  closeMobileOnClick = true,
}: SidebarItemProps) {
  const { collapsed, side, isMobile, setOpenMobile, isHoverExpanded, reducedMotion } = useSidebar();
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to, fuzzy: false });
  const itemRef = React.useRef<HTMLAnchorElement>(null);
  const isExpanded = !collapsed || isHoverExpanded;

  // Auto-scroll active item into view (only on initial mount or route change)
  React.useEffect(() => {
    if (isActive && itemRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        itemRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "nearest",
        });
      });
    }
  }, [isActive, reducedMotion]);

  const handleClick = () => {
    if (isMobile && closeMobileOnClick) {
      setOpenMobile(false);
    }
  };

  const linkContent = (
    <Link
      ref={itemRef}
      to={to}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      aria-disabled={disabled}
      className={cn(
        "flex items-center gap-3 py-2 rounded-lg text-sm",
        !reducedMotion && "transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        level === 0 ? "px-3" : "",
        level > 0 && isExpanded && "pl-3",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent",
        disabled && "opacity-50 pointer-events-none",
        !isExpanded && "justify-center px-2 relative",
        className,
      )}
    >
      {icon && (
        <span className={cn("shrink-0 relative", !isExpanded && "mx-auto")}>
          {icon}
          {/* Badge dot indicator when collapsed */}
          {!isExpanded && badge && (
            <SidebarBadge
              variant={badgeVariant}
              size="dot"
              className="absolute -top-1 -right-1"
            />
          )}
        </span>
      )}
      {isExpanded && (
        <>
          <span className="flex-1 truncate">{children}</span>
          {badge && <SidebarBadge variant={badgeVariant}>{badge}</SidebarBadge>}
          {shortcut && (
            <kbd className="hidden lg:inline-flex h-5 px-1.5 items-center gap-1 rounded border border-sidebar-border bg-sidebar-accent text-[10px] font-medium text-muted-foreground">
              {shortcut}
            </kbd>
          )}
        </>
      )}
    </Link>
  );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger render={linkContent} />
        <TooltipContent
          side={side === "left" ? "right" : "left"}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{children}</span>
            {badge && (
              <SidebarBadge variant={badgeVariant} size="sm">
                {badge}
              </SidebarBadge>
            )}
          </div>
          {shortcut && (
            <span className="text-xs text-muted-foreground block mt-0.5">
              {shortcut}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

// ============================================================================
// SIDEBAR MENU (New - shadcn-style)
// ============================================================================

interface SidebarMenuProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarMenu({ children, className }: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      role="menu"
      className={cn("flex flex-col gap-0.5", className)}
    >
      {children}
    </ul>
  );
}

// ============================================================================
// SIDEBAR MENU ITEM
// ============================================================================

interface SidebarMenuItemProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarMenuItem({ children, className }: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      role="menuitem"
      className={cn("relative", className)}
    >
      {children}
    </li>
  );
}

// ============================================================================
// SIDEBAR MENU BUTTON (for non-link items) - ENHANCED WITH COLLAPSED BADGES
// ============================================================================

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isActive?: boolean;
  badge?: React.ReactNode;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
}

export function SidebarMenuButton({
  children,
  icon,
  isActive,
  badge,
  badgeVariant = "default",
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed, side, isHoverExpanded, reducedMotion } = useSidebar();
  const isExpanded = !collapsed || isHoverExpanded;

  const buttonContent = (
    <button
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
        !reducedMotion && "transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent",
        !isExpanded && "justify-center px-2",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className={cn("shrink-0 relative", !isExpanded && "mx-auto")}>
          {icon}
          {/* Badge dot indicator when collapsed */}
          {!isExpanded && badge && (
            <SidebarBadge
              variant={badgeVariant}
              size="dot"
              className="absolute -top-1 -right-1"
            />
          )}
        </span>
      )}
      {isExpanded && (
        <>
          <span className="flex-1 text-left truncate">{children}</span>
          {badge && <SidebarBadge variant={badgeVariant}>{badge}</SidebarBadge>}
        </>
      )}
    </button>
  );

  if (!isExpanded && children) {
    return (
      <Tooltip>
        <TooltipTrigger render={buttonContent} />
        <TooltipContent
          side={side === "left" ? "right" : "left"}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            <span>{children}</span>
            {badge && (
              <SidebarBadge variant={badgeVariant} size="sm">
                {badge}
              </SidebarBadge>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}

// ============================================================================
// SIDEBAR MENU SUB (Multi-level nesting)
// ============================================================================

interface SidebarMenuSubProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarMenuSub({ children, className }: SidebarMenuSubProps) {
  const { collapsed, isHoverExpanded, reducedMotion } = useSidebar();
  const isExpanded = !collapsed || isHoverExpanded;

  if (!isExpanded) return null;

  return (
    <ul
      data-slot="sidebar-menu-sub"
      role="menu"
      className={cn(
        "ml-5 pl-2 border-l-2 border-sidebar-border space-y-0.5",
        !reducedMotion && "animate-in slide-in-from-left-2 fade-in-0 duration-200",
        className,
      )}
    >
      {children}
    </ul>
  );
}

// ============================================================================
// SIDEBAR ITEM GROUP (Tree-view style) - ENHANCED WITH COLLAPSED BADGES
// ============================================================================

interface SidebarItemGroupProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
  className?: string;
}

export function SidebarItemGroup({
  label,
  icon,
  children,
  defaultOpen = false,
  badge,
  badgeVariant = "default",
  className,
}: SidebarItemGroupProps) {
  const { collapsed, side, isHoverExpanded, reducedMotion } = useSidebar();
  const [open, setOpen] = React.useState(defaultOpen);
  const isExpanded = !collapsed || isHoverExpanded;

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <div className={cn("space-y-0.5", className)}>
              <button
                onClick={() => setOpen(!open)}
                className={cn(
                  "w-full flex items-center justify-center p-2 rounded-lg relative",
                  "text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                )}
                aria-label={label}
              >
                {icon}
                {/* Badge dot indicator when collapsed */}
                {badge && (
                  <SidebarBadge
                    variant={badgeVariant}
                    size="dot"
                    className="absolute top-1 right-1"
                  />
                )}
              </button>
            </div>
          }
        />
        <TooltipContent
          side={side === "left" ? "right" : "left"}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            <span>{label}</span>
            {badge && (
              <SidebarBadge variant={badgeVariant} size="sm">
                {badge}
              </SidebarBadge>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div
      data-slot="sidebar-item-group"
      className={cn("space-y-0.5", className)}
    >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
          "text-sidebar-foreground hover:bg-sidebar-accent",
          !reducedMotion && "transition-all duration-150",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-expanded={open}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className="flex-1 text-left">{label}</span>
        {badge && <SidebarBadge variant={badgeVariant}>{badge}</SidebarBadge>}
        <IconChevronDown
          className={cn(
            "w-4 h-4",
            !reducedMotion && "transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden",
          !reducedMotion && "transition-all duration-200",
          open ? "opacity-100" : "max-h-0 opacity-0",
        )}
        style={{
          maxHeight: open ? "500px" : "0px",
        }}
      >
        <SidebarMenuSub>{children}</SidebarMenuSub>
      </div>
    </div>
  );
}

// ============================================================================
// SIDEBAR DIVIDER
// ============================================================================

interface SidebarDividerProps {
  className?: string;
}

export function SidebarDivider({ className }: SidebarDividerProps) {
  return (
    <div
      data-slot="sidebar-divider"
      role="separator"
      className={cn("my-2 border-t border-sidebar-border", className)}
    />
  );
}

// ============================================================================
// SIDEBAR FOOTER
// ============================================================================

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
  /** Make footer sticky */
  sticky?: boolean;
}

export function SidebarFooter({
  children,
  className,
  sticky = false,
}: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "p-2 border-t border-sidebar-border mt-auto bg-sidebar",
        sticky && "sticky bottom-0 z-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SIDEBAR USER (New - User profile section)
// ============================================================================

interface SidebarUserProps {
  /** User's display name */
  name: string;
  /** User's email or subtitle */
  email?: string;
  /** Avatar URL or element */
  avatar?: string | React.ReactNode;
  /** Dropdown menu items */
  menuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    destructive?: boolean;
  }>;
  className?: string;
}

export function SidebarUser({
  name,
  email,
  avatar,
  menuItems,
  className,
}: SidebarUserProps) {
  const { collapsed, side, isHoverExpanded } = useSidebar();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isExpanded = !collapsed || isHoverExpanded;

  const avatarElement =
    typeof avatar === "string" ? (
      <img
        src={avatar}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
    ) : avatar ? (
      avatar
    ) : (
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-medium text-sm">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={cn(
                "w-full p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
                "flex items-center justify-center",
                className,
              )}
              aria-label={`User menu for ${name}`}
            >
              {avatarElement}
            </button>
          }
        />
        <TooltipContent
          side={side === "left" ? "right" : "left"}
          variant="outline"
        >
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            {email && (
              <span className="text-xs text-muted-foreground">{email}</span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div data-slot="sidebar-user" className={cn("relative", className)}>
      <button
        onClick={() => menuItems && setMenuOpen(!menuOpen)}
        className={cn(
          "w-full flex items-center gap-3 p-2 rounded-lg",
          "hover:bg-sidebar-accent transition-colors text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-haspopup={menuItems ? "menu" : undefined}
        aria-expanded={menuOpen}
      >
        {avatarElement}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {name}
          </p>
          {email && (
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          )}
        </div>
        {menuItems && (
          <IconDots className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && menuItems && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            role="menu"
            className={cn(
              "absolute z-50 w-56 rounded-md border border-sidebar-border bg-sidebar shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-200",
              side === "left" ? "right-0" : "left-0",
              "bottom-full mb-1",
            )}
          >
            <div className="p-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  role="menuitem"
                  onClick={() => {
                    item.onClick?.();
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded text-sm",
                    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    item.destructive
                      ? "text-destructive hover:bg-destructive/10"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// THEME TOGGLE
// ============================================================================

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { collapsed, side, isHoverExpanded } = useSidebar();
  const isExpanded = !collapsed || isHoverExpanded;

  const buttonContent = (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full",
        "text-sidebar-foreground hover:bg-sidebar-accent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !isExpanded && "justify-center px-2",
        className,
      )}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <IconMoon className="w-5 h-5" />
      ) : (
        <IconSun className="w-5 h-5" />
      )}
      {isExpanded && (
        <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      )}
    </button>
  );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger render={buttonContent} />
        <TooltipContent
          side={side === "left" ? "right" : "left"}
          variant="outline"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
}

// ============================================================================
// SIDEBAR SKELETON (Loading state)
// ============================================================================

interface SidebarSkeletonProps {
  /** Number of skeleton items to show */
  items?: number;
  className?: string;
}

export function SidebarSkeleton({
  items = 5,
  className,
}: SidebarSkeletonProps) {
  const { collapsed, isHoverExpanded } = useSidebar();
  const isExpanded = !collapsed || isHoverExpanded;

  // Pre-calculated widths to avoid Math.random() during render
  const widths = [75, 85, 65, 90, 70, 80, 60, 95, 72, 88];

  return (
    <div
      data-slot="sidebar-skeleton"
      className={cn("space-y-2 p-2", className)}
      aria-busy="true"
      aria-label="Loading navigation"
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg",
            !isExpanded && "justify-center",
          )}
        >
          <div className="w-5 h-5 rounded bg-sidebar-accent animate-pulse" />
          {isExpanded && (
            <div
              className="h-4 rounded bg-sidebar-accent animate-pulse"
              style={{ width: `${widths[i % widths.length]}%` }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  sidebarVariants,
  badgeVariants,
  type SidebarVariant,
  type CollapsibleMode,
  type SidebarSide,
  type SidebarProviderProps,
  type SidebarProps,
  type SidebarHeaderProps,
  type SidebarContentProps,
  type SidebarSearchProps,
  type SidebarGroupProps,
  type SidebarItemProps,
  type SidebarItemGroupProps,
  type SidebarMenuProps,
  type SidebarMenuItemProps,
  type SidebarMenuButtonProps,
  type SidebarMenuSubProps,
  type SidebarUserProps,
  type SidebarBadgeProps,
  type SidebarSkeletonProps,
};
