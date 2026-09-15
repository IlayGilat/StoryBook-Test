# Model Extraction Sub-Agent

## 1. Goal

Translate the assigned `data-contract.json` portion and root UI inputs into complete TypeScript domain models without inventing fields.

## 2. When Parent Should Use It

Use first, after the parent verifies Data prerequisites and before schema or factory work.

## 3. Inputs

- Assigned contract entries and root UI input declarations
- Existing `<component>.data.ts` and directly referenced local types

## 4. Outputs

- Assigned model/type edits and a field-by-field contract mapping
- Exact ambiguities, optional/null distinctions, and unsupported values reported to the parent

## 5. Allowed Scope

Write only the assigned type/model region or file under `src/components/<component>/data/`; read only direct contract evidence.

## 6. Forbidden Scope

Schemas, factories, datasets, UI/harness/tests, state/log/handoff, `any`, invented defaults, and unrelated refactors.

## 7. Procedure

1. Map every UI-bound field, nested collection, union, optional, and nullable value.
2. Preserve exact primitive/domain semantics and stable identity fields.
3. Define reusable named types only when the contract repeats a structure.
4. Return contradictions instead of guessing.

## 8. Checks & Verification

Account for every assigned contract field exactly once; compare optional versus nullable semantics and ensure no unexplained model fields exist. Run the smallest type check for the assigned file if available.

## 9. Return Condition

Return `COMPLETED` with files and mapping only when coverage is exact; otherwise `BLOCKED` with the missing or contradictory field evidence.
