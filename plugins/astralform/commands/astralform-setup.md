---
name: astralform-setup
description: Interactive wizard to set up a complete Astralform project
arguments:
  - name: project_name
    description: Name for your project (optional)
    required: false
---

# Astralform Setup Wizard

Complete guided setup for a new Astralform project, including team selection, LLM configuration and API key generation.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, explain that Claude Code will auto-authenticate on the next MCP tool call

2. **Select or create team**:
   - Call `astralform_list_teams` to show existing teams
   - If only one team, use it automatically
   - Otherwise, ask: "Use existing team or create new?"
   - If new, collect name + slug and call `astralform_create_team`

3. **Create or select project**:
   - If `project_name` provided, create new project under the selected team
   - Otherwise, ask user: "Create new project or configure existing?"
   - If existing, call `astralform_list_projects` and let user choose (filtered by team)
   - If new, call `astralform_create_project` with `team_id` and `name`

4. **Configure LLM provider**:
   - Call `astralform_list_llm_providers` to show options
   - Ask user which provider they want (OpenAI, Anthropic, Groq, Ollama Cloud, or Platform)
   - For providers that require an API key, ask for it
   - Call `astralform_set_llm_config` with their choice

5. **Optional: Save key to Model Providers vault**:
   - Ask "Would you like to save your API key to the Model Providers vault for reuse across projects?"
   - If yes, call `astralform_set_provider_key` with the provider and API key from step 4
   - Show key hint confirmation

6. **Create API key**:
   - Ask for key name (default: "Development")
   - Ask for environment (development/production)
   - Call `astralform_create_api_key`
   - **IMPORTANT**: Display the full API key with warning that it won't be shown again

7. **Optional: Configure Tavily search**:
   - Ask if they want to enable Tavily web search
   - If yes, guide through connector setup (Tavily key via connector or provider vault)

8. **Optional: Enable connectors**:
   - Ask "Would you like to enable any connectors (Slack, Notion, GitHub)?"
   - If yes, call `astralform_list_connectors` to show catalog
   - Let user select connectors to enable
   - For each selected connector, collect credentials by type:
     - OAuth: client_id + client_secret
     - API key: key
     - Remote MCP: no credentials needed
   - Call `astralform_enable_connector` for each

9. **Optional: Configure web search**:
    - Ask "Would you like to enable web search for your agents?"
    - If yes, call `astralform_get_search_settings` to check current config
    - Ask for provider preference (ddgs is free, tavily/serper/exa need API key)
    - Set max results (1-10)
    - Call `astralform_set_search_settings` with provider, max_results, and API key if needed

10. **Optional: Configure memory**:
    - Ask "Would you like to enable agent memory?"
    - If yes, call `astralform_get_memory_settings` to check current config
    - Configure retrieval (auto-inject relevant memories) and extraction (auto-save from conversations)
    - Set retrieval limit and max injection tokens
    - Call `astralform_set_memory_settings`

11. **Optional: Configure guard rails**:
    - Ask "Would you like to set up safety guard rails?"
    - If yes, call `astralform_get_guardrails_settings` to check current config
    - Configure PII detection (types: email, credit_card, ip, mac_address, url; strategy: redact/mask/hash/block)
    - Set execution limits (max model calls, max tool calls)
    - Call `astralform_set_guardrails_settings`

12. **Optional: Set environment variables**:
    - Ask "Do you need any environment variables for your agents?"
    - If yes, call `astralform_list_envs` to show existing keys
    - For each new var, collect key (CONSTANT_CASE) and value
    - Call `astralform_set_env` for each (values are encrypted at rest)

13. **Optional: Create agents**:
    - Ask "Would you like to set up a multi-agent system?"
    - If yes, explain that agents are specialized workers routed by a supervisor
    - Guide through creating additional agents with `astralform_create_agent`:
      - Agent name, display name, description
      - System prompt for the agent's specialty
      - Optional LLM override, thinking_enabled, temperature, thinking_effort, avatar
    - Suggest assigning skills and connectors to each agent

14. **Optional: Add skills**:
    - Ask "Would you like to add custom skills to your agents?"
    - If yes, show options:
      - Create from content: provide name + SKILL.md body via `astralform_create_skill`
      - Import from URL: provide URL to a SKILL.md file via `astralform_create_skill_from_url`
    - Skills with `runtime: workspace` automatically get sandbox access (auto-capsule)
    - Optionally configure `sandbox_template` on the agent (base, browser, code-interpreter-v1, desktop)
    - Assign created skills to agents via `astralform_update_agent`

15. **Show summary**:
    - Team name and role
    - Project name and ID
    - LLM configuration
    - API key prefix
    - Enabled tools
    - Connectors enabled (count + names)
    - Search config (provider + enabled)
    - Memory config (enabled + retrieval/extraction)
    - Guard rails (enabled + PII types + limits)
    - Environment variables (count)
    - Agents created (count + names)
    - Skills added (count + names)
    - Next steps for SDK integration

## Example Output

```
Astralform Setup Wizard

Step 1: Authentication
Logged in as tony@example.com

Step 2: Team
Your teams:
  1. My Team (my-team) — owner
? Use "My Team"? (yes)

Step 3: Project
? Create new project or use existing? (Create new)
? Project name: My AI App
Project created: My AI App (550e8400-...)

ENCRYPTION KEY (save this!): enc_xxxxxxxxxxxxx

Step 4: LLM Configuration
? Choose LLM provider:
  1. Platform (Astralform-managed)
  2. OpenAI (bring your own key)
  3. Anthropic (bring your own key)
  4. Groq (bring your own key)
  5. Ollama Cloud (bring your own key)

? Selection: 2
? OpenAI API key: sk-xxxxxxx
? Model: gpt-4o
LLM configured: OpenAI gpt-4o

Step 5: API Key
? Key name: Development
? Environment: development
API key created!

SAVE THIS API KEY - IT WILL ONLY BE SHOWN ONCE!
API Key: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Step 6: Connectors
? Enable any connectors? (no): no

Step 7: Search
? Enable web search? (no): yes
? Provider: ddgs (free)
? Max results: 5
Search configured: ddgs, 5 results

Step 8: Memory
? Enable agent memory? (no): no

Step 9: Guard Rails
? Set up guard rails? (no): no

Step 10: Environment Variables
? Need env vars? (no): no

Step 11: Agents
? Set up multi-agent system? (no): yes
? Agent name: support-agent
Agent created: support-agent

Step 12: Skills
? Add custom skills? (no): no

Summary
---
Team: My Team (owner)
Project: My AI App
LLM: OpenAI gpt-4o
API Key: sk_test_abc... (save this!)
Tools: Tavily search
Connectors: Slack (3 tools)
Search: ddgs (5 results)
Memory: disabled
Guard Rails: disabled
Env Vars: 0
Agents: 2 (default, support-agent)
Skills: 1 (knowledge-base)

Next steps:
1. Add the iOS SDK to your app
2. Run /astralform-ios-setup in your Xcode project
3. Or see docs: astralform_search_docs tool
```

## Notes

- This wizard handles the complete setup flow
- Keys shown only once - remind user to save them
- Can be rerun to reconfigure existing projects
- Use AskUserQuestion for interactive prompts
