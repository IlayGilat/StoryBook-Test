# Fidelity Validation

Fidelity means the migrated story preserves the legacy component's visible result, normalized DOM, computed presentation, interactions, and theme behavior for equivalent controlled data.

## Evidence dimensions

1. Capture screenshots at the same viewport, device scale, theme, fonts, dataset, scroll position, animation state, and interaction state.
2. Compare normalized DOM after removing volatile framework attributes, generated IDs, comments, and explicitly documented nondeterminism. Preserve semantic elements, order, classes, ARIA, text, and stable attributes.
3. Compare computed styles for layout, geometry, typography, colors, borders, overflow, visibility, and stacking. Record values and selectors, not impressions.
4. Replay behavioral interactions: render/readiness, selection, sorting, filtering, expansion, pagination, scrolling, keyboard use, emitted events, loading, empty, and error states as applicable.
5. Map theme tokens and CSS variables. Compare resolved values in every supported theme; do not replace source tokens with approximate literals without a recorded decision.

## Severity

- **Critical**: missing/broken primary behavior, crash, inaccessible core control, unusable layout, or invalid benchmark readiness/data behavior. Must repair.
- **Major**: obvious structural, geometry, typography, color, state, or interaction mismatch that changes user experience. Must repair or explicitly accept with authority.
- **Minor**: small non-functional pixel/style variance with localized impact. Record and triage.
- **Accepted**: a measured deviation approved and documented in `logs/decisions.md`; retain evidence and rationale.

## Image policy

Use Playwright screenshot assertions with `threshold: 0.1` and `maxDiffPixelRatio: 0.002`. In Playwright, `threshold` is the comparator's normalized perceived-color difference limit in the `0` to `1` range; it is not a raw per-channel delta. `maxDiffPixelRatio` permits at most `0.2%` of image pixels to differ. Keep Playwright's comparator behavior for alpha blending and antialiasing; do not pre-strip alpha, mask ordinary edge pixels, or apply a second custom channel metric.

These values are the initial repository policy and must be calibrated against approved stable baselines; they are not universal fidelity truth. Calibration requires recorded evidence and an explicit policy change, never an ad hoc per-test relaxation. Treat the assertion as a triage gate: any coherent visible region, text shift, missing element, or interaction-state mismatch is reviewed and severity-classified even when the pixel ratio passes.

```ts
await expect(page).toHaveScreenshot({
  threshold: 0.1,
  maxDiffPixelRatio: 0.002,
});
```

## Legacy baseline capture

1. Confirm the authorized legacy URL/build and never modify its repository, data, or configuration.
2. Record commit/build identity, route, viewport, device scale, browser, theme, locale, timezone, fonts, dataset fixture, and steps.
3. Wait for application readiness and stable fonts/images; disable animations only when the same rule is applied to both sides.
4. Capture full and component-bounded screenshots plus DOM/style/interaction evidence for each required state.
5. Store evidence outside the legacy source and reference it from `.migrations/<component>/validation/parity-report.json`.
6. Repeat the identical protocol against Storybook and classify every material deviation.

Never refactor merely to improve a diff. Repair the smallest fidelity gap and re-run only the affected comparison plus required regression checks.
