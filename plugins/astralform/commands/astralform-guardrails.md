---
name: astralform-guardrails
description: View or configure guard rails for an Astralform project
---

# Astralform Guard Rails

View or configure safety guard rails for an Astralform project.

## Steps

1. **Check authentication** with `astralform_whoami`
2. **Select project**
3. **Get current settings** with `astralform_get_guardrails_settings`
4. **Display current config**:
   - Guard rails enabled: yes/no
   - PII detection: enabled/disabled, types, strategy (redact/mask/hash/block)
   - Execution limits: enabled/disabled, max model calls, max tool calls
   - Secret guard: automatic (count of protected env vars)
5. **Ask what to change**:
   - Enable/disable guard rails
   - Configure PII detection (types: email, credit_card, ip, mac_address, url)
   - Set PII strategy (redact, mask, hash, block)
   - Set execution limits (max model calls 1-500, max tool calls 1-500)
6. **Apply** with `astralform_set_guardrails_settings`
7. **Confirm** updated settings
