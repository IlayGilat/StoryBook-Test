# Component Tree Planner Sub-Agent

## 1. Goal

Compute the deterministic strict post-order migration sequence for all rendered nodes.

## 2. When Parent Should Use It

Use for every non-empty analyzed component tree before file-plan synthesis.

## 3. Inputs

- `analysis/component-tree.json`
- Stable node identifiers, sibling order, and conditional/iterative metadata

## 4. Outputs

- Structured ordered node array with node id, source paths, parent, dependencies, ordinal, and traversal evidence

## 5. Allowed Scope

Read the component tree and return the ordered plan fragment; write only an explicitly assigned planning fragment.

## 6. Forbidden Scope

Changing the analyzed tree, choosing component adaptations, editing source/targets, state, and handoffs.

## 7. Procedure

1. Validate one root, unique node identifiers, parent links, and cycle status.
2. Traverse each child list in recorded render/sibling order.
3. Emit a node only after all its descendants.
4. Assign contiguous ordinals and preserve conditional metadata.

## 8. Checks & Verification

Assert every node appears once, every child ordinal is lower than its parent, the root is last, and repeated runs yield identical output.

## 9. Return Condition

Return structured status, ordered array, invariant checks, and blockers such as cycles or unresolved children.
