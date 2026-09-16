# Angular Component Migration Agents

This directory defines a context-efficient, human-driven system for migrating legacy Angular 16 component trees into StoryBook-Test benchmark targets. It defines the system only; invoking a stage performs migration work.

## Operating Model

A human invokes exactly one main stage at a time. The stage loads its own `AGENT.md`, the shared rules, and only its declared migration artifacts. It may load a worker prompt only when delegating that worker through `.agents/skills/subagent-driven-development/SKILL.md`. After integration and stage-level validation, it updates deterministic state, writes a factual handoff, and stops.

Stages run in this order:

1. `project-bootstrap`
2. `source-analysis`
3. `migration-planning`
4. `component-scaffold`
5. `component-tree-migration`
6. `data`
7. `harness`
8. `benchmark-integration`
9. `test`
10. `fidelity-validation`
11. `repair` when a concrete failure requires it

No stage automatically invokes the next stage. Each is independently resumable from `.migrations/<component>/state.json` and the latest handoff.

## Shared Contracts

- [`shared/core-rules.md`](shared/core-rules.md) contains non-negotiable rules for every stage and worker.
- [`shared/state-schema.md`](shared/state-schema.md) defines the canonical migration state and deterministic update rules.
- [`shared/handoff-contract.md`](shared/handoff-contract.md) defines the concise stage-to-stage handoff.

Each migration owns `.migrations/<component>/`, with `source/`, `analysis/`, `plan/`, `logs/`, `validation/`, and `handoffs/` artifacts created incrementally. Production source remains external and read-only.

## Traversal and Generation

Discover rendered descendants top-down from the requested benchmark root. Create/adapt components bottom-up in strict post-order, stabilizing and validating children before their parents. Adapt application boundaries while each node is created; never bulk-copy an unadapted tree.

Run `npm run generate:component <name>` exactly once, only for the top-level benchmark target. Child nodes belong inside that target's `ui/` tree and are not independent benchmark roots.
