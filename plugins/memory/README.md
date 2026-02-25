# Memory Plugin

Automatic persistent memory for Claude Code with progressive disclosure.

## Features

- **Automatic Capture** - Hooks capture significant tool usage events automatically
- **Progressive Disclosure** - Load relevant memories on-demand, not all at once
- **Markdown-First** - Human-readable memory files you can edit directly
- **Topic Organization** - Lessons organized by language/framework
- **Session Summaries** - Daily summaries of what was learned
- **Simple Architecture** - No background services, no SQLite, just markdown + hooks

## Installation

```bash
# In Claude Code
/plugin marketplace add astralform-ai/astralform-plugins
/plugin install memory
```

## Commands

| Command | Description |
|---------|-------------|
| `/recall [query]` | Search and load relevant memories |
| `/remember <lesson>` | Manually add a lesson to memory |
| `/forget <topic>` | Remove outdated memory |

## How It Works

### Automatic Capture

When you use Write, Edit, or Bash tools, the plugin automatically:
1. Detects if the action is "significant" (code files, build commands)
2. Extracts the topic (typescript, python, rust, etc.)
3. Queues the event for later processing

### Session Summary

When your session ends, the plugin:
1. Processes queued events
2. Creates/updates a daily session summary
3. Updates the quick reference file

### Progressive Disclosure

| Layer | When Loaded | What |
|-------|-------------|------|
| 1 | Every session | Quick reference (MEMORY.md) |
| 2 | On `/recall` | Topic-specific lessons |
| 3 | When needed | Full session details |

## Memory Structure

```
~/.claude/projects/-<project>/memory/
├── MEMORY.md              # Quick reference (auto-loaded)
├── queue.md               # Pending items
├── sessions/              # Daily summaries
│   └── 2026-02-25.md
├── lessons/               # By topic
│   ├── typescript.md
│   ├── python.md
│   └── rust.md
└── preferences/           # User preferences
    └── index.md
```

## Philosophy

Inspired by [claude-mem](https://github.com/thedotmack/claude-mem) but simplified:

| Feature | claude-mem | This Plugin |
|---------|-----------|-------------|
| Storage | SQLite | Markdown |
| Retrieval | MCP tools | Commands |
| Worker | Background | Hook scripts |
| Human-readable | No | Yes |

## License

MIT
