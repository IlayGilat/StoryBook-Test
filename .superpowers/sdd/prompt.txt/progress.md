# SDD ledger — plan: prompt.txt

## Pre-flight scan

| Task | Produces / consumes | Consistency |
|---|---|---|
| 1 | Shared contracts consumed by Tasks 2–7 | Consistent; preserve existing repository guardrails while shrinking root AGENTS.md. |
| 2 | Helper docs and reusable skills consumed by stage agents | Consistent; must reference, not duplicate, subagent-driven-development. |
| 3 | Stages 01–04 consume Task 1 contracts and Task 2 docs/skills | Consistent. |
| 4 | Stage 05 consumes analysis and planning artifacts from Task 3 | Consistent; post-order and single-generator invariants bind. |
| 5 | Stages 06–09 consume migrated UI tree from Task 4 | Consistent. |
| 6 | Stages 10–11 consume validation/test artifacts from Task 5 | Consistent. |
| 7 | Verifies all prior outputs against 19-point checklist | Consistent; no production component migration allowed. |

Ruling: Use current dirty worktree on new `codex/migration-agent-system` branch — user changes form repository baseline and cannot be moved safely — cost if wrong: agent-system edits may share a branch with unrelated user changes.

Task 1: fix round 1/5 (5 addressed, 0 open; commits 691f2a0..5442d08)
Task 1: complete (commits 6f1fe7a..5442d08, review clean)
Task 2: fix round 1/5 (6 addressed, 1 open; commits 600e5bb..ca56d99)
Task 2: fix round 2/5 (1 addressed, 0 open; commits ca56d99..af9e366)
Task 2: complete (commits 5442d08..af9e366, review clean)
Ruling: Project Bootstrap uses canonical `.migrations/<component>/handoffs/project-bootstrap.md`, not Module 04's obsolete `.migrations/bootstrap/handoff.md` — shared handoff contract and 11-stage resumability control — cost if wrong: operators expecting one repository-global bootstrap file must adapt.
Ruling: Storybook build verification uses existing `npm run build-storybook`, not Module 04's nonexistent `build:storybook` spelling — package.json is executable authority — cost if wrong: future script rename requires prompt update.
Task 3: fix round 1/5 (1 addressed, 0 open; commits 72e1bb9..9870c5d)
Task 3: complete (commits af9e366..9870c5d, review clean)
Task 4: fix round 1/5 (1 addressed, 0 open; commits 8b27cbb..89f0621)
Task 4: complete (commits 9870c5d..89f0621, review clean)
