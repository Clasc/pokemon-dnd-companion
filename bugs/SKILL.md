---
name: bugtracker
description: Bugtracker skill for tracking and managing bugs in the project. Use this skill whenever the user finds a bug, reports an issue, mentions something isn't working, or asks to track a problem. Always create bug files in the /bugs directory and mark them as fixed when the user confirms the bug is resolved.
---

## Bug Directory

All bugs are stored in `/Users/christian/repos/pokemon-dnd-companion/bugs/`

## Creating a Bug

When the user reports a bug, create a new Markdown file with this structure:

```markdown
# Bug: [Brief Title]

**Status:** Open | Fixed
**Created:** YYYY-MM-DD
**Fixed:** YYYY-MM-DD
**Severity:** Critical | High | Medium | Low

## Description

[Clear description of what's broken or incorrect]

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior

[What should happen]

## Actual Behavior

[What actually happens]

## Notes

[Any additional context, workarounds, or relevant code references]
```

**Filename format:** `bug-<number>-<short-title>.md`

- Use the next sequential number for `<number>`
- Lowercase, hyphenated short title (max 50 chars)
- Example: `bug-001-navigation-modal-wrong-route.md`

To find the next number, check existing bugs and use the highest number + 1.

## Marking a Bug as Fixed

When the user says a bug is fixed:

1. Open the bug file
2. Change **Status:** from `Open` to `Fixed`
3. Add the today's date to **Fixed:** field
4. Save the file

## Listing Bugs

To show the user existing bugs:

1. List all files in `/Users/christian/repos/pokemon-dnd-companion/bugs/`
2. Read each bug file and extract: filename, title, status, severity
3. Present as a simple table:

```
| # | Title | Status | Severity |
|---|-------|--------|----------|
| 001 | Navigation modal wrong route | Open | Medium |
| 002 | HP bar not updating | Fixed | High |
```

## Bug Severity Guidelines

- **Critical**: Data loss, crash, security issue
- **High**: Major feature broken, no workaround
- **Medium**: Feature partially works, workaround exists
- **Low**: Minor issue, cosmetic,不影响核心功能