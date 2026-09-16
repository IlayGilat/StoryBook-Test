# Shared Core Rules

These rules bind every migration stage and worker.

1. **Production source is read-only.** Never edit the external legacy application repository or any of its source files.
2. **Fidelity precedes refactoring.** Preserve visual appearance, DOM structure, class names, styles, and rendering behavior before architectural cleanup.
3. **Repository standards are law.** Follow the established Angular 16 standalone, `OnPush`, Less, Storybook 8, Zod, and Playwright patterns in `src/benchmark/` and `src/components/`.
4. **Delegation is standardized.** Delegate only through `.agents/skills/subagent-driven-development/SKILL.md`. The main agent coordinates disjoint write scopes, integrates results, updates shared state, and performs final stage validation.
5. **Context loads lazily.** Load only the active stage's `AGENT.md`, its required artifacts, and source files needed for the current work. Load a worker prompt only when invoking that worker; never load all stages.
6. **Global context stays small.** Do not load unreferenced worker instructions, unrelated documentation, raw notes, historical conversations, or old handoffs by default.
7. **Deviations are explicit.** Record every meaningful architectural or behavioral alteration in `.migrations/<component>/logs/decisions.md`, including the change, reason, fidelity impact, and `Temporary` or `Accepted` status.
8. **Validation is incremental.** Compile, test, or otherwise verify the current stage and, during tree migration, each adapted node before declaring completion.
9. **Definition of Done is strict.** Stop immediately after the active stage's DoD is satisfied and its state and handoff are complete.
10. **Stages do not bleed.** Never auto-advance or silently perform work owned by a subsequent stage.

## Migration Invariants

- Discover the rendered tree top-down from the benchmark root; create and adapt nodes bottom-up in strict post-order. Never bulk-copy a raw tree for later conversion.
- Run `npm run generate:component <name>` exactly once per migration and only for the top-level benchmark target. Never generate child components separately.
- Classify source dependencies as presentation, data, application control, or environment dependencies. Preserve presentation dependencies; convert data to inputs, control effects to outputs or harness actions, and environment state to controlled values.
- Preserve nested smart components when their application dependencies can be satisfied internally; do not flatten them or expose unnecessary child contracts as public benchmark inputs.
- Reuse an existing migrated shared component only when it preserves visual and behavioral fidelity completely; otherwise copy and adapt the required source variant.
- Concurrent workers may write only to completely disjoint scopes. Never allow simultaneous edits to the same file or `state.json`; the main agent coordinates and integrates all writes.
- If required source material is missing, record the missing input, mark the stage blocked, and stop without inventing behavior or data structures.
