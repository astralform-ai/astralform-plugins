---
name: astralform-agents
description: List and manage agents for an Astralform project
arguments:
  - name: project_id
    description: Project UUID to list agents for (optional)
    required: false
---

# Astralform Agents

List and manage agents configured for your Astralform projects.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, guide user through device flow

2. **Select project**:
   - If `project_id` provided, call `astralform_get_project` to verify
   - Otherwise, call `astralform_list_projects` and let user choose

3. **List agents** by calling `astralform_list_agents` for the selected project
   - Display table: name, display_name, role (Team Lead if default), is_enabled, thinking, LLM provider/model, skill count, MCP server count

4. **Show agent details** (if user selects one):
   - Call `astralform_get_agent` with agent_id
   - Display full configuration: system prompt, LLM override, assigned skills, MCP servers, platform tools

5. **Display next steps**:
   - Suggest `/astralform-create-agent` to create a new agent
   - Mention `astralform_update_agent` and `astralform_toggle_agent` for modifications
   - Mention `astralform_delete_agent` for removal

## Example Output

```
Astralform Agents

Project: My AI App (550e8400-...)

| Name          | Display Name    | Role        | Enabled | Thinking | LLM            | Skills | MCP |
|---------------|-----------------|-------------|---------|----------|----------------|--------|-----|
| default       | Default Agent   | Team Lead   | Yes     | Off      | claude-sonnet  | 2      | 1   |
| support-agent | Support Agent   | Team Member | Yes     | On       | gpt-4o         | 3      | 2   |
| triage        | Triage Bot      | Team Member | No      | Off      | llama-3.3-70b  | 0      | 0   |

Agent details for "support-agent":
  Description: Handles customer support queries
  System prompt: "You are a helpful customer support agent..."
  LLM: OpenAI gpt-4o (project override)
  Skills: knowledge-base, escalation-policy
  MCP Servers: zendesk, slack
  Platform Tools: tavily_search

To create a new agent: /astralform-create-agent
To update an agent: astralform_update_agent
To enable/disable: astralform_toggle_agent
```

## Notes

- Every project has a default agent (Team Lead) that handles unrouted requests
- The Team Lead cannot be deleted but can be configured
- You cannot disable all agents — at least one must remain enabled
- If Team Lead is disabled, the remaining agent runs standalone without orchestration
- Disabled agents are skipped during routing
- Agents can have their own LLM override (provider, model, API key)
- Skills and MCP servers are assigned per-agent for resource isolation
