/* oxlint-disable react/only-export-components -- public compound component and variant exports */
"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  IconInbox,
  IconFileOff,
  IconSearch,
  IconAlertCircle,
  IconCheck,
  IconCloudOff,
  IconLock,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { isStringProp } from "@/lib/component-utils";

const emptyVariants = cva("group/empty flex min-w-0 w-full gap-4 rounded-lg", {
  variants: {
    size: { sm: "p-4", default: "p-8", lg: "px-8 py-12" },
    layout: {
      center: "flex-col items-center justify-center text-center",
      inline: "flex-col items-start text-start sm:flex-row sm:items-center",
    },
    variant: {
      default: "",
      outline: "border border-dashed border-border",
      muted: "bg-muted/50",
    },
  },
  defaultVariants: { size: "default", layout: "center", variant: "default" },
});

const emptyMediaVariants = cva(
  "flex shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-full",
  {
    variants: {
      variant: {
        default:
          "size-12 group-data-[size=sm]/empty:size-10 group-data-[size=lg]/empty:size-16",
        icon: "size-10 rounded-lg bg-muted p-2",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const emptyIcons = {
  inbox: IconInbox,
  file: IconFileOff,
  search: IconSearch,
  alert: IconAlertCircle,
};

type EmptyPartProps = useRender.ComponentProps<"div">;

type EmptyTitleProps = useRender.ComponentProps<"h3">;

type EmptyDescriptionProps = useRender.ComponentProps<"p">;

interface EmptyMediaProps
  extends EmptyPartProps, VariantProps<typeof emptyMediaVariants> {}

interface EmptyProps
  extends Omit<EmptyPartProps, "title">, VariantProps<typeof emptyVariants> {
  icon?: keyof typeof emptyIcons | React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

function EmptyHeader({ render, ref, className, ...props }: EmptyPartProps) {
  // SAFETY: the div props are native attributes plus the data-slot CSS hook.
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "data-slot": "empty-header",
        className: cn(
          "flex min-w-0 flex-col gap-2 group-data-[layout=center]/empty:items-center",
          className,
        ),
      } as React.ComponentPropsWithRef<"div">,
      props,
    ),
  });
}

function EmptyMedia({
  render,
  ref,
  className,
  variant,
  ...props
}: EmptyMediaProps) {
  // SAFETY: the div props are native attributes plus the data-slot CSS hook.
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "data-slot": "empty-media",
        className: cn(emptyMediaVariants({ variant }), className),
      } as React.ComponentPropsWithRef<"div">,
      props,
    ),
  });
}

function EmptyTitle({ render, ref, className, ...props }: EmptyTitleProps) {
  // SAFETY: the heading props are native attributes plus the data-slot CSS hook.
  return useRender({
    render,
    ref,
    defaultTagName: "h3",
    props: mergeProps<"h3">(
      {
        "data-slot": "empty-title",
        className: cn(
          "max-w-full font-medium text-base text-foreground [overflow-wrap:anywhere] group-data-[size=sm]/empty:text-sm group-data-[size=lg]/empty:text-lg",
          className,
        ),
      } as React.ComponentPropsWithRef<"h3">,
      props,
    ),
  });
}

function EmptyDescription({
  render,
  ref,
  className,
  ...props
}: EmptyDescriptionProps) {
  // SAFETY: the paragraph props are native attributes plus the data-slot CSS hook.
  return useRender({
    render,
    ref,
    defaultTagName: "p",
    props: mergeProps<"p">(
      {
        "data-slot": "empty-description",
        className: cn(
          "max-w-sm text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere] group-data-[size=sm]/empty:text-xs",
          className,
        ),
      } as React.ComponentPropsWithRef<"p">,
      props,
    ),
  });
}

function EmptyContent({ render, ref, className, ...props }: EmptyPartProps) {
  // SAFETY: the div props are native attributes plus the data-slot CSS hook.
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "data-slot": "empty-content",
        className: cn(
          "flex min-w-0 max-w-full flex-wrap items-center gap-2 group-data-[layout=center]/empty:justify-center [&>button]:max-w-full [&>button]:whitespace-normal",
          className,
        ),
      } as React.ComponentPropsWithRef<"div">,
      props,
    ),
  });
}

function Empty({
  render,
  ref,
  className,
  size: sizeInput,
  layout: layoutInput,
  variant,
  icon: iconInput,
  title: titleInput,
  description,
  action,
  children,
  ...props
}: EmptyProps) {
  const { size, layout, icon, title } = useEmptyDefaults({
    size: sizeInput,
    layout: layoutInput,
    icon: iconInput,
    title: titleInput,
  });

  // SAFETY: Object.hasOwn verifies the preset name before indexing the icon map.
  const { shorthand } = createEmptyContent({
    icon,
    title,
    description,
    action,
  });

  // SAFETY: the root props are native div attributes plus data-slot/size/layout hooks.
  return useRender({
    render,
    ref,
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "data-slot": "empty",
        "data-size": size,
        "data-layout": layout,
        className: cn(emptyVariants({ size, layout, variant }), className),
        children: children ?? shorthand,
      } as React.ComponentPropsWithRef<"div">,
      props,
    ),
  });
}

function EmptyInbox(props: Omit<EmptyProps, "icon">) {
  return <Empty icon="inbox" title="No messages" {...props} />;
}

function EmptySearch(props: Omit<EmptyProps, "icon">) {
  return <Empty icon="search" title="No results found" {...props} />;
}

function EmptyFile(props: Omit<EmptyProps, "icon">) {
  return <Empty icon="file" title="No files" {...props} />;
}

type KiraEmptyState =
  | "first-use"
  | "no-data"
  | "no-results"
  | "error"
  | "offline"
  | "forbidden"
  | "complete"
  | "loading";

interface KiraEmptyAction {
  label: string;
  onClick: (context: { signal: AbortSignal }) => void | Promise<void>;
  pendingLabel?: string;
  successMessage?: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface KiraEmptyProps extends Omit<EmptyProps, "action" | "children"> {
  state?: KiraEmptyState;
  query?: string;
  primaryAction?: KiraEmptyAction;
  secondaryAction?: KiraEmptyAction;
  children?: React.ReactNode;
}

const emptyStateDefaults: Record<
  KiraEmptyState,
  { title: string; description: string; icon: React.ReactNode }
> = {
  "first-use": {
    title: "Start your first project",
    description: "Create a project or import existing work to get started.",
    icon: "inbox",
  },
  "no-data": {
    title: "No data yet",
    description: "There are no items to display right now.",
    icon: "inbox",
  },
  "no-results": {
    title: "No matching results",
    description: "Try another phrase or clear your filters.",
    icon: "search",
  },
  error: {
    title: "Couldn't load this content",
    description: "Try again. Your existing work is safe.",
    icon: "alert",
  },
  offline: {
    title: "You're offline",
    description: "Check your connection, then try again.",
    icon: <IconCloudOff strokeWidth={1.5} />,
  },
  forbidden: {
    title: "Access is required",
    description: "Ask a workspace owner for permission to view this content.",
    icon: <IconLock strokeWidth={1.5} />,
  },
  complete: {
    title: "You're all caught up",
    description:
      "Everything here is complete. New work will appear when it arrives.",
    icon: <IconCheck strokeWidth={1.5} />,
  },
  loading: {
    title: "Loading your workspace",
    description: "Your content will appear here when it's ready.",
    icon: <Spinner aria-hidden="true" />,
  },
};

function KiraEmpty(arg0: KiraEmptyProps) {
  const model = useKiraEmptyModel(arg0);

  return <KiraEmptyView {...model} />;
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyInbox,
  EmptySearch,
  EmptyFile,
  KiraEmpty,
  emptyVariants,
  emptyMediaVariants,
};

export type {
  EmptyProps,
  EmptyPartProps,
  EmptyMediaProps,
  EmptyTitleProps,
  EmptyDescriptionProps,
  KiraEmptyState,
  KiraEmptyAction,
  KiraEmptyProps,
};

// oxlint-disable-next-line eslint/complexity -- Pure JSX presentation keeps these related slots and accessibility attributes together.
function KiraEmptyDisabledReasonView({
  kind,
  current,
  action,
  state,
  run,
}: {
  kind: "primary" | "secondary";
  current:
    | {
        key: string;
        active: "primary" | "secondary" | null;
        status: "idle" | "pending" | "success" | "error";
        message: string;
      }
    | { key: string; active: null; status: string; message: string };
  action: KiraEmptyAction;
  state: KiraEmptyState;
  run: (
    action: KiraEmptyAction,
    kind: "primary" | "secondary",
  ) => Promise<void>;
}) {
  return (
    <div
      data-slot={`kira-empty-${kind}-action`}
      className="flex min-w-0 max-w-full flex-col gap-1"
    >
      <Button
        variant={kind === "primary" ? "default" : "outline"}
        aria-busy={current.status === "pending" && current.active === kind}
        disabled={
          action.disabled || state === "loading" || current.status === "pending"
        }
        onClick={() => {
          void run(action, kind);
        }}
        className="max-w-full whitespace-normal [overflow-wrap:anywhere]"
      >
        {current.status === "pending" && current.active === kind && (
          <Spinner size="sm" aria-hidden="true" />
        )}
        {current.status === "pending" && current.active === kind
          ? (action.pendingLabel ?? "Working…")
          : action.label}
      </Button>
      {action.disabledReason && (
        <span
          data-slot="kira-empty-disabled-reason"
          className="text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]"
        >
          {action.disabledReason}
        </span>
      )}
    </div>
  );
}

function KiraEmptyStatusView({
  primaryAction,
  secondaryAction,
  buildAction,
  current,
  children,
}: {
  primaryAction: KiraEmptyAction | undefined;
  secondaryAction: KiraEmptyAction | undefined;
  buildAction: (
    action: KiraEmptyAction | undefined,
    kind: "primary" | "secondary",
  ) => React.JSX.Element | undefined;
  current:
    | {
        key: string;
        active: "primary" | "secondary" | null;
        status: "idle" | "pending" | "success" | "error";
        message: string;
      }
    | { key: string; active: null; status: string; message: string };
  children: React.ReactNode;
}) {
  return (
    <>
      {(primaryAction || secondaryAction) && (
        <EmptyContent>
          {buildAction(primaryAction, "primary")}
          {buildAction(secondaryAction, "secondary")}
        </EmptyContent>
      )}
      <p
        data-slot="kira-empty-status"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This live status container preserves the surrounding custom layout.
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-6 max-w-sm text-sm [overflow-wrap:anywhere]",
          current.status === "error"
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {current.message}
      </p>
      {children}
    </>
  );
}

function useKiraEmptyModel({
  state = "first-use",
  query,
  primaryAction,
  secondaryAction,
  icon,
  title,
  description,
  children,
  ...props
}: KiraEmptyProps) {
  const defaults = emptyStateDefaults[state];

  const operationKey = JSON.stringify([
    state,
    primaryAction?.label,
    secondaryAction?.label,
  ]);

  const { current, run } = useEmptyActionOperation(state, operationKey);

  const buildAction = (
    action: KiraEmptyAction | undefined,
    kind: "primary" | "secondary",
  ) =>
    action && (
      <KiraEmptyDisabledReasonView
        kind={kind}
        current={current}
        action={action}
        state={state}
        run={run}
      />
    );

  const buildContent = () => (
    <KiraEmptyStatusView
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      buildAction={buildAction}
      current={current}
    >
      {children}
    </KiraEmptyStatusView>
  );

  return {
    props,
    state,
    current,
    icon,
    defaults,
    title,
    description,
    query,
    buildContent,
  };
}

type EmptyActionKind = "primary" | "secondary";

type EmptyActionOperation = {
  key: string;
  message: string;
} & (
  | { status: "idle" | "success" | "error"; active: null }
  | { status: "pending"; active: EmptyActionKind }
);

function idleEmptyAction(key: string): EmptyActionOperation {
  return { key, active: null, status: "idle", message: "" };
}

async function settleEmptyAction(
  action: KiraEmptyAction,
  signal: AbortSignal,
): Promise<{
  status: "success" | "error";
  message: string;
}> {
  try {
    await action.onClick({ signal });

    return { status: "success", message: action.successMessage ?? "Done." };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "The action failed. Try again.",
    };
  }
}

function useEmptyActionOperation(state: KiraEmptyState, operationKey: string) {
  const [operation, setOperation] = React.useState<EmptyActionOperation>(() =>
    idleEmptyAction(operationKey),
  );

  const [previousOperationKey, setPreviousOperationKey] =
    React.useState(operationKey);

  if (previousOperationKey !== operationKey) {
    setPreviousOperationKey(operationKey);
    setOperation(idleEmptyAction(operationKey));
  }

  const requestRef = React.useRef<AbortController | null>(null);

  const current =
    operation.key === operationKey ? operation : idleEmptyAction(operationKey);

  React.useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    [operationKey],
  );

  const run = async (action: KiraEmptyAction, kind: EmptyActionKind) => {
    if (action.disabled || state === "loading" || requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    setOperation({
      key: operationKey,
      active: kind,
      status: "pending",
      message: action.pendingLabel ?? "Working…",
    });

    try {
      const result = await settleEmptyAction(action, controller.signal);

      if (!controller.signal.aborted)
        setOperation({ ...result, key: operationKey, active: null });
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  };

  return { current, run };
}

function KiraEmptyView({
  props,
  state,
  current,
  icon,
  defaults,
  title,
  description,
  query,
  buildContent,
}: ReturnType<typeof useKiraEmptyModel>) {
  return (
    <Empty
      {...props}
      data-slot="kira-empty"
      data-state={state}
      aria-busy={state === "loading" || current.status === "pending"}
      icon={icon === undefined ? defaults.icon : icon}
      title={title ?? defaults.title}
      description={
        description ??
        (state === "no-results" && query ? (
          <>
            No results for “{query}”. Try another phrase or clear your filters.
          </>
        ) : (
          defaults.description
        ))
      }
      action={buildContent()}
    />
  );
}

function useEmptyDefaults({
  size: sizeInput,
  layout: layoutInput,
  icon: iconInput,
  title: titleInput,
}: {
  size?: EmptyProps["size"];
  layout?: EmptyProps["layout"];
  icon?: EmptyProps["icon"];
  title?: EmptyProps["title"];
}) {
  return React.useMemo(() => {
    const {
      size = "default",
      layout = "center",
      icon = "inbox",
      title = "No data",
    } = {
      size: sizeInput,
      layout: layoutInput,
      icon: iconInput,
      title: titleInput,
    };

    return { size, layout, icon, title };
  }, [sizeInput, layoutInput, iconInput, titleInput]);
}

function createEmptyContent({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  description: EmptyProps["description"];
  action: EmptyProps["action"];
}) {
  // SAFETY: Object.hasOwn verifies a preset name before indexing the icon map.
  const Icon =
    isStringProp(icon) && Object.hasOwn(emptyIcons, icon)
      ? emptyIcons[icon as keyof typeof emptyIcons]
      : null;

  const media =
    icon != null && icon !== false ? (
      <EmptyMedia aria-hidden="true">
        {Icon ? <Icon strokeWidth={1.5} /> : icon}
      </EmptyMedia>
    ) : null;

  const shorthand = (
    <>
      {media}
      <EmptyHeader>
        {title != null && title !== "" && <EmptyTitle>{title}</EmptyTitle>}
        {description != null && (
          <EmptyDescription>{description}</EmptyDescription>
        )}
        {action != null && <EmptyContent>{action}</EmptyContent>}
      </EmptyHeader>
    </>
  );

  return { shorthand } satisfies { shorthand: typeof shorthand };
}
