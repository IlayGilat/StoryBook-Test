# Task 6 Report — Fidelity Validation and Repair Agents

## Status

DONE

Implemented Phase 6 only: stage 10 (`fidelity-validation`) and stage 11 (`repair`). No component migration was performed.

## Files Created

- `.agents/fidelity-validation/AGENT.md`
- `.agents/fidelity-validation/subagents/original-component-capture.md`
- `.agents/fidelity-validation/subagents/storybook-component-capture.md`
- `.agents/fidelity-validation/subagents/visual-parity.md`
- `.agents/fidelity-validation/subagents/dom-parity.md`
- `.agents/fidelity-validation/subagents/behavior-parity.md`
- `.agents/fidelity-validation/subagents/theme-parity.md`
- `.agents/repair/AGENT.md`
- `.agents/repair/subagents/build-repair.md`
- `.agents/repair/subagents/import-repair.md`
- `.agents/repair/subagents/ui-repair.md`
- `.agents/repair/subagents/styling-repair.md`
- `.agents/repair/subagents/data-repair.md`
- `.agents/repair/subagents/harness-repair.md`
- `.agents/repair/subagents/scenario-repair.md`
- `.agents/repair/subagents/fidelity-repair.md`

## Ledger Update

Appended exactly:

```text
Task 5: fix round 1/5 (1 addressed, 0 open; commits 36e66ac..9a42258)
Task 5: complete (commits 89f0621..9a42258, review clean)
```

## Contracts Implemented

- Two main agents share the exact ordered 17-section template.
- Fourteen workers share the exact ordered 9-section template.
- Legacy source is read-only and capture evidence is stored only under the migration validation area.
- Fidelity covers matched capture conditions, screenshot, normalized DOM, computed styles, interactions, and supported themes.
- Playwright image policy is `threshold: 0.1` and `maxDiffPixelRatio: 0.002`, with evidence-backed calibration only and mandatory review of coherent differences even when the numeric gate passes.
- Parity findings retain stable IDs, `CRITICAL` / `MAJOR` / `MINOR` / `ACCEPTED` severity, canonical lowercase `open` / `accepted` / `resolved` status, original evidence, and resolution or decisions references.
- Repairs require explicit reports or findings, use the smallest surgical change, prohibit redesign and broad refactoring, rerun the narrow failing check first, and then run the full affected-stage validation.
- Shared state and handoff paths are canonical. Workers do not edit state, shared reports, decisions, or handoffs; the parent owns integration.
- Context is lazy, delegation references only the existing SDD skill, and neither stage auto-advances.

## Validation Commands and Results

1. File inventory and numbered sections:

   ```powershell
   Get-ChildItem .agents\fidelity-validation,.agents\repair -Filter AGENT.md -File
   Get-ChildItem .agents\fidelity-validation\subagents,.agents\repair\subagents -Filter *.md -File
   Select-String -Path <main> -Pattern '^## (\d+)\. '
   Select-String -Path <worker> -Pattern '^## (\d+)\. '
   ```

   Result: PASS — exactly 2 mains and 14 workers; every main contains sections `1..17`, every worker contains sections `1..9`.

2. Exact template order and contract audit:

   ```powershell
   Select-String -Path <file> -Pattern '^## '
   Select-String -Path .agents\fidelity-validation\AGENT.md,.agents\repair\AGENT.md -Pattern 'parity-report.json|threshold: 0.1|maxDiffPixelRatio: 0.002|stable ID|original failed or affected validation first|full validation owned by the affected stage|Never invoke the next stage'
   ```

   Result: PASS — both main heading lists match the common 17-section template; all worker heading lists match the common 9-section template; fidelity, repair, and stage-boundary terms are present.

3. Markdown whitespace:

   ```powershell
   Get-ChildItem .agents\fidelity-validation,.agents\repair -Recurse -Filter *.md | Select-String -Pattern '[ \t]+$'
   git diff --check
   ```

   Result: PASS — no trailing whitespace or patch whitespace errors. Git emitted only the existing Windows LF-to-CRLF notice for the ledger.

4. Scope guard:

   ```powershell
   git status --porcelain=v1 --untracked-files=all
   git diff --name-only -- src .migrations
   ```

   Result: PASS — the changed-file set is exactly 16 agent files, this report, and the ledger; no files under `src/` or `.migrations/` changed.

## Self-Review

The first strict contract audit found that the repair handoff text said “never invoke that stage” rather than the explicit boundary phrase “never invoke the next stage.” The wording was corrected in `.agents/repair/AGENT.md`, and the complete audit then passed.

Reviewed for overreach: the new files define agent behavior only; they do not migrate a component, generate a benchmark target, alter test policy, accept a deviation, or repair any application code.

## Concerns

None.

## Fix Round 1

Addressed two Important review findings:

1. Standardized parity finding statuses on canonical lowercase `open`, `accepted`, and `resolved`. Uppercase `ACCEPTED` remains only as the defined severity value.
2. Removed the requirement that every non-parity repair arrive with a pre-existing ID. Repair now accepts an exact report entry with diagnostic or command evidence, preserves a parity finding ID when present, and otherwise assigns deterministic `REP-<REPORT-SLUG>-<ENTRY-ORDINAL>` before work. All eight repair workers consume the exact entry and parent-assigned repair reference.

Focused validation command groups:

```powershell
Get-ChildItem .agents\fidelity-validation,.agents\repair -Filter AGENT.md -File
Get-ChildItem .agents\fidelity-validation\subagents,.agents\repair\subagents -Filter *.md -File
Select-String -Path <main> -Pattern '^## (\d+)\. '
Select-String -Path <worker> -Pattern '^## (\d+)\. '
Select-String -Path <phase-files> -Pattern '\bOPEN\b|\bRESOLVED\b' -CaseSensitive
Select-String -Path <phase-files> -Pattern '\bACCEPTED\b' -CaseSensitive
Select-String -Path .agents\repair\AGENT.md -Pattern 'exact report entry|diagnostic or command evidence|REP-<REPORT-SLUG>-<ENTRY-ORDINAL>|canonical lowercase `resolved`'
Select-String -Path .agents\repair\subagents\*.md -Pattern 'exact .*report.*entry|repair reference'
git diff --name-only -- src .migrations
git diff --check
```

Results:

- PASS — exact inventory remains 2 mains and 14 workers.
- PASS — main sections remain exactly `1..17`; worker sections remain exactly `1..9`.
- PASS — statuses are lowercase; uppercase `ACCEPTED` occurs only in severity context.
- PASS — repair accepts exact report entries and diagnostic/command evidence, preserves parity IDs, and deterministically assigns non-parity repair-local IDs.
- PASS — all eight repair workers require an exact report entry and repair reference.
- PASS — canonical state and handoff paths remain present.
- PASS — Markdown fences, final newlines, whitespace, and `git diff --check` are clean.
- PASS — no files under `src/` or `.migrations/` changed.

Self-review note: the first status scan used PowerShell's default case-insensitive matching and falsely matched lowercase `resolved`; the validator was corrected with `-CaseSensitive`, then the complete focused check passed.
