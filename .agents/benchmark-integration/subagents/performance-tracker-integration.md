# Performance Tracker Integration Sub-Agent

## 1. Goal

Verify the target uses the global tracker for dataset preparation and all measured story interactions.

## 2. When Parent Should Use It

Use after registry identity is confirmed and Harness stories exist.

## 3. Inputs

- `performance-tracker` public types/API, registry identity, completed stories, and runner preparation path

## 4. Outputs

- Read-only integration findings or the parent's explicitly assigned minimal shared correction
- Evidence for tracker initialization, `prepareDataset`, and `runInteraction` completion

## 5. Allowed Scope

By default read-only; write only an exact assigned integration-owned tracker file when the parent proves a shared contract defect.

## 6. Forbidden Scope

Editing stories/tests/components, target-specific tracker forks, direct timing replacements, fixed sleeps, unrelated core refactors, state/log/handoff.

## 7. Procedure

1. Trace global tracker initialization into story frame and runner evaluation.
2. Verify preparation uses registered selector/event/size and waits for readiness plus paint.
3. Verify measured story actions call `runInteraction` with matching identity and duration.
4. Exercise one preparation and interaction call.

## 8. Checks & Verification

Require tracker presence, resolved promises, nonnegative metrics, exact dataset size, and no bypass or duplicate tracker instance.

## 9. Return Condition

Return `COMPLETED` with trace/runtime evidence when integration is sound; otherwise `FAILED` or `BLOCKED` with the precise missing link.
