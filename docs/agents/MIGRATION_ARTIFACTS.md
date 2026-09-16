# Migration Artifacts

All persistent migration state lives under `.migrations/<component>/`; the external legacy repository remains strictly read-only.

```text
.migrations/<component>/
  state.json
  source/source-files.json
  analysis/component-tree.json
  analysis/dependencies.json
  analysis/smart-dependencies.json
  analysis/summary.md
  plan/migration-plan.md
  plan/dumb-boundary.json
  plan/data-contract.json
  plan/file-plan.json
  logs/copied-files.json
  logs/decisions.md
  validation/build-report.md
  validation/parity-report.json
  validation/fidelity-summary.md
  handoffs/<stage-name>.md
```

Use repository-relative target paths and absolute or clearly rooted external source paths. JSON uses two-space indentation, stable array ordering, and a trailing newline. Every field listed below is required unless marked optional.

## State and source

- `state.json`: the exact ordered fields from `.agents/shared/state-schema.md`: `component`, optional `sourcePath`, `status`, `currentStage`, `completedStages`, `targetLocation`, `warnings`, `lastUpdatedBy`, `updatedAt`.
- `source/source-files.json`: `{ "component", "legacyRoot", "capturedAt", "files" }`; each file is `{ "path", "kind", "nodeId", "sha256" }`, where `kind` identifies TypeScript, template, style, asset, or supporting type. This is a read-only source inventory, not copied content.

## Analysis

- `analysis/component-tree.json`: `{ "rootId", "nodes" }`; each node is `{ "id", "selector", "depth", "sourceFiles", "children", "discoveryStatus" }`. Each child edge is `{ "nodeId", "order", "kind", "condition", "evidence" }`, with `kind` equal to `static`, `conditional`, or `dynamic`; use `condition: null` for unconditional edges. Children preserve rendered order, depth is root-relative, and every node ID appears once.
- `analysis/dependencies.json`: `{ "component", "nodes" }`; each node entry is `{ "nodeId", "dependencies" }`; each dependency is `{ "id", "kind", "symbol", "module", "usage", "sourceFile", "evidence" }` and covers imports, services, tokens, pipes, directives, components, styles, assets, or packages.
- `analysis/smart-dependencies.json`: `{ "component", "nodes" }`; each item is `{ "id", "nodeId", "symbol", "category", "usage", "conversion", "owner", "evidence" }`. `category` is `presentation`, `data`, `application-control`, or `environment`.
- `analysis/summary.md`: sections `Scope`, `Rendered Tree`, `Application Coupling`, `Missing Inputs`, and `Validation`; use `None` for an empty section.

## Plan

- `plan/migration-plan.md`: sections `Scope`, `Post-order Sequence`, `Dependency Conversions`, `Root Boundary`, `File Operations`, `Node Validation`, `Stage Validation`, `Risks`, and `Non-goals`.
- `plan/dumb-boundary.json`: `{ "component", "rootInputs", "rootOutputs", "preservedInternalDependencies", "nodeOverrides" }`. Every input/output entry requires `name`, `type`, `source`, and `owner`; every preserved/override entry requires `nodeId`, `dependencyId`, `treatment`, and `reason`.
- `plan/data-contract.json`: `{ "component", "types", "schemas", "dataset", "sizes", "seed", "edgeCases" }`. Type/schema entries require stable names and definitions; `dataset` requires root type and schema names; edge cases require `id`, `purpose`, and deterministic values or factory rules.
- `plan/file-plan.json`: `{ "component", "generatorTarget", "generatedFiles", "copiedNodes", "manualFiles", "validationOrder" }`. File operations require `source` (nullable only for generated/manual files), `target`, `operation`, and `nodeId`; `generatorTarget` is the top-level root exactly once and `validationOrder` is strict post-order node IDs.

## Logs

- `logs/copied-files.json`: `{ "component", "entries" }`; each append-only entry is `{ "nodeId", "source", "target", "operation", "sourceSha256", "result", "recordedAt" }`.
- `logs/decisions.md`: dated entries with stable decision ID plus `Change`, `Reason`, `Fidelity impact`, and `Status` (`Temporary` or `Accepted`).

## Validation

- `validation/build-report.md`: append entries with `Stage`, `Node or scope`, `Command`, `Exit result`, `Diagnostics`, and `Evidence`; keep raw logs out of the file.
- `validation/parity-report.json`: `{ "component", "baseline", "candidate", "policy", "dimensions", "findings", "verdict" }`. Baseline/candidate require build identity, URL, browser, viewport, theme, dataset, and evidence paths. Each finding requires stable `id`, `dimension`, `severity`, `evidence`, `expected`, `actual`, `status`, and `resolutionRef`; `status` is `open`, `accepted`, or `resolved`, and `resolutionRef` is `null` only while open.
- `validation/fidelity-summary.md`: sections `Compared States`, `Policy`, `Results by Dimension`, `Open Findings`, `Accepted or Resolved Findings`, `Evidence`, and `Verdict`; reference finding IDs from the parity report.

## Handoffs

- `handoffs/<stage-name>.md`: use the exact metadata and section order from `.agents/shared/handoff-contract.md`: Component, Stage, Status, Timestamp, Inputs Used, Work Completed, Files Changed / Created, Important Decisions, Known Deviations, Warnings / Open Risks, Validation Results, and Next Stage Requirements. Use `None`; never omit a section.

The handoff status and UTC timestamp must match the final `state.json` update. A handoff recommends but never starts the next stage. Artifacts record verified outcomes, never scratch reasoning.
