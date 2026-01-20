import * as React from "react"

// ============================================
// USE SPOTLIGHT HOOK
// ============================================
// Global spotlight/command palette state management
// with keyboard shortcut support (Cmd+K / Ctrl+K)

interface SpotlightContextValue {
  /** Whether the spotlight is open */
  open: boolean
  /** Open the spotlight */
  openSpotlight: () => void
  /** Close the spotlight */
  closeSpotlight: () => void
  /** Toggle the spotlight */
  toggleSpotlight: () => void
  /** Set the search query programmatically */
  setQuery: (query: string) => void
  /** Current search query */
  query: string
}

const SpotlightContext = React.createContext<SpotlightContextValue | null>(null)

interface SpotlightProviderProps {
  children: React.ReactNode
  /** Custom keyboard shortcut (default: ['meta', 'k'] or ['ctrl', 'k']) */
  shortcut?: string[]
  /** Disable the global keyboard shortcut */
  disableShortcut?: boolean
}

export function SpotlightProvider({
  children,
  shortcut = ["k"],
  disableShortcut = false,
}: SpotlightProviderProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const openSpotlight = React.useCallback(() => {
    setOpen(true)
  }, [])

  const closeSpotlight = React.useCallback(() => {
    setOpen(false)
    setQuery("")
  }, [])

  const toggleSpotlight = React.useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setQuery("")
      }
      return !prev
    })
  }, [])

  // Global keyboard shortcut handler
  React.useEffect(() => {
    if (disableShortcut) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = shortcut[shortcut.length - 1]?.toLowerCase()
      const requiresMeta = shortcut.includes("meta") || shortcut.includes("cmd")
      const requiresCtrl = shortcut.includes("ctrl")
      const requiresShift = shortcut.includes("shift")
      const requiresAlt = shortcut.includes("alt")

      // Default: Cmd+K on Mac, Ctrl+K on Windows/Linux
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const metaOrCtrl = isMac ? event.metaKey : event.ctrlKey

      const isMatch =
        event.key.toLowerCase() === key &&
        (requiresMeta ? event.metaKey : true) &&
        (requiresCtrl ? event.ctrlKey : true) &&
        (requiresShift ? event.shiftKey : true) &&
        (requiresAlt ? event.altKey : true) &&
        (!requiresMeta && !requiresCtrl ? metaOrCtrl : true)

      if (isMatch) {
        event.preventDefault()
        toggleSpotlight()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [shortcut, disableShortcut, toggleSpotlight])

  const contextValue = React.useMemo(
    () => ({
      open,
      openSpotlight,
      closeSpotlight,
      toggleSpotlight,
      query,
      setQuery,
    }),
    [open, openSpotlight, closeSpotlight, toggleSpotlight, query]
  )

  return (
    <SpotlightContext.Provider value={contextValue}>
      {children}
    </SpotlightContext.Provider>
  )
}

export function useSpotlight() {
  const context = React.useContext(SpotlightContext)
  if (!context) {
    throw new Error("useSpotlight must be used within a SpotlightProvider")
  }
  return context
}

// ============================================
// STANDALONE SPOTLIGHT STATE HOOK
// ============================================
// For use without provider (local state)

interface UseSpotlightStateOptions {
  /** Initial open state */
  defaultOpen?: boolean
  /** Controlled open state */
  open?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Enable global keyboard shortcut */
  enableShortcut?: boolean
  /** Custom keyboard shortcut */
  shortcut?: string[]
}

export function useSpotlightState(options: UseSpotlightStateOptions = {}) {
  const {
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,
    enableShortcut = true,
    shortcut = ["k"],
  } = options

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [query, setQuery] = React.useState("")
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const newValue = typeof value === "function" ? value(open) : value

      if (!isControlled) {
        setUncontrolledOpen(newValue)
      }
      onOpenChange?.(newValue)

      if (!newValue) {
        setQuery("")
        setSelectedIndex(-1)
      }
    },
    [isControlled, open, onOpenChange]
  )

  const openSpotlight = React.useCallback(() => setOpen(true), [setOpen])
  const closeSpotlight = React.useCallback(() => setOpen(false), [setOpen])
  const toggleSpotlight = React.useCallback(
    () => setOpen((prev) => !prev),
    [setOpen]
  )

  // Keyboard shortcut
  React.useEffect(() => {
    if (!enableShortcut) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = shortcut[shortcut.length - 1]?.toLowerCase()
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const metaOrCtrl = isMac ? event.metaKey : event.ctrlKey

      if (event.key.toLowerCase() === key && metaOrCtrl) {
        event.preventDefault()
        toggleSpotlight()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [enableShortcut, shortcut, toggleSpotlight])

  // Reset selected index when query changes
  React.useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  return {
    open,
    setOpen,
    openSpotlight,
    closeSpotlight,
    toggleSpotlight,
    query,
    setQuery,
    selectedIndex,
    setSelectedIndex,
  }
}

export { SpotlightContext }
export type { SpotlightContextValue, SpotlightProviderProps, UseSpotlightStateOptions }
