# Performance Benchmarking Guide

This repository measures Angular UI component performance, rendering efficiency, memory footprints, and breaking points under stress using Playwright and Chrome DevTools Protocol (CDP).

---

## 1. Test Architecture & Structure

Each benchmarked component has a 2-file test suite located in `tests/components/<name>/`:

```
tests/components/<name>/
├── <name>.spec.ts                     # Functional UI tests + performance runner
└── utils/
    └── <name>-performance.ts          # PerformanceScenario & interaction script
```

### 1. `utils/<name>-performance.ts` (Scenario Configuration)
Defines the `PerformanceScenario` contract:

```typescript
export const tablePerformanceScenario: PerformanceScenario = {
  storyUrl: '/iframe.html?id=performance-table--stress&viewMode=story',
  readySelector: 'storybook-table-container[data-ready="true"]',
  datasetSizes: [100, 500, 2000, 10000],
  interactionWindowMs: 10000,
  limits: {
    heapLimitMb: 120,
    fpsLimit: 30,
  },
  runInteraction: runTableInteraction,
};
```

#### `runInteraction` Sequence via `runInteraction(...)`
Component interaction functions delegate to `window.__storybookPerfTracker.runInteraction(...)`:

```typescript
async function runTableInteraction(page: Page, datasetSize: number, interactionWindowMs: number): Promise<PerfTrackerSample> {
  return page.evaluate(async ({ datasetSize, interactionWindowMs, filterValues }) => {
    const tracker = window.__storybookPerfTracker;
    if (!tracker) throw new Error('Tracker not found');

    return tracker.runInteraction({
      containerSelector: 'storybook-table-container',
      sizeEventName: 'storybook-table-size',
      datasetSize,
      interactionWindowMs,
      tick: async (actionIndex, waitFrame) => {
        // Pure component interaction clicks / inputs here
      },
    });
  }, { datasetSize, interactionWindowMs, filterValues });
}
```

The harness automatically:
1. Resets `data-ready` on the container.
2. Dispatches `window:storybook-<name>-size`.
3. Awaits `[data-ready="true"]` and double `requestAnimationFrame`.
4. Starts `tracker.start()` (never measuring data generation or initial paint).
5. Runs the interaction loop, awaiting frame paint and sampling peak heap memory until `interactionWindowMs` expires.
6. Stops the tracker and returns the formatted `PerfTrackerSample`.

### 2. `<name>.spec.ts` (Functional & Performance Spec)
Runs functional validation and invokes `runPerformanceTest`:

```typescript
test('performance stress benchmark', async ({ page }) => {
  try {
    await runPerformanceTest(page, tablePerformanceScenario);
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('Breaking point')) {
      console.warn(err.message);
      return;
    }
    throw err;
  }
});
```

---

## 2. Benchmark CLI Commands

| Command | Usage | Description |
|---|---|---|
| `npm run test:fast` | Development | Runs all Playwright tests headed against an already-running Storybook dev server (`http://localhost:6006`). |
| `npx playwright test tests/components/<name>/<name>.spec.ts --headed` | Targeted Fast | Runs a single component test headed against local Storybook. |
| `npm run test:perf` | Full Benchmark | Builds static Storybook into `.artifacts/storybook-static` and runs sequential headless tests. |
| `npm run test:perf:headed` | Full Benchmark Headed | Builds static Storybook and executes tests in headed browser mode. |
| `npm run generate:component <name>` | Scaffolding | Scaffolds a complete 7-file component and benchmark suite. |

---

## 3. Harness Guardrails

- **Single-Worker Execution**: Playwright must execute with `workers: 1` and `fullyParallel: false`. Concurrency corrupts CPU and heap measurements.
- **Ephemeral Artifacts**: Never manually edit or commit files under `.artifacts/` (`storybook-static`, `test-results`).

---

## 4. Troubleshooting Reference

| Issue | Cause | Fix |
|---|---|---|
| `window.__storybookPerfTracker is undefined` | Storybook preview missing tracker | Ensure `.storybook/preview.ts` imports `'../src/testing/perf-tracker'`. |
| Timeout waiting for container readiness | `data-ready="true"` not set | Verify container extends `BaseBenchmarkContainerComponent` and `componentName` matches the event. |
| `EADDRINUSE: port 6006` | Background Storybook server already active | Terminate existing process on port 6006 or run `npm run test:fast` against it. |
| Inconsistent FPS / Heap results across runs | Concurrency or background CPU load | Verify `workers: 1` in Playwright config and close heavy background applications. |
