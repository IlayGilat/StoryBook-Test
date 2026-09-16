---
description: "Implement reusable browser-side representative actions and the component `PerformanceScenario` through the global performance tracker."
mode: subagent
---

# Interaction Scenario Sub-Agent

## 1. Goal

Implement reusable browser-side representative actions and the component `PerformanceScenario` through the global performance tracker.

## 2. When Parent Should Use It

Use after stable UI actions/selectors and registered benchmark identity are available.

## 3. Inputs

- UI public DOM/accessibility behavior, tracker interaction types, runner scenario types, and registered identity
- Assigned interaction and scenario files/constants

## 4. Outputs

- `<component>.interactions.ts`, assigned scenario/constants edits, and action/reset contract
- Evidence that `window.__storybookPerfTracker.runInteraction(...)` executes representative actions

## 5. Allowed Scope

Write only the parent's assigned component interaction/scenario files.

## 6. Forbidden Scope

Direct ad hoc timing, fixed sleeps, DOM internals unrelated to public behavior, component/core/spec edits unless assigned, state/log/handoff, and `any`.

## 7. Procedure

1. Define serializable options and a browser-evaluable interaction function.
2. Require the global tracker and call `runInteraction` with registry-derived context.
3. Perform realistic click/select/filter/sort/scroll/edit actions as supported, awaiting tracker-provided frames.
4. Restore transient state in `afterEnd`; expose a typed `PerformanceScenario` using the function.

## 8. Checks & Verification

Exercise the scenario twice; require stable action behavior/count semantics, resolved tracker metrics, cleanup, and no fixed sleep or duplicate tracker logic.

## 9. Return Condition

Return `COMPLETED` with files/runtime evidence when interactions are reusable and deterministic; otherwise `FAILED` or `BLOCKED` precisely.
