# Responsive Navigation Refactor (Plan A Specification)

## 1. Goal (User Perspective)
Provide an always‑available, consistent way to move between the main areas of the companion app (overall dashboard, Pokémon team management, and trainer management) without scrolling or hunting through a crowded single page. Navigation should feel natural on mobile (thumb‑reachable tabs) and efficient on desktop (persistent sidebar).

## 2. Scope
Replace the prior “all‑in‑one” landing page layout with a dedicated global navigation system:
- Mobile: Bottom tab bar (persistent).
- Desktop (from medium breakpoint and up): Left vertical sidebar.
- Applies to the primary application areas only (not adding marketing / external sections).

## 3. Primary Destinations (Plan A)
1. Dashboard (/dashboard)  
   - Summary view: high‑level trainer status (if created) and aggregate team stats.  
   - Acts as the “home” experience; root path (/) redirects here.
2. Team (/pokemon)  
   - Focused management of current Pokémon team (list, add, inspect, edit via existing route flows).
3. Trainer (/trainer)  
   - Trainer creation (if none) or overview / editing (as currently supported).

No settings / inventory / advanced sub‑features are introduced in this iteration. Future expansion points are intentionally left out of the visible navigation to avoid premature clutter.

## 4. Mobile Tab Bar (Behavior & Experience)
- Location: Fixed at bottom; spans full width.
- Items: Exactly three tabs (Dashboard, Team, Trainer).
- Each tab shows: icon + short label.
- Active tab: clearly highlighted (contrast, background emphasis, and distinct state).
- Badges:
  - Team: shows current Pokémon count (e.g. “3 / 6” or compressed “3/6”).
  - Trainer: shows trainer level (e.g. “Lv 4”) or a “Set Up” indicator if no trainer exists yet.
- Touch targets: Large enough to comfortably hit (thumb‑friendly vertical spacing and horizontal separation).
- Safe area: Respects device bottom safe insets on modern phones.

## 5. Desktop Sidebar (Behavior & Experience)
- Trigger: Medium breakpoint and above (the same sizing breakpoint used elsewhere for layout shifts).
- Location: Fixed on the left; full height.
- Visual hierarchy: Vertical stack preserving the same order (Dashboard, Team, Trainer).
- Active item: Highlighted with a strong background accent plus a left edge indicator for quick scanning.
- Badges: Same meaning as mobile (team count; trainer level or setup hint).
- Content pane: Main pages gain left padding so nothing is obscured.

## 6. Consistency & Persistence
- Navigation is present on every primary page (dashboard, team list, add/edit Pokémon routes, trainer page).
- Page transitions should feel seamless—navigation does not reflow dramatically between sections.
- The redirect from `/` to `/dashboard` ensures deep links remain predictable.

## 7. User Tasks Supported
| Task | Where User Goes |
|------|-----------------|
| See overall progress / summary | Dashboard |
| Review or add Pokémon | Team |
| Edit an existing Pokémon | Team then select specific Pokémon (existing edit route) |
| Create or update trainer | Trainer |
| Confirm team size or capacity quickly | Glance at Team badge |
| Check trainer level at any time | Glance at Trainer badge |

## 8. States & Edge Cases
- No Trainer Created: Trainer tab badge conveys a clear “Set Up” cue; Dashboard shows a prompt to create one.
- Empty Team: Team badge shows “0 / 6”; Team page presents an inviting empty state with add action.
- Full Team: Team badge “6 / 6” signals capacity; add action is hidden or disabled per existing behavior.
- Deleted Pokémon or Trainer: Badges update immediately; navigation stays stable (no layout jump).

## 9. Accessibility (User-Focused Outcomes)
- Navigation region is announced as “Main navigation” (screen readers can jump to it).
- Current page is clearly conveyed (assistive tech recognizes the active destination).
- Labels are concise yet unambiguous (“Team” vs “Pokémon Team Management” kept short for tab ergonomics).
- Color contrast: Active vs inactive states remain distinguishable without relying solely on color (background shape / emphasis helps).
- Keyboard users can tab into the nav, move to a destination, and proceed without trap or reorder confusion.

## 10. Visual & Interaction Principles
- Shared styling language (glass / subtle translucency) matches existing components.
- Hover / focus states reinforce interactiveness on desktop while remaining subtle on mobile.
- Badges are informational, not interactive (no nested controls inside the tab hit area).
- Motion is minimal (no distracting transitions that slow repeated navigation).

## 11. Non-Goals (Deferred)
- Additional sections like Settings, Inventory breakdown, Attacks management dashboard, or Multi‑player sync.
- Collapsible / fly‑out sidebar variants.
- Theme switching or theming controls inside navigation.
- Advanced keyboard shortcuts for direct tab switching.

## 12. Success Criteria (From User Perspective)
- I can always tell “where I am” in the app.
- I can switch between Trainer and Team views without scrolling back to the top or using browser history.
- On mobile, the nav does not feel cramped and doesn’t hide essential content.
- On desktop, the navigation doesn’t force me to re-scan the interface to find controls.
- Adding or editing a Pokémon doesn’t hide the navigation shell; I can navigate away freely.

## 13. Future Extension Hooks (Informational Only)
- A fourth or fifth slot can be introduced later (e.g. “Inventory” or “Settings”) without restructuring the existing three.
- Badge patterns established here can be reused for notifications (e.g. pending evolutions, status conditions summary).
- Potential quick action area (long press / right click) is intentionally not started now to reduce complexity.

## 14. Migration Notes (User Impact Framing)
- What previously appeared together (Trainer + Team on the same scrolling page) is now intentionally separated to reduce cognitive overload and make each area focused.
- Deep links to Pokémon edit pages remain valid and now display with persistent navigation around them.
- Returning users will find their data intact; only layout and entry points change.

## 15. User Value Summary
The navigation refactor delivers faster orientation, reduces vertical scrolling friction, clarifies app structure, and sets a stable foundation for later feature growth without crowding a single landing page.

---
End of Plan A specification.