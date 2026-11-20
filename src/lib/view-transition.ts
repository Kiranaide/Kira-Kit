type ViewTransitionUpdate = () => void | Promise<void>;

function supportsViewTransitions(): boolean {
  return (
    typeof document !== "undefined" &&
    // oxlint-disable-next-line anti-slop/no-runtime-typeof -- feature detection at the browser API boundary.
    typeof document.startViewTransition === "function"
  );
}

/**
 * Runs a DOM update inside a native view transition when the browser supports
 * it and the user has not asked for reduced motion; otherwise runs it directly.
 */
function startViewTransition(
  update: ViewTransitionUpdate,
): ViewTransition | undefined {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsViewTransitions() || reducedMotion) {
    void update();

    return undefined;
  }

  return document.startViewTransition(update);
}

export {
  startViewTransition,
  supportsViewTransitions,
  type ViewTransitionUpdate,
};
