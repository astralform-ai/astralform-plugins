---
name: astralform-create-project
description: Create a new Astralform project with guided setup
arguments:
  - name: project_name
    description: Name for your new project (optional, will prompt if not provided)
    required: false
---

# Astralform Create Project

Create a new Astralform project under a team.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, inform user to run `/astralform-login` first

2. **Select team**:
   - Call `astralform_list_teams` to show available teams
   - If only one team, use it automatically
   - Otherwise, ask user which team to create the project under
   - Only teams where user has owner or admin role can have projects created

3. **Get project name**:
   - Use the provided argument if given
   - Otherwise, ask user for a project name

4. **Create the project** using `astralform_create_project` with `team_id` and `name`
   - This returns the project details AND an encryption_key

5. **IMPORTANT: Display the encryption key warning**:
   ```
   SAVE THIS ENCRYPTION KEY - IT WILL ONLY BE SHOWN ONCE!

   Encryption Key: enc_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

   This key is used to encrypt conversation data. Store it securely.
   If lost, conversation data cannot be recovered.
   ```

6. **Offer next steps**:
   - Create an API key for the project
   - Configure LLM settings
   - Run `/astralform-setup` for full guided setup

## Example Output

```
Creating project "My AI App" under team "My Team"...

Project created successfully!

Project ID: 550e8400-e29b-41d4-a716-446655440000
Team: My Team (my-team)
Name: My AI App
Created: 2025-01-28

SAVE THIS ENCRYPTION KEY - IT WILL ONLY BE SHOWN ONCE!

Encryption Key: enc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

Store this key securely. It's required to decrypt conversation data.

Next steps:
1. Create an API key: astralform_create_api_key tool
2. Configure LLM: astralform_set_llm_config tool
3. Or run /astralform-setup for guided setup
```

## Notes

- Encryption key is shown ONLY ONCE at creation
- You must have owner or admin role in the team to create projects
- Projects can be renamed later but not deleted without careful confirmation
- Each project has isolated conversations and API keys
