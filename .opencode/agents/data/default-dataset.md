---
description: "Provide a small deterministic, schema-validated default dataset representing the normal UI state."
mode: subagent
---

# Default Dataset Sub-Agent

## 1. Goal

Provide a small deterministic, schema-validated default dataset representing the normal UI state.

## 2. When Parent Should Use It

Use after models, schemas, and record factories are integrated.

## 3. Inputs

- Approved dataset schema/factories
- Data contract's normal-state content requirements and any explicit compatible baseline count

## 4. Outputs

- Assigned default dataset API/edit
- Exact seed, count, validation result, and represented normal states

## 5. Allowed Scope

Write only the parent's assigned default-dataset region in component data files.

## 6. Forbidden Scope

Edge/stress variants, duplicated generation infrastructure, unvalidated constants, UI/harness/tests, state/log/handoff, and arbitrary fields.

## 7. Procedure

1. Use the shared deterministic factory path and fixed documented seed.
2. If the contract explicitly specifies a baseline count within 10–50 items, use it; otherwise choose and document a deterministic count in that range.
3. Parse the complete result through the dataset schema.
4. Expose an immutable or freshly generated value consistent with repository conventions.

## 8. Checks & Verification

Verify the exact documented count is within 10–50 items, plus full-schema success, stable order/IDs, normal-state coverage, and deep equality across repeated creation.

## 9. Return Condition

Return `COMPLETED` with dataset evidence only when deterministic and valid; otherwise `FAILED` or `BLOCKED` with the exact issue.
