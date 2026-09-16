# Task 3: Main stages 01–04

Read first:

- `prompts/04-stage-project-bootstrap.md`
- `prompts/05-stage-source-analysis.md`
- `prompts/06-stages-planning-and-scaffold.md`
- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`

Create four stage trees:

- `.agents/project-bootstrap/AGENT.md` plus 6 specified subagents
- `.agents/source-analysis/AGENT.md` plus 8 specified subagents
- `.agents/migration-planning/AGENT.md` plus 5 specified subagents
- `.agents/component-scaffold/AGENT.md` plus 3 specified subagents

Every main `AGENT.md` must use exact 17-section structure from Module 02. Every worker must use exact 9-section structure. Main agents must define Required Context, Optional Context, and Do Not Load by Default; delegate via existing subagent-driven-development skill; keep parent responsible for integration/state/handoff/final validation; select minimum workers; allow concurrency only for disjoint writes; stop after current DoD.

Apply stage specs exactly. Source Analysis remains read-only and discovers top-down. Planning emits deterministic post-order and full boundary/file plans. Scaffold runs generator exactly once for top-level only and verifies 11 files plus registry without implementing generated contents. No actual migration.

Rulings:

- Project Bootstrap handoff path is `.migrations/<component>/handoffs/project-bootstrap.md`, following canonical shared contract.
- Use existing command `npm run build-storybook`, not nonexistent `npm run build:storybook`.

Keep prompts operational and compact. Each worker states exact inputs/outputs, allowed/forbidden scope, procedure, verification, and structured return. Validate inventory (4 mains, 22 workers), section order, references, paths, commands, stage ownership, invariants, Markdown, whitespace, and no source/component migration. Commit only Task 3 files.

Write full report to `.superpowers/sdd/prompt.txt/task-3-report.md`. Return status, commit, one-line validation, concerns. Do not spawn subagents.
