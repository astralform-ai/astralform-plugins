# Swift Concurrency Common Mistakes

## Critical Mistakes

### 1. Thinking async = background

**Wrong assumption**: Async code automatically runs in the background.

```swift
// This STILL blocks the main thread!
func processData() async {
    // Synchronous CPU work blocks whatever actor we're on
    let result = heavyComputation()  // Blocks!
    return result
}
```

**Fix**: Use `@concurrent` for CPU-bound work (Swift 6.2+) or `Task.detached` (earlier versions).

```swift
@concurrent
func processData() async -> Result {
    return heavyComputation()  // Now truly runs in background
}
```

### 2. Blocking the cooperative pool

```swift
// NEVER do this inside async context
func badAsync() async {
    semaphore.wait()  // Blocks the cooperative thread pool!
    // ...
}
```

**Fix**: Use async-compatible synchronization.

```swift
func goodAsync() async {
    await withCheckedContinuation { continuation in
        semaphore.wait()
        continuation.resume()
    }
}
```

### 3. Actor overuse

Don't create actors just to fix compiler errors. Use the **Actor Justification Test**:

1. Does it have mutable state that MUST be accessed concurrently?
2. Does MainActor isolation not suffice?
3. Is the state independent from UI?
4. Can you articulate the performance benefit?

If you can't answer "yes" to all, use `@MainActor` or leave non-isolated.

## Common Mistakes

### 4. Unnecessary `MainActor.run`

```swift
// Verbose and error-prone
func updateUI() async {
    await MainActor.run {
        label.text = "Updated"
    }
}

// Better: Mark the function
@MainActor
func updateUI() async {
    label.text = "Updated"
}
```

### 5. Creating Tasks when not needed

```swift
// If you're already in async context, no Task needed
func fetchData() async {
    Task {  // Unnecessary!
        let data = await download()
        process(data)
    }
}

// Just call directly
func fetchData() async {
    let data = await download()
    process(data)
}
```

### 6. Making everything Sendable

Not all types need to be Sendable. A non-Sendable type used within a single isolation domain is perfectly fine.

```swift
// Don't do this blindly
struct User: @unchecked Sendable {  // Unnecessary!
    var name: String
}

// This is fine if User stays within one actor
struct User {
    var name: String
}
```

## SwiftUI-Specific Mistakes

### 7. Views not MainActor-isolated

```swift
// Problem: SwiftUI Views should be @MainActor
struct ProfileView: View {
    @State private var data: Data?

    var body: some View {
        // ...
    }
    .task {
        // This might not be on MainActor in older Swift
    }
}
```

**Fix**: Use `@Observable` (iOS 17+) or ensure proper isolation.

### 8. Accessing @State from detached tasks

```swift
struct BadView: View {
    @State private var count = 0

    var body: some View {
        Button("Increment") {
            Task.detached {  // Wrong!
                count += 1  // Data race!
            }
        }
    }
}
```

**Fix**: Use inheriting Task or MainActor.assumeIsolated.

## Anti-Patterns

### 9. Using actors to fix compiler errors

```swift
// Don't do this
actor NetworkManager {  // Why an actor?
    func fetch() async -> Data { ... }
}

// If it doesn't have mutable state, it doesn't need isolation
struct NetworkManager {
    func fetch() async -> Data { ... }
}
```

### 10. @preconcurrency as blanket solution

```swift
// Lazy fix that hides real issues
@preconcurrency import SomeLibrary

// Better: Properly adopt concurrency patterns
import SomeLibrary
// Update code to be concurrency-safe
```
