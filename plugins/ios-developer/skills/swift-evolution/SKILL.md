---
name: swift-evolution
description: Track and understand Swift language evolution proposals. Use when researching Swift language features, understanding proposal stages, checking feature availability by Swift version, or planning migrations to newer Swift versions.
---

# Swift Evolution

## Overview

This skill helps you navigate Swift Evolution - the process by which Swift language changes are proposed, discussed, and implemented.

**IMPORTANT**: This skill provides lookup capabilities. Always detect the project's Swift version first to ensure accurate advice.

## Step 1: Detect Project Swift Version

Before providing evolution advice, detect the current project's Swift version:

### For Xcode Projects
```bash
# Check project.pbxproj for SWIFT_VERSION
grep -r "SWIFT_VERSION" *.xcodeproj/project.pbxproj

# Or use xcodebuild
xcodebuild -project MyProject.xcodeproj -showBuildSettings | grep SWIFT_VERSION
```

### For Swift Package Manager
```bash
# Check Package.swift swift-tools-version
head -1 Package.swift

# Or use swift package tools-version
swift package tools-version
```

### For CocoaPods
```bash
# Check .swift-version file
cat .swift-version

# Or Podfile
grep "swift_version" Podfile
```

### Fallback
```bash
# System Swift version (may differ from project)
swift --version
```

## Step 2: Lookup Evolution Proposals

### Option A: Official JSON API (Recommended)

The Swift Evolution JSON API provides real-time, structured data about all proposals. Use this for:
- Looking up proposal status by ID
- Finding proposals by Swift version
- Checking implementation status
- Filtering by review state

**API Endpoint**: `https://download.swift.org/swift-evolution/v1/evolution.json`

```bash
# Look up a specific proposal by ID
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.id == "SE-0423") | {id, title, status: .status.state, version: .status.version}'

# List all proposals implemented in Swift 6.0
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.version == "6.0") | {id, title}'

# Find proposals currently in active review
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.state == "activeReview") | {id, title, review: .review}'

# Get full details of a proposal
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.id == "SE-0430")'

# Count proposals by status
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '[.proposals[].status.state] | group_by(.) | map({state: .[0], count: length}) | sort_by(-.count)'
```

**Note**: Requires `jq` for JSON parsing. If not available, download the JSON and search manually.

**JSON Structure Reference**:
```json
{
  "id": "SE-0423",
  "title": "Dynamic actor isolation enforcement",
  "summary": "...",
  "status": {
    "state": "implemented",      // accepted, implemented, activeReview, rejected, etc.
    "version": "6.0"             // Swift version where implemented (if applicable)
  },
  "authors": ["..."],
  "implementation": "https://github.com/swiftlang/swift/...",
  "review": {
    "start": "2023-05-01",
    "end": "2023-05-14"
  }
}
```

### Option B: Fetch Proposal Markdown Directly

For the full proposal content, fetch the markdown file from GitHub:

```bash
# Fetch a specific proposal's markdown content
curl -s "https://raw.githubusercontent.com/swiftlang/swift-evolution/main/proposals/0423-dynamic-actor-isolation-enforcement.md"

# For proposal SE-XXXX, the filename pattern is typically:
# https://raw.githubusercontent.com/swiftlang/swift-evolution/main/proposals/XXXX-short-title.md
```

**Tip**: Use the JSON API first to find the proposal ID, then fetch the full markdown for detailed reading.

### Option C: Manual Web Lookup

Direct the user to these resources for manual lookup:

- **Dashboard**: https://www.swift.org/swift-evolution/
- **Proposals List**: https://github.com/swiftlang/swift-evolution/tree/main/proposals
- **Status Page**: https://www.swift.org/swift-evolution/#status
- **Forum**: https://forums.swift.org/c/swift-evolution/pitches

## Common Query Patterns

### Look Up Proposal by ID
```bash
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.id == "SE-0430") | {id, title, status: .status.state, swiftVersion: .status.version}'
```

### Filter by Swift Version
```bash
# All Swift 6.0 proposals
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.version == "6.0") | {id, title}'

# All Swift 5.10 proposals
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.version == "5.10") | {id, title}'
```

### Find Proposals in Active Review
```bash
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.state == "activeReview") | {id, title, reviewStart: .review.start, reviewEnd: .review.end}'
```

### Check Implementation Status
```bash
# All implemented proposals
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.state == "implemented") | {id, title, version: .status.version}'

# All accepted but not yet implemented
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.state == "accepted") | {id, title}'
```

### Search by Title/Summary
```bash
# Find proposals about "typed throws"
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.title | test("typed throws"; "i")) | {id, title, status: .status.state}'
```

### Without jq (Using grep)
```bash
# Basic search without jq (less precise)
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  grep -A5 '"id" : "SE-0423"'
```

## Proposal Stages

```
Proposal Lifecycle
│
├─► 0: Intent to Pitch
│   └─► Initial idea, community discussion
│
├─► 1: Pitch
│   └─► Formal proposal draft, feedback collection
│
├─► 2: Proposal Review
│   └─► Core Team review, acceptance/rejection
│
├─► 3: Implementation
│   └─► Feature implementation in compiler
│
└─► 4: Released
    └─► Feature available in Swift release
```

**Status States** (from JSON API):
| State | Description |
|-------|-------------|
| `implemented` | Feature released in Swift version |
| `accepted` | Approved, pending implementation |
| `activeReview` | Currently under community review |
| `rejected` | Declined by Core Team |
| `withdrawn` | Pulled by author |
| `previewing` | Available in beta/preview |

## Feature Availability by Swift Version

Use JSON API for real-time data, but here's a quick reference:

| Swift Version | Key Features |
|---------------|--------------|
| 6.0 | Strict concurrency, typed throws, pack iteration |
| 5.10 | Enhanced structured concurrency |
| 5.9 | Regex literals, observation macro |
| 5.8 | Regex literals (initial) |
| 5.7 | if let shorthand, existentials |

## Workflow: Check Feature Availability

The JSON API provides everything needed to determine feature availability:

```json
// Each proposal has this structure:
{
  "id": "SE-0413",
  "title": "Typed throws",
  "status": {
    "state": "implemented",    // ← Is it released?
    "version": "6.0"           // ← Which Swift version?
  }
}
```

### Step-by-Step Workflow

```
User asks: "Can I use typed throws in this project?"

Step 1: Detect project Swift version
─────────────────────────────────────
→ grep SWIFT_VERSION project.pbxproj
→ Result: SWIFT_VERSION = 5.9

Step 2: Query JSON API for the feature
──────────────────────────────────────
→ curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.title | test("typed throws"; "i")) | {id, title, state: .status.state, version: .status.version}'
→ Result: {"id": "SE-0413", "title": "Typed throws", "state": "implemented", "version": "6.0"}

Step 3: Check status.state
──────────────────────────
• "implemented" → Feature is released and available
• "accepted" → Approved but not yet in any Swift version
• "activeReview" → Still being discussed
• "rejected"/"withdrawn" → Will never be available

Step 4: Compare versions (if implemented)
─────────────────────────────────────────
Project: 5.9
Feature requires: 6.0
5.9 < 6.0 → UPGRADE REQUIRED

Step 5: Advise user
───────────────────
"Typed throws (SE-0413) requires Swift 6.0, but your project uses 5.9.
 To use this feature, upgrade to Swift 6.0 / Xcode 16."
```

### Version Comparison Script

```bash
# Full workflow in one command
PROJECT_VERSION="5.9"
FEATURE="typed throws"

curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
for p in data['proposals']:
    if '$FEATURE'.lower() in p['title'].lower():
        state = p['status']['state']
        version = p['status'].get('version', 'N/A')
        print(f'Proposal: {p[\"id\"]}')
        print(f'Status: {state}')
        print(f'Swift version: {version}')
        if state == 'implemented' and version != 'N/A':
            if float(version) > float('$PROJECT_VERSION'):
                print(f'❌ Requires Swift {version} (project: {$PROJECT_VERSION})')
            else:
                print(f'✅ Available in Swift {$PROJECT_VERSION}')
        elif state != 'implemented':
            print(f'⚠️ Not yet implemented')
        break
"
```

## Key URLs for Manual Lookup

- **Dashboard**: https://www.swift.org/swift-evolution/
- **Proposals Repo**: https://github.com/swiftlang/swift-evolution
- **JSON API**: https://download.swift.org/swift-evolution/v1/evolution.json
- **Status Page**: https://www.swift.org/swift-evolution/#status
- **Forum**: https://forums.swift.org/c/swift-evolution/pitches

## Common Tasks

### "Is this proposal implemented?"
1. Detect project Swift version
2. Use JSON API: `curl -s ... | jq '.proposals[] | select(.id == "SE-XXXX") | .status'`
3. Compare with project version

### "What's new in Swift X.Y?"
```bash
# List all proposals implemented in a specific version
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.version == "6.0") | {id, title}'
```

### "What features are available in my project?"
```bash
# Given project Swift version, list all available features
PROJECT_VERSION="5.9"

curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
project_ver = float('$PROJECT_VERSION')
print(f'Features available in Swift {project_ver}:')
print('=' * 50)
for p in sorted(data['proposals'], key=lambda x: x['id']):
    if p['status']['state'] == 'implemented':
        ver = p['status'].get('version')
        if ver and float(ver) <= project_ver:
            print(f\"{p['id']}: {p['title'][:60]}\")
"
```

### "When can I use this feature?"
1. JSON API: Search by title or ID to find implementation version
2. Check Xcode release notes for version requirements
3. Compare with project's current Swift version

### "What's currently in review?"
```bash
curl -s "https://download.swift.org/swift-evolution/v1/evolution.json" | \
  jq '.proposals[] | select(.status.state == "activeReview") | {id, title, reviewEnd: .review.end}'
```

## Integration with Other Skills

This skill works best when combined with:
- **swift-concurrency**: Check if concurrency features are available in your Swift version
- **swiftui-animation**: Verify animation APIs exist in your deployment target

## Attribution

Swift Evolution is maintained by the Swift Core Team and community.
- https://github.com/swiftlang/swift-evolution
- https://www.swift.org/swift-evolution/
