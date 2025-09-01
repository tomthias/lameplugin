# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Build TypeScript once
npm run build

# Watch mode for development (recommended during active development)
npm run watch
```

## Figma Plugin Testing

1. Open Figma Desktop App
2. Go to **Plugins > Development > Import plugin from manifest**
3. Select the `manifest.json` file from this project
4. Plugin will appear in development plugins list
5. After code changes, reload the plugin in Figma to test

## Architecture Overview

This is a Figma/FigJam plugin built with TypeScript that follows the standard Figma plugin architecture:

### Two-Context System
- **Plugin Context** (`src/code.ts`): Runs in Figma's plugin sandbox with access to the Figma API via the global `figma` object
- **UI Context** (`ui.html`): Runs in an iframe with standard web APIs (HTML/CSS/JS)

### Communication Pattern
- UI sends messages to plugin context via `parent.postMessage({ pluginMessage: { type: 'action', data } }, '*')`
- Plugin context receives via `figma.ui.onmessage = (msg) => { ... }`
- Plugin context can send to UI via `figma.ui.postMessage({ type: 'response', data })`

### File Structure
- `manifest.json`: Plugin configuration (name, permissions, entry points)
- `src/code.ts`: Main plugin logic (compiles to `code.js`)
- `ui.html`: Complete UI with embedded CSS and JavaScript
- TypeScript compiles `src/` files to root directory (referenced in manifest)

### Key Plugin API Patterns
- `figma.showUI(__html__, options)` to display UI
- `figma.createXXX()` methods to create nodes
- `figma.currentPage` for current page access  
- `figma.closePlugin()` to close plugin
- Node manipulation via properties like `.fills`, `.x`, `.y`
- Selection via `figma.currentPage.selection`

### Current Implementation
The scaffolded plugin creates numbered orange rectangles based on user input, demonstrating basic UI-to-plugin communication and node creation patterns.