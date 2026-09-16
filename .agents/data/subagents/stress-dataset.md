# Stress Dataset Sub-Agent

## 1. Goal

Implement parameterized deterministic generation and validation for exact 1k, 10k, and 100k stress volumes.

## 2. When Parent Should Use It

Use after approved schemas and bounded deterministic factories exist.

## 3. Inputs

- Dataset schema, record factories, and `DataGeneratorService` contract
- Required fixed seed and stress counts `1_000`, `10_000`, and `100_000`

## 4. Outputs

- Assigned stress generation API/edit
- Count, schema, determinism, identity/order, and timing results for all three volumes

## 5. Allowed Scope

Write only the assigned stress-dataset region in component data files; use existing benchmark data-generator infrastructure.

## 6. Forbidden Scope

Skipping whole-array validation, truncating 100k, unseeded randomness, quadratic generation, caches with hidden state, UI/harness/tests, state/log/handoff.

## 7. Procedure

1. Implement count-parameterized generation through the approved schema/factory path.
2. Generate exactly 1k, 10k, and 100k using the fixed seed.
3. Validate complete arrays and verify stable unique IDs/order.
4. Measure generation plus parsing and report scaling without weakening correctness.

## 8. Checks & Verification

Require exact counts, full-schema success, deep equality for repeated equal-seed runs, and recorded timings; flag gross non-linearity or failure of the repository target under one second per 10k in the validation environment.

## 9. Return Condition

Return `COMPLETED` only when all three volumes, including 100k, pass; otherwise `FAILED` with the failing count, command, time, or validation output.
