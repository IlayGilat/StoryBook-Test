---
name: copy-angular-ui-tree
description: Copy and adapt planned Angular UI nodes one at a time in post-order while preserving source fidelity.
---

# Copy Angular UI Tree

## When to use

Use during Component Tree Migration after scaffold and file-plan approval, for the next eligible node in post-order.

## Inputs

- Read-only legacy node files.
- `component-tree.json`, `file-plan.json`, `migration-plan.md`, and completed child-node evidence.
- Root destination under `src/components/<component>/ui/`.

## Outputs

- Faithfully copied files for exactly one node at its planned destination.
- Updated build/decision evidence owned by the active main agent.

## Procedure

1. Confirm every child of the node is already adapted and validated.
2. Copy the node's TypeScript, template, Less, and required local presentation assets while preserving planned structure.
3. Adjust only repository-relative paths, standalone imports, filenames, and selector references needed to compile in the target.
4. Preserve DOM order, classes, accessibility, behavior, and style cascade.
5. Invoke boundary conversion skills only for evidenced application coupling.
6. Compile/render the node with completed descendants and record the result before advancing.

## Constraints

- The legacy source is read-only.
- Never bulk-copy a raw tree for later conversion.
- Never run `npm run generate:component` for a child; the generator runs exactly once for the top-level benchmark target.
- Never proceed to a parent while this node fails validation.

## Stop conditions

Stop after one node is copied, adapted, and validated, or when missing source/assets/contracts are recorded as a blocker.
