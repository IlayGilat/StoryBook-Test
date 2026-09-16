---
description: "Implement deterministic, index-stable record factories using repository `DataFactory` and seeded-random contracts."
mode: subagent
---

# Data Factory Sub-Agent

## 1. Goal

Implement deterministic, index-stable record factories using repository `DataFactory` and seeded-random contracts.

## 2. When Parent Should Use It

Use after integrated TypeScript models and Zod schemas exist.

## 3. Inputs

- Assigned models/schemas and contract semantics
- `src/benchmark/data-generator/` types/utilities directly required by the factory
- Existing generated `<component>.factory.ts`

## 4. Outputs

- Assigned factory functions and documented identity/seed behavior
- Determinism and schema-validation evidence for representative records

## 5. Allowed Scope

Write only `src/components/<component>/data/<component>.factory.ts` or its assigned non-overlapping region.

## 6. Forbidden Scope

`Math.random()`, clock/locale/global mutable state, unbounded work, schemas/models/UI/harness/tests, state/log/handoff, and invented business semantics.

## 7. Procedure

1. Implement one pure factory per required entity using `(index, random)`.
2. Derive stable IDs/order from index and seeded variation only from the supplied random source.
3. Keep nested generation bounded and total work linear in requested records.
4. Validate representative factory results with the approved schemas.

## 8. Checks & Verification

Run the same index sequence twice with equal seeds and require deep equality; require seeded fields to differ for a different seed where applicable; verify schema success and stable unique identities.

## 9. Return Condition

Return `COMPLETED` with files and checks only when factories are pure, deterministic, bounded, and valid; otherwise `FAILED` with evidence.
