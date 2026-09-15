# AGENTS.md

## Repository

StoryBook-Test is an Angular 16.2.12 standalone-component harness for Storybook 8.6 and Playwright performance benchmarking at dataset sizes up to 100,000 items. It uses Less, Zod-validated deterministic data, and single-worker browser benchmarks.

Read `.agents/shared/core-rules.md` before migration work. This file contains only durable repository rules; stage procedures live under `.agents/<stage>/AGENT.md`.

## Commands

- `npm run storybook` starts Storybook at `http://localhost:6006`.
- `npm run build-storybook` builds the static Storybook.
- `npm run test:fast` runs headed Playwright tests against a running Storybook.
- `npm run test:perf` builds Storybook and runs the full headless benchmark suite.
- `npx playwright test src/components/<name>/test/<name>.spec.ts --headed` runs one component suite.
- `npm run generate:component <name>` scaffolds one top-level benchmark target.

## Benchmark Architecture

- A benchmark target owns `src/components/<name>/{ui,data,harness,test}/`.
- UI components are standalone, presentational, `OnPush`, and communicate through explicit `@Input()`/`@Output()` contracts. They have no benchmark or test coupling.
- Harness containers extend `BaseBenchmarkContainerComponent<T>` from `src/benchmark/harness/benchmark-container`; preserve ready/busy attributes, race guards, sizing events, and the double-`requestAnimationFrame` paint cycle.
- Stories target the harness, retain `parameters: { layout: 'fullscreen' }`, and use `window.__storybookPerfTracker.runInteraction(...)` for interactions.
- Playwright remains single-worker. Never edit or commit `.artifacts/`.

## Migration Operating Rules

- The external production/legacy source is strictly read-only. Write only in StoryBook-Test and `.migrations/<component>/`.
- A human invokes one migration stage at a time. Load only `.agents/shared/core-rules.md`, the active `.agents/<stage>/AGENT.md`, and artifacts/source files that stage explicitly requires. Do not preload other stages, workers, historical handoffs, or unrelated docs.
- Delegate only through the existing `.agents/skills/subagent-driven-development/SKILL.md`; do not recreate or bypass it. The active main agent owns integration, state updates, and validation.
- Discover the rendered component tree top-down. Create and adapt it bottom-up in strict post-order, validating each node before its parent.
- Run `npm run generate:component <name>` once per migration, for the top-level benchmark target only. Never run it for child components.
- Preserve DOM, styles, and behavior before refactoring. Record meaningful deviations in `.migrations/<component>/logs/decisions.md`.
- Update state according to `.agents/shared/state-schema.md` and write the stage handoff according to `.agents/shared/handoff-contract.md`.
- Stop immediately when the active stage's Definition of Done is met. Never auto-advance or silently perform work owned by a later stage.
