---
description: "Connect validated dataset generation and other controlled inputs to stable container state across initial load and regeneration."
mode: subagent
---

# Input State Sub-Agent

## 1. Goal

Connect validated dataset generation and other controlled inputs to stable container state across initial load and regeneration.

## 2. When Parent Should Use It

Use after base container and component wiring contracts are known.

## 3. Inputs

- Validated data APIs, UI input bindings, and planned controlled values
- Base container generation lifecycle and reset requirements

## 4. Outputs

- Assigned container state/generation edits
- State initialization, regeneration, and reset behavior summary

## 5. Allowed Scope

Write only the assigned state/generation region of `<component>.container.ts`.

## 6. Forbidden Scope

Duplicated base lifecycle, mutable shared fixtures, UI/data/story/test/core edits, state/log/handoff, fabricated application state.

## 7. Procedure

1. Define typed deterministic defaults for every controlled input.
2. Generate data only through the validated data-generator path.
3. Apply a generated dataset atomically and reset dependent controlled state when required.
4. Keep stale-result rejection owned by the base class.

## 8. Checks & Verification

Verify initial empty/loading state, exact generated size, deterministic resets, and absence of partial or stale assignments under rapid regeneration.

## 9. Return Condition

Return `COMPLETED` with state-transition evidence when all inputs are controlled and stable; otherwise `FAILED` or `BLOCKED` precisely.
