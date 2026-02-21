---
name: astralform-create-agent
description: Interactive wizard to create a new agent for an Astralform project
arguments:
  - name: project_id
    description: Project UUID (optional, will prompt if not provided)
    required: false
  - name: agent_name
    description: Agent name in lowercase with hyphens (optional)
    required: false
---

# Create Agent Wizard

Interactive wizard to create a new specialized agent for an Astralform project.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, guide user through device flow

2. **Select project**:
   - If `project_id` provided, call `astralform_get_project` to verify
   - Otherwise, call `astralform_list_projects` and let user choose

3. **Agent identity**:
   - Ask for agent name (lowercase letters, numbers, hyphens only)
   - Ask for display name (human-readable)
   - Ask for description (what this agent specializes in)

4. **System prompt**:
   - Ask user to provide a system prompt for the agent
   - Suggest keeping it concise and focused on the agent's specialty

5. **Thinking/Reasoning** (optional):
   - Ask if this agent should use extended thinking (for supported models like Claude, OpenAI o-series)
   - Set `thinking_enabled: true/false`
   - Note: only effective with providers that support thinking tokens

6. **Avatar** (optional):
   - Ask if they want a custom avatar URL for the agent
   - Default: auto-generated from agent name (no action needed)
   - If custom, provide as `avatar_url` parameter

7. **Optional: LLM override**:
   - Ask if they want this agent to use a different LLM than the project default
   - If yes, call `astralform_list_llm_providers` to show options
   - Collect provider, model, and API key (if required)

8. **Optional: Assign skills**:
   - Call `astralform_list_skills` to show available skills
   - Let user select which skills to assign to this agent
   - Skills give the agent domain-specific knowledge

9. **Optional: Assign MCP servers**:
   - Call `astralform_list_mcp_servers` to show available servers
   - Let user select which MCP servers this agent can access
   - Each server provides tools the agent can use

10. **Optional: Assign platform tools**:
   - Call `astralform_list_platform_tools` to show available tools
   - Let user select which platform tools to enable (e.g., Tavily search)

11. **Create agent**:
   - Call `astralform_create_agent` with all collected configuration
   - Display confirmation with full agent summary

12. **Show next steps**:
    - Explain how routing works (supervisor directs to agents by name)
    - Mention `astralform_update_agent` for future changes
    - Suggest testing with a chat session

## Example Output

```
Create Agent

Step 1: Authentication
Logged in as tony@example.com

Step 2: Project
? Select project: My AI App (550e8400-...)

Step 3: Agent Identity
? Agent name: support-agent
? Display name: Support Agent
? Description: Handles customer support queries and escalations

Step 4: System Prompt
? System prompt:
  You are a customer support specialist. Help users resolve issues
  quickly. Escalate to human support when you cannot resolve.

Step 5: Thinking/Reasoning
? Enable extended thinking? (no): no

Step 6: Avatar
? Custom avatar URL? (no): no
Using auto-generated avatar.

Step 7: LLM Override
? Use different LLM than project default? (no): yes
? Provider: OpenAI
? Model: gpt-4o
? API key: sk-xxxxxxx

Step 8: Skills
Available skills:
  1. knowledge-base - Company knowledge base
  2. escalation-policy - Escalation procedures
  3. faq-responses - Common FAQ answers
? Assign skills (comma-separated): 1, 2

Step 9: MCP Servers
Available servers:
  1. zendesk - Zendesk ticket management
  2. slack - Slack messaging
? Assign MCP servers (comma-separated): 1, 2

Step 10: Platform Tools
? Enable Tavily search? (no): no

Step 11: Created!
Agent "support-agent" created for "My AI App"

Summary:
  Name: support-agent
  Display Name: Support Agent
  LLM: OpenAI gpt-4o (override)
  Skills: knowledge-base, escalation-policy
  MCP Servers: zendesk, slack

Next steps:
1. The supervisor will route relevant queries to this agent
2. Update agent: astralform_update_agent
3. Test with a chat session targeting agent_name: "support-agent"
```

## Notes

- Agent names must be lowercase with hyphens (e.g., `support-agent`)
- Each project can have multiple agents with different specialties
- The supervisor agent routes requests based on agent descriptions
- Assign minimal resources per agent (principle of least privilege)
- Use AskUserQuestion for interactive prompts
