# Task 6 Report — Fidelity Validation and Repair Agents

## Status

DONE

Implemented Phase 6 only: stage 10 (`fidelity-validation`) and stage 11 (`repair`). No component migration was performed.

## Files Created

- `.agents/fidelity-validation/AGENT.md`
- `.agents/fidelity-validation/workers/original-component-capture.md`
- `.agents/fidelity-validation/workers/storybook-component-capture.md`
- `.agents/fidelity-validation/workers/visual-parity.md`
- `.agents/fidelity-validation/workers/dom-parity.md`
- `.agents/fidelity-validation/workers/behavior-parity.md`
- `.agents/fidelity-validation/workers/theme-parity.md`
- `.agents/repair/AGENT.md`
- `.agents/repair/workers/build-repair.md`
- `.agents/repair/workers/import-repair.md`
- `.agents/repair/workers/ui-repair.md`
- `.agents/repair/workers/styling-repair.md`
- `.agents/repair/workers/data-repair.md`
- `.agents/repair/workers/harness-repair.md`
- `.agents/repair/workers/scenario-repair.md`
- `.agents/repair/workers/fidelity-repair.md`

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
- Findings retain stable IDs, `CRITICAL` / `MAJOR` / `MINOR` / `ACCEPTED` severity, `OPEN` / `RESOLVED` / `ACCEPTED` status, original evidence, and resolution or decisions references.
- Repairs require explicit reports or findings, use the smallest surgical change, prohibit redesign and broad refactoring, rerun the narrow failing check first, and then run the full affected-stage validation.
- Shared state and handoff paths are canonical. Workers do not edit state, shared reports, decisions, or handoffs; the parent owns integration.
- Context is lazy, delegation references only the existing SDD skill, and neither stage auto-advances.

## Validation Commands and Results

1. File inventory and numbered sections:

   ```powershell
   Get-ChildItem .agents\fidelity-validation,.agents\repair -Filter AGENT.md -File
   Get-ChildItem .agents\fidelity-validation\workers,.agents\repair\workers -Filter *.md -File
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
