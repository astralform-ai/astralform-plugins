# Lint Plugin

Automatically runs linters after code modifications and provides feedback. Supports JavaScript/TypeScript, Python, Swift, and Kotlin.

## Features

- **Automatic linting**: Runs linters automatically after file edits
- **Multi-language support**: JavaScript/TypeScript, Python, Swift, Kotlin
- **Auto-fix integration**: Attempts to fix issues automatically
- **Manual fix skill**: Provides guidance for complex lint issues
- **Manual lint command**: Run `/lint:check` to lint on demand

## Installation

Install from the atom2ueki-plugins marketplace:
```bash
/plugin marketplace add https://github.com/atom2ueki/atom2ueki-plugins
/plugin install lint
```

## How it works

### Automatic lint hooks
When you edit or create files using Claude Code, the plugin automatically:

1. Detects the file type (`.js`, `.ts`, `.py`, `.swift`, `.kt`)
2. Checks for configured linters in the project
3. Runs appropriate linters with auto-fix options
4. Reports any remaining issues to Claude

### Supported linters

| Language | Linters | Configuration files |
|----------|---------|---------------------|
| JavaScript/TypeScript | ESLint, Prettier, TypeScript | `package.json`, `.eslintrc`, `.prettierrc`, `tsconfig.json` |
| Python | Ruff, Black, isort, mypy | `pyproject.toml`, `setup.cfg`, `requirements.txt` |
| Swift | SwiftLint, SwiftFormat | `.swiftlint.yml`, `Package.swift`, `.swiftformat` |
| Kotlin | ktlint, Detekt | `build.gradle`, `build.gradle.kts`, `detekt.yml` |

## Usage

### Automatic linting
No setup required! Just edit files and the plugin will run linters automatically.

### Manual linting
```bash
/lint:check          # Lint entire project
/lint:check src/     # Lint specific directory
/lint:check file.py  # Lint specific file
```

### Manual fix guidance
When auto-fix fails, Claude will use the `lint-fixer` skill to provide specific guidance for fixing lint issues.

## Configuration

The plugin automatically detects your project's linter configuration. Ensure you have:

1. **Linters installed** (e.g., `npm install --save-dev eslint prettier`)
2. **Configuration files** (e.g., `.eslintrc.json`, `pyproject.toml`)
3. **Project structure** with standard layout

## Example workflow

1. Edit a TypeScript file in Claude Code
2. Plugin automatically runs ESLint and Prettier
3. If issues found, Claude shows them and tries to auto-fix
4. If auto-fix fails, Claude uses lint-fixer skill to guide manual fixes
5. Run `/lint:check` to verify all fixes

## Plugin Structure
```
lint/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── hooks/
│   └── hooks.json              # Hook configuration
├── scripts/
│   └── lint-detector.py        # Main lint detection script
├── skills/
│   └── lint-fixer/
│       └── SKILL.md            # Skill for manual lint fixing
└── commands/
    └── lint.md                 # Manual lint command
```

## Requirements

- Claude Code 1.0.33 or later
- Supported languages: Python 3.8+, Node.js 14+, Swift 5.3+, Kotlin 1.5+
- Linters must be installed in the project or globally