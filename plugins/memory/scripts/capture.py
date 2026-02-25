#!/usr/bin/env python3
"""
Memory Capture Script
Captures significant tool usage events for later processing.

Environment variables provided by Claude Code hooks:
- CLAUDE_TOOL_NAME: Name of the tool (Write, Edit, Bash, etc.)
- CLAUDE_TOOL_INPUT: JSON string of tool input
- CLAUDE_TOOL_OUTPUT: Tool output (truncated if too long)
"""

import json
import os
from datetime import datetime
from pathlib import Path


def get_memory_dir():
    """Get the memory directory path."""
    base = os.environ.get("CLAUDE_PROJECTS_DIR", Path.home() / ".claude" / "projects")
    # Find current project memory dir
    cwd = os.getcwd()
    memory_path = Path(base) / f"-{cwd.replace('/', '-').lstrip('-')}"

    # Fallback to global memory if project-specific doesn't exist
    if not memory_path.exists():
        memory_path = Path.home() / ".claude" / "memory"

    memory_path.mkdir(parents=True, exist_ok=True)
    return memory_path


def is_significant(tool_name, tool_input, _tool_output):
    """Determine if this tool use is worth remembering."""
    # Always capture file modifications to code files
    if tool_name in ("Write", "Edit"):
        file_path = tool_input.get("file_path", "")
        # Skip if modifying memory files (avoid recursion)
        if "memory" in file_path.lower():
            return False
        # Capture code files
        code_extensions = (".ts", ".tsx", ".js", ".jsx", ".py", ".rs", ".swift", ".go", ".java")
        if any(file_path.endswith(ext) for ext in code_extensions):
            return True

    # Capture bash commands that reveal patterns
    if tool_name == "Bash":
        command = tool_input.get("command", "")
        # Skip trivial commands
        trivial_patterns = ["ls", "cat ", "head ", "tail ", "echo ", "pwd"]
        if any(command.startswith(p) for p in trivial_patterns):
            return False
        # Capture build, test, install commands
        significant_patterns = ["npm", "bun", "cargo", "pip", "pytest", "test", "build", "run"]
        if any(p in command for p in significant_patterns):
            return True

    return False


def extract_topic(tool_input, tool_name):
    """Extract a topic/category from the tool input."""
    if tool_name in ("Write", "Edit"):
        file_path = tool_input.get("file_path", "")
        # Extract language/framework from path
        if ".ts" in file_path or ".tsx" in file_path:
            return "typescript"
        elif ".py" in file_path:
            return "python"
        elif ".rs" in file_path:
            return "rust"
        elif ".swift" in file_path:
            return "swift"
        elif ".js" in file_path or ".jsx" in file_path:
            return "javascript"

    if tool_name == "Bash":
        command = tool_input.get("command", "")
        if "cargo" in command:
            return "rust"
        elif "npm" in command or "bun" in command:
            return "javascript"
        elif "pip" in command or "pytest" in command:
            return "python"

    return "general"


def capture_event():
    """Main capture function."""
    tool_name = os.environ.get("CLAUDE_TOOL_NAME", "")
    tool_input_str = os.environ.get("CLAUDE_TOOL_INPUT", "{}")
    tool_output = os.environ.get("CLAUDE_TOOL_OUTPUT", "")

    try:
        tool_input = json.loads(tool_input_str)
    except json.JSONDecodeError:
        tool_input = {}

    # Skip if not significant
    if not is_significant(tool_name, tool_input, tool_output):
        return

    memory_dir = get_memory_dir()
    queue_file = memory_dir / "queue.md"

    # Create queue file with header if it doesn't exist
    if not queue_file.exists():
        queue_file.write_text("# Memory Queue\n# Pending items to be processed\n\n")

    topic = extract_topic(tool_input, tool_name)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Create entry
    entry = f"""
---
timestamp: {timestamp}
tool: {tool_name}
topic: {topic}
---

## {timestamp} - {tool_name}

**File/Command:** {tool_input.get('file_path', tool_input.get('command', 'unknown'))}

**Context:** <!-- Claude should fill this in -->

**Lesson:** <!-- What was learned -->

"""

    # Append to queue
    with open(queue_file, "a") as f:
        f.write(entry)

    print(f"[Memory] Captured {tool_name} event for topic: {topic}")


if __name__ == "__main__":
    capture_event()
