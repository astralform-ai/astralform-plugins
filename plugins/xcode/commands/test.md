---
description: Run Swift package tests
allowed-tools:
  - Bash
---

# /xcode:test

Run the Swift package test suite.

## Arguments

- `all` (default): Run all tests
- `filter [name]`: Run tests matching filter
- `verbose`: Run with verbose output
- `coverage`: Run with code coverage

## Instructions

Based on `$ARGUMENTS`:

### `all` or no argument
```bash
swift test
```

### `filter [name]`
```bash
swift test --filter $FILTER_NAME
```

### `verbose`
```bash
swift test -v
```

### `coverage`
```bash
swift test --enable-code-coverage
```

## Output

Report the test results:
- Number of tests run
- Pass/fail count
- Failed test names with brief error

If tests fail, suggest:
1. Check the specific test file
2. Look for `@MainActor` isolation issues (Swift 6 strict concurrency)
3. Verify async/await handling

$ARGUMENTS
