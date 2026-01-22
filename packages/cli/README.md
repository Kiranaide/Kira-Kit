# Kira Kit CLI

CLI tool for adding Kira Kit components to your React project.

## Installation

```bash
# Global install
npm install -g @kira-kit/cli

# Or use with npx
npx @kira-kit/cli add button
```

## Usage

### Initialize

Initialize Kira Kit in your project with interactive color selection:

```bash
kira-kit init
```

Options:
- `--base-color <color>` - Base color (slate, gray, zinc, neutral, stone)
- `--primary-color <color>` - Primary color (blue, green, orange, pink, purple, red, violet, yellow)
- `--cwd <directory>` - Working directory
- `-y, --yes` - Skip prompts and use defaults

### Add Components

Add one or more components to your project:

```bash
# Add single component
kira-kit add button

# Add multiple components
kira-kit add button card dialog

# Add all components
kira-kit add --all
```

Options:
- `--cwd <directory>` - Working directory
- `-o, --overwrite` - Overwrite existing files
- `-y, --yes` - Skip prompts

### Build Registry

Build registry JSON files (used for distribution):

```bash
kira-kit build
```

### List Components

List all available components:

```bash
kira-kit list
```

## Examples

```bash
# Initialize with specific colors
kira-kit init --base-color neutral --primary-color blue

# Add components
kira-kit add button checkbox input --overwrite

# List available components
kira-kit list
```

## Requirements

- Node.js 18+
- Bun (recommended) or npm/pnpm/yarn

## License

MIT
