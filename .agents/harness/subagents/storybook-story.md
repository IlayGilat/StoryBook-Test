# Storybook Story Sub-Agent

## 1. Goal

Author Harness-owned Storybook 8 CSF3 variants and measured `play` interactions targeting the smart container.

## 2. When Parent Should Use It

Use after the container and lifecycle checks pass.

## 3. Inputs

- Completed container, registered identity, required default/edge/medium/10k/100k datasets
- Global performance tracker interaction contract and representative UI actions

## 4. Outputs

- `src/components/<component>/harness/<component>.stories.ts`
- Variant inventory and measured-play/runtime verification summary

## 5. Allowed Scope

Write only the component story file; read the container and direct tracker/types needed for CSF3.

## 6. Forbidden Scope

Container/UI/data/test/core edits, stories targeting dumb UI, fixed sleeps, direct timing loops that bypass `runInteraction`, state/log/handoff.

## 7. Procedure

1. Define typed CSF3 meta targeting the container with `parameters: { layout: 'fullscreen' }`.
2. Add named default, edge, medium, 10k, and 100k variants using controlled args.
3. In measured `play`, await ready state and require `window.__storybookPerfTracker`.
4. Route representative actions through `tracker.runInteraction(...)` and restore state when isolation requires it.

## 8. Checks & Verification

Build/render all variants; require exact sizes, clean runtime, container target, fullscreen layout, readiness before measurement, and tracker-routed play execution.

## 9. Return Condition

Return `COMPLETED` with story/build/runtime evidence only when every required variant passes; otherwise `FAILED` with exact story and diagnostics.
