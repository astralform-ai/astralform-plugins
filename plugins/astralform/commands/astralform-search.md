---
name: astralform-search
description: View or configure web search settings for an Astralform project
---

# Astralform Search Settings

View or configure web search for an Astralform project.

## Steps

1. **Check authentication** with `astralform_whoami`
2. **Select project** (list teams → list projects → user picks)
3. **Get current settings** with `astralform_get_search_settings`
4. **Display current config**:
   - Enabled: yes/no
   - Provider: ddgs, tavily, serper, or exa
   - Max results: 1-10
   - API key: configured yes/no (show hint if set)
5. **Ask what to change**:
   - Enable/disable search
   - Change provider (ddgs is free, others need API key)
   - Set max results
   - Update API key
6. **Apply changes** with `astralform_set_search_settings`
7. **Confirm** updated settings
