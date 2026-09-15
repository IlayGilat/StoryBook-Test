# Task 5 Implementation Report

## Status

DONE

## Work Completed

- Added four stage main prompts using the exact 17-section template:
  - `.agents/data/AGENT.md`
  - `.agents/harness/AGENT.md`
  - `.agents/benchmark-integration/AGENT.md`
  - `.agents/test/AGENT.md`
- Added all 22 specified worker prompts using the exact 9-section template:
  - Data: 6 workers
  - Harness: 6 workers
  - Benchmark Integration: 5 workers
  - Test: 5 workers
- Defined stage-specific required/optional/default-excluded context, prior artifacts, narrow SDD delegation, parent ownership, allowed/forbidden modifications, outputs, validation, DoD, and failure/handoff behavior.
- Kept ownership boundaries explicit: Data owns models/schemas/factories/datasets; Harness owns container/stories; Benchmark Integration owns registry/tracker/paint/sizing configuration and verification but not stories; Test owns Playwright interactions/scenarios/specs.
- Added concrete requirements for deterministic Zod-validated 1k/10k/100k data, shared base-container lifecycle, tracker-routed story/test interactions, single-worker Playwright, CDP metrics, runtime errors, explicit ready waits, and no fixed sleeps.
- Did not modify any component implementation or perform a migration.

## Validation Performed

- Inventory command over the four stage roots: passed with 4 mains and worker counts `6 + 6 + 5 + 5 = 22`.
- PowerShell section-order parser over all 26 Markdown files: `SECTION_ORDER_OK files=26`.
- Contract keyword audit with `rg`: confirmed data determinism/schema/100k rules, Harness base/ready/busy/double-rAF/tracker rules, Benchmark Integration identity/tracker/paint/sizing rules, and Test single-worker/CDP/runtime/no-fixed-sleep rules.
- Whitespace check: `git diff --check` passed for Task 5 files.
- Scope inspection: only the four new stage trees and this report are included in the Task 5 change set; unrelated dirty worktree changes remain untouched.

## Self-Review

- Main and worker section headings match the established repository templates exactly and in order.
- Every main names the canonical state and handoff contracts and makes integration, validation, state, decisions, and handoff parent-owned.
- Every worker has a narrow write/read-only scope and forbids state/log/handoff edits.
- Each stage recommends, but does not invoke, the next stage and stops at its own DoD.
- Commands align with repository scripts: targeted headed Playwright, `npm run build-storybook`, and `npm run test:perf`.

## Concerns

None.
