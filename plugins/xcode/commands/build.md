---
description: Build a Swift package or Xcode project
allowed-tools:
  - Bash
---

# /xcode:build

Build a Swift package or Xcode project.

## Arguments

- `debug` (default): Build for debugging
- `release`: Build with optimizations
- `clean`: Clean build artifacts first

## Instructions

Based on `$ARGUMENTS`:

### `debug` or no argument
```bash
swift build
```

### `release`
```bash
swift build -c release
```

### `clean`
```bash
swift package clean && swift build
```

## Output

Report the build result:
- If successful: "Build succeeded" with timing
- If failed: Show errors and suggest fixes

Common fixes:
- Missing dependencies: `swift package resolve`
- Cache issues: `swift package clean`
- Swift version mismatch: Check `Package.swift` swift-tools-version

$ARGUMENTS
