# Astralform Plugin for Claude Code

Manage your [Astralform](https://astralform.ai) AI agent projects directly from Claude Code.

## Features

- **Project Management** - Create, configure, and delete Astralform projects
- **API Key Management** - Generate and revoke API keys
- **LLM Configuration** - Configure OpenAI, Anthropic, Groq, or Ollama Cloud
- **MCP Server Integration** - Add GitHub, Slack, database integrations
- **Connector Configuration** - Enable OAuth connectors (Slack, Notion, GitHub)
- **Agent Management** - Create and configure multi-agent systems
- **iOS SDK Setup** - Automated Swift/SwiftUI SDK integration

## Installation

Install from the astralform-plugins marketplace:

```bash
/plugin marketplace add https://github.com/astralform-ai/astralform-plugins
/plugin install astralform
```

**Version**: 1.5.1

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

## Commands

| Command | Description |
|---------|-------------|
| `/astralform-login` | Authenticate with your Astralform account |
| `/astralform-projects` | List all your projects |
| `/astralform-create-project` | Create a new project with guided setup |
| `/astralform-setup` | Interactive setup wizard for complete configuration |
| `/astralform-agents` | List and manage agents for a project |
| `/astralform-create-agent` | Create a new agent with guided configuration |
| `/astralform-connectors` | Browse connector catalog and view status |
| `/astralform-enable-connector` | Enable a connector for your project |
| `/astralform-model-providers` | Manage LLM provider API keys in the vault |
| `/astralform-analytics` | View project usage analytics |

## Agent

### `project-configurator`

A full-service agent for setting up and configuring Astralform projects. Use when you need:
- Comprehensive project setup
- LLM configuration
- MCP server integration
- Multi-step Astralform workflows

## Skills

### `astralform-docs`

Search and retrieve Astralform documentation. Use when you need help with Astralform features or API.

### `astralform-ios-setup`

Integrate Astralform iOS SDK into Swift/SwiftUI projects. Automatically detects dependency manager (SPM, CocoaPods) and configures initialization.

### `astralform-best-practices`

Astralform integration best practices and optimization tips. Covers security, performance, and production usage.

## MCP Server

This plugin connects to the Astralform MCP server at `https://mcp.astralform.ai/mcp`, providing access to 40+ tools for managing:
- Projects and API keys
- LLM configurations
- MCP servers and connectors
- Agents and skills
- Analytics and documentation

## Plugin Structure

```
astralform/
├── .claude-plugin/
│   └── plugin.json
├── agents/
│   └── project-configurator.md
├── commands/
│   ├── astralform-login.md
│   ├── astralform-projects.md
│   ├── astralform-create-project.md
│   ├── astralform-setup.md
│   ├── astralform-agents.md
│   ├── astralform-create-agent.md
│   ├── astralform-connectors.md
│   ├── astralform-enable-connector.md
│   ├── astralform-model-providers.md
│   └── astralform-analytics.md
├── skills/
│   ├── astralform-docs/
│   ├── astralform-ios-setup/
│   └── astralform-best-practices/
├── scripts/
│   ├── install.sh
│   └── setup.sh
├── .mcp.json
└── README.md
```

## Requirements

- [Claude Code](https://claude.ai/code) CLI 1.0.33 or later
- [Astralform](https://astralform.ai) account

## Documentation

- [Astralform Docs](https://docs.astralform.ai)
- [iOS SDK Guide](https://docs.astralform.ai/ios-sdk)

## License

MIT
