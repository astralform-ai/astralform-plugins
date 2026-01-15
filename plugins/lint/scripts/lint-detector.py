#!/usr/bin/env python3
"""
Claude Code Lint Detector - Data-driven linter runner.
Automatically runs linters after code modifications and provides feedback.
"""

import json
import os
import sys
import subprocess
import shutil
import pathlib
from typing import Dict, Optional, Tuple, List


def parse_input() -> Dict:
    """Parse JSON input from stdin."""
    try:
        return json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)


def load_linters_config() -> Dict:
    """Load linters.json from plugin directory."""
    plugin_root = os.path.expanduser(os.environ.get("CLAUDE_PLUGIN_ROOT", ""))
    config_path = os.path.join(plugin_root, "scripts", "linters.json")

    try:
        with open(config_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: linters.json not found at {config_path}", file=sys.stderr)
        sys.exit(1)


def detect_language_from_config(file_path: str, config: Dict) -> Optional[str]:
    """Detect language using extension map from config."""
    ext = pathlib.Path(file_path).suffix.lower()

    for lang_name, lang_config in config["languages"].items():
        if ext in lang_config["extensions"]:
            return lang_name

    return None


def get_gradle_command(linter_config: Dict) -> str:
    """Determine gradle command: try gradlew first, fallback to gradle."""
    if os.path.exists("./gradlew"):
        return "./gradlew"
    else:
        return "gradle"


def check_binary_availability(linter_config: Dict) -> Tuple[bool, Optional[str]]:
    """
    Check if linter binary is available using which().
    Returns (is_available, install_command) or (True, None).
    """
    # Check for direct binary
    binary = linter_config.get("binary")
    if binary and shutil.which(binary):
        return True, None

    # Check for npx (Node.js tools)
    if "npx" in linter_config and shutil.which("npx"):
        return True, None

    # No binary found - provide install command
    install_methods = linter_config.get("install", {})
    for manager in [
        "npm",
        "yarn",
        "pnpm",
        "pip",
        "pipx",
        "pip3",
        "brew",
        "gem",
        "composer",
        "rustup",
        "cargo",
        "homebrew",
        "mint",
        "sdkman",
        "go",
        "apt",
    ]:
        if manager in install_methods and (
            manager != "rustup" or shutil.which("rustup")
        ):
            install_pkg = install_methods[manager]
            if manager == "npm":
                return False, f"npm install -g {install_pkg}"
            elif manager == "yarn":
                return False, f"yarn global add {install_pkg}"
            elif manager == "pnpm":
                return False, f"pnpm install -g {install_pkg}"
            elif manager == "pip":
                return False, f"pip install {install_pkg}"
            elif manager == "pipx":
                return False, f"pipx install {install_pkg}"
            elif manager == "pip3":
                return False, f"pip3 install {install_pkg}"
            elif manager == "brew":
                return False, f"brew install {install_pkg}"
            elif manager == "homebrew":
                return False, f"brew install {install_pkg}"
            elif manager == "gem":
                return False, f"gem install {install_pkg}"
            elif manager == "composer":
                return False, f"composer global require {install_pkg}"
            elif manager == "composer-global":
                return False, f"composer global require {install_pkg}"
            elif manager == "rustup":
                return False, f"rustup component add {install_pkg}"
            elif manager == "cargo":
                return False, f"cargo install {install_pkg}"
            elif manager == "mint":
                return False, f"mint install {install_pkg}"
            elif manager == "sdkman":
                return False, f"sdk install {install_pkg}"
            elif manager == "go":
                return False, f"go install {install_pkg}"
            elif manager == "apt":
                return False, f"sudo apt install {install_pkg}"

    return False, f"Install {linter_config['name']} manually"


def scan_project_linters(project_root: str, language: str, config: Dict) -> Dict:
    """
    Scan project and check linter availability.
    Returns: {
        "configured": ["eslint"],
        "available": ["eslint"],
        "missing": ["prettier"],
        "install_commands": {"prettier": "npm install -g prettier"}
    }
    """
    lang_config = config["languages"].get(language, {})
    result = {"configured": [], "available": [], "missing": [], "install_commands": {}}

    for linter_name, linter_config in lang_config.get("linters", {}).items():
        # Check if configured
        if any(
            os.path.exists(os.path.join(project_root, cfg))
            for cfg in linter_config["config_files"]
        ):
            result["configured"].append(linter_name)

            # Check binary availability
            is_available, install_cmd = check_binary_availability(linter_config)

            if is_available:
                result["available"].append(linter_name)
            else:
                result["missing"].append(linter_name)
                result["install_commands"][linter_name] = install_cmd

    return result


def run_linter_dynamic(linter_config: Dict, file_path: str) -> Tuple[bool, str]:
    """
    Generic linter runner using config.
    Handles direct binary, npx, and gradle commands.
    """
    timeout = linter_config.get("timeout", 10)

    # Determine command
    # Special handling for Detekt which uses gradle template
    if "{gradle}" in linter_config["command"]:
        gradle_cmd = get_gradle_command(linter_config)
        command_template = linter_config["command"]
        command_str = command_template.format(gradle=gradle_cmd, file=file_path)
        cmd = command_str.split()
    elif "npx" in linter_config:
        # Use npx for Node.js tools - command already contains full npx invocation
        command_str = linter_config["command"].format(file=file_path)
        cmd = command_str.split()
    else:
        # Direct binary
        command_template = linter_config["command"]
        command_str = command_template.format(file=file_path)
        cmd = command_str.split()

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)

        if result.returncode != 0:
            error_output = result.stderr.strip() or result.stdout.strip()
            if error_output:
                return False, f"{linter_config['name']} errors:\n{error_output}"

        return True, ""
    except subprocess.TimeoutExpired:
        return False, f"{linter_config['name']} timed out"
    except FileNotFoundError:
        # Should not happen if we check availability first
        return False, f"{linter_config['name']} binary not found"


def find_project_root(file_path: str, project_dir_env: str) -> str:
    """Find project root directory."""
    if project_dir_env and os.path.isdir(project_dir_env):
        return project_dir_env

    current_dir = os.path.dirname(os.path.abspath(file_path))

    config_files = [
        "package.json",
        "pyproject.toml",
        "setup.cfg",
        "requirements.txt",
        ".swiftlint.yml",
        "Package.swift",
        "build.gradle",
        "build.gradle.kts",
        "detekt.yml",
        ".git",
    ]

    while current_dir != "/":
        for config in config_files:
            if os.path.exists(os.path.join(current_dir, config)):
                return current_dir
        current_dir = os.path.dirname(current_dir)

    return os.path.dirname(os.path.abspath(file_path))


def hook_mode(file_path: str, config: Dict) -> None:
    """Handle PostToolUse hook - single file."""
    # Detect language
    language = detect_language_from_config(file_path, config)
    if not language:
        sys.exit(0)

    # Find project root
    project_dir = os.path.expanduser(os.environ.get("CLAUDE_PROJECT_DIR", ""))
    project_root = find_project_root(file_path, project_dir)

    # Scan for missing linters
    status = scan_project_linters(project_root, language, config)

    # BLOCK if configured linters are missing
    if status["missing"]:
        missing_info = []
        for linter_name in status["missing"]:
            linter_cfg = config["languages"][language]["linters"][linter_name]
            install_cmd = status["install_commands"][linter_name]
            docs = linter_cfg["docs"]
            missing_info.append(
                f"- {linter_cfg['name']}: {install_cmd}\n  Docs: {docs}"
            )

        output = {
            "decision": "block",
            "reason": f"Required linters are not installed:\n\n"
            + "\n".join(missing_info),
            "hookSpecificOutput": {
                "additionalContext": (
                    "Run these commands to install missing linters, "
                    "then try again. Or run /lint:status for more details."
                )
            },
        }
        print(json.dumps(output))
        sys.exit(1)

    # Run all configured linters on file
    lang_config = config["languages"][language]
    errors = []

    for linter_name in status["configured"]:
        linter_config = lang_config["linters"][linter_name]

        # Check if linter has file extension restriction
        only_for = linter_config.get("only_for", [])
        if only_for:
            ext = pathlib.Path(file_path).suffix
            if ext not in only_for:
                continue  # Skip this linter for this file type

        success, error_msg = run_linter_dynamic(linter_config, file_path)
        if not success and error_msg:
            errors.append(error_msg)

    if errors:
        output = {
            "decision": "block",
            "reason": f"Lint issues found in {file_path}:\n" + "\n".join(errors),
            "hookSpecificOutput": {
                "additionalContext": "Lint issues need to be fixed. Use the lint-fixer skill for guidance."
            },
        }
        print(json.dumps(output))
        sys.exit(0)


def main():
    """Main entry point."""
    input_data = parse_input() if not sys.stdin.isatty() else {}

    # Extract file path from tool input
    tool_input = input_data.get("tool_input", {})
    file_path = tool_input.get("file_path")

    if not file_path:
        sys.exit(0)

    if not os.path.exists(file_path):
        sys.exit(0)

    config = load_linters_config()
    hook_mode(file_path, config)


if __name__ == "__main__":
    main()
