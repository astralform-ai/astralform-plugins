#!/bin/bash
# Setup script for Astralform Claude Code Plugin
# This script prepares the plugin for use

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"

echo "Setting up Astralform Claude Code Plugin..."

# Create credentials directory
CREDS_DIR="$HOME/.astralform"
if [[ ! -d "$CREDS_DIR" ]]; then
    echo "Creating credentials directory at $CREDS_DIR..."
    mkdir -p "$CREDS_DIR"
    chmod 700 "$CREDS_DIR"
fi

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run ./scripts/install.sh to add the plugin to Claude Code"
echo "  2. Run /astralform-login in Claude Code to authenticate"
