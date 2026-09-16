# Task 1: Foundations, shared contracts, architecture

Read these requirements first:

- `prompt.txt`
- `prompts/00-overview-and-operating-model.md`
- `prompts/01-system-architecture-and-file-tree.md`
- `prompts/02-contracts-state-and-templates.md`
- `prompts/03-migration-invariants-and-principles.md`

Create or update only:

- `AGENTS.md`
- `.agents/README.md`
- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`

Requirements:

- Root `AGENTS.md` stays 500–1,500 tokens and contains only durable global rules plus repository overview/commands needed by agents.
- Preserve relevant current project guardrails.
- Reference `.agents/skills/subagent-driven-development/SKILL.md`; never recreate it.
- Encode production-source read-only, lazy stage loading, single-stage stop, top-down discovery, bottom-up post-order creation, top-level-only generator, handoff contract, and deterministic state schema.
- Do not migrate any component.
- Validate paths, Markdown structure, JSON Schema validity, and root token estimate.
- Commit only task files. Do not stage unrelated existing changes.

Write full report to `.superpowers/sdd/prompt.txt/task-1-report.md`. Report files changed, validation commands/results, commit hash, self-review, and concerns. Return only status, commit, one-line validation summary, concerns. Do not spawn subagents.
