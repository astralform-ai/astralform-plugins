---
name: astralform-model-providers
description: Manage model provider API keys in the Astralform vault
arguments:
  - name: action
    description: "Action to perform: list, add, delete, test (optional)"
    required: false
---

# Model Providers

Manage your model provider API keys stored in the Astralform vault. Keys are encrypted at rest and shared across all your projects.

## Steps

1. **Check authentication** by calling `astralform_whoami`
   - If not authenticated, guide user through device flow

2. **List current keys** by calling `astralform_list_provider_keys`
   - Display table: provider, display name, key hint, base URL
   - If no keys configured, mention that keys can be added

3. **Ask what to do** (or use `action` argument):
   - **Add/Update** a provider key
   - **Delete** a provider key
   - **Test** a provider key

4. **For Add/Update**:
   - Show available providers from the registry (openai, anthropic, groq, google, deepseek, ollama, openrouter, mistral, xai, together, fireworks, perplexity, cohere, azure_openai, custom, etc.)
   - Ask which provider
   - Ask for API key
   - Ask for custom base URL (only if provider requires it, e.g., azure_openai, custom)
   - Call `astralform_set_provider_key` with provider_name, api_key, and optional custom_base_url
   - Show key hint confirmation

5. **For Delete**:
   - Show current keys and ask which to remove
   - Call `astralform_delete_provider_key` with provider_name
   - Confirm deletion

6. **For Test**:
   - Show current keys and ask which to test
   - Call `astralform_test_provider_key` with provider_name
   - Show success/failure with latency

## Example Output

```
Model Providers

Your provider keys:
| Provider   | Display Name      | Key Hint      | Base URL |
|------------|-------------------|---------------|----------|
| openai     | OpenAI            | sk-...xyz     | -        |
| anthropic  | Anthropic         | sk-...abc     | -        |

? What would you like to do?
  1. Add/Update a provider key
  2. Delete a provider key
  3. Test a provider key

> 1

? Select provider: OpenAI
? API key: sk-xxxxxxxxxxxxxxx
Saved! Key hint: sk-...xxx

? What would you like to do?
  3. Test a provider key

> 3

? Select provider to test: OpenAI
Testing OpenAI connection...
Connected to OpenAI (gpt-4.1) - 423ms
```

## Notes

- Provider keys are stored at the account level (not per-project)
- Keys are encrypted at rest using your account encryption key
- The vault is used as fallback when projects don't have their own LLM API key
- Use AskUserQuestion for interactive prompts
