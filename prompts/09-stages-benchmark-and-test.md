# Prompt Module 09: Stages 08 & 09 — Benchmark Integration & Test Agents

> **Source**: Section 18 (Benchmark Integration, Test) of `codex_storybook_agent_system_prompt_v3.txt`  
> **Stage Directories**: `.agents/benchmark-integration/` and `.agents/test/`

---

## 1. Benchmark Integration Main Agent Specification (`AGENT.md`)

### Purpose
Connects the component harness and Storybook stories to the core benchmark engine under `src/benchmark/`. Integrates global performance tracking (`window.__storybookPerfTracker`), paint-cycle listeners, custom sizing events, and benchmark registry metadata to ensure the component is recognized as a first-class benchmark target.

### When to Invoke
- After Harness Agent has completed (`.migrations/<component>/handoffs/harness.md` exists).
- Triggered by: `Use the Benchmark Integration Agent for <component-name>`.

### Context Management
- **Required Context**:
  - `.agents/shared/core-rules.md`
  - `.agents/benchmark-integration/AGENT.md`
  - `src/benchmark/registry/component-registry.ts`
  - `src/benchmark/browser/perf-tracker.ts`
  - `src/components/<component>/harness/<component>.container.ts`
- **Do Not Load by Default**:
  - UI component implementation details or unrelated test specs.

### Sub-Agents Available (5 Workers)
1. `benchmark-registry-integration`
2. `performance-tracker-integration`
3. `paint-cycle-integration`
4. `sizing-event-integration`
5. `benchmark-configuration-verification`

### Responsibilities
- Register component metadata, default viewport, test scenarios, and scale limits in `component-registry.ts`.
- Ensure container dispatches standard paint cycle events and hooks into `window.__storybookPerfTracker`.
- Verify CustomEvent `storybook-<component>-size` propagates dataset size changes to the runner.
- Validate configuration against benchmark runner expectations.

### Non-Responsibilities
- Authoring Playwright test specs or interaction scenarios.
- Writing component UI logic.

### Definition of Done (DoD)
- [ ] Component is registered in `src/benchmark/registry/component-registry.ts` with valid configuration.
- [ ] Container dispatches ready events and paint cycle timing events cleanly.
- [ ] Sizing events trigger tracker updates without race conditions.
- [ ] Component executes successfully in benchmark registry test harness.
- [ ] Handoff written to `.migrations/<component>/handoffs/benchmark-integration.md`.

---

## 2. Benchmark Integration Sub-Agents

- **`benchmark-registry-integration.md`**: Updates `component-registry.ts` with component descriptor, story IDs, and benchmark parameters.
- **`performance-tracker-integration.md`**: Connects container lifecycle events to `window.__storybookPerfTracker`.
- **`paint-cycle-integration.md`**: Verifies double `requestAnimationFrame` (rAF) timing accuracy and paint completion markers.
- **`sizing-event-integration.md`**: Tests `storybook-<component>-size` event dispatching under dynamic data updates.
- **`benchmark-configuration-verification.md`**: Executes dry-run benchmark validation checks.

---

## 3. Test Main Agent Specification (`AGENT.md`)

### Purpose
Authors and executes Playwright benchmark test specifications and interaction scenarios under `src/components/<component>/test/<component>.spec.ts` and `<component>.scenario.ts`. Automates browser execution, interaction loops (scrolling, selecting, sorting, filtering), FPS tracking, memory profiling, and Chrome DevTools Protocol (CDP) metric capture.

### When to Invoke
- After Benchmark Integration Agent has completed (`.migrations/<component>/handoffs/benchmark-integration.md` exists).
- Triggered by: `Use the Test Agent for <component-name>`.

### Key Testing Architecture & Commands:
- **Fast Run (headed against dev server)**:
  ```bash
  npx playwright test src/components/<component>/test/<component>.spec.ts --headed
  ```
- **Perf Benchmark Run (headless build)**:
  ```bash
  npm run test:fast
  ```
- **Single-Worker Enforcement**: Playwright configuration strictly enforces `workers: 1` to prevent CPU contention during benchmarking.
- **Artifacts Protection**: NEVER edit or commit files under `.artifacts/`.
- **Interaction Delegate**: The scenario delegates browser loops to `window.__storybookPerfTracker.runInteraction(...)`.

### Sub-Agents Available (5 Workers)
1. `playwright-spec`
2. `interaction-scenario`
3. `stress-scenario`
4. `cdp-metrics`
5. `runtime-error`

### Responsibilities
- Implement `<component>.spec.ts` setting up the Playwright browser page, navigating to the Storybook story, waiting for `[data-ready="true"]`, and gathering performance metrics.
- Implement `<component>.scenario.ts` defining user interaction flows (scrolling, clicking, updating data).
- Write stress scenarios testing behavior under 10k and 100k items.
- Capture heap memory, layout counts, and frame rates via CDP.
- Detect, report, and fail on any unhandled browser runtime console errors.

### Non-Responsibilities
- Fixing UI bugs (delegated to Repair Agent).
- Changing benchmark harness core infrastructure.

### Definition of Done (DoD)
- [ ] Playwright test suite passes deterministically (`npx playwright test src/components/<component>/test/<component>.spec.ts`).
- [ ] Interaction scenarios complete without timing out or breaking ready-state contracts.
- [ ] CDP metrics (FPS, DOM node count, JS Heap memory) are collected cleanly into benchmark results.
- [ ] Zero unhandled browser console errors or uncaught exceptions during test execution.
- [ ] Handoff written to `.migrations/<component>/handoffs/test.md`.

---

## 4. Test Sub-Agents

- **`playwright-spec.md`**: Implements test setup, navigation to Storybook story URL, ready assertion, and metric output assertion.
- **`interaction-scenario.md`**: Automates realistic user actions (row click, filter input, column sort, accordion toggle).
- **`stress-scenario.md`**: Automates intense interaction loops (rapid scrolling, high-frequency updates) under large datasets.
- **`cdp-metrics.md`**: Attaches to Chrome DevTools Protocol session to measure JSHeapUsedSize, LayoutDuration, and RecalcStyleDuration.
- **`runtime-error.md`**: Listens to browser `page.on('console')` and `page.on('pageerror')` to fail tests immediately on runtime errors.
