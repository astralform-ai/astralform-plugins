#!/bin/bash
# Install Astralform plugin to Claude Code
# This script adds the plugin to your Claude Code configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"

echo "Installing Astralform plugin to Claude Code..."

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "Error: Claude Code CLI not found."
    echo "Please install Claude Code first: https://claude.ai/code"
    exit 1
fi

# Add plugin to Claude Code
echo "Adding plugin to Claude Code..."
claude plugin add "$PLUGIN_DIR"

echo ""
echo "Installation complete!"
echo ""
echo "Available commands:"
echo "  /astralform-login         - Authenticate with Astralform"
echo "  /astralform-projects      - List your projects"
echo "  /astralform-create-project - Create a new project"
echo "  /astralform-setup         - Interactive setup wizard"
echo "  /astralform-analytics     - View usage analytics"
echo ""
echo "Available skills:"
echo "  astralform-ios-setup      - Set up iOS SDK in your project"
echo "  astralform-docs           - Search Astralform documentation"
echo "  astralform-best-practices - Learn integration best practices"
echo ""
echo "Run /astralform-login to get started!"
