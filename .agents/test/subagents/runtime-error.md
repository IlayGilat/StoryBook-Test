# Runtime Error Sub-Agent

## 1. Goal

Implement or verify strict Playwright detection of unhandled browser console errors, page errors, and runtime failures for the component suite.

## 2. When Parent Should Use It

Use while finalizing the spec, before any navigation occurs in each guarded test/run.

## 3. Inputs

- Component spec, shared benchmark console/error utilities if present, and known intentional browser messages with evidence

## 4. Outputs

- Assigned spec/error-guard edits or read-only verification
- Captured error categories, narrowly documented filters, and synthetic failure evidence

## 5. Allowed Scope

Write only the assigned error-guard portion of component test files; prefer shared utilities.

## 6. Forbidden Scope

Blanket filtering, swallowing errors, registering listeners after navigation, component/core/config edits, fixed sleeps, `.artifacts/`, state/log/handoff.

## 7. Procedure

1. Register `page.on('console')` and `page.on('pageerror')` before navigation.
2. Collect error-level console messages, uncaught exceptions, and rejected runtime failures with useful context.
3. Allow only evidence-backed narrow filters approved by the parent.
4. Fail the run after cleanup or immediately according to shared test conventions.

## 8. Checks & Verification

Inject one console error and one page error in isolated verification and require both to fail; verify normal stories pass and filters cannot mask unrelated messages.

## 9. Return Condition

Return `COMPLETED` with synthetic and normal-run evidence when guards are strict; otherwise `FAILED` with the missed or false-positive error.
