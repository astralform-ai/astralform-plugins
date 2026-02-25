# Swift Concurrency Sendable Reference

## What is Sendable?

`Sendable` is a marker protocol indicating a type is safe to pass across isolation boundaries.

```swift
protocol Sendable {
    // No requirements - marker protocol
}
```

## When Types Are Sendable

### Automatically Sendable
- Value types with only Sendable members
- Functions marked `@Sendable`
- Classes with `final` and no stored properties

### Not Sendable by Default
- Classes with mutable state
- Closures (unless marked `@Sendable`)
- Types containing non-Sendable members

## Making Types Sendable

### Implicit Conformance
```swift
// Automatically Sendable - all members are Sendable
struct User: Sendable {
    let id: Int
    let name: String
}
```

### @unchecked Sendable
```swift
// Use sparingly - only when you KNOW it's safe
final class ThreadSafeCache: @unchecked Sendable {
    private let lock = NSLock()
    private var storage: [String: Any] = [:]

    func get(_ key: String) -> Any? {
        lock.lock()
        defer { lock.unlock() }
        return storage[key]
    }
}
```

## Photocopies Metaphor

| Type | Metaphor | Behavior |
|------|----------|----------|
| Value type (struct) | Photocopy | Each copy is independent |
| Reference type (class) | Shared document | Everyone sees the same thing |
| Sendable | Safe to mail | Can be sent anywhere |

## Non-Sendable Types Are Valuable

Not everything needs to be Sendable. Non-Sendable types are still thread-safe within their isolation domain.

```swift
// This is fine - stays within MainActor
@MainActor
class ViewController {
    var items: [Item] = []  // Non-Sendable, but safe

    func addItem(_ item: Item) {
        items.append(item)  // Safe - always on MainActor
    }
}
```

## Isolated Parameters Pattern

Pass the actor, not the data:

```swift
// Old way - requires Sendable
func process(data: SendableData) async { }

// New way - inherits isolation
func process(isolation: isolated (any Actor)? = #isolation) async {
    // Runs on whatever actor the caller is on
    // No Sendable requirement!
}
```

## The `sending` Keyword

One-way transfer of non-Sendable values:

```swift
func send(_ value: sending NonSendableType) async {
    // Ownership transfers - caller can't use value anymore
    // Safe because no shared access
}
```

## Protocol Conformance Mismatches

### Problem
```swift
protocol Cache {
    func get() -> any Sendable  // Requires Sendable
}

class MyCache: Cache {
    func get() -> some NonSendable  // Error!
}
```

### Solutions
1. Make the return type Sendable
2. Use `@unchecked Sendable` with justification
3. Redesign to avoid crossing boundaries

## Common Patterns

### Closures Crossing Boundaries
```swift
// Non-Sendable closure
let closure = { print("hello") }

// Make it Sendable when needed
Task { @Sendable in
    closure()  // Error if closure captures non-Sendable
}

// Fix: Capture only Sendable values
let name = "hello"  // String is Sendable
Task { @Sendable in
    print(name)  // OK
}
```

### Collections
```swift
// Array is Sendable if elements are Sendable
let users: [User] = [...]  // Sendable if User: Sendable

// Dictionary same rule
let map: [String: User] = [...]  // Sendable if User: Sendable
```
