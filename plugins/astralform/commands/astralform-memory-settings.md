---
name: astralform-memory-settings
description: View or configure memory settings for an Astralform project
---

# Astralform Memory Settings

View or configure agent memory for an Astralform project.

## Steps

1. **Check authentication** with `astralform_whoami`
2. **Select project**
3. **Get current settings** with `astralform_get_memory_settings`
4. **Display current config**:
   - Enabled: yes/no
   - Retrieval: enabled/disabled (auto-inject relevant memories)
   - Extraction: enabled/disabled (auto-save memories from conversations)
   - Retrieval limit: 1-20 memories per turn
   - Max injection tokens: 200-4000
   - Min relevance: 0.0-1.0
5. **Ask what to change**
6. **Apply** with `astralform_set_memory_settings`
7. **Confirm** updated settings
