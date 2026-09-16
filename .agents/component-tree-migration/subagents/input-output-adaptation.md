# Input Output Adaptation Sub-Agent

## 1. Goal

Implement the assigned node's explicit, strictly typed presentation inputs and outputs from the approved boundary plan.

## 2. When Parent Should Use It

Use when `dumb-boundary.json`, `smart-dependencies.json`, or the node plan requires data/control contract adaptation.

## 3. Inputs

- Assigned node TypeScript/template and relevant plan entries
- Exact approved contract names, types, required/default semantics, payload shapes, and source evidence
- Verified child contracts when events or values are forwarded

## 4. Outputs

- Assigned node TypeScript/template contract edits
- Return inventory mapping each source read/effect to its resulting input/output and payload

## 5. Allowed Scope

Write only the parent-assigned contract portions of the current node files; read cited types and verified child contracts.

## 6. Forbidden Scope

Invented defaults, `any`, silent no-op outputs, harness/data implementation, unrelated APIs, shared artifacts/state/logs/handoff.

## 7. Procedure

1. Trace each planned data read or control effect to its exact typed contract.
2. Add `@Input()` values with approved required/default semantics and `@Output()` events with minimal typed intent payloads.
3. Update assigned bindings/handlers and preserve loading, empty, error, and timing distinctions.
4. Report discrepancies to the parent rather than expanding the public API speculatively.

## 8. Checks & Verification

Account for every assigned boundary entry; verify names/types/payloads against plans, no `any`, and template/event bindings match declarations.

## 9. Return Condition

Return `COMPLETED` with a source-to-contract map, or `BLOCKED` with the exact unresolved type/default/effect evidence.
