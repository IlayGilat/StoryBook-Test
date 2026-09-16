---
description: "Migrate the planned Angular UI tree one node at a time in the exact strict post-order declared by `plan/file-plan.json`, adapting application coupling into stable presentational contracts while preserving rendered fidelity. Discover top-down; implement bottom-up; migrate the scaffolded root UI last."
mode: primary
---

# Component Tree Migration Main Agent

## 1. Purpose

Migrate the planned Angular UI tree one node at a time in the exact strict post-order declared by `plan/file-plan.json`, adapting application coupling into stable presentational contracts while preserving rendered fidelity. Discover top-down; implement bottom-up; migrate the scaffolded root UI last.

## 2. When to Invoke

Invoke only after Component Scaffold completed successfully and the planned root scaffold, component-tree analysis, migration plan, and executable file plan all exist for the same component.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`
- `.agents/component-tree-migration/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/component-scaffold.md`
- `.migrations/<component>/plan/migration-plan.md`
- `.migrations/<component>/plan/file-plan.json`
- `.migrations/<component>/plan/dumb-boundary.json`
- `.migrations/<component>/analysis/component-tree.json`
- `.migrations/<component>/analysis/smart-dependencies.json`
- Only the current node's planned legacy files, directly referenced types/presentation dependencies, and already-migrated direct-child contracts

## 4. Optional Context

- `docs/agents/COMPONENT_TREE_MIGRATION.md` for traversal or isolation edge cases
- `docs/agents/COMPONENT_BOUNDARIES.md` for an unresolved application-boundary classification
- Relevant existing shared UI only for a planned, concrete reuse decision

## 5. Do Not Load by Default

- Other stage agents, future-stage prompts/artifacts, unselected worker prompts, or historical handoffs
- The whole legacy repository, raw source outside the current node and its direct dependency evidence, unrelated components, tests, or `.artifacts/`
- Data, harness, Storybook, benchmark-integration, Playwright, or fidelity implementation context

## 6. Required Prior Artifacts

- A `COMPLETED` `.migrations/<component>/handoffs/component-scaffold.md`
- Valid `analysis/component-tree.json` and `analysis/smart-dependencies.json`
- `plan/migration-plan.md`, `plan/dumb-boundary.json`, and a parseable `plan/file-plan.json` whose `validationOrder` contains every planned node exactly once, places every child before its parent, and places the root UI last
- The scaffolded `src/components/<component>/ui/<component>.component.{ts,html,less}`

## 7. Sub-Agents Available

- `template-migration`
- `component-logic-migration`
- `child-component-migration`
- `input-output-adaptation`
- `ngrx-adaptation`
- `service-adaptation`
- `router-adaptation`
- `environment-adaptation`
- `local-state-adaptation`
- `side-effect-adaptation`
- `pipe-directive-migration`
- `style-migration`
- `node-compilation-verification`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. The main agent selects the minimum workers required by the current node's file-plan entries, gives each exact files and a disjoint write scope, integrates and reviews their result, then delegates `node-compilation-verification`. Never dispatch writers concurrently against the same node files; read-only checks may overlap only when independent. Workers never edit `state.json`, shared logs, the handoff, or files outside their assignment. The main agent alone owns ordering, integration, decisions, state, validation records, and handoff.

## 9. Responsibilities

- Preflight the prior handoff and prove `file-plan.json.validationOrder` is a deterministic strict post-order of the analyzed rendered tree, with shared descendants scheduled once and the root last; block on cycles or ambiguity.
- Process exactly one queued node at a time: copy and adapt that node into its planned destination, never bulk-copy the raw tree for later conversion.
- Before finalizing a parent, verify every planned direct child already exists, compiles, and exposes the stable contract the parent will consume.
- Preserve DOM structure, element order, attributes, accessibility, classes, Less/CSS, composition, presentation logic, and visual interactions before refactoring.
- Classify each dependency: preserve presentation; convert data reads to typed inputs; convert application control to typed outputs or planned harness actions; convert environment state to typed controlled values; retain local presentation state.
- Reuse shared UI only when the planned candidate is reverified at 100% visual and behavioral fidelity; otherwise copy and adapt the source variant.
- After every node, record Angular template-aware compilation evidence in `.migrations/<component>/validation/build-report.md` and meaningful deviations in `logs/decisions.md`.

## 10. Non-Responsibilities

- Running `npm run generate:component` for any target; generation belongs exclusively to Component Scaffold and is forbidden here.
- Migrating data factories, harness containers, stories, benchmark integration, Playwright scenarios/tests, fidelity validation, or repairs owned by later stages.
- Redesigning markup, flattening the tree, replacing migratable children with placeholders, fabricating contracts/defaults, or rewriting working presentation algorithms.
- Editing production/legacy source or rediscovering architecture already settled by valid planning artifacts.

## 11. Execution Flow

1. Validate prerequisites, tree/file-plan agreement, exact post-order, root-last position, planned paths, and available source; set this stage active in state.
2. Take the first incomplete node in `file-plan.json.validationOrder`; load only its planned source, dependency evidence, selected worker prompt(s), and completed direct-child contracts.
3. Copy and adapt that node's TypeScript, template, styles, assets, pipes/directives, and application boundaries in its planned files; never copy another node speculatively.
4. Confirm all child selectors/imports resolve to already-verified stable child contracts and preserve the source composition.
5. Run `npx ng build` or the repository's smallest Angular compiler target/configuration with equivalent template checking that covers the node and completed descendants; inspect imports, standalone/`OnPush` metadata, Less resolution, contracts, and residual production coupling. Plain `tsc` may supplement this check but never satisfies the gate.
6. On success, append node evidence and deviations, mark the node complete in the main agent's working queue, and continue to its parent; on failure, the main agent must not proceed upward until that node is repaired and reverified.
7. After the root is migrated last, run full UI-tree validation, update state, write the canonical handoff, and stop without entering Data or Harness.

## 12. Allowed Modifications

- Only file-plan-owned UI files under `src/components/<component>/ui/`, including planned child components, local presentation helpers, pipes/directives, styles, and copied assets
- `.migrations/<component>/analysis/smart-dependencies.json` and `plan/dumb-boundary.json` only to reflect an evidence-backed boundary conversion discovered during this stage
- `.migrations/<component>/logs/decisions.md`, `validation/build-report.md`, `state.json`, and `handoffs/component-tree-migration.md`

## 13. Forbidden Modifications

- Any external production/legacy source, generator script/template, package/configuration file, registry entry, or unrelated component
- `src/components/<component>/{data,harness,test}/`, `src/benchmark/`, later-stage artifacts, and `.artifacts/`
- Unplanned files, raw bulk tree copies, child benchmark roots, placeholder children, `any` boundary contracts, silent no-op replacements, hard-coded production state, or suppressed compile errors
- Concurrent worker edits to the same file or any worker edit to shared state/log/handoff files

## 14. Required Outputs

- Every file-plan node adapted at its exact planned target under `src/components/<component>/ui/`, in recorded strict post-order with the scaffolded root UI last
- Standalone `OnPush` components with explicit typed inputs/outputs/controlled values and preserved local presentation state
- Updated `analysis/smart-dependencies.json` and `plan/dumb-boundary.json` when boundary evidence changed
- `.migrations/<component>/logs/decisions.md` containing every meaningful architectural or behavioral deviation with reason, fidelity impact, and `Temporary` or `Accepted` status
- `.migrations/<component>/validation/build-report.md` containing per-node command, result, verified child contracts, and final UI-tree validation
- Updated state and `.migrations/<component>/handoffs/component-tree-migration.md`

## 15. Validation

- Parse `component-tree.json`, `file-plan.json`, `smart-dependencies.json`, and `dumb-boundary.json`; prove uniqueness, child-before-parent ordering, root-last ordering, and complete file/dependency dispositions.
- After each node run `npx ng build` or a repository Angular compiler target/configuration with equivalent template checking that covers that node and its completed descendants; require exit zero before dequeuing its parent. Plain `npx tsc --noEmit` may be supplementary, but it is never sufficient because it does not validate Angular templates.
- Verify standalone imports/selectors, `ChangeDetectionStrategy.OnPush`, typed contracts, template bindings, Less/assets, stable child contracts, and absence of unexpected NgRx, backend service, router, or environment imports.
- At the end run the repository compile check for the complete `src/components/<component>/ui/` tree and inspect the diff to ensure no generator, data, harness, test, benchmark, unrelated component, or legacy file changed.
- Verify the inventory/order in `validation/build-report.md`, decision-log entries, state, and handoff agree with the completed work.

## 16. Definition of Done (DoD)

- [ ] Every planned node was copied and adapted exactly once in `file-plan.json.validationOrder`, every child before its parent, and the root UI last.
- [ ] Every parent consumes verified stable child contracts and the rendered tree remains structurally and visually faithful.
- [ ] All application data/control/router/environment couplings have explicit typed presentational treatments; local presentation state and compatible presentation dependencies remain intact.
- [ ] Every node passed Angular template-aware compilation before upward progress, and the complete migrated UI tree compiles cleanly; no node relied on plain `tsc` as its gate.
- [ ] All meaningful deviations and per-node validation evidence are recorded; shared reuse is backed by verified 100% fidelity.
- [ ] State and canonical handoff agree, and no generator or later-stage work occurred.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/component-tree-migration.md` in the exact shared handoff section order and recommend `data` without invoking it. Match handoff status/timestamp to state. A node compile failure is `FAILED`: capture the command/output and do not proceed to any ancestor. Missing source, assets, selector ownership, required child contract, contradictory order, or a cycle is `BLOCKED`: identify the exact missing/contradictory input and never invent behavior. Stop immediately after this stage's DoD.
