# Interaction State Sub-Agent

## 1. Goal

Implement typed container-owned handlers for dumb UI outputs and deterministic controlled-state updates.

## 2. When Parent Should Use It

Use after component wiring exposes the exact output payloads and controlled values.

## 3. Inputs

- `dumb-boundary.json`, root UI outputs, and current container state
- Required reset semantics between datasets/stories

## 4. Outputs

- Assigned typed action-handler/state edits
- Output-to-effect mapping and reset behavior reported to the parent

## 5. Allowed Scope

Write only the assigned handler/state region in `<component>.container.ts`.

## 6. Forbidden Scope

Backend/router/store effects, hidden global state, swallowed outputs, UI/story/test/core edits, state/log/handoff, unrelated behavior.

## 7. Procedure

1. Implement one typed handler per UI output.
2. Translate application effects into local controlled benchmark state/actions approved by the boundary plan.
3. Preserve visible behavior and deterministic ordering.
4. Reset interaction state when a fresh dataset requires isolation.

## 8. Checks & Verification

Invoke each handler with representative payloads; verify expected state/UI changes, no application coupling, and clean reset on regeneration.

## 9. Return Condition

Return `COMPLETED` with handler evidence when every output has a faithful controlled treatment; otherwise `BLOCKED` with the missing decision.
