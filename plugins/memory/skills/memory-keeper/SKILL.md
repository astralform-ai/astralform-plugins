---
name: memory-keeper
description: Automatic persistent memory for Claude Code with progressive disclosure and markdown-first storage
---

# Memory Keeper Skill

Automatic persistent memory system for Claude Code with progressive disclosure.

## Purpose

This skill helps Claude maintain persistent memory across sessions by:

1. **Automatic Capture** - Hooks capture significant tool usage events
2. **Progressive Disclosure** - Load relevant memories on-demand, not all at once
3. **Topic Organization** - Lessons organized by language/framework
4. **Session Summaries** - Daily summaries of what was learned

## Memory Architecture

```
~/.claude/projects/-<project>/memory/
├── MEMORY.md              # Auto-loaded (quick reference, under 200 lines)
├── queue.md               # Pending items (processed on session end)
├── sessions/              # Daily session summaries
│   └── 2026-02-25.md
├── lessons/               # Lessons organized by topic
│   ├── typescript.md
│   ├── python.md
│   ├── rust.md
│   └── git.md
└── preferences/           # User preferences
    └── index.md
```

## How It Works

### Automatic Capture (PostToolUse Hook)

When you use Write, Edit, or Bash tools, the capture script:
1. Checks if the action is "significant" (code files, build commands, etc.)
2. Extracts the topic (language/framework)
3. Adds an entry to `queue.md`

### Session Summary (Stop Hook)

When the session ends, the summarize script:
1. Processes entries in `queue.md`
2. Appends them to `sessions/YYYY-MM-DD.md`
3. Updates `MEMORY.md` with today's session reference

### Progressive Disclosure

| Layer | When Loaded | Content |
|-------|-------------|---------|
| 1 | Every session | `MEMORY.md` (quick reference) |
| 2 | On `/recall` command | Topic files from `lessons/` |
| 3 | When needed | Full session details |

## Commands

| Command | Purpose |
|---------|---------|
| `/recall [query]` | Search and load relevant memories |
| `/remember <lesson>` | Manually add a lesson |
| `/forget <topic>` | Remove outdated memory |

## When to Update Memory

### Automatically captured:
- Code file modifications (Write/Edit)
- Build/test/install commands (Bash)

### Manually add with `/remember`:
- User corrections: "Don't do X, do Y instead"
- Discovered preferences: "User prefers X"
- Solutions to tricky problems
- Things to avoid

### Remove with `/forget`:
- Outdated patterns
- Incorrect lessons
- No longer relevant info

## Best Practices

1. **Don't over-capture** - Only significant events matter
2. **Keep MEMORY.md short** - Under 200 lines, use topic files for details
3. **Organize by topic** - Makes retrieval faster
4. **Review periodically** - Archive old sessions, keep lessons current

## Hit Rate Strategy

To increase the chance of finding the right memory:

1. **Topic tagging** - Each entry tagged with language/framework
2. **Keyword extraction** - Important terms in headings
3. **Cross-references** - Link related lessons
4. **Recent first** - Show recent sessions before old ones

## Comparison to claude-mem

| Feature | claude-mem | This Plugin |
|---------|-----------|-------------|
| Storage | SQLite | Markdown files |
| Retrieval | MCP tools | Commands + skill |
| Worker | Background service | Hook scripts |
| Human-readable | No | Yes |
| Complexity | High | Low |
