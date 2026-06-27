---
title: Mobile UX Improvements
version: 1.0
date_created: 2026-06-27
owner: Pokemon DnD Companion
tags: feature, mobile, ux
status: done
---

# Mobile UX Improvements

## Problem Statement
Several UX pain points hinder the mobile experience: tiny tap targets, redundant padding in modals, thin progress bars hard to drag, an inline trainer edit modal without proper overlay behavior, missing numeric keyboard hints on form inputs, and redundant stats on the dashboard.

## Changes

1. **Double padding in PokemonExpandedModal** — Remove nested duplicate `p-space-4 md:p-space-6` wrapper
2. **InteractiveProgress bar taller on mobile** — `h-2` → `h-3 md:h-2` for easier thumb drag
3. **Trainer edit modal → BaseModal** — Replace inline overlay with BaseModal (portal, focus trap, scroll-lock, Escape)
4. **AttackCard button larger** — `py-1.5 px-2 text-xs` → `py-2 px-3 text-sm md:py-1.5 md:px-2 md:text-xs`
5. **QuickStatusDropdown larger** — `px-2 py-1 text-xs` → `px-3 py-2 text-sm`
6. **inputMode="numeric"** — Add to all `<input type="number">` fields
7. **BaseModal close button larger** — `w-8 h-8` → `w-10 h-10 md:w-8 md:h-8`
8. **Dashboard simplify** — Remove redundant team stats from dashboard

## Success Criteria
- [ ] All 8 fixes implemented
- [ ] Lint passes
- [ ] Tests pass
- [ ] No visual regressions
