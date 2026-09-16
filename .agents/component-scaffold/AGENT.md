# Component Scaffold Main Agent

## 1. Purpose

Create and verify the repository's standard eleven-file benchmark scaffold for one top-level target by invoking the built-in generator exactly once, without implementing or adapting generated contents.

## 2. When to Invoke

Invoke only after migration planning completed successfully, for a kebab-case top-level component whose scaffold and registry entry do not already exist.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/component-scaffold/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/migration-planning.md`
- `.migrations/<component>/plan/file-plan.json`
- `package.json`
- `scripts/generate-component.mjs` and its directly imported generator modules
- `src/benchmark/registry/component-registry.constants.ts` and `component-registry.ts`

## 4. Optional Context

- Other planning artifacts only when needed to confirm the top-level name or expected target path
- One existing generated component suite only when generator output conventions cannot be verified from the generator itself

## 5. Do Not Load by Default

- Legacy source files or unrelated components
- Other stage `AGENT.md` files, unselected worker prompts, historical handoffs, and later-stage artifacts
- Generated file contents for implementation decisions, raw notes, and `.artifacts/`

## 6. Required Prior Artifacts

- `.migrations/<component>/handoffs/migration-planning.md` with `COMPLETED` status
- Valid `plan/file-plan.json` identifying the same top-level kebab-case component and `src/components/<component>` target

## 7. Sub-Agents Available

- `generator-runner`
- `folder-structure-verifier`
- `benchmark-registry-verifier`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. Dispatch `generator-runner` once after the main agent's read-only preflight. After it returns, use the minimum verification workers needed; read-only verifiers may run concurrently because they have no writes. The main agent owns integration, state, handoff, and final validation. Never let any worker retry the generator.

## 9. Responsibilities

- Validate the top-level name is kebab-case and absent from both target directory and benchmark registry before invocation.
- Invoke `npm run generate:component <component>` exactly once for the top-level benchmark target and capture exit/output.
- Verify all eleven generated files and the registry constant/export path.
- Confirm generated placeholders compile without modifying their contents.

## 10. Non-Responsibilities

- Running the generator for child components or more than once.
- Implementing, adapting, formatting, or repairing generated component, data, harness, story, interaction, scenario, or spec contents.
- Copying legacy UI, creating business data, changing the generator, or invoking Component Tree Migration.

## 11. Execution Flow

1. Validate prior artifacts, exact kebab-case name, generator command, absent target directory, and absent registry member; set stage active in state.
2. Delegate one invocation of `npm run generate:component <component>`; if it fails, do not retry.
3. Verify the exact eleven-file inventory and registry update after generation.
4. Run a compile check without editing generated contents.
5. Update state, write the canonical handoff, and stop.

## 12. Allowed Modifications

- The generator-created files under `src/components/<component>/{ui,data,harness,test}/`
- The generator-managed registration in `src/benchmark/registry/component-registry.constants.ts` (re-exported by `component-registry.ts`)
- `.migrations/<component>/state.json` and `handoffs/component-scaffold.md`

## 13. Forbidden Modifications

- Any external production/legacy source
- `scripts/generate-component.mjs`, its modules/templates, package manifests, or unrelated registry entries
- Any child component as a separate benchmark root
- Manual edits to generated file contents, analysis/plan artifacts, later-stage artifacts, and `.artifacts/`

## 14. Required Outputs

- `data/<component>.data.ts`
- `data/<component>.factory.ts`
- `ui/<component>.component.ts`, `ui/<component>.component.html`, and `ui/<component>.component.less`
- `harness/<component>.container.ts` and `harness/<component>.stories.ts`
- `test/<component>.spec.ts`, `test/<component>.interactions.ts`, `test/<component>.scenario.constants.ts`, and `test/<component>.scenario.ts`
- One `BenchmarkComponent` registration in `component-registry.constants.ts`, available through `component-registry.ts`
- Updated state and `.migrations/<component>/handoffs/component-scaffold.md`

## 15. Validation

- Compare the generated inventory against the exact eleven paths in Section 14; reject extras, omissions, or naming mismatches.
- Inspect `src/benchmark/registry/component-registry.constants.ts` for exactly one generated enum member and confirm `component-registry.ts` re-exports it.
- Run `npx tsc --noEmit` (or the repository's equivalent Angular compile check when configured) and require a zero exit code.
- Verify no other component root, generator source, or generated content was manually modified.

## 16. Definition of Done (DoD)

- [ ] The generator was invoked exactly once, successfully, for the kebab-case top-level target only.
- [ ] All eleven expected files exist under the four standard folders with exact names.
- [ ] Exactly one correct benchmark registry member is exported through the registry module.
- [ ] The untouched generated scaffold passes the compile check.
- [ ] State and canonical component-scaffold handoff agree; no generated content was implemented.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/component-scaffold.md` in the exact shared contract order and recommend `component-tree-migration` without invoking it. Match status/timestamp to state. On failed invocation or validation, mark `FAILED`, capture output, never rerun or manually repair the scaffold, and stop for human-directed recovery. Missing/conflicting prerequisites are `BLOCKED`. Stop immediately once this DoD is met.
