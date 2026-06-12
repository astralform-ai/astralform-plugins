---
name: astralform-marketplace
description: Browse the Astralform skill marketplace and install skills into a project
arguments:
  - name: query
    description: Optional search term to filter the marketplace catalog
    required: false
---

# Astralform Marketplace

Browse the Astralform skill marketplace and install community-published skills
directly into one of your projects.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, explain that Claude Code will auto-authenticate on the next MCP tool call

2. **Browse the catalog** by calling `astralform_browse_marketplace`
   - If a `query` was provided, pass it through to filter results
   - Display table: name, slug, category, author, version, short description

3. **Select a skill to install** (if the user picks one):
   - Show the full description, included references, and required connectors/sandbox

4. **Select the target project**:
   - Call `astralform_list_teams` to show teams
   - Call `astralform_list_projects` and let the user choose (grouped by team)

5. **Install** by calling `astralform_install_marketplace_skill` with the marketplace
   slug and the target project_id
   - On success, confirm the skill now appears in `/astralform-skills`

6. **Display next steps**:
   - Suggest `/astralform-skills` to view or toggle the newly installed skill
   - Suggest `/astralform-create-agent` to assign it to an agent

## Example Output

```
Astralform Marketplace — query: "pdf"

| Name        | Slug          | Category   | Author   | Version |
|-------------|---------------|------------|----------|---------|
| PDF Extract | pdf-extract   | documents  | astral   | 1.2.0   |
| PDF Forms   | pdf-forms     | documents  | community | 0.3.0  |

Install "PDF Extract" into which project?
  1. My AI App        (Team: Acme)
  2. Support Bot       (Team: Acme)

Installed pdf-extract@1.2.0 into "My AI App".
View it: /astralform-skills
```

## Notes

- Installing a marketplace skill copies it into the project as a managed skill;
  it then behaves like any other skill in `/astralform-skills`
- Marketplace skills may declare required connectors or a sandbox template —
  enable those via `/astralform-enable-connector` before the agent runs
- Re-running install with the same slug upgrades the project copy to the latest
  published version
