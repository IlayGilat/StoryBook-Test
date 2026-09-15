---
name: create-storybook-story
description: Create Storybook 8 CSF3 variants for a benchmark harness during the Harness stage.
---

# Create Storybook Story

## When to use

Use during the Harness stage after the container and deterministic data are ready.

## Inputs

- Harness component, required data-volume variants, and existing `src/components/*/harness/*.stories.ts` examples.

## Outputs

- `src/components/<component>/harness/<component>.stories.ts`.
- Storybook render validation evidence for the Harness handoff.

## Procedure

1. Define typed CSF3 metadata whose `component` is the harness container.
2. Set `parameters: { layout: 'fullscreen' }` and deterministic default args, including dataset size when exposed.
3. Register only necessary presentation providers/decorators.
4. Define required stories/states without duplicating application services.
5. Build/open each story and verify readiness and console cleanliness.
6. Leave registry, performance-tracker, paint-cycle, sizing-event, and benchmark-configuration integration verification to Benchmark Integration.

## Constraints

- Do not target the dumb UI component directly for benchmark stories.
- Do not use nondeterministic loaders, network calls, arbitrary delays, or app-wide decorators.
- Do not change unrelated stories.

## Stop conditions

Stop when Storybook builds and every required fullscreen harness variant renders cleanly and reaches ready state.
