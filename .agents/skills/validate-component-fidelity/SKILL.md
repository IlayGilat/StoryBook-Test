---
name: validate-component-fidelity
description: Compare legacy and migrated component visuals, normalized DOM, computed styles, interactions, and theme tokens.
---

# Validate Component Fidelity

## When to use

Use in Fidelity Validation after tests pass and equivalent legacy baseline evidence can be captured read-only.

## Inputs

- Authorized legacy build/URL, migrated Storybook story, controlled dataset/states, and `docs/agents/FIDELITY.md`.
- `.migrations/<component>/validation/parity-report.json` and `validation/fidelity-summary.md` destinations.

## Outputs

- Baseline/candidate evidence references, complete `validation/parity-report.json`, and `validation/fidelity-summary.md`.
- Critical, Major, Minor, or Accepted deviations with reproducible steps.

## Procedure

1. Lock browser, viewport, scale, fonts, locale, timezone, theme, data, animation policy, and interaction state.
2. Capture legacy evidence without modifying its repository or state.
3. Capture the same migrated states after the harness reports ready.
4. Compare screenshots, normalized DOM, computed styles, behavior, accessibility semantics, and resolved theme tokens.
5. Use Playwright screenshot semantics with `threshold: 0.1` and `maxDiffPixelRatio: 0.002`; rely on its perceived-color comparator for alpha/antialiasing and do not reinterpret `threshold` as a raw channel delta.
6. Record each finding with stable ID, dimension, severity, evidence, expected/actual, `open|accepted|resolved` status, and resolution reference; route open Critical/Major findings to targeted Repair.

## Constraints

- Treat the values as initial repository policy requiring approved-baseline calibration, not universal truth; do not widen them ad hoc, hide unstable regions without evidence, refactor UI, or edit legacy source.
- Automated image results do not override visible or behavioral defects.
- Accepted deviations require a matching decision record.

## Stop conditions

Stop when every required state/dimension has evidence and all deviations are classified, or block when a comparable baseline cannot be obtained.
