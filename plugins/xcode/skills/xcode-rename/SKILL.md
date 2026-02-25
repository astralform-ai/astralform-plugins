---
name: xcode-rename
description: Rename Xcode iOS/macOS projects completely, including folders, files, and all internal references. Use when user asks to rename an Xcode project, iOS project, or Swift project.
---

# Xcode Project Renamer

Renames an Xcode project completely using the bundled xcode-project-renamer Swift script.

## Instructions

1. **Find the plugin's script path** — the renamer script is bundled with this plugin:
   ```bash
   # The script is at the plugin's scripts/ directory
   # Use: swift <plugin-path>/scripts/xcode-project-renamer.swift "OldName" "NewName"
   ```

2. **Run the rename script** from the project root (where `.xcodeproj` is located):
   ```bash
   swift ~/.claude/plugins/xcode/scripts/xcode-project-renamer.swift "OldProjectName" "NewProjectName"
   ```

3. **Rename the project folder**:
   ```bash
   mv /path/to/OldProjectName /path/to/NewProjectName
   ```

4. **Clean derived data**:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/*OldProjectName*
   ```

5. **Update additional files**:
   - Update `CLAUDE.md` or documentation referencing the old name
   - Update any hardcoded paths or bundle identifiers

## Examples

Rename "MyApp" to "SuperApp":
```bash
cd /path/to/MyApp
swift ~/.claude/plugins/xcode/scripts/xcode-project-renamer.swift "MyApp" "SuperApp"
mv /path/to/MyApp /path/to/SuperApp
rm -rf ~/Library/Developer/Xcode/DerivedData/*MyApp*
```

## Source

- [xcode-project-renamer on GitHub](https://github.com/appculture/xcode-project-renamer)
