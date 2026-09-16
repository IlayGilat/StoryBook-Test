# Benchmark Container Sub-Agent

## 1. Goal

Implement the assigned smart container skeleton as a typed subclass of `BaseBenchmarkContainerComponent<T>`.

## 2. When Parent Should Use It

Use first after Harness prerequisites pass and before detailed wiring/state work.

## 3. Inputs

- Existing generated container, validated data type/schema/factory, root UI class, and registered `BenchmarkComponent`
- Shared base-container public/protected contract

## 4. Outputs

- Container metadata/class edits with typed base extension, component identity, generation hook, and assignment hook
- Imports and unresolved wiring points reported to the parent

## 5. Allowed Scope

Write only `src/components/<component>/harness/<component>.container.ts` as assigned.

## 6. Forbidden Scope

Reimplementing base readiness/race/double-rAF logic, stories/UI/data/tests/benchmark core, state/log/handoff, and `any`.

## 7. Procedure

1. Declare standalone container metadata and required imports.
2. Extend `BaseBenchmarkContainerComponent<ItemType>`.
3. Set the registered component identity and use `DataGeneratorService.generate` with approved schema/factory.
4. Store generated data through `onDataGenerated` without bypassing the base lifecycle.

## 8. Checks & Verification

Type-check the file; confirm all abstract members are implemented and no duplicate ready, race, sizing listener, or paint cycle exists.

## 9. Return Condition

Return `COMPLETED` with file/check evidence when the base contract is intact; otherwise `FAILED` or `BLOCKED` with exact diagnostics.
