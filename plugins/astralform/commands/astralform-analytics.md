---
name: astralform-analytics
description: View usage analytics for your Astralform projects
arguments:
  - name: project_name
    description: Project name or ID (optional, will list projects if not provided)
    required: false
  - name: period
    description: Time period - 7d, 30d, 90d (default 7d)
    required: false
---

# Astralform Analytics

View usage analytics and statistics for Astralform projects.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, inform user to run `/astralform-login` first

2. **Select project**:
   - If `project_name` provided, use it
   - Otherwise, call `astralform_list_projects` and ask user to choose

3. **Get analytics** using `astralform_get_analytics`
   - Pass project_id and date range based on period

4. **Display results**:
   - Total conversations
   - Total messages
   - Token usage (input/output)
   - Tool usage breakdown
   - Daily usage chart (ASCII)

## Example Output

```
📊 Analytics for "My AI App"
Period: Last 7 days (Jan 21 - Jan 28, 2025)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overview:
  Conversations: 156
  Messages: 1,247
  Input tokens: 524,832
  Output tokens: 187,456
  Total tokens: 712,288

Tool Usage:
  Tavily search: 89 calls
  MCP (github): 45 calls
  Client tools: 23 calls

Daily Activity:
  Jan 21 ████████████ 142 messages
  Jan 22 ████████████████ 198 messages
  Jan 23 ██████████████████████ 267 messages
  Jan 24 ██████████████████ 223 messages
  Jan 25 ████████████████████ 245 messages
  Jan 26 ████████ 98 messages
  Jan 27 ██████ 74 messages

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tip: Use astralform_get_analytics with custom date ranges for more control.
```

## Notes

- Analytics are aggregated from usage_records and tool_usage tables
- Helps track API usage for billing and optimization
- Can be used to identify peak usage times
