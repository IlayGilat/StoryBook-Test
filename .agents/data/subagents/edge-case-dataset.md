# Edge-Case Dataset Sub-Agent

## 1. Goal

Implement deterministic, schema-valid datasets for every supported empty and boundary state in the data contract.

## 2. When Parent Should Use It

Use after schema/factory integration and after the parent identifies required edge states.

## 3. Inputs

- Approved schema/factories and edge-state entries from `data-contract.json`
- UI input constraints relevant to empty, optional/null, Unicode, special-character, and long-string rendering

## 4. Outputs

- Assigned edge dataset APIs/edits
- Coverage table naming each edge, seed/count, and schema result

## 5. Allowed Scope

Write only the assigned edge-dataset region in component data files.

## 6. Forbidden Scope

Invalid values presented as edge cases, unsupported nulls, random/time-dependent content, stress generation, UI/harness/tests, state/log/handoff.

## 7. Procedure

1. Enumerate contract-supported empty, optional/null, boundary numeric, Unicode/special-character, and maximum practical string states.
2. Produce minimal deterministic variants using approved factories or explicit schema-valid overrides.
3. Parse every complete variant through the dataset schema.
4. Report unsupported requested states rather than weakening schemas.

## 8. Checks & Verification

Require exact coverage of the assigned edge list, repeated deep equality, and schema success for every exported variant; verify empty means zero records.

## 9. Return Condition

Return `COMPLETED` with coverage evidence only when all supported edges are valid and deterministic; otherwise `BLOCKED` or `FAILED` precisely.
