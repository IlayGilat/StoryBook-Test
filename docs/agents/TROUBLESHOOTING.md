# Migration Troubleshooting

Diagnose the smallest failing scope, preserve the original error, apply a targeted repair, and re-run the failed check. Record commands and outcomes in `.migrations/<component>/logs/build-report.md`; meaningful deviations also go in `logs/decisions.md`.

## TypeScript and Less

- Unknown selector/input/output: confirm the child node already passed, its standalone import is present, selector and contract match the source, and no parent was implemented before a descendant.
- Injector/provider failure: classify the token. Preserve presentation providers; replace data/control/environment dependencies at the planned boundary rather than adding app-wide providers.
- Strict type/template error: derive the missing contract from real bindings and source types. Do not use `any`, disable strictness, or invent nullable data.
- Less import/variable failure: verify source-relative asset/token paths, Storybook include paths, casing, and theme variables. Do not inline approximate values before fidelity review.

## Storybook

- Blank or unknown component: ensure the CSF3 story targets the harness container, imports the standalone component, and uses `parameters: { layout: 'fullscreen' }`.
- Missing provider/decorator: add only the presentation provider required by the rendered tree; application services belong behind inputs/outputs or the harness.
- Unhandled rejection or permanent busy state: inspect data generation errors, stale-generation guards, and the container's double-`requestAnimationFrame` completion. Preserve `data-ready`, `aria-busy`, and `data-error` behavior.
- Interaction failure: invoke work through `window.__storybookPerfTracker.runInteraction(...)` and verify the named target is registered before measuring.

## Playwright

- Locator timeout: first check Storybook console/runtime errors and `data-ready`; then prefer semantic or component-scoped locators over longer arbitrary waits.
- Ready-state race: dispatch the dataset-size event, wait for the harness readiness contract, and avoid `waitForTimeout`.
- Inconsistent metrics: keep `fullyParallel: false` and `workers: 1`; close pages and CDP sessions between scenarios and remove unrelated background work.
- Missing behavior: reproduce with the smallest configured dataset before running the full performance matrix.

## 100k-item memory pressure

Run a warm-up and repeated fixed-seed iterations. Capture DOM node count, heap before/after forced GC where supported, listeners, timers, detached nodes, and CDP metrics. Check that size-event listeners are removed in `ngOnDestroy`, obsolete generations are ignored, temporary arrays/references are released, and rendering does not accidentally materialize hidden duplicates. A one-time allocation spike is not a leak; retained growth across stabilized iterations is. Repair the owning node or harness path and repeat the same scenario single-worker.

Do not alter the read-only legacy source, widen image tolerances, delete assertions, disable compiler checks, or perform unrelated cleanup to make a failure disappear.
