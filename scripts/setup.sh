#!/bin/bash
# Setup script for Astralform Claude Code Plugin
# This script builds the MCP server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"

echo "Setting up Astralform Claude Code Plugin..."

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null || echo "not installed")
if [[ "$NODE_VERSION" == "not installed" ]]; then
    echo "Error: Node.js is required. Please install Node.js 18+."
    exit 1
fi

# Check if Node.js version is 18+
NODE_MAJOR=$(echo "$NODE_VERSION" | sed 's/v//' | cut -d. -f1)
if [[ "$NODE_MAJOR" -lt 18 ]]; then
    echo "Error: Node.js 18+ is required. Current version: $NODE_VERSION"
    exit 1
fi
echo "Node.js version: $NODE_VERSION"

# Build MCP server
echo "Building MCP server..."
cd "$PLUGIN_DIR/mcp-server"

if [[ ! -d "node_modules" ]]; then
    echo "Installing dependencies..."
    npm install
fi

npm run build

echo "MCP server built successfully."

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
