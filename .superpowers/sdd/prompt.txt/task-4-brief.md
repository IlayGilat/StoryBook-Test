# Task 4: Component Tree Migration core engine

Read first:

- `prompts/07-stage-component-tree-migration.md`
- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`
- `docs/agents/COMPONENT_TREE_MIGRATION.md`
- `docs/agents/COMPONENT_BOUNDARIES.md`

Create `.agents/component-tree-migration/AGENT.md` and exactly 13 specified workers under `subagents/`.

Main file uses exact 17-section template. Every worker uses exact 9-section template. Make prompts operational and context-efficient. Enforce strict post-order queue from `file-plan.json`; leaf before parent; root UI last. Generator is forbidden in this stage. Adapt each node while copying, never bulk-copy raw tree. Verify stable child contracts before parent. Preserve DOM/classes/styles/presentation behavior. Convert data to inputs, application control to outputs/harness actions, environment to controlled values. Keep local presentation state. Reuse shared UI only at verified 100% fidelity. Log meaningful deviations. Compile/type-check after every node; stop upward progress on failure. Parent owns state, integration, decisions, validation, handoff, and delegation via existing SDD skill. Workers have disjoint scopes and never edit shared state concurrently. No actual component migration.

Define exact required/optional/do-not-load contexts, prior artifacts, allowed/forbidden paths, outputs, validation, DoD, blocked behavior, and canonical handoff path. Validate inventory (1 main, 13 workers), 17/9 sections, ordering/invariants, boundary recipes, commands, paths, stage ownership, Markdown, whitespace, and no component changes. Commit only Task 4 files.

Write full report to `.superpowers/sdd/prompt.txt/task-4-report.md`. Return status, commit, one-line validation, concerns. Do not spawn subagents.
