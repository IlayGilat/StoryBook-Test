---
description: "Migrate or reuse the assigned presentation pipes/directives with exact behavior and wire them into the standalone node."
mode: subagent
---

# Pipe Directive Migration Sub-Agent

## 1. Goal

Migrate or reuse the assigned presentation pipes/directives with exact behavior and wire them into the standalone node.

## 2. When Parent Should Use It

Use when the current template depends on custom pipes/directives not already available through a verified compatible target import.

## 3. Inputs

- Current node template/TypeScript and file-plan operations
- Assigned read-only pipe/directive source plus direct pure helpers/types
- Planned target or reuse candidate and fidelity evidence

## 4. Outputs

- Exact assigned pipe/directive target files and current-node standalone import wiring
- Return summary of behavior, selectors/names, dependencies, reuse/copy evidence, and risks

## 5. Allowed Scope

Write only planned pipe/directive files and assigned current-node import entries; read directly required presentation dependencies.

## 6. Forbidden Scope

Application/service dependencies, unrelated shared UI, unplanned generalization, global registration, state/logs/handoff, and reuse below verified 100% fidelity.

## 7. Procedure

1. Compare any reuse candidate to source behavior, inputs, output/transform, and rendering effects.
2. Reuse only at verified 100% fidelity; otherwise copy and minimally adapt the source declaration.
3. Make compatible declarations standalone or import their verified standalone/module form.
4. Preserve names/selectors/purity and report unresolved application coupling.

## 8. Checks & Verification

Verify every template usage resolves, standalone imports are exact, behavior/types match source, and all direct dependencies are accounted for.

## 9. Return Condition

Return `COMPLETED` with copy/reuse fidelity evidence; otherwise `BLOCKED` for missing source/dependency or unverifiable reuse.
