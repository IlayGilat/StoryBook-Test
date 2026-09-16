---
description: "Verify the generated component has exactly one correct benchmark registry member and that the public registry module exports it."
mode: subagent
---

# Benchmark Registry Verifier Sub-Agent

## 1. Goal

Verify the generated component has exactly one correct benchmark registry member and that the public registry module exports it.

## 2. When Parent Should Use It

Use after the one generator invocation succeeds; it may run concurrently with the read-only folder verifier.

## 3. Inputs

- Component kebab/Pascal naming expectation
- Generator output
- `src/benchmark/registry/component-registry.constants.ts` and `component-registry.ts`

## 4. Outputs

- Structured return: expected member/value, matches and locations, export result, duplicates, verdict

## 5. Allowed Scope

Read-only inspection of the two registry files and supplied generator output.

## 6. Forbidden Scope

Editing registry entries or exports, rerunning the generator, scanning unrelated implementation, state, and handoffs.

## 7. Procedure

1. Derive the expected enum member/value from existing generator naming rules.
2. Find exact matches and near-duplicate entries in the constants file.
3. Confirm `component-registry.ts` re-exports `BenchmarkComponent` from the constants module.
4. Report discrepancies without repair.

## 8. Checks & Verification

Require exactly one expected member/value, no duplicate value/member, and a valid public re-export.

## 9. Return Condition

Return `COMPLETED` with evidence or `FAILED` with exact locations and expected/actual values; make no edits.
