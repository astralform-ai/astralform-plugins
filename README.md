# Astralform Plugin for Claude Code

Manage your [Astralform](https://astralform.ai) AI agent projects directly from Claude Code.

## Installation

### Option 1: Add as Workspace Plugin (Recommended)

```bash
cd your-project
claude plugins add https://github.com/astralform-ai/astralform-plugins
```

### Option 2: Install Globally

```bash
claude plugins add --global https://github.com/astralform-ai/astralform-plugins
```

## Quick Start

1. **Login to Astralform**
   ```
   /astralform-login
   ```

2. **Create a project**
   ```
   /astralform-create-project
   ```

3. **Or use the interactive setup wizard**
   ```
   /astralform-setup
   ```

## Available Commands

| Command | Description |
|---------|-------------|
| `/astralform-login` | Authenticate with your Astralform account |
| `/astralform-projects` | List all your projects |
| `/astralform-create-project` | Create a new project |
| `/astralform-setup` | Interactive setup wizard |
| `/astralform-analytics` | View project usage analytics |

## What You Can Do

- **Manage Projects** - Create, update, and delete Astralform projects
- **API Keys** - Generate and manage API keys
- **LLM Config** - Configure OpenAI, Anthropic, Groq, or Ollama Cloud
- **MCP Servers** - Add GitHub, Slack, database integrations
- **iOS SDK** - Automated Swift/SwiftUI SDK setup

## Included Plugins

This repository includes multiple plugins:

| Plugin | Description |
|--------|-------------|
| `astralform` | Core Astralform project management |
| `lint` | Auto-linting for 9 languages (JS/TS, Python, Swift, Go, Rust, etc.) |

## Requirements

- [Claude Code](https://claude.ai/code) CLI
- [Astralform](https://astralform.ai) account

## Documentation

- [Astralform Docs](https://docs.astralform.ai)
- [iOS SDK Guide](https://docs.astralform.ai/ios-sdk)

## License

MIT
