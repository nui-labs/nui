# @nui/cli

A CLI tool for copying blocks from external registries to your project.

## Installation

```bash
npm install @nui/cli
# or
bun add @nui/cli
```

### Running in Monorepo

The `nui-blocks` script is configured at the monorepo root level and can be used from anywhere:

```bash
# From monorepo root
bun nui-blocks <command> [options]

# From any workspace app (e.g., apps/docs)
bun --cwd ../.. nui-blocks <command> [options]

# Examples
bun nui-blocks list --package @nui/blocks-provider
bun nui-blocks add button-01 --package @nui/blocks-provider --dir apps/docs/src/blocks
```

The root-level script in `package.json`:

```json
{
  "scripts": {
    "nui-blocks": "bun packages/cli/src/index.ts"
  }
}
```

## Usage

```bash
nui-blocks <command> [options]
```

### Commands

- **list** - List available blocks from a package
- **add** - Add one or more blocks to your project
- **info** - Show detailed information about a block
- **help** - Show help message

### Options

- `--package <name>` - Package name (required)
- `--dir <path>` - Target directory (default: src/blocks)
- `--category <name>` - Filter by category (list only)
- `--overwrite` - Overwrite existing blocks (add only)

### Examples

```bash
# List all blocks
nui-blocks list --package @nui/blocks-provider

# Add blocks
nui-blocks add button-01 input-01 --package @nui/blocks-provider

# Get block info
nui-blocks info button-01 --package @nui/blocks-provider
```

## How it works

The CLI loads block registries from:

1. Workspace packages (monorepo development)
2. node_modules (installed packages)
3. npm CDN (unpkg/jsdelivr - no installation needed)

Blocks are copied to your project with all their files and dependencies preserved.
