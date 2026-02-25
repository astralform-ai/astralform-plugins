# Motion Guidelines (Apple HIG)

## Principles

### Purposeful
Motion should have a clear purpose. Don't animate for the sake of animation.

### Consistent
Use consistent animation timing and curves throughout your app.

### Natural
Animations should feel like natural physical interactions.

### Responsive
Interface should respond immediately to user interaction.

## Timing Recommendations

| Animation Type | Duration | Curve |
|---------------|----------|-------|
| Micro-interactions | 100-200ms | Ease-out |
| Standard transitions | 200-300ms | Ease-in-out |
| Complex sequences | 300-500ms | Spring |
| Large movements | 400-600ms | Spring |

## Spring Parameters Guide

### Interactive Elements
```swift
.animation(.spring(response: 0.3, dampingFraction: 0.7), value: state)
```
- Quick response
- Slight bounce for feedback

### Content Transitions
```swift
.animation(.spring(response: 0.4, dampingFraction: 0.8), value: state)
```
- Smooth motion
- Minimal bounce

### Large Views
```swift
.animation(.spring(response: 0.5, dampingFraction: 0.85), value: state)
```
- Slower start
- Very subtle bounce

## When to Animate

### Do Animate
- State changes that affect layout
- View transitions
- User feedback (taps, selections)
- Loading states
- Error states

### Don't Animate
- Continuous updates (scroll position)
- Very small changes (single pixel)
- High-frequency updates
- Critical information display

## Accessibility

### Respect System Settings
```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

var body: some View {
    content
        .animation(reduceMotion ? .none : .spring(), value: state)
}
```

### Provide Alternatives
- Use crossfade instead of motion for reduced motion
- Ensure information isn't conveyed only through animation
- Test with accessibility features enabled

## Performance

### Best Practices
1. Avoid animating large images or complex views
2. Use `drawingGroup()` for complex static content
3. Prefer opacity/scale over frame changes
4. Use Metal shaders sparingly

### Common Issues
- Too many simultaneous animations
- Animating during scroll
- Complex view hierarchies in transitions
