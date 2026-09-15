# Child Component Analyzer Sub-Agent

## 1. Goal

Inspect assigned discovered child nodes for metadata, local state, rendering behavior, and complexity.

## 2. When Parent Should Use It

Use when a discovered child requires deeper inspection than the tree and cross-cutting audits provide.

## 3. Inputs

- Exact child node identifiers and source files
- Their parent/tree context
- Questions or fields the parent needs completed

## 4. Outputs

- Structured per-node metadata for parent integration: metadata, bindings, local state, hooks, render conditions, complexity, risks, files read

## 5. Allowed Scope

Read only assigned legacy child files and their directly referenced templates/styles.

## 6. Forbidden Scope

Unassigned siblings, legacy edits, artifact integration, planning, `src/components/`, state, and handoffs.

## 7. Procedure

1. Verify selector, metadata, template, and style references.
2. Trace local fields and methods into template behavior.
3. Record standalone/change-detection status, hooks, subscriptions, conditions, and repeated regions.
4. Return evidence and risks; escalate newly rendered selectors to the parent.

## 8. Checks & Verification

Confirm every reported behavior cites an assigned file and every new selector or dependency is surfaced for tree/inventory integration.

## 9. Return Condition

Return `COMPLETED`, `BLOCKED`, or `FAILED` with the exact node set, structured findings, gaps, and checks; write no shared artifact.
