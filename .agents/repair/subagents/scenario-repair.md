# Scenario Repair Worker

## 1. Goal

Repair a reported Playwright locator, interaction, race, timeout, or benchmark-scenario failure without weakening assertions.

## 2. When Parent Should Use It

The Repair parent invokes this worker with an exact failing report entry, its trace/command evidence, a parent-assigned repair reference, and a single affected scenario scope. Do not spawn subagents.

## 3. Inputs

### Context to load

Load this prompt, failing trace/output, scenario file, relevant story/harness contract, and only selectors needed to diagnose the named failure.

### Delegated inputs

Receive component name, repair reference, exact report path/entry, scenario and step, expected outcome, original single-worker command, dataset/seed, affected stage, and write scope.

## 4. Outputs

Link each edit to the repair reference and record failed step, root cause, locator/timing contract before and after, dataset, and trace/result evidence.

## 5. Allowed Scope

Edit only the assigned scenario and the minimum directly implicated product file when separately authorized.

## 6. Forbidden Scope

Never edit legacy source, shared reports/state/decisions/handoffs, or global Playwright settings speculatively.

## 7. Procedure

Check console/runtime errors and readiness first; reproduce at the smallest configured dataset; prefer semantic or component-scoped locators; preserve `window.__storybookPerfTracker.runInteraction(...)`, `fullyParallel: false`, and one worker. Fix the evidenced race or interaction contract, not its symptoms.

## 8. Checks & Verification

Re-run the original single-worker scenario. Never add `waitForTimeout`, lengthen arbitrary waits, delete assertions, or reduce dataset coverage to claim success. Escalate product-code root causes beyond assigned scope.

## 9. Return Condition

Return changed files, repair-reference mapping, exact command/result, evidence, and concerns. The parent integrates, runs full affected test-stage validation, and owns reports, state, decisions, and handoff.
