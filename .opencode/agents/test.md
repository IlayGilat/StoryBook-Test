---
description: "Implement deterministic single-worker Playwright behavior and performance coverage for the registered target, using shared benchmark loading, browser tracker interactions, CDP metrics, clear readiness waits, and strict runtime-error detection."
mode: primary
---

# Test Main Agent

## 1. Purpose

Implement deterministic single-worker Playwright behavior and performance coverage for the registered target, using shared benchmark loading, browser tracker interactions, CDP metrics, clear readiness waits, and strict runtime-error detection.

## 2. When to Invoke

Invoke only after Benchmark Integration completed for the same component and the registered Harness-owned stories pass integration dry checks.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`
- `.agents/test/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/benchmark-integration.md`
- `src/components/<component>/test/<component>.{spec,interactions,scenario.constants,scenario}.ts`
- Root UI public DOM/accessibility contract and harness story/selector identity
- `src/benchmark/playwright/` runner, page, metrics, console, constants, and types directly used by the tests
- `src/benchmark/browser/performance-tracker.types.ts`, registry identity APIs, and `playwright.config.ts`

## 4. Optional Context

- Harness and benchmark-integration validation reports for exact readiness/interaction evidence
- One existing component test suite when a repository test convention remains unclear

## 5. Do Not Load by Default

- Legacy source, unrelated component internals/tests, data factory bodies, other stage agents, unselected worker prompts, fidelity/repair artifacts, historical handoffs, or `.artifacts/`
- Benchmark-core implementation beyond APIs directly required by this target's suite

## 6. Required Prior Artifacts

- A `COMPLETED` `.migrations/<component>/handoffs/benchmark-integration.md`
- A unique registered identity, working tracker, stable size/readiness/double-rAF behavior, and rendered Harness-owned stories
- `playwright.config.ts` enforcing `workers: 1`

## 7. Sub-Agents Available

- `playwright-spec`
- `interaction-scenario`
- `stress-scenario`
- `cdp-metrics`
- `runtime-error`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. Assign exact test files and disjoint scopes; serialize edits where spec/scenario contracts overlap and use later workers as verifiers when necessary. The main agent integrates all scenario APIs, owns state/decisions/validation/handoff, verifies single-worker configuration without casually rewriting it, and runs the final targeted suite.

## 9. Responsibilities

- Implement behavior assertions and performance scenarios using shared `loadBenchmarkDataset`/`runPerformanceTest` contracts and explicit `[data-ready="true"]` readiness.
- Put reusable browser-side action loops in `<component>.interactions.ts` and route measurement through `window.__storybookPerfTracker.runInteraction(...)`.
- Cover representative user actions and configured stress levels including 10k and 100k where the component contract supports them.
- Use shared CDP collection/reporting for heap, DOM nodes, layout/style counts and durations, browser tracker FPS/frames/long tasks, and result assertions.
- Capture `page.on('console')`, `page.on('pageerror')`, and failed runtime conditions, with intentional filtering documented narrowly; fail on unhandled errors.

## 10. Non-Responsibilities

- Fixing UI/data/harness/benchmark-core defects, authoring stories, changing production behavior to satisfy tests, running multiple workers, or performing fidelity/repair work.
- Editing or committing `.artifacts/`, adding arbitrary performance thresholds without a requirement, or advancing to Fidelity Validation.

## 11. Execution Flow

1. Verify prerequisites and single-worker configuration; mark `test` active in state.
2. Define stable constants and reusable browser interaction functions for real component behaviors.
3. Define the `PerformanceScenario`, including default and required stress scales through 100k.
4. Implement behavior and performance specs with runtime listeners registered before navigation and explicit readiness conditions.
5. Run the targeted headed/dev-server workflow when available, then the required headless benchmark workflow; diagnose failures without fixed sleeps.
6. Inspect scope/artifacts, record results, update state, write canonical handoff, and stop.

## 12. Allowed Modifications

- `src/components/<component>/test/<component>.spec.ts`
- `src/components/<component>/test/<component>.interactions.ts`
- `src/components/<component>/test/<component>.scenario.constants.ts`
- `src/components/<component>/test/<component>.scenario.ts`
- `.migrations/<component>/logs/decisions.md`, `validation/test-report.md`, `state.json`, and `handoffs/test.md`

## 13. Forbidden Modifications

- Legacy source; component UI/data/harness/story files; `src/benchmark/`; registry; generator/package/config/unrelated files; `.artifacts/`; later-stage artifacts
- `waitForTimeout`, fixed sleeps, polling without a concrete condition, multiple Playwright workers, swallowed console/page errors, duplicated tracker/CDP infrastructure, or tests that mutate application internals
- Worker edits to shared state/log/handoff or concurrent writes to the same test file

## 14. Required Outputs

- Component-specific reusable browser interactions, scenario constants/configuration, `PerformanceScenario`, and Playwright spec
- Behavior coverage and deterministic stress measurement at required scales including 10k and 100k
- Shared tracker and CDP metric capture with runtime/page/console error enforcement
- `.migrations/<component>/validation/test-report.md`, updated state, and `.migrations/<component>/handoffs/test.md`

## 15. Validation

- Confirm `playwright.config.ts` resolves to `workers: 1` and the suite has no parallel override or fixed sleep.
- Against a running Storybook, run `npx playwright test src/components/<component>/test/<component>.spec.ts --headed`; also run `npm run test:perf` for the full built headless benchmark when required by the repository workflow.
- Require navigation through registered identity, explicit ready-state waits before action/measurement, exact stress-size coverage including 10k/100k, deterministic action loops, and tracker `runInteraction(...)` reuse.
- Verify reports contain browser tracker metrics and CDP heap/DOM/layout/style data, and that synthetic console errors and page errors make the error guard fail.
- Inspect results for timeouts/flakes and the diff/status for forbidden files or any `.artifacts/` edit/commit.

## 16. Definition of Done (DoD)

- [ ] Single-worker behavior and performance tests pass deterministically with explicit ready-state conditions and no fixed sleeps.
- [ ] Reusable representative interactions run through the global tracker at configured scales including 10k and 100k.
- [ ] Browser tracker plus CDP heap, DOM, layout, and style metrics are collected through shared infrastructure.
- [ ] Unhandled console, page, and runtime errors fail the suite; targeted and full required commands pass.
- [ ] State, test report, and canonical handoff agree; `.artifacts/` and upstream implementation remain untouched.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/test.md` in the exact shared order and recommend `fidelity-validation` without invoking it. Match state and handoff status/timestamp. Missing registered identity, stable readiness, supported interactions, or required browser/CDP capability is `BLOCKED`; identify the owning input. Test, metric, runtime-error, timeout, flake, or stress failures are `FAILED`; capture exact command/output and do not weaken assertions or add sleeps. Stop immediately after this DoD.
