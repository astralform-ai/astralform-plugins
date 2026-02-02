---
name: astralform-login
description: Authenticate with Astralform to manage your AI agent projects
---

# Astralform Login

You are helping the user authenticate with Astralform using OAuth Device Flow.

## Steps

1. **Start the authentication flow** by calling the `astralform_device_code` MCP tool.

2. **Display the login instructions** to the user:
   - Show the verification URL (e.g., `https://astralform.ai/device`)
   - Show the user code they need to enter
   - Remind them they have a limited time (usually 15 minutes)

3. **Wait for authentication** by polling with `astralform_device_token` tool:
   - Poll every 5 seconds
   - Handle `authorization_pending` by continuing to poll
   - Handle `slow_down` by increasing the interval
   - Handle `expired_token` by restarting the flow
   - Handle `access_denied` by informing the user

4. **On success**:
   - The token is automatically stored at `~/.astralform/credentials.json`
   - Confirm the user is logged in
   - Show their email/name from `astralform_whoami`

5. **On failure**:
   - Explain what went wrong
   - Offer to restart the flow

## Example Output

```
Starting Astralform authentication...

Please visit: https://astralform.ai/device
And enter code: ABCD-1234

Waiting for authentication...

Successfully logged in as tony@example.com
Your credentials have been saved to ~/.astralform/credentials.json
```

## Notes

- If already logged in, ask if they want to re-authenticate
- Credentials are stored locally and never sent anywhere except Astralform APIs
- Token will be refreshed automatically when expired
