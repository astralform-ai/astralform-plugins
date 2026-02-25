---
description: Manually add a lesson or preference to memory
arguments:
  - name: lesson
    description: The lesson or preference to remember
    required: true
---

# Remember Command

Manually save a lesson or preference to the memory system.

## Usage

```
/remember <lesson>
```

## Examples

```
/remember Always use logger instead of console.log in this project
/remember User prefers functional components over class components
/remember Don't commit .env files
```

## What to Do

1. **Parse the lesson:**
   - Determine the topic (typescript, python, rust, git, general, etc.)
   - Extract the key rule/preference

2. **Determine memory directory:**
   - First check: `~/.claude/projects/-<project-path>/memory/`
   - Fallback: `~/.claude/memory/`

3. **Save to appropriate file:**
   - If it's a preference → `preferences/index.md`
   - If it's a lesson about a topic → `lessons/<topic>.md`
   - Create the file if it doesn't exist

4. **Format the entry:**
   ```markdown
   ## [Date] - [Brief Title]

   **Rule:** [The lesson/preference]

   **Context:** [When this applies]
   ```

5. **Update MEMORY.md** if this is an important preference

## File Structure

```
memory/
├── lessons/
│   ├── typescript.md
│   ├── python.md
│   ├── rust.md
│   └── git.md
└── preferences/
    └── index.md
```
