import * as p from "@clack/prompts";

export type PromptContext = {
  /** Value provided via a flag — skips the prompt entirely. */
  flagValue?: unknown;
  /** --yes was passed. */
  yes?: boolean;
};

function isInteractive(): boolean {
  return (
    !process.env.CI &&
    process.stdin.isTTY === true &&
    process.stdout.isTTY === true
  );
}

/** True when no prompt must be shown: flag given, --yes, CI, or non-TTY. */
export function shouldSkipPrompt(ctx: PromptContext): boolean {
  return ctx.flagValue !== undefined || ctx.yes === true || !isInteractive();
}

export async function select<T extends string>(
  ctx: PromptContext,
  message: string,
  options: Array<{ value: T; label: string; hint?: string }>,
  fallback: T,
): Promise<T> {
  if (shouldSkipPrompt(ctx)) {
    // SAFETY: flagValue is the commander flag bound to this prompt at each call
    // site, so its runtime value matches the prompt's value type T.
    return (ctx.flagValue as T | undefined) ?? fallback;
  }
  const answer = await p.select<string>({
    message,
    options: options.map((option) => ({
      // SAFETY: T extends string by the select() signature, so every option
      // value is a string; the widening only satisfies clack's option type.
      value: option.value as string,
      label: option.label,
      hint: option.hint,
    })),
  });
  if (p.isCancel(answer)) {
    p.cancel("Cancelled.");
    process.exit(1);
  }
  // SAFETY: clack's select returns the chosen option's value verbatim, and
  // every option was built from a T-typed value above.
  return answer as T;
}

export async function confirm(
  ctx: PromptContext,
  message: string,
  fallback: boolean,
): Promise<boolean> {
  if (shouldSkipPrompt(ctx)) {
    // SAFETY: confirm() call sites pass the parsed boolean flag (e.g. --force),
    // so flagValue is boolean | undefined; undefined falls back to the default.
    const explicit = ctx.flagValue as boolean | undefined;
    return explicit ?? fallback;
  }
  const answer = await p.confirm({ message, initialValue: fallback });
  if (p.isCancel(answer)) {
    p.cancel("Cancelled.");
    process.exit(1);
  }
  return answer;
}

export async function text(
  ctx: PromptContext,
  message: string,
  fallback: string,
  validate?: (value: string) => string | undefined,
): Promise<string> {
  if (shouldSkipPrompt(ctx)) {
    // SAFETY: text() call sites pass the parsed string flag, so flagValue is
    // string | undefined; undefined falls back to the default.
    return (ctx.flagValue as string | undefined) ?? fallback;
  }
  const answer = await p.text({
    message,
    initialValue: fallback,
    validate: validate ? (value) => validate(value ?? "") : undefined,
  });
  if (p.isCancel(answer)) {
    p.cancel("Cancelled.");
    process.exit(1);
  }
  return answer;
}

export { isInteractive };
