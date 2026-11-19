# Tree View

ARIA tree for hierarchical file/folder data with controlled expansion, single or recursive multi-selection with mixed parent states, guide lines, disabled reasons, read-only browsing, and loading/empty states. Arrow/Home/End navigation, branch disclosure, typeahead, and focus restoration support keyboard use; filtering reveals matching descendants and ancestors without overwriting saved expansion.

## Install

```bash
kira-kit add @kira-kit/tree-view
```

## Dependencies

- @tabler/icons-react
- class-variance-authority
- cn

## Registry dependencies

- @kira-kit/button
- @kira-kit/collapsible
- @kira-kit/input
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { TreeView } from "@/components/ui/tree-view";
<TreeView> text</TreeView>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
