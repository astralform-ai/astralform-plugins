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
   - Ask user which provider they want (OpenAI, Anthropic, Groq, Ollama, or Platform)
   - For BYOK providers, ask for API key
   - Call `astralform_set_llm_config` with their choice

4. **Create API key**:
   - Ask for key name (default: "Development")
   - Ask for environment (development/production)
   - Call `astralform_create_api_key`
   - **IMPORTANT**: Display the full API key with warning that it won't be shown again

5. **Optional: Configure platform tools**:
   - Ask if they want to enable Tavily search
   - If yes, ask for Tavily API key
   - Call `astralform_update_project_tool`

6. **Optional: Add MCP servers**:
   - Ask if they want to add MCP server integrations
   - Show available templates from `astralform_list_mcp_templates`
   - Guide through configuration

7. **Show summary**:
   - Project name and ID
   - LLM configuration
   - API key prefix
   - Enabled tools
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
  5. Ollama (self-hosted)

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

Step 6: Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Project: My AI App
LLM: OpenAI gpt-4o
API Key: sk_test_abc... (save this!)
Tools: Tavily search

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
