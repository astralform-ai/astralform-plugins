---
description: Search and retrieve Astralform documentation. Use when user asks about "Astralform docs", "how to use Astralform", "Astralform API", or needs help with Astralform features.
---

# Astralform Documentation

This skill provides access to Astralform documentation for developers.

## Documentation Sources

Astralform uses **Mintlify** for AI-ready documentation:

| Source | URL | Description |
|--------|-----|-------------|
| **Full docs (AI)** | `https://astralform.mintlify.app/llms-full.txt` | Complete documentation in one file |
| **Page index** | `https://astralform.mintlify.app/llms.txt` | List of all documentation pages |
| **Web docs** | `https://astralform.mintlify.app` | Human-readable documentation |
| **GitHub** | `https://github.com/astralform-ai/docs` | Documentation source |

## When to Use

- User asks "how do I..." related to Astralform
- User needs documentation for Astralform features
- User asks about Astralform API, SDK, or dashboard
- User wants to understand Astralform concepts

## Documentation Categories

| Category | Path | Common Topics |
|----------|------|---------------|
| `guides/` | Getting started | Quickstart, authentication, first chat |
| `ios-sdk/` | iOS/Swift SDK | Installation, ChatView, client tools |
| `backend-api/` | REST API reference | Endpoints, streaming, tool results |
| `dashboard/` | Web dashboard | Projects, API keys, LLM config |
| `mcp-config/` | MCP configuration | Server MCP, client MCP, platform tools |

## How to Search Documentation

### Option 1: Use MCP Tools

```
astralform_search_docs(
    query: "how to configure OpenAI",
    category: "dashboard"  // optional
)
```

### Option 2: Fetch Full Docs via WebFetch

For comprehensive answers, fetch the full documentation:

```
WebFetch(
    url: "https://astralform.mintlify.app/llms-full.txt",
    prompt: "Find information about configuring OpenAI LLM"
)
```

### Option 3: Get Specific Page

```
astralform_get_doc(
    path: "/ios-sdk/installation"
)
```

## Common Documentation Requests

### iOS SDK

| Query | Suggested Page |
|-------|----------------|
| "How to install SDK" | `/ios-sdk/installation` |
| "How to add chat view" | `/ios-sdk/chat-view` |
| "Client tools setup" | `/ios-sdk/client-tools` |
| "Configuration options" | `/ios-sdk/configuration` |

### Backend API

| Query | Suggested Page |
|-------|----------------|
| "Chat streaming" | `/backend-api/chat-streaming` |
| "Submit tool results" | `/backend-api/tool-results` |
| "API overview" | `/backend-api/overview` |

### Dashboard

| Query | Suggested Page |
|-------|----------------|
| "Create project" | `/dashboard/projects` |
| "API key management" | `/dashboard/api-keys` |
| "LLM setup" | `/dashboard/llm-configuration` |
| "MCP servers" | `/dashboard/mcp-servers` |

### MCP Configuration

| Query | Suggested Page |
|-------|----------------|
| "Server MCP setup" | `/mcp-config/server-mcp` |
| "Client MCP tools" | `/mcp-config/client-mcp` |
| "Platform tools" | `/mcp-config/platform-tools` |

## Response Format

When providing documentation:

1. **Start with a summary** - Answer the question directly
2. **Show relevant code** - Include examples from docs
3. **Link to web docs** - `https://astralform.mintlify.app/{path}`
4. **Suggest related topics** - Help user discover more

## Example Interaction

User: "How do I use Astralform with my own OpenAI key?"

Response pattern:
1. Search docs for "OpenAI configuration"
2. Summarize the BYOK (Bring Your Own Key) feature
3. Show configuration steps from `/dashboard/llm-configuration`
4. Link to: `https://astralform.mintlify.app/dashboard/llm-configuration`

## Notes

- Documentation is hosted on Mintlify with AI-ready endpoints
- `llms-full.txt` contains all docs in a single file for AI consumption
- Content is kept up-to-date with latest features
- If docs don't answer the question, suggest contacting support
