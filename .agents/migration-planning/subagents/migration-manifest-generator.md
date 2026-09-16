# Migration Manifest Generator Sub-Agent

## 1. Goal

Synthesize approved planning fragments into the complete ordered file manifest and human-readable migration plan.

## 2. When Parent Should Use It

Use after boundary, post-order, reuse, and data-contract decisions are stable.

## 3. Inputs

- All four analysis artifacts
- Approved boundary, post-order, reuse, and data-contract planning fragments
- Repository target layout conventions

## 4. Outputs

- Assigned `plan/file-plan.json` and `plan/migration-plan.md`
- Structured return: output paths, coverage counts, unresolved conflicts, checks

## 5. Allowed Scope

Write only `plan/file-plan.json` and `plan/migration-plan.md`; read required analysis/planning artifacts.

## 6. Forbidden Scope

Altering other plan fragments, source/component/scaffold files, implementation, state, decisions log, and handoffs.

## 7. Procedure

1. Preserve the approved strict post-order as the implementation sequence.
2. Enumerate every source-to-target copy/adapt, create, and reuse operation with owner stage and prerequisites.
3. Include boundary mappings, styles/assets, internal dependencies, risks, and node verification gates.
4. Generate deterministic JSON and a concise operational Markdown guide; surface conflicts to the parent.

## 8. Checks & Verification

Verify all analyzed nodes/files/dependencies have dispositions, every operation has exact paths and ownership, children precede parents, and JSON parses.

## 9. Return Condition

Return status, created paths, coverage/check results, and conflicts; the parent performs integration and final validation.
