---
description: Detect and display the Swift version used in the current project
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# /ios-developer:swift-version

Detect the Swift version configured for the current iOS/macOS project.

## Execution

Run the following checks in order:

### 1. Check Xcode Projects
```bash
# Find all .xcodeproj and check SWIFT_VERSION
find . -name "*.xcodeproj" -exec sh -c 'echo "=== $1 ===" && grep -a "SWIFT_VERSION" "$1/project.pbxproj" | head -5' _ {} \;
```

### 2. Check Swift Package
```bash
# Check Package.swift swift-tools-version
if [ -f "Package.swift" ]; then
  echo "=== Package.swift ===" && head -1 Package.swift
fi
```

### 3. Check .swift-version file
```bash
if [ -f ".swift-version" ]; then
  echo "=== .swift-version ===" && cat .swift-version
fi
```

### 4. Check Podfile
```bash
if [ -f "Podfile" ]; then
  echo "=== Podfile ===" && grep "swift_version" Podfile || echo "No swift_version specified"
fi
```

### 5. System Swift (fallback)
```bash
echo "=== System Swift ===" && swift --version 2>/dev/null || echo "Swift not found"
```

## Output Format

After running the checks, summarize:

```
📋 Swift Version Detection Results

Project Swift Version: X.Y (from <source>)
System Swift Version: A.B

⚠️ Note: Project version differs from system version
   - Use project version for feature availability checks
   - Features requiring Swift > X.Y will not compile

🔗 Useful links:
   - Swift Evolution: https://www.swift.org/swift-evolution/
   - Xcode versions: https://developer.apple.com/support/xcode/
```

## Arguments

None. The command auto-detects from project files.

$ARGUMENTS
