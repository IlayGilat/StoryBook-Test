# Component Tree Migration

## Discover top-down, implement bottom-up

Start from the benchmark root template and follow rendered Angular selectors parent-to-child. This top-down discovery proves what actually participates in the view. Implementation reverses that dependency order: complete every descendant before its parent, in strict post-order. Never bulk-copy a raw tree for later conversion.

For `Root -> [Toolbar, Grid -> Cell]`, discovery is `Root, Toolbar, Grid, Cell`; implementation is `Toolbar, Cell, Grid, Root`.

```text
postOrder(node):
  for child in node.children in rendered order:
    postOrder(child)
  migrateAndValidate(node)
```

Use `component-tree.json` as the traversal source and `file-plan.json.validationOrder` as the executable sequence. Shared descendants appear once; detect selector cycles and block rather than guessing.

## Migrate one node

1. **Faithful copy:** read the node's TypeScript, template, Less, assets, presentation imports, and direct contracts from the read-only source. Copy only this node into its planned destination.
2. **Template adapt:** keep semantic structure, element order, classes, bindings, accessibility, and child selectors. Change only paths/contracts required by the standalone target.
3. **Style adapt:** preserve Less rules, cascade, token use, layout, and encapsulation. Resolve imports/assets deliberately; log meaningful deviations.
4. **Dependency strip:** classify every dependency. Preserve presentation dependencies; convert data reads to `@Input()`, application-control effects to `@Output()` or harness actions, and environment state to controlled values. Keep satisfiable nested smart dependencies internal.
5. **Node check:** compile the smallest target that includes the node, render its representative states, inspect for template/runtime errors, and record the result in `logs/build-report.md`.

Only after a node passes may its parent import or render it. If validation fails, repair that node before continuing; do not suppress errors or proceed upward.

## Isolation rules

- Work in one node's planned files at a time; do not let concurrent workers share files.
- Do not run `npm run generate:component` for children. The command is invoked exactly once for the top-level root during Component Scaffold.
- Avoid temporary parent stubs that conceal missing child contracts.
- Keep compiler output scoped to the current node and its completed descendants to prevent cascading diagnostics.
- Stop blocked when source files, selector ownership, or required assets are missing; record the missing input instead of inventing it.
