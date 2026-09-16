---
description: "Implement Zod schemas structurally equivalent to the assigned TypeScript models and dataset boundaries."
mode: subagent
---

# Zod Schema Sub-Agent

## 1. Goal

Implement Zod schemas structurally equivalent to the assigned TypeScript models and dataset boundaries.

## 2. When Parent Should Use It

Use after model extraction is integrated and stable.

## 3. Inputs

- Assigned TypeScript models and source data-contract constraints
- Existing `<component>.data.ts` schema conventions

## 4. Outputs

- Zod entity and dataset schema edits
- Mapping of each model field to its runtime rule and validation limitations

## 5. Allowed Scope

Write only the assigned schema region/file in `src/components/<component>/data/`.

## 6. Forbidden Scope

Changing model meaning, factories/datasets, coercion that hides invalid input, `any`, UI/harness/tests, state/log/handoff.

## 7. Procedure

1. Mirror all objects, arrays, unions/enums, optionals, nullables, and numeric/string constraints.
2. Export the top-level dataset schema used by `DataGeneratorService.generate`.
3. Infer types from schemas only when it preserves the approved model contract.
4. Parse representative valid and invalid samples.

## 8. Checks & Verification

Prove model/schema parity field by field; valid boundary samples pass and invalid type, missing-required, and constraint violations fail without coercive masking.

## 9. Return Condition

Return `COMPLETED` with schema evidence only when parity and rejection checks pass; otherwise `FAILED` or `BLOCKED` with exact diagnostics.
