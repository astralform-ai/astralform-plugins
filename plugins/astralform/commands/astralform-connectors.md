---
name: astralform-connectors
description: Browse connector catalog and view project connector status
arguments:
  - name: project_id
    description: Project UUID to check connectors for (optional)
    required: false
---

# Astralform Connectors

Browse the connector catalog and check which connectors are enabled for your projects.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, guide user through device flow

2. **List connector catalog** by calling `astralform_list_connectors`
   - Show all available connectors with type, category, and tools count

3. **Show project connector status** (if project_id provided or user selects one):
   - If no project_id, call `astralform_list_projects` and let user choose
   - Call `astralform_list_project_connectors` for the selected project
   - Display enabled connectors with their status

4. **Display merged view**:
   - Show a table with: name, slug, type, category, enabled status, tools count
   - Highlight which connectors are enabled vs available
   - Suggest `/astralform-enable-connector` for connectors they want to add

## Example Output

```
Astralform Connectors

Available Connectors:
| Name   | Slug   | Type  | Category      | Tools | Enabled |
|--------|--------|-------|---------------|-------|---------|
| Slack  | slack  | oauth | communication | 3     | Yes     |
| Notion | notion | oauth | productivity  | 3     | No      |
| GitHub | github | oauth | development   | 2     | No      |

Slack is enabled for "My AI App" with 3 tools:
  - slack_list_channels
  - slack_send_message
  - slack_search_messages

To enable more connectors: /astralform-enable-connector
To get connector details: astralform_get_connector with slug
```

## Notes

- Connectors provide OAuth/API key integrations for external services
- Each connector exposes tools that agents can use
- OAuth connectors require developer-provided OAuth app credentials
- API key connectors require a service API key
- Remote MCP connectors connect to external MCP servers directly
