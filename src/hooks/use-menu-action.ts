import * as React from "react";

/* -------------------------------------------------------------------------- */
/*                          Menu action data contract                         */
/* -------------------------------------------------------------------------- */

export interface MenuActionContext {
  signal: AbortSignal;
}

export interface MenuActionItem {
  type: "action";
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
  disabledReason?: string;
  onSelect: (context: MenuActionContext) => void | Promise<void>;
  /** @default true */
  closeOnSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export interface MenuLinkData {
  type: "link";
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  shortcut?: string;
  target?: string;
  rel?: string;
}

export interface MenuCheckboxData {
  type: "checkbox";
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  disabledReason?: string;
  icon?: React.ReactNode;
}

export interface MenuRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  disabledReason?: string;
}

export interface MenuRadioData {
  type: "radio";
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly MenuRadioOption[];
}

export type MenuSeparatorData = { type: "separator"; id: string };

export type MenuGroupData = {
  type: "group";
  id: string;
  label: string;
  items: readonly MenuItemData[];
};

export type MenuSubmenuData = {
  type: "submenu";
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
  searchable?: boolean;
  items: readonly MenuItemData[];
};

export type MenuItemData =
  | MenuActionItem
  | MenuLinkData
  | MenuCheckboxData
  | MenuRadioData
  | MenuSeparatorData
  | MenuGroupData
  | MenuSubmenuData;

export type MenuActionState = "idle" | "pending" | "success" | "error";

/* -------------------------------------------------------------------------- */
/*                               ID validation                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            Document visibility                             */
/* -------------------------------------------------------------------------- */

function subscribeVisibility(onChange: () => void): () => void {
  document.addEventListener("visibilitychange", onChange);

  return () => document.removeEventListener("visibilitychange", onChange);
}

const getVisibilitySnapshot = () => !document.hidden;

const getVisibilityServerSnapshot = () => true;

function useDocumentVisible(): boolean {
  return React.useSyncExternalStore(
    subscribeVisibility,
    getVisibilitySnapshot,
    getVisibilityServerSnapshot,
  );
}

/* -------------------------------------------------------------------------- */
/*                                  The hook                                  */
/* -------------------------------------------------------------------------- */

export interface UseMenuActionOptions {
  /** Changing this invalidates any in-flight operation (opening session). */
  sessionKey: unknown;
  onSuccess?: (item: MenuActionItem) => void;
  onError?: (cause: unknown, item: MenuActionItem) => void;
}

/** Result envelope handed to the executor after a successful user callback. */
interface FinishFn {
  (nextState: MenuActionState, nextMessage: string, success: boolean): void;
}

/**
 * Invokes the user callback once and funnels sync/async outcomes through
 * `finish`. Promise success: the wrapper closes the menu (dismissal aborts
 * and invalidation runs on close); the success announcement stays mirrored
 * in the stable outer status region. Synchronous success: no spinner.
 * SAFETY: onSelect is typed `void | Promise<void>`; any object return is
 * thenable by contract, so the `.then` probe is a domain shape check.
 */
async function runMenuActionItem(
  item: MenuActionItem,
  signal: AbortSignal,
  finish: FinishFn,
): Promise<void> {
  const result = item.onSelect({ signal });

  if (result != null) await result;

  finish("success", item.successMessage ?? `${item.label} completed.`, true);
}

export interface UseMenuActionResult {
  state: MenuActionState;
  activeId: string | null;
  message: string;
  /** Pending AND document visible: gates the spinner animation only. */
  animatePending: boolean;
  run: (item: MenuActionItem) => Promise<void>;
  reset: () => void;
}

/**
 * One bounded async action model for dropdown and menubar.
 *
 * - Single-flight: a ref lock prevents duplicate activation.
 * - Abortable: each invocation gets an AbortController; closing, switching
 *   trigger/payload, or changing session aborts the signal. Callbacks that
 *   ignore the signal may still finish externally — late results never
 *   update or close a newer session (generation guard).
 * - `animatePending` freezes while the document is hidden (looping spinner
 *   pauses; static glyph + label remain).
 */
export function useMenuAction({
  sessionKey,
  onSuccess,
  onError,
}: UseMenuActionOptions): UseMenuActionResult {
  const [state, setState] = React.useState<MenuActionState>("idle");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");
  const documentVisible = useDocumentVisible();

  const operation = React.useRef<{
    generation: number;
    locked: boolean;
    controller: AbortController | null;
  }>({
    generation: 0,
    locked: false,
    controller: null,
  });

  const [previousSession, setPreviousSession] = React.useState(
    () => sessionKey,
  );

  if (!Object.is(previousSession, sessionKey)) {
    setPreviousSession(() => sessionKey);
    setState("idle");
    setActiveId(null);
    setMessage("");
  }

  const invalidate = React.useCallback(() => {
    const request = operation.current;
    request.generation += 1;
    request.locked = false;
    request.controller?.abort();
    request.controller = null;
    setState("idle");
    setActiveId(null);
    setMessage("");
  }, []);

  // Cleanup only invalidates the operation; it never schedules state on unmount.
  React.useLayoutEffect(() => {
    const request = operation.current;

    return () => {
      request.generation += 1;
      request.locked = false;
      request.controller?.abort();
      request.controller = null;
    };
  }, [sessionKey]);

  const run = React.useCallback(
    async (item: MenuActionItem): Promise<void> =>
      executeMenuAction(
        { operation, setState, setActiveId, setMessage, onSuccess, onError },
        item,
      ),
    [onSuccess, onError],
  );

  const reset = React.useCallback(() => {
    invalidate();
  }, [invalidate]);

  return {
    state,
    activeId,
    message,
    animatePending: state === "pending" && documentVisible,
    run,
    reset,
  };
}

interface ExecuteMenuActionContext {
  operation: React.RefObject<{
    generation: number;
    locked: boolean;
    controller: AbortController | null;
  }>;
  setState: React.Dispatch<React.SetStateAction<MenuActionState>>;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSuccess: ((item: MenuActionItem) => void) | undefined;
  onError: ((cause: unknown, item: MenuActionItem) => void) | undefined;
}

async function executeMenuAction(
  {
    operation,
    setState,
    setActiveId,
    setMessage,
    onSuccess,
    onError,
  }: ExecuteMenuActionContext,
  item: MenuActionItem,
): Promise<void> {
  const request = operation.current;

  if (request.locked || item.disabled) return;

  const generation = ++request.generation;
  request.locked = true;
  const controller = new AbortController();
  request.controller = controller;

  setState("pending");
  setActiveId(item.id);
  setMessage(`Running ${item.label}…`);

  const finish = (
    nextState: MenuActionState,
    nextMessage: string,
    success: boolean,
  ) => {
    // A newer run or an invalidated session owns this state now.
    if (request.generation !== generation) return;
    request.locked = false;
    request.controller = null;
    setState(nextState);
    setActiveId(null);
    setMessage(nextMessage);

    if (success) onSuccess?.(item);
  };

  try {
    await runMenuActionItem(item, controller.signal, finish);
  } catch (error) {
    if (request.generation !== generation) return;
    request.locked = false;
    request.controller = null;
    setState("error");
    setActiveId(item.id);
    setMessage(
      item.errorMessage ?? `Could not complete ${item.label}. Try again.`,
    );
    onError?.(error, item);
  }
}
