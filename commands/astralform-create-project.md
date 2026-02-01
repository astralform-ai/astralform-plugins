---
name: astralform-create-project
description: Create a new Astralform project with guided setup
arguments:
  - name: project_name
    description: Name for your new project (optional, will prompt if not provided)
    required: false
---

# Astralform Create Project

Create a new Astralform project with optional guided setup.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, inform user to run `/astralform-login` first

2. **Get project name**:
   - Use the provided argument if given
   - Otherwise, ask user for a project name

3. **Create the project** using `astralform_create_project`
   - This returns the project details AND an encryption_key

4. **IMPORTANT: Display the encryption key warning**:
   ```
   ⚠️  SAVE THIS ENCRYPTION KEY - IT WILL ONLY BE SHOWN ONCE!

   Encryption Key: enc_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

   This key is used to encrypt conversation data. Store it securely.
   If lost, conversation data cannot be recovered.
   ```

5. **Offer next steps**:
   - Create an API key for the project
   - Configure LLM settings
   - Run `/astralform-setup` for full guided setup

## Example Output

```
Creating project "My AI App"...

✅ Project created successfully!

Project ID: 550e8400-e29b-41d4-a716-446655440000
Name: My AI App
Created: 2025-01-28

⚠️  SAVE THIS ENCRYPTION KEY - IT WILL ONLY BE SHOWN ONCE!

Encryption Key: enc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

Store this key securely. It's required to decrypt conversation data.

Next steps:
1. Create an API key: astralform_create_api_key tool
2. Configure LLM: astralform_set_llm_config tool
3. Or run /astralform-setup for guided setup
```

## Notes

- Encryption key is shown ONLY ONCE at creation
- Projects can be renamed later but not deleted without careful confirmation
- Each project has isolated conversations and API keys
