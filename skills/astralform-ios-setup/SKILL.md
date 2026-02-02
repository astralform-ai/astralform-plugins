---
description: Integrate Astralform iOS SDK into Swift/SwiftUI projects. Use when user asks to "add Astralform", "integrate Astralform SDK", "setup Astralform in iOS app", or "configure Astralform Swift client".
---

# Astralform iOS SDK Integration

This skill automates the integration of the Astralform iOS SDK into Swift projects.

## When to Use

- User asks to add/integrate Astralform SDK
- User wants to set up AI chat in their iOS app
- User needs to configure Astralform in a Swift/SwiftUI project
- User mentions "Astralform iOS", "Astralform Swift", or "Astralform SDK"

## Prerequisites

Before integration, ensure:
1. User has an Astralform project with an API key
2. Xcode project exists with Swift Package Manager or CocoaPods
3. Minimum iOS deployment target is 15.0+

## Integration Steps

### Step 1: Detect Project Type

Look for these files to determine dependency manager:
- `Package.swift` → Swift Package Manager
- `Podfile` → CocoaPods
- `*.xcodeproj` without above → Manual/SPM via Xcode

### Step 2: Add Dependency

**For Swift Package Manager (Package.swift):**
```swift
dependencies: [
    .package(url: "https://github.com/astralform/astralform-ios.git", from: "1.0.0")
]
```

**For CocoaPods (Podfile):**
```ruby
pod 'Astralform', '~> 1.0'
```

**For Xcode SPM:**
Instruct user to:
1. File → Add Package Dependencies
2. Enter: `https://github.com/astralform/astralform-ios.git`
3. Select version rule: Up to Next Major

### Step 3: Find App Entry Point

Search for the app entry point:
- SwiftUI: Look for `@main struct` with `App` protocol
- UIKit: Look for `AppDelegate` class with `@main` or `@UIApplicationMain`

Common patterns:
```swift
// SwiftUI
@main
struct MyApp: App { ... }

// UIKit
@main
class AppDelegate: UIResponder, UIApplicationDelegate { ... }
```

### Step 4: Add Configuration Code

**SwiftUI App:**
```swift
import Astralform

@main
struct MyApp: App {
    init() {
        Astralform.configure(
            apiKey: "YOUR_API_KEY",
            baseURL: URL(string: "https://api.astralform.ai")!
        )
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

**UIKit AppDelegate:**
```swift
import Astralform

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        Astralform.configure(
            apiKey: "YOUR_API_KEY",
            baseURL: URL(string: "https://api.astralform.ai")!
        )
        return true
    }
}
```

### Step 5: Add Chat View

**SwiftUI integration:**
```swift
import SwiftUI
import Astralform

struct ContentView: View {
    @State private var showChat = false

    var body: some View {
        Button("Open AI Chat") {
            showChat = true
        }
        .sheet(isPresented: $showChat) {
            AstralformChatView(
                endUserId: "user_123", // Unique identifier for this user
                systemPrompt: "You are a helpful assistant."
            )
        }
    }
}
```

**UIKit integration:**
```swift
import UIKit
import Astralform

class ViewController: UIViewController {
    @IBAction func openChat(_ sender: Any) {
        let chatVC = AstralformChatViewController(
            endUserId: "user_123",
            systemPrompt: "You are a helpful assistant."
        )
        present(chatVC, animated: true)
    }
}
```

### Step 6: Configure Client MCP Tools (Optional)

If the project uses client-side MCP tools (calendar, contacts, etc.):

```swift
import Astralform

// Register client tool handlers
Astralform.registerClientTool("calendar_events") { parameters async throws -> ToolResult in
    // Fetch calendar events
    let events = try await fetchCalendarEvents(parameters)
    return .success(events)
}

Astralform.registerClientTool("add_reminder") { parameters async throws -> ToolResult in
    // Add reminder
    try await addReminder(parameters)
    return .success(["status": "created"])
}
```

### Step 7: Provide Test Code

Add a simple test to verify integration:

```swift
// Add to a test file or playground
import Astralform

Task {
    do {
        let response = try await Astralform.shared.chat(
            message: "Hello, are you working?",
            endUserId: "test_user"
        )
        print("AI Response: \(response.content)")
    } catch {
        print("Error: \(error)")
    }
}
```

## Security Best Practices

1. **Never hardcode API keys** - Use environment variables or secure storage:
   ```swift
   let apiKey = ProcessInfo.processInfo.environment["ASTRALFORM_API_KEY"] ?? ""
   ```

2. **Use different keys for dev/prod**:
   ```swift
   #if DEBUG
   let apiKey = "sk_test_..."
   #else
   let apiKey = "sk_live_..."
   #endif
   ```

3. **Validate end user IDs** - Use authenticated user identifiers

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No such module 'Astralform'" | Clean build, reset package caches |
| Network errors | Check API key and baseURL |
| Chat not loading | Verify project has LLM configured |
| Tool calls failing | Check client tool registration |

## After Integration

Remind user to:
1. Replace `YOUR_API_KEY` with actual key from Astralform dashboard
2. Set appropriate `endUserId` for user tracking
3. Configure system prompt for their use case
4. Test in both simulator and device
