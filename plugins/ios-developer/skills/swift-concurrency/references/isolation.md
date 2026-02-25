# Swift Concurrency Isolation Reference

## Three Isolation Domains

### 1. MainActor
- UI-related code
- Accessing UIKit/AppKit views
- SwiftUI view updates
- Default for new projects with Approachable Concurrency

### 2. Actors
- Custom isolation domains
- Concurrent access to mutable state
- Independent from UI

### 3. Nonisolated
- Pure functions
- No shared mutable state
- Inherited from caller (Swift 6.2+)

## Office Building Metaphor

Think of isolation domains as rooms in an office building:

| Domain | Metaphor | Access |
|--------|----------|--------|
| MainActor | Lobby | Everyone passes through, main coordination point |
| Actor | Private office | Only one person at a time |
| Nonisolated | Open floor plan | Anyone can access freely |

## Isolation Inheritance

Code inherits isolation from its context:

```swift
@MainActor
class ViewModel {
    // All methods inherit MainActor
    func fetchData() async { }  // @MainActor

    func process() { }  // Also @MainActor (sync methods too!)
}

// Task inheritance
@MainActor
func example() {
    Task {
        // Inherits MainActor from caller
    }

    Task.detached {
        // Does NOT inherit - starts fresh
    }
}
```

## Breaking Inheritance

### Task.detached
```swift
@MainActor
func example() async {
    Task.detached {
        // Not on MainActor anymore
        // Cannot access MainActor-isolated state directly
    }
}
```

### nonisolated keyword
```swift
@MainActor
class ViewModel {
    nonisolated func pureComputation() -> Int {
        // Not isolated, can be called from anywhere
        // Cannot access instance properties
        return 42
    }
}
```

## Actor Justification Test

Before creating a custom actor, answer these questions:

1. **Concurrent access needed?** - Does the state truly need concurrent access from multiple contexts?
2. **MainActor insufficient?** - Why can't this live on MainActor?
3. **Independent from UI?** - Is this state completely separate from UI concerns?
4. **Performance benefit clear?** - Can you articulate the performance gain?

If any answer is "no" or uncertain, prefer `@MainActor` or non-isolated.

## Approachable Concurrency (Swift 6.2+)

### Build Settings
```
SWIFT_DEFAULT_ACTOR_ISOLATION = MainActor
SWIFT_APPROACHABLE_CONCURRENCY = YES
```

### Effects
- New code starts on MainActor by default
- `nonisolated async` stays on caller's actor
- Fewer Sendable errors
- Simpler mental model

### Migration
For existing projects, enable incrementally:
1. Start with new files
2. Gradually update existing code
3. Use per-file settings initially
