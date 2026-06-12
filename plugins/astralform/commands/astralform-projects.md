---
name: astralform-projects
description: List, inspect, update, or delete your Astralform projects
---

# Astralform Projects

List, inspect, update, and delete Astralform projects for the authenticated
developer, organized by team.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, inform user to run `/astralform-login` first

2. **List teams** using `astralform_list_teams`
   - For a single team's detail (slug, role, member count), call `astralform_get_team`

3. **List projects** using `astralform_list_projects`

4. **Display results** grouped by team:
   - Team name, slug, and role
   - Projects under each team: name, ID, created date

5. **Inspect a project** (if the user selects one):
   - Call `astralform_get_project` for full configuration
   - Call `astralform_get_stats` for account-wide usage/quota context

6. **Manage the selected project** based on what the user wants:
   - **Rename / reconfigure**: `astralform_update_project` with project_id and changed fields
   - **Delete**: `astralform_delete_project` with project_id (confirm first — this is
     destructive and removes agents, keys, and conversations for that project)

## Example Output

```
Your Astralform Projects:

Team: My Team (my-team) — owner

| Name           | ID                                   | Created    |
|----------------|--------------------------------------|------------|
| My AI App      | 550e8400-e29b-41d4-a716-446655440000 | 2025-01-15 |
| Test Project   | 550e8400-e29b-41d4-a716-446655440001 | 2025-01-20 |

Team: Client Work (client-work) — member

| Name           | ID                                   | Created    |
|----------------|--------------------------------------|------------|
| Client App     | 660e8400-e29b-41d4-a716-446655440002 | 2025-02-01 |

Use /astralform-create-project to create a new project.
Use astralform_get_project tool with project_id for more details.
Manage: astralform_update_project (edit) · astralform_delete_project (confirm first).
```

## Notes

- Projects are organized under teams
- Your role in each team determines what you can do (owner > admin > member)
- Use `astralform_list_team_members` to see who else is on a team
- `astralform_delete_project` is irreversible — it removes the project's agents,
  API keys, skills, and conversation history. Always confirm before calling it.
