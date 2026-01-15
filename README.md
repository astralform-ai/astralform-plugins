# astralform-plugins

Custom Claude plugin marketplace for code development tools.

## Overview

This is a personal plugin marketplace for Claude that provides specialized tools for software development workflows. Plugins enhance Claude's capabilities with automated code quality checks and development utilities.

**Compatible with Claude Code's official marketplace schema.**

## Available Plugins

### Lint Plugin
- **Description**: Data-driven lint plugin with 9 language support, auto-fix integration, and blocking behavior for missing tools
- **Supported languages**: JavaScript/TypeScript, Python, Swift, Kotlin, Go, Rust, C/C++, Ruby, PHP
- **Features**: 
  - Automatic linting on file edits (Write/Edit hooks)
  - Proactive binary checking with `which()`
  - Blocks and shows install commands for missing linters
  - `/lint:status` command to view configuration
  - Auto-fix integration where available
  - `lint-fixer` skill for manual fix guidance

## Setup

Add the marketplace using one of these methods:

```bash
# Using GitHub shorthand
/plugin marketplace add atom2ueki/astralform-plugins

# Using GitHub URL
/plugin marketplace add https://github.com/atom2ueki/astralform-plugins

# Using local path (if cloned)
/plugin marketplace add /path/to/astralform-plugins  # Ensure .claude-plugin/marketplace.json exists
```

Then install plugins:
```bash
/plugin install lint
```

## Usage

The lint plugin automatically activates when files are edited or created. It checks for configured linters, verifies binary availability, and runs them with auto-fix options. If required linters are missing, it will block and show installation commands. Run `/lint:status` to view current linting configuration.