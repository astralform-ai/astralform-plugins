# iOS Developer Plugin

Comprehensive iOS development expertise for Claude Code, featuring Swift 6+ concurrency patterns, SwiftUI animations, and Swift Evolution tracking.

## Features

### Agent
- **ios-developer**: Full-stack iOS development expert covering Swift, SwiftUI, UIKit, architecture patterns, networking, testing, and App Store deployment.

### Skills

#### swift-concurrency
Guide for building, auditing, and refactoring Swift code using modern concurrency patterns (Swift 6+).
- async/await, Tasks, actors, MainActor
- Sendable types and isolation domains
- Migration from callbacks/Combine
- Approachable Concurrency settings

#### swiftui-animation
Comprehensive guidance for implementing advanced SwiftUI animations and visual effects.
- Spring and timing curve animations
- View transitions
- Matched geometry effects (hero animations)
- Metal shader integration

#### swift-evolution
Track and understand Swift language evolution proposals.
- Proposal stages (0-4)
- Finding proposals by number/status/version
- Planning migrations based on Swift versions

## Installation

This plugin is part of the astralform-plugins marketplace. Install via:

```bash
# In Claude Code
/plugins install astralform-plugins
```

## Usage

The ios-developer agent and skills are automatically activated based on context when working on iOS-related tasks.

### Manual Skill Invocation
```
/ios-developer:swift-concurrency
/ios-developer:swiftui-animation
/ios-developer:swift-evolution
```

## Attribution

- **swift-concurrency** and **swiftui-animation** skills adapted from [jamesrochabrun/skills](https://github.com/jamesrochabrun/skills)
- **swift-evolution** information from [swiftlang/swift-evolution](https://github.com/swiftlang/swift-evolution) and [swift.org](https://www.swift.org/swift-evolution/)

## License

MIT
