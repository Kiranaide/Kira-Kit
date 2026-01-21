import * as React from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Monaco editor theme options (Shiki themes supported by modern-monaco)
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

const codeBlockVariants = cva("relative rounded-lg overflow-hidden border", {
  variants: {
    variant: {
      default: "bg-zinc-950 text-zinc-50 border-zinc-800",
      light: "bg-white text-zinc-900 border-zinc-200",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CodeBlockProps extends VariantProps<typeof codeBlockVariants> {
  code: string;
  language?: string;
  className?: string;
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
}

// Monaco types (narrow to what we use)
interface MonacoEditor {
  getValue: () => string;
  setModel: (model: MonacoModel | null) => void;
  onDidChangeModelContent: (callback: () => void) => { dispose: () => void };
  dispose: () => void;
}

interface MonacoModel {
  getValue: () => string;
  setValue: (value: string) => void;
  onDidChangeContent: (cb: () => void) => { dispose: () => void };
  dispose: () => void;
}

interface MonacoInstance {
  editor: {
    create: (
      element: HTMLElement,
      options: Record<string, unknown>
    ) => MonacoEditor;
    createModel: (
      value: string,
      language: string,
      uri?: unknown
    ) => MonacoModel;
  };
  Uri?: {
    parse: (uri: string) => unknown;
  };
}

function CodeBlock({
  code,
  language = "tsx",
  className,
  showLineNumbers = true,
  theme = "vitesse-dark",
  themeMode = "dark",
  lightTheme = "github-light",
  darkTheme = "vitesse-dark",
  readOnly = true,
  height = "auto",
  minimap = false,
  fontSize = 14,
  fontFamily = "Geist Mono, monospace",
  wordWrap = "on",
  editable = false,
  variant,
  onChange,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [isMonacoReady, setIsMonacoReady] = React.useState(false);
  const [resolvedTheme, setResolvedTheme] = React.useState<MonacoTheme>(
    themeMode === "light" ? lightTheme : themeMode === "dark" ? darkTheme : theme
  );
  const componentId = React.useId();
  const editorContainerRef = React.useRef<HTMLDivElement | null>(null);
  const editorInstanceRef = React.useRef<MonacoEditor | null>(null);
  const modelRef = React.useRef<MonacoModel | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Track system color scheme when themeMode is system
  React.useEffect(() => {
    if (themeMode !== "system") {
      setResolvedTheme(themeMode === "light" ? lightTheme : darkTheme);
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      setResolvedTheme(event.matches ? darkTheme : lightTheme);
    };

    setResolvedTheme(media.matches ? darkTheme : lightTheme);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [themeMode, lightTheme, darkTheme]);

  // Calculate height based on content if auto
  const calculatedHeight = React.useMemo(() => {
    if (height !== "auto") {
      return typeof height === "number" ? `${height}px` : height;
    }
    const lineCount = code.split("\n").length;
    const lineHeight = Math.round(fontSize * 1.5);
    const padding = 32; // top + bottom padding
    return `${Math.max(lineCount * lineHeight + padding, 100)}px`;
  }, [height, code, fontSize]);

  // Initialize modern-monaco using init() for direct control
  React.useEffect(() => {
    let isMounted = true;
    let changeListener: { dispose: () => void } | null = null;

    const initMonaco = async () => {
      if (!editorContainerRef.current) return;

      try {
        const { init } = await import("modern-monaco");

        if (!isMounted || !editorContainerRef.current) return;

        // Initialize monaco with theme
        const monaco = (await init({ theme: resolvedTheme })) as MonacoInstance;

        if (!isMounted || !editorContainerRef.current) return;

        // Create a dedicated model with a stable URI to avoid missing source errors
        const uri =
          monaco.Uri?.parse?.(
            `inmemory://code-block/${componentId}.${language}`
          ) ?? undefined;
        const model = monaco.editor.createModel(code, language, uri);

        // Create the editor instance bound to the model
        const editor = monaco.editor.create(editorContainerRef.current, {
          model,
          theme: resolvedTheme,
          automaticLayout: true,
          fontSize,
          fontFamily,
          fontLigatures: true,
          lineNumbers: showLineNumbers ? "on" : "off",
          minimap: { enabled: minimap },
          readOnly: readOnly && !editable,
          wordWrap,
          tabSize: 2,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          renderLineHighlight: readOnly ? "none" : "line",
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        });

        editorInstanceRef.current = editor;
        modelRef.current = model;
        setIsMonacoReady(true);

        // Setup change listener if editable
        if (editable && onChange) {
          changeListener = model.onDidChangeContent(() => {
            const currentCode = model.getValue();
            onChange(currentCode);
          });
        }
      } catch (error) {
        console.error("Failed to initialize modern-monaco:", error);
      }
    };

    initMonaco();

    return () => {
      isMounted = false;
      changeListener?.dispose();
      editorInstanceRef.current?.dispose();
      modelRef.current?.dispose();
    };
    // Intentionally omit `code` to avoid recreating the editor on every external
    // code change; a separate effect syncs the model value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    language,
    resolvedTheme,
    showLineNumbers,
    minimap,
    readOnly,
    editable,
    fontSize,
    fontFamily,
    wordWrap,
    onChange,
    componentId,
  ]);

  // Sync external code changes into the model without recreating the editor
  React.useEffect(() => {
    const model = modelRef.current;
    if (model && model.getValue() !== code) {
      model.setValue(code);
    }
  }, [code]);

  return (
    <div
      data-slot="code-block"
      className={cn(codeBlockVariants({ variant, className }))}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-600" />
            <div className="w-3 h-3 rounded-full bg-zinc-500" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 uppercase">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
            type="button"
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <IconCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <IconCopy className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div
        className="overflow-hidden relative"
        style={{ height: calculatedHeight, minHeight: "100px" }}
      >
        {/* Monaco mount point */}
        <div
          ref={editorContainerRef}
          className="w-full h-full"
          style={{
            opacity: isMonacoReady ? 1 : 0,
            transition: "opacity 150ms ease-in-out",
          }}
        />

        {/* Fallback for when Monaco isn't ready */}
        {!isMonacoReady && (
          <div
            className="absolute inset-0 overflow-auto bg-zinc-950"
            style={{ fontFamily }}
          >
            <pre
              className="p-4 text-sm leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              <code className="block text-zinc-300">
                {code.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    {showLineNumbers && (
                      <span className="select-none text-zinc-600 w-8 text-right pr-4 shrink-0">
                        {i + 1}
                      </span>
                    )}
                    <span className="flex-1 whitespace-pre">{line || " "}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export { CodeBlock, codeBlockVariants, type CodeBlockProps };
