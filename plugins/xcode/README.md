# Xcode Plugin

Swift Package Manager build/test commands and Xcode project utilities.

## Features

- **Build command**: Build Swift packages in debug/release mode with clean option
- **Test command**: Run Swift tests with filtering, verbose output, and coverage
- **Project renamer**: Rename Xcode projects including all internal references

## Installation

Install from the astralform-plugins marketplace:

```bash
/plugin marketplace add https://github.com/atom2ueki/astralform-plugins
/plugin install xcode
```

**Version**: 1.0.0

## Commands

### `/xcode:build [mode]`

Build a Swift package or Xcode project.

| Argument | Description |
|----------|-------------|
| `debug` (default) | Build for debugging |
| `release` | Build with optimizations |
| `clean` | Clean artifacts then build |

### `/xcode:test [mode]`

Run the Swift package test suite.

| Argument | Description |
|----------|-------------|
| `all` (default) | Run all tests |
| `filter [name]` | Run tests matching filter |
| `verbose` | Run with verbose output |
| `coverage` | Run with code coverage |

## Skills

### `xcode-rename`

Rename an Xcode project completely — folders, files, and all internal references. Uses a bundled Swift script based on [xcode-project-renamer](https://github.com/appculture/xcode-project-renamer).

## Plugin Structure

```
xcode/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── build.md
│   └── test.md
├── skills/
│   └── xcode-rename/
│       └── SKILL.md
├── scripts/
│   └── xcode-project-renamer.swift
└── README.md
```

## Requirements

- Swift 5.9+ / Xcode 15+
- Claude Code 1.0.33 or later
