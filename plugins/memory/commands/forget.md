---
description: Remove outdated or incorrect memory
arguments:
  - name: topic
    description: Topic or keyword to forget
    required: true
---

# Forget Command

Remove outdated or incorrect memories from the system.

## Usage

```
/forget <topic>
```

## Examples

```
/forget console.log rule
/forget old typescript patterns
```

## What to Do

1. **Search for the memory:**
   - Find files in `lessons/` and `preferences/` containing the topic
   - Show what will be removed

2. **Confirm with user:**
   - Display the found entries
   - Ask: "Remove these entries? (y/n)"

3. **Remove or archive:**
   - Option A: Delete the specific entry from the file
   - Option B: Move to `archive/` folder (safer)
   - Option C: Mark as deprecated with strikethrough

4. **Update MEMORY.md** if needed

## Safety

- Never delete entire files without explicit confirmation
- Always show what will be removed first
- Prefer archiving over deleting
