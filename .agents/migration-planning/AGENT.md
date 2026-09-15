# Migration Planning Main Agent

## 1. Purpose

Translate verified source analysis into a complete, deterministic implementation blueprint: the benchmark-root presentation boundary, strict child-before-parent order, dependency treatments, data contracts, reuse decisions, and exact file operations.

## 2. When to Invoke

Invoke for a component only after Source Analysis completed successfully and all required analysis artifacts are available.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/migration-planning/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/source-analysis.md`
- `.migrations/<component>/analysis/component-tree.json`
- `.migrations/<component>/analysis/dependencies.json`
- `.migrations/<component>/analysis/smart-dependencies.json`
- `.migrations/<component>/analysis/summary.md`

## 4. Optional Context

- Only legacy type/model definitions cited by analysis when needed to resolve an exact contract
- Relevant existing `src/components/shared/` files for a concrete reuse decision
- `docs/agents/COMPONENT_BOUNDARIES.md` for an unresolved boundary edge case

## 5. Do Not Load by Default

- Unrelated legacy source or the whole legacy repository
- Other stage `AGENT.md` files, unselected worker prompts, later-stage artifacts, and historical handoffs
- Generated implementation contents, tests, raw notes, and `.artifacts/`

## 6. Required Prior Artifacts

- A `COMPLETED` `.migrations/<component>/handoffs/source-analysis.md`
- Valid and internally consistent `component-tree.json`, `dependencies.json`, `smart-dependencies.json`, and `summary.md`

## 7. Sub-Agents Available

- `dumb-boundary-planner`
- `component-tree-planner`
- `shared-component-reuse-planner`
- `data-contract-planner`
- `migration-manifest-generator`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. Select the minimum planners needed for the analyzed tree; assign exact inputs and separate return/artifact scopes. Concurrency is allowed only for disjoint writes and independent decisions. The main agent resolves conflicts, integrates all outputs, writes `state.json` and the handoff, and owns final plan validation.

## 9. Responsibilities

- Define the smallest complete public presentation boundary for the top-level benchmark component.
- Map selectors/data reads to typed inputs, control effects to typed outputs or harness actions, environment state to controlled values, and justified pure helpers to preserved/mock treatment.
- Preserve internally satisfiable nested smart boundaries rather than unnecessarily exposing child contracts at the benchmark root.
- Produce deterministic strict post-order and a complete source-to-target, operation-by-operation file plan.

## 10. Non-Responsibilities

- Editing legacy source or implementing/copying any Angular component.
- Running `npm run generate:component`, creating the scaffold, data factories, harnesses, stories, or tests.
- Refactoring analyzed behavior or invoking Component Scaffold.

## 11. Execution Flow

1. Validate prior handoff and analysis completeness; set planning active in state.
2. Derive deterministic strict post-order from the rendered tree.
3. Plan root and internal dependency boundaries, shared reuse, and complete data contracts.
4. Integrate decisions into `dumb-boundary.json`, `data-contract.json`, `file-plan.json`, and `migration-plan.md`.
5. Cross-validate every node/dependency/file, update state, write the canonical handoff, and stop.

## 12. Allowed Modifications

- `.migrations/<component>/plan/migration-plan.md`
- `.migrations/<component>/plan/dumb-boundary.json`
- `.migrations/<component>/plan/data-contract.json`
- `.migrations/<component>/plan/file-plan.json`
- `.migrations/<component>/logs/decisions.md`, `state.json`, and `handoffs/migration-planning.md`

## 13. Forbidden Modifications

- Any legacy/production source
- `src/components/`, `src/benchmark/`, package/configuration files, and generator scripts
- Analysis artifacts, scaffold output, later-stage artifacts, and `.artifacts/`

## 14. Required Outputs

- `plan/migration-plan.md`: boundary rationale, internal boundaries, dependency treatments, reuse decisions, post-order, risks, and executable stage guidance
- `plan/dumb-boundary.json`: every root input/output with exact TypeScript type, source evidence, default/required semantics, and event payload
- `plan/data-contract.json`: complete root/internal model shapes, relationships, defaults/states, and Zod-ready constraints without fabricated values
- `plan/file-plan.json`: deterministic ordered nodes and every copy/adapt/create/reuse file operation with source, target, owner stage, dependencies, and verification
- Updated state and `.migrations/<component>/handoffs/migration-planning.md`

## 15. Validation

- Parse all JSON outputs and ensure deterministic, duplicate-free ordering.
- Assert every child precedes its parent in `file-plan.json`, with a stable tie-break based on source tree sibling order.
- Cross-check every analyzed node, source file, smart dependency, public binding, style/asset dependency, and shared candidate has an explicit plan disposition.
- Verify every public boundary entry and data-contract field has evidence and exact types or an explicit unresolved blocker.
- Verify no source, `src/components/`, or scaffold file changed.

## 16. Definition of Done (DoD)

- [ ] A complete typed dumb boundary exists for the top-level component.
- [ ] Every node is scheduled once in deterministic strict post-order, children before parents.
- [ ] Every smart dependency has a concrete, evidence-backed adaptation treatment.
- [ ] Reuse versus copy is explicit and fidelity justified.
- [ ] Data and file plans are complete enough for downstream agents to perform zero architectural rediscovery.
- [ ] State and canonical handoff agree; no implementation or scaffold work occurred.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/migration-planning.md` using the exact shared contract and recommend `component-scaffold` without invoking it. Match state and handoff status/timestamp. Missing or contradictory analysis that prevents exact planning is `BLOCKED`, not permission to guess; invalid output is `FAILED`. Stop immediately after this DoD.
