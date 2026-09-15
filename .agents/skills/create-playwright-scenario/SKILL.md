---
name: create-playwright-scenario
description: Create single-worker Playwright behavior and performance scenarios using the shared benchmark runner and CDP metrics.
---

# Create Playwright Scenario

## When to use

Use in the Test stage after the Storybook benchmark target renders and tracked interactions are registered.

## Inputs

- Registry identity, story URL, UI behaviors, configured sizes, interaction helpers, and `src/benchmark/playwright/` APIs.

## Outputs

- Scenario/constants/interactions and `src/components/<component>/test/<component>.spec.ts` as required by repository patterns.
- Focused Playwright results.

## Procedure

1. Define deterministic sizes and tracked interactions from actual component behavior.
2. Load data through shared benchmark helpers and wait for the harness readiness contract.
3. Use component-scoped semantic locators and assert DOM/behavioral outcomes before measuring.
4. Execute performance coverage through `runPerformanceTest` and shared CDP metric collection.
5. Ensure pages/sessions/listeners are cleaned between cases and results identify component, size, interaction, and metrics.
6. Run the single component suite, then any required benchmark validation.

## Constraints

- Preserve `fullyParallel: false` and Playwright `workers: 1`.
- No arbitrary `waitForTimeout`, weakened assertions, nondeterministic data, or edits to `.artifacts/`.
- Do not repair UI failures in the Test stage; report them for Repair.

## Stop conditions

Stop when behavior assertions and every configured dataset-size scenario pass single-worker, or hand off concrete failures without broad fixes.
