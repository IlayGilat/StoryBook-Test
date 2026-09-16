# Task 2: Helper documentation and reusable skills

Read first:

- `prompts/11-skills-and-helper-docs.md`
- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`

Create exactly six compact references under `docs/agents/`:

- `WORKFLOW.md`
- `MIGRATION_ARTIFACTS.md`
- `FIDELITY.md`
- `COMPONENT_TREE_MIGRATION.md`
- `COMPONENT_BOUNDARIES.md`
- `TROUBLESHOOTING.md`

Create exactly 13 reusable skill files under `.agents/skills/<name>/SKILL.md`:

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

Each skill must contain: When to use, Inputs, Outputs, Procedure, Constraints, Stop conditions. Make instructions operational, exact, context-efficient, and consistent with shared contracts. Reference existing `.agents/skills/subagent-driven-development/SKILL.md`; never change or duplicate it. Preserve strict read-only legacy source, top-down discovery, post-order implementation, root-only single generator invocation, node validation, deterministic data, benchmark harness contract, single-worker Playwright, fidelity criteria, and targeted repairs. No actual component migration.

Validate exact file inventory, required headings, links/paths, invariant phrases, Markdown, whitespace, and no forbidden source edits. Commit only Task 2 files. Preserve unrelated dirty changes.

Write full report to `.superpowers/sdd/prompt.txt/task-2-report.md`. Return only status, commit, one-line validation summary, concerns. Do not spawn subagents.
