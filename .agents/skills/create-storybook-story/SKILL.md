---
name: create-storybook-story
description: Create a Storybook 8 CSF3 story targeting a benchmark harness and using the shared performance tracker.
---

# Create Storybook Story

## When to use

Use during Benchmark Integration after the harness and component registry identity are ready.

## Inputs

- Harness component, registry identity, interaction requirements, and existing `src/components/*/harness/*.stories.ts` examples.

## Outputs

- `src/components/<component>/harness/<component>.stories.ts`.
- Storybook render/interaction validation evidence.

## Procedure

1. Define typed CSF3 metadata whose `component` is the harness container.
2. Set `parameters: { layout: 'fullscreen' }` and deterministic default args, including dataset size when exposed.
3. Register only necessary presentation providers/decorators.
4. Define required stories/states without duplicating application services.
5. Route measured play interactions through `window.__storybookPerfTracker.runInteraction(...)` using the registered identity.
6. Build/open the story, verify readiness, console cleanliness, and interaction completion.

## Constraints

- Do not target the dumb UI component directly for benchmark stories.
- Do not use nondeterministic loaders, network calls, arbitrary delays, or app-wide decorators.
- Do not change unrelated stories.

## Stop conditions

Stop when Storybook builds, the fullscreen harness story reaches ready state, and all declared interactions complete through the tracker.
