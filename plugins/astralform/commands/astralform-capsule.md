---
name: astralform-capsule
description: View Capsule sandbox sessions and usage stats for an Astralform project
arguments:
  - name: project_id
    description: Project UUID to inspect Capsule activity for (optional)
    required: false
---

# Astralform Capsule

Inspect Capsule sandbox activity for a project — active/recent sandbox sessions
and aggregate usage stats. Agents with non-system skills automatically run in a
Capsule sandbox, so this is where you observe that execution layer.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, explain that Claude Code will auto-authenticate on the next MCP tool call

2. **Select project**:
   - If `project_id` provided, call `astralform_get_project` to verify
   - Otherwise:
     - Call `astralform_list_teams` to show teams
     - Call `astralform_list_projects` to list projects (grouped by team)
     - Let user choose a project

3. **List sandbox sessions** by calling `astralform_list_capsule_sessions` for the project
   - Display table: session id, status, template, created, last activity, agent

4. **Show usage stats** by calling `astralform_get_capsule_stats` for the project
   - Display aggregates: total sessions, active now, total exec time, sandbox template breakdown

5. **Display next steps**:
   - If sandboxes are idle/unused, note that only agents with non-system skills spin one up
   - Suggest `/astralform-skills` to review which skills trigger a sandbox

## Example Output

```
Astralform Capsule — "My AI App"

Active / Recent Sessions:
| Session    | Status  | Template   | Last Activity     | Agent       |
|------------|---------|------------|-------------------|-------------|
| cap_8f3a.. | running | base       | 2026-06-12 10:31  | team-lead   |
| cap_2b91.. | stopped | python-ds  | 2026-06-12 09:58  | researcher  |

Stats (last 30 days):
  Total sessions:   142
  Active now:        1
  Total exec time:   6h 12m
  Templates:         base (118), python-ds (24)
```

## Notes

- Capsule sandboxes are created automatically for agents that have non-system
  skills; there are no manual on/off toggles
- Network access inside a Capsule sandbox is always on
- `sandbox_template` and `sandbox_envs` remain configurable per agent (see
  `/astralform-create-agent`); the legacy `sandbox_enabled` / `network_access`
  columns are unused
- Capsule tool errors are returned to the agent as text, not logged as backend
  errors — check agent responses, not server logs, when debugging sandbox runs
