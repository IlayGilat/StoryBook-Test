# Task 7 Final-Verification Fix Report

## Status

PASS

Fixed the final-verification findings without changing application or migration output.

## Ruling

The detailed stage specifications and enumerated prompt names are authoritative and total 71 specialized sub-agent prompt files. Module 12's `53` is treated as an arithmetic/catalog typo. The ruling and its cost-if-wrong are recorded in `progress.md` alongside the preserved uncommitted Task 6 ledger entries.

## Fixes

1. Renamed both legacy Phase 6 prompt directories to the canonical `subagents/` name under their respective stage directories.
2. Preserved all six fidelity-validation and eight repair prompt filenames without content changes.
3. Updated the affected Task 6 report paths and validation examples from `workers` to `subagents`.
4. Replaced the nonexistent external final-review template dependency with the existing local `task-reviewer-prompt.md`. The process diagram, Final Review instructions, and example now consistently describe it as the final whole-branch review template.

## Validation

- Exact inventory: PASS — 11 main stage `AGENT.md` files; 71 stage sub-agent prompts; 13 migration skills plus one `subagent-driven-development` delegation skill; six agent documentation files.
- Stage distribution: PASS — benchmark integration 5, component scaffold 3, component-tree migration 13, data 6, fidelity validation 6, harness 6, migration planning 5, project bootstrap 6, repair 8, source analysis 8, and test 5; total 71.
- Filename preservation: PASS — the expected 6 fidelity-validation and 8 repair filenames are present under `subagents/`; neither former `workers/` directory remains.
- Section-order checks: PASS — both affected main agents retain the exact ordered 17-section schema, and all 14 affected sub-agent prompts retain the exact ordered 9-section schema. No heading correction was required.
- Catalog integrity: PASS — the sub-agent names enumerated in both affected main agents exactly match their directory filenames.
- Link/path integrity: PASS — all nine local Markdown links under `.agents/` and `docs/agents/` resolve; no stale fidelity/repair directory path or obsolete final-review template reference remains in the active Markdown corpus.
- Whitespace: PASS — `git diff --check` completed without errors.
- Scope guard: PASS — `git diff --name-only -- src .migrations` returned no paths.

## Concerns

None. The prompt-count ruling follows the explicit final-verification instruction; if that authority is later reversed, the catalog total and any omitted or extra prompt files will need reconciliation as recorded in the ledger.

## Canonical Template Correction

Final verification found that the two Phase 6 main prompts and their 14 sub-agent prompts had correct section counts but non-canonical heading names. The files were rewritten without changing approved operational behavior.

- Main prompts: PASS — exact Module 02 names and order for all 17 sections, including explicit `Optional Context` and `Do Not Load by Default`.
- Sub-agent prompts: PASS — exact Module 02 names and order for all nine sections.
- Semantics: PASS — lowercase parity statuses, stable parity IDs, deterministic repair-local IDs, calibrated screenshot policy, read-only legacy source, surgical repair scope, and focused-then-stage validation remain present.
- Inventory: PASS — 11 main agents, 71 stage sub-agent prompts, 13 migration skills plus the delegation skill, and six helper documents.
- Whitespace and scope: PASS — `git diff --check` passes; no `src/` or `.migrations/` files changed.
