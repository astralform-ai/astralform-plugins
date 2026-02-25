# Astralform Plugins Repository

## Plugin Version Structure

There are **two separate versioning systems**:

### 1. Marketplace Catalog Version
- **File**: `.claude-plugin/marketplace.json`
- **Field**: `"version"` at top level
- **Purpose**: Version of the marketplace catalog itself
- **Current**: `1.0.0`

### 2. Individual Plugin Versions
Each plugin's version must stay in sync between two files:

| Plugin | plugin.json Location | marketplace.json Entry |
|--------|---------------------|------------------------|
| astralform | `.claude-plugin/plugin.json` | `plugins[0].version` |
| lint | `plugins/lint/.claude-plugin/plugin.json` | `plugins[1].version` |
| memory | `plugins/memory/.claude-plugin/plugin.json` | `plugins[2].version` |
| xcode | `plugins/xcode/.claude-plugin/plugin.json` | `plugins[3].version` |

**Critical**: When updating a plugin version, update **both**:
1. The plugin's `.claude-plugin/plugin.json`
2. The corresponding entry in `.claude-plugin/marketplace.json`

### Version Sync Check
```bash
# Check astralform versions match
jq -r '.version' .claude-plugin/plugin.json
jq -r '.plugins[] | select(.name == "astralform") | .version' .claude-plugin/marketplace.json
```

## Repository Structure

```
astralform-plugins/
├── .claude-plugin/
│   ├── plugin.json          # astralform plugin metadata
│   └── marketplace.json     # marketplace catalog (lists all plugins)
├── plugins/
│   ├── lint/                # Linting plugin
│   ├── memory/              # Persistent memory plugin
│   └── xcode/               # Xcode/SPM utilities plugin
└── CLAUDE.md                # This file
```
