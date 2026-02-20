---
name: astralform-best-practices
description: Astralform integration best practices and optimization tips. Use when user asks about "Astralform best practices", "optimize Astralform", "Astralform security", or wants guidance on production usage.
---

# Astralform Best Practices

This skill provides guidance on best practices for Astralform integrations.

## When to Use

- User asks about best practices or optimization
- User is preparing for production deployment
- User wants to improve security, performance, or cost
- User is troubleshooting integration issues

## Categories

### 1. Security Best Practices

#### API Key Management
```swift
// NEVER do this
let apiKey = "sk_live_xxxxx" // Hardcoded - BAD!

// DO this instead
let apiKey = Bundle.main.object(forInfoDictionaryKey: "ASTRALFORM_API_KEY") as? String ?? ""

// Or use environment-based configuration
#if DEBUG
let apiKey = ProcessInfo.processInfo.environment["ASTRALFORM_API_KEY_DEV"] ?? ""
#else
let apiKey = ProcessInfo.processInfo.environment["ASTRALFORM_API_KEY_PROD"] ?? ""
#endif
```

#### End User ID Security
- Use authenticated user identifiers
- Never expose internal database IDs
- Consider hashing user IDs: `SHA256(userId + salt)`
- Implement session validation before chat

#### Data Sensitivity
- Configure conversation encryption (enabled by default)
- Use project-specific encryption keys
- Implement data retention policies
- Consider PII handling in system prompts

### 2. LLM Selection Guide

| Use Case | Recommended Provider | Model | Why |
|----------|---------------------|-------|-----|
| General chat | Anthropic | claude-sonnet-4-20250514 | Best quality/cost balance |
| High volume | Groq | llama-3.3-70b | Fast, cost-effective |
| Complex reasoning | Anthropic | claude-opus-4-20250514 | Best reasoning |
| Code generation | Anthropic | claude-sonnet-4-20250514 | Strong code understanding |
| Local/private | Ollama | llama3.2 | Data stays on-device |
| Budget conscious | Platform | varies | Optimized routing |

#### Model Selection Tips
1. Start with Claude Sonnet for most use cases
2. Monitor token usage via analytics
3. Consider Groq for high-volume, latency-sensitive apps
4. Use Ollama for privacy-critical applications

### 3. Token Optimization

#### System Prompt Best Practices
```swift
// INEFFICIENT - Too verbose
let systemPrompt = """
You are an AI assistant. You should always be helpful.
You should respond in a friendly manner. You should
provide accurate information. You should...
""" // Wastes tokens on every request

// EFFICIENT - Concise and clear
let systemPrompt = """
Helpful iOS app assistant. Be concise. Format lists with bullets.
Focus: \(appContext)
""" // Clear, specific, minimal
```

#### Conversation Management
- Implement conversation summaries for long chats
- Clear old conversations regularly
- Use `max_tokens` to limit response length
- Consider conversation context windows

### 4. Error Handling

```swift
do {
    let response = try await Astralform.shared.chat(message: userInput)
} catch AstralformError.rateLimited(let retryAfter) {
    // Implement exponential backoff
    try await Task.sleep(for: .seconds(retryAfter))
    // Retry
} catch AstralformError.networkError {
    // Show offline message, queue for retry
} catch AstralformError.invalidAPIKey {
    // Log error, prompt user to check configuration
} catch AstralformError.llmNotConfigured {
    // Project needs LLM setup in dashboard
} catch {
    // Generic error handling
}
```

### 5. Performance Optimization

#### Streaming Best Practices
```swift
// Use streaming for better UX
for try await chunk in Astralform.shared.streamChat(message: userInput) {
    // Update UI incrementally
    DispatchQueue.main.async {
        self.responseText += chunk.content
    }
}
```

#### Caching Strategies
- Cache static tool results (e.g., app configuration)
- Implement conversation history caching
- Use background refresh for non-urgent updates

#### Network Optimization
- Implement request queuing for offline support
- Use connection pooling (SDK handles this)
- Consider regional API endpoints for latency

### 6. MCP Tool Configuration

#### Tool Selection
| Tool Type | When to Use | Configuration |
|-----------|-------------|---------------|
| Platform (Tavily) | Web search needs | Enable in dashboard |
| Server MCP | Backend integrations | Add via dashboard |
| Client MCP | Device features | Register in SDK |

#### Client Tool Best Practices
```swift
// GOOD - Specific, minimal data
Astralform.registerClientTool("get_weather") { params in
    let location = params["location"] as? String ?? "current"
    let weather = await WeatherService.current(for: location)
    return .success([
        "temp": weather.temperature,
        "condition": weather.condition
    ])
}

// BAD - Returns too much data
Astralform.registerClientTool("get_all_data") { params in
    // Don't return entire database dumps
    return .success(hugeDataObject) // Wasteful!
}
```

### 7. Connector Security

#### OAuth App Best Practices
- Create dedicated OAuth apps per project (not shared across projects)
- Request minimum required scopes (principle of least privilege)
- Rotate client secrets periodically
- Use separate OAuth apps for development and production
- Monitor OAuth token usage in provider dashboards

#### API Key Connectors
- Use service-specific API keys (not personal tokens)
- Rotate API keys on a regular schedule
- Set key permissions to minimum required access
- Monitor usage through the service provider's dashboard

#### End-User Authentication
- Enable `require_auth` for connectors that access user data
- Test the OAuth flow with real end-user accounts before launch
- Handle token expiration and refresh gracefully
- Provide clear UI for users to connect/disconnect services

### 8. Production Checklist

Before going live:

- [ ] API keys are stored securely (not hardcoded)
- [ ] Using production API key (`sk_live_...`)
- [ ] LLM provider configured with production API key
- [ ] Error handling implemented for all chat calls
- [ ] Rate limiting UI feedback in place
- [ ] Analytics monitoring enabled
- [ ] Connector OAuth apps use minimum scopes
- [ ] Connector credentials are production (not dev) keys
- [ ] End-user auth flow tested with real accounts
- [ ] Appropriate system prompt configured
- [ ] End user IDs properly scoped
- [ ] Privacy policy updated for AI usage disclosure
- [ ] Tested on real devices (not just simulator)
- [ ] Agent system prompts reviewed for accuracy
- [ ] Skills assigned to appropriate agents
- [ ] Memory feature enabled if needed for personalization

### 9. Cost Management

#### Monitoring Usage
- Check analytics weekly: `/astralform-analytics`
- Set up billing alerts in dashboard
- Track per-user token consumption

#### Cost Reduction Strategies
1. Optimize system prompts (shorter = cheaper)
2. Implement conversation limits
3. Use appropriate model tiers
4. Cache frequently requested information
5. Consider Groq for high-volume features

### 10. Multi-Agent Best Practices

#### When to Use Multi-Agent
- **Single agent**: Simple Q&A, single-domain apps, low complexity
- **Multi-agent**: Multiple domains (support + sales), different tool access needs, specialized workflows

#### Architecture Guidelines
- Use the default agent as the entry point / orchestrator
- Give each agent a clear, focused description (the supervisor uses this for routing)
- Use lowercase-with-hyphens naming: `support-agent`, `billing-helper`
- Consider cheaper/faster models for simple routing agents (e.g., Groq for triage)
- Assign minimal resources per agent (only the skills/MCP servers/tools it needs)

#### System Prompt Design
```
# Good - Focused and specific
You are a billing specialist. Handle invoice queries, payment issues,
and subscription changes. Escalate security concerns to the default agent.

# Bad - Too broad
You are a helpful assistant that can do anything.
```

### 11. Skills Best Practices

#### SKILL.md Format
Skills use YAML frontmatter with markdown body:
```yaml
---
name: my-skill
description: Short description of what the skill provides
version: 1.0.0
---
# Skill content here
```

#### Guidelines
- Keep skills under 500 lines for optimal performance
- Write clear, actionable descriptions (used for activation matching)
- Use URL import (`astralform_create_skill_from_url`) for skills hosted in repos
- Use inline content (`astralform_create_skill`) for project-specific knowledge
- Assign skills to specific agents rather than enabling globally
- Version your skills and use `astralform_refresh_skill` to update from source

### 12. Memory Best Practices

#### Overview
Memory is a feature-flagged capability that gives agents persistent recall across conversations.

#### Key Concepts
- **Feature flag**: Memory must be enabled per project in settings
- **Namespace isolation**: Memory is scoped per-project and per-user
- **Semantic search**: Memories are retrieved via vector similarity (not exact match)
- **Agent-mediated**: Agents use `save_memory` and `search_memories` tools

#### Usage Guidelines
- Enable memory for apps that benefit from personalization (preferences, history)
- Don't store sensitive PII in memory - treat it as semi-persistent context
- Memory is semantic: store concepts and preferences, not exact data
- Test memory retrieval with varied phrasings to verify recall quality
- Consider memory as supplementary context, not a database replacement

#### Use Cases
| Use Case | What to Store | Example |
|----------|---------------|---------|
| Preferences | User likes/dislikes | "User prefers dark mode and metric units" |
| Context | Ongoing projects | "Working on Q4 marketing campaign" |
| Personalization | Communication style | "User prefers brief, bullet-point responses" |

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Hardcoded API keys | Use environment/config |
| No error handling | Implement comprehensive catch |
| Ignoring rate limits | Add backoff and UI feedback |
| Verbose system prompts | Keep concise, use context |
| No offline handling | Queue messages, show status |
| Missing analytics | Enable and monitor regularly |

## Getting Help

If you need additional guidance:
1. Search docs: `astralform_search_docs` tool
2. Check GitHub issues: https://github.com/astralform
3. Contact support via dashboard
