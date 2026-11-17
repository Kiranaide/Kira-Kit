import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// LIVE REGION COMPONENT
// ============================================
// A reusable component for screen reader announcements
// following WAI-ARIA live region patterns

interface LiveRegionProps {
  /** The message to announce */
  message?: string;
  /** Politeness level - "polite" waits for silence, "assertive" interrupts */
  politeness?: "polite" | "assertive";
  /** Whether changes are atomic (announce entire region vs just changes) */
  atomic?: boolean;
  /** Relevant changes to announce */
  relevant?: "additions" | "removals" | "text" | "all";
  /** Clear message after announcement (ms). Set to 0 to persist. */
  clearAfter?: number;
  /** Additional CSS class */
  className?: string;
  /** Children to render (alternative to message prop) */
  children?: React.ReactNode;
  /** ID for the live region (useful for aria-describedby) */
  id?: string;
}

function LiveRegion({
  message,
  politeness = "polite",
  atomic = true,
  relevant = "additions",
  clearAfter = 0,
  className,
  children,
  id,
}: LiveRegionProps) {
  const [expiredMessage, setExpiredMessage] = React.useState<string>();
  const [previousMessage, setPreviousMessage] = React.useState(message);

  if (previousMessage !== message) {
    setPreviousMessage(message);
    setExpiredMessage(undefined);
  }

  React.useEffect(() => {
    if (message && clearAfter > 0) {
      const timer = setTimeout(() => {
        setExpiredMessage(message);
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  return (
    <output
      data-slot="live-region"
      id={id}

      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn(
        // Visually hidden but accessible to screen readers
        "sr-only",
        className,
      )}
    >
      {children ?? (expiredMessage === message ? undefined : message)}
    </output>
  );
}

// ============================================
// LIVE REGION PROVIDER & HOOK
// ============================================
// For imperative announcements from anywhere in the app

interface Announcement {
  id: string;
  message: string;
  politeness: "polite" | "assertive";
}

interface LiveRegionContextValue {
  announce: (
    message: string,
    options?: { politeness?: "polite" | "assertive" },
  ) => void;
  announcePolite: (message: string) => void;
  announceAssertive: (message: string) => void;
}

const LiveRegionContext = React.createContext<LiveRegionContextValue | null>(
  null,
);

interface LiveRegionProviderProps {
  children: React.ReactNode;
  /** Duration to show each announcement (ms) */
  announcementDuration?: number;
}

function LiveRegionProvider({
  children,
  announcementDuration = 1000,
}: LiveRegionProviderProps) {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);

  const announce = React.useCallback(
    (message: string, options?: { politeness?: "polite" | "assertive" }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const newAnnouncement: Announcement = {
        id,
        message,
        politeness: options?.politeness ?? "polite",
      };

      setAnnouncements((prev) => [...prev, newAnnouncement]);

      // Remove announcement after duration
      setTimeout(() => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }, announcementDuration);
    },
    [announcementDuration],
  );

  const announcePolite = React.useCallback(
    (message: string) => announce(message, { politeness: "polite" }),
    [announce],
  );

  const announceAssertive = React.useCallback(
    (message: string) => announce(message, { politeness: "assertive" }),
    [announce],
  );

  const contextValue = React.useMemo(
    () => ({ announce, announcePolite, announceAssertive }),
    [announce, announcePolite, announceAssertive],
  );

  return (
    <LiveRegionContext.Provider value={contextValue}>
      {children}
      {/* Polite announcements */}
      <output aria-live="polite" aria-atomic="true" className="block sr-only">
        {announcements
          .filter((a) => a.politeness === "polite")
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </output>
      {/* Assertive announcements */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements
          .filter((a) => a.politeness === "assertive")
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
    </LiveRegionContext.Provider>
  );
}

function useLiveRegion() {
  const context = React.useContext(LiveRegionContext);

  if (!context) {
    throw new Error("useLiveRegion must be used within a LiveRegionProvider");
  }

  return context;
}

// ============================================
// EXPORTS
// ============================================
export { LiveRegion, LiveRegionProvider, useLiveRegion };

export type { LiveRegionProps, LiveRegionContextValue };
