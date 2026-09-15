---
name: build-component-tree
description: Discover the rendered Angular component tree top-down and produce a deterministic hierarchical artifact.
---

# Build Component Tree

## When to use

Use in Source Analysis after the benchmark root has been identified and before planning or copying UI nodes.

## Inputs

- Root selector and read-only legacy component files.
- Selector declarations/import ownership available from the legacy application.
- `.migrations/<component>/component-tree.json` destination.

## Outputs

- Complete `component-tree.json` with root, ordered nodes, source files, children, and discovery status.
- Missing-source warnings for `state.json` when applicable.

## Procedure

1. Inspect the root template and record directly rendered Angular selectors in template order.
2. Resolve each selector to its declaration and source files without modifying source.
3. Repeat parent-to-child until every reachable rendered Angular component is resolved.
4. Distinguish components from HTML elements, directives, pipes, projected slots, and dynamically rendered components; record evidence for dynamic edges.
5. De-duplicate shared nodes by stable ID, detect cycles, and preserve ordered child edges.
6. Validate that every non-external node has readable TypeScript/template/style sources and serialize deterministically.

## Constraints

- Discovery is top-down; later implementation is bottom-up in strict post-order.
- Do not copy, adapt, generate, or migrate components.
- Do not treat an import as rendered without template/runtime evidence.
- Do not invent missing dynamic children.

## Stop conditions

Stop when all reachable rendered nodes are resolved exactly once and the tree validates, or block immediately on missing required source or unresolved ownership.
