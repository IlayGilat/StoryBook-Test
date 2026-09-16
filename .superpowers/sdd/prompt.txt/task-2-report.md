# Task 2 Implementation Report

## Status

DONE

## Commit

`600e5bb` — `docs: add migration helpers and reusable skills`

## Scope completed

Created the six requested compact references under `docs/agents/`:

- `WORKFLOW.md`
- `MIGRATION_ARTIFACTS.md`
- `FIDELITY.md`
- `COMPONENT_TREE_MIGRATION.md`
- `COMPONENT_BOUNDARIES.md`
- `TROUBLESHOOTING.md`

Created the 13 requested reusable skills under `.agents/skills/<name>/SKILL.md`:

- `inspect-angular-component`
- `build-component-tree`
- `extract-angular-dependencies`
- `classify-smart-dependencies`
- `copy-angular-ui-tree`
- `convert-smart-to-dumb`
- `derive-data-contract`
- `generate-benchmark-data`
- `create-benchmark-harness`
- `create-storybook-story`
- `create-playwright-scenario`
- `validate-component-fidelity`
- `repair-migration`

No component migration was performed. The existing `.agents/skills/subagent-driven-development/SKILL.md` and its support files were not changed.

## Repository conventions incorporated

- Angular 16 standalone presentational components with `OnPush`, explicit `@Input()`/`@Output()` boundaries, and Less.
- Top-down rendered-tree discovery followed by strict post-order child-to-parent implementation and node-level validation.
- `npm run generate:component <component>` exactly once for the top-level benchmark target; no child generator invocations.
- Deterministic, seeded, Zod-validated generation through `src/benchmark/data-generator/` with support through 100,000 items.
- Harnesses extend `BaseBenchmarkContainerComponent<T>` and retain host ready/busy/error attributes, size events, stale-generation guards, change-detection marks, and double-`requestAnimationFrame` readiness.
- CSF3 stories target harness containers, use fullscreen layout, and route measured interactions through `window.__storybookPerfTracker.runInteraction(...)`.
- Playwright remains non-parallel and single-worker and does not edit `.artifacts/`.
- Fidelity covers screenshots, normalized DOM, computed styles, behavior, accessibility-relevant structure, and resolved theme tokens.
- Repair guidance is evidence-driven and surgical; stages stop at their own Definition of Done.

## Shared contract integration

The documentation and skills link their operating rules to:

- `.agents/shared/core-rules.md`
- `.agents/shared/state-schema.md`
- `.agents/shared/handoff-contract.md`
- `.agents/skills/subagent-driven-development/SKILL.md`

The artifact reference preserves deterministic `state.json` ordering/update rules, exact handoff section order, machine-readable planning/analysis artifacts, and concise decision/build logs. Delegation is referenced rather than duplicated.

## Validation performed

- Exact helper inventory: 6 of 6 expected files, with no extra file in `docs/agents/`.
- Exact reusable skill inventory: 13 of 13 expected `SKILL.md` files in the requested directories.
- Required skill schema: every skill contains exactly one each of `When to use`, `Inputs`, `Outputs`, `Procedure`, `Constraints`, and `Stop conditions`.
- Invariant search confirmed coverage of read-only source, top-down discovery, post-order implementation, generator restriction, deterministic data, harness base contract, `workers: 1`, fidelity thresholds, targeted repair, and the existing delegation skill.
- Referenced shared contracts and benchmark implementation paths exist.
- Whitespace audit found no trailing whitespace, tabs, or missing final newlines across all 19 deliverables.
- `git diff --check -- docs/agents .agents/skills` reported no whitespace errors.
- Scope audit confirmed the task created only the requested docs/skill paths; unrelated pre-existing dirty changes were left untouched.

## Assumptions and decisions

- Automated visual triage gates are documented as a `0.1` per-channel tolerance and `0.2%` differing-pixel threshold because the specification requires concrete thresholds but the inspected repository does not define existing values. Coherent visual/behavioral defects still require human classification even below the numerical gate.
- Artifact JSON shapes are documented as compact durable interfaces consistent with the shared state and handoff contracts; they intentionally avoid scratch reasoning and implementation-specific bulk data.

## Concerns

- The repository had extensive unrelated dirty and untracked changes before Task 2, including deletion of the old `convert-component` skill. Those changes were preserved and excluded from the Task 2 commit.
- Stage-agent directories were not present at implementation time, so stage names and invocation language follow the canonical prompt modules and shared state schema rather than linking to not-yet-created files.

## Fix round 1

### Status

DONE

### Commit

`ca56d99` — `docs: align migration helpers with canonical contracts`

### Reviewer findings addressed

1. Restored the canonical `.migrations/<component>/` partitioning throughout the documentation and dependent skills:
   - `source/source-files.json`
   - `analysis/component-tree.json`, `analysis/dependencies.json`, `analysis/smart-dependencies.json`, `analysis/summary.md`
   - `plan/migration-plan.md`, `plan/dumb-boundary.json`, `plan/data-contract.json`, `plan/file-plan.json`
   - `logs/copied-files.json`, `logs/decisions.md`
   - `validation/build-report.md`, `validation/parity-report.json`, `validation/fidelity-summary.md`
   - `handoffs/<stage-name>.md`
2. Assigned CSF3 story creation and variants to Harness in `WORKFLOW.md` and `create-storybook-story`; Benchmark Integration now owns registry, performance-tracker, paint-cycle, sizing-event, and benchmark-configuration verification only.
3. Replaced the ambiguous pixel policy with exact Playwright screenshot options: `threshold: 0.1` and `maxDiffPixelRatio: 0.002`. The docs define threshold as Playwright's normalized perceived-color comparator metric, preserve comparator alpha/antialiasing behavior, and label the values as initial repository policy requiring approved-baseline calibration rather than universal truth.
4. Expanded every canonical artifact format with required interoperable fields. Component-tree nodes now require depth and typed `static|conditional|dynamic` child edges with condition/evidence. Parity findings now require stable ID, dimension, severity, evidence, expected/actual, `open|accepted|resolved` status, and resolution reference.
5. Removed the arbitrary three-attempt repair blocker. Repair blocks only for missing evidence/prerequisites or inability to identify a safe targeted repair.
6. Added explicit dual-mode routing to `copy-angular-ui-tree`: Planning records file operations only; actual copying remains Component Tree Migration work.

### Validation

- Exact inventory remains 6 helper documents and 13 reusable migration skills.
- All 13 skills retain the six required headings and valid name-matching two-field YAML frontmatter.
- All 15 canonical workspace artifact paths are present in `MIGRATION_ARTIFACTS.md`; searches found no deprecated flat `.migrations/<component>/<artifact>` paths or `logs/build-report.md` references.
- Schema assertions confirmed component-tree depth/conditional/dynamic edges and parity resolution/status fields.
- Ownership search confirmed Harness owns CSF3 story creation and Benchmark Integration owns only its five integration/verification areas.
- Fidelity search confirmed exact `threshold: 0.1` and `maxDiffPixelRatio: 0.002` semantics, comparator alpha/antialiasing handling, and calibration language.
- Repair and copy-mode assertions confirmed the reviewer-requested stop and Planning boundaries.
- All 19 Task 2 deliverables have final newlines and no tabs or trailing whitespace; `git diff --check` passed.
- The bundled `quick_validate.py` was attempted with both default and bundled Python runtimes but could not import its undeclared `yaml` dependency. Equivalent frontmatter, naming, description, TODO-placeholder, and heading checks were run directly and passed for all 13 skills.

### Scope

Only the Task 2 documentation and skill files changed in this fix. Pre-existing unrelated working-tree changes remain untouched and will be excluded from the fix commit.

### Concerns

- `quick_validate.py` cannot run in the available Python environments because PyYAML is absent; no dependency installation was attempted.

## Fix round 2

### Status

DONE

### Commit

`af9e366` — `docs: restore tracked story interactions`

### Finding addressed

Restored the measured Storybook interaction contract without moving story ownership out of Harness:

- `create-storybook-story` now requires every measured CSF3 `play` interaction to call `window.__storybookPerfTracker.runInteraction(...)`.
- Unmeasured setup may remain outside the tracker wrapper.
- Harness owns story creation and measured `play` definitions.
- Benchmark Integration owns tracker wiring/registration plus registry, paint-cycle, sizing-event, and benchmark-configuration verification.
- Test consumes the registered tracked interactions.
- `WORKFLOW.md` reflects the same three-stage ownership split.

### Files tested

- `.agents/skills/create-storybook-story/SKILL.md`
- `docs/agents/WORKFLOW.md`

### Commands and results

- `Select-String -Path .agents/skills/create-storybook-story/SKILL.md -Pattern '^## (When to use|Inputs|Outputs|Procedure|Constraints|Stop conditions)$'`: PASS, exactly 6 required headings.
- PowerShell frontmatter/name/description assertion for `create-storybook-story`: PASS.
- PowerShell ownership assertions for Harness, Benchmark Integration, and Test: PASS.
- PowerShell exact tracker assertion for `window.__storybookPerfTracker.runInteraction(...)`: PASS.
- `rg -n "Harness Agent|Benchmark Integration|Test Agent|__storybookPerfTracker\\.runInteraction" .agents/skills/create-storybook-story/SKILL.md docs/agents/WORKFLOW.md`: PASS, all required ownership/contract lines present.
- `rg` deprecated flat migration-path check on both files: PASS, no matches.
- Final-newline, tab, and trailing-whitespace checks on both files: PASS.
- `git diff --check -- .agents/skills/create-storybook-story/SKILL.md docs/agents/WORKFLOW.md`: PASS.
- Scoped diff inventory: PASS, exactly the two files above changed for fix round 2.

### Concerns

None.
