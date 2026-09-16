---
description: "Verify component performance runs collect required Chrome DevTools Protocol and browser-tracker metrics through shared benchmark infrastructure."
mode: subagent
---

# CDP Metrics Sub-Agent

## 1. Goal

Verify component performance runs collect required Chrome DevTools Protocol and browser-tracker metrics through shared benchmark infrastructure.

## 2. When Parent Should Use It

Use after the performance scenario runs successfully at representative sizes.

## 3. Inputs

- Shared benchmark runner/metrics/types/report APIs and component scenario results
- Required heap, DOM, layout/style, FPS/frame, and long-task fields

## 4. Outputs

- Read-only metric verification or assigned component-test assertions only
- Metric-source mapping and representative finite values/deltas

## 5. Allowed Scope

Read shared CDP infrastructure; write only exact parent-assigned assertions in component test files.

## 6. Forbidden Scope

Reimplementing CDP collection, editing benchmark core, arbitrary pass/fail thresholds, hiding unavailable metrics, application changes, `.artifacts/`, state/log/handoff.

## 7. Procedure

1. Trace `Performance.enable/getMetrics` and tracker samples through runner result/report types.
2. Verify JS heap, DOM nodes, layout/recalc counts and durations plus FPS/dropped-frame/long-task values.
3. Run a representative scenario under the required Chromium/CDP environment.
4. Assert result fields are present and finite with units interpreted correctly.

## 8. Checks & Verification

Require shared collection paths, valid before/after or delta semantics, nonnegative count/duration fields where defined, and a clear failure when required CDP capability is absent.

## 9. Return Condition

Return `COMPLETED` with metric mapping/runtime evidence when all required fields are collected; otherwise `FAILED` or `BLOCKED` precisely.
