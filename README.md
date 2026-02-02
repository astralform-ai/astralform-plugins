# Astralform Claude Code Plugin

Manage Astralform AI agent projects directly from Claude Code.

## Features

- **Project Management**: Create, list, update, and delete Astralform projects
- **API Key Management**: Generate and manage API keys for your projects
- **LLM Configuration**: Set up OpenAI, Anthropic, Groq, Ollama, or platform-managed LLMs
- **MCP Server Integration**: Add and configure MCP servers (GitHub, Slack, databases)
- **Platform Tools**: Enable Tavily search and other platform tools
- **iOS SDK Integration**: Automated SDK setup for Swift/SwiftUI projects
- **Documentation**: Search and retrieve Astralform documentation

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/astralform-ai/astralform-plugins.git ~/.claude/plugins/astralform
   ```

2. Enable the plugin in Claude Code settings

## Commands

| Command | Description |
|---------|-------------|
| `/astralform-login` | Authenticate with Astralform |
| `/astralform-projects` | List your projects |
| `/astralform-create-project` | Create a new project |
| `/astralform-setup` | Interactive setup wizard |
| `/astralform-analytics` | View usage analytics |

## Skills

### iOS SDK Setup
Trigger: "integrate Astralform", "add Astralform SDK", "setup Astralform iOS"

Automatically:
- Detects SPM/CocoaPods
- Adds dependency
- Configures initialization
- Adds ChatView integration

### Documentation
Trigger: "Astralform docs", "how to use Astralform"

Search and retrieve Astralform documentation.

### Best Practices
Trigger: "Astralform best practices", "optimize Astralform"

Guidance on security, performance, and production readiness.

## MCP Tools

### Authentication
- `astralform_whoami` - Get current developer profile
- `astralform_device_code` - Start device auth flow
- `astralform_device_token` - Exchange device code for token

### Projects
- `astralform_list_projects` - List all projects
- `astralform_get_project` - Get project details
- `astralform_create_project` - Create project (returns encryption key)
- `astralform_update_project` - Update project name
- `astralform_delete_project` - Delete project

### API Keys
- `astralform_list_api_keys` - List keys (prefix only)
- `astralform_create_api_key` - Create key (returns full key once)
- `astralform_revoke_api_key` - Revoke a key

### LLM Configuration
- `astralform_list_llm_providers` - Available providers
- `astralform_get_llm_config` - Current configuration
- `astralform_set_llm_config` - Set LLM provider/model
- `astralform_delete_llm_config` - Remove configuration

### MCP Servers
- `astralform_list_mcp_templates` - Available templates
- `astralform_list_mcp_servers` - Project's MCP servers
- `astralform_add_mcp_server` - Add server
- `astralform_toggle_mcp_server` - Enable/disable
- `astralform_delete_mcp_server` - Remove server

### Platform Tools
- `astralform_list_platform_tools` - Available tools
- `astralform_get_project_tools` - Project's tool config
- `astralform_update_project_tool` - Enable/configure tool

### Analytics & Docs
- `astralform_get_analytics` - Usage analytics
- `astralform_get_stats` - Aggregate statistics
- `astralform_search_docs` - Search documentation
- `astralform_get_doc` - Get full doc page

## Authentication

The plugin uses OAuth 2.0 Device Authorization Flow:

1. Run `/astralform-login`
2. Visit the URL shown and enter the code
3. Grant access in your browser
4. Token is stored at `~/.astralform/credentials.json`

## Security

- API keys and encryption keys are shown **only once** at creation
- Credentials are stored locally in `~/.astralform/`
- Never commit API keys to version control
- Use environment variables for production keys

## Requirements

- Claude Code CLI
- Astralform account

## License

MIT
