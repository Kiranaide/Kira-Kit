"use client";

import * as React from "react";

export interface CommitErrorFeedback {
  title: React.ReactNode;
  description?: React.ReactNode;
  error: unknown;
}

export type CommitErrorAdapter = (feedback: CommitErrorFeedback) => void;

const OptimisticFeedbackContext = React.createContext<
  CommitErrorAdapter | undefined
>(undefined);

export interface OptimisticFeedbackProviderProps {
  /** App-level adapter invoked when an optimistic commit rejects and no local onError handles it. */
  onError: CommitErrorAdapter;
  children: React.ReactNode;
}

export function OptimisticFeedbackProvider({
  onError,
  children,
}: OptimisticFeedbackProviderProps) {
  return (
    <OptimisticFeedbackContext.Provider value={onError}>
      {children}
    </OptimisticFeedbackContext.Provider>
  );
}

export function useOptimisticFeedback(): CommitErrorAdapter | undefined {
  return React.useContext(OptimisticFeedbackContext);
}

export interface UseOptimisticCommitOptions<T> {
  /** Committed source-of-truth value. */
  value: T;
  /** Async commit handler; rejecting automatically reverts optimisticValue to value. */
  onCommit?: (next: T) => void | Promise<void>;
  /** Called after onCommit resolves (useful for updating uncontrolled state or notifying parents). */
  onCommitted?: (next: T) => void;
  /** Local error handler. Overrides the OptimisticFeedbackProvider adapter when provided. */
  onError?: (error: Error, revertedValue: T) => void;
  /** Title forwarded to the OptimisticFeedbackProvider adapter on rejection. */
  errorTitle?: React.ReactNode;
  /** Optional description forwarded to the OptimisticFeedbackProvider adapter on rejection. */
  errorDescription?: React.ReactNode;
  /** Ignore overlapping commits while one is already in flight. */
  singleFlight?: boolean;
}

export interface UseOptimisticCommitReturn<T> {
  /** Optimistic value during an in-flight commit, otherwise the committed value. */
  optimisticValue: T;
  /** True while an async commit is in flight. */
  pending: boolean;
  /** Trigger an optimistic commit inside a React transition. */
  commit: (next: T) => void;
  /** Async commit runner for callers already inside a transition. */
  runCommit: (next: T) => Promise<boolean>;
}

export function useOptimisticCommit<T>({
  value,
  onCommit,
  onCommitted,
  onError,
  errorTitle = "Couldn't save that",
  errorDescription,
  singleFlight = false,
}: UseOptimisticCommitOptions<T>): UseOptimisticCommitReturn<T> {
  const feedbackAdapter = React.useContext(OptimisticFeedbackContext);
  const [pending, setPending] = React.useState(false);
  const inFlightRef = React.useRef(false);

  const [optimisticValue, setOptimisticValue] = React.useOptimistic(
    value,
    (_prev: T, next: T) => next,
  );

  const runCommit = React.useCallback(
    async (next: T): Promise<boolean> => {
      if (singleFlight && inFlightRef.current) return false;

      if (!onCommit) {
        onCommitted?.(next);

        return true;
      }

      inFlightRef.current = true;
      setPending(true);
      setOptimisticValue(next);

      try {
        await onCommit(next);
        onCommitted?.(next);

        return true;
      } catch (error) {
        const normalized =
          error instanceof Error ? error : new Error(String(error));

        if (onError) {
          onError(normalized, value);
        } else {
          feedbackAdapter?.({
            title: errorTitle,
            description: errorDescription,
            error: normalized,
          });
        }

        return false;
      } finally {
        inFlightRef.current = false;
        setPending(false);
      }
    },
    [
      singleFlight,
      onCommit,
      onCommitted,
      onError,
      value,
      feedbackAdapter,
      errorTitle,
      errorDescription,
      setOptimisticValue,
    ],
  );

  const commit = React.useCallback(
    (next: T) => {
      React.startTransition(() => {
        void runCommit(next);
      });
    },
    [runCommit],
  );

  return { optimisticValue, pending, commit, runCommit };
}
