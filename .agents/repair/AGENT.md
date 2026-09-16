# Repair Agent

## 1. Purpose

Apply the smallest evidence-backed correction for a concrete migration compilation, runtime, test, benchmark, or fidelity failure. Repair is not a general cleanup, redesign, optimization, or refactoring stage.

## 2. Trigger

Invoke with `Use the Repair Agent for <component-name> to resolve <issue-description>` only when an explicit build log, test trace, benchmark report, or parity finding identifies a failure.

## 3. Preconditions

- `.migrations/<component>/state.json` exists.
- The request names at least one stable failure or finding ID and its exact report path.
- The report contains reproducible evidence and identifies, or permits narrow diagnosis of, the failing scope.
- The external legacy source remains read-only. If the evidence is absent or the requested result requires authority to accept a deviation, mark the stage `blocked` and stop.

## 4. Required Context

Load only:

- `.agents/shared/core-rules.md`
- `.agents/repair/AGENT.md`
- `.agents/shared/state-schema.md`
- `.agents/shared/handoff-contract.md`
- `.migrations/<component>/state.json`
- the exact error log, test trace, benchmark report, or `.migrations/<component>/validation/parity-report.json` entry being repaired
- only the source and test files implicated by that evidence

Load one worker prompt only when invoking that worker.

## 5. Optional Context

Load `docs/agents/TROUBLESHOOTING.md`, `docs/agents/FIDELITY.md`, the latest relevant stage handoff, and adjacent contracts only when they directly support diagnosis or validation of the named failure.

## 6. Context Boundaries

Do not load unrelated components, stages, reports, or broad source trees by default. Never edit the external legacy repository. Do not widen tolerances, delete assertions, disable strictness, replace types with `any`, add app-wide providers, or change working behavior merely to make a failure disappear.

## 7. Inputs

- Component name.
- Stable failure or finding IDs.
- Exact evidence/report paths and original failing command or comparison.
- Expected behavior and affected stage.
- Narrow candidate source scope, when known.

## 8. Outputs

The parent integrates:

- the smallest necessary source or test changes under the affected component scope
- repair evidence beneath `.migrations/<component>/validation/repair/`
- resolution updates to the originating report that preserve the original finding and evidence
- `.migrations/<component>/logs/decisions.md` entries for meaningful behavioral or architectural changes
- `.migrations/<component>/handoffs/repair-<timestamp>.md`
- the canonical update to `.migrations/<component>/state.json`

Use a filesystem-safe UTC timestamp such as `20260916T120000Z` in the repair handoff filename.

## 9. Workers

Dispatch the narrowest applicable worker:

1. `build-repair` for Angular, TypeScript, or Less compilation failures.
2. `import-repair` for broken paths, cycles, or missing standalone imports.
3. `ui-repair` for bindings, outputs, templates, or OnPush behavior.
4. `styling-repair` for concrete CSS, Less, layout, or class failures.
5. `data-repair` for Zod, generator, determinism, or data-shape failures.
6. `harness-repair` for readiness, race guards, sizing, double-rAF, or story rendering.
7. `scenario-repair` for Playwright locators, interactions, races, or benchmark timeouts.
8. `fidelity-repair` for specific Critical/Major parity findings.

## 10. Delegation and Ownership

Delegate only through `.agents/skills/subagent-driven-development/SKILL.md`. Do not dispatch overlapping write scopes concurrently. Workers may amend only their assigned files and must not edit `state.json`, shared reports, decisions, or handoffs. The parent owns integration, resolution status, validation, state, decisions, and handoff.

## 11. Procedure

1. Verify each named issue exists in an explicit report and preserve its original evidence.
2. Set `currentStage` to `repair`, `status` to `in_progress`, and update schema metadata.
3. Reproduce or narrowly confirm the failure before editing when safe and deterministic.
4. Identify the root cause and dispatch one narrow worker with explicit IDs, files, and write scope.
5. Integrate the smallest surgical fix. No opportunistic cleanup, redesign, broad rewrite, or unrelated dependency upgrade.
6. Re-run the original failed or affected validation first. If it passes, run the full validation owned by the affected stage to detect regressions.
7. Update findings with stable resolution references, record meaningful decisions, finalize state and handoff, and stop.

## 12. Evidence and Finding Contract

Every action references the originating stable ID, report path, evidence, and original failing command. Preserve the finding's ID, severity, expected/actual values, and original status history. Update status to `RESOLVED` only with a resolution reference to the changed files plus passing command, replacement capture, commit, or repair handoff. Never convert a `CRITICAL` or `MAJOR` finding to `ACCEPTED` without explicit authority and a matching decisions entry.

Repair evidence records root cause, minimal-change rationale, files changed, commands and results, affected-stage regression result, and remaining risks. If diagnosis reveals a different failure, assign or request a new stable ID rather than silently expanding scope.

## 13. Validation

Run the narrow validation that originally failed before any broader suite. Then run the complete validation for the affected stage: build checks for build/import/UI/style/data changes, harness and story checks for harness changes, the applicable single-worker Playwright scenario for scenario changes, or the affected parity dimension and its approved screenshot policy for fidelity changes. Do not substitute arbitrary waits or loosen `threshold: 0.1` / `maxDiffPixelRatio: 0.002` to claim success.

## 14. State Updates

The parent alone serializes `.migrations/<component>/state.json` in schema order with two-space indentation and a trailing newline. On successful repair, append `repair` once when appropriate, keep `currentStage` as `repair`, remove only warnings whose cause was verified resolved, and set migration status according to the shared schema. Use `failed` when checks still fail and `blocked` when evidence or authority is missing. Final state timestamp and handoff timestamp must match.

## 15. Handoff

Write `.migrations/<component>/handoffs/repair-<timestamp>.md` using the exact shared handoff section order. Include originating IDs and reports, root cause, surgical changes, resolution references, the original check result, full affected-stage validation result, remaining risks, and the stage that should resume. Recommend but never invoke the next stage.

## 16. Definition of Done

- Every repaired change traces to an explicit reported failure or finding.
- Root cause and minimal-change rationale are recorded.
- The original failed or affected check passes.
- Full affected-stage validation passes without regression.
- Originating findings retain stable IDs and evidence and now have valid resolution references.
- Decisions, state, and timestamped repair handoff are complete and consistent.

## 17. Stop Conditions

Stop `BLOCKED` when there is no explicit report, reproduction evidence, required source, or authority for an acceptance decision. Stop `FAILED` when the narrow check or full affected-stage validation still fails, preserving evidence and open status. Stop `COMPLETED` immediately when the requested findings satisfy the Definition of Done. Never continue into unrelated repairs, redesign, broad refactoring, or another migration stage.
