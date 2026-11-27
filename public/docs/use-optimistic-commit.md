# useOptimisticCommit

Manages optimistic async value commits with automatic rollback, optional single-flight locking, and configurable error feedback via a local callback or OptimisticFeedbackProvider context adapter without coupling primitives to a toast module.

## Install

```bash
kira-kit add @kira-kit/use-optimistic-commit
```

## Usage

```tsx
import { useOptimisticCommit } from "@/hooks/use-optimistic-commit";
```
