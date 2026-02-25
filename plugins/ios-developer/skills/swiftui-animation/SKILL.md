---
name: swiftui-animation
description: This skill provides comprehensive guidance for implementing advanced SwiftUI animations, transitions, matched geometry effects, and Metal shader integration. Use when building animations, view transitions, hero animations, or GPU-accelerated effects in SwiftUI apps for iOS and macOS.
---

# SwiftUI Animation

## Overview

This skill provides comprehensive guidance for implementing sophisticated animations and visual effects in SwiftUI. It covers basic animations, complex transitions, matched geometry effects, and Metal shader integration for GPU-accelerated graphics.

**Core principle**: SwiftUI animations should feel natural and responsive, following Apple's Human Interface Guidelines for motion and feedback.

## Animation Types Decision Tree

```
What kind of animation do you need?
│
├─► Simple property changes (color, opacity, frame)
│   └─► Use .animation() modifier
│
├─► State-driven transitions between views
│   └─► Use .transition() with AnyTransition
│
├─► Hero animations / shared elements
│   └─► Use matchedGeometryEffect()
│
└─► Complex visual effects / particles
    └─► Use Metal shaders via ShaderView
```

## Animation Basics

### Spring Animations

```swift
// Interactive spring (bouncy, responsive)
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: isActive)

// Smooth spring (polished, less bouncy)
.animation(.spring(response: 0.4, dampingFraction: 0.8), value: isExpanded)

// Stiff spring (quick, minimal bounce)
.animation(.spring(response: 0.2, dampingFraction: 0.9), value: isSelected)
```

### Timing Curves

```swift
// Ease in-out (natural acceleration/deceleration)
.animation(.easeInOut(duration: 0.3), value: position)

// Ease in (slow start, fast end)
.animation(.easeIn(duration: 0.2), value: opacity)

// Ease out (fast start, slow end)
.animation(.easeOut(duration: 0.25), value: scale)
```

### Animation Modifiers

```swift
// Animate specific value changes
.scaleEffect(isPressed ? 0.95 : 1.0)
.animation(.spring(), value: isPressed)

// Conditional animation
if shouldAnimate {
    .animation(.default, value: state)
}

// Transaction for grouped animations
.transaction { transaction in
    transaction.animation = .spring()
}
```

## Transitions

### Basic Transitions

```swift
// Opacity fade
.transition(.opacity)

// Scale from center
.transition(.scale)

// Slide from edge
.transition(.slide)
.transition(.slide(edge: .leading))

// Combined transitions
.transition(.asymmetric(
    insertion: .scale.combined(with: .opacity),
    removal: .opacity
))
```

### Custom Transitions

```swift
// Extension on AnyTransition
extension AnyTransition {
    static var slideAndFade: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .trailing).combined(with: .opacity),
            removal: .move(edge: .leading).combined(with: .opacity)
        )
    }

    static func popup() -> AnyTransition {
        .asymmetric(
            insertion: .scale(scale: 0.8).combined(with: .opacity),
            removal: .scale(scale: 0.8).combined(with: .opacity)
        )
    }
}
```

### Transition with Modifier

```swift
// Active vs identity states
.transition(.modifier(
    active: CustomModifier(opacity: 0, scale: 0.8),
    identity: CustomModifier(opacity: 1, scale: 1.0)
))
```

## Matched Geometry Effect

### Basic Hero Animation

```swift
struct ContentView: View {
    @State private var isExpanded = false
    @Namespace private var namespace

    var body: some View {
        if isExpanded {
            ExpandedView()
                .matchedGeometryEffect(id: "hero", in: namespace)
        } else {
            CompactView()
                .matchedGeometryEffect(id: "hero", in: namespace)
        }
    }
}
```

### List to Detail Transition

```swift
struct ListView: View {
    @Namespace private var namespace
    @State private var selectedItem: Item?

    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(items) { item in
                    ItemCell(item: item)
                        .matchedGeometryEffect(
                            id: item.id,
                            in: namespace,
                            isSource: selectedItem == nil
                        )
                        .onTapGesture {
                            withAnimation(.spring()) {
                                selectedItem = item
                            }
                        }
                }
            }
        }
        .overlay {
            if let item = selectedItem {
                DetailView(item: item)
                    .matchedGeometryEffect(
                        id: item.id,
                        in: namespace,
                        isSource: false
                    )
                    .transition(.asymmetric(
                        insertion: .opacity,
                        removal: .opacity
                    ))
            }
        }
    }
}
```

### Matched Geometry Best Practices

```swift
// Use isSource to control which view is the source of truth
.matchedGeometryEffect(
    id: "profile",
    in: namespace,
    properties: .frame,  // .frame, .position, or .size
    anchor: .center,
    isSource: true
)

// Handle complex layouts with multiple namespaces
@Namespace private var cardNamespace
@Namespace private var imageNamespace
```

## Metal Shaders

### Basic Shader Integration

```swift
import SwiftUI

// Define shader from Metal file
struct WaveShader: View {
    let shader = Shader(
        function: ShaderFunction(
            library: .default,
            name: "wave"
        ),
        arguments: [
            .float(time),
            .float2(size)
        ]
    )

    var body: some View {
        Color.blue
            .visualEffect { content, proxy in
                content.layerEffect(
                    shader,
                    maxSampleOffset: .zero,
                    isEnabled: true
                )
            }
    }
}
```

### Color Effect Shader

```swift
// Simple color transformation
[@\[shader\]](https://github.com/shader)
float4 colorWave(float2 position, float time) {
    float wave = sin(position.x * 0.1 + time) * 0.5 + 0.5;
    return float4(wave, 0.5, 1.0 - wave, 1.0);
}

// Apply in SwiftUI
.visualEffect { content, proxy in
    content.colorEffect(shader)
}
```

### Layer Effect Shader

```swift
// Distortion effect
[@\[shader\]](https://github.com/shader)
float4 ripple(
    float2 position,
    SwiftUI::Layer layer,
    float time,
    float2 center,
    float amplitude
) {
    float dist = distance(position, center);
    float ripple = sin(dist * 0.1 - time * 3.0) * amplitude;
    float2 offset = normalize(position - center) * ripple;
    return layer.sample(position + offset);
}
```

### Shader Best Practices

1. **Performance**: Use `.visualEffect` sparingly on large views
2. **Animation**: Drive shader time with `TimelineView`
3. **Compatibility**: Provide fallbacks for older iOS versions
4. **Preview**: Test shaders in Xcode Preview before production

```swift
TimelineView(.animation) { timeline in
    Color.blue
        .visualEffect { content, proxy in
            content.layerEffect(
                Shader(
                    function: .init(library: .default, name: "wave"),
                    arguments: [.float(timeline.date.timeIntervalSinceReferenceDate)]
                ),
                maxSampleOffset: .zero,
                isEnabled: true
            )
        }
}
```

## Animation Patterns

### Staggered Animations

```swift
struct StaggeredList: View {
    @State private var items: [Item] = []

    var body: some View {
        VStack {
            ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
                ItemRow(item: item)
                    .transition(.slide.combined(with: .opacity))
                    .animation(.spring().delay(Double(index) * 0.05), value: items)
            }
        }
    }
}
```

### Interactive Animations

```swift
struct DraggableCard: View {
    @State private var offset = CGSize.zero
    @State private var isDragging = false

    var body: some View {
        Card()
            .offset(offset)
            .scaleEffect(isDragging ? 1.1 : 1.0)
            .rotationEffect(.degrees(Double(offset.width) * 0.1))
            .gesture(
                DragGesture()
                    .onChanged { gesture in
                        withAnimation(.interactiveSpring()) {
                            offset = gesture.translation
                            isDragging = true
                        }
                    }
                    .onEnded { _ in
                        withAnimation(.spring()) {
                            offset = .zero
                            isDragging = false
                        }
                    }
            )
    }
}
```

### Keyframe Animations (iOS 17+)

```swift
struct BounceAnimation: View {
    @State private var isBouncing = false

    var body: some View {
        Circle()
            .frame(width: 50, height: 50)
            .keyframeAnimator(initialValue: AnimationValues(), trigger: isBouncing) { content, value in
                content
                    .scaleEffect(value.scale)
                    .offset(y: value.verticalOffset)
            } keyframes: { _ in
                KeyframeTrack(\.scale) {
                    SpringKeyframe(1.2, duration: 0.15)
                    SpringKeyframe(0.9, duration: 0.1)
                    SpringKeyframe(1.0, duration: 0.15)
                }
                KeyframeTrack(\.verticalOffset) {
                    SpringKeyframe(-20, duration: 0.15)
                    SpringKeyframe(0, duration: 0.25)
                }
            }
    }
}
```

## Quick Reference

| Modifier | Purpose |
|----------|---------|
| `.animation()` | Animate property changes |
| `.transition()` | Define view insertion/removal animation |
| `.matchedGeometryEffect()` | Hero animation between views |
| `.visualEffect()` | Apply Metal shader effects |
| `.keyframeAnimator()` | Complex multi-stage animations |

## Resources

For detailed technical reference, consult the files in `references/`:

- `motion-guidelines.md` - Apple HIG motion principles and timing recommendations

**Attribution**: This skill is adapted from [jamesrochabrun/skills](https://github.com/jamesrochabrun/skills/tree/main/skills/swiftui-animation).
