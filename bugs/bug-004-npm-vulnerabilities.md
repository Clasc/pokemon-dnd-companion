# Bug: npm audit shows vulnerabilities

**Status:** Open
**Created:** 2026-04-19
**Fixed:** 
**Severity:** High

## Description

Running `npm i` shows 11 vulnerabilities after installation completes:
- 1 low
- 3 moderate  
- 6 high
- 1 critical

Additionally, npm shows deprecation warnings for:
- `inflight@1.0.6` - Not supported, leaks memory
- `glob@7.2.3` - Version no longer supported

## Steps to Reproduce

1. Run `npm i` in project root
2. Observe audit summary output

## Expected Behavior

`npm audit` should show 0 vulnerabilities after fresh install.

## Actual Behavior

11 vulnerabilities and deprecation warnings are reported.

## Notes

- Need to identify offending packages and update/remove them
- Check if vulnerabilities are in devDependencies only
- Consider updating Next.js and other dependencies to latest stable versions