---
name: create-benchmark-harness
description: Create the benchmark smart container while preserving the shared readiness, race, sizing, and paint contract.
---

# Create Benchmark Harness

## When to use

Use in the Harness stage after validated UI and deterministic data artifacts exist.

## Inputs

- UI root inputs/outputs, data factory/schema, component registry identity, and `src/benchmark/harness/benchmark-container.ts`.

## Outputs

- `src/components/<component>/harness/<component>.container.ts` wired to UI and data.
- Harness validation evidence.

## Procedure

1. Extend `BaseBenchmarkContainerComponent<T>` and set the exact registered `componentName`.
2. Inject the data generator and implement `generateDataset(size)` using the component schema/factory.
3. Implement `onDataGenerated(data)` to update the root UI inputs without application services.
4. Wire UI output intents to deterministic local harness actions required by the story/tests.
5. Preserve base host attributes, size-event listener, generation race guard, errors, `markForCheck`, and double-`requestAnimationFrame` readiness cycle.
6. Render zero and representative sizes; verify rapid size changes cannot publish stale data.

## Constraints

- Do not reimplement or bypass the base readiness lifecycle.
- Do not add network/store/router dependencies to presentational UI.
- Do not alter shared benchmark infrastructure unless explicitly assigned.

## Stop conditions

Stop when the container compiles, renders validated data, exposes correct ready/busy/error states, and passes focused harness checks.
