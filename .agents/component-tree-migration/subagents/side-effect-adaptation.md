# Side Effect Adaptation Sub-Agent

## 1. Goal

Convert assigned non-presentational side effects into explicit typed intents while retaining presentation-only feedback and interaction sequencing.

## 2. When Parent Should Use It

Use when the current node performs analytics, alerts, storage, mutation, global messaging, clipboard, or other external effects.

## 3. Inputs

- Assigned node files and cited effect implementation
- Planned effect treatment and approved event/harness-action contract
- Evidence for payload, ordering, confirmation, and error-visible behavior

## 4. Outputs

- Assigned current-node effect-boundary edits
- Return map of each source effect to emitted intent or retained presentation behavior

## 5. Allowed Scope

Write only parent-assigned portions of the current node; read directly referenced effect types/constants.

## 6. Forbidden Scope

Executing external effects, silent no-ops, fake success/error state, harness implementation, global APIs, other nodes, state/logs/handoff.

## 7. Procedure

1. Inventory each effect, trigger, payload, ordering, and visible local feedback.
2. Preserve presentation-only state and confirmations.
3. Replace external actions with approved minimal typed outputs or explicitly planned harness actions.
4. Remove obsolete dependencies and report effects without a valid disposition.

## 8. Checks & Verification

Account for every assigned effect and verify no external API call remains, outputs carry exact payloads, and visible sequencing is preserved.

## 9. Return Condition

Return `COMPLETED` with complete effect mapping; otherwise `BLOCKED` on missing payload/order/feedback evidence.
