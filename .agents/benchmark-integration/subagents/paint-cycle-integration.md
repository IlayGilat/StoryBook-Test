# Paint Cycle Integration Sub-Agent

## 1. Goal

Verify readiness and measurement boundaries honor the shared double-`requestAnimationFrame` paint contract without races.

## 2. When Parent Should Use It

Use after identity/tracker wiring is confirmed and before the dry-run benchmark.

## 3. Inputs

- Base container lifecycle, tracker paint utilities, completed container, and rendered story

## 4. Outputs

- Read-only timing/race evidence or an explicitly assigned minimal shared correction
- Ordered lifecycle trace for generation, assignment, two frames, ready, and measurement

## 5. Allowed Scope

Read the direct base/tracker/harness files; write only a parent-assigned integration file for a proven shared defect.

## 6. Forbidden Scope

Manual delays, one-frame shortcuts, forced ready state, component/story/test authoring, unrelated core changes, state/log/handoff.

## 7. Procedure

1. Instrument or observe one normal and one rapidly superseded generation.
2. Confirm data assignment precedes two animation frames and ready transition.
3. Confirm stale generations cannot set ready.
4. Confirm tracker measurement begins only after ready and its paint wait.

## 8. Checks & Verification

Require ordered evidence, latest-generation identity, no early `data-ready`, no hanging busy state, and no fixed sleep in the path.

## 9. Return Condition

Return `COMPLETED` when timing/race behavior is proven; otherwise `FAILED` with the observed ordering or `BLOCKED` with missing observability.
