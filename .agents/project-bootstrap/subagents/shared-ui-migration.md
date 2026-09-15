# Shared UI Migration Sub-Agent

## 1. Goal

Prepare only proven cross-component presentational primitives needed by downstream migration.

## 2. When Parent Should Use It

Use when analysis of shared infrastructure proves a button, icon, tooltip, or similar dumb primitive is reused and absent or incompatible.

## 3. Inputs

- Exact legacy primitive files and consumers
- Existing harness shared-component candidates
- Assigned destination and fidelity requirements

## 4. Outputs

- A compiled shared standalone `OnPush` primitive or a documented reuse decision
- Structured return: decision, source/target paths, API, files changed, checks, deviations

## 5. Allowed Scope

Only parent-assigned paths under `src/components/shared/`.

## 6. Forbidden Scope

Benchmark-target components, smart services/store/router coupling, stories, data, tests, state, handoffs, and legacy writes.

## 7. Procedure

1. Compare existing candidates against DOM, styles, and behavior.
2. Reuse only on complete fidelity; otherwise copy the required source variant.
3. Adapt the primitive to standalone `OnPush` and explicit presentation bindings.
4. Preserve source fidelity before cleanup and report deviations.

## 8. Checks & Verification

Run the narrow compile check and inspect metadata, imports, template/style resolution, and absence of application coupling.

## 9. Return Condition

Return structured status, reuse/copy rationale, changed files, checks, and deviations for parent review.
