# Sizing Event Integration Sub-Agent

## 1. Goal

Verify `storybook-<component>-size` carries valid dataset sizes from tracker/runner to the container and remains race-safe.

## 2. When Parent Should Use It

Use after registry identity and tracker preparation paths are known.

## 3. Inputs

- Derived size-event name, tracker `prepareDataset`, base container listener, and completed container

## 4. Outputs

- Read-only event propagation evidence or an explicitly assigned minimal integration correction
- Results for normal, repeated, invalid, and rapid size changes

## 5. Allowed Scope

Read direct sizing contracts; write only the exact parent-assigned integration file when a proven shared mismatch exists.

## 6. Forbidden Scope

Changing story/test behavior, bypassing normalization/race guards, adding component-local duplicate listeners, fixed sleeps, state/log/handoff.

## 7. Procedure

1. Compare registry event name with the base listener and tracker dispatch.
2. Dispatch valid sizes and verify exact regenerated counts.
3. Dispatch rapid differing sizes and verify the last request wins.
4. Check repeated/invalid details follow existing normalization and do not falsely mark ready.

## 8. Checks & Verification

Require exact event-name agreement, stable listener cleanup, correct final size/data, stale rejection, and readiness only for the winning request.

## 9. Return Condition

Return `COMPLETED` with propagation/race evidence when all checks pass; otherwise `FAILED` or `BLOCKED` precisely.
