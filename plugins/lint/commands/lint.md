---
description: Run linters on the current project or specific files
---

# Lint Command

Run linters on the current project or specific files to check for code quality issues.

## Usage

`/lint:check` - Run all configured linters on the entire project
`/lint:check $ARGUMENTS` - Run linters on specific files or directories

## What this command does

1. Detects the project type based on configuration files
2. Runs all configured linters for the detected languages
3. Reports any lint errors found
4. Attempts auto-fix where possible
5. Provides guidance for manual fixes

## Supported languages and linters

### JavaScript/TypeScript
- **ESLint**: Code quality and style rules
- **Prettier**: Code formatting
- **TypeScript**: Type checking

### Python
- **Ruff**: Fast Python linter and formatter
- **Black**: Code formatting
- **isort**: Import sorting
- **mypy**: Type checking

### Swift
- **SwiftLint**: Style and convention enforcement
- **SwiftFormat**: Code formatting

### Kotlin
- **ktlint**: Kotlin style guide enforcement
- **Detekt**: Static code analysis

## Examples

### Check entire project
```
/lint:check
```

### Check specific files
```
/lint:check src/utils.ts tests/test_api.py
```

### Check a directory
```
/lint:check src/
```

## How to use

When you run this command, I will:

1. **Analyze the project structure** to determine which linters are configured
2. **Run the appropriate linters** on the specified files or the entire project
3. **Report findings** with clear error messages and line numbers
4. **Suggest fixes** for each issue
5. **Offer to apply auto-fixes** where possible

## Common issues and solutions

### "Command not found" errors
Ensure the linter is installed:
```bash
# JavaScript/TypeScript
npm install --save-dev eslint prettier typescript

# Python
pip install ruff black isort mypy

# Swift
brew install swiftlint swiftformat

# Kotlin
# ktlint is available via Homebrew or SDKMAN
```

### Configuration file missing
Create basic configuration files:

**ESLint** (.eslintrc.json):
```json
{
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest"
  }
}
```

**Prettier** (.prettierrc):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

**Ruff** (pyproject.toml):
```toml
[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "W"]
```

## Integration with auto-fix

This command will:
- Attempt to auto-fix formatting issues (Prettier, Black, SwiftFormat, ktlint)
- Apply safe fixes for lint rules (ESLint --fix, Ruff --fix)
- Report issues that require manual intervention

## After running

If lint issues are found:
1. Review each error message
2. Apply suggested fixes
3. Run the command again to verify
4. Consider enabling the lint-fixer skill for complex issues

## Best practices

1. **Run regularly**: Integrate linting into your workflow
2. **Fix early**: Address issues as they appear
3. **Consistency**: Ensure team members use the same lint rules
4. **CI/CD**: Add lint checks to your continuous integration pipeline