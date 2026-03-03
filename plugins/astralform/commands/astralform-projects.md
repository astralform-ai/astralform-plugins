---
name: astralform-projects
description: List all your Astralform projects
---

# Astralform Projects

List all Astralform projects for the authenticated developer, organized by team.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, inform user to run `/astralform-login` first

2. **List teams** using `astralform_list_teams`

3. **List projects** using `astralform_list_projects`

4. **Display results** grouped by team:
   - Team name, slug, and role
   - Projects under each team: name, ID, created date

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
```

## Notes

- Projects are organized under teams
- Your role in each team determines what you can do (owner > admin > member)
- Use `astralform_list_team_members` to see who else is on a team
