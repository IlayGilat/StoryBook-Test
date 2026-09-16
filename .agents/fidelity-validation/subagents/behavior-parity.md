# Behavior Parity Worker

## 1. Goal

Replay equivalent interactions and compare observable legacy and Storybook behavior.

## 2. When Parent Should Use It

The Fidelity Validation parent invokes this worker with an explicit interaction matrix. Do not spawn subagents or repair failed behavior.

## 3. Inputs

### Context to load

Load this prompt, matched capture manifests, interaction steps, expected observable outcomes, and only the selectors/contracts required for assigned behavior states.

### Delegated inputs

Receive component name, stable scenario IDs, deterministic data, readiness rules, and applicable selection, sorting, filtering, expansion, pagination, scrolling, keyboard, loading, empty, error, and emitted-event steps.

## 4. Outputs

Return scenario/step-specific candidates with expected and actual outcomes and evidence paths. Preserve existing IDs on revalidation and identify crashes, inaccessible controls, missing events, state mismatches, or transition differences without assigning final severity.

## 5. Allowed Scope

Write only beneath `.migrations/<component>/validation/fidelity/behavior/`.

## 6. Forbidden Scope

Do not edit either application, tests, shared reports, decisions, `state.json`, or handoffs.

## 7. Procedure

Establish matching initial states; replay the same ordered steps; capture before/after DOM, screenshots, emitted events, focus, state values, and timing/readiness outcomes; compare user-observable behavior rather than internal implementation.

## 8. Checks & Verification

Verify each applicable scenario reached readiness and every step produced recorded evidence. Escalate missing controlled states or nondeterminism; do not use arbitrary waits, skip a failing step, or reinterpret application coupling as equivalent behavior.

## 9. Return Condition

Return candidate findings, steps, commands/results, evidence, and concerns. The parent owns stable IDs, severity/status, integration, reports, state, decisions, and handoff.
