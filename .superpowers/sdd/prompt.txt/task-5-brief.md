# Task 5: Main stages 06–09

Read first:

- `prompts/08-stages-data-and-harness.md`
- `prompts/09-stages-benchmark-and-test.md`
- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`
- Relevant existing references in `src/benchmark/` and generated component patterns only as needed.

Create four stage trees:

- `.agents/data/AGENT.md` plus 6 specified subagents
- `.agents/harness/AGENT.md` plus 6 specified subagents
- `.agents/benchmark-integration/AGENT.md` plus 5 specified subagents
- `.agents/test/AGENT.md` plus 5 specified subagents

Every main uses exact 17-section template. Every worker uses exact 9-section template. Define Required Context, Optional Context, Do Not Load by Default, prior artifacts, narrow delegation through existing SDD skill, parent-owned integration/state/handoff/validation, allowed/forbidden modifications, outputs, concrete validation, DoD, and failure behavior.

Data: TypeScript models, Zod schemas, deterministic factories/default/edge/stress datasets including 100,000 items; validate all data. Harness: extend `BaseBenchmarkContainerComponent<T>`, wire root dumb UI, controlled state/actions, ready/busy attributes, sizing event, double requestAnimationFrame, and Harness-owned CSF3 stories with measured `play` interactions routed through `window.__storybookPerfTracker.runInteraction(...)`. Benchmark Integration: registry/tracker/paint/sizing configuration and verification, not story creation. Test: single-worker Playwright spec/scenarios, stress levels, CDP metrics, runtime/page errors, no fixed sleeps, clear ready-state waits, reusable tracker interactions. Preserve stage boundaries. No actual component migration.

Keep prompts operational and compact. Validate exact inventory (4 mains, 22 workers), 17/9 section order, artifact paths, ownership, data determinism/schema checks, harness lifecycle, tracker wiring, Playwright/CDP/runtime rules, commands, Markdown, whitespace, and no component changes. Commit only Task 5 files.

Write report to `.superpowers/sdd/prompt.txt/task-5-report.md`. Return status, commit, one-line validation, concerns. Do not spawn subagents.
