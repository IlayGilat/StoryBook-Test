---
name: inspect-angular-component
description: Inspect one Angular component and record its files, metadata, bindings, dependencies, and rendered children without changing source.
---

# Inspect Angular Component

## When to use

Use during Source Analysis or before migrating one tree node when its exact Angular contract is not yet recorded.

## Inputs

- Read-only legacy component TypeScript path and associated template/style paths.
- Node identifier in `.migrations/<component>/analysis/component-tree.json`.
- Existing dependency artifacts, if present.

## Outputs

- Verified node metadata for `analysis/component-tree.json`.
- Dependency observations for `analysis/dependencies.json` and `analysis/smart-dependencies.json`.
- No source or target UI changes.

## Procedure

1. Read the decorator, class, external/inline template, styles, and directly referenced local types.
2. Record selector, standalone/module ownership, change detection, inputs, outputs, queries, host bindings/listeners, providers, lifecycle hooks, and local state.
3. Walk the template in rendered order; record Angular child selectors, structural branches, bindings, pipes, directives, events, ARIA, and stable DOM/classes.
4. Record style and asset imports, theme tokens, injected services/tokens, router/store use, and package imports with exact source locations.
5. Reconcile findings with the node entry; report missing files or ambiguous selector ownership as blockers.

## Constraints

- The legacy source is strictly read-only.
- Discover parent-to-child; do not recursively implement or bulk-copy descendants.
- Do not infer behavior, types, or dependencies absent from evidence.
- Load only files required for this node.

## Stop conditions

Stop when metadata, bindings, rendered child references, and dependencies are fully evidenced, or when a required source file/owner is missing and the stage is recorded blocked.
