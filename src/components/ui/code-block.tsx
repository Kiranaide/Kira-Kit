import * as React from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = "tsx",
  className,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden border bg-zinc-950 text-zinc-50", className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-600" />
            <div className="w-3 h-3 rounded-full bg-zinc-500" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 uppercase">{language}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
            type="button"
          >
            {copied ? (
              <IconCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <IconCopy className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="block">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {showLineNumbers && (
                  <span className="select-none text-zinc-600 w-8 text-right pr-4 shrink-0">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1">{highlightSyntax(line)}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function highlightSyntax(line: string): React.ReactNode {
  const parts: { text: string; className: string }[] = [];
  let currentText = "";
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"' || char === "'" || char === "`") {
      if (currentText) {
        parts.push({ text: currentText, className: "" });
        currentText = "";
      }
      const quote = char;
      let str = "";
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === "\\" && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (line[i] === quote) i++;
      parts.push({ text: quote + str + quote, className: "text-emerald-400" });
    } else if (char === "/" && i + 1 < line.length && line[i + 1] === "/") {
      if (currentText) {
        parts.push({ text: currentText, className: "" });
        currentText = "";
      }
      parts.push({ text: line.slice(i), className: "text-zinc-500" });
      break;
    } else if (/[\w$]/.test(char)) {
      const keywords = [
        "import", "export", "from", "return", "const", "let", "var", "function",
        "async", "await", "if", "else", "for", "while", "switch", "case", "default",
        "try", "catch", "finally", "throw", "new", "this", "class", "extends",
        "interface", "type", "typeof", "instanceof", "void", "null", "undefined",
        "true", "false", "default", "React", "useState", "useEffect", "useCallback",
        "useMemo", "useRef", "useContext", "useReducer", "useStepper",
      ];
      const types = [
        "string", "number", "boolean", "object", "Array", "Function", "Promise",
        "ReactNode", "ReactElement", "ComponentProps", "HTMLAttributes",
      ];
      let word = "";
      while (i < line.length && /[\w$]/.test(line[i])) {
        word += line[i];
        i++;
      }
      if (keywords.includes(word)) {
        parts.push({ text: word, className: "text-rose-400" });
      } else if (word[0] === word[0].toUpperCase() || types.includes(word)) {
        parts.push({ text: word, className: "text-amber-300" });
      } else {
        parts.push({ text: word, className: "text-cyan-300" });
      }
    } else if (char === "<" && line.includes(">") && !line.includes("//")) {
      if (currentText) {
        parts.push({ text: currentText, className: "" });
        currentText = "";
      }
      const tagMatch = line.slice(i).match(/^<\/?[\w-]+/);
      if (tagMatch) {
        parts.push({ text: tagMatch[0], className: "text-rose-400" });
        i += tagMatch[0].length;
      } else {
        currentText += char;
        i++;
      }
    } else {
      currentText += char;
      i++;
    }
  }

  if (currentText) {
    parts.push({ text: currentText, className: "" });
  }

  return parts.map((part, j) => (
    <span key={j} className={part.className}>{part.text}</span>
  ));
}
