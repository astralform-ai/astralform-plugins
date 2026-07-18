# Astralform Plugins Repository

## Plugin Version Structure

There are **two separate versioning systems**:

### 1. Marketplace Catalog Version
- **File**: `.claude-plugin/marketplace.json`
- **Field**: `"version"` at top level
- **Purpose**: Version of the marketplace catalog itself
- **Current**: `1.1.0`

### 2. Individual Plugin Versions
Each plugin's version must stay in sync between two files. Reference the marketplace
entry **by name** (not array index) so this stays correct as plugins are added or removed:

| Plugin | plugin.json Location | marketplace.json Entry |
|--------|---------------------|------------------------|
| lint | `plugins/lint/.claude-plugin/plugin.json` | `plugins[] \| select(.name=="lint")` |
| memory | `plugins/memory/.claude-plugin/plugin.json` | `plugins[] \| select(.name=="memory")` |
| xcode | `plugins/xcode/.claude-plugin/plugin.json` | `plugins[] \| select(.name=="xcode")` |
| ios-developer | `plugins/ios-developer/.claude-plugin/plugin.json` | `plugins[] \| select(.name=="ios-developer")` |

**Critical**: When updating a plugin version, update **both**:
1. The plugin's `.claude-plugin/plugin.json`
2. The corresponding entry in `.claude-plugin/marketplace.json`

### Version Sync Check
```bash
# Check a plugin's versions match (example: lint)
jq -r '.version' plugins/lint/.claude-plugin/plugin.json
jq -r '.plugins[] | select(.name == "lint") | .version' .claude-plugin/marketplace.json
```

## Repository Structure

```
astralform-plugins/
├── .claude-plugin/
│   └── marketplace.json     # marketplace catalog (lists all plugins)
├── plugins/
│   ├── lint/                # Linting plugin
│   ├── memory/              # Persistent memory plugin
│   ├── xcode/               # Xcode/SPM utilities plugin
│   └── ios-developer/       # iOS development expertise plugin
└── CLAUDE.md                # This file
```
