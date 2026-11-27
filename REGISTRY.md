# Kira Kit Registry

Kira Kit components are installed with the `kira-kit` CLI from our registry.

## Setup

Add the Kira Kit registry to your project's `components.json` (or run
`kira-kit init`, which also installs the kit's base CSS and default theme):

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
npx kira-kit add button

# Install multiple components
npx kira-kit add button dialog card

# Install every component, hook, and lib module (themes excluded)
npx kira-kit add --all
```

## Available Components

| Component       | Dependencies                                    |
| --------------- | ----------------------------------------------- |
| accordion       | @base-ui/react                                  |
| alert           | @base-ui/react, @tabler/icons-react             |
| alert-dialog    | @base-ui/react, @tabler/icons-react             |
| avatar          | —                                               |
| badge           | —                                               |
| button          | @base-ui/react, animejs                         |
| calendar        | @base-ui/react, date-fns                        |
| camera          | @tabler/icons-react                             |
| card            | —                                               |
| checkbox        | @base-ui/react                                  |
| color-picker    | @uiw/color-convert, @uiw/react-color-saturation |
| combobox        | @base-ui/react                                  |
| context-menu    | @base-ui/react, @tabler/icons-react             |
| data-table      | @tanstack/react-table, @tanstack/react-virtual  |
| date-picker     | @base-ui/react, date-fns                        |
| dialog          | @base-ui/react, @tabler/icons-react             |
| drawer          | @base-ui/react, @tabler/icons-react             |
| dropdown-menu   | @base-ui/react, @tabler/icons-react             |
| empty           | @tabler/icons-react                             |
| field           | —                                               |
| file-upload     | @tabler/icons-react                             |
| hover-card      | @base-ui/react                                  |
| input           | @base-ui/react                                  |
| input-group     | —                                               |
| kbd             | —                                               |
| label           | —                                               |
| menubar         | @base-ui/react, @tabler/icons-react             |
| navigation-menu | @base-ui/react, @tabler/icons-react             |
| pagination      | @tabler/icons-react                             |
| popover         | @base-ui/react                                  |
| progress        | —                                               |
| radio-group     | @base-ui/react                                  |
| resizable       | react-resizable-panels                          |
| select          | @base-ui/react, @tabler/icons-react             |
| separator       | @base-ui/react                                  |
| sidebar         | @base-ui/react, @tabler/icons-react             |
| skeleton        | —                                               |
| slider          | @base-ui/react                                  |
| sonner          | sonner                                          |
| table           | —                                               |
| tabs            | @base-ui/react                                  |
| textarea        | —                                               |
| toggle          | @base-ui/react                                  |
| toggle-group    | @base-ui/react                                  |
| tooltip         | @base-ui/react                                  |
| tree-view       | @tabler/icons-react                             |

## Requirements

- React 19.2+ (components use `useEffectEvent`)
- Tailwind CSS 4.x
- The `cn` package for class merging

## Registry Endpoints

- **Index (metadata for all items)**: `/r/registry.json`
- **Individual items**: `/r/{item-name}.json`
- **JSON schemas**: `/schema/registry.json`, `/schema/registry-item.json`, `/schema/components.json`
