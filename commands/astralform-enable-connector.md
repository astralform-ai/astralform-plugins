---
name: astralform-enable-connector
description: Interactive wizard to enable a connector for an Astralform project
arguments:
  - name: project_id
    description: Project UUID (optional, will prompt if not provided)
    required: false
  - name: connector_slug
    description: Connector slug to enable (optional, will show catalog if not provided)
    required: false
---

# Enable Connector Wizard

Interactive wizard to enable a connector (Slack, Notion, GitHub, etc.) for an Astralform project.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, guide user through device flow

2. **Select project**:
   - If `project_id` provided, call `astralform_get_project` to verify
   - Otherwise, call `astralform_list_projects` and let user choose

3. **Select connector**:
   - If `connector_slug` provided, call `astralform_get_connector` to verify
   - Otherwise, call `astralform_list_connectors` and let user choose
   - Display connector details including available tools

4. **Show connector details**:
   - Call `astralform_get_connector` with the selected slug
   - Display description, type, available tools, and OAuth scopes (if applicable)

5. **Collect credentials based on connector type**:

   **For OAuth connectors** (Slack, Notion, GitHub):
   - Explain that a dedicated OAuth app is needed
   - Provide link guidance for creating OAuth apps:
     - Slack: api.slack.com/apps
     - GitHub: github.com/settings/developers
     - Notion: notion.so/my-integrations
   - Ask for OAuth Client ID
   - Ask for OAuth Client Secret
   - Show default scopes and ask if they want to customize

   **For API Key connectors**:
   - Ask for the service API key

   **For Remote MCP connectors**:
   - No credentials needed, just confirm

6. **Security warning**:
   - Display warning that credentials will be encrypted and stored
   - Confirm user wants to proceed

7. **Enable connector**:
   - Call `astralform_enable_connector` with collected credentials
   - Display confirmation with enabled tools list

8. **Show next steps**:
   - Explain that end users will need to authenticate via OAuth flow
   - Mention the connector tools are now available to agents
   - Suggest assigning the connector to specific agents if using multi-agent

## Example Output

```
Enable Connector

Step 1: Authentication
Logged in as tony@example.com

Step 2: Project
? Select project: My AI App (550e8400-...)

Step 3: Connector
? Select connector:
  1. Slack (communication, oauth) - 3 tools
  2. Notion (productivity, oauth) - 3 tools
  3. GitHub (development, oauth) - 2 tools

? Selection: 1

Step 4: Slack Details
Type: OAuth
Category: Communication
Tools: slack_list_channels, slack_send_message, slack_search_messages
Default scopes: channels:read,chat:write,search:read

Step 5: Credentials
Create a Slack app at https://api.slack.com/apps with these redirect URIs
configured for your Astralform backend.

? OAuth Client ID: 1234567890.1234567890
? OAuth Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
? Use default scopes? (yes): yes

Step 6: Confirm
Credentials will be encrypted and stored securely.
? Proceed? (yes): yes

Step 7: Enabled!
Slack connector enabled for "My AI App"
Available tools:
  - slack_list_channels
  - slack_send_message
  - slack_search_messages

Next steps:
1. End users authenticate via OAuth when using Slack tools
2. Assign connector to agents via dashboard or astralform_update_agent
3. Test with a chat session using Slack tools
```

## Notes

- OAuth credentials are encrypted with the project's encryption key
- Each connector can only be enabled once per project
- Disabling: use `astralform_disable_connector` (revokes all user tokens)
- Use AskUserQuestion for interactive prompts
