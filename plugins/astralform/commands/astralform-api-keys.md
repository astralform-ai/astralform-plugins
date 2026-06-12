---
name: astralform-api-keys
description: List, create, and revoke API keys for an Astralform project
arguments:
  - name: project_id
    description: Project UUID to manage API keys for (optional)
    required: false
---

# Astralform API Keys

List, create, and revoke the `sk_*` API keys that SDK clients use to call an
Astralform project.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, explain that Claude Code will auto-authenticate on the next MCP tool call

2. **Select project**:
   - If `project_id` provided, call `astralform_get_project` to verify
   - Otherwise:
     - Call `astralform_list_teams` to show teams
     - Call `astralform_list_projects` to list projects (grouped by team)
     - Let user choose a project

3. **List keys** by calling `astralform_list_api_keys` for the selected project
   - Display table: name, key prefix (masked), created, last used, status
   - Never display full secret values for existing keys — they are only shown once at creation

4. **Manage keys** based on what the user wants:
   - **Create**: `astralform_create_api_key` with a descriptive name
     - Show the full secret ONCE and tell the user to store it now — it cannot be retrieved again
   - **Revoke**: `astralform_revoke_api_key` with the key id (confirm first — clients using it break immediately)

5. **Display next steps**:
   - Point iOS integrations to `/astralform-ios-setup` (uses the new key)
   - Remind the user that revoked keys cannot be restored — create a new one instead

## Example Output

```
Astralform API Keys — "My AI App"

| Name        | Prefix         | Created     | Last Used   | Status  |
|-------------|----------------|-------------|-------------|---------|
| ios-prod    | sk_a1B2c3D4e…  | 2026-05-01  | 2026-06-12  | active  |
| ci-test     | sk_9fE8d7C6b…  | 2026-05-20  | 2026-06-10  | active  |
| old-laptop  | sk_3cF4a5B6c…  | 2026-01-02  | 2026-03-15  | revoked |

Created key "staging":
  sk_<full-secret-shown-here-once>
  ^ Store this now — it will not be shown again.
```

## Notes

- API keys are project-scoped and grant SDK-level access to that project's agents
- A key's secret is shown exactly once, at creation — there is no retrieval endpoint
- Revoking is immediate and irreversible; rotate by creating a new key first, then
  revoking the old one once clients are migrated
- For end-user OAuth tokens (not developer SDK keys) the project uses the OIDC flow,
  not these `sk_*` keys
