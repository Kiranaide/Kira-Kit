/* oxlint-disable react/only-export-components -- public compound API and variants */
"use client";

import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import {
  IconCheck,
  IconCopy,
  IconPlayerPause,
  IconPlayerPlay,
  IconArrowDown,
} from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "cn";
import {
  formatCodeSource,
  loadCodeHighlighter,
  tokenizeCode,
  type CodeToken,
  type CodeTokenCache,
} from "@/lib/code-presentation";
import {
  isFunctionProp,
  isStringProp,
  omitComponentProps,
  resolveComponentDefaults,
} from "@/lib/component-utils";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (isFunctionProp(ref)) return ref(value);

  if (ref) ref.current = value;
}

type MonacoTheme =
  | "vitesse-dark"
  | "vitesse-light"
  | "github-dark"
  | "github-dark-default"
  | "github-light"
  | "nord"
  | "one-dark-pro"
  | "dracula"
  | "tokyo-night";

const codeBlockVariants = cva(
  "relative min-w-0 overflow-hidden rounded-lg border border-border text-foreground",
  {
    variants: { variant: { default: "bg-muted/30", light: "bg-background" } },
    defaultVariants: { variant: "default" },
  },
);

interface CodeBlockProps
  extends
    Omit<useRender.ComponentProps<"div">, "className" | "onChange" | "onCopy">,
    VariantProps<typeof codeBlockVariants> {
  className?: string;
  code?: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: MonacoTheme;
  themeMode?: "light" | "dark" | "system";
  lightTheme?: MonacoTheme;
  darkTheme?: MonacoTheme;
  readOnly?: boolean;
  height?: string | number;
  minimap?: boolean;
  fontSize?: number;
  fontFamily?: string;
  wordWrap?: "on" | "off" | "bounded";
  editable?: boolean;
  onChange?: (value: string) => void;
  editor?: "plain" | "monaco";
  filename?: string;
  showCopy?: boolean;
  copyValue?: string;
  copyFeedback?: "inline" | "toast";
  onCopy?: (value: string) => void | Promise<void>;
  onCopyError?: (error: Error) => void;
  loading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  startLine?: number;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
  copyFormat?: "raw" | "shell";
  streaming?: boolean;
  followOutput?: boolean;
  formatCode?: boolean;
  syntaxHighlight?: boolean;
  showViewTabs?: boolean;
  preview?: React.ReactNode;
}

type MonacoInstance = Awaited<ReturnType<typeof import("modern-monaco").init>>;

type MonacoEditor = ReturnType<MonacoInstance["editor"]["create"]>;

type MonacoModel = ReturnType<MonacoInstance["editor"]["createModel"]>;

type CopyState = "idle" | "copying" | "copied" | "error";

interface CodeBlockContextValue {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers: boolean;
  wordWrap: "on" | "off" | "bounded";
  fontSize: number;
  fontFamily: string;
  copyState: CopyState;
  copyMessage: string;
  copy: () => void;
  copyFeedback: "inline" | "toast";
  disabled: boolean;
  loading: boolean;
  copyAvailable: boolean;
  startLine: number;
  highlightLines: number[];
  addedLines: number[];
  removedLines: number[];
  syntaxHighlight: boolean;
  streaming: boolean;
  updatesPaused: boolean;
  themeMode: "light" | "dark" | "system";
  darkCode: boolean;
  onScroll: (element: HTMLPreElement) => void;
}

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(
  null,
);

function useCodeContext() {
  const value = React.useContext(CodeBlockContext);

  if (!value) throw new Error("Code block parts must be used inside CodeBlock");

  return value;
}

function useClipboard(
  value: string,
  filename: string | undefined,
  feedback: "inline" | "toast",
  adapter?: CodeBlockProps["onCopy"],
  onError?: CodeBlockProps["onCopyError"],
) {
  const [state, setState] = React.useState<CopyState>("idle");
  const [message, setMessage] = React.useState("");
  const [previousValue, setPreviousValue] = React.useState(value);
  const request = React.useRef(0);
  const pending = React.useRef(false);

  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  if (previousValue !== value) {
    setPreviousValue(value);
    setState("idle");
    setMessage("");
  }

  React.useEffect(() => {
    request.current += 1;
    pending.current = false;
    clearTimeout(timeout.current);

    return () => {
      request.current += 1;
      pending.current = false;
      clearTimeout(timeout.current);
    };
  }, [value]);

  const copy = async () => {
    if (pending.current) return;
    pending.current = true;
    const attempt = ++request.current;
    setState("copying");
    setMessage("");

    try {
      if (adapter) await adapter(value);
      else {
        if (!navigator.clipboard?.writeText)
          throw new Error("Select the code and copy it with your keyboard.");
        await navigator.clipboard.writeText(value);
      }

      if (attempt !== request.current) return;
      setState("copied");
      const text = filename ? `Copied ${filename}` : "Code copied";
      setMessage(text);

      if (feedback === "toast") toast.success(text);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        setState("idle");
        setMessage("");
      }, 2000);
    } catch (error) {
      return reportCodeCopyError({
        attempt,
        request,
        error,
        setState,
        setMessage,
        onError,
        feedback,
      });
    } finally {
      if (attempt === request.current) pending.current = false;
    }
  };

  return { state, message, copy };
}

/** Follow the app theme as well as OS changes without setting React state in effects. */
function subscribeTheme(notify: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });
  query.addEventListener("change", notify);

  return () => {
    observer.disconnect();
    query.removeEventListener("change", notify);
  };
}

function getDarkTheme() {
  if (document.documentElement.classList.contains("dark")) return true;

  if (document.documentElement.classList.contains("light")) return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/** Initialize only after a host has measurable space, including a hidden panel reveal. */
function useEditorVisible(host: HTMLElement | null, retain = true) {
  const store = React.useMemo(
    () => createEditorVisibilityStore(host, retain),
    [host, retain],
  );

  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    () => false,
  );
}

function createEditorVisibilityStore(
  host: HTMLElement | null,
  retain: boolean,
) {
  let seen = false;
  let intersects = retain || typeof IntersectionObserver === "undefined";

  return {
    getSnapshot: () => {
      const active = Boolean(
        host &&
        intersects &&
        document.visibilityState !== "hidden" &&
        host.getClientRects().length &&
        host.clientWidth > 0,
      );

      if (active) seen = true;

      return retain ? seen : active;
    },
    subscribe: (notify: () => void) => {
      if (!host) return () => {};

      const resize =
        typeof ResizeObserver === "undefined"
          ? undefined
          : new ResizeObserver(notify);

      const intersection =
        typeof IntersectionObserver === "undefined"
          ? undefined
          : new IntersectionObserver(([entry]) => {
              intersects = entry.isIntersecting;
              notify();
            });

      resize?.observe(host);
      intersection?.observe(host);
      document.addEventListener("visibilitychange", notify);

      return () => {
        resize?.disconnect();
        intersection?.disconnect();
        document.removeEventListener("visibilitychange", notify);
      };
    },
  };
}

interface CodeEditorProps {
  value: string;
  language: string;
  theme: MonacoTheme;
  fontSize: number;
  fontFamily: string;
  wordWrap: "on" | "off" | "bounded";
  showLineNumbers: boolean;
  minimap: boolean;
  onChange: (value: string) => void;
  disabled: boolean;
  filename?: string;
}

function CodeEditor(props: CodeEditorProps) {
  const [host, setHost] = React.useState<HTMLDivElement | null>(null);

  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading",
  );

  const [retry, setRetry] = React.useState(0);
  const visible = useEditorVisible(host);
  const modelRef = React.useRef<MonacoModel | null>(null);
  const editorRef = React.useRef<MonacoEditor | null>(null);
  const monacoRef = React.useRef<MonacoInstance | null>(null);
  const applying = React.useRef(false);
  const id = React.useId();
  const current = React.useEffectEvent(() => props);

  const notifyChange = React.useEffectEvent((value: string) =>
    props.onChange(value),
  );

  React.useEffect(() => {
    return subscribeCodeEditor({
      host,
      visible,
      current,
      id,
      monacoRef,
      modelRef,
      editorRef,
      applying,
      notifyChange,
      setStatus,
    });
  }, [host, visible, id, retry]);
  React.useEffect(() => {
    const model = modelRef.current;

    if (!model || model.getValue() === props.value) return;
    applying.current = true;

    try {
      model.setValue(props.value);
    } finally {
      applying.current = false;
    }
  }, [props.value]);
  React.useEffect(() => {
    const editor = editorRef.current;
    const model = modelRef.current;
    const monaco = monacoRef.current;

    if (!editor || !model || !monaco) return;
    editor.updateOptions({
      fontSize: props.fontSize,
      fontFamily: props.fontFamily,
      wordWrap: props.wordWrap,
      lineNumbers: props.showLineNumbers ? "on" : "off",
      minimap: { enabled: props.minimap },
      readOnly: props.disabled,
    });
    monaco.editor.setModelLanguage(model, props.language);
    monaco.editor.setTheme(props.theme);
  }, [
    props.fontSize,
    props.fontFamily,
    props.wordWrap,
    props.showLineNumbers,
    props.minimap,
    props.disabled,
    props.language,
    props.theme,
  ]);

  return renderCodeEditorView({ setHost, status, setRetry, props });
}

function CodeBlock(input0: CodeBlockProps) {
  const state0 = useCodeBlockSetup(input0);
  const state1 = useCodeBlockState2(state0);
  const state2 = useCodeBlockState3(state1);
  const state3 = useCodeBlockState4(state2);
  const state4 = useCodeBlockState5(state3);
  const state5 = useCodeBlockState6(state4);
  const state6 = useCodeBlockActions(state5);

  return renderCodeBlock(state6);
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn(
        "flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/50 px-3 py-2",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="code-block-title"
      className={cn(
        "min-w-0 flex-1 font-mono text-xs wrap-anywhere",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  );
}

interface CodeBlockCopyButtonProps extends React.ComponentProps<typeof Button> {
  label?: string;
}

function CodeBlockCopyButton({
  label = "Copy code",
  className,
  onClick,
  ...props
}: CodeBlockCopyButtonProps) {
  const context = useCodeContext();
  const reducedMotion = useReducedMotion();

  return (
    <Button
      data-slot="code-block-copy-button"
      type="button"
      variant="ghost"
      size="sm"
      aria-label={label}
      aria-busy={context.copyState === "copying" || undefined}
      className={cn(
        "min-h-11 sm:min-h-8",
        reducedMotion && "transition-none",
        className,
      )}
      {...props}
      disabled={
        props.disabled ||
        context.disabled ||
        context.loading ||
        !context.copyAvailable ||
        context.copyState === "copying"
      }
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) context.copy();
      }}
    >
      {context.copyState === "copied" ? (
        <IconCheck className="size-4" aria-hidden="true" />
      ) : (
        <IconCopy className="size-4" aria-hidden="true" />
      )}
      {resolveCodeBlockCopyButtonChoice4({ context })}
    </Button>
  );
}

interface CodeBlockContentProps extends React.ComponentProps<"pre"> {
  showLineNumbers?: boolean;
}

interface CodeLineProps {
  line: string;
  number: number;
  numbered: boolean;
  markers: boolean;
  change?: "added" | "removed";
  highlighted: boolean;
  wrap: boolean;
  tokens?: CodeToken[];
  dark: boolean;
  revealFrom: number;
  generation: number;
}

const CodeLine = React.memo(function CodeLine({
  line,
  number,
  numbered,
  markers,
  change,
  highlighted,
  wrap,
  tokens,
  dark,
  revealFrom,
  generation,
}: CodeLineProps) {
  const renderTokens = (from: number, to: number) => {
    if (!tokens) return line.slice(from, to);
    let offset = 0;

    return tokens.map((token) => {
      const start = offset;
      offset += token.content.length;

      if (offset <= from || start >= to) return null;

      return (
        <span
          data-slot="code-block-token"
          key={start}
          style={{ color: dark ? token.dark : token.light }}
        >
          {token.content.slice(
            Math.max(0, from - start),
            Math.min(token.content.length, to - start),
          )}
        </span>
      );
    });
  };

  return renderCodeBlockLinePart2({
    highlighted,
    change,
    numbered,
    number,
    markers,
    wrap,
    revealFrom,
    renderTokens,
    generation,
    line,
  });
});

function CodeBlockContent(input0: CodeBlockContentProps) {
  const state0 = useCodeContentSetup(input0);
  const state1 = useCodeContentActions(state0);

  return renderCodeContent(state1);
}

function CodeBlockTabs(props: React.ComponentProps<typeof Tabs>) {
  return <Tabs data-slot="code-block-tabs" variant="underline" {...props} />;
}

function CodeBlockTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      data-slot="code-block-tabs-list"
      variant="underline"
      scrollable
      className={cn("max-w-full", className)}
      {...props}
    />
  );
}

function CodeBlockTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      data-slot="code-block-tabs-trigger"
      className={cn("font-mono text-xs", className)}
      {...props}
    />
  );
}

function CodeBlockTabsContent(props: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      data-slot="code-block-tabs-content"
      animation="none"
      keepMounted
      {...props}
    />
  );
}

interface CodeBlockFile {
  value: string;
  filename: string;
  code: string;
  language?: string;
  copyValue?: string;
  highlightLines?: number[];
  addedLines?: number[];
  removedLines?: number[];
}

interface KiraCodeBlockProps extends Omit<CodeBlockProps, "children"> {
  files?: CodeBlockFile[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onFileChange?: (value: string, code: string) => void;
}

function KiraCodeBlock({
  files,
  value,
  defaultValue,
  onValueChange,
  onFileChange,
  onChange,
  className,
  style,
  id,
  ref,
  render,
  ...props
}: KiraCodeBlockProps) {
  const [selected, setSelected] = React.useState(
    defaultValue ?? files?.[0]?.value ?? "",
  );

  const [drafts, setDrafts] = React.useState<
    Record<string, { source: string; value: string }>
  >({});

  if (!files)
    return (
      <CodeBlock
        {...props}
        id={id}
        ref={ref}
        render={render}
        className={className}
        style={style}
        onChange={onChange}
      />
    );

  const active = files.some((file) => file.value === (value ?? selected))
    ? (value ?? selected)
    : (files[0]?.value ?? "");

  const buildFiles = () =>
    files.map((file) => {
      const draft = drafts[file.value];
      const code = draft?.source === file.code ? draft.value : file.code;

      return (
        <CodeBlockTabsContent key={file.value} value={file.value}>
          <CodeBlock
            {...props}
            code={code}
            filename={file.filename}
            language={file.language ?? props.language}
            copyValue={file.copyValue ?? props.copyValue}
            highlightLines={file.highlightLines ?? props.highlightLines}
            addedLines={file.addedLines ?? props.addedLines}
            removedLines={file.removedLines ?? props.removedLines}
            onChange={(next) => {
              setDrafts((previous) => ({
                ...previous,
                [file.value]: { source: file.code, value: next },
              }));
              onFileChange?.(file.value, next);
              onChange?.(next);
            }}
          />
        </CodeBlockTabsContent>
      );
    });

  // oxlint-disable-next-line react/refs -- This JSX builder forwards ref as the CodeBlockTabs ref prop; it never reads ref.current during render.
  return renderCodeBlockWrapper({
    id,
    ref,
    active,
    className,
    style,
    setSelected,
    onValueChange,
    files,
    buildFiles,
  });
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  CodeBlockTabsContent,
  KiraCodeBlock,
  codeBlockVariants,
};

export type {
  CodeBlockProps,
  CodeBlockCopyButtonProps,
  CodeBlockContentProps,
  KiraCodeBlockProps,
  CodeBlockFile,
  MonacoTheme,
};

type resolvebuildBodyChoice1Args = {
  editSource: boolean;
  editor: "plain" | "monaco";
  draft: string;
  language: string;
  resolvedTheme: MonacoTheme;
  safeFontSize: number;
  fontFamily: string;
  wordWrap: "on" | "off" | "bounded";
  showLineNumbers: boolean;
  minimap: boolean;
  update: (value: string) => void;
  disabled: boolean;
  filename: string | undefined;
  viewportRef: React.RefObject<HTMLPreElement | null>;
};

function resolvebuildBodyChoice1({
  editSource,
  editor,
  draft,
  language,
  resolvedTheme,
  safeFontSize,
  fontFamily,
  wordWrap,
  showLineNumbers,
  minimap,
  update,
  disabled,
  filename,
  viewportRef,
}: resolvebuildBodyChoice1Args) {
  if (editSource) {
    if (editor === "monaco") {
      return (
        <CodeEditor
          value={draft}
          language={language}
          theme={resolvedTheme}
          fontSize={safeFontSize}
          fontFamily={fontFamily}
          wordWrap={wordWrap}
          showLineNumbers={showLineNumbers}
          minimap={minimap}
          onChange={update}
          disabled={disabled}
          filename={filename}
        />
      );
    }

    return (
      <textarea
        data-slot="code-block-plain-editor"
        aria-label={filename ? `Edit ${filename}` : "Edit code"}
        value={draft}
        disabled={disabled}
        spellCheck={false}
        onChange={(event) => update(event.target.value)}
        className="block h-full w-full resize-none bg-transparent p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        style={{
          fontSize: safeFontSize,
          fontFamily,
          whiteSpace: wordWrap === "off" ? "pre" : "pre-wrap",
        }}
      />
    );
  }

  return <CodeBlockContent ref={viewportRef} className="h-full" />;
}

type resolvebuildStatusChoice2Args = {
  loading: boolean;
  updatesPaused: boolean;
  streaming: boolean;
  formatMatches: boolean;
  formatted: {
    source: string;
    language: string;
    code: string;
    error: boolean;
  } | null;
  view: string;
  disabledReason: string | undefined;
};

function resolvebuildStatusChoice2({
  loading,
  updatesPaused,
  streaming,
  formatMatches,
  formatted,
  view,
  disabledReason,
}: resolvebuildStatusChoice2Args) {
  if (loading) {
    return "Loading code…";
  }

  if (updatesPaused) {
    return "Updates paused. Resume to see the latest code.";
  }

  if (streaming) {
    return "Receiving code…";
  }

  if (formatMatches && formatted?.error && view === "formatted") {
    return "Could not format this snippet. Source is preserved.";
  }

  return disabledReason ?? "";
}

type resolveCodeBlockChoice3Args = {
  children: React.ReactNode;
  preview: React.ReactNode;
  buildDefault: () => React.JSX.Element;
  previewView: string;
  setPreviewView: React.Dispatch<React.SetStateAction<string>>;
  buildStatus: () => React.JSX.Element;
};

function resolveCodeBlockChoice3({
  children,
  preview,
  buildDefault,
  previewView,
  setPreviewView,
  buildStatus,
}: resolveCodeBlockChoice3Args) {
  if (children === undefined) {
    if (preview === undefined) {
      return buildDefault();
    }

    return (
      <Tabs
        data-slot="code-block-preview-tabs"
        variant="underline"
        showIndicator={false}
        value={previewView}
        onValueChange={(next) => {
          if (isStringProp(next)) setPreviewView(next);
        }}
      >
        <TabsList
          data-slot="code-block-preview-tabs-list"
          aria-label="Example view"
          className="w-full gap-1 bg-muted/20 px-3"
        >
          <TabsTrigger
            value="preview"
            className="min-h-11 py-2 data-[active]:border-foreground data-[active]:text-foreground data-[active]:font-medium transition-[color,border-color] duration-150 sm:min-h-10"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="min-h-11 py-2 data-[active]:border-foreground data-[active]:text-foreground data-[active]:font-medium transition-[color,border-color] duration-150 sm:min-h-10"
          >
            Code
          </TabsTrigger>
        </TabsList>
        <TabsContent
          data-slot="code-block-preview-panel"
          value="preview"
          animation="none"
          keepMounted
          className="mt-0 p-4"
        >
          {preview}
        </TabsContent>
        <TabsContent
          data-slot="code-block-preview-code-panel"
          value="code"
          animation="none"
          keepMounted
          className="mt-0"
        >
          {buildDefault()}
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <>
      {children}
      {buildStatus()}
    </>
  );
}

type resolveCodeBlockCopyButtonChoice4Args = {
  context: ReturnType<typeof useCodeContext>;
};

function resolveCodeBlockCopyButtonChoice4({
  context,
}: resolveCodeBlockCopyButtonChoice4Args) {
  if (context.copyState === "copied") {
    return "Copied";
  }

  if (context.copyState === "copying") {
    return "Copying…";
  }

  return "Copy";
}

type resolvecodeblocktsxChoice5Args = {
  change: renderCodeBlockLinePart2Args["change"];
  highlighted: renderCodeBlockLinePart2Args["highlighted"];
};

function resolvecodeblocktsxChoice5({
  change,
  highlighted,
}: resolvecodeblocktsxChoice5Args) {
  if (change === "removed") {
    return "bg-destructive/10";
  }

  if (change === "added") {
    return "bg-success/10";
  }

  return highlighted && "bg-info/10";
}

type resolvecodeblocktsxChoice6Args = {
  change: renderCodeBlockLinePart2Args["change"];
};

function resolvecodeblocktsxChoice6({
  change,
}: resolvecodeblocktsxChoice6Args) {
  if (change === "removed") {
    return "−";
  }

  if (change === "added") {
    return "+";
  }

  return " ";
}

function useCodeBlockSetup(componentProps: CodeBlockProps) {
  const props = omitComponentProps(
    componentProps,
    USE_CODE_BLOCK_SETUP_COMPOSITION_KEYS_1,
  );

  const resolvedProps = resolveComponentDefaults(
    componentProps,
    USE_CODE_BLOCK_SETUP_DEFAULTS_1,
  );

  const { readOnly, editable } = resolvedProps;

  const [element, setElement] = React.useState<HTMLDivElement | null>(null);

  const visible = useEditorVisible(element, false);

  const [view, setView] = React.useState(
    editable || !readOnly ? "source" : "formatted",
  );

  const [previewView, setPreviewView] = React.useState(
    componentProps.preview === undefined ? "code" : "preview",
  );

  const [formatted, setFormatted] = React.useState<{
    source: string;
    language: string;
    code: string;
    error: boolean;
  } | null>(null);

  return {
    ...componentProps,
    ...resolvedProps,
    props,
    setElement,
    visible,
    view,
    setView,
    previewView,
    setPreviewView,
    formatted,
    setFormatted,
  };
}

function useCodeBlockState2(state: ReturnType<typeof useCodeBlockSetup>) {
  const [draft, setDraft] = React.useState(state.code);

  const [previousCode, setPreviousCode] = React.useState(state.code);

  if (previousCode !== state.code) {
    setPreviousCode(state.code);
    setDraft(state.code);
  }

  const systemDark = React.useSyncExternalStore(
    subscribeTheme,
    getDarkTheme,
    () => false,
  );

  const { resolvedTheme, safeFontSize, editableNow } =
    resolveCodeBlockDisplaySettings(state, systemDark);

  const [streamPaused, setStreamPaused] = React.useState(false);

  const [snapshot, setSnapshot] = React.useState(draft);

  const [following, setFollowing] = React.useState(true);

  const viewportRef = React.useRef<HTMLPreElement | null>(null);

  const updatesPaused = streamPaused && !editableNow;

  const source = updatesPaused ? snapshot : draft;

  // Preserve caller line coordinates and partial streamed buffers verbatim.
  const canFormat = canFormatCodeBlock({
    state,
    editableNow,
    updatesPaused,
    source,
  });

  const formatMatches =
    state.formatted?.source === source &&
    state.formatted.language === state.language;

  const displayed = displayedCodeBlock({
    state,
    canFormat,
    formatMatches,
    source,
  });

  return {
    ...state,
    draft,
    setDraft,
    systemDark,
    resolvedTheme,
    safeFontSize,
    editableNow,
    streamPaused,
    setStreamPaused,
    setSnapshot,
    following,
    setFollowing,
    viewportRef,
    updatesPaused,
    source,
    canFormat,
    formatMatches,
    displayed,
  };
}

function resolveCodeBlockDisplaySettings(
  state: ReturnType<typeof useCodeBlockSetup>,
  systemDark: boolean,
) {
  return {
    resolvedTheme:
      state.theme ??
      (state.themeMode === "dark" ||
      (state.themeMode === "system" && systemDark)
        ? state.darkTheme
        : state.lightTheme),
    safeFontSize: Number.isFinite(state.fontSize)
      ? Math.max(10, Math.min(32, state.fontSize))
      : 14,
    editableNow: state.editable || !state.readOnly,
  };
}

function useCodeBlockState3(state: ReturnType<typeof useCodeBlockState2>) {
  const { setFormatted } = state;

  const editSource =
    state.editableNow && (!state.showViewTabs || state.view === "source");

  React.useEffect(() => {
    if (
      !state.visible ||
      state.previewView !== "code" ||
      state.view !== "formatted" ||
      !state.canFormat ||
      !state.source ||
      state.formatMatches
    )
      return;
    let cancelled = false;
    void formatCodeSource(state.source, state.language)
      .then((code) => {
        if (!cancelled)
          setFormatted({
            source: state.source,
            language: state.language,
            code: code.replace(/\n$/, ""),
            error: false,
          });
      })
      .catch(() => {
        if (!cancelled)
          setFormatted({
            source: state.source,
            language: state.language,
            code: state.source,
            error: true,
          });
      });

    return () => {
      cancelled = true;
    };
  }, [
    state.visible,
    state.previewView,
    state.view,
    state.canFormat,
    state.source,
    state.language,
    state.formatMatches,
    setFormatted,
  ]);

  const firstLine = Number.isFinite(state.startLine)
    ? Math.max(1, Math.floor(state.startLine))
    : 1;

  const cleanCopy = state.displayed
    .split("\n")
    .filter((_, index) => !state.removedLines.includes(firstLine + index))
    .map((line) =>
      state.copyFormat === "shell" && line.startsWith("$ ")
        ? line.slice(2)
        : line,
    )
    .join("\n");

  const clipboard = useClipboard(
    state.copyValue ?? cleanCopy,
    state.filename,
    state.copyFeedback,
    state.onCopy,
    state.onCopyError,
  );

  return { ...state, editSource, firstLine, cleanCopy, clipboard };
}

function useCodeBlockState4(state: ReturnType<typeof useCodeBlockState3>) {
  const { viewportRef } = state;

  const { setDraft, onChange, setStreamPaused, setFollowing } = state;

  React.useEffect(() => {
    const viewport = viewportRef.current;

    if (
      viewport &&
      state.streaming &&
      state.followOutput &&
      state.following &&
      !state.updatesPaused
    )
      viewport.scrollTop = viewport.scrollHeight;
  }, [
    state.displayed,
    state.streaming,
    state.followOutput,
    state.following,
    state.updatesPaused,
    viewportRef,
  ]);

  const update = (value: string) => {
    setDraft(value);
    onChange?.(value);
  };

  const calculatedHeight =
    state.height === "auto"
      ? Math.min(
          480,
          Math.max(
            128,
            state.displayed.split("\n").length *
              Math.ceil(state.safeFontSize * 1.6) +
              32,
          ),
        )
      : state.height;

  const buildBody = () =>
    resolvebuildBodyChoice1({
      editSource: state.editSource,
      editor: state.editor,
      draft: state.draft,
      language: state.language,
      resolvedTheme: state.resolvedTheme,
      safeFontSize: state.safeFontSize,
      fontFamily: state.fontFamily,
      wordWrap: state.wordWrap,
      showLineNumbers: state.showLineNumbers,
      minimap: state.minimap,
      update,
      disabled: state.disabled,
      filename: state.filename,
      viewportRef: viewportRef,
    });

  const jumpToLatest = () => {
    setStreamPaused(false);
    setFollowing(true);
    requestAnimationFrame(() => {
      const viewport = viewportRef.current;

      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    });
  };

  const buildStatus = () => renderCodeBlockStatus(state);

  return { ...state, calculatedHeight, buildBody, jumpToLatest, buildStatus };
}

function renderCodeBlockStatus(state: ReturnType<typeof useCodeBlockState3>) {
  const showStatus = shouldExposeCodeBlockStatus(state);

  return (
    <div
      data-slot="code-block-status"
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- This existing live region preserves its block layout and div ref contract; output introduces form-associated semantics.
      role="status"
      aria-live={state.copyFeedback === "toast" ? "off" : "polite"}
      aria-atomic="true"
      className={cn(
        showStatus
          ? "flex flex-wrap items-center gap-2 border-t border-border px-3 py-2 text-xs text-muted-foreground"
          : "sr-only",
      )}
    >
      {renderCodeBlockStreamIndicator(state)}
      {state.clipboard.message ||
        resolvebuildStatusChoice2({
          loading: state.loading,
          updatesPaused: state.updatesPaused,
          streaming: state.streaming,
          formatMatches: state.formatMatches,
          formatted: state.formatted,
          view: state.view,
          disabledReason: state.disabledReason,
        })}
    </div>
  );
}

function shouldExposeCodeBlockStatus(
  state: ReturnType<typeof useCodeBlockState3>,
) {
  return (
    state.clipboard.state === "error" ||
    state.loading ||
    state.streaming ||
    state.updatesPaused ||
    (state.formatMatches &&
      state.formatted?.error &&
      state.view === "formatted") ||
    state.disabledReason
  );
}

function renderCodeBlockStreamIndicator(
  state: ReturnType<typeof useCodeBlockState3>,
) {
  if (!state.streaming || state.updatesPaused) return null;

  return (
    <span
      data-slot="code-block-stream-indicator"
      aria-hidden="true"
      className="inline-flex size-3 items-center justify-center"
    >
      {/* kira-kit-ignore spacing-scale: non-control indicator dot on the compact ladder */}
      <span className="size-1.5 rounded-full bg-info" />
    </span>
  );
}

function useCodeBlockState5(state: ReturnType<typeof useCodeBlockState4>) {
  const { setSnapshot, setStreamPaused } = state;

  const buildHeader = () => (
    <CodeBlockHeader className="gap-x-4 bg-muted/20">
      <CodeBlockTitle className="basis-full text-muted-foreground sm:basis-32">
        {state.filename ?? state.language}
      </CodeBlockTitle>
      <div
        data-slot="code-block-toolbar-controls"
        className="flex min-w-0 max-w-full flex-wrap items-center gap-2"
      >
        {state.showViewTabs && (
          <TabsList
            data-slot="code-block-view-tabs-list"
            aria-label="Code presentation"
            className="shrink-0 rounded-md border border-border/70 bg-muted/40 p-0.5"
          >
            {/* kira-kit-ignore spacing-scale: code-block tab chrome keeps compact optical metrics */}
            <TabsTrigger
              data-slot="code-block-formatted-tab"
              value="formatted"
              className="min-h-11 px-2.5 py-1 text-xs data-[active]:bg-muted data-[active]:font-medium data-[active]:shadow-none transition-[color,background-color] duration-150 sm:min-h-8"
            >
              Formatted
            </TabsTrigger>
            {/* kira-kit-ignore spacing-scale: code-block tab chrome keeps compact optical metrics */}
            <TabsTrigger
              data-slot="code-block-source-tab"
              value="source"
              className="min-h-11 px-2.5 py-1 text-xs data-[active]:bg-muted data-[active]:font-medium data-[active]:shadow-none transition-[color,background-color] duration-150 sm:min-h-8"
            >
              Source
            </TabsTrigger>
          </TabsList>
        )}
        <CodeBlockActions>
          {!state.editableNow && (state.streaming || state.streamPaused) && (
            <Button
              data-slot="code-block-stream-pause"
              size="sm"
              variant="ghost"
              aria-pressed={state.streamPaused}
              className="min-h-11 sm:min-h-8"
              onClick={() => {
                if (!state.streamPaused) setSnapshot(state.draft);
                setStreamPaused((value) => !value);
              }}
            >
              {state.streamPaused ? (
                <IconPlayerPlay className="size-4" aria-hidden="true" />
              ) : (
                <IconPlayerPause className="size-4" aria-hidden="true" />
              )}
              {state.streamPaused ? "Resume updates" : "Pause updates"}
            </Button>
          )}
          {state.showCopy && <CodeBlockCopyButton />}
        </CodeBlockActions>
      </div>
    </CodeBlockHeader>
  );

  return { ...state, buildHeader };
}

function useCodeBlockState6(state: ReturnType<typeof useCodeBlockState5>) {
  const { setView, buildHeader, buildBody, buildStatus } = state;

  const buildDefault = () => (
    <>
      {state.showViewTabs ? (
        <Tabs
          data-slot="code-block-view-tabs"
          variant="soft"
          showIndicator={false}
          value={state.view}
          onValueChange={(next) => {
            if (isStringProp(next)) setView(next);
          }}
        >
          {buildHeader()}
          {["formatted", "source"].map((mode) => (
            <TabsContent
              data-slot="code-block-view-panel"
              key={mode}
              value={mode}
              animation="none"
              className="mt-0"
            >
              {mode === state.view && (
                <div
                  data-slot="code-block-body"
                  className="relative min-w-0 overflow-auto"
                  style={{ height: state.calculatedHeight }}
                >
                  {buildBody()}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <>
          {buildHeader()}
          <div
            data-slot="code-block-body"
            className="relative min-w-0 overflow-auto"
            style={{ height: state.calculatedHeight }}
          >
            {buildBody()}
          </div>
        </>
      )}
      {buildStatus()}
      {!state.editableNow &&
        state.followOutput &&
        (!state.following || state.streamPaused) && (
          <Button
            data-slot="code-block-follow"
            variant="secondary"
            size="sm"
            onClick={state.jumpToLatest}
            className="m-3 min-h-11 sm:min-h-8"
          >
            <IconArrowDown className="size-4" aria-hidden="true" />
            Show latest code
          </Button>
        )}
    </>
  );

  return { ...state, buildDefault };
}

function useCodeBlockActions(state: ReturnType<typeof useCodeBlockState6>) {
  // SAFETY: Native element props are valid; data attributes and numeric CSS custom properties extend React's closed types.
  const rendered = useRender({
    defaultTagName: "div",
    render: state.render,
    ref: [state.ref ?? null, state.setElement],
    props: mergeProps<"div">(
      {
        "data-slot": "code-block",
        "data-language": state.language,
        "data-readonly": !state.editableNow || undefined,
        "data-loading": state.loading || undefined,
        "data-streaming": state.streaming || undefined,
        "data-paused": state.updatesPaused || undefined,
        "data-disabled": state.disabled || undefined,
        "data-code-theme": state.themeMode,
        "aria-busy":
          state.loading ||
          (state.streaming && !state.updatesPaused) ||
          undefined,
        className: cn(
          codeBlockVariants({ variant: state.variant }),
          state.className,
        ),
        style: state.style,
        children: resolveCodeBlockChoice3({
          children: state.children,
          preview: state.preview,
          buildDefault: state.buildDefault,
          previewView: state.previewView,
          setPreviewView: state.setPreviewView,
          buildStatus: state.buildStatus,
        }),
      } as React.ComponentProps<"div">,
      state.props,
    ),
  });

  return { ...state, rendered };
}

function renderCodeBlock(state: ReturnType<typeof useCodeBlockActions>) {
  const { setFollowing } = state;

  return (
    <CodeBlockContext.Provider
      value={{
        code: state.displayed,
        language: state.language,
        filename: state.filename,
        showLineNumbers: state.showLineNumbers,
        wordWrap: state.wordWrap,
        fontSize: state.safeFontSize,
        fontFamily: state.fontFamily,
        copyState: state.clipboard.state,
        copyMessage: state.clipboard.message,
        copy: () => {
          if (
            !state.loading &&
            !state.disabled &&
            (state.copyValue ?? state.cleanCopy)
          )
            void state.clipboard.copy();
        },
        copyFeedback: state.copyFeedback,
        disabled: state.disabled,
        loading: state.loading,
        copyAvailable: Boolean(state.copyValue ?? state.cleanCopy),
        startLine: state.firstLine,
        highlightLines: state.highlightLines,
        addedLines: state.addedLines,
        removedLines: state.removedLines,
        syntaxHighlight: state.syntaxHighlight,
        streaming: state.streaming,
        updatesPaused: state.updatesPaused,
        themeMode: state.themeMode,
        darkCode:
          state.themeMode === "dark" ||
          (state.themeMode === "system" && state.systemDark),
        onScroll: (element) => {
          if (state.followOutput)
            setFollowing(
              element.scrollHeight - element.scrollTop - element.clientHeight <
                4,
            );
        },
      }}
    >
      {state.rendered}
    </CodeBlockContext.Provider>
  );
}

type renderCodeBlockEditorPart1Args = {
  setHost: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  status: "loading" | "ready" | "error";
  setRetry: React.Dispatch<React.SetStateAction<number>>;
  props: CodeEditorProps;
};

function renderCodeBlockEditorPart1({
  setHost,
  status,
  setRetry,
  props,
}: renderCodeBlockEditorPart1Args) {
  return (
    <div data-slot="code-block-editor" className="relative h-full min-h-32">
      <div
        data-slot="code-block-monaco-host"
        ref={setHost}
        className={cn("h-full w-full", status !== "ready" && "invisible")}
      />
      {status !== "ready" && (
        <div
          data-slot="code-block-editor-fallback"
          className="absolute inset-0 flex min-h-0 flex-col"
        >
          {status === "error" && (
            <div
              data-slot="code-block-editor-error"
              className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-xs"
            >
              <span>
                Advanced editor unavailable. You can keep editing below.
              </span>
              <Button
                size="xs"
                variant="outline"
                onClick={() => setRetry((value) => value + 1)}
              >
                Retry editor
              </Button>
            </div>
          )}
          <textarea
            data-slot="code-block-editor-input"
            aria-label={props.filename ? `Edit ${props.filename}` : "Edit code"}
            spellCheck={false}
            value={props.value}
            disabled={props.disabled}
            onChange={(event) => props.onChange(event.target.value)}
            className="min-h-0 flex-1 resize-none bg-transparent p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            style={{
              fontFamily: props.fontFamily,
              fontSize: props.fontSize,
              whiteSpace: props.wordWrap === "off" ? "pre" : "pre-wrap",
            }}
          />
        </div>
      )}
    </div>
  );
}

type renderCodeBlockLinePart2Args = {
  highlighted: CodeLineProps["highlighted"];
  change: CodeLineProps["change"];
  numbered: CodeLineProps["numbered"];
  number: CodeLineProps["number"];
  markers: CodeLineProps["markers"];
  wrap: CodeLineProps["wrap"];
  revealFrom: CodeLineProps["revealFrom"];
  renderTokens: (
    from: number,
    to: number,
  ) => string | (React.JSX.Element | null)[];
  generation: CodeLineProps["generation"];
  line: CodeLineProps["line"];
};

function renderCodeBlockLinePart2({
  highlighted,
  change,
  numbered,
  number,
  markers,
  wrap,
  revealFrom,
  renderTokens,
  generation,
  line,
}: renderCodeBlockLinePart2Args) {
  return (
    <span
      data-slot="code-block-line"
      data-highlighted={highlighted || undefined}
      data-change={change}
      className={cn(
        "flex min-w-0 min-h-[1.6em]",
        resolvecodeblocktsxChoice5({ change, highlighted }),
      )}
    >
      {numbered && (
        <span
          data-slot="code-block-line-number"
          aria-hidden="true"
          className="me-4 w-8 shrink-0 select-none text-end text-muted-foreground tabular-nums"
        >
          {number}
        </span>
      )}
      {markers && (
        <span
          data-slot="code-block-change-marker"
          aria-hidden="true"
          className="me-2 w-3 shrink-0 select-none"
        >
          {resolvecodeblocktsxChoice6({ change })}
        </span>
      )}
      {change && (
        <span className="sr-only">
          {change === "removed" ? "Removed" : "Added"} line {number}:{" "}
        </span>
      )}
      <span
        data-slot="code-block-line-content"
        className={cn(
          "min-w-0 flex-1",
          wrap ? "whitespace-pre-wrap wrap-anywhere" : "whitespace-pre",
        )}
      >
        {revealFrom >= 0 ? (
          <>
            {renderTokens(0, revealFrom)}
            <span
              key={generation}
              data-slot="code-block-stream-reveal"
              className="motion-safe:animate-in motion-safe:fade-in-0 duration-200"
            >
              {renderTokens(revealFrom, line.length)}
            </span>
          </>
        ) : (
          renderTokens(0, line.length)
        )}
      </span>
      <span
        data-slot="code-block-line-ending"
        aria-hidden="true"
        className="sr-only"
      >
        {"\n"}
      </span>
    </span>
  );
}

type renderCodeBlockCodePart3Args = {
  context: ReturnType<typeof useCodeContext>;
  value: string;
  lines: string[];
  offset: number;
  visible: ReturnType<typeof useEditorVisible>;
  reducedMotion: ReturnType<typeof useReducedMotion>;
  received: { value: string; from: number; generation: number };
  first: number;
  numbered: boolean;
  additions: number[];
  removals: number[];
  highlights: number[];
  colored: CodeToken[][] | undefined;
};

function renderCodeBlockCodePart3({
  context,
  value,
  lines,
  offset,
  visible,
  reducedMotion,
  received,
  first,
  numbered,
  additions,
  removals,
  highlights,
  colored,
}: renderCodeBlockCodePart3Args) {
  return (
    <code
      data-slot="code-block-code"
      data-language={context.language}
      className={cn("block", context.wordWrap === "bounded" && "max-w-[80ch]")}
    >
      {value ? (
        lines.map((line, index) => {
          const start = offset;
          const lineNumber = first + index;
          offset += line.length + 1;

          const reveal = shouldRevealCodeLine({
            context,
            visible,
            reducedMotion,
            received,
            offset,
            index,
            lineCount: lines.length,
          });

          return (
            <CodeLine
              key={lineNumber}
              line={line}
              number={lineNumber}
              numbered={numbered}
              markers={additions.length > 0 || removals.length > 0}
              change={resolvecodeblocktsxChoice7({
                removals,
                first,
                index,
                additions,
              })}
              highlighted={highlights.includes(first + index)}
              wrap={context.wordWrap !== "off"}
              tokens={colored?.[index]}
              dark={context.darkCode}
              revealFrom={reveal ? Math.max(0, received.from - start) : -1}
              generation={reveal ? received.generation : 0}
            />
          );
        })
      ) : (
        <span data-slot="code-block-empty" className="text-muted-foreground">
          {context.loading ? "Waiting for code…" : "No code to display"}
        </span>
      )}
    </code>
  );
}

function shouldRevealCodeLine({
  context,
  visible,
  reducedMotion,
  received,
  offset,
  index,
  lineCount,
}: {
  context: CodeBlockContextValue;
  visible: boolean;
  reducedMotion: boolean;
  received: { from: number; generation: number };
  offset: number;
  index: number;
  lineCount: number;
}) {
  return (
    context.streaming &&
    !context.updatesPaused &&
    visible &&
    !reducedMotion &&
    received.from >= 0 &&
    offset > received.from &&
    index >= lineCount - 4
  );
}

// SAFETY: Immutable fallback tokens preserve the component's public default values.
const USE_CODE_BLOCK_SETUP_DEFAULTS_1 = {
  code: "",
  language: "tsx",
  showLineNumbers: true,
  themeMode: "system",
  lightTheme: "github-light",
  darkTheme: "vitesse-dark",
  readOnly: true,
  height: "auto",
  minimap: false,
  fontSize: 14,
  fontFamily: "var(--font-mono, ui-monospace, monospace)",
  wordWrap: "on",
  editable: false,
  editor: "monaco",
  showCopy: true,
  copyFeedback: "inline",
  loading: false,
  disabled: false,
  startLine: 1,
  highlightLines: [],
  addedLines: [],
  removedLines: [],
  copyFormat: "raw",
  streaming: false,
  followOutput: false,
  formatCode: true,
  syntaxHighlight: true,
  showViewTabs: true,
} as const;

// SAFETY: This immutable list names the composition props removed from the native root.
const USE_CODE_BLOCK_SETUP_COMPOSITION_KEYS_1 = [
  "code",
  "language",
  "filename",
  "className",
  "showLineNumbers",
  "theme",
  "themeMode",
  "lightTheme",
  "darkTheme",
  "readOnly",
  "height",
  "minimap",
  "fontSize",
  "fontFamily",
  "wordWrap",
  "editable",
  "variant",
  "onChange",
  "editor",
  "showCopy",
  "copyValue",
  "copyFeedback",
  "onCopy",
  "onCopyError",
  "loading",
  "disabled",
  "disabledReason",
  "startLine",
  "highlightLines",
  "addedLines",
  "removedLines",
  "copyFormat",
  "streaming",
  "followOutput",
  "formatCode",
  "syntaxHighlight",
  "showViewTabs",
  "preview",
  "children",
  "ref",
  "render",
  "style",
] as const;

type renderCodeEditorViewArgs = {
  setHost: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
  status: "loading" | "ready" | "error";
  setRetry: React.Dispatch<React.SetStateAction<number>>;
  props: CodeEditorProps;
};

function renderCodeEditorView({
  setHost,
  status,
  setRetry,
  props,
}: renderCodeEditorViewArgs) {
  return renderCodeBlockEditorPart1({ setHost, status, setRetry, props });
}

type renderCodeBlockContentViewArgs = {
  context: CodeBlockContextValue;
  className: CodeBlockContentProps["className"];
  style: CodeBlockContentProps["style"];
  props: Omit<
    CodeBlockContentProps,
    "showLineNumbers" | "className" | "style" | "onScroll" | "ref"
  >;
  setViewport: React.RefCallback<HTMLPreElement>;
  onScroll: CodeBlockContentProps["onScroll"];
  value: string;
  lines: string[];
  offset: number;
  visible: boolean;
  reducedMotion: boolean;
  received: { value: string; from: number; generation: number };
  first: number;
  numbered: boolean;
  additions: number[];
  removals: number[];
  highlights: number[];
  colored: CodeToken[][] | undefined;
};

function RenderCodeBlockContentView({
  context,
  className,
  style,
  props,
  setViewport,
  onScroll,
  value,
  lines,
  offset,
  visible,
  reducedMotion,
  received,
  first,
  numbered,
  additions,
  removals,
  highlights,
  colored,
}: renderCodeBlockContentViewArgs) {
  return (
    <pre
      data-slot="code-block-content"

      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The bounded scroll region is keyboard focusable so users can scroll and select its content without a pointer.
      tabIndex={0}
      aria-label={
        context.filename
          ? `Code in ${context.filename}`
          : `${context.language} code`
      }
      aria-live="off"
      className={cn(
        "min-h-full min-w-0 overflow-auto p-4 leading-[1.6] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className,
      )}
      style={{
        fontSize: context.fontSize,
        fontFamily: context.fontFamily,
        tabSize: 2,
        ...style,
      }}
      {...props}
      ref={setViewport}
      onScroll={(event) => {
        onScroll?.(event);
        context.onScroll(event.currentTarget);
      }}
    >
      {renderCodeBlockCodePart3({
        context,
        value,
        lines,
        offset,
        visible,
        reducedMotion,
        received,
        first,
        numbered,
        additions,
        removals,
        highlights,
        colored,
      })}
    </pre>
  );
}

type canFormatCodeBlockArgs = {
  state: ReturnType<typeof useCodeBlockSetup>;
  editableNow: boolean;
  updatesPaused: boolean;
  source: string;
};

function canFormatCodeBlock({
  state,
  editableNow,
  updatesPaused,
  source,
}: canFormatCodeBlockArgs) {
  return (
    state.formatCode &&
    !(editableNow && !state.showViewTabs) &&
    !state.streaming &&
    !updatesPaused &&
    !state.highlightLines.length &&
    !state.addedLines.length &&
    !state.removedLines.length &&
    source.length <= 100_000
  );
}

type displayedCodeBlockArgs = {
  state: ReturnType<typeof useCodeBlockSetup>;
  canFormat: boolean;
  formatMatches: boolean;
  source: string;
};

function displayedCodeBlock({
  state,
  canFormat,
  formatMatches,
  source,
}: displayedCodeBlockArgs) {
  return state.view === "formatted" &&
    canFormat &&
    formatMatches &&
    state.formatted
    ? state.formatted.code
    : source;
}

type subscribeCodeEditorArgs = {
  host: HTMLDivElement | null;
  visible: boolean;
  current: () => CodeEditorProps;
  id: string;
  monacoRef: React.RefObject<MonacoInstance | null>;
  modelRef: React.RefObject<MonacoModel | null>;
  editorRef: React.RefObject<MonacoEditor | null>;
  applying: React.RefObject<boolean>;
  notifyChange: (value: string) => void;
  setStatus: React.Dispatch<
    React.SetStateAction<"loading" | "ready" | "error">
  >;
};

function subscribeCodeEditor({
  host,
  visible,
  current,
  id,
  monacoRef,
  modelRef,
  editorRef,
  applying,
  notifyChange,
  setStatus,
}: subscribeCodeEditorArgs) {
  if (!host || !visible) return;
  let cancelled = false;
  let editor: MonacoEditor | undefined;
  let model: MonacoModel | undefined;
  let listener: { dispose: () => void } | undefined;

  const initialize = async () => {
    try {
      const { init } = await import("modern-monaco");
      const configuration = current();
      const monaco = await init({ defaultTheme: configuration.theme });

      if (cancelled) return;
      const latest = current();
      model = monaco.editor.createModel(
        latest.value,
        latest.language,
        monaco.Uri.parse(
          `inmemory://kira-code/${encodeURIComponent(id)}.${latest.language}`,
        ),
      );
      editor = monaco.editor.create(host, {
        model,
        theme: latest.theme,
        automaticLayout: true,
        fontSize: latest.fontSize,
        fontFamily: latest.fontFamily,
        lineNumbers: latest.showLineNumbers ? "on" : "off",
        minimap: { enabled: latest.minimap },
        readOnly: latest.disabled,
        wordWrap: latest.wordWrap,
        tabSize: 2,
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        ariaLabel: latest.filename ? `Edit ${latest.filename}` : "Edit code",
        accessibilitySupport: "on",
        renderLineHighlight: "line",
      });
      monacoRef.current = monaco;
      modelRef.current = model;
      editorRef.current = editor;
      listener = model.onDidChangeContent(() => {
        if (!applying.current && model) notifyChange(model.getValue());
      });
      setStatus("ready");
    } catch {
      if (!cancelled) setStatus("error");
    }
  };

  void initialize();

  return () => {
    cancelled = true;
    listener?.dispose();
    editor?.dispose();
    model?.dispose();
    editorRef.current = null;
    modelRef.current = null;
    monacoRef.current = null;
  };
}

function useCodeContentSetup({
  showLineNumbers,
  className,
  style,
  onScroll,
  ref,
  ...props
}: CodeBlockContentProps) {
  const context = useCodeContext();

  const [element, setElement] = React.useState<HTMLPreElement | null>(null);

  const visible = useEditorVisible(element, false);

  const reducedMotion = useReducedMotion();

  const value = context.code;

  const [highlighter, setHighlighter] = React.useState<{
    language: string;
    instance: Awaited<NonNullable<ReturnType<typeof loadCodeHighlighter>>>;
  } | null>(null);

  const [received, setReceived] = React.useState({
    value,
    from: -1,
    generation: 0,
  });

  if (received.value !== value) {
    setReceived({
      value,
      from:
        context.streaming && value.startsWith(received.value)
          ? received.value.length
          : -1,
      generation: received.generation + 1,
    });
  }

  const cache = React.useMemo<CodeTokenCache>(
    () => ({ language: context.language, prefix: "", lines: [] }),
    [context.language],
  );

  const tokenizable =
    context.syntaxHighlight && visible && value.length <= 100_000;

  React.useEffect(() => {
    if (!tokenizable) return;
    let cancelled = false;
    const loading = loadCodeHighlighter(context.language);

    if (loading)
      void loading
        .then((instance) => {
          if (!cancelled)
            setHighlighter({ language: context.language, instance });
        })
        .catch(() => {
          if (!cancelled) setHighlighter(null);
        });

    return () => {
      cancelled = true;
    };
  }, [context.language, tokenizable]);

  return {
    showLineNumbers,
    className,
    style,
    onScroll,
    ref,
    props,
    context,
    setElement,
    visible,
    reducedMotion,
    value,
    highlighter,
    received,
    cache,
    tokenizable,
  };
}

function useCodeContentActions(state: ReturnType<typeof useCodeContentSetup>) {
  const {
    showLineNumbers,
    ref,
    context,
    setElement,
    value,
    highlighter,
    cache,
    tokenizable,
  } = state;

  const colored = React.useMemo(() => {
    if (
      !highlighter ||
      highlighter.language !== context.language ||
      !tokenizable
    )
      return undefined;

    try {
      return tokenizeCode(highlighter.instance, value, context.language, cache);
    } catch {
      return undefined;
    }
  }, [highlighter, tokenizable, value, context.language, cache]);

  const numbered = showLineNumbers ?? context.showLineNumbers;

  const first = context.startLine;

  const highlights = context.highlightLines;

  const additions = context.addedLines;

  const removals = context.removedLines;

  const lines = value.split("\n");

  let offset = 0;

  const setViewport = React.useCallback(
    (element: HTMLPreElement | null) => {
      setElement(element);

      return assignRef(ref, element);
    },
    [ref, setElement],
  );

  return {
    ...state,
    colored,
    numbered,
    first,
    highlights,
    additions,
    removals,
    lines,
    offset,
    setViewport,
  };
}

function renderCodeContent({
  className,
  style,
  onScroll,
  props,
  context,
  visible,
  reducedMotion,
  value,
  received,
  colored,
  numbered,
  first,
  highlights,
  additions,
  removals,
  lines,
  offset,
  setViewport,
}: ReturnType<typeof useCodeContentActions>) {
  return (
    <RenderCodeBlockContentView
      {...{
        context,
        className,
        style,
        props,
        setViewport,
        onScroll,
        value,
        lines,
        offset,
        visible,
        reducedMotion,
        received,
        first,
        numbered,
        additions,
        removals,
        highlights,
        colored,
      }}
    />
  );
}

type reportCodeCopyErrorArgs = {
  attempt: number;
  request: React.RefObject<number>;
  error: unknown;
  setState: React.Dispatch<React.SetStateAction<CopyState>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onError: CodeBlockProps["onCopyError"];
  feedback: "inline" | "toast";
};

function reportCodeCopyError({
  attempt,
  request,
  error,
  setState,
  setMessage,
  onError,
  feedback,
}: reportCodeCopyErrorArgs) {
  if (attempt !== request.current) return;

  const reason =
    error instanceof Error
      ? error
      : new Error(
          "Copy failed. Select the code and copy it with your keyboard.",
        );

  setState("error");
  setMessage("Copy failed. Select the code and copy it with your keyboard.");
  onError?.(reason);

  if (feedback === "toast")
    toast.error("Code was not copied", {
      description: "Select the code and copy it with your keyboard.",
    });
}

type resolvecodeblocktsxChoice7Args = {
  removals: renderCodeBlockCodePart3Args["removals"];
  first: renderCodeBlockCodePart3Args["first"];
  index: number;
  additions: renderCodeBlockCodePart3Args["additions"];
};

function resolvecodeblocktsxChoice7({
  removals,
  first,
  index,
  additions,
}: resolvecodeblocktsxChoice7Args) {
  if (removals.includes(first + index)) {
    return "removed";
  }

  if (additions.includes(first + index)) {
    return "added";
  }

  return undefined;
}

type renderCodeBlockWrapperArgs = {
  id: KiraCodeBlockProps["id"];
  ref: KiraCodeBlockProps["ref"];
  active: string;
  className: KiraCodeBlockProps["className"];
  style: KiraCodeBlockProps["style"];
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  onValueChange: KiraCodeBlockProps["onValueChange"];
  files: NonNullable<KiraCodeBlockProps["files"]>;
  buildFiles: () => React.JSX.Element[];
};

function renderCodeBlockWrapper({
  id,
  ref,
  active,
  className,
  style,
  setSelected,
  onValueChange,
  files,
  buildFiles,
}: renderCodeBlockWrapperArgs) {
  return (
    <CodeBlockTabs
      id={id}
      ref={ref}
      value={active}
      className={cn("min-w-0 space-y-2", className)}
      style={style}
      onValueChange={(next) => {
        if (isStringProp(next)) {
          setSelected(next);
          onValueChange?.(next);
        }
      }}
    >
      {files.length ? (
        <>
          <CodeBlockTabsList aria-label="Code files">
            {files.map((file) => (
              <CodeBlockTabsTrigger key={file.value} value={file.value}>
                {file.filename}
              </CodeBlockTabsTrigger>
            ))}
          </CodeBlockTabsList>
          {buildFiles()}
        </>
      ) : (
        <CodeBlock code="" filename="Files" showCopy={false} />
      )}
    </CodeBlockTabs>
  );
}
