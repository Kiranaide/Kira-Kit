# File Upload

A drag-and-drop file selector with optional paste input, controlled values, and validation for accepted types, size, count, and duplicates. It supports batch or sequential per-file uploads with progress, cancellation, and retry, plus a full-screen preview dialog for media and sanitized Markdown with image zoom, rotation, and keyboard navigation.

## Install

```bash
npx shadcn add @kira-kit/file-upload
```

## Dependencies

- @base-ui/react
- @tabler/icons-react
- @uiw/react-md-editor
- class-variance-authority
- cn
- rehype-sanitize

## Registry dependencies

- @kira-kit/button
- @kira-kit/dialog
- @kira-kit/use-reduced-motion

## Usage

```tsx
import { FileUpload } from "@/components/ui/file-upload";
<FileUpload> text</FileUpload>
```

## Accessibility

Built on Base UI primitives: keyboard navigation, focus management, and ARIA wiring
come from the primitive layer. Animations are gated by `useReducedMotion`.
