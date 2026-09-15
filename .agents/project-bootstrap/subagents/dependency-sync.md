# Dependency Sync Sub-Agent

## 1. Goal

Synchronize only missing presentation-layer packages required by the legacy visual environment while preserving Angular 16.2.12.

## 2. When Parent Should Use It

Use when comparison of legacy and harness manifests proves a required UI, icon, or pure utility package is absent.

## 3. Inputs

- Legacy and harness `package.json` files
- Exact required packages and usages
- Assigned compatibility and write scope

## 4. Outputs

- Proposed or applied `package.json` and lockfile changes
- Structured return: package, version, compatibility evidence, files changed, checks, warnings

## 5. Allowed Scope

`package.json` and `package-lock.json` only.

## 6. Forbidden Scope

Angular version changes; NgRx, routers, application stores/services, source components, state, and handoffs.

## 7. Procedure

1. Confirm each package is required by presentation code.
2. Check Angular 16.2.12 and peer compatibility.
3. Reuse an installed compatible package when possible; otherwise apply the smallest manifest change.
4. Install deterministically and capture the result.

## 8. Checks & Verification

Verify lockfile consistency, package resolution, peer output, and the parent-assigned compile command.

## 9. Return Condition

Return `COMPLETED`, `BLOCKED`, or `FAILED` with the structured output; do not update state or integrate other workers' work.
