import * as React from "react";
import { IconCheck, IconCode, IconCopy } from "@tabler/icons-react";
import { cn } from "cn";
import {
  loadCodeHighlighter,
  tokenizeCode,
  type CodeToken,
  type CodeTokenCache,
} from "@/lib/code-presentation";

/** Grammar loading is async, so the panel paints plain text first and only the
 *  colours arrive later — no layout shift, no spinner for a code block. */
function useHighlightedCode(code: string, language: string) {
  const [lines, setLines] = React.useState<CodeToken[][] | null>(null);

  const cache = React.useRef<CodeTokenCache>({
    language,
    prefix: "",
    lines: [],
  });

  React.useEffect(() => {
    let active = true;

    const highlight = async () => {
      const loading = loadCodeHighlighter(language);

      if (!loading) return;

      try {
        const instance = await loading;

        if (active) {
          setLines(tokenizeCode(instance, code, language, cache.current));
        }
      } catch {
        setLines(null);
      }
    };

    void highlight();

    return () => {
      active = false;
    };
  }, [code, language]);

  return lines;
}

function Token({ token }: { token: CodeToken }) {
  if (!token.light && !token.dark) return <>{token.content}</>;

  // SAFETY: These two keys are the only custom properties on this object.
  const colors = {
    "--docs-token-light": token.light,
    "--docs-token-dark": token.dark,
  } as React.CSSProperties;

  return (
    <span className="docs-code-token" style={colors}>
      {token.content}
    </span>
  );
}

function useCopy(code: string) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = React.useCallback(() => {
    navigator.clipboard
      .writeText(code)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, [code]);

  return { copied, copy };
}

function CodeToolbar({
  language,
  copied,
  onCopy,
}: {
  language: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const Glyph = copied ? IconCheck : IconCopy;

  return (
    <>
      <div className="flex shrink-0 items-center justify-between gap-3 bg-muted/30 px-3.5 py-2.5">
        <span className="flex min-w-0 items-center gap-2 docs-accent">
          <IconCode aria-hidden className="h-[15px] w-[15px] shrink-0" />
          <span className="truncate font-mono text-xs text-foreground/80 uppercase">
            {language}
          </span>
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
          className="docs-focus-ring flex h-11 shrink-0 items-center gap-[7px] rounded-[6px] border border-border/70 bg-muted px-2.5 text-xs font-medium text-foreground transition-colors duration-150 ease-out hover:bg-primary/10 lg:h-[30px]"
        >
          <Glyph aria-hidden className="h-3.5 w-3.5 docs-accent" />
          <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div aria-hidden className="h-px w-full shrink-0 bg-border/70" />
    </>
  );
}

function CodeFooter({ rowCount }: { rowCount: number }) {
  return (
    <>
      <div aria-hidden className="h-px w-full shrink-0 bg-border/70" />
      <div className="shrink-0 bg-muted/30 px-3.5 py-[9px]">
        <span className="font-mono text-xs text-muted-foreground">
          {rowCount} {rowCount === 1 ? "line" : "lines"}
        </span>
      </div>
    </>
  );
}

interface CodePanelProps {
  code: string;
  language?: string;
  /** Extra classes for the scrolling viewport — the playground stretches it to
   *  fill the browser, usage keeps the design's fixed height. */
  viewportClassName?: string;
  showLineNumbers?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function CodePanel({
  code,
  language = "tsx",
  viewportClassName = "h-[276px] lg:h-[380px]",
  showLineNumbers = true,
  showFooter = true,
  className,
}: CodePanelProps) {
  const source = code.replace(/\n+$/, "");
  const lines = useHighlightedCode(source, language);
  const { copied, copy } = useCopy(source);
  const plain = React.useMemo(() => source.split("\n"), [source]);
  const rows = lines ?? plain;

  return (
    <div
      data-slot="code-panel"
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-border/70 bg-card",
        className,
      )}
    >
      <CodeToolbar language={language} copied={copied} onCopy={copy} />

      <div
        className={cn(
          "docs-scroll min-h-0 flex-1 overflow-auto font-mono text-[11px] leading-normal lg:text-xs",
          viewportClassName,
        )}
      >
        <div className="px-2.5 py-2.5 lg:px-4">
          {/* oxlint-disable react/no-array-index-key -- A source line's only identity is its position: duplicate lines are the common case, not an edge case. */}
          {rows.map((line, index) => (
            <div
              key={index}
              className="flex min-h-[1.5em] gap-2 whitespace-pre lg:gap-4"
            >
              {showLineNumbers && (
                <span className="w-[18px] shrink-0 text-right text-muted-foreground select-none lg:w-6">
                  {index + 1}
                </span>
              )}
              <span className="min-w-0 text-foreground">
                {Array.isArray(line)
                  ? line.map((token, tokenIndex) => (
                      <Token key={tokenIndex} token={token} />
                    ))
                  : line || " "}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showFooter && <CodeFooter rowCount={rows.length} />}
    </div>
  );
}
