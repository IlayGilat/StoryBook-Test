# Scenario Repair Worker

## 1. Purpose

Repair a reported Playwright locator, interaction, race, timeout, or benchmark-scenario failure without weakening assertions.

## 2. Invocation

The Repair parent invokes this worker with the exact failing trace/report and a single affected scenario scope. Do not spawn subagents.

## 3. Required Context

Load this prompt, failing trace/output, scenario file, relevant story/harness contract, and only selectors needed to diagnose the named failure.

## 4. Inputs

Receive component name, IDs, scenario and step, expected outcome, original single-worker command, dataset/seed, affected stage, and write scope.

## 5. Write Scope

Edit only the assigned scenario and the minimum directly implicated product file when separately authorized. Never edit legacy source, shared reports/state/decisions/handoffs, or global Playwright settings speculatively.

## 6. Procedure

Check console/runtime errors and readiness first; reproduce at the smallest configured dataset; prefer semantic or component-scoped locators; preserve `window.__storybookPerfTracker.runInteraction(...)`, `fullyParallel: false`, and one worker. Fix the evidenced race or interaction contract, not its symptoms.

## 7. Evidence and Findings

Link each edit to the originating ID and record failed step, root cause, locator/timing contract before and after, dataset, and trace/result evidence.

## 8. Validation and Escalation

Re-run the original single-worker scenario. Never add `waitForTimeout`, lengthen arbitrary waits, delete assertions, or reduce dataset coverage to claim success. Escalate product-code root causes beyond assigned scope.

## 9. Completion Contract

Return changed files, ID mapping, exact command/result, evidence, and concerns. The parent integrates, runs full affected test-stage validation, and owns reports, state, decisions, and handoff.
