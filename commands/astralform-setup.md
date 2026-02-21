---
name: astralform-setup
description: Interactive wizard to set up a complete Astralform project
arguments:
  - name: project_name
    description: Name for your project (optional)
    required: false
---

# Astralform Setup Wizard

Complete guided setup for a new Astralform project, including LLM configuration and API key generation.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, run the device flow authentication

2. **Create or select project**:
   - If `project_name` provided, create new project
   - Otherwise, ask user: "Create new project or configure existing?"
   - If existing, call `astralform_list_projects` and let user choose

3. **Configure LLM provider**:
   - Call `astralform_list_llm_providers` to show options
   - Ask user which provider they want (OpenAI, Anthropic, Groq, Ollama Cloud, or Platform)
   - For providers that require an API key, ask for it
   - Call `astralform_set_llm_config` with their choice

4. **Optional: Save key to Model Providers vault**:
   - Ask "Would you like to save your API key to the Model Providers vault for reuse across projects?"
   - If yes, call `astralform_set_provider_key` with the provider and API key from step 3
   - Show key hint confirmation

5. **Create API key**:
   - Ask for key name (default: "Development")
   - Ask for environment (development/production)
   - Call `astralform_create_api_key`
   - **IMPORTANT**: Display the full API key with warning that it won't be shown again

6. **Optional: Configure platform tools**:
   - Ask if they want to enable Tavily search
   - If yes, ask for Tavily API key
   - Call `astralform_update_project_tool`

7. **Optional: Add MCP servers**:
   - Ask if they want to add MCP server integrations
   - Show available templates from `astralform_list_mcp_templates`
   - Guide through configuration

8. **Optional: Enable connectors**:
   - Ask "Would you like to enable any connectors (Slack, Notion, GitHub)?"
   - If yes, call `astralform_list_connectors` to show catalog
   - Let user select connectors to enable
   - For each selected connector, collect credentials by type:
     - OAuth: client_id + client_secret
     - API key: key
     - Remote MCP: no credentials needed
   - Call `astralform_enable_connector` for each

9. **Optional: Create agents**:
   - Ask "Would you like to set up a multi-agent system?"
   - If yes, explain that agents are specialized workers routed by a supervisor
   - Guide through creating additional agents with `astralform_create_agent`:
     - Agent name, display name, description
     - System prompt for the agent's specialty
     - Optional LLM override, thinking_enabled, avatar
   - Suggest assigning skills and MCP servers to each agent

10. **Optional: Add skills**:
    - Ask "Would you like to add custom skills to your agents?"
    - If yes, show options:
      - Create from content: provide name + SKILL.md body via `astralform_create_skill`
      - Import from URL: provide URL to a SKILL.md file via `astralform_create_skill_from_url`
    - Assign created skills to agents via `astralform_update_agent`

11. **Show summary**:
    - Project name and ID
    - LLM configuration
    - API key prefix
    - Enabled tools
    - Connectors enabled (count + names)
    - Agents created (count + names)
    - Skills added (count + names)
    - Next steps for SDK integration

## Example Output

```
🚀 Astralform Setup Wizard

Step 1: Authentication
✅ Logged in as tony@example.com

Step 2: Project
? Create new project or use existing? (Create new)
? Project name: My AI App
✅ Project created: My AI App (550e8400-...)

⚠️  ENCRYPTION KEY (save this!): enc_xxxxxxxxxxxxx

Step 3: LLM Configuration
? Choose LLM provider:
  1. Platform (Astralform-managed)
  2. OpenAI (bring your own key)
  3. Anthropic (bring your own key)
  4. Groq (bring your own key)
  5. Ollama Cloud (bring your own key)

? Selection: 2
? OpenAI API key: sk-xxxxxxx
? Model: gpt-4o
✅ LLM configured: OpenAI gpt-4o

Step 4: API Key
? Key name: Development
? Environment: development
✅ API key created!

⚠️  SAVE THIS API KEY - IT WILL ONLY BE SHOWN ONCE!
API Key: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Step 5: Platform Tools
? Enable Tavily search? (yes/no): yes
? Tavily API key: tvly-xxxxxxx
✅ Tavily search enabled

Step 8: Agents
? Set up multi-agent system? (no): yes
? Agent name: support-agent
✅ Agent created: support-agent

Step 9: Skills
? Add custom skills? (no): no

Step 10: Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: My AI App
LLM: OpenAI gpt-4o
API Key: sk_test_abc... (save this!)
Tools: Tavily search
Connectors: Slack (3 tools)
Agents: 2 (default, support-agent)
Skills: 1 (knowledge-base)

Next steps:
1. Add the iOS SDK to your app
2. Run /astralform-ios-setup in your Xcode project
3. Or see docs: astralform_search_docs tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Notes

- This wizard handles the complete setup flow
- Keys shown only once - remind user to save them
- Can be rerun to reconfigure existing projects
- Use AskUserQuestion for interactive prompts
