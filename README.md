# Astralform Plugins for Claude Code

A collection of plugins for [Claude Code](https://claude.ai/code) to enhance your development workflow.

## Available Plugins

| Plugin | Description | Version |
|--------|-------------|---------|
| [lint](./plugins/lint) | Auto-linting for 9 languages with auto-fix integration and blocking behavior for missing tools | 2.7.0 |
| [memory](./plugins/memory) | Automatic persistent memory - captures learnings across sessions with progressive disclosure | 1.0.0 |
| [xcode](./plugins/xcode) | Swift Package Manager build/test commands and Xcode project utilities | 1.0.0 |
| [ios-developer](./plugins/ios-developer) | iOS development expertise - Swift 6+ concurrency, SwiftUI animations, and Swift Evolution tracking | 1.0.0 |

> **Looking for Astralform project management?** It's now a self-serve **Claude connector**, not a plugin — add `https://mcp.astralform.ai/mcp` in Claude under Customize → Connectors. See the [connector docs](https://astralform.mintlify.app/plugin/connect).

## Installation

### Option 1: Add as Workspace Plugin (Recommended)

```bash
cd your-project
claude plugins add https://github.com/astralform-ai/astralform-plugins
```

### Option 2: Install Globally

```bash
claude plugins add --global https://github.com/astralform-ai/astralform-plugins
```

### Option 3: Install Individual Plugins

```bash
/plugin marketplace add https://github.com/astralform-ai/astralform-plugins
/plugin install lint  # or memory, xcode, ios-developer
```

## Plugin Details

### Lint

Automatically runs linters after code modifications. Supports JavaScript/TypeScript, Python, Swift, Kotlin, Go, Rust, C/C++, Ruby, and PHP.

**Check status:**
```
/lint:status
```

**Features:**
- Automatic linting on file edits
- Auto-fix integration
- Blocking behavior for missing linters with install commands

### Memory

Automatic persistent memory that captures learnings across sessions with progressive disclosure.

**Commands:**
```
/recall [query]    # Search memories
/remember <lesson> # Add a lesson
/forget <topic>    # Remove memory
```

**Features:**
- Automatic capture of significant events
- Markdown-first storage (human-readable)
- Topic organization by language/framework

### Xcode

Swift Package Manager build/test commands and Xcode project utilities.

**Commands:**
```
/xcode:build [debug|release|clean]
/xcode:test [all|filter|verbose|coverage]
```

**Features:**
- Build Swift packages in debug/release mode
- Run tests with filtering and coverage
- Xcode project renaming utility

### iOS Developer

Full-stack iOS development expertise for Swift, SwiftUI, and UIKit.

**Features:**
- Swift 6+ concurrency (async/await, actors, Sendable)
- SwiftUI animation patterns
- Swift Evolution proposal tracking

## Repository Structure

```
astralform-plugins/
├── .claude-plugin/
│   └── marketplace.json     # Marketplace catalog
├── plugins/
│   ├── lint/                # Multi-language linting plugin
│   ├── memory/              # Persistent memory plugin
│   ├── xcode/               # Xcode/SPM utilities plugin
│   └── ios-developer/       # iOS development expertise plugin
├── CLAUDE.md                # Project instructions
├── LICENSE
└── README.md
```

## Requirements

- [Claude Code](https://claude.ai/code) CLI 1.0.33 or later
- For lint: Language-specific linters (ESLint, Ruff, SwiftLint, etc.)
- For xcode / ios-developer: Swift 5.9+ / Xcode 15+

## Documentation

- [Astralform Docs](https://astralform.mintlify.app)
- [Connect Astralform to Claude](https://astralform.mintlify.app/plugin/connect)

## License

MIT
