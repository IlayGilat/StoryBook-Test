---
description: "Remove assigned NgRx coupling by replacing selector/store reads with typed data contracts and dispatches with typed user-intent events."
mode: subagent
---

# NgRx Adaptation Sub-Agent

## 1. Goal

Remove assigned NgRx coupling by replacing selector/store reads with typed data contracts and dispatches with typed user-intent events.

## 2. When Parent Should Use It

Use only when the current node's analyzed dependencies contain NgRx imports, reads, selectors, actions, or dispatches.

## 3. Inputs

- Assigned node files and cited NgRx source declarations
- Relevant `smart-dependencies.json`, `dumb-boundary.json`, and file-plan treatments
- Parent-approved input/output names, types, timing/default semantics, and payloads

## 4. Outputs

- Assigned current-node edits removing planned NgRx coupling
- Return map of every selector/read/dispatch/import to its typed replacement

## 5. Allowed Scope

Write only assigned portions of current-node TypeScript/template; read cited selectors/actions/models needed for exact shapes.

## 6. Forbidden Scope

Installing NgRx, retaining store access, inventing state, altering reducers/actions, harness implementation, other nodes, state/logs/handoff.

## 7. Procedure

1. Inventory assigned store imports, injection, selects, subscriptions/signals, async-template use, and dispatches.
2. Replace reads with approved typed inputs while preserving loading/error/empty timing distinctions.
3. Replace dispatches with minimal typed outputs and preserve local confirmation/presentation behavior.
4. Remove now-unused NgRx code and account for every original match.

## 8. Checks & Verification

Search assigned target files for NgRx/store remnants; reconcile every source occurrence to a contract and check template/member consistency.

## 9. Return Condition

Return `COMPLETED` with zero unexplained NgRx references and the mapping; otherwise `BLOCKED` with unresolved selector/action evidence.
