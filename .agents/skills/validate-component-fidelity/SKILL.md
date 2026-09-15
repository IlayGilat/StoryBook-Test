---
name: validate-component-fidelity
description: Compare legacy and migrated component visuals, normalized DOM, computed styles, interactions, and theme tokens.
---

# Validate Component Fidelity

## When to use

Use in Fidelity Validation after tests pass and equivalent legacy baseline evidence can be captured read-only.

## Inputs

- Authorized legacy build/URL, migrated Storybook story, controlled dataset/states, and `docs/agents/FIDELITY.md`.
- `.migrations/<component>/parity-report.json` destination.

## Outputs

- Baseline/candidate evidence references and complete `parity-report.json`.
- Critical, Major, Minor, or Accepted deviations with reproducible steps.

## Procedure

1. Lock browser, viewport, scale, fonts, locale, timezone, theme, data, animation policy, and interaction state.
2. Capture legacy evidence without modifying its repository or state.
3. Capture the same migrated states after the harness reports ready.
4. Compare screenshots, normalized DOM, computed styles, behavior, accessibility semantics, and resolved theme tokens.
5. Apply the documented `0.1` per-channel and `0.2%` differing-pixel gates, then visually classify coherent defects even below threshold.
6. Record evidence, expected/actual, severity, and verdict; route Critical/Major findings to targeted Repair.

## Constraints

- Do not widen tolerances, hide unstable regions without evidence, refactor UI, or edit legacy source.
- Automated image results do not override visible or behavioral defects.
- Accepted deviations require a matching decision record.

## Stop conditions

Stop when every required state/dimension has evidence and all deviations are classified, or block when a comparable baseline cannot be obtained.
