# Lint Plugin

Automatically runs linters after code modifications and provides feedback. Supports JavaScript/TypeScript, Python, Swift, Kotlin, Go, Rust, C/C++, Ruby, and PHP.

## Features

- **Automatic linting**: Runs linters automatically after file edits
- **Multi-language support**: 9 programming languages
- **Auto-fix integration**: Attempts to fix issues automatically
- **Blocking behavior**: Stops and shows install commands if required linters missing
- **Manual fix skill**: Provides guidance for complex lint issues
- **Status command**: Run `/lint:status` to check configuration

## Installation

Install from the astralform-plugins marketplace:

```bash
/plugin marketplace add https://github.com/atom2ueki/astralform-plugins
/plugin install lint
```

**Version**: 2.0.0 - Data-driven configuration with 9 language support

## How it works

### Automatic lint hooks
When you edit or create files using Claude Code, the plugin automatically:

1. Detects the file type (`.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.pyi`, `.swift`, `.kt`, `.kts`, `.go`, `.rs`, `.cpp`, `.cc`, `.cxx`, `.h`, `.hpp`, `.rb`, `.php`)
2. Scans project root for linter configuration files
3. Verifies linter binaries are available on your system
4. Blocks with install commands if required linters are missing
5. Runs appropriate linters with auto-fix options
6. Reports any remaining issues to Claude

### Supported linters

| Language | Linters | Configuration files |
|----------|---------|---------------------|
| JavaScript/TypeScript | ESLint, Prettier, TypeScript | `.eslintrc*`, `.prettierrc*`, `tsconfig.json`, `package.json` |
| Python | Ruff, Black, isort, mypy | `pyproject.toml`, `ruff.toml`, `setup.cfg`, `.isort.cfg`, `mypy.ini` |
| Swift | SwiftLint, SwiftFormat | `.swiftlint.yml`, `.swiftformat` |
| Kotlin | ktlint, Detekt | `.editorconfig`, `build.gradle*`, `detekt.yml`, `.detekt/config.yml` |
| Go | golangci-lint | `.golangci.yml`, `.golangci.yaml`, `.golangci-lint.yml` |
| Rust | Clippy, rustfmt | `Cargo.toml`, `.clippy.toml`, `rustfmt.toml` |
| C/C++ | clang-tidy | `.clang-tidy` |
| Ruby | RuboCop | `.rubocop*`, `.rubocop-todo.yml` |
| PHP | PHP_CodeSniffer | `phpcs.xml`, `.phpcs.xml`, `phpcs.ruleset.xml`, `php-ruleset.xml` |

### Auto-fix behavior

Most linters include auto-fix options that automatically resolve common issues:

| Linter | Auto-fix option | What it does |
|---------|----------------|--------------|
| ESLint | `--fix` | Fixes common code style and syntax issues |
| Prettier | `--write` | Formats code to match style rules |
| Ruff | `--fix` | Fixes imports, formatting, and simple issues |
| Black | (default) | Formats Python code consistently |
| isort | (default) | Sorts and organizes imports |
| SwiftLint | `--autocorrect` | Auto-corrects Swift style violations |
| SwiftFormat | (default) | Formats Swift code |
| ktlint | `--format` | Formats Kotlin code to style guide |
| golangci-lint | `--fix` | Auto-fixes common Go lint issues |
| Clippy | `--fix` | Fixes Rust lints and warnings |
| rustfmt | (default) | Formats Rust code |
| RuboCop | `--auto-correct` | Auto-corrects Ruby style violations |

**Note**: Some linters (Detekt, clang-tidy, PHP_CodeSniffer) don't have auto-fix options - they only report issues for manual resolution.

## Usage

### Automatic linting
No setup required! Just edit files and the plugin will automatically run linters.

If a required linter is configured but not installed, the plugin will:
- Block the file edit
- Show the exact install command needed
- Provide a link to official documentation

### Checking Linter Status

Run `/lint:status` to see:

- Which linters are configured in your project
- Which linter binaries are available on your system
- Installation commands for any missing linters
- Documentation links for each linter

### Manual fix guidance

When auto-fix fails or for linters without auto-fix, Claude will use the `lint-fixer` skill to provide specific guidance for fixing lint issues.

## Configuration

The plugin automatically detects your project's linter configuration by scanning for configuration files at the project root. Ensure you have:

1. **Linters installed** (e.g., `npm install -g eslint prettier`, `pip install ruff black`)
2. **Configuration files** in your project root (see table above for each language's supported files)
3. **Project structure** with standard layout

## Example workflow

1. Edit a TypeScript file in Claude Code
2. Plugin automatically runs ESLint and Prettier
3. If Prettier is missing, Claude blocks and shows:
   ```
   Required linters are not installed:
   
   - Prettier: npm install -g prettier
     Docs: https://prettier.io/docs/en/install.html
   ```
4. Install Prettier and retry the file edit
5. Linting succeeds, file is committed

## Plugin Structure

```
lint/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── hooks/
│   └── hooks.json              # Hook configuration
├── scripts/
│   ├── linters.json              # Data-driven linter definitions
│   └── lint-detector.py          # Main lint detection script
├── skills/
│   └── lint-fixer/
│       └── SKILL.md            # Skill for manual lint fixing
└── commands/
    └── lint-status.md            # Lint status command
```

## Requirements

- Claude Code 1.0.33 or later
- Supported languages: Python 3.8+, Node.js 14+, Swift 5.3+, Kotlin 1.5+, Go 1.16+, Rust 1.60+, C/C++ compiler, Ruby 2.5+, PHP 7.2+
- Linters must be installed in the project or globally
