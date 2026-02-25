---
description: Search and load relevant memories from storage
arguments:
  - name: query
    description: Topic or keyword to search for
    required: false
---

# Recall Command

Search and retrieve relevant memories from the memory system.

## Usage

```
/recall [query]
```

## What to Do

1. **Determine the memory directory:**
   - First check: `~/.claude/projects/-<project-path>/memory/`
   - Fallback: `~/.claude/memory/`

2. **If no query provided:**
   - Show the contents of `MEMORY.md` (quick reference)
   - List available topic folders

3. **If query provided:**
   - Search `lessons/` folder for matching topic files
   - Search `sessions/` folder for recent sessions
   - Load and display relevant content

4. **Progressive disclosure:**
   - First show: Summary/headings only
   - If user wants more: Show full content of specific file

## Search Strategy

When searching for memories:

1. **Topic match:** Check if query matches a topic file (e.g., "typescript" → `lessons/typescript.md`)
2. **Keyword search:** Grep through files for keyword mentions
3. **Recent sessions:** Check last 3 session summaries for relevance

## Example Output

```
📖 Memory Search: "typescript"

Found in:
- lessons/typescript.md (3 lessons)
- sessions/2026-02-25.md (2 mentions)

Top result:
> Don't use `any` type - prefer explicit types or `unknown`
```
