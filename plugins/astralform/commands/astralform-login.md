---
name: astralform-login
description: Authenticate with Astralform to manage your AI agent projects
---

# Astralform Login

Check authentication status with Astralform.

## How Authentication Works

The Astralform plugin uses **MCP OAuth** — authentication is handled automatically by Claude Code when you first use any Astralform MCP tool. Claude Code discovers the OAuth server via `https://mcp.astralform.ai/.well-known/oauth-authorization-server` and opens a browser for login.

There is no manual device code flow. If you see an authentication error, Claude Code will prompt you to re-authenticate.

## Steps

1. **Check authentication status** by calling `astralform_whoami`.

2. **If authenticated**:
   - Show the user's email and name
   - Confirm they're ready to use Astralform tools

3. **If not authenticated**:
   - Explain that Claude Code will automatically open a browser for OAuth login on the next MCP tool call
   - Suggest calling `astralform_whoami` to trigger the auth flow
   - After auth completes, confirm with `astralform_whoami`

## Example Output

```
Checking Astralform authentication...

Logged in as tony@example.com
You're ready to manage your Astralform projects.
```

## Notes

- Authentication is automatic via MCP OAuth — no manual token handling needed
- If auth expires, Claude Code re-authenticates automatically on the next tool call
- Credentials are managed by Claude Code, not stored in local files
