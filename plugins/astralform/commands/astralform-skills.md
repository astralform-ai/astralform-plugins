---
name: astralform-skills
description: List and manage skills for an Astralform project
arguments:
  - name: project_id
    description: Project UUID to manage skills for (optional)
    required: false
---

# Astralform Skills

List and manage the skills attached to your Astralform projects. Skills are
reusable capability bundles (SKILL.md + references) that agents can activate.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, explain that Claude Code will auto-authenticate on the next MCP tool call

2. **Select project**:
   - If `project_id` provided, call `astralform_get_project` to verify
   - Otherwise:
     - Call `astralform_list_teams` to show teams
     - Call `astralform_list_projects` to list projects (grouped by team)
     - Let user choose a project

3. **List skills** by calling `astralform_list_skills` for the selected project
   - Display table: name, display_name, enabled status, version, source (manual / from-url), sandbox_enabled

4. **Show skill details** (if user selects one):
   - Call `astralform_get_skill` with skill_id
   - Display full configuration: description, body summary, references, metadata

5. **Manage skills** based on what the user wants:
   - **Create from scratch**: `astralform_create_skill` (name, description, body)
   - **Create from a URL**: `astralform_create_skill_from_url` (imports a published SKILL.md)
   - **Edit**: `astralform_update_skill` with skill_id and changed fields
   - **Enable/disable**: `astralform_toggle_skill` with skill_id
   - **Refresh** (re-fetch a URL-sourced skill): `astralform_refresh_skill` with skill_id
   - **Remove**: `astralform_delete_skill` with skill_id (confirm first — destructive)

6. **Display next steps**:
   - Suggest `/astralform-create-agent` to assign skills to an agent
   - Mention `/astralform-marketplace` to discover and install community skills

## Example Output

```
Astralform Skills — "My AI App"

| Name          | Enabled | Version | Source    | Sandbox |
|---------------|---------|---------|-----------|---------|
| pdf-extract   | Yes     | 1.2.0   | from-url  | Yes     |
| web-research  | Yes     | 0.4.0   | manual    | No      |
| invoice-parse | No      | 1.0.0   | manual    | Yes     |

3 skills (2 enabled).

Manage:
  - Edit:    astralform_update_skill
  - Toggle:  astralform_toggle_skill
  - Refresh: astralform_refresh_skill (URL-sourced only)
  - Delete:  astralform_delete_skill (confirm first)

Discover more: /astralform-marketplace
```

## Notes

- Skills are project-scoped — the same skill name can differ across projects
- URL-sourced skills can be re-synced with `astralform_refresh_skill` after the
  upstream SKILL.md changes; manually-created skills cannot be refreshed
- Deleting a skill detaches it from every agent that referenced it
- Agents with non-system skills automatically receive a Capsule sandbox; see
  `/astralform-capsule` for session and usage stats
