# Local State Adaptation Sub-Agent

## 1. Goal

Preserve rendering-relevant local presentation state and interactions without promoting them unnecessarily to application or benchmark state.

## 2. When Parent Should Use It

Use when the current node owns transient tabs, expansion, selection, focus, hover, form draft, or similar presentation state.

## 3. Inputs

- Assigned node TypeScript/template and source interaction/lifecycle evidence
- Planned boundary contracts and verified child events
- State initialization, transition, and reset behavior

## 4. Outputs

- Assigned current-node local-state edits
- Return state table describing initial values, transitions, triggers, rendering effects, and preserved timing

## 5. Allowed Scope

Write only parent-assigned current-node TypeScript/template portions for local presentation state.

## 6. Forbidden Scope

Moving application data into local state, exposing unnecessary root inputs, global/store state, fabricated interactions, other nodes, state/logs/handoff.

## 7. Procedure

1. Distinguish local presentation state from externally owned application data.
2. Preserve initial values, lifecycle resets, transitions, and template visibility.
3. Keep state internal unless an approved boundary requires external control/observation.
4. Wire verified child events without changing interaction semantics.

## 8. Checks & Verification

Trace every source transition to target code and template effect; verify no application data was internalized and no local behavior was silently dropped.

## 9. Return Condition

Return `COMPLETED` with the state-transition table; otherwise `BLOCKED` when ownership or transition evidence is ambiguous.
