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

- All 11 vulnerabilities are in **transitive dev dependencies** (Jest → babel/glob/minimatch/tar, ESLint → js-yaml/ajv, etc.)
- The `next` vulnerability (DoS via remote patterns) does not apply — this is a client-only app with no self-hosted image optimization
- No direct dependency needs updating; vulnerabilities are pinned by Jest 30 and ESLint versions
- To resolve fully: `npm audit fix` may upgrade transitive deps, but could break test/lint tooling
- Acceptable-risk for current scope; revisit if moving to production deployment