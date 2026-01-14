---
name: lint-fixer
description: Fix lint issues when auto-fix fails. Use when lint errors are reported or when code quality needs improvement.
---

# Lint Fixer Skill

This skill helps you fix lint issues when automatic fixing fails. It provides guidance for manually resolving common lint errors across different programming languages.

## When to use this skill

Use this skill when:
1. Automatic lint fixing fails
2. Lint errors are reported in the output
3. You need to understand and fix specific lint rules
4. You want to improve code quality beyond automatic fixes

## How to fix lint issues

### 1. Analyze the lint error message
- Identify the file and line number mentioned in the error
- Understand the error type (syntax, style, type, etc.)
- Check if it's a warning or an error

### 2. Common lint error patterns by language

#### JavaScript/TypeScript
- **ESLint errors**:
  - `no-unused-vars`: Remove unused variables or export them if needed
  - `prefer-const`: Change `let` to `const` for variables that aren't reassigned
  - `eqeqeq`: Use `===` instead of `==` for strict equality
  - Missing semicolons: Add `;` at end of statements
  - Trailing commas: Add/remove trailing commas in objects/arrays

- **Prettier formatting**:
  - Line length exceeded: Break long lines
  - Indentation issues: Fix spacing (2 spaces per indent)
  - Quote consistency: Use single or double quotes consistently

- **TypeScript errors**:
  - Type mismatches: Ensure variable types match assignments
  - Missing types: Add explicit type annotations
  - `any` type usage: Replace with specific types

#### Python
- **Ruff/Flake8 errors**:
  - `E501`: Line too long (max 88 chars for Black, 79 for PEP 8)
  - `F401`: Unused import - remove unused imports
  - `E302`: Expected 2 blank lines before function/class definition
  - `W293`: Blank line contains whitespace - remove trailing spaces

- **Black formatting**:
  - Indentation: Use 4 spaces per indent
  - Line breaks: Break long lines at logical points
  - Trailing commas: Add trailing commas in multi-line collections

- **mypy type errors**:
  - Missing return type: Add `-> ReturnType` to function definitions
  - Incompatible types: Ensure types match in assignments and returns
  - Missing imports: Import necessary type definitions

#### Swift
- **SwiftLint errors**:
  - `colon`: Ensure colons have correct spacing (no space before, one space after)
  - `trailing_whitespace`: Remove whitespace at end of lines
  - `vertical_whitespace`: Ensure correct blank line spacing
  - `opening_brace`: Opening braces should be on same line

- **SwiftFormat issues**:
  - Indentation: Use 2 spaces (not tabs)
  - Line wrapping: Break long lines at operators
  - Spacing: Ensure consistent spacing around operators

#### Kotlin
- **ktlint errors**:
  - Indentation: Use 4 spaces (not tabs)
  - Max line length: Break lines exceeding 120 chars
  - Trailing commas: Add trailing commas in multi-line declarations
  - Import ordering: Organize imports alphabetically

- **Detekt issues**:
  - Complexity: Reduce cyclomatic complexity in functions
  - Naming: Follow Kotlin naming conventions (camelCase)
  - Magic numbers: Replace with named constants

### 3. Manual fixing steps

1. **Open the file** using the Read tool
2. **Navigate to the line number** mentioned in the error
3. **Understand the context** around the error
4. **Apply the fix** based on the lint rule
5. **Check related code** for similar issues
6. **Run the linter manually** to verify fixes

### 4. Running linters manually

If you need to test fixes, run these commands:

```bash
# JavaScript/TypeScript
npx eslint --fix path/to/file.js
npx prettier --write path/to/file.js
npx tsc --noEmit path/to/file.ts

# Python
ruff check --fix path/to/file.py
black path/to/file.py
mypy path/to/file.py

# Swift
swiftlint --autocorrect path/to/file.swift
swiftformat path/to/file.swift

# Kotlin
ktlint --format path/to/file.kt
./gradlew detekt --input path/to/file.kt
```

### 5. When to skip or suppress lint errors

Only suppress lint errors when:
- The lint rule is intentionally disabled for the project
- The code pattern is necessary for compatibility
- There's a false positive that can't be fixed

To suppress:
- **ESLint**: Add `// eslint-disable-next-line rule-name` comment
- **Python**: Add `# noqa: error-code` comment
- **Swift**: Add `// swiftlint:disable:next rule_name` comment
- **Kotlin**: Add `@Suppress("RuleName")` annotation

### 6. Best practices

1. **Fix root causes, not symptoms**: Understand why the error occurs
2. **Check project configuration**: Some rules may be customized
3. **Run tests after fixing**: Ensure changes don't break functionality
4. **Consider auto-fix first**: Try running auto-fix commands before manual fixes
5. **Document intentional violations**: Comment why a rule is suppressed

## Example workflow

```
1. Read lint error: "src/utils.ts:15:5 - error: 'someVar' is assigned a value but never used"
2. Open src/utils.ts and go to line 15
3. Check if 'someVar' is actually used
4. If unused, remove the variable declaration
5. Check for similar unused variables in the file
6. Run `npx eslint --fix src/utils.ts` to verify fix
7. Commit changes with message: "fix: remove unused variables in utils.ts"
```

## Additional resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Ruff Rules](https://docs.astral.sh/ruff/rules/)
- [Black Configuration](https://black.readthedocs.io/en/stable/usage_and_configuration/)
- [SwiftLint Rules](https://realm.github.io/SwiftLint/rule-directory.html)
- [ktlint Rules](https://pinterest.github.io/ktlint/rules/standard/)