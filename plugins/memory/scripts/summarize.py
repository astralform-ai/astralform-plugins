#!/usr/bin/env python3
"""
Memory Summarize Script
Runs at session end to process the queue and create session summary.
"""

import os
from datetime import datetime
from pathlib import Path


def get_memory_dir():
    """Get the memory directory path."""
    base = os.environ.get("CLAUDE_PROJECTS_DIR", Path.home() / ".claude" / "projects")
    cwd = os.getcwd()
    memory_path = Path(base) / f"-{cwd.replace('/', '-').lstrip('-')}"

    if not memory_path.exists():
        memory_path = Path.home() / ".claude" / "memory"

    memory_path.mkdir(parents=True, exist_ok=True)
    return memory_path


def process_queue(memory_dir):
    """Process the queue file and move items to appropriate topic files."""
    queue_file = memory_dir / "queue.md"

    if not queue_file.exists():
        return []

    content = queue_file.read_text()

    # Parse entries (simple split by ---)
    entries = []
    current_entry = []

    for line in content.split("\n"):
        if line.strip() == "---":
            if current_entry:
                entries.append("\n".join(current_entry))
                current_entry = []
        else:
            current_entry.append(line)

    if current_entry:
        entries.append("\n".join(current_entry))

    # Clear queue after processing
    queue_file.write_text("# Memory Queue\n# Pending items to be processed\n\n")

    return entries


def create_session_summary(memory_dir, entries):
    """Create a session summary file."""
    if not entries:
        return

    sessions_dir = memory_dir / "sessions"
    sessions_dir.mkdir(exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    summary_file = sessions_dir / f"{today}.md"

    # Append to existing or create new
    mode = "a" if summary_file.exists() else "w"

    with open(summary_file, mode) as f:
        if mode == "w":
            f.write(f"# Session Summary - {today}\n\n")
            f.write("## Events\n\n")

        for entry in entries:
            f.write(entry)
            f.write("\n---\n\n")

    print(f"[Memory] Session summary updated: {summary_file}")


def update_main_memory(memory_dir):
    """Update MEMORY.md with recent items reference."""
    memory_file = memory_dir / "MEMORY.md"

    today = datetime.now().strftime("%Y-%m-%d")

    if not memory_file.exists():
        memory_file.write_text(f"""# Persistent Memory

Auto-loaded into every conversation. Keep under 200 lines.

## Quick Reference

| Topic | File |
|-------|------|
| Sessions | [sessions/](sessions/) |
| Lessons | [lessons/](lessons/) |
| Preferences | [preferences/](preferences/) |

## Today's Session

See [sessions/{today}.md](sessions/{today}.md) for today's activity.

## Recent Learnings

<!-- Quick entries - detailed notes go in topic files -->
""")
        print(f"[Memory] Created MEMORY.md at {memory_file}")


def main():
    """Main function."""
    memory_dir = get_memory_dir()

    # Create directory structure
    (memory_dir / "sessions").mkdir(exist_ok=True)
    (memory_dir / "lessons").mkdir(exist_ok=True)
    (memory_dir / "preferences").mkdir(exist_ok=True)

    # Process queue
    entries = process_queue(memory_dir)

    # Create session summary
    create_session_summary(memory_dir, entries)

    # Update main memory
    update_main_memory(memory_dir)

    if entries:
        print(f"[Memory] Processed {len(entries)} entries")
    else:
        print("[Memory] No entries to process")


if __name__ == "__main__":
    main()
