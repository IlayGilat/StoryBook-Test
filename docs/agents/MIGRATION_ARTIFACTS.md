# Migration Artifacts

All persistent migration state lives under `.migrations/<component>/`; the external legacy repository remains read-only.

```text
.migrations/<component>/
  state.json
  component-tree.json
  dependencies.json
  smart-dependencies.json
  migration-plan.md
  dumb-boundary.json
  data-contract.json
  file-plan.json
  parity-report.json
  logs/decisions.md
  logs/build-report.md
  handoffs/<stage>.md
```

## Machine-readable files

- `state.json`: fields and ordering exactly follow `.agents/shared/state-schema.md`: `component`, optional `sourcePath`, `status`, `currentStage`, `completedStages`, `targetLocation`, `warnings`, `lastUpdatedBy`, `updatedAt`. Use two spaces and a trailing newline.
- `component-tree.json`: `{ "root": "selector", "nodes": [{ "id", "selector", "sourceFiles", "children", "discoveryStatus" }] }`. `children` preserves rendered template order; paths identify read-only source files. Every node appears once.
- `dependencies.json`: `{ "nodes": { "<node-id>": [{ "kind", "symbol", "module", "usage", "sourceFile" }] } }` for imports, injected services, pipes, directives, components, tokens, styles, assets, and packages.
- `smart-dependencies.json`: `{ "nodes": { "<node-id>": [{ "symbol", "category", "usage", "conversion", "owner" }] } }`; `category` is `presentation`, `data`, `application-control`, or `environment`.
- `dumb-boundary.json`: `{ "rootInputs", "rootOutputs", "preservedInternalDependencies", "nodeOverrides" }`. Expose only the root benchmark contract; keep satisfiable nested smart behavior internal.
- `data-contract.json`: `{ "types", "schemas", "dataset", "sizes", "seed", "edgeCases" }`; every binding has a type and validation rule, and data generation is deterministic.
- `file-plan.json`: `{ "generatorTarget", "generatedFiles", "copiedNodes", "manualFiles", "validationOrder" }`. `generatorTarget` is the root and appears exactly once; `validationOrder` is post-order.
- `parity-report.json`: `{ "component", "baseline", "candidate", "dimensions", "deviations", "verdict" }`; each deviation records `severity`, `evidence`, `expected`, `actual`, and `status` (`open` or `accepted`).

Use repository-relative paths for target files and absolute or clearly rooted paths for external source files. Keep schemas stable, concise, and free of scratch reasoning.

## Markdown files

- `migration-plan.md`: scope, post-order node sequence, dependency conversions, root boundary, file operations, node checks, stage validations, risks, and explicit non-goals.
- `logs/decisions.md`: append dated entries with change, reason, fidelity impact, and status `Temporary` or `Accepted`.
- `logs/build-report.md`: append command, scope/node, exit result, concise diagnostics, and evidence path. Do not paste unbounded logs.
- `handoffs/<stage>.md`: use the exact section order in `.agents/shared/handoff-contract.md`: metadata, Inputs Used, Work Completed, Files Changed / Created, Important Decisions, Known Deviations, Warnings / Open Risks, Validation Results, Next Stage Requirements. Use `None`; never omit a section.

The handoff status and UTC timestamp must match the final `state.json` update. A handoff recommends but never starts the next stage.
