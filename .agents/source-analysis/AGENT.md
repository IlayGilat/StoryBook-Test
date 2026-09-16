# Source Analysis Main Agent

## 1. Purpose

Perform a strictly read-only analysis of the legacy benchmark root and its complete rendered tree, discovering nodes top-down and classifying every dependency for deterministic downstream planning.

## 2. When to Invoke

Invoke for a named top-level component after project bootstrap is complete and the operator supplies a resolvable legacy source path.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/source-analysis/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/project-bootstrap.md`
- The root legacy component TypeScript, template, and component style files

## 4. Optional Context

- Legacy declarations/import metadata and only those source files reached while resolving rendered selectors, pipes, directives, services, styles, or assets
- Existing `src/components/shared/` candidates when classifying reuse possibilities
- `docs/agents/COMPONENT_TREE_MIGRATION.md` or `docs/agents/COMPONENT_BOUNDARIES.md` for an encountered edge case

## 5. Do Not Load by Default

- Unrelated legacy features or the whole legacy repository
- Other stage `AGENT.md` files, unselected worker prompts, later-stage artifacts, and old handoffs
- Generated benchmark targets, raw historical notes, and `.artifacts/`

## 6. Required Prior Artifacts

- `.migrations/<component>/state.json` with a valid `sourcePath`
- `.migrations/<component>/handoffs/project-bootstrap.md` with `COMPLETED` status

## 7. Sub-Agents Available

- `component-tree-analyzer`
- `smart-dependency-analyzer`
- `child-component-analyzer`
- `ngrx-dependency-analyzer`
- `service-dependency-analyzer`
- `input-output-analyzer`
- `style-dependency-analyzer`
- `shared-dependency-analyzer`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. Begin with the minimum worker needed to discover the rendered tree top-down, then select other workers from evidence in that tree. Give each worker explicit nodes, inputs, and an isolated output or return-only scope. Permit concurrency only for disjoint files and never concurrent `state.json` edits. The main agent integrates all analysis, updates state, writes the handoff, and performs final validation.

## 9. Responsibilities

- Resolve every rendered child selector recursively from root to leaves, including conditional and iterative rendering.
- Inventory imports, public bindings, local state, lifecycle/async behavior, services, store usage, pipes, directives, packages, styles, tokens, and assets.
- Classify dependencies as Presentation, Data, Application Control, or Environment and cite file-level evidence.
- Catalog missing source, ambiguity, complexity, and fidelity risks without inventing facts.

## 10. Non-Responsibilities

- Modifying any legacy file or any file under `src/components/`.
- Choosing the final dumb boundary or implementation order.
- Copying components, running the scaffold generator, creating data, stories, harnesses, or tests.
- Invoking migration planning.

## 11. Execution Flow

1. Validate prerequisites and root source; set this stage active in state.
2. Discover the rendered tree top-down, resolving each child before analyzing the next depth.
3. Delegate evidence-based dependency audits for the discovered node set.
4. Integrate worker findings into the four canonical analysis artifacts and resolve duplicate/conflicting entries.
5. Validate coverage and JSON/Markdown, update state, write the handoff, and stop.

## 12. Allowed Modifications

- `.migrations/<component>/analysis/component-tree.json`
- `.migrations/<component>/analysis/dependencies.json`
- `.migrations/<component>/analysis/smart-dependencies.json`
- `.migrations/<component>/analysis/summary.md`
- `.migrations/<component>/logs/decisions.md` only for meaningful analysis-stage decisions
- `.migrations/<component>/state.json` and `handoffs/source-analysis.md`

## 13. Forbidden Modifications

- The external production/legacy repository
- `src/components/`, shared infrastructure, package manifests, Storybook configuration, and generator files
- Planning/scaffold artifacts, later-stage files, and `.artifacts/`

## 14. Required Outputs

- `analysis/component-tree.json`: deterministic hierarchical nodes, source paths, depth, render order, and conditional/iterative flags
- `analysis/dependencies.json`: complete per-node imports, inputs/outputs, services, pipes, directives, packages, styles, assets, async patterns, and lifecycle inventory
- `analysis/smart-dependencies.json`: evidence-backed category and downstream treatment candidates for every application boundary
- `analysis/summary.md`: complexity, missing inputs, risks, and coverage summary
- Updated state and `.migrations/<component>/handoffs/source-analysis.md`

## 15. Validation

- Parse all three JSON artifacts and verify stable ordering and repository-relative paths where applicable.
- Cross-check every rendered selector in each inspected template against a child node or an explicitly classified external/native element.
- Cross-check every discovered node appears in the dependency inventory and every smart dependency has evidence and one of the four required categories.
- Verify `git diff -- <legacy-root>` is empty and no `src/components/` files changed during the stage.

## 16. Definition of Done (DoD)

- [ ] The complete rendered tree is mapped top-down to leaf primitives with conditional/iterative behavior.
- [ ] Every discovered dependency is inventoried and classified as Presentation, Data, Application Control, or Environment.
- [ ] Inputs, outputs, local state, async rendering, lifecycle hooks, styles, tokens, assets, and missing source are documented.
- [ ] All analysis artifacts validate and fidelity risks are explicit.
- [ ] State and canonical source-analysis handoff agree; no source or component migration occurred.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/source-analysis.md` in the exact shared contract order and recommend `migration-planning` without invoking it. Match handoff status/timestamp to state. If source or a required child cannot be resolved, record the exact gap, mark `BLOCKED`, and stop; if validation fails, mark `FAILED`. Stop immediately once this DoD is met.
