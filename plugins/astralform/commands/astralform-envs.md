---
name: astralform-envs
description: Manage environment variables for an Astralform project
---

# Astralform Environment Variables

List, set, or delete environment variables for an Astralform project. Values are encrypted at rest and injected into agent sandboxes.

## Steps

1. **Check authentication** with `astralform_whoami`
2. **Select project**
3. **List current env vars** with `astralform_list_envs` (shows keys only, never values)
4. **Ask what to do**:
   - **Set**: Ask for key (CONSTANT_CASE) and value, call `astralform_set_env`
   - **Delete**: Ask which key, call `astralform_delete_env`
   - **List**: Show current keys with created/updated timestamps
5. **Confirm** changes

## Notes

- Values are never exposed in responses (encrypted at rest)
- Keys must be CONSTANT_CASE (e.g., TAVILY_API_KEY, DATABASE_URL)
- Cannot delete vars required by skills assigned to agents
- Env vars are injected into Capsule sandboxes at runtime
