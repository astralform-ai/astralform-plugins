---
name: lint-fixer
description: >
  Fix lint errors that require manual intervention. Use this skill when:
  - LINT ERRORS REQUIRE MANUAL FIX message appears
  - PostToolUse hook blocks with lint issues
  - ESLint, Ruff, SwiftLint, Prettier, Black, mypy, ktlint, golangci-lint, Clippy, rustfmt, clang-tidy, RuboCop, or PHP_CodeSniffer errors cannot be auto-fixed
  - Code quality issues need manual resolution
---

# Lint Fixer Skill

Fix lint errors that automatic fixing cannot resolve. This skill provides guidance for manually resolving lint errors across different programming languages.

## When to use this skill

Use this skill when:
1. Hook blocks with "LINT ERRORS REQUIRE MANUAL FIX"
2. Auto-fix ran but errors remain
3. You need to understand specific lint rules
4. Error messages reference this skill

## Quick Reference by Linter

### ESLint (JavaScript/TypeScript)
**Common non-auto-fixable errors:**
- `no-undef`: Variable/function not defined → Add import, declare global, or fix typo
- `no-unused-vars`: Variable declared but never used → Remove or use the variable
- `@typescript-eslint/no-explicit-any`: Avoid `any` type → Add proper type annotations

**Documentation:** https://eslint.org/docs/latest/rules/

### Prettier (JavaScript/TypeScript)
**Most issues auto-fix.** If not:
- Check for syntax errors preventing parsing
- Ensure file is valid JS/TS

**Documentation:** https://prettier.io/docs/en/options.html

### TypeScript
**Common errors:**
- Type mismatches → Ensure types align
- Missing properties → Add required properties
- Implicit any → Add explicit type annotations

**Documentation:** https://www.typescriptlang.org/docs/

### Ruff (Python)
**Common non-auto-fixable errors:**
- `F821`: Undefined name → Add import or fix typo
- `F841`: Local variable assigned but never used → Remove or use it
- `E902`: Syntax error → Fix Python syntax

**Documentation:** https://docs.astral.sh/ruff/rules/

### Black (Python)
**Most issues auto-fix.** If not:
- Check for syntax errors
- Ensure valid Python

**Documentation:** https://black.readthedocs.io/en/stable/

### mypy (Python)
**Common errors:**
- `error: Incompatible types` → Fix type mismatch
- `error: Missing return statement` → Add return
- `error: Module has no attribute` → Check import

**Documentation:** https://mypy.readthedocs.io/en/stable/error_codes.html

### SwiftLint (Swift)
**Common non-auto-fixable errors:**
- `identifier_name`: Naming convention violation → Rename to match convention
- `function_body_length`: Function too long → Refactor into smaller functions
- `cyclomatic_complexity`: Too complex → Simplify logic

**Documentation:** https://github.com/realm/SwiftLint/blob/main/Rules.md

### SwiftFormat (Swift)
**Most issues auto-fix.** If not:
- Check for syntax errors
- Review .swiftformat config

**Documentation:** https://github.com/nicklockwood/SwiftFormat

### ktlint (Kotlin)
**Common non-auto-fixable errors:**
- `standard:max-line-length`: Line too long → Break into multiple lines
- `standard:function-naming`: Invalid function name → Follow camelCase

**Documentation:** https://pinterest.github.io/ktlint/latest/rules/standard/

### Detekt (Kotlin)
**Common errors:**
- `complexity`: High cyclomatic complexity → Refactor
- `style`: Style violations → Follow Kotlin conventions

**Documentation:** https://detekt.dev/docs/rules/

### golangci-lint (Go)
**Common errors:**
- `unused`: Unused variable/import → Remove or use it
- `errcheck`: Unchecked error → Handle the error

**Documentation:** https://golangci-lint.run/usage/linters/

### Clippy (Rust)
**Common warnings:**
- `clippy::unwrap_used`: Using unwrap → Use expect or handle Result
- `clippy::todo`: TODO in code → Implement or remove

**Documentation:** https://rust-lang.github.io/rust-clippy/master/

### rustfmt (Rust)
**Most issues auto-fix.** If not:
- Check for syntax errors
- Review rustfmt.toml config

**Documentation:** https://rust-lang.github.io/rustfmt/

### clang-tidy (C/C++)
**Common warnings:**
- `modernize-*`: Use modern C++ features
- `readability-*`: Improve code clarity
- `performance-*`: Optimize performance

**Documentation:** https://clang.llvm.org/extra/clang-tidy/

### RuboCop (Ruby)
**Common offenses:**
- `Style/*`: Style guide violations → Follow Ruby style
- `Lint/*`: Potential bugs → Fix the issue
- `Metrics/*`: Complexity issues → Refactor

**Documentation:** https://docs.rubocop.org/rubocop/cops.html

### PHP_CodeSniffer (PHP)
**Common errors:**
- PSR-12 violations → Follow PHP Standards Recommendations
- Naming conventions → Use PSR-4 naming

**Documentation:** https://github.com/squizlabs/PHP_CodeSniffer/wiki

## How to Fix Lint Errors

### Step 1: Identify the error
```
ESLint errors:
/path/to/file.js
  3:1  error  'console' is not defined  no-undef
```
- **File:** /path/to/file.js
- **Line:** 3
- **Rule:** no-undef
- **Message:** 'console' is not defined

### Step 2: Read the file and understand context
Use the Read tool to view the code around the error line.

### Step 3: Apply the fix
Based on the rule, apply the appropriate fix:
- For `no-undef` with `console`: Add browser/node environment to ESLint config
- For unused variables: Remove the variable or use it
- For type errors: Add proper type annotations

### Step 4: Verify the fix
Run the linter manually:
```bash
# JavaScript
npx eslint path/to/file.js

# Python
ruff check path/to/file.py

# Swift
swiftlint lint path/to/file.swift
```

## Suppressing Errors (Last Resort)

Only suppress when the lint rule is wrong for your use case:

```javascript
// ESLint
// eslint-disable-next-line no-undef
console.log('allowed');
```

```python
# Ruff/Flake8
x = unused  # noqa: F841
```

```swift
// SwiftLint
// swiftlint:disable:next identifier_name
let X = 1
```

```kotlin
// Detekt
@Suppress("MagicNumber")
val x = 42
```

## Best Practices

1. **Fix root cause** - Don't just suppress errors
2. **Check project config** - Rules may be customized
3. **Run tests after fixing** - Ensure no regressions
4. **Document suppressions** - Explain why rule is disabled
