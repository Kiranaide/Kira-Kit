# Kira Kit Registry

Kira Kit components can be installed via the shadcn CLI from our registry.

## Setup

Add the Kira Kit registry to your project's `components.json`:

```json
{
  "registries": {
    "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"
  }
}
```

## Installation

```bash
# Install a single component
npx shadcn@latest add @kira-kit/button

# Install multiple components
npx shadcn@latest add @kira-kit/button @kira-kit/dialog @kira-kit/card
```

## Available Components

| Component | Dependencies |
|-----------|-------------|
| accordion | @base-ui/react |
| alert | @base-ui/react, @tabler/icons-react |
| alert-dialog | @base-ui/react, @tabler/icons-react |
| avatar | — |
| badge | — |
| button | @base-ui/react, animejs |
| calendar | @base-ui/react, date-fns |
| card | — |
| checkbox | @base-ui/react |
| color-picker | @uiw/color-* |
| combobox | @base-ui/react |
| context-menu | @base-ui/react, @tabler/icons-react |
| data-table | @tanstack/react-table, @tanstack/react-virtual |
| date-picker | @base-ui/react, date-fns |
| dialog | @base-ui/react, @tabler/icons-react |
| drawer | @base-ui/react, @tabler/icons-react |
| dropdown-menu | @base-ui/react, @tabler/icons-react |
| empty | @tabler/icons-react |
| field | — |
| file-upload | @tabler/icons-react |
| hover-card | @base-ui/react |
| input | @base-ui/react |
| input-group | — |
| kbd | — |
| label | — |
| menubar | @base-ui/react, @tabler/icons-react |
| navigation-menu | @base-ui/react, @tabler/icons-react |
| pagination | @tabler/icons-react |
| popover | @base-ui/react |
| progress | — |
| radio-group | @base-ui/react |
| resizable | react-resizable-panels |
| select | @base-ui/react, @tabler/icons-react |
| separator | @base-ui/react |
| sidebar | @base-ui/react, @tabler/icons-react |
| skeleton | — |
| slider | @base-ui/react |
| sonner | sonner |
| table | — |
| tabs | @base-ui/react |
| textarea | — |
| toggle | @base-ui/react |
| toggle-group | @base-ui/react |
| tooltip | @base-ui/react |
| tree-view | @tabler/icons-react |

## Requirements

- React 18.3+
- Tailwind CSS 4.x
- `clsx` and `tailwind-merge` for `cn()` utility

## Registry Endpoints

- **All components**: `/r/registry.json`
- **Component index**: `/r/index.json`
- **Individual**: `/r/{component-name}.json`
