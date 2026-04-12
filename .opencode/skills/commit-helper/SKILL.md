---
name: commit-helper
description: |
  Helps create well-structured, modular git commits. Use when the user asks to commit changes, mentions "commit", "git commit", or wants to save work. This skill ensures commits are self-contained with logical grouping and appropriate documentation.
---

# Commit Helper

## When to Use This Skill

Use this skill whenever:
- User asks to "commit changes" or "save changes"
- User mentions "git commit" or similar
- User says something like "let's commit this", "should I commit now?", "commit what we did"
- After completing a task, user wants to persist the changes

## How to Create Good Commits

### Step 1: Identify Changes

First, run these commands to understand what's changed:

```bash
git status
git diff --name-only
```

### Step 2: Group Changes into Logical Commits

Look at the changed files and group them into self-contained units:

- **Features**: Group related files that implement one feature together
- **Fixes**: Group bug fixes separately from new features  
- **Refactors**: Group code restructuring separately
- **Tests**: Group test files with their corresponding code

### Step 3: For Each Group, Create a Modular Commit

For each logical group:

1. **Stage the files**: `git add <files>`
2. **Check the diff of staged changes**: `git diff --cached`
3. **Write a descriptive commit message** following conventions:
   - Use conventional commits format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - Keep subject line under 72 characters
   - Add body if needed for context

### Step 4: Present Commits to User (Don't Auto-Commit)

**IMPORTANT**: Before creating any commits, present your proposed commits to the user:

```
I've identified the following changes and propose splitting them into modular commits:

1. [feat/auth]: add user authentication with JWT tokens
   - Files: src/auth/token.ts, src/auth/middleware.ts
   - Summary: Implements JWT-based auth for API endpoints

2. [docs]: update API documentation
   - Files: docs/api.md
   - Summary: Documents new auth endpoints

3. [test]: add auth unit tests
   - Files: tests/auth/token.test.ts
   - Summary: Tests JWT token generation and validation

Should I proceed with these commits? Or would you like to modify them?
```

Wait for user confirmation before executing.

### Step 5: Execute Confirmed Commits

Only after user confirms:
```bash
git commit -m "feat(auth): add user authentication with JWT tokens"
# ... repeat for each commit
```

## Important Rules

1. **Never auto-commit without presenting to user first** — always show the plan
2. **Keep commits self-contained** — each commit should work on its own
3. **Keep logic and docs together** — if code and documentation changed together, keep them in the same commit
4. **Use meaningful commit messages** — explain *why*, not just *what*
5. **Don't include generated files** — skip node_modules, build outputs, etc. unless intentional
6. **When unsure, ask the user** — they may have preferences on commit structure