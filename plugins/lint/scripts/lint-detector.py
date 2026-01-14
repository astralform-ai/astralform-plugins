#!/usr/bin/env python3
"""
Claude Code Lint Detector
Automatically runs linters after code modifications and provides feedback.
"""

import json
import os
import sys
import subprocess
import pathlib
from typing import Dict, Optional, Tuple


def parse_input() -> Dict:
    """Parse JSON input from stdin."""
    try:
        return json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)


def get_file_extension(file_path: str) -> str:
    """Get file extension from path."""
    return pathlib.Path(file_path).suffix.lower()


def detect_language(file_path: str) -> Optional[str]:
    """Detect programming language from file extension."""
    ext = get_file_extension(file_path)

    language_map = {
        ".js": "javascript",
        ".ts": "typescript",
        ".tsx": "typescript",
        ".jsx": "javascript",
        ".py": "python",
        ".swift": "swift",
        ".kt": "kotlin",
        ".kts": "kotlin",
    }

    return language_map.get(ext)


def find_project_root(file_path: str, project_dir_env: str) -> str:
    """Find the project root directory."""
    # First check CLAUDE_PROJECT_DIR environment variable
    if project_dir_env and os.path.isdir(project_dir_env):
        return project_dir_env

    # Fallback: start from file directory and go up looking for config files
    current_dir = os.path.dirname(os.path.abspath(file_path))

    config_files = [
        "package.json",  # Node.js/TypeScript
        "pyproject.toml",  # Python
        "setup.cfg",  # Python
        "requirements.txt",  # Python
        ".swiftlint.yml",  # Swift
        "Package.swift",  # Swift
        "build.gradle",  # Kotlin
        "build.gradle.kts",  # Kotlin
        "detekt.yml",  # Kotlin
        ".git",  # Git repository
    ]

    while current_dir != "/":
        for config in config_files:
            if os.path.exists(os.path.join(current_dir, config)):
                return current_dir
        current_dir = os.path.dirname(current_dir)

    # Default to directory containing the file
    return os.path.dirname(os.path.abspath(file_path))


def check_config_files(project_root: str, language: str) -> Dict[str, bool]:
    """Check which linters are configured in the project."""
    configs = {
        "javascript": {
            "eslint": ["package.json"],
            "prettier": ["package.json", ".prettierrc", ".prettierrc.json"],
            "typescript": ["package.json", "tsconfig.json"],
        },
        "typescript": {
            "eslint": ["package.json"],
            "prettier": ["package.json", ".prettierrc", ".prettierrc.json"],
            "typescript": ["package.json", "tsconfig.json"],
        },
        "python": {
            "ruff": ["pyproject.toml", "ruff.toml"],
            "black": ["pyproject.toml"],
            "isort": ["pyproject.toml", ".isort.cfg"],
            "mypy": ["pyproject.toml", "mypy.ini"],
        },
        "swift": {"swiftlint": [".swiftlint.yml"], "swiftformat": [".swiftformat"]},
        "kotlin": {
            "ktlint": ["build.gradle", "build.gradle.kts"],
            "detekt": ["build.gradle", "build.gradle.kts", "detekt.yml"],
        },
    }

    language_configs = configs.get(language, {})
    result = {}

    for linter, files in language_configs.items():
        result[linter] = any(
            os.path.exists(os.path.join(project_root, f)) for f in files
        )

    return result


def run_linter(
    file_path: str, language: str, configs: Dict[str, bool], project_root: str
) -> Tuple[bool, str]:
    """Run appropriate linter for the file."""
    original_cwd = os.getcwd()

    try:
        os.chdir(project_root)

        if language == "javascript" or language == "typescript":
            return run_js_ts_linter(file_path, configs, project_root)
        elif language == "python":
            return run_python_linter(file_path, configs, project_root)
        elif language == "swift":
            return run_swift_linter(file_path, configs, project_root)
        elif language == "kotlin":
            return run_kotlin_linter(file_path, configs, project_root)
        else:
            return False, f"No linter configured for {language} files"

    finally:
        os.chdir(original_cwd)


def run_js_ts_linter(
    file_path: str, configs: Dict[str, bool], project_root: str
) -> Tuple[bool, str]:
    """Run JavaScript/TypeScript linters."""
    errors = []

    # Run ESLint if configured
    if configs.get("eslint"):
        try:
            # Try auto-fix first
            result = subprocess.run(
                ["npx", "eslint", "--fix", file_path],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"ESLint errors (auto-fix failed):\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: ESLint not available or timed out", file=sys.stderr)

    # Run Prettier if configured
    if configs.get("prettier"):
        try:
            result = subprocess.run(
                ["npx", "prettier", "--write", file_path],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"Prettier formatting issues:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: Prettier not available or timed out", file=sys.stderr)

    # Run TypeScript compiler if configured
    if configs.get("typescript") and file_path.endswith((".ts", ".tsx")):
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit", file_path],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"TypeScript compilation errors:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print(
                "Warning: TypeScript compiler not available or timed out",
                file=sys.stderr,
            )

    if errors:
        return False, "\n".join(errors)
    return True, ""


def run_python_linter(
    file_path: str, configs: Dict[str, bool], project_root: str
) -> Tuple[bool, str]:
    """Run Python linters."""
    errors = []

    # Run Ruff if configured
    if configs.get("ruff"):
        try:
            # Check first
            result = subprocess.run(
                ["ruff", "check", file_path], capture_output=True, text=True, timeout=10
            )

            if result.returncode != 0:
                # Try to fix
                fix_result = subprocess.run(
                    ["ruff", "check", "--fix", file_path],
                    capture_output=True,
                    text=True,
                    timeout=10,
                )

                if fix_result.returncode != 0:
                    error_output = result.stdout.strip() or result.stderr.strip()
                    if error_output:
                        errors.append(f"Ruff errors:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: Ruff not available or timed out", file=sys.stderr)

    # Run Black if configured
    if configs.get("black"):
        try:
            result = subprocess.run(
                ["black", "--check", file_path],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode != 0:
                # Format the file
                format_result = subprocess.run(
                    ["black", file_path], capture_output=True, text=True, timeout=10
                )
                if format_result.returncode != 0:
                    error_output = (
                        format_result.stderr.strip() or format_result.stdout.strip()
                    )
                    if error_output:
                        errors.append(f"Black formatting failed:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: Black not available or timed out", file=sys.stderr)

    # Run mypy if configured
    if configs.get("mypy"):
        try:
            result = subprocess.run(
                ["mypy", file_path], capture_output=True, text=True, timeout=10
            )

            if result.returncode != 0:
                error_output = result.stdout.strip() or result.stderr.strip()
                if error_output:
                    errors.append(f"Type checking errors:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: mypy not available or timed out", file=sys.stderr)

    if errors:
        return False, "\n".join(errors)
    return True, ""


def run_swift_linter(
    file_path: str, configs: Dict[str, bool], project_root: str
) -> Tuple[bool, str]:
    """Run Swift linters."""
    errors = []

    # Run SwiftLint if configured
    if configs.get("swiftlint"):
        try:
            # Try auto-correct first
            result = subprocess.run(
                ["swiftlint", "--autocorrect", file_path],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"SwiftLint errors:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: SwiftLint not available or timed out", file=sys.stderr)

    # Run SwiftFormat if configured
    if configs.get("swiftformat"):
        try:
            result = subprocess.run(
                ["swiftformat", file_path], capture_output=True, text=True, timeout=10
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"SwiftFormat errors:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: SwiftFormat not available or timed out", file=sys.stderr)

    if errors:
        return False, "\n".join(errors)
    return True, ""


def run_kotlin_linter(
    file_path: str, configs: Dict[str, bool], project_root: str
) -> Tuple[bool, str]:
    """Run Kotlin linters."""
    errors = []

    # Run ktlint if configured
    if configs.get("ktlint"):
        try:
            # Try format first
            result = subprocess.run(
                ["ktlint", "--format", file_path],
                capture_output=True,
                text=True,
                timeout=10,
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"ktlint formatting issues:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: ktlint not available or timed out", file=sys.stderr)

    # Run detekt if configured (requires Gradle wrapper)
    if configs.get("detekt"):
        gradle_wrapper = "./gradlew" if os.path.exists("./gradlew") else "gradle"
        try:
            # Run detekt for specific file (if supported)
            result = subprocess.run(
                [gradle_wrapper, "detekt", "--input", file_path],
                capture_output=True,
                text=True,
                timeout=30,
            )

            if result.returncode != 0:
                error_output = result.stderr.strip() or result.stdout.strip()
                if error_output:
                    errors.append(f"Detekt issues:\n{error_output}")
        except (subprocess.TimeoutExpired, FileNotFoundError):
            print("Warning: Detekt not available or timed out", file=sys.stderr)

    if errors:
        return False, "\n".join(errors)
    return True, ""


def main():
    """Main entry point."""
    input_data = parse_input()

    # Extract file path from tool input
    tool_input = input_data.get("tool_input", {})
    file_path = tool_input.get("file_path")

    if not file_path:
        # No file to lint, exit successfully
        sys.exit(0)

    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Warning: File does not exist: {file_path}", file=sys.stderr)
        sys.exit(0)

    # Detect language
    language = detect_language(file_path)
    if not language:
        # Not a supported language file, exit successfully
        sys.exit(0)

    # Find project root
    project_dir = os.environ.get("CLAUDE_PROJECT_DIR", "")
    project_root = find_project_root(file_path, project_dir)

    # Check which linters are configured
    configs = check_config_files(project_root, language)

    # Check if any linter is configured for this language
    if not any(configs.values()):
        # No linter configured for this language, exit successfully
        sys.exit(0)

    # Run appropriate linter
    success, error_message = run_linter(file_path, language, configs, project_root)

    if not success and error_message:
        # Return JSON output to block Claude and show lint errors
        output = {
            "decision": "block",
            "reason": f"Lint issues found in {file_path}:\n{error_message}",
            "hookSpecificOutput": {
                "hookEventName": "PostToolUse",
                "additionalContext": "Lint issues need to be fixed. Use the lint-fixer skill for guidance.",
            },
        }
        print(json.dumps(output))
        sys.exit(0)

    # Linting passed or was auto-fixed
    sys.exit(0)


if __name__ == "__main__":
    main()
