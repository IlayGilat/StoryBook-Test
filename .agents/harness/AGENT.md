# Harness Main Agent

## 1. Purpose

Implement the smart benchmark container and Harness-owned Storybook 8 CSF3 stories around the migrated dumb UI, preserving the shared readiness, race, sizing, paint, and measured-interaction contracts.

## 2. When to Invoke

Invoke only after Data completed for the same component and its validated data APIs and UI presentation contracts compile.

## 3. Required Context

- `.agents/shared/core-rules.md`
- `.agents/shared/handoff-contract.md`
- `.agents/shared/state-schema.md`
- `.agents/skills/subagent-driven-development/SKILL.md`
- `.agents/harness/AGENT.md`
- `.migrations/<component>/state.json`
- `.migrations/<component>/handoffs/data.md`
- `.migrations/<component>/plan/dumb-boundary.json`
- `src/components/<component>/data/<component>.{data,factory}.ts`
- Root UI component TypeScript/template and generated `harness/<component>.{container,stories}.ts`
- `src/benchmark/harness/benchmark-container.ts` and registry identity APIs

## 4. Optional Context

- Directly imported benchmark harness/tracker types and utilities
- One existing component container/story pair for established CSF3 and interaction conventions

## 5. Do Not Load by Default

- Legacy implementation, unrelated UI descendants, other stage agents, unselected workers, historical handoffs, Playwright specs, fidelity/repair, or `.artifacts/`
- Benchmark-core files not directly consumed by the container or story

## 6. Required Prior Artifacts

- A `COMPLETED` `.migrations/<component>/handoffs/data.md`
- Validated component schemas/factories, compiling dumb root UI, and `plan/dumb-boundary.json` defining all inputs, outputs, and controlled values
- Existing benchmark registry identity for `<component>` from the scaffold stage

## 7. Sub-Agents Available

- `benchmark-container`
- `component-wiring`
- `input-state`
- `interaction-state`
- `ready-state-integration`
- `storybook-story`

## 8. Subagent Delegation Workflow

Use only `.agents/skills/subagent-driven-development/SKILL.md`. The main agent assigns exact, non-overlapping edits; because most workers touch the same container, run them sequentially or make later workers read-only verifiers. Integrate container behavior before delegating story work. The main agent alone owns state, decisions, validation, handoff, and the final lifecycle verification.

## 9. Responsibilities

- Extend `BaseBenchmarkContainerComponent<T>` and implement its component identity, async dataset generation, and data-assignment hooks without duplicating base lifecycle logic.
- Render the root dumb UI and wire every typed input/output/controlled value; keep UI benchmark-unaware.
- Own deterministic input state and action handlers in the container, including reset behavior between dataset generations.
- Preserve base race guards, `[attr.data-ready]`, `[attr.aria-busy]`, generation errors, component size-event listening, and double-`requestAnimationFrame` completion.
- Author CSF3 stories targeting the container with `parameters: { layout: 'fullscreen' }`, representative default/edge/medium/10k/100k variants, and measured `play` interactions routed through `window.__storybookPerfTracker.runInteraction(...)`.

## 10. Non-Responsibilities

- Modifying presentational UI or component data contracts/factories except returning to the owning stage after a proven defect.
- Changing benchmark core/registry behavior, writing Playwright scenarios/specs, performing fidelity validation, or advancing to Benchmark Integration.

## 11. Execution Flow

1. Verify prerequisites/contracts and mark `harness` active in state.
2. Implement the base-derived container, typed data generation/assignment, and root UI bindings.
3. Implement controlled state/actions and verify regeneration resets and stale-generation protection.
4. Verify ready/busy/error attributes, size event, and double-rAF paint lifecycle through the inherited base contract.
5. Author CSF3 variants and tracker-routed measured `play` interactions; render each required story.
6. Compile, run targeted Storybook/runtime checks, inspect scope, update state/evidence, write handoff, and stop.

## 12. Allowed Modifications

- `src/components/<component>/harness/<component>.container.ts`
- `src/components/<component>/harness/<component>.stories.ts`
- `.migrations/<component>/logs/decisions.md`, `validation/harness-report.md`, `state.json`, and `handoffs/harness.md`

## 13. Forbidden Modifications

- Legacy source; component UI/data/test files; `src/benchmark/`; generator/config/package/unrelated files; `.artifacts/`; later-stage artifacts
- Reimplemented race/readiness/paint infrastructure, fixed sleeps, direct performance measurements outside the tracker, stories targeting dumb UI, or benchmark/test coupling inside UI
- Concurrent worker writes to the same file or worker edits to shared state/log/handoff

## 14. Required Outputs

- A compiling `<component>.container.ts` extending `BaseBenchmarkContainerComponent<T>` with complete UI/data/action wiring
- Harness-owned `<component>.stories.ts` using CSF3, fullscreen layout, required dataset variants, and tracker-routed measured `play` interactions
- Evidence for size-event regeneration, stale-result rejection, busy/ready/error transitions, double-rAF completion, and clean Storybook rendering
- `.migrations/<component>/validation/harness-report.md`, updated state, and `.migrations/<component>/handoffs/harness.md`

## 15. Validation

- Run `npx tsc --noEmit` or the repository compile command and `npm run build-storybook`; require zero exits.
- Render default, edge, medium, 10k, and 100k stories; require no browser console/page errors and `data-ready="true"` only after generation and the base double-rAF cycle, with `aria-busy="true"` while not ready.
- Dispatch `storybook-<component>-size` with at least two rapidly changing sizes; verify the last request wins, stale data never renders ready, exact data size reaches UI, and errors do not report ready.
- Execute each measured story `play`; verify it awaits readiness, calls `window.__storybookPerfTracker.runInteraction(...)`, performs representative actions, and restores controlled state where needed.
- Inspect the diff for allowed ownership and confirm UI remains benchmark-unaware.

## 16. Definition of Done (DoD)

- [ ] Container extends the shared generic base and fully wires validated data, root UI inputs/outputs, and controlled state/actions.
- [ ] Shared race, sizing, error, ready/busy, and double-rAF contracts pass without duplicated or bypassed infrastructure.
- [ ] Harness-owned CSF3 stories target the container, use fullscreen layout, cover required scales through 100k, and route measured plays through the tracker.
- [ ] Storybook builds/renders cleanly with no runtime errors and the dumb UI contains no benchmark/test coupling.
- [ ] State, validation evidence, and canonical handoff agree; no Benchmark Integration or Test work occurred.

## 17. Handoff & Failure Behavior

Write `.migrations/<component>/handoffs/harness.md` in the exact shared order and recommend `benchmark-integration` without invoking it. Match state and handoff status/timestamp. Missing UI/data/boundary/registry contracts are `BLOCKED`; do not guess selectors or actions. Compile, Storybook, lifecycle, race, tracker-play, or runtime failures are `FAILED`; preserve evidence and stop. Stop immediately after this DoD.
