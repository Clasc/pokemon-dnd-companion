# Bug: Responsive layout breaks on phone screens

**Status:** Fixed
**Created:** 2026-04-12
**Fixed:** 2026-06-28
**Severity:** High

## Description

On narrow viewports (e.g., Samsung Galaxy S25), the app does not fit the screen properly. Content is cut off on the right side instead of breaking into multiple rows.

## Steps to Reproduce

1. Open the app on a device or viewport with width around 360px (typical phone)
2. Observe that content extends beyond the visible area
3. Horizontal scroll is required to see cut-off content

## Expected Behavior

The app should fit the screen perfectly and break elements into the next row when they don't fit.

## Actual Behavior

Elements overflow beyond the screen edge and are cut off.

## Notes

Dashboard was rewritten from scratch as mobile-first (compact cards, `max-w-3xl mx-auto px-4`, flex-wrap, responsive units). The old layout with fixed-width elements was replaced. Verify on actual phone (Samsung Galaxy S25, ~360px) to confirm.