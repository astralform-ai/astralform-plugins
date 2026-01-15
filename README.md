# atom2ueki-plugins

Custom Claude plugin marketplace for code development tools.

## Overview

This is a personal plugin marketplace for Claude that provides specialized tools for software development workflows. Plugins enhance Claude's capabilities with automated code quality checks and development utilities.

**Compatible with Claude Code's official marketplace schema.**

## Available Plugins

### Lint Plugin
- **Description**: Automatically runs linters after code modifications and provides feedback
- **Supported languages**: JavaScript/TypeScript, Python, Swift, Kotlin
- **Features**: 
  - Detects lint issues in real-time
  - Provides actionable feedback
  - Suggests fixes for common problems

## Setup

Add the marketplace using one of these methods:

```bash
# Using GitHub shorthand
/plugin marketplace add atom2ueki/atom2ueki-plugins

# Using GitHub URL
/plugin marketplace add https://github.com/atom2ueki/atom2ueki-plugins

# Using local path (if cloned)
/plugin marketplace add /path/to/atom2ueki-plugins  # Ensure .claude-plugin/marketplace.json exists
```

Then install plugins:
```bash
/plugin install lint
```

## Usage

Plugins automatically activate when relevant code patterns are detected. The lint plugin runs automatically after code modifications to ensure quality standards.