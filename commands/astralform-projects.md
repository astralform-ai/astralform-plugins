---
name: astralform-projects
description: List all your Astralform projects
---

# Astralform Projects

List all Astralform projects for the authenticated developer.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, inform user to run `/astralform-login` first

2. **List projects** using `astralform_list_projects`

3. **Display results** in a table format:
   - Project name
   - Project ID
   - Created date
   - Number of API keys
   - LLM configuration status

## Example Output

```
Your Astralform Projects:

| Name           | ID                                   | Created    | API Keys | LLM          |
|----------------|--------------------------------------|------------|----------|--------------|
| My AI App      | 550e8400-e29b-41d4-a716-446655440000 | 2025-01-15 | 2        | GPT-4o       |
| Test Project   | 550e8400-e29b-41d4-a716-446655440001 | 2025-01-20 | 1        | Not set      |

Use /astralform-create-project to create a new project.
Use astralform_get_project tool with project_id for more details.
```

## Notes

- Shows all projects owned by the authenticated developer
- API key count helps track active integrations
- LLM status helps identify projects needing configuration
