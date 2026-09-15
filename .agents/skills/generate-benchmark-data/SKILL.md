---
name: generate-benchmark-data
description: Implement deterministic, Zod-validated benchmark data using the repository data-generator service.
---

# Generate Benchmark Data

## When to use

Use in the Data stage after `data-contract.json` is approved and the migrated UI contract is stable.

## Inputs

- `data-contract.json`, planned files, and repository patterns under `src/benchmark/data-generator/` and `src/components/*/data/`.

## Outputs

- Component TypeScript types/Zod schemas and deterministic factory under `src/components/<component>/data/`.
- Data-stage validation evidence.

## Procedure

1. Implement strict types and Zod schemas matching the approved contract.
2. Implement an index-and-seeded-random factory with stable IDs and fidelity-relevant value distributions.
3. Generate through `DataGeneratorService.generate(...)`; preserve chunking, abort checks, event-loop yielding, and complete-result validation.
4. Cover zero, small, configured benchmark, and maximum supported sizes, including contract edge cases.
5. Verify identical seed/count produce identical data and invalid data fails schema validation.
6. Run focused type/build/tests and record exact results.

## Constraints

- No `Math.random()`, current time, network, mutable global seed, unvalidated output, or UI/harness changes.
- Do not reduce the required maximum dataset size.
- Follow existing file layout and naming.

## Stop conditions

Stop when generation is deterministic, schema-valid, responsive at configured sizes up to 100,000 items, and focused validation passes.
