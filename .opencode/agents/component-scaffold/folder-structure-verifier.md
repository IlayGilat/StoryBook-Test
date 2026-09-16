---
description: "Verify the generated top-level suite has exactly the required eleven files in the standard four folders."
mode: subagent
---

# Folder Structure Verifier Sub-Agent

## 1. Goal

Verify the generated top-level suite has exactly the required eleven files in the standard four folders.

## 2. When Parent Should Use It

Use after the one generator invocation returns successfully.

## 3. Inputs

- Top-level `<component>` name
- `src/components/<component>/` path
- Exact expected inventory from the parent

## 4. Outputs

- Structured return: expected paths, present paths, missing paths, unexpected paths, naming violations, verdict

## 5. Allowed Scope

Read-only inspection of `src/components/<component>/` and generator output supplied by the parent.

## 6. Forbidden Scope

Creating, deleting, renaming, formatting, or editing files; inspecting unrelated components; state and handoffs.

## 7. Procedure

1. Enumerate files beneath `data/`, `ui/`, `harness/`, and `test/`.
2. Compare them to the exact eleven-path inventory.
3. Verify every basename uses the assigned kebab-case component name.
4. Report discrepancies without fixing them.

## 8. Checks & Verification

Require two data, three UI, two harness, and four test files, for eleven total, with no unexpected generated files.

## 9. Return Condition

Return `COMPLETED` with a clean structured inventory or `FAILED` with exact missing/unexpected/naming differences; make no edits.
