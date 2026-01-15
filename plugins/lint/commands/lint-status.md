---
description: Show linting status and configuration for current project
---

# Lint Status

Shows which linters are configured, available, and missing in your current project.

## Usage

`/lint:status`

## Output Format

```
## Project Linter Status

### JavaScript/TypeScript
✅ ESLint       [Configured + Available]
❌ Prettier     [Configured but Missing]
   Install: npm install -g prettier
   Docs: https://prettier.io/docs/en/install.html

### Python
✅ Ruff         [Configured + Available]
✅ Black        [Configured + Available]
✅ mypy         [Configured + Available]

### Swift
✅ SwiftLint     [Configured + Available]
❌ SwiftFormat   [Configured but Missing]
   Install: brew install swiftformat
   Docs: https://github.com/nicklockwood/SwiftFormat

### Kotlin
❌ No linters configured

### Go
❌ No linters configured

### Rust
❌ No linters configured

### C/C++
❌ No linters configured

### Ruby
❌ No linters configured

### PHP
❌ No linters configured
```

## Status Symbols

- ✅ Green: Configured and available
- ❌ Red: Configured but binary missing
- ⚠️ Yellow: Available but not configured
- ⬜ White: Not configured

## Next Steps

If linters are missing:
1. Run the install command shown
2. Retry the file edit that triggered linting
3. Run `/lint:status` again to verify
