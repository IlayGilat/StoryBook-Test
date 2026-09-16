# Harness Repair Worker

## 1. Goal

Repair a reported harness readiness, race, sizing, double-requestAnimationFrame, or story-rendering failure.

## 2. When Parent Should Use It

The Repair parent invokes this worker with an exact test/runtime report entry, its diagnostic/command evidence, a parent-assigned repair reference, and bounded harness/story scope. Do not spawn subagents.

## 3. Inputs

### Context to load

Load this prompt, exact trace/console evidence, implicated harness/story files, and the established benchmark-container contract needed to interpret the failure.

### Delegated inputs

Receive component name, repair reference, exact report path/entry, reproduction steps, expected readiness/busy/error behavior, original command, affected stage, and write scope.

## 4. Outputs

Map changes to the repair reference and record the failing state transition, root cause, corrected transition, and observable readiness/render evidence.

## 5. Allowed Scope

Edit only assigned harness/story files and directly covering tests when authorized.

## 6. Forbidden Scope

Never edit legacy source, shared reports/state/decisions/handoffs, or base infrastructure without explicit evidence and scope.

## 7. Procedure

Trace generation identity, stale-result guards, size events, lifecycle cleanup, `data-ready`, `aria-busy`, `data-error`, and the double-rAF paint cycle; correct the smallest defect while preserving the shared contract and fullscreen story behavior.

## 8. Checks & Verification

Re-run the original story or scenario check without arbitrary waits. Escalate a base-contract or application-boundary change to the parent; do not bypass readiness or remove race guards.

## 9. Return Condition

Return changed files, repair-reference mapping, command/result, and concerns. The parent integrates, runs full harness/benchmark-stage validation, and owns reports, state, decisions, and handoff.
