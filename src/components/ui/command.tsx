"use client";

import * as React from "react";
import {
  IconArrowLeft,
  IconCheck,
  IconChevronRight,
  IconAlertCircle,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Command as CmdkCommand } from "cmdk";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
  type DialogPopupProps,
  type DialogPortalProps,
  type DialogRootActions,
  type DialogRootProps,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  omitComponentProps,
  resolveComponentDefaults,
} from "@/lib/component-utils";

const commandVariants = cva(
  "group/command flex min-h-0 min-w-0 w-full flex-col overflow-hidden rounded-lg bg-background text-foreground",
  {
    variants: {
      variant: {
        default: "border border-border",
        minimal: "border-0 shadow-none",
        bordered: "border-2 border-border",
      },
      size: {
        sm: "max-h-64",
        default: "max-h-96",
        lg: "max-h-128",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const commandItemVariants = cva(
  "group/command-item relative flex min-h-11 min-w-0 cursor-default select-none items-center gap-3 rounded-md px-3 py-2 text-sm leading-5 outline-none touch-manipulation sm:min-h-9 motion-safe:transition-colors motion-safe:duration-150 group-data-[navigation=keyboard]/command:transition-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent group-data-[navigation=keyboard]/command:data-[selected=true]:bg-accent group-data-[navigation=keyboard]/command:data-[selected=true]:text-accent-foreground",
        minimal:
          "hover:bg-muted/50 active:bg-muted group-data-[navigation=keyboard]/command:data-[selected=true]:bg-muted group-data-[navigation=keyboard]/command:data-[selected=true]:text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const commandShortcutVariants = cva("ml-auto shrink-0 text-xs tabular-nums", {
  variants: {
    variant: {
      default: "text-muted-foreground",
      subtle: "text-muted-foreground/70",
    },
  },
  defaultVariants: { variant: "default" },
});

interface CommandProps
  extends
    React.ComponentPropsWithoutRef<typeof CmdkCommand>,
    VariantProps<typeof commandVariants> {}

type CommandInputProps = React.ComponentPropsWithoutRef<
  typeof CmdkCommand.Input
>;

type CommandListProps = React.ComponentPropsWithoutRef<typeof CmdkCommand.List>;

type CommandEmptyProps = React.ComponentPropsWithoutRef<
  typeof CmdkCommand.Empty
>;

type CommandGroupProps = React.ComponentPropsWithoutRef<
  typeof CmdkCommand.Group
>;

type CommandSeparatorProps = React.ComponentPropsWithoutRef<
  typeof CmdkCommand.Separator
>;

type CommandLoadingProps = React.ComponentPropsWithoutRef<
  typeof CmdkCommand.Loading
>;

interface CommandItemProps
  extends
    React.ComponentPropsWithoutRef<typeof CmdkCommand.Item>,
    VariantProps<typeof commandItemVariants> {}

interface CommandShortcutProps
  extends
    React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof commandShortcutVariants> {}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      className,
      variant,
      size,
      label = "Command menu",
      onKeyDownCapture,
      onPointerMoveCapture,
      onPointerDownCapture,
      ...props
    },
    ref,
  ) => {
    const [navigation, setNavigation] = React.useState<"pointer" | "keyboard">(
      "pointer",
    );

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (
      event,
    ) => {
      onKeyDownCapture?.(event);

      if (event.defaultPrevented || event.nativeEvent.isComposing) return;

      const navigationKey = [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Enter",
      ].includes(event.key);

      const vimKey =
        props.vimBindings !== false &&
        event.ctrlKey &&
        ["j", "k", "n", "p"].includes(event.key.toLowerCase());

      if (navigationKey || vimKey) setNavigation("keyboard");
    };

    const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (
      event,
    ) => {
      onPointerMoveCapture?.(event);

      if (
        !event.defaultPrevented &&
        !props.disablePointerSelection &&
        event.pointerType !== "touch"
      )
        setNavigation("pointer");
    };

    const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (
      event,
    ) => {
      onPointerDownCapture?.(event);

      if (!event.defaultPrevented) setNavigation("pointer");
    };

    return (
      <CmdkCommand
        {...props}
        ref={ref}
        data-slot="command"
        data-navigation={navigation}
        label={label}
        onKeyDownCapture={handleKeyDown}
        onPointerMoveCapture={handlePointerMove}
        onPointerDownCapture={handlePointerDown}
        className={cn(commandVariants({ variant, size }), className)}
      />
    );
  },
);

Command.displayName = "Command";

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div
      data-slot="command-input-wrapper"
      className="m-2 flex min-h-11 shrink-0 items-center gap-3 rounded-md border border-input bg-background px-3 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-150 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring"
      cmdk-input-wrapper=""
    >
      <IconSearch
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <CmdkCommand.Input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="go"
        {...props}
        ref={ref}
        data-slot="command-input"
        className={cn(
          "min-h-11 min-w-0 w-full rounded-[inherit] bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
      />
    </div>
  ),
);

CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, label = "Commands", ...props }, ref) => (
    <CmdkCommand.List
      {...props}
      ref={ref}
      data-slot="command-list"
      label={label}
      className={cn(
        "min-h-0 max-h-72 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain scroll-py-2 p-1",
        className,
      )}
    />
  ),
);

CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <CmdkCommand.Empty
      {...props}
      ref={ref}
      data-slot="command-empty"
      className={cn(
        "px-4 py-8 text-center text-sm leading-6 text-muted-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150",
        className,
      )}
    />
  ),
);

CommandEmpty.displayName = "CommandEmpty";

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <CmdkCommand.Group
      {...props}
      ref={ref}
      data-slot="command-group"
      className={cn(
        "min-w-0 p-1 text-foreground **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
    />
  ),
);

CommandGroup.displayName = "CommandGroup";

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CmdkCommand.Separator
    {...props}
    ref={ref}
    data-slot="command-separator"
    className={cn("my-1 h-px bg-border", className)}
  />
));

CommandSeparator.displayName = "CommandSeparator";

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, variant, ...props }, ref) => (
    <CmdkCommand.Item
      {...props}
      ref={ref}
      data-slot="command-item"
      className={cn(commandItemVariants({ variant }), className)}
    />
  ),
);

CommandItem.displayName = "CommandItem";

function CommandShortcut({
  className,
  variant,
  ...props
}: CommandShortcutProps) {
  return (
    <span
      {...props}
      data-slot="command-shortcut"
      cmdk-shortcut=""
      className={cn(commandShortcutVariants({ variant }), className)}
    />
  );
}

const CommandLoading = React.forwardRef<HTMLDivElement, CommandLoadingProps>(
  (
    {
      className,
      label = "Loading commands",
      children = "Loading commands…",
      ...props
    },
    ref,
  ) => (
    <CmdkCommand.Loading
      {...props}
      ref={ref}
      data-slot="command-loading"
      label={label}
      className={cn(
        "flex items-center gap-3 px-4 py-6 text-sm text-muted-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150",
        className,
      )}
    >
      <CommandBusyIndicator data-slot="command-loading-indicator" />
      {children}
    </CmdkCommand.Loading>
  ),
);

CommandLoading.displayName = "CommandLoading";

function CommandBusyIndicator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const indicator = ref.current;

    if (!indicator) return;
    let onScreen = false;

    const update = () => {
      indicator.style.animationPlayState =
        onScreen && document.visibilityState === "visible"
          ? "running"
          : "paused";
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });

    observer.observe(indicator);
    document.addEventListener("visibilitychange", update);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 rounded-full border-2 border-muted border-t-foreground motion-safe:animate-spin",
        className,
      )}
      style={{ animationPlayState: "paused" }}
    />
  );
}

interface CommandDialogProps extends Omit<DialogRootProps, "children"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  trigger?: React.ReactElement;
  triggerRef?: React.Ref<HTMLButtonElement>;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  contentProps?: Omit<DialogPopupProps, "children" | "className"> & {
    className?: string;
  };
  portalProps?: Omit<DialogPortalProps, "children">;
}

function CommandDialog(input: CommandDialogProps) {
  const {
    title,
    description,
    trigger,
    triggerRef,
    children,
    className,
    showCloseButton,
    contentProps,
    portalProps,
    modal,
    ...props
  } = resolveComponentDefaults(input, COMMAND_DIALOG_DEFAULTS_1);

  const reducedMotion = useReducedMotion();
  const { className: popupClassName, ...popupProps } = contentProps ?? {};

  return renderCommandDialogSectionPart1({
    props,
    modal,
    trigger,
    triggerRef,
    portalProps,
    reducedMotion,
    popupProps,
    showCloseButton,
    className,
    popupClassName,
    title,
    description,
    children,
  });
}

interface CommandActionBase {
  /** Stable and unique across this action tree. Also used as cmdk's item value. */
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  group?: string;
  keywords?: readonly string[];
  /** Display hint; this component does not register per-action shortcuts. */
  shortcut?: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface CommandLeafAction extends CommandActionBase {
  kind?: "action";
  onSelect: (context: KiraCommandActionContext) => void | Promise<void>;
  successMessage?: string;
}

interface CommandPageAction extends CommandActionBase {
  kind: "page";
  actions: readonly KiraCommandAction[];
}

type KiraCommandAction = CommandLeafAction | CommandPageAction;

interface KiraCommandActionContext {
  signal: AbortSignal;
  search: string;
}

type CommandExecution =
  | { status: "idle" }
  | { status: "pending"; action: CommandLeafAction }
  | { status: "error"; action: CommandLeafAction; message: string }
  | { status: "success" | "cancelled"; message: string };

const CommandSessionContext = React.createContext(true);

interface KiraCommandProps extends Omit<CommandProps, "children"> {
  actions: readonly KiraCommandAction[];
  placeholder?: string;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  loading?: boolean;
  loadingLabel?: string;
  loadError?: string;
  onRetryLoad?: () => void;
  emptyMessage?: React.ReactNode;
  onActionComplete?: (action: KiraCommandAction) => void;
  inputProps?: Omit<
    CommandInputProps,
    "value" | "defaultValue" | "onValueChange" | "readOnly" | "placeholder"
  >;
  listProps?: Omit<CommandListProps, "children">;
}

function findCommandAction(
  actions: readonly KiraCommandAction[],
  id: string,
): KiraCommandAction | undefined {
  for (const action of actions) {
    if (action.id === id) return action;

    if (action.kind === "page") {
      const nested = findCommandAction(action.actions, id);

      if (nested) return nested;
    }
  }

  return undefined;
}

function KiraCommand(input0: KiraCommandProps) {
  const state0 = useCommandSetup(input0);
  const state1 = useCommandState2(state0);
  const state2 = useCommandState3(state1);
  const state3 = useCommandState4(state2);
  const state4 = useCommandActions(state3);

  return renderCommand(state4);
}

interface KiraCommandDialogProps extends Omit<
  CommandDialogProps,
  "children" | "triggerRef" | "actionsRef"
> {
  actions: readonly KiraCommandAction[];
  /** Opt-in Cmd/Ctrl+K. Enable on only one active palette in an application. */
  shortcut?: boolean;
  closeOnSelect?: boolean;
  commandProps?: Omit<KiraCommandProps, "actions" | "onActionComplete">;
  onActionComplete?: (action: KiraCommandAction) => void;
}

function KiraCommandDialog(input0: KiraCommandDialogProps) {
  const state0 = useCommandDialogSetup(input0);
  const state1 = useCommandDialogActions(state0);

  return renderCommandDialog(state1);
}

export {
  KiraCommand,
  KiraCommandDialog,
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandLoading,
  commandVariants,
  commandItemVariants,
  commandShortcutVariants,
};

export type {
  KiraCommandAction,
  KiraCommandActionContext,
  KiraCommandProps,
  KiraCommandDialogProps,
  CommandProps,
  CommandDialogProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandItemProps,
  CommandShortcutProps,
  CommandSeparatorProps,
  CommandLoadingProps,
};

function useCommandSetup(componentProps: KiraCommandProps) {
  const props = omitComponentProps(
    componentProps,
    USE_COMMAND_SETUP_COMPOSITION_KEYS_1,
  );

  const {
    placeholder,
    defaultSearch,
    loading,
    loadingLabel,
    emptyMessage,
    label,
  } = resolveComponentDefaults(componentProps, USE_COMMAND_SETUP_DEFAULTS_2);

  const resolveKey3 = () => {
    if (loading) {
      return "loading" as const;
    }

    if (componentProps.loadError) {
      return "error" as const;
    }

    return "ready" as const;
  };

  const sessionOpen = React.useContext(CommandSessionContext);

  const id = React.useId();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const activeRequestRef = React.useRef<AbortController | null>(null);

  const [localSearch, setLocalSearch] = React.useState(defaultSearch);

  const [path, setPath] = React.useState<string[]>([]);

  const [execution, setExecution] = React.useState<CommandExecution>({
    status: "idle",
  });

  const query = componentProps.search ?? localSearch;

  const pending = execution.status === "pending";

  React.useEffect(() => {
    if (!sessionOpen) {
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;
    }

    return () => {
      activeRequestRef.current?.abort();
      activeRequestRef.current = null;
    };
  }, [sessionOpen]);

  return {
    ...componentProps,
    props,
    placeholder,
    loading,
    loadingLabel,
    emptyMessage,
    label,
    resolveKey3,
    sessionOpen,
    id,
    inputRef,
    activeRequestRef,
    setLocalSearch,
    path,
    setPath,
    execution,
    setExecution,
    query,
    pending,
  };
}

function useCommandState2(state: ReturnType<typeof useCommandSetup>) {
  const { activeRequestRef } = state;

  const { inputRef } = state;

  const {
    setPath,
    setLocalSearch,
    onSearchChange,
    setExecution,
    onActionComplete,
  } = state;

  let pageActions = state.actions;

  const trail: CommandPageAction[] = [];

  for (const pageId of state.path) {
    const page = pageActions.find((action) => action.id === pageId);

    if (!page || page.kind !== "page") break;
    trail.push(page);
    pageActions = page.actions;
  }

  if (trail.length !== state.path.length) {
    setPath(trail.map((page) => page.id));

    if (state.search === undefined) setLocalSearch("");
  }

  const setQuery = (next: string) => {
    if (state.search === undefined) setLocalSearch(next);
    onSearchChange?.(next);

    if (!state.pending) setExecution({ status: "idle" });
  };

  const cancelAction = () => {
    const request = activeRequestRef.current;

    if (!request) return;
    request.abort();
    activeRequestRef.current = null;
    setExecution({
      status: "cancelled",
      message: "Cancellation requested. Completed work is not undone.",
    });
    inputRef.current?.focus();
  };

  const runAction = async (action: CommandLeafAction) => {
    if (
      commandActionUnavailable({
        action,
        stateSessionOpen: state.sessionOpen,
        stateActiveRequest: activeRequestRef,
        stateLoading: state.loading,
        stateLoadError: state.loadError,
      })
    )
      return;
    const request = new AbortController();
    activeRequestRef.current = request;
    setExecution({ status: "pending", action });

    try {
      await action.onSelect({ signal: request.signal, search: state.query });
    } catch (error) {
      return reportCommandActionError({
        request,
        state,
        setExecution,
        action,
        error,
      });
    }

    if (request.signal.aborted || activeRequestRef.current !== request) return;
    activeRequestRef.current = null;
    setExecution({
      status: "success",
      message: action.successMessage ?? `${action.label} completed.`,
    });
    onActionComplete?.(action);
  };

  return { ...state, pageActions, trail, setQuery, cancelAction, runAction };
}

function useCommandState3(state: ReturnType<typeof useCommandState2>) {
  const { inputRef } = state;

  const { setPath, setQuery, runAction, onKeyDown, cancelAction } = state;

  const selectAction = (action: KiraCommandAction) => {
    if (
      commandSelectionUnavailable({
        action,
        stateSessionOpen: state.sessionOpen,
        statePending: state.pending,
        stateLoading: state.loading,
        stateLoadError: state.loadError,
      })
    )
      return;

    if (action.kind === "page") {
      setPath([...state.trail.map((page) => page.id), action.id]);
      setQuery("");
      inputRef.current?.focus();
    } else {
      void runAction(action);
    }
  };

  const goBack = () => {
    if (state.pending) return;
    setPath(state.trail.slice(0, -1).map((page) => page.id));
    setQuery("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.nativeEvent.isComposing) return;

    const handled = handleCommandNavigationKey({
      event,
      state,
      cancelAction,
      setQuery,
      goBack,
    });

    if (!handled) return;

    event.preventDefault();
    event.stopPropagation();
  };

  return { ...state, selectAction, goBack, handleKeyDown };
}

function handleCommandNavigationKey({
  event,
  state,
  cancelAction,
  setQuery,
  goBack,
}: {
  event: React.KeyboardEvent<HTMLDivElement>;
  state: ReturnType<typeof useCommandState2>;
  cancelAction: () => void;
  setQuery: (query: string) => void;
  goBack: () => void;
}) {
  if (event.key === "Escape") {
    if (state.pending) cancelAction();
    else if (state.query) setQuery("");
    else if (state.trail.length) goBack();
    else return false;

    return true;
  }

  if (
    event.key === "Backspace" &&
    !state.query &&
    state.trail.length &&
    !state.pending
  ) {
    goBack();

    return true;
  }

  return false;
}

function useCommandState4(state: ReturnType<typeof useCommandState3>) {
  const { selectAction } = state;

  // oxlint-disable-next-line eslint/complexity -- Pure compound JSX view: keeping related labels, controls, and conditional styling together makes the markup easier to review than further fragment extraction.
  const buildAction = (action: KiraCommandAction) => {
    const resolveValue1 = () => {
      if (action.kind === "page") {
        return (
          <IconChevronRight
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-muted-foreground rtl:rotate-180",
              hasSupportingText && "mt-0.5",
            )}
          />
        );
      }

      if (action.shortcut) {
        return (
          <CommandShortcut aria-hidden="true">
            <Kbd keys={action.shortcut} size="sm" />
          </CommandShortcut>
        );
      }

      return null;
    };

    const hasSupportingText = Boolean(
      action.description || action.disabledReason,
    );

    const actionId = `${state.id}-${encodeURIComponent(action.id)}`;
    const descriptionId = `${actionId}-description`;
    const reasonId = `${actionId}-reason`;

    return (
      <CommandItem
        key={action.id}
        value={action.id}
        keywords={[action.label, ...(action.keywords ?? [])]}
        disabled={
          state.pending ||
          state.loading ||
          Boolean(state.loadError) ||
          action.disabled ||
          Boolean(action.disabledReason)
        }
        aria-label={action.label}
        aria-describedby={
          [
            action.description && descriptionId,
            action.disabledReason && reasonId,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
        onSelect={() => selectAction(action)}
        className={hasSupportingText ? "items-start py-3" : "items-center"}
      >
        {action.icon != null && (
          <span
            data-slot="command-item-icon"
            aria-hidden="true"
            className={cn(
              "shrink-0 text-muted-foreground [&_svg]:size-4",
              hasSupportingText && "mt-0.5",
            )}
          >
            {action.icon}
          </span>
        )}
        {renderCommandItemContentPart3({ action, descriptionId, reasonId })}
        {resolveValue1()}
      </CommandItem>
    );
  };

  return { ...state, buildAction };
}

function useCommandActions(state: ReturnType<typeof useCommandState4>) {
  const buildGroups = () => {
    const names = state.pageActions
      .map((action) => action.group?.trim() || "Actions")
      .filter((name, index, all) => all.indexOf(name) === index);

    return names.map((name) => (
      <CommandGroup key={name} value={name} heading={name}>
        {state.pageActions
          .filter((action) => (action.group?.trim() || "Actions") === name)
          .map(state.buildAction)}
      </CommandGroup>
    ));
  };

  const retryAction =
    state.execution.status === "error"
      ? findCommandAction(state.actions, state.execution.action.id)
      : undefined;

  const buildStatus = () => {
    const resolveMessage2 = () => {
      if (state.execution.status === "pending") {
        return `Running ${state.execution.action.label}…`;
      }

      if (state.execution.status === "idle") {
        return "Use ↑ ↓ to choose; Enter to run." as const;
      }

      return state.execution.message;
    };

    const message = resolveMessage2();

    return renderCommandFooterPart4({ state, message, retryAction });
  };

  return { ...state, buildGroups, buildStatus };
}

function renderCommand(state: ReturnType<typeof useCommandActions>) {
  const { inputRef } = state;

  const { buildStatus } = state;

  return (
    <Command
      {...state.props}
      label={
        state.trail.length
          ? `${state.label}: ${state.trail[state.trail.length - 1].label}`
          : state.label
      }
      onKeyDown={state.handleKeyDown}
    >
      {state.trail.length > 0 && renderCommandBreadcrumbPart5({ state })}
      <CommandInput
        {...state.inputProps}
        ref={inputRef}
        value={state.query}
        onValueChange={state.setQuery}
        readOnly={state.pending}
        placeholder={state.placeholder}
      />
      {renderRenderCommandSectionPart6({ state })}
      {buildStatus()}
    </Command>
  );
}

type renderCommandDialogSectionPart1Args = {
  props: Omit<
    CommandDialogProps,
    | "title"
    | "description"
    | "trigger"
    | "triggerRef"
    | "children"
    | "className"
    | "showCloseButton"
    | "contentProps"
    | "portalProps"
    | "modal"
  >;
  modal: boolean | "trap-focus";
  trigger: CommandDialogProps["trigger"];
  triggerRef: CommandDialogProps["triggerRef"];
  portalProps: CommandDialogProps["portalProps"];
  reducedMotion: ReturnType<typeof useReducedMotion>;
  popupProps: Omit<
    NonNullable<CommandDialogProps["contentProps"]>,
    "className"
  >;
  showCloseButton: boolean;
  className: CommandDialogProps["className"];
  popupClassName: NonNullable<CommandDialogProps["contentProps"]>["className"];
  title: CommandDialogProps["title"];
  description: CommandDialogProps["description"];
  children: CommandDialogProps["children"];
};

function renderCommandDialogSectionPart1({
  props,
  modal,
  trigger,
  triggerRef,
  portalProps,
  reducedMotion,
  popupProps,
  showCloseButton,
  className,
  popupClassName,
  title,
  description,
  children,
}: renderCommandDialogSectionPart1Args) {
  return (
    <Dialog {...props} modal={modal}>
      {trigger && <DialogTrigger ref={triggerRef} render={trigger} />}
      <DialogPortal {...portalProps}>
        {modal === true && (
          <DialogOverlay
            className={cn(
              "backdrop-blur-none ease-[cubic-bezier(0.23,1,0.32,1)] data-ending-style:duration-150",
              reducedMotion &&
                "transition-none data-starting-style:opacity-100 data-ending-style:opacity-100",
            )}
          />
        )}
        <div
          data-slot="command-dialog-viewport"
          className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center px-4 py-8 sm:pt-24"
        >
          <DialogPopup
            {...popupProps}
            data-slot="command-dialog"
            className={cn(
              dialogContentVariants(),
              "max-h-[calc(100dvh-4rem)] overflow-hidden p-0 transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-starting-style:scale-97 data-starting-style:opacity-0 data-ending-style:scale-97 data-ending-style:opacity-0 data-ending-style:duration-150 motion-reduce:transition-none motion-reduce:data-starting-style:scale-100 motion-reduce:data-starting-style:opacity-100 motion-reduce:data-ending-style:scale-100 motion-reduce:data-ending-style:opacity-100 *:data-[slot=command]:rounded-none *:data-[slot=command]:border-0",
              reducedMotion &&
                "transition-none data-starting-style:scale-100 data-starting-style:opacity-100 data-ending-style:scale-100 data-ending-style:opacity-100",
              showCloseButton &&
                "[&:not(:has([data-slot=command-breadcrumb]))]:**:data-[slot=command-input-wrapper]:pe-12 [&:has([data-slot=command-breadcrumb])]:**:data-[slot=command-breadcrumb]:pe-12",
              className,
              popupClassName,
            )}
          >
            <DialogTitle className="sr-only">{title}</DialogTitle>
            {description != null && (
              <DialogDescription className="sr-only">
                {description}
              </DialogDescription>
            )}
            {children}
            {showCloseButton && (
              <DialogClose
                aria-label="Close commands"
                className="absolute inset-e-3.5 top-3.5 flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring"
              >
                <IconX aria-hidden="true" className="size-4" />
              </DialogClose>
            )}
          </DialogPopup>
        </div>
      </DialogPortal>
    </Dialog>
  );
}

type renderKiraCommandDialogSectionPart2Args = {
  props: Omit<
    KiraCommandDialogProps,
    | "actions"
    | "shortcut"
    | "closeOnSelect"
    | "commandProps"
    | "onActionComplete"
    | "trigger"
    | "open"
    | "defaultOpen"
    | "onOpenChange"
    | "onOpenChangeComplete"
  >;
  isOpen: boolean;
  handleOpenChange: NonNullable<CommandDialogProps["onOpenChange"]>;
  onOpenChangeComplete: KiraCommandDialogProps["onOpenChangeComplete"];
  setSession: React.Dispatch<
    React.SetStateAction<{ mounted: boolean; key: number }>
  >;
  dialogActions: React.RefObject<DialogRootActions | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  buildTrigger: () => React.JSX.Element;
  session: { mounted: boolean; key: number };
  buildCommand: () => React.JSX.Element;
};

function RenderKiraCommandDialogSectionPart2({
  props,
  isOpen,
  handleOpenChange,
  onOpenChangeComplete,
  setSession,
  dialogActions,
  triggerRef,
  buildTrigger,
  session,
  buildCommand,
}: renderKiraCommandDialogSectionPart2Args) {
  return (
    <CommandDialog
      {...props}
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={(next) => {
        onOpenChangeComplete?.(next);

        if (!next && !isOpen)
          setSession((current) => ({ ...current, mounted: false }));
      }}
      actionsRef={dialogActions}
      triggerRef={triggerRef}
      trigger={buildTrigger()}
    >
      {session.mounted && (
        <CommandSessionContext.Provider key={session.key} value={isOpen}>
          {buildCommand()}
        </CommandSessionContext.Provider>
      )}
    </CommandDialog>
  );
}

type renderCommandItemContentPart3Args = {
  action: KiraCommandAction;
  descriptionId: string;
  reasonId: string;
};

function renderCommandItemContentPart3({
  action,
  descriptionId,
  reasonId,
}: renderCommandItemContentPart3Args) {
  return (
    <span
      data-slot="command-item-content"
      className="grid min-w-0 flex-1 gap-1"
    >
      <span
        data-slot="command-item-label"
        className="font-medium leading-5 wrap-anywhere"
      >
        {action.label}
      </span>
      {action.description && (
        <span
          id={descriptionId}
          data-slot="command-item-description"
          className="text-xs leading-5 text-muted-foreground wrap-anywhere"
        >
          {action.description}
        </span>
      )}
      {action.disabledReason && (
        <span
          id={reasonId}
          data-slot="command-disabled-reason"
          className="text-xs leading-5 wrap-anywhere"
        >
          Unavailable: {action.disabledReason}
        </span>
      )}
    </span>
  );
}

type renderCommandFooterPart4Args = {
  state: ReturnType<typeof useCommandState4>;
  message: string;
  retryAction: KiraCommandAction | undefined;
};

function renderCommandFooterPart4({
  state,
  message,
  retryAction,
}: renderCommandFooterPart4Args) {
  const { runAction } = state;

  return (
    <div
      data-slot="command-footer"
      className="flex min-h-12 shrink-0 items-center gap-3 border-t border-border px-3 py-2"
    >
      <output
        data-slot="command-status"
        aria-live="polite"
        aria-atomic="true"
        className="flex min-w-0 flex-1 items-start gap-2 text-xs leading-5 wrap-anywhere"
      >
        {state.pending && (
          <CommandBusyIndicator
            data-slot="command-pending-indicator"
            className="mt-0.5"
          />
        )}
        {state.execution.status === "success" && (
          <IconCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-success"
          />
        )}
        {state.execution.status === "error" && (
          <IconAlertCircle
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-destructive"
          />
        )}
        <span
          key={state.execution.status}
          className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150"
        >
          {message}
        </span>
      </output>
      {state.pending && (
        <Button size="sm" variant="ghost" onClick={state.cancelAction}>
          Cancel
        </Button>
      )}
      {state.execution.status === "error" &&
        retryAction &&
        retryAction.kind !== "page" &&
        !retryAction.disabled &&
        !retryAction.disabledReason && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => void runAction(retryAction)}
          >
            Retry
          </Button>
        )}
    </div>
  );
}

type renderCommandBreadcrumbPart5Args = {
  state: ReturnType<typeof useCommandActions>;
};

function renderCommandBreadcrumbPart5({
  state,
}: renderCommandBreadcrumbPart5Args) {
  return (
    <div
      data-slot="command-breadcrumb"
      className="flex min-w-0 shrink-0 items-center gap-2 border-b border-border px-2 py-3"
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={state.goBack}
        disabled={state.pending}
        aria-label={
          state.trail.length > 1
            ? `Back to ${state.trail[state.trail.length - 2].label}`
            : "Back to all commands"
        }
      >
        <IconArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        Back
      </Button>
      <span className="min-w-0 text-sm font-medium wrap-anywhere">
        {state.trail[state.trail.length - 1].label}
      </span>
    </div>
  );
}

type renderRenderCommandSectionPart6Args = {
  state: ReturnType<typeof useCommandActions>;
};

function renderRenderCommandSectionPart6({
  state,
}: renderRenderCommandSectionPart6Args) {
  const { resolveKey3, buildGroups } = state;

  return (
    <CommandList
      {...state.listProps}
      aria-busy={state.loading || state.pending || undefined}
    >
      <div
        key={`${state.trail.map((page) => page.id).join("/")}:${resolveKey3()}`}
        data-slot="command-results"
        className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]"
      >
        {state.loading && (
          <CommandLoading label={state.loadingLabel}>
            {state.loadingLabel}
          </CommandLoading>
        )}
        {state.loadError && (
          <div
            data-slot="command-load-error"
            className="grid gap-3 px-3 py-6 text-sm"
          >
            <output className="text-destructive">{state.loadError}</output>
            {state.onRetryLoad && (
              <Button
                size="sm"
                variant="outline"
                className="w-fit"
                onClick={state.onRetryLoad}
              >
                Retry loading
              </Button>
            )}
          </div>
        )}
        {!state.loading && !state.loadError && (
          <CommandEmpty>{state.emptyMessage}</CommandEmpty>
        )}
        {buildGroups()}
      </div>
    </CommandList>
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const COMMAND_DIALOG_DEFAULTS_1 = {
  title: "Commands",
  description:
    "Search for an action. Use arrow keys to choose and Enter to run.",
  showCloseButton: true,
  modal: true,
} as const;

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const USE_COMMAND_SETUP_DEFAULTS_2 = {
  placeholder: "Search actions…",
  defaultSearch: "",
  loading: false,
  loadingLabel: "Loading commands…",
  emptyMessage: "No matching actions. Try another search.",
  label: "Command menu",
} as const;

// SAFETY: This immutable list names the composition props removed from the native root.
const USE_COMMAND_SETUP_COMPOSITION_KEYS_1 = [
  "actions",
  "placeholder",
  "search",
  "defaultSearch",
  "onSearchChange",
  "loading",
  "loadingLabel",
  "loadError",
  "onRetryLoad",
  "emptyMessage",
  "onActionComplete",
  "inputProps",
  "listProps",
  "label",
  "onKeyDown",
] as const;

function useCommandDialogSetup(inputProps: KiraCommandDialogProps) {
  const resolvedProps = resolveComponentDefaults(inputProps, {
    shortcut: false,
    closeOnSelect: false,
    defaultOpen: false,
  });

  const { shortcut, open, defaultOpen } = resolvedProps;

  // SAFETY: The excluded keys are exactly those removed by the original native-prop rest binding.
  const props = omitComponentProps(resolvedProps, [
    "actions",
    "shortcut",
    "closeOnSelect",
    "commandProps",
    "onActionComplete",
    "trigger",
    "open",
    "defaultOpen",
    "onOpenChange",
    "onOpenChangeComplete",
  ] as const);

  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const dialogActions = React.useRef<DialogRootActions | null>(null);

  const [localOpen, setLocalOpen] = React.useState(defaultOpen);

  const isOpen = open ?? localOpen;

  const [previousOpen, setPreviousOpen] = React.useState(isOpen);

  const [session, setSession] = React.useState({ mounted: isOpen, key: 0 });

  if (isOpen !== previousOpen) {
    setPreviousOpen(isOpen);

    if (isOpen) setSession({ mounted: true, key: session.key + 1 });
  }

  useCommandDialogShortcut(shortcut, isOpen, triggerRef, dialogActions);

  return {
    ...resolvedProps,
    props,
    triggerRef,
    dialogActions,
    setLocalOpen,
    isOpen,
    session,
    setSession,
  };
}

function useCommandDialogShortcut(
  shortcut: boolean,
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  dialogActions: React.RefObject<DialogRootActions | null>,
) {
  React.useEffect(() => {
    if (!shortcut) return;

    const handleShortcut = (event: KeyboardEvent) =>
      handleCommandDialogShortcut(event, isOpen, triggerRef, dialogActions);

    document.addEventListener("keydown", handleShortcut);

    return () => document.removeEventListener("keydown", handleShortcut);
  }, [shortcut, isOpen, triggerRef, dialogActions]);
}

function handleCommandDialogShortcut(
  event: KeyboardEvent,
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  dialogActions: React.RefObject<DialogRootActions | null>,
) {
  if (ignoresCommandShortcut({ event })) return;
  const button = triggerRef.current;

  if (
    !button ||
    button.getClientRects().length === 0 ||
    (!isOpen && button.closest("[inert]"))
  )
    return;

  if (isCommandShortcutTypingTarget(event, isOpen)) return;

  event.preventDefault();

  if (isOpen) dialogActions.current?.close();
  else button.click();
}

function isCommandShortcutTypingTarget(event: KeyboardEvent, isOpen: boolean) {
  return (
    !isOpen &&
    event.target instanceof Element &&
    !!event.target.closest(
      "input, textarea, select, [contenteditable='true'], [contenteditable=''], [role='combobox']",
    )
  );
}

function useCommandDialogActions(
  state: ReturnType<typeof useCommandDialogSetup>,
) {
  const {
    actions,
    shortcut,
    closeOnSelect,
    commandProps,
    onActionComplete,
    trigger,
    open,
    onOpenChange,
    dialogActions,
    setLocalOpen,
  } = state;

  const handleOpenChange: NonNullable<CommandDialogProps["onOpenChange"]> = (
    next,
    details,
  ) => {
    onOpenChange?.(next, details);

    if (details.isCanceled) return;

    if (open === undefined) setLocalOpen(next);
  };

  const buildCommand = () => (
    <KiraCommand
      vimBindings={shortcut ? false : undefined}
      {...commandProps}
      actions={actions}
      onActionComplete={(action) => {
        onActionComplete?.(action);

        if (closeOnSelect) dialogActions.current?.close();
      }}
    />
  );

  const buildTrigger = () =>
    trigger ?? (
      <Button
        variant="outline"
        aria-keyshortcuts={shortcut ? "Control+K Meta+K" : undefined}
      >
        <IconSearch aria-hidden="true" className="size-4" />
        Search commands
        {shortcut && <Kbd keys="mod+k" size="sm" />}
      </Button>
    );

  return { ...state, handleOpenChange, buildCommand, buildTrigger };
}

function renderCommandDialog({
  onOpenChangeComplete,
  props,
  triggerRef,
  dialogActions,
  isOpen,
  session,
  setSession,
  handleOpenChange,
  buildCommand,
  buildTrigger,
}: ReturnType<typeof useCommandDialogActions>) {
  return (
    <RenderKiraCommandDialogSectionPart2
      {...{
        props,
        isOpen,
        handleOpenChange,
        onOpenChangeComplete,
        setSession,
        dialogActions,
        triggerRef,
        buildTrigger,
        session,
        buildCommand,
      }}
    />
  );
}

type reportCommandActionErrorArgs = {
  request: AbortController;
  state: ReturnType<typeof useCommandSetup>;
  setExecution: ReturnType<typeof useCommandSetup>["setExecution"];
  action: CommandLeafAction;
  error: unknown;
};

function reportCommandActionError({
  request,
  state,
  setExecution,
  action,
  error,
}: reportCommandActionErrorArgs) {
  if (request.signal.aborted || state.activeRequestRef.current !== request)
    return;
  state.activeRequestRef.current = null;
  setExecution({
    status: "error",
    action,
    message:
      error instanceof Error && error.message
        ? error.message
        : `${action.label} could not finish. Try again.`,
  });
}

type commandActionUnavailableArgs = {
  action: CommandLeafAction;
  stateSessionOpen: ReturnType<typeof useCommandSetup>["sessionOpen"];
  stateActiveRequest: ReturnType<typeof useCommandSetup>["activeRequestRef"];
  stateLoading: ReturnType<typeof useCommandSetup>["loading"];
  stateLoadError: ReturnType<typeof useCommandSetup>["loadError"];
};

function commandActionUnavailable({
  action,
  stateSessionOpen,
  stateActiveRequest,
  stateLoading,
  stateLoadError,
}: commandActionUnavailableArgs) {
  return (
    !stateSessionOpen ||
    stateActiveRequest.current ||
    stateLoading ||
    stateLoadError ||
    action.disabled ||
    action.disabledReason
  );
}

type commandSelectionUnavailableArgs = {
  action: KiraCommandAction;
  stateSessionOpen: ReturnType<typeof useCommandState2>["sessionOpen"];
  statePending: ReturnType<typeof useCommandState2>["pending"];
  stateLoading: ReturnType<typeof useCommandState2>["loading"];
  stateLoadError: ReturnType<typeof useCommandState2>["loadError"];
};

function commandSelectionUnavailable({
  action,
  stateSessionOpen,
  statePending,
  stateLoading,
  stateLoadError,
}: commandSelectionUnavailableArgs) {
  return (
    !stateSessionOpen ||
    statePending ||
    stateLoading ||
    stateLoadError ||
    action.disabled ||
    action.disabledReason
  );
}

type ignoresCommandShortcutArgs = { event: KeyboardEvent };

function ignoresCommandShortcut({ event }: ignoresCommandShortcutArgs) {
  return (
    event.defaultPrevented ||
    event.isComposing ||
    event.repeat ||
    event.altKey ||
    event.shiftKey ||
    event.key.toLowerCase() !== "k" ||
    (!event.metaKey && !event.ctrlKey)
  );
}
