# Visual Parity Worker

## 1. Purpose

Compare matched legacy and Storybook screenshots and report measured visual differences for parent classification.

## 2. Invocation

The Fidelity Validation parent invokes this worker only for state pairs with complete capture metadata. Do not spawn subagents or modify UI code.

## 3. Required Context

Load this prompt, matched image paths, both manifests, and the approved screenshot policy. Load no unrelated source or stage artifacts.

## 4. Inputs

Receive component name, stable state IDs, full-page and bounded screenshot pairs, dimensions, masks explicitly approved for true nondeterminism, and any existing finding IDs for revalidation.

## 5. Write Scope

Write only beneath `.migrations/<component>/validation/fidelity/visual/`. Do not overwrite source captures or edit reports, decisions, `state.json`, or handoffs.

## 6. Procedure

Confirm identical capture conditions; run Playwright-compatible comparison with `threshold: 0.1` and `maxDiffPixelRatio: 0.002`; retain diff images and metrics; inspect coherent regions including text, missing elements, layout, and interaction states even when the numeric gate passes.

## 7. Evidence and Findings

Return candidate records keyed by stable state and region with expected/actual description, pixel metrics, bounding region, and baseline/current/diff paths. Preserve supplied finding IDs. Do not treat a passing ratio as proof of no visible deviation.

## 8. Validation and Escalation

Verify dimensions and protocol match. Never pre-strip alpha, mask normal antialiasing/edges, add a custom channel metric, or relax policy per test. Escalate calibration changes to the parent for stable-baseline evidence and an explicit recorded policy decision.

## 9. Completion Contract

Return candidate findings, artifact paths, command/configuration, result, and concerns. The parent assigns new IDs, severity, status, resolutions, shared reports, state, decisions, and handoff.
