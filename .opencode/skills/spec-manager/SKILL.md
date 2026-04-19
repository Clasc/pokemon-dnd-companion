---
name: spec-manager
description: Skill for tracking and managing specs (specifications) in the project. Use this skill when working with specs - creating new specs, updating their status, or continuing work on open specs. Specs track feature implementations and design decisions.
---

## Specs Directory

All specs are stored in `/Users/christian/repos/pokemon-dnd-companion/specs/`

## Spec Status

Specs have three possible statuses:

- **Open**: Not yet started, ready for implementation
- **In Progress**: Currently being implemented
- **Done**: Implementation complete and committed

## Creating a Spec

When requested to create a spec:

1. Create a new Markdown file in `specs/`
2. Use the naming convention: `plan-<short-name>.md`
3. Include front matter with title, version, date, owner, and tags

```markdown
---
title: [Descriptive Title]
version: 1.0
date_created: YYYY-MM-DD
owner: Pokemon DnD Companion
tags: `feature`, `pokemon`
---

# [Title]

## Problem Statement

[What problem this spec solves]

## Requirements

- [Requirement 1]
- [Requirement 2]

## Implementation Details

[Technical approach]

## Success Criteria

- [ ] Criterion 1
- [ ] Criterion 2
```

## Updating Spec Status

### Mark as In Progress

When starting work on a spec:

1. Open the spec file
2. Add or update status tag: `status: in_progress`
3. Add `started: YYYY-MM-DD` if not present

### Mark as Done

When implementation is complete and committed:

1. Open the spec file
2. Add or update: `status: done`
3. Update `completed: YYYY-MM-DD`

### Continue Working on Open Spec

When asked to work on a spec that's "open":

1. Same as marking in progress
2. Update status to `in_progress`

## Listing Specs

To show the user existing specs:

1. List all files in `specs/`
2. Read each spec to get title, status, and tags
3. Present as a table:

```
| Spec | Status | Tags |
|------|--------|------|
| Status Effects Quick Select | Done | feature, pokemon |
| Unified Spacing System | Open | design-system |
| Armor Class | In Progress | feature, pokemon |
```

## Workflow Guidelines

- When user asks to "create a spec", use this skill
- When user asks to "commit" a spec, include status update in the commit
- Before implementing, check spec status and update to "In Progress"
- After implementation commit, update status to "Done"
- Multiple agents can work on different specs simultaneously since each spec is independent
- Always verify spec requirements are met before marking as Done