import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  IconLayoutSidebar,
  IconChevronDown,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";

// Theme context
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

// Sidebar context
interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

// Sidebar Components
export function Sidebar({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
      {!collapsed && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">K</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">
            Kira Kit
          </span>
        </div>
      )}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <IconLayoutSidebar className="w-5 h-5 text-sidebar-foreground" />
      </button>
    </div>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">{children}</div>
  );
}

interface SidebarGroupProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function SidebarGroup({
  label,
  children,
  defaultOpen = true,
}: SidebarGroupProps) {
  const { collapsed } = useSidebar();
  const [open, setOpen] = React.useState(defaultOpen);

  if (collapsed) {
    return <div className="space-y-1">{children}</div>;
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-sidebar-foreground transition-colors"
      >
        <span>{label}</span>
        <IconChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {open && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

interface SidebarItemProps {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SidebarItem({ to, icon, children }: SidebarItemProps) {
  const { collapsed } = useSidebar();
  const routerState = useRouterState();
  const isActive = routerState.location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
      title={collapsed ? String(children) : undefined}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {!collapsed && <span>{children}</span>}
    </Link>
  );
}

export function SidebarDivider() {
  return <div className="my-2 border-t border-sidebar-border" />;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2 border-t border-sidebar-border mt-auto">{children}</div>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { collapsed } = useSidebar();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full",
        "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      {theme === "light" ? (
        <IconMoon className="w-5 h-5" />
      ) : (
        <IconSun className="w-5 h-5" />
      )}
      {!collapsed && (
        <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      )}
    </button>
  );
}
